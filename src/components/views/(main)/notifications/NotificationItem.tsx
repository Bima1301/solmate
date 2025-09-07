import UserAvatar from "@/components/layout/UserAvatar"
import { NotificationData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { NotificationType } from "@prisma/client"
import { Heart, MessageCircle, User2 } from "lucide-react"
import Link from "next/link"

interface PostItemProps {
    notification: NotificationData
}

export default function NotificationItem({ notification }: PostItemProps) {
    const notificationTypeMap: Record<NotificationType, { message: string, icon: JSX.Element, href: string }> = {
        FOLLOW: {
            message: `${notification.issuer.displayName} followed you`,
            icon: <User2 className="md:size-7 size-4 text-primary" />,
            href: `/users/${notification.issuer.username}`
        },
        COMMENT: {
            message: `${notification.issuer.displayName} commented on your post`,
            icon: <MessageCircle className="md:size-7 size-4 text-primary fill-primary" />,
            href: `/posts/${notification.postId}`
        },
        LIKE: {
            message: `${notification.issuer.displayName} liked your post`,
            icon: <Heart className="md:size-7 size-4 text-red-500 fill-red-500" />,
            href: `/posts/${notification.postId}`
        }
    }

    const { message, icon, href } = notificationTypeMap[notification.type]

    return (
        <Link
            href={href}
            className="block"
        >
            <article className={cn("flex gap-3 rounded-2xl dark:bg-slate-800/90 bg-white/90 md:p-5 p-2 shadow-sm transition-colors dark:hover:bg-slate-500/50 hover:bg-white/70", !notification.read && 'bg-primary/10 dark:bg-primary/50')}>
                <div className="my-1">
                    {icon}
                </div>
                <div className="md:space-y-3 space-y-1">
                    <UserAvatar
                        avatarUrl={notification.issuer.avatarUrl}
                        className="md:size-8 size-4"
                    />
                    <div className="md:text-base text-sm">
                        <span className="font-bold">{notification.issuer.displayName}</span>{" "}
                        <span>{message}</span>
                    </div>
                    {notification.post && (
                        <div className="line-clamp-3 whitespace-pre-line text-muted-foreground md:text-base text-sm">
                            {notification.post.content}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    )
}