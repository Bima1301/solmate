'use client'

import MenuBar from "@/components/layout/MenuBar"
import MenuBarMobile from "@/components/layout/MenuBarMobile"
import Navbar from "@/components/layout/Navbar"
import { containerVariants } from "@/lib/framer-motion"
import { motion } from "framer-motion"
import { NotificationCountInfo } from "@/lib/types"

interface LayoutClientProps {
    children: React.ReactNode
    initialNotificationCount: NotificationCountInfo
}

export default function LayoutClient({ children, initialNotificationCount }: LayoutClientProps) {

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0 dark:bg-slate-900 dark:text-slate-100">
            <Navbar />
            <motion.div
                className="max-w-7xl mx-auto flex gap-6 p-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <MenuBar initialNotificationCount={initialNotificationCount} />
                {children}
            </motion.div>
            <MenuBarMobile initialNotificationCount={initialNotificationCount} />
        </div>
    )
}
