'use client'

import MenuBar from "@/components/layout/MenuBar"
import MenuBarMobile from "@/components/layout/MenuBarMobile"
import Navbar from "@/components/layout/Navbar"
import { containerVariants } from "@/lib/framer-motion"
import { motion } from "framer-motion"
import { MessageCountInfo, NotificationCountInfo } from "@/lib/types"
import { usePathname } from "next/navigation"

interface LayoutClientProps {
    children: React.ReactNode
    initialNotificationCount: NotificationCountInfo
    initialMessageCount: MessageCountInfo
    trendsSidebar?: React.ReactNode
}

export default function LayoutClient({ children, initialNotificationCount, initialMessageCount, trendsSidebar }: LayoutClientProps) {
    const pathname = usePathname()
    return (
        <div className="min-h-screen bg-background dark:bg-slate-900 dark:text-slate-100">
            <Navbar />
            <div className="pb-20 md:pb-0">
                <motion.div
                    className="w-full flex gap-6 p-4 max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <MenuBar initialNotificationCount={initialNotificationCount} initialMessageCount={initialMessageCount} />
                    <main className="flex w-full min-w-0 gap-5 mx-auto">
                        {children}
                        {pathname !== '/messages' && trendsSidebar}
                    </main>
                </motion.div>
            </div>
            <MenuBarMobile initialNotificationCount={initialNotificationCount} initialMessageCount={initialMessageCount} />
        </div>
    )
}
