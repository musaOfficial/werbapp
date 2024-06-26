import { model, models, Schema } from 'mongoose';

export interface IUser{
    clerkId: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    coins: Number,
    // winnings: [Winning]
}

const UserSchema = new Schema<IUser>(
    {
        clerkId: String,
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        coins: Number,
        // winnings: [WinningSchema]
    },
    {
        timestamps: true,
    },
);

const User = models.User || model("User", UserSchema);

export default User;

