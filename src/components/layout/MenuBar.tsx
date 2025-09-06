'use client'

import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Card, CardContent } from "../ui/card";
import { usePathname } from "next/navigation";
import { menuItem } from "@/lib/const"
import { itemVariants } from "@/lib/framer-motion"

export default function MenuBar() {
    const pathname = usePathname()

    return (
        <motion.aside className="w-64 sticky top-20 h-fit hidden md:block" variants={itemVariants}>
            <Card className="border-slate-200 shadow-sm bg-white/80  backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90">
                <CardContent className="p-4">
                    <nav className="space-y-2">
                        {menuItem.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                            >
                                <Link
                                    className={buttonVariants({
                                        className: `w-full flex !justify-start gap-3 h-12 transition-all duration-300 ${pathname === item.href
                                            ? "bg-slate-800 text-white shadow-md hover:bg-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:shadow-md dark:hover:bg-slate-600"
                                            : "hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                                            }`,
                                        variant: pathname === item.href ? "default" : "ghost"
                                    })}
                                    href={item.href}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </CardContent>
            </Card>
        </motion.aside>
    )
}
