'use client'
import { cardHoverVariants, itemVariants } from '@/lib/framer-motion'
import { Card, CardContent, CardHeader } from '../ui/card'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import UserTooltip from '../views/(main)/home/UserTooltip'
import Link from 'next/link'
import UserAvatar from './UserAvatar'
import { UserData } from '@/lib/types'
import FollowButton from '../views/(main)/home/FollowButton'

interface WhoToFollowCardProps {
    usersToFollow: UserData[]
}

export default function WhoToFollowCard({ usersToFollow }: WhoToFollowCardProps) {
    return (
        <motion.div whileHover={cardHoverVariants.hover} className="relative z-10">
            <Card
                className={`border shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800/90 border-slate-200 bg-white/90`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Users
                            className={`w-5 h-5 transition-colors duration-300 dark:text-slate-300 text-slate-700`}
                        />
                        <h3
                            className={`font-semibold transition-colors duration-300 dark:text-slate-100 text-slate-900`}
                        >
                            Who to follow
                        </h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {usersToFollow.map((user, index) => (
                        <motion.div
                            key={user.username}
                            className={`flex dark:hover:bg-slate-700 items-center justify-between hover:bg-opacity-50 p-2 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-slate-50`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3">
                                <UserTooltip user={user}>
                                    <Link href={`/user/${user.username}`} className='flex items-center gap-3'>
                                        <UserAvatar avatarUrl={user.avatarUrl} className='w-12 h-12' />
                                        <div>
                                            <p className='line-clamp-1 break-all font-semibold hover:underline'>
                                                {user.displayName}
                                            </p>
                                            <p className='line-clamp-1 break-all text-muted-foreground'>
                                                @{user.username}
                                            </p>
                                        </div>
                                    </Link>
                                </UserTooltip>
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <FollowButton
                                    userId={user.id}
                                    initialState={{
                                        followers: user._count.followers,
                                        isFollowedByUser: user.followers.some(({ followerId }) => followerId === user.id)
                                    }}
                                />

                            </motion.div>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    )
}

export function WhoToFollowLayout({ children }: { children: React.ReactNode }) {
    return (
        <motion.aside className="w-full max-w-80 sticky top-20 h-fit space-y-6 hidden lg:block z-20" variants={itemVariants}>
            {children}
        </motion.aside>
    )
}
