import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loading() {
    return (
        <div className="w-full min-w-0 space-y-5">
            {/* User Profile Skeleton */}
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

            {/* Posts Header Skeleton */}
            <div className="rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
                <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto" />
            </div>

            {/* Loading Indicator */}
            <div className="flex justify-center">
                <Loader2 className="animate-spin" />
            </div>
        </div>
    )
}
