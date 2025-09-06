'use client'

import { Button } from '@/components/ui/button';
import kyInstance from '@/lib/ky';
import { FollowerInfo } from '@/lib/types';
import useFollowerInfo from '@/store/queries/posts/useFollowerInfo';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface FollowButtonProps {
    userId: string;
    initialState: FollowerInfo
}

export default function FollowButton({ userId, initialState }: FollowButtonProps) {
    const queryClient = useQueryClient();

    const { data } = useFollowerInfo(userId, initialState);

    const queryKey: QueryKey = ['follower-info', userId];

    const { mutate } = useMutation({
        mutationFn: () => data.isFollowedByUser ?
            kyInstance.delete(`/api/users/${userId}/followers`) :
            kyInstance.post(`/api/users/${userId}/followers`),
        onMutate: async () => {

            await queryClient.cancelQueries({ queryKey });

            const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

            queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
                followers: (previousState?.followers || 0) + (previousState?.isFollowedByUser ? -1 : 1),
                isFollowedByUser: !previousState?.isFollowedByUser
            }));

            return { previousState };
        },
        onError(err, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState);
            console.error(err);
            toast.error('Something went wrong. Please try again later.')
        }
    })

    return (
        <Button
            variant={data.isFollowedByUser ? 'secondary' : 'default'}
            onClick={() => mutate()}
            size={'sm'}
            className={`transition-colors duration-300 `}
        >
            {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
        </Button>
    )
}
