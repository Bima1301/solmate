import { validateRequest } from '@/auth';
import streamServerClient from '@/lib/get-stream';
import prisma from '@/lib/prisma';
import { createUploadthing, FileRouter } from 'uploadthing/next'
import { UploadThingError, UTApi } from 'uploadthing/server';

const f = createUploadthing();

// Helper function to extract file key from URL
function extractFileKey(url: string): string {
    // Handle both development (utfs.io) and production (APP_ID.ufs.sh) URLs
    if (url.includes('utfs.io')) {
        // Development: https://utfs.io/a/APP_ID/file-key
        return url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1];
    } else {
        // Production: https://APP_ID.ufs.sh/a/APP_ID/file-key
        return url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1];
    }
}

// Helper function to convert file URL to app URL
function convertToAppUrl(fileUrl: string): string {
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        // Development: convert /f/ to /a/APP_ID/
        return fileUrl.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`);
    } else {
        // Production: URL is already in correct format, just replace /f/ with /a/
        return fileUrl.replace("/f/", "/a/");
    }
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
            const oldAvatarUrl = metadata.user.avatarUrl;

            // Delete old avatar if exists
            if (oldAvatarUrl) {
                try {
                    const key = extractFileKey(oldAvatarUrl);
                    if (key) {
                        await new UTApi().deleteFiles(key);
                    }
                } catch (error) {
                    console.error('Error deleting old avatar:', error);
                    // Continue execution even if deletion fails
                }
            }

            // Convert to app URL
            const newAvatarUrl = convertToAppUrl(file.url);

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
            ]);

            return { avatarUrl: newAvatarUrl };
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
            // Convert to app URL
            const mediaUrl = convertToAppUrl(file.url);

            const media = await prisma.media.create({
                data: {
                    url: mediaUrl,
                    type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO'
                }
            });

            return { mediaId: media.id };
        })
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;