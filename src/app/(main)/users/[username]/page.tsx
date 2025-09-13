import { validateRequest } from "@/auth"
import UserAvatar from "@/components/layout/UserAvatar"
import FollowerCount from "@/components/secondary/FollowerCount"
import EditProfileButton from "@/components/views/(main)/home/EditProfileButton"
import FollowButton from "@/components/views/(main)/home/FollowButton"
import Linkify from "@/components/views/(main)/home/Linkify"
import UserPosts from "@/components/views/(main)/users/UserPosts"
import prisma from "@/lib/prisma"
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import { formatDate } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"

interface PageProps {
    params: { username: string }
}

const getUser = cache(async (username: string, logedInUserId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: "insensitive"
            }
        },
        select: getUserDataSelect(logedInUserId)
    })

    if (!user) notFound()

    return user
})

export async function generateMetadata({ params: { username } }: PageProps): Promise<Metadata> {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) return {}

    const user = await getUser(username, loggedInUser.id)

    return {
        title: `${user.displayName} (@${user.username})`,
    }
}

export default async function Page({ params: { username } }: PageProps) {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
        return <p className="text-destructive">
            Yo&apos;re not authorized to view this page.
        </p>
    }

    const user = await getUser(username, loggedInUser.id)


    return (
        <div className=" w-full min-w-0 space-y-5">
            <Suspense fallback={<UserProfileSkeleton />}>
                <UserProfile user={user} loggedInUserId={loggedInUser.id} />
            </Suspense>
            <div className="rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
                <h2 className="text-center text-2xl font-bold">
                    {user.displayName}&apos;s Posts
                </h2>
            </div>
            <UserPosts userId={user.id} />
        </div>
    )
}

interface UserProfileProps {
    user: UserData,
    loggedInUserId: string
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
    const followerInfo: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: user.followers.some(follower => follower.followerId === loggedInUserId)
    }

    return (
        <div className="h-fit w-full space-y-5 rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
            <UserAvatar avatarUrl={user.avatarUrl} size={250} className="mx-auto size-full max-h-60 max-w-60 rounded-full" />
            <div className="flex flex-wrap gap-3 sm:flex-nowrap ">
                <div className="me-auto space-y-3">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {user.displayName}
                        </h1>
                        <div className="text-muted-foreground">
                            @{user.username}
                        </div>
                    </div>
                    <div>
                        Member since {formatDate(new Date(user.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-3">
                        <span>
                            Posts:{' '}
                            <span className="font-semibold">
                                {formatNumber(user._count.posts)}
                            </span>
                        </span>
                        <FollowerCount userId={user.id} initialStats={followerInfo} />
                    </div>
                </div>
                {user.id === loggedInUserId ? (
                    <EditProfileButton user={user} />
                ) : (
                    <FollowButton userId={user.id} initialState={followerInfo} />
                )}
            </div>
            {user.bio && (
                <>
                    <hr />
                    <Linkify>
                        <div className="whitespace-pre-line overflow-hidden break-words">
                            {user.bio}
                        </div>
                    </Linkify>
                </>
            )}
        </div>
    )
}

function UserProfileSkeleton() {
    return (
        <div className="h-fit w-full space-y-5 rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
            {/* Avatar Skeleton */}
            <div className="mx-auto size-full max-h-60 max-w-60 rounded-full bg-muted animate-pulse" />

            {/* User Info Skeleton */}
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                <div className="me-auto space-y-3">
                    <div>
                        {/* Name Skeleton */}
                        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
                        {/* Username Skeleton */}
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    {/* Member since Skeleton */}
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                    {/* Stats Skeleton */}
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                </div>
                {/* Button Skeleton */}
                <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            </div>

            {/* Bio Skeleton */}
            <div className="space-y-2">
                <hr />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
        </div>
    )
}