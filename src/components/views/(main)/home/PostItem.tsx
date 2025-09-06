"use client"

import UserAvatar from "@/components/layout/UserAvatar"
import { useSession } from "@/context/SessionProvider"
import { PostData } from "@/lib/types"
import { cn, formatRelativeDate } from "@/lib/utils"
import Link from "next/link"
import PostMoreButton from "./PostMoreButton"
import Linkify from "./Linkify"
import UserTooltip from "./UserTooltip"
import Image from "next/image"
import LikeButton from "./LikeButton"
import BookmarkButton from "./BookmarkButton"
import { AnimatePresence, motion } from "framer-motion"
import { itemVariants } from "@/lib/framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Comments, { CommentButton } from "../comments/Comments"
import { useState } from "react"
import { Media } from "@prisma/client"

interface PostItemProps {
    post: PostData
    index?: number
}

export default function PostItem({ post, index }: PostItemProps) {
    const { user } = useSession()
    const [showComments, setShowComments] = useState(false)

    return (
        <motion.article
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ delay: (index || 0) * 0.1 }}
            whileHover={{ y: -2 }}
            className="group/post"
        >
            <Card
                className={`border shadow-sm backdrop-blur-sm hover:shadow-lg transition-all duration-300 dark:border-slate-700 dark:bg-slate-800/90 dark:hover:shadow-slate-900/20 border-slate-200 bg-white/90`}
            >
                <CardHeader className="pb-3">
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
                                className={`transition-all duration-300 dark:hover:bg-slate-700 hover:bg-slate-100 opacity-0 group-hover/post:opacity-100`}
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="md:mt-4 mt-2">
                    <Linkify>
                        <div className="whitespace-pre-line break-words text-gray-700 dark:text-white/80 mb-4">
                            {post.content}
                        </div>
                    </Linkify>
                    <div className="mb-4">
                        {!!post.attachments.length && (
                            <MediaPreviews
                                attachments={post.attachments}
                            />
                        )}
                    </div>
                    <hr className="text-muted-foreground mb-4" />
                    <div className="flex justify-between gap-5 ">
                        <LikeButton
                            postId={post.id}
                            initialState={{
                                likes: post._count.likes,
                                isLikedByUser: post.likes.some(like => like.userId === user.id)
                            }}
                        />
                        <CommentButton
                            post={post}
                            onClick={() => setShowComments(!showComments)}
                        />
                        <BookmarkButton
                            postId={post.id}
                            initialState={{
                                isBookmarkedByUser: post.bookmarks.some(bookmark => bookmark.userId === user.id)
                            }}
                        />

                    </div>
                    <AnimatePresence>
                        {showComments && (
                            <Comments
                                post={post}
                            />
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.article>
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