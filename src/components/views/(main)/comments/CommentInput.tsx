import UserAvatar from "@/components/layout/UserAvatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "@/context/SessionProvider"
import { PostData } from "@/lib/types"
import { useSubmitCommentMutation } from "@/store/mutations/comments"
import { motion } from "framer-motion"
import { Loader2, Send } from "lucide-react"
import { useState } from "react"

interface CommentInputProps {
    post: PostData
}

export default function CommentInput({ post }: CommentInputProps) {
    const { user } = useSession()
    const [comment, setComment] = useState("")

    const mutation = useSubmitCommentMutation(post.id)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!comment) return

        mutation.mutate({
            post,
            content: comment
        }, {
            onSuccess: () => setComment("")
        })
    }

    return (
        <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
            <div className="flex-1 flex gap-2 items-center">
                <UserAvatar avatarUrl={user.avatarUrl} className="size-10" />
                <Input
                    placeholder="Write a comment..."
                    className="flex-1 transition-colors duration-300 bg-slate-50 border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-400"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    autoFocus
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        size="sm"
                        className="transition-colors aspect-square h-full duration-300 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100"
                        disabled={mutation.isPending || !comment.trim()}
                    >
                        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </motion.div>
            </div>
        </form >
    )
}