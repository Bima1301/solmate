"use client"

import { NotificationPage, PostsPage } from "@/lib/types"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/secondary/InfiniteScrollContainer";
import PostItemSkeleton from "../home/PostItemSkeleton";
import NotificationItem from "./NotificationItem";
import { useEffect } from "react";

export default function Notifications() {

    const {
        status, data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["notiications"],
        queryFn: ({ pageParam }) => kyInstance.get('/api/notifications',
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<NotificationPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
        onSuccess: () => {
            queryClient.setQueryData(['unread-notification-count'], {
                unreadCount: 0
            })
        },
        onError(error) {
            console.error("Failed to mark notifications as read", error)
        }
    })

    useEffect(() => {
        mutate()
    }, [mutate])

    const notifications = data?.pages.flatMap(page => page.notifications) || [];

    if (status == 'pending') {
        return <PostItemSkeleton />
    }

    if (status == 'success' && !notifications.length && !hasNextPage) {
        return <p className="text-center text-muted-foreground">
            You have not received any notifications yet.
        </p>
    }

    if (status == 'error') {
        return <p className="text-destructive text-center">
            An error occurred while loading notifications.
        </p>
    }

    return (
        <InfiniteScrollContainer className="space-y-5"
            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
            {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}

            {isFetchingNextPage && <Loader2 className="animate-spin mx-auto my-3" />}

        </InfiniteScrollContainer>
    )
}
