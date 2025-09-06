import { CommentsPage, PostData } from '@/lib/types'
import { motion } from 'framer-motion'
import { Loader2, MessageCircle } from 'lucide-react'
import React from 'react'
import CommentInput from './CommentInput'
import { useInfiniteQuery } from '@tanstack/react-query'
import kyInstance from '@/lib/ky'
import CommentItem from './CommentItem'
import { Button } from '@/components/ui/button'

interface CommentsProps {
    post: PostData
}

export default function Comments({ post }: CommentsProps) {
    const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
        queryKey: ['comments', post.id],
        queryFn: ({ pageParam }) => kyInstance.get(`/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
        ).json<CommentsPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.previousCursor,
        select: (data) => ({
            pages: [...data.pages].reverse(),
            pageParams: [...data.pageParams].reverse()
        })
    });

    const comments = data?.pages.flatMap(page => page.comments) || []



    return (
        <div className="space-y-3">
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 space-y-4 transition-colors duration-300 border-slate-200 dark:border-slate-700"
            >
                <CommentInput post={post} />

                {hasNextPage && (
                    <Button
                        variant={'link'}
                        className='mx-auto block'
                        disabled={isFetching}
                        onClick={() => fetchNextPage()}
                    >
                        Load previous comments
                    </Button>
                )}
                {status === 'pending' && <Loader2 className='animate-spin mx-auto' />}
                {status === 'success' && !comments.length ? <p className='text-center text-sm text-muted-foreground'>No comments yet</p> : null}
                {status === 'error' && <p className='text-center text-sm text-destructive'>
                    An error occurred while loading comments.
                </p>}

                <div className="space-y-3">
                    {comments?.map((comment, commentIndex) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            commentIndex={commentIndex}
                        />
                    ))}
                </div>

            </motion.div >
        </div>
    )
}

interface CommentButtonProps {
    post: PostData
    onClick: () => void
}

export function CommentButton({ post, onClick }: CommentButtonProps) {
    return (
        <button onClick={onClick} className="flex items-center gap-1 text-xs transition-colors duration-300 hover:text-blue-500">
            <MessageCircle className="size-4" />
            <span className="text-sm font-medium tabular-nums">
                {post._count.comments}
            </span>
        </button>
    )
}