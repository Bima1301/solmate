"use client"

import { cardHoverVariants } from "@/lib/framer-motion"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "../ui/card"
import Link from "next/link"
import { formatNumber } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface TrendingTopicsCardProps {
    trendingTopics: {
        hashtag: string
        count: number
    }[]
}

export default function TrendingTopicsCard({ trendingTopics }: TrendingTopicsCardProps) {
    return (
        <motion.div whileHover={cardHoverVariants.hover} className="relative z-0">
            <Card
                className={`border shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/90 border-slate-200 bg-white/90`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp
                            className={`w-5 h-5 transition-colors duration-300 dark:text-slate-300 text-slate-700
                                }`}
                        />
                        <h3
                            className={`font-semibold transition-colors duration-300 dark:text-slate-100 text-slate-900
                                }`}
                        >
                            Trending topics
                        </h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {trendingTopics.map(({ hashtag, count }, index) => {
                        const title = hashtag.split('#')[1];
                        return (
                            <motion.div
                                className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 dark:hover:bg-slate-700 hover:bg-slate-50
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
                                whileHover={{ x: 4 }}
                                key={title}
                            >
                                <Link href={`/hashtag/${title}`} className='block'>
                                    <p className='line-clamp-1 break-all font-medium hover:underline'
                                        title={hashtag}
                                    >
                                        {hashtag}
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        {formatNumber(count)} {count === 1 ? 'post' : 'posts'}
                                    </p>
                                </Link>
                            </motion.div>
                        )
                    })}
                </CardContent>
            </Card>
        </motion.div>
    )
}
