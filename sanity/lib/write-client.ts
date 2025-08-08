import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId,token } from '../env'
import "server-only"

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token, 
});

if(!writeClient.config().token){
    throw new Error("Write token not Found!")
}