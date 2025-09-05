import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude, PostsPage } from "@/lib/types"
import { NextRequest } from "next/server"

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

        const { user } = await validateRequest()

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId: user.id
            },
            include: {
                post: {
                    include: getPostDataInclude(user.id)
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: PAGE_SIZE + 1,
            cursor: cursor ? { id: cursor } : undefined

        })

        const nextCursor = bookmarks.length > PAGE_SIZE ? bookmarks[PAGE_SIZE].id : null

        const data: PostsPage = {
            posts: bookmarks.slice(0, PAGE_SIZE).map(b => b.post),
            nextCursor
        };

        return Response.json(data);
    } catch (error) {
        console.error(error)
        return Response.json({ error: "An error occurred" }, { status: 500 })
    }
}