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

    const [unreadNotificationCount, unreadMessageCount] = await Promise.all([
        prisma.notification.count({
            where: {
                recipientId: session.user.id,
                read: false
            }
        }),
        (await streamServerClient.getUnreadCount(session.user.id)).total_unread_count
    ])

    initialNotificationCount = { unreadCount: unreadNotificationCount }
    initialMessageCount = { unreadCount: unreadMessageCount }

    return <SessionProvider value={session}>
        <LayoutClient initialNotificationCount={initialNotificationCount} initialMessageCount={initialMessageCount}>
            {children}
        </LayoutClient>
    </SessionProvider >;
}