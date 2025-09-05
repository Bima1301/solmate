"use client"

import { PostsPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import PostItem from "../home/PostItem";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/secondary/InfiniteScrollContainer";
import PostItemSkeleton from "../home/PostItemSkeleton";

export default function Bookmarks() {

    const {
        status, data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["posts-feed", "bookmarks"],
        queryFn: ({ pageParam }) => kyInstance.get('/api/posts/bookmarked',
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
            You have not bookmarked any posts yet.
        </p>
    }

    if (status == 'error') {
        return <p className="text-destructive text-center">
            An error occurred while loading bookmarks.
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
