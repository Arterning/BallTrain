import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/app/lib/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Image uploader - accepts up to 10 images, max 4MB each
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      // Check authentication
      const session = await auth();

      if (!session?.user) {
        throw new Error("未授权");
      }

      // Pass user ID through to onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log upload completion
      console.log("Image upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return data to the client
      return { url: file.url };
    }),

  // Video uploader - accepts up to 5 videos, max 32MB each
  videoUploader: f({
    video: { maxFileSize: "32MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      // Check authentication
      const session = await auth();

      if (!session?.user) {
        throw new Error("未授权");
      }

      // Pass user ID through to onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log upload completion
      console.log("Video upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return data to the client
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
