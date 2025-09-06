'use client'
import UserAvatar from "@/components/layout/UserAvatar";
import { CommentData } from "@/lib/types";
import { motion } from "framer-motion";
import UserTooltip from "../home/UserTooltip";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";

interface CommentItemProps {
    comment: CommentData
    commentIndex: number
}

export default function CommentItem({ comment, commentIndex }: CommentItemProps) {
    return (
        <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: commentIndex * 0.1, duration: 0.3 }}
            className="flex gap-3 p-3 rounded-lg transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
        >
            <UserAvatar
                avatarUrl={comment.user.avatarUrl}
                className="size-5"
            />
            <div className="flex-1">

                <div className="flex items-center gap-2 mb-1">
                    <p
                        className={`font-medium text-sm transition-colors duration-300 dark:text-slate-100 text-slate-900`}
                    >
                        {comment.user.displayName}
                    </p>
                    <div className="flex gap-2 items-center">
                        <UserTooltip
                            user={comment.user}
                        >
                            <Link
                                href={`/users/${comment.user.username}`}
                                className={`text-xs transition-colors duration-300 dark:text-slate-400 text-slate-500 hover:underline`}
                            >
                                @{comment.user.username} ·
                            </Link>
                        </UserTooltip>
                        <p
                            className={`text-xs transition-colors duration-300 dark:text-slate-400 text-slate-500`}
                        >
                            {formatRelativeDate(comment.createdAt)}
                        </p>
                    </div>
                </div>
                <p
                    className={`text-sm leading-relaxed transition-colors duration-300 dark:text-slate-200 text-slate-700 `}
                >
                    {comment.content}
                </p>
            </div>
        </motion.div >
    )
}
