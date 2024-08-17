import { submitPost } from "@/actions/posts/editor/actions";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/context/SessionProvider";
import { PostsPage } from "@/lib/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubmitPostMutation() {
    const { toast } = useToast()
    const queryClient = useQueryClient();

    const { user } = useSession();

    const mutation = useMutation({
        mutationFn: submitPost,
        onSuccess: async (newPost) => {
            const queryFilter = {
                queryKey: ["posts-feed"], predicate(query) {
                    return query.queryKey.includes("for-you") ||
                        (query.queryKey.includes("user-posts") && query.queryKey.includes(user.id))
                }
            } satisfies QueryFilters;

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {
                    const firstPage = oldData?.pages[0];

                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    posts: [newPost, ...firstPage.posts],
                                    nextCursor: firstPage.nextCursor
                                },
                                ...oldData.pages.slice(1),
                            ]
                        }
                    }
                }
            )

            queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate(newQuery) {
                    return queryFilter.predicate(newQuery) && !newQuery.state.data;
                },
            })

            toast({
                description: "Post created"
            })
        },
        onError(error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Failed to post. Please try again."
            })
        }
    })

    return mutation;
}