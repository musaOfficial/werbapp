import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createOrUpdateUser } from '@/actions/user'
import connectMongo from '@/utils/connectMongo'
import { CreateUserDTO } from '@/dto/CreateUserDTO'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import { HttpStatusCode } from 'axios'
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const { id  } = evt.data;
  const eventType = evt.type;
 
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  if(eventType === "user.created" || eventType === "user.updated"){
    
    const { id, email_addresses, first_name, last_name } = evt?.data;
    try {
        try {
            await connectMongo();
            console.log("MongoDB connected successfully")
            const { id, email_addresses, first_name, last_name } = evt?.data;
            console.log("body created")
            const user = await User.findOneAndUpdate(
                {
                    clerkId: id
                },
                {
                    $set:{
                        email: email_addresses[0].email_address,
                        firstName: first_name,
                        lastName: last_name
                    }
                },
                {
                    upsert: true,
                    new: true
                }
            );
            console.log("user created")
            return NextResponse.json(
                { user, message: 'Your user has been created' },
                { status: HttpStatusCode.Created },
            );
            return NextResponse.json({ message: 'Product name is missing' }, { status: HttpStatusCode.BadRequest });
        } catch (error) {
            return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
        }
    } catch (error) {
        return new Response("Error occured" + error);
    }
  }
 
  return new Response('', { status: 200 })
}
 