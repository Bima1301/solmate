import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../../context/SessionProvider";
import LayoutClient from "./layout.client";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await validateRequest();

    if (!session.user) redirect("/login");

    // Fetch notification count on the server
    const unreadNotificationCount = await prisma.notification.count({
        where: {
            recipientId: session.user.id,
            read: false
        }
    });

    const initialNotificationCount: NotificationCountInfo = {
        unreadCount: unreadNotificationCount
    };

    return <SessionProvider value={session}>
        <LayoutClient initialNotificationCount={initialNotificationCount}>
            {children}
        </LayoutClient>
    </SessionProvider >;
}