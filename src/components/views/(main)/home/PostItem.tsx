"use client"

import UserAvatar from "@/components/layout/UserAvatar"
import { useSession } from "@/context/SessionProvider"
import { PostData } from "@/lib/types"
import { formatRelativeDate } from "@/lib/utils"
import Link from "next/link"
import PostMoreButton from "./PostMoreButton"
import Linkify from "./Linkify"


interface PostItemProps {
    post: PostData
}

export default function PostItem({ post }: PostItemProps) {
    const { user } = useSession()

    return (
        <article className="group/post space-y-3 rounded-[8px] bg-card p-5 shadow-sm">
            <div className="flex justify-between gap-3">
                <div className="flex flex-wrap gap-3 items-center">
                    <Link href={`/user/${post.user.username}`} >
                        <UserAvatar avatarUrl={post.user.avatarUrl} className="w-full h-full max-w-[40px]" />
                    </Link>
                    <div>
                        <Link href={`/users/${post.user.username}`} className="block font-medium hover:underline">
                            {post.user.displayName}
                        </Link>
                        <Link href={`/posts/${post.id}`} className="block text-sm text-muted-foreground hover:underline">
                            {formatRelativeDate(post.createdAt)}
                        </Link>
                    </div>
                </div>
                {post.user.id == user.id && (
                    <PostMoreButton
                        post={post}
                        className="opacity-0 transition-opacity group-hover/post:opacity-100"
                    />
                )}
            </div>
            <Linkify>
                <div className="whitespace-pre-line break-words text-gray-700 dark:text-white/80">
                    {post.content}
                </div>
            </Linkify>
        </article>
    )
}
