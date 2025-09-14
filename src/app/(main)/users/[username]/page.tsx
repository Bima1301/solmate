"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import UserAvatar from "@/components/layout/UserAvatar"
import FollowerCount from "@/components/secondary/FollowerCount"
import EditProfileButton from "@/components/views/(main)/home/EditProfileButton"
import FollowButton from "@/components/views/(main)/home/FollowButton"
import Linkify from "@/components/views/(main)/home/Linkify"
import UserPosts from "@/components/views/(main)/users/UserPosts"
import { FollowerInfo, UserData } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import { formatDate } from "date-fns"
import kyInstance from "@/lib/ky"
import { useSession } from "@/context/SessionProvider"

export default function UserProfilePage() {
    const params = useParams()
    const { user: loggedInUser } = useSession()
    const username = params.username as string

    const {
        data: user,
        status,
        error
    } = useQuery({
        queryKey: ['user-profile', username],
        queryFn: () => kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
        enabled: !!loggedInUser && !!username,
        retry(failureCount, error: any) {
            if (error?.status === 404) return false
            return failureCount < 3
        }
    })

    if (!loggedInUser) {
        return <p className="text-destructive">
            You&apos;re not authorized to view this page.
        </p>
    }

    if (status === 'pending') {
        return (
            <div className="w-full min-w-0 space-y-5">
                <UserProfileSkeleton />
                <PostsHeaderSkeleton />
                <UserPostsSkeleton />
            </div>
        )
    }

    if (status === 'error') {
        if (error?.status === 404) {
            return <p className="text-destructive text-center">
                User not found.
            </p>
        }
        return <p className="text-destructive text-center">
            An error occurred while loading user profile.
        </p>
    }

    if (!user) return null

    const followerInfo: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: user.followers.some(follower => follower.followerId === loggedInUser.id)
    }

    return (
        <div className="w-full min-w-0 space-y-5">
            <UserProfile user={user} loggedInUserId={loggedInUser.id} followerInfo={followerInfo} />
            <PostsHeader user={user} />
            <UserPosts userId={user.id} />
        </div>
    )
}

interface UserProfileProps {
    user: UserData,
    loggedInUserId: string,
    followerInfo: FollowerInfo
}

function UserProfile({ user, loggedInUserId, followerInfo }: UserProfileProps) {
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

function PostsHeader({ user }: { user: UserData }) {
    return (
        <div className="rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
            <h2 className="text-center text-2xl font-bold">
                {user.displayName}&apos;s Posts
            </h2>
        </div>
    )
}

// Loading Components
function UserProfileSkeleton() {
    return (
        <div className="h-fit w-full space-y-5 rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
            {/* Avatar Skeleton */}
            <div className="mx-auto size-full max-h-60 max-w-60 rounded-full bg-muted animate-pulse" />

            {/* User Info Skeleton */}
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                <div className="me-auto space-y-3">
                    <div>
                        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                </div>
                <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            </div>

            <div className="space-y-2">
                <hr />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
        </div>
    )
}

function PostsHeaderSkeleton() {
    return (
        <div className="rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto" />
        </div>
    )
}

function UserPostsSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full animate-pulse flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}