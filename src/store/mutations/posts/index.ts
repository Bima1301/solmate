import { deletePost } from "@/actions/posts/actions";
import { PostsPage } from "@/lib/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDeletePostMutation() {
    const queryClient = useQueryClient();

    const router = useRouter();
    const pathname = usePathname();

    const mutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            const queryFilter: QueryFilters = { queryKey: ["posts-feed"] };

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.filter(p => p.id !== deletedPost.id)
                        }))
                    }
                }
            )

            toast.success("Post deleted")

            if (pathname == `/posts/${deletedPost.id}`) {
                router.push(`/users/${deletedPost.user.username}`);
            }
        },
        onError(error) {
            console.log(error);
            toast.error("Failed to delete post. Please try again.")
        }
    })

    return mutation;
}