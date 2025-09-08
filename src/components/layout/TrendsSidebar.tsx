import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { Loader2 } from 'lucide-react'
import React, { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { getUserDataSelect } from '@/lib/types'
import WhoToFollowCard, { WhoToFollowLayout } from './WhoToFollowCard'
import TrendingTopicsCard from './TrendingTopicsCard'

export default function TrendsSidebar() {
  return (
    <Suspense fallback={<Loader2 className='mx-auto animate-spin hidden lg:block' />}>
      <WhoToFollowLayout>
        <>
          <WhoToFollow />
          <TrendsTopics />
        </>
      </WhoToFollowLayout>
    </Suspense>
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
    <WhoToFollowCard
      usersToFollow={usersToFollow}
    />
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

  return <TrendingTopicsCard trendingTopics={trendingTopics} />
}
