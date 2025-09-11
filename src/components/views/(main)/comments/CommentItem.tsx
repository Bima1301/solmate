'use client'
import UserAvatar from "@/components/layout/UserAvatar";
import { CommentData } from "@/lib/types";
import { motion } from "framer-motion";
import UserTooltip from "../home/UserTooltip";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import CommentMoreButton from "./CommentMoreButton";
import { useSession } from "@/context/SessionProvider";

interface CommentItemProps {
    comment: CommentData
    commentIndex: number
}

export default function CommentItem({ comment, commentIndex }: CommentItemProps) {
    const { user } = useSession()
    return (
        <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: commentIndex * 0.1, duration: 0.3 }}
            className="flex gap-3 p-3 rounded-lg transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 group/comment"
        >
            <UserAvatar
                avatarUrl={comment.user.avatarUrl}
                className="size-5"
            />
            <div className="flex-1">

                <div className="flex flex-col">
                    <div className="flex items-center gap-2 md:mb-1">
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
                                    @{comment.user.username}
                                </Link>
                            </UserTooltip>
                            <p
                                className={`text-xs transition-colors duration-300 dark:text-slate-400 text-slate-500 md:block hidden`}
                            >
                                · {formatRelativeDate(comment.createdAt)}
                            </p>
                        </div>
                    </div>
                    <p
                        className={`text-xs transition-colors duration-300 dark:text-slate-400 text-slate-500 md:hidden block mb-3`}
                    >
                        {formatRelativeDate(comment.createdAt)}
                    </p>
                </div>
                <p
                    className={`text-sm leading-relaxed transition-colors duration-300 dark:text-slate-200 text-slate-700 `}
                >
                    {comment.content}
                </p>
            </div>
            {comment.user.id == user.id && (
                <CommentMoreButton
                    comment={comment}
                    className={`transition-all duration-300 dark:hover:bg-slate-700 hover:bg-slate-100 opacity-0 group-hover/comment:opacity-100`}
                />
            )}
        </motion.div >
    )
}
