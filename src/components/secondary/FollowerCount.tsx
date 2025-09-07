'use client'

import useFollowerInfo from "@/hooks/useFollowerInfo"
import { FollowerInfo } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface FollowerCountProps {
    userId: string
    initialStats: FollowerInfo
}

export default function FollowerCount({ userId, initialStats }: FollowerCountProps) {
    const { data } = useFollowerInfo(userId, initialStats)

    return (
        <span>
            Followers: {' '}
            <span className="font-semibold">
                {formatNumber(data.followers)}
            </span>
        </span>
    )
}