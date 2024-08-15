import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { postDataInclude, PostsPage } from "@/lib/types"
import { NextRequest } from "next/server"

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

        const { user } = await validateRequest()

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const posts = await prisma.post.findMany({
            include: postDataInclude,
            orderBy: { createdAt: "desc" },
            take: PAGE_SIZE + 1,
            cursor: cursor ? { id: cursor } : undefined
        })

        const nextCursor = posts.length > PAGE_SIZE ? posts[PAGE_SIZE].id : null

        const data: PostsPage = {
            posts: posts.slice(0, PAGE_SIZE),
            nextCursor
        };

        return Response.json(data);
    } catch (error) {
        console.error(error)
        return Response.json({ error: "An error occurred" }, { status: 500 })
    }
}