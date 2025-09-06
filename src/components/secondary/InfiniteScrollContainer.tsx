'use client'

import { useInView } from "react-intersection-observer"
import { AnimatePresence, motion } from "framer-motion"
import { containerVariants } from "@/lib/framer-motion"
interface InfiniteScrollContainerProps extends React.PropsWithChildren {
    onBottomReached: () => void
    className?: string
}

export default function InfiniteScrollContainer({ onBottomReached, className, children }: InfiniteScrollContainerProps) {
    const { ref } = useInView({
        rootMargin: "200px",
        onChange(inView) {
            if (inView) {
                onBottomReached();
            }
        }
    })
    return (
        <motion.div className={className} variants={containerVariants}>
            {children}
            <div ref={ref} />
        </motion.div>
    )
}
