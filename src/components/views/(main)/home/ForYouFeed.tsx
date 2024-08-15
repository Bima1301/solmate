"use client"

import { PostData, PostsPage } from "@/lib/types"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import PostItem from "./PostItem";
import kyInstance from "@/lib/ky";
import { Button } from "@/components/ui/button";
import InfiniteScrollContainer from "@/components/secondary/InfiniteScrollContainer";
import PostItemSkeleton from "./PostItemSkeleton";

export default function ForYouFeed() {

    const {
        status, data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["posts-feed", "for-you"],
        queryFn: ({ pageParam }) => kyInstance.get('/api/posts/for-you',
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<PostsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor

    })

    const posts = data?.pages.flatMap(page => page.posts) || [];

    if (status == 'pending') {
        return <PostItemSkeleton />
    }

    if (status == 'success' && !posts.length && !hasNextPage) {
        return <p className="text-center text-muted-foreground">
            No one has posted anything yet.
        </p>
    }

    if (status == 'error') {
        return <p className="text-destructive text-center">
            An error occurred while loading posts.
        </p>
    }

    return (
        <InfiniteScrollContainer className="space-y-5"
            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
            {posts.map(post => (
                <PostItem key={post.id} post={post} />
            ))}

            {isFetchingNextPage && <Loader2 className="animate-spin mx-auto my-3" />}
        </InfiniteScrollContainer>
    )
}
