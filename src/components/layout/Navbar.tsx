'use client'
import React from 'react'
import UserButton from './UserButton'
import { motion, } from "framer-motion"
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import SearchField from './SearchField'

export default function Navbar() {
    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="sticky-navbar bg-background/95 backdrop-blur-xl border-b border-border/50 border-slate-200 dark:border-slate-700 dark:bg-slate-800/95 dark:hover:shadow-slate-900/20"
        >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link
                    href={'/'}
                    className="flex items-center gap-8">
                    <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <motion.div
                            className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center"
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Sol Mate</h1>
                    </motion.div>
                </Link>

                <div className="flex-1 max-w-md mx-8">
                    <SearchField />
                </div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <UserButton className='sm:ms-auto' />
                </motion.div>
            </div>
        </motion.header>
    )
}
