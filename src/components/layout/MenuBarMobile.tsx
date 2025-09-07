'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation";
import { menuItem } from "@/lib/const"
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface MenuBarMobileProps {
    initialNotificationCount?: NotificationCountInfo
}

export default function MenuBarMobile({ initialNotificationCount }: MenuBarMobileProps) {
    const pathname = usePathname()
    const { data } = useQuery({
        queryKey: ['unread-notification-count'],
        queryFn: () => kyInstance.get('/api/notifications/unread-count').json<NotificationCountInfo>(),
        initialData: initialNotificationCount,
        refetchInterval: 60 * 1000
    })
    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden  border-t px-4 py-2 border-slate-200 shadow-sm bg-white/80  backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90"
        >
            <div className="flex items-center justify-around max-w-md mx-auto">
                {menuItem.map((item) => (
                    <motion.div
                        key={item.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href={item.href}
                            passHref
                            className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${pathname === item.href ? "dark:text-white text-black" : "text-slate-400"
                                }`}
                        >
                            <motion.div
                                className="relative"
                                animate={pathname === item.href ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <item.icon className={`w-6 h-6 ${pathname === item.href ? "dark:text-white text-black" : "text-slate-400"}`} />
                                {item.href == '/notifications' ? data?.unreadCount && data.unreadCount > 0 ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center"
                                    >
                                        {data.unreadCount || 0}
                                    </motion.div>
                                ) : '' : (
                                    ''
                                )}
                            </motion.div>
                            <span className={`text-xs font-medium ${pathname === item.href ? "dark:text-white text-black" : "text-slate-400"}`}>
                                {item.label}
                            </span>
                            {pathname === item.href && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute -top-1 right-[46%] transform -translate-x-1/2 w-1 h-1 dark:bg-white bg-black rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.nav>
    )
}
