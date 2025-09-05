"use client"

import UserAvatar from "@/components/layout/UserAvatar"
import { useSession } from "@/context/SessionProvider"
import { PostData } from "@/lib/types"
import { cn, formatRelativeDate } from "@/lib/utils"
import Link from "next/link"
import PostMoreButton from "./PostMoreButton"
import Linkify from "./Linkify"
import UserTooltip from "./UserTooltip"
import { Media } from "@prisma/client"
import Image from "next/image"
import LikeButton from "./LikeButton"
import BookmarkButton from "./BookmarkButton"


interface PostItemProps {
    post: PostData
}

export default function PostItem({ post }: PostItemProps) {
    const { user } = useSession()

    return (
        <article className="group/post space-y-3 rounded-[8px] bg-card p-5 shadow-sm">
            <div className="flex justify-between gap-3">
                <div className="flex flex-wrap gap-3 items-center">
                    <UserTooltip user={post.user}>
                        <Link href={`/user/${post.user.username}`} >
                            <UserAvatar avatarUrl={post.user.avatarUrl} className="w-full h-full max-w-[40px]" />
                        </Link>
                    </UserTooltip>
                    <div>
                        <UserTooltip user={post.user}>
                            <Link href={`/users/${post.user.username}`} className="block font-medium hover:underline">
                                {post.user.displayName}
                            </Link>
                        </UserTooltip>
                        <Link href={`/posts/${post.id}`} className="block text-sm text-muted-foreground hover:underline" suppressHydrationWarning>
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
            {!!post.attachments.length && (
                <MediaPreviews
                    attachments={post.attachments}
                />
            )}
            <hr className="text-muted-foreground" />
            <div className="flex justify-between gap-5 ">
                <LikeButton
                    postId={post.id}
                    initialState={{
                        likes: post._count.likes,
                        isLikedByUser: post.likes.some(like => like.userId === user.id)
                    }}
                />

                <BookmarkButton
                    postId={post.id}
                    initialState={{
                        isBookmarkedByUser: post.bookmark.some(bookmark => bookmark.userId === user.id)
                    }}
                />

            </div>
        </article>
    )
}

interface MediaPreviewsProps {
    attachments: Media[]
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
    return (
        <div className={cn("flex flex-col gap-3", attachments.length > 1 && 'sm:grid sm:grid-cols-2')}>
            {attachments.map(a => (
                <MediaPreview key={a.id} media={a} />
            ))}
        </div>
    )
}

interface MediaPreviewProps {
    media: Media
}
function MediaPreview({ media }: MediaPreviewProps) {
    if (media.type === 'IMAGE') {
        return <Image
            src={media.url}
            alt="Attachment"
            width={500}
            height={500}
            className="mx-auto size-fit rounded-xl max-h-[30rem]"
        />
    }
    if (media.type === 'VIDEO') {
        return <div>
            <video
                src={media.url}
                controls
                className="mx-auto size-fit rounded-xl max-h-[30rem]"
            />
        </div>
    }
    return <p className="text-destructive">
        Unsupported media type
    </p>
}