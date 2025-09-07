import { cubicBezier, Variants } from "framer-motion"

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            // ease: [0.17, 0.67, 0.83, 0.67], // ini setara dengan easeOut
        },
    },
}

export const cardHoverVariants = {
    hover: {
        y: -2,
        scale: 1.01,
        transition: {
            duration: 0.2,
            // ease: cubicBezier(0.17, 0.67, 0.83, 0.67),
        },
    },
}


export const likeVariants = {
    liked: { scale: 1.1 },
}
