import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function PostItemSkeleton() {
    return (
        <div className='space-y-5'>
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
        </div>
    )
}

function ItemSkeleton() {
    return (
        <div className='w-full animate-pulse space-y-3 rounded-[8px] bg-card shadow-sm p-5'>
            <div className='flex flex-wrap gap-3'>
                <Skeleton className='size-12 rounded-full' />
                <div className=' space-y-1.5'>
                    <Skeleton className='h-4 w-24 rounded' />
                    <Skeleton className='h-4 w-20 rounded' />
                </div>
            </div>
            <Skeleton className='h-16 rounded' />
        </div>
    )
}