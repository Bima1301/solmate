
export default function Loading() {
    return (
        <div className="w-full min-w-0 space-y-5">
            {/* User Profile Loading */}
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

            {/* Posts Header Loading */}
            <div className="rounded-[8px] bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
                <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto" />
            </div>

            {/* Posts Loading */}
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
        </div>
    )
}