import Navbar from "@/components/Navbar";
import SearchForm from "@/components/SearchForm"
import StartupCard, { StartupTypeCard } from "@/components/StartupCard"
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { auth, signOut, signIn } from "@/auth";

export default async function Page({searchParams}: 
    {searchParams : Promise<{query?:string}>}
){
    const query = (await searchParams).query;
    const params ={search :query || null};

    const session = await auth();
    if (session) {
        console.log(session.id);
    }
    else (console.log("Session : null"))

    const {data:posts} =await sanityFetch({query:STARTUPS_QUERY,params});
    return (
        <div>
            <section className="pink_container bg-[#87CEFA] pattern ">
            <h1 className="heading ">Build Your Startup,<br/>Connect with Entrepreneurs</h1>
            <p className="sub-heading !max-w-3xl">Submit Ideas,Vote on Pitches,and Get Noticed in Virtual Competitions</p>
            <SearchForm query={query!}/>
            </section>

            <section className="section-container">
                <p className="my-6 mx-10 text-30-semibold ">{
                    query?`Search Results for "${query}"`:"All Startups"
                }</p>
            <ul className="card_grid">
                {posts?.length > 0 ? (
                   posts.map((post : StartupTypeCard ,index:number)=>(
                    <StartupCard key={post._id} post={post}/> 
                   ))
                ): (<p className="no-results mx-10">No Startups found!</p>)}
            </ul>
            </section>
            <SanityLive/>
        </div>
    );
}