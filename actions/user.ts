import User from "@/models/User";
import connectMongo from "@/utils/connectMongo";
import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
export const createOrUpdateUser = async(id: String, email_addresses: Array<any>, first_name: String, last_name: String) => {
    try {
        await connectMongo();

        const user = await User.findOneAndUpdate(
            {
                clerkId: id
            },
            {
                $set: {
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

        throw new Error("I reached createOrUpdateUser");

        return NextResponse.json(
            { user, message: 'Your user has been created' },
            { status: HttpStatusCode.Created },
        );
    } catch (error) {
        console.log(error)
    }
}