import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../../context/SessionProvider";
import LayoutClient from "./layout.client";
import prisma from "@/lib/prisma";
import { MessageCountInfo, NotificationCountInfo } from "@/lib/types";
import streamServerClient from "@/lib/get-stream";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await validateRequest();

    if (!session.user) redirect("/login");

    let initialNotificationCount: NotificationCountInfo = { unreadCount: 0 }
    let initialMessageCount: MessageCountInfo = { unreadCount: 0 }

    // Create timeout wrapper function
    const withTimeout = (promise: Promise<any>, timeoutMs: number = 5000): Promise<any> => {
        return Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
            )
        ])
    }

    try {
        const [unreadNotificationCount, unreadMessageCount] = await Promise.allSettled([
            withTimeout(prisma.notification.count({
                where: {
                    recipientId: session.user.id,
                    read: false
                }
            }), 5000),
            withTimeout(streamServerClient.getUnreadCount(session.user.id).then(res => res.total_unread_count), 5000)
        ])

        // Handle notification count result
        if (unreadNotificationCount.status === 'fulfilled') {
            initialNotificationCount = { unreadCount: unreadNotificationCount.value }
        } else {
            console.error('Failed to fetch notification count:', unreadNotificationCount.reason)
        }

        // Handle message count result
        if (unreadMessageCount.status === 'fulfilled') {
            initialMessageCount = { unreadCount: unreadMessageCount.value }
        } else {
            console.error('Failed to fetch message count:', unreadMessageCount.reason)
        }
    } catch (error) {
        console.error('Error in Promise.allSettled:', error)
        // Keep default values (0) if all operations fail
    }

    return <SessionProvider value={session}>
        <LayoutClient initialNotificationCount={initialNotificationCount} initialMessageCount={initialMessageCount}>
            {children}
        </LayoutClient>
    </SessionProvider >;
}