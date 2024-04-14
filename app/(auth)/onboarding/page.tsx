"use client"
import { currentUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export default async function Page(){

    const user = currentUser();
    const router = useRouter();

    async function handleSubmit(){
        const response = await fetch("https://werbapp.vercel.app/api/webhooks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })

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