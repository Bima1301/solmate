'use client'

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import kyInstance from '@/lib/ky';
import { FollowerInfo } from '@/lib/types';
import useFollowerInfo from '@/store/queries/posts/useFollowerInfo';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface FollowButtonProps {
    userId: string;
    initialState: FollowerInfo
}

export default function FollowButton({ userId, initialState }: FollowButtonProps) {
    const { toast } = useToast();

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
            toast({
                variant: 'destructive',
                description: 'Something went wrong. Please try again later.'
            });

        }
    })

    return (
        <Button
            variant={data.isFollowedByUser ? 'secondary' : 'default'}
            onClick={() => mutate()}
        >
            {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
        </Button>
    )
}
