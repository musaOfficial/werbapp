"use client"
import { currentUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export default async function Page(){

    const user = currentUser();
    const router = useRouter();

    return (
        <div>Onboarding...</div>
    )
}