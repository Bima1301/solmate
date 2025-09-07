import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import MenuBar from './MenuBar'
import { MessageCountInfo, NotificationCountInfo } from '@/lib/types'
import streamServerClient from '@/lib/get-stream'

export default async function MenuBarWrapper() {
    const { user } = await validateRequest()

    let initialNotificationCount: NotificationCountInfo = { unreadCount: 0 }
    let initialMessageCount: MessageCountInfo = { unreadCount: 0 }

    if (user) {
        const [unreadNotificationCount, unreadMessageCount] = await Promise.all([
            prisma.notification.count({
                where: {
                    recipientId: user.id,
                    read: false
                }
            }),
            (await streamServerClient.getUnreadCount(user.id)).total_unread_count
        ])

        initialNotificationCount = { unreadCount: unreadNotificationCount }
        initialMessageCount = { unreadCount: unreadMessageCount }
    }

    return <MenuBar initialNotificationCount={initialNotificationCount} initialMessageCount={initialMessageCount} />
}
