import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error('Non autorisé');
      return { userId: session.user?.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // UploadThing v7+ : ufsUrl remplace url
      const url = (file as unknown as { ufsUrl?: string }).ufsUrl ?? file.url;
      console.log('Upload terminé pour:', metadata.userId, '— URL:', url);
      return { url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
