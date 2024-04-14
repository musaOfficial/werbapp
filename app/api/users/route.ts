import { HttpStatusCode } from 'axios';
import connectMongo from '@/utils/connectMongo';
import User from '@/models/User';
import { CreateUserDTO } from '@/dto/CreateUserDTO';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        console.log("POST req activated")
        await connectMongo();
        console.log("MongoDB connected successfully")
        const body: CreateUserDTO = await req.json();
        console.log("body created")
        const user = await User.findOneAndUpdate(body, {upsert: true});
        console.log("user created")
        return NextResponse.json(
            { user, message: 'Your user has been created' },
            { status: HttpStatusCode.Created },
        );
        return NextResponse.json({ message: 'Product name is missing' }, { status: HttpStatusCode.BadRequest });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
    }
}
export async function GET() {
    try {
        await connectMongo();
        const users = await User.find();
        return NextResponse.json({ data: users });
    } catch (error) {
        return NextResponse.json({ error });
    }
}