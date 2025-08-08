import Ping from "@/components/Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import {after} from 'next/server'


export default async function View({id}:{id:string}){
    const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });
     
    var marker :string;
    if(totalViews == 1) marker="View"
    else marker="Views"

    after(
      async() => await writeClient
          .patch(id)
          .set({views :totalViews+1})
          .commit(),
    );

    return (
        <div className="bg-gray-100 rounded-lg view-container">
          <div className="absolute -top-2 -right-2">
            <Ping />
          </div>
    
          <p className="view-text">
            <span className="text-gray-800">{totalViews} {marker}</span>
          </p>
        </div>
      );
}

