import React from "react";
import { StartupForm } from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateStartupPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    // 1. Use a <main> tag for the primary content of the page.
    // 2. Add a background color to make the form easy to style.
    <main className="bg-white dark:bg-white min-h-screen">
      <section className="w-full flex justify-center items-center flex-col min-h-[240px] bg-[#87CEFA] pattern">
        <h1 className="heading">Submit Your Startup Pitch</h1>
      </section>

      {/* 3. Wrap the form in a standard container for consistent padding */}
      <div className="section_container">
        <StartupForm />
      </div>
    </main>
  );
}