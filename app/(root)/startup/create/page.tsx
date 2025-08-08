import React from "react";
import {StartupForm} from "@/components/StartupForm";
import { auth, signOut, signIn } from "@/auth";
import { redirect } from "next/navigation";
export default async function Home(){
    const session = await auth()
    if(!session) redirect("/")
    return (
        <>
        <section className="pink_container !min-h-[240px] bg-[#87CEFA] pattern">
            <h1 className="heading">Submit Your Startup Pitch</h1>
        </section>

        <StartupForm/>
        </>
    )
}