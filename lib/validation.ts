import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(20).max(400),
  category: z.string().min(3).max(30),
  
  link: z.preprocess((val) => {
    // STEP 1: This function runs first to clean the data.
    if (typeof val === 'string') {
      const urlWithoutQuery = val.split('?')[0];
      return urlWithoutQuery;
    }
    return val;
  }, 
  // STEP 2: This is your original schema, which now runs on the CLEANED data.
  z.string().url()
    .refine((cleanedUrl) => {
      const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(cleanedUrl);
      const isGoogleDriveLink = cleanedUrl.includes("drive.google.com/file/d/");
      return hasImageExtension || isGoogleDriveLink;
    }, {
      message: "Please provide a direct image link (.jpg, .png) or a Google Drive share link.",
    })
    .transform((validatedUrl) => {
      if (validatedUrl.includes("drive.google.com/file/d/")) {
        const fileId = validatedUrl.split('/d/')[1].split('/')[0];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
      return validatedUrl;
    })
  ),

  pitch: z.string().min(10),
});