import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import MenuBar from './MenuBar'
import { NotificationCountInfo } from '@/lib/types'

export default async function MenuBarWrapper() {
    const { user } = await validateRequest()

    let initialNotificationCount: NotificationCountInfo = { unreadCount: 0 }

    if (user) {
        const unreadNotificationCount = await prisma.notification.count({
            where: {
                recipientId: user.id,
                read: false
            }
        })
        initialNotificationCount = { unreadCount: unreadNotificationCount }
    }

    return <MenuBar initialNotificationCount={initialNotificationCount} />
}
