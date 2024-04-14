"use client"
import { currentUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Clerk } from "@clerk/nextjs/server";
export default async function Page(){
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await fetch("https://werbapp.vercel.app/api/users", {
            method: "POST",
            headers: {
               "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                clerkId: user?.id,
                email: user?.emailAddresses[0].emailAddress,
                password: "aösdklfjaslkdf",
                firstName: user?.firstName,
                lastName: user?.lastName,
                coins: 10,
            })
        }).then(res => res.json());

        if(response.ok){
            router.replace("/");
        } else {
            console.log("Something went wrong")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Weiter zum Homepage</button>
        </form>
    )
}