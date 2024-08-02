import Image from 'next/image'
import React from 'react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
    avatarUrl: string | null | undefined
    size?: number
    className?: string
}

export default function UserAvatar({ avatarUrl, size = 8, className }: UserAvatarProps) {
    return <Image
        src={avatarUrl || '/images/avatar.webp'}
        alt="User avatar"
        width={size ?? 48}
        height={size ?? 48}
        className={cn("aspect-square flex-none h-fit rounded-full bg-secondary object-cover", className)}
    />
}
