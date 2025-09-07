'use client'

import { NotificationCountInfo } from "@/lib/types"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { Badge, Bell } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"
import { motion } from "framer-motion"

interface NotificationButtonProps {
    initialState: NotificationCountInfo
    pathname: string
}

export default function NotificationButton({ initialState, pathname }: NotificationButtonProps) {
    const { data } = useQuery({
        queryKey: ['unread-notification-count'],
        queryFn: () => kyInstance.get('/api/notifications/unread-count').json<NotificationCountInfo>(),
        initialData: initialState,
        refetchInterval: 60 * 1000
    })
    return (
        <Link
            className={buttonVariants({
                className: `w-full flex !justify-start gap-3 h-12 transition-all duration-300 ${pathname === '/notifications'
                    ? "bg-slate-800 text-white shadow-md hover:bg-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:shadow-md dark:hover:bg-slate-600"
                    : "hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                    }`,
                variant: pathname === '/notifications' ? "default" : "ghost"
            })}
            href={'/notifications'}
        >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
            {data.unreadCount && data.unreadCount > 0 ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                >
                    <div className="ml-auto px-2 py-1 text-xs rounded shadow-sm bg-blue-500 text-white hover:bg-blue-600">{data.unreadCount}</div>
                </motion.div>
            ) : ''}
        </Link>
    )
}