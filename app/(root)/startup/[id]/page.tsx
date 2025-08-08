import React, { Suspense } from "react";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import {
    STARTUP_BY_ID_QUERY,
  } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client"; 
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";


export const experimental_ppr = true 
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const md = markdownit()
  const post =await client.fetch(STARTUP_BY_ID_QUERY,{id}) 
  if(!post ) return notFound();

  const parsedData = md.render(post?.pitch || "")

  return (
    <div>
      <section className="pink_container bg-[#87CEFA] pattern !min-h-[280px]">
      <p className="bg-gray-300 tag-tri tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <h1 className="sub-heading !max-w-5xl">{post.description}</h1>
      </section>
      <section className="section_container">
        <img src={post.image} alt="thumbnail" className="w-full h-[auto] max-h-[400px] object-cover rounded-xl"></img>
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
            <div className="flex-between gap-5">
                <Link href={`/user/${post.author._id}`} className="flex gap-2 items-center mb-3">
                    <Image src={post.author.image || "/default-avatar.png"} alt="avatar" width={64} height={64} className="rounded-full drop-shadow-lg"/>
                    <div>
                    <p className="font-medium text-[20px] text-black dark:text-white">{post.author.name}</p>
                    <p className="font-medium text-[16px] text-black dark:text-white">@{post.author.username}</p>
                    </div>
                </Link>
                <p className="category-tag text-gray-600 dark:text-gray bg-sky-200">{post.category}</p>

            </div>
      </div>
      <h3 className="mt-5 text-30-bold">Pitch Details</h3>
      {parsedData ? (
        <article className="prose max-w-5xl font-work-sans break-words"
        dangerouslySetInnerHTML={{__html:parsedData}}/>
      ):(<p className="no-result">No details Provided</p>)}
      <hr className="divider" />


      <Suspense fallback={<Skeleton className="view_skeleton bg-[#EE2B69]"/>}>
         <View id={id}/>
      </Suspense>
      </section>
    </div>

  );
}
