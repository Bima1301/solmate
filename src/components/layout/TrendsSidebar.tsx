import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'
import UserAvatar from './UserAvatar'
import { unstable_cache } from 'next/cache'
import { formatNumber } from '@/lib/utils'
import FollowButton from '../views/(main)/home/FollowButton'
import { getUserDataSelect } from '@/lib/types'
import UserTooltip from '../views/(main)/home/UserTooltip'

export default function TrendsSidebar() {
  return (
    <div className='sticky top-[88px] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80'>
      <Suspense fallback={<Loader2 className='mx-auto animate-spin' />}>
        <WhoToFollow />
        <TrendsTopics />
      </Suspense>

    </div>
  )
}

async function WhoToFollow() {
  const { user } = await validateRequest()

  if (!user) return null

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id
      },
      followers: {
        none: {
          followerId: user.id
        }
      }
    },
    select: getUserDataSelect(user.id),
    take: 5
  })

  return (
    <div className='space-y-5 bg-card rounded-[8px] p-5 shadow-sm'>
      <div className='text-xl font-bold'>
        Who to follow
      </div>
      {usersToFollow.map(user => (
        <div key={user.id} className='flex items-center justify-between gap-3'>
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
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(({ followerId }) => followerId === user.id)
            }}
          >

          </FollowButton>
        </div>
      ))
      }
    </div >
  )
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
      SELECT LOWER(unnest(regexp_matches(content,'#[[:alnum:]_]+','g'))) AS hashtag, COUNT(*) AS count 
      FROM posts
      GROUP BY (hashtag)
      ORDER BY count DESC, hashtag ASC
      LIMIT 5
      `;

    return result.map(row => ({
      hashtag: row.hashtag,
      count: Number(row.count)
    }))
  },
  ["trending-topics"],
  {
    revalidate: 3 * 60 * 1000
  }
)

async function TrendsTopics() {
  const trendingTopics = await getTrendingTopics()

  return (
    <div className='space-y-5 rounded-[8px] bg-card p-5 shadow-sm'>
      <div className='text-xl font-bold'> Trending topics </div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split('#')[1];
        return (
          <Link key={title} href={`/hashtag/${title}`} className='block'>
            <p className='line-clamp-1 break-all font-medium hover:underline'
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className='text-sm text-muted-foreground'>
              {formatNumber(count)} {count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
