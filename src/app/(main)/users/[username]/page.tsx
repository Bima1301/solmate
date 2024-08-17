import { validateRequest } from "@/auth"
import TrendsSidebar from "@/components/layout/TrendsSidebar"
import UserAvatar from "@/components/layout/UserAvatar"
import FollowerCount from "@/components/secondary/FollowerCount"
import { Button } from "@/components/ui/button"
import FollowButton from "@/components/views/(main)/home/FollowButton"
import UserPosts from "@/components/views/(main)/home/users/UserPosts"
import prisma from "@/lib/prisma"
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import { formatDate } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"

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
        <main className="flex w-full min-w-0 gap-5">
            <div className=" w-full min-w-0 space-y-5">
                <UserProfile user={user} loggedInUserId={loggedInUser.id} />
                <div className="rounded-[8px] bg-card p-5 shadow-sm">
                    <h2 className="text-center text-2xl font-bold">
                        {user.displayName}&apos;s Posts
                    </h2>
                </div>
                <UserPosts userId={user.id} />
            </div>
            <TrendsSidebar />
        </main>
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
        <div className="h-fit w-full space-y-5 rounded-[8px] bg-card p-5 shadow-sm">
            <UserAvatar avatarUrl={user.avatarUrl} size={250} className="mx-auto size-full max-h-60 max-w-60 rounded-full" />
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
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
                    <Button>
                        Edit Profile
                    </Button>
                ) : (
                    <FollowButton userId={user.id} initialState={followerInfo} />
                )}
            </div>
            {user.bio && (
                <>
                    <hr />
                    <div className="whitespace-pre-line overflow-hidden break-words">
                        {user.bio}
                    </div>
                </>
            )}
        </div>
    )
}