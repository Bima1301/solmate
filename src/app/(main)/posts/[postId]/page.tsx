import { validateRequest } from "@/auth"
import UserAvatar from "@/components/layout/UserAvatar"
import FollowButton from "@/components/views/(main)/home/FollowButton"
import Linkify from "@/components/views/(main)/home/Linkify"
import PostItem from "@/components/views/(main)/home/PostItem"
import UserTooltip from "@/components/views/(main)/home/UserTooltip"
import prisma from "@/lib/prisma"
import { getPostDataInclude, UserData } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"

interface PageProps {
    params: { postId: string }
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: getPostDataInclude(loggedInUserId)
    })

    if (!post) notFound()

    return post
})

export async function generateMetadata({ params: { postId } }: PageProps): Promise<Metadata> {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) return {}

    const post = await getPost(postId, loggedInUser.id)

    return {
        title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
    }
}

export default async function Page({ params: { postId } }: PageProps) {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
        return <p className="text-destructive">
            Yo&apos;re not authorized to view this page.
        </p>
    }

    const post = await getPost(postId, loggedInUser.id)

    return <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
            <PostItem post={post} />
        </div>
        <div
            className="sticky top-[88px] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80"
        >
            <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
                <UserInfoSidebar
                    user={post.user}
                />
            </Suspense>
        </div>
    </main>

}

interface UserInfoSidebarProps {
    user: UserData
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) return null

    return <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">
            About This User
        </div>
        <UserTooltip
            user={user}
        >
            <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3"
            >
                <UserAvatar
                    avatarUrl={user.avatarUrl}
                    className="flex-none size-12"
                />
                <div>
                    <p className="line-clamp-1 break-all font-semibold hover:underline">
                        {user.displayName}
                    </p>
                    <p className="line-clamp-1 break-all text-muted-foreground">
                        @{user.username}
                    </p>
                </div>
            </Link>
        </UserTooltip>
        <Linkify>
            <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
                {user.bio}
            </div>
        </Linkify>
        {user.id !== loggedInUser.id && (
            <FollowButton
                userId={user.id}
                initialState={{
                    followers: user._count.followers,
                    isFollowedByUser: user.followers.some(({ followerId }) => followerId === loggedInUser.id)
                }}
            />
        )}
    </div>
}   