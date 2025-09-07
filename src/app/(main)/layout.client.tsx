'use client'

import MenuBar from "@/components/layout/MenuBar"
import MenuBarMobile from "@/components/layout/MenuBarMobile"
import Navbar from "@/components/layout/Navbar"
import { containerVariants } from "@/lib/framer-motion"
import { motion } from "framer-motion"
import { MessageCountInfo, NotificationCountInfo } from "@/lib/types"

interface LayoutClientProps {
    children: React.ReactNode
    initialNotificationCount: NotificationCountInfo
    initialMessageCount: MessageCountInfo
}

export default function LayoutClient({ children, initialNotificationCount, initialMessageCount }: LayoutClientProps) {

    return (
        <div className="h-screen bg-background pb-20 md:pb-0 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
            <Navbar />
            <motion.div
                className="w-full flex gap-6 p-4 flex-1 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <MenuBar initialNotificationCount={initialNotificationCount} initialMessageCount={initialMessageCount} />
                {children}
            </motion.div>
            <MenuBarMobile initialNotificationCount={initialNotificationCount} initialMessageCount={initialMessageCount} />
        </div>
    )
}
