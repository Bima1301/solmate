import { validateRequest } from '@/auth';
import streamServerClient from '@/lib/get-stream';
import prisma from '@/lib/prisma';
import { createUploadthing, FileRouter } from 'uploadthing/next'
import { UploadThingError, UTApi } from 'uploadthing/server';

const f = createUploadthing();

// Helper function to convert ufs.sh URL to utfs.io format
function convertToUtfsUrl(url: string): string {
    // If it's already utfs.io, return as is
    if (url.includes('utfs.io')) {
        return url;
    }

    // Handle: https://1j6r7mq85w.ufs.sh/a/1b7a08e7-7a10-4f50-bae5-02a4bf3c6e69-ywgifp.webp
    // To:     https://utfs.io/a/1j6r7mq85w/1b7a08e7-7a10-4f50-bae5-02a4bf3c6e69-ywgifp.webp
    if (url.includes('.ufs.sh/a/')) {
        // Extract subdomain and file key
        const match = url.match(/^https:\/\/([^.]+)\.ufs\.sh\/a\/(.+)$/);
        if (match) {
            const subdomain = match[1];
            const fileKey = match[2];
            return `https://utfs.io/a/${subdomain}/${fileKey}`;
        }
    }

    // Handle: https://1j6r7mq85w.ufs.sh/f/216a36d6-ab35-4441-94de-c4e6b8f9710b-ybk1ai.png
    // To:     https://utfs.io/a/1j6r7mq85w/216a36d6-ab35-4441-94de-c4e6b8f9710b-ybk1ai.png
    if (url.includes('.ufs.sh/f/')) {
        const match = url.match(/^https:\/\/([^.]+)\.ufs\.sh\/f\/(.+)$/);
        if (match) {
            const subdomain = match[1];
            const fileKey = match[2];
            return `https://utfs.io/a/${subdomain}/${fileKey}`;
        }
    }

    return url;
}

export const fileRouter = {
    avatar: f({
        image: {
            maxFileSize: "512KB"
        }
    })
        .middleware(async () => {
            const { user } = await validateRequest();

            if (!user) {
                throw new UploadThingError("Unauthorized");
            }

            return { user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const oldAvatarUrl = metadata.user.avatarUrl

            if (oldAvatarUrl) {
                const key = oldAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]

                await new UTApi().deleteFiles(key)
            }

            // Convert the original URL to utfs.io format
            let newAvatarUrl = file.url.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)
            newAvatarUrl = convertToUtfsUrl(newAvatarUrl);

            await Promise.all([
                prisma.user.update({
                    where: { id: metadata.user.id },
                    data: { avatarUrl: newAvatarUrl }
                }),
                streamServerClient.partialUpdateUser({
                    id: metadata.user.id,
                    set: {
                        image: newAvatarUrl
                    }
                })
            ])

            return { avatarUrl: newAvatarUrl }
        }),
    attachment: f({
        image: { maxFileSize: '4MB', maxFileCount: 5 },
        video: { maxFileSize: '64MB', maxFileCount: 5 }
    })
        .middleware(async () => {
            const { user } = await validateRequest();

            if (!user) {
                throw new UploadThingError("Unauthorized");
            }

            return {};
        })
        .onUploadComplete(async ({ file }) => {
            // Use appUrl and convert to utfs.io format if needed
            const mediaUrl = convertToUtfsUrl(file.appUrl);

            const media = await prisma.media.create({
                data: {
                    url: mediaUrl,
                    type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO'
                }
            })
            return { mediaId: media.id }
        })
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter;