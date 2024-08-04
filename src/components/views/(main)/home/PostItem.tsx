import UserAvatar from "@/components/layout/UserAvatar"
import { PostData } from "@/lib/types"
import { formatRelativeDate } from "@/lib/utils"
import Link from "next/link"


interface PostItemProps {
    post: PostData
}

export default function PostItem({ post }: PostItemProps) {
    return (
        <article className="space-y-3 rounded-[8px] bg-card p-5 shadow-sm">
            <div className="flex flex-wrap gap-3 items-center">
                <Link href={`/user/${post.user.username}`} >
                    <UserAvatar avatarUrl={post.user.avatarUrl} className="w-full h-full max-w-[40px]" />
                </Link>
                <div>
                    <Link href={`/user/${post.user.username}`} className="block font-medium hover:underline">
                        {post.user.displayName}
                    </Link>
                    <Link href={`/post/${post.id}`} className="block text-sm text-muted-foreground hover:underline">
                        {formatRelativeDate(post.createdAt)}
                    </Link>
                </div>
            </div>
            <div className="whitespace-pre-line break-words text-gray-700 dark:text-white/80">
                {post.content} 
            </div>
        </article>
    )
}
