import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

const PAGE_SIZE = 5;

export async function GET(req: NextRequest,
    { params: { postId } }: { params: { postId: string } }
) {
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

        const { user: loggedInUser } = await validateRequest()

        if (!loggedInUser) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId
            },
            include: getCommentDataInclude(loggedInUser.id),
            orderBy: { createdAt: "asc" },
            take: -PAGE_SIZE - 1,
            cursor: cursor ? { id: cursor } : undefined
        })

        const previousCursor = comments.length > PAGE_SIZE ? comments[0].id : null

        const data: CommentsPage = {
            comments: comments.length > PAGE_SIZE ? comments.slice(1) : comments,
            previousCursor
        }

        return Response.json(data)

    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}