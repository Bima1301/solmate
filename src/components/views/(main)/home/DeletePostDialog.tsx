import LoadingButton from "@/components/secondary/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "@/mutations/posts";

interface DeletePostDialogProps {
    post: PostData;
    open: boolean;
    onClose: () => void;
}

export default function DeletePostDialog({ post, open, onClose }: DeletePostDialogProps) {
    const mutation = useDeletePostMutation();

    function handleOpenChange(open: boolean) {
        if (!open || !mutation.isPending) {
            onClose();
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="rounded-[8px]">
                <DialogHeader>
                    Delete Post?
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                </DialogDescription>
                <DialogFooter>
                    <LoadingButton
                        variant={'destructive'}
                        onClick={() => mutation.mutate(post.id, { onSuccess: () => onClose() })}
                        loading={mutation.isPending}
                    >
                        Delete Post
                    </LoadingButton>
                    <Button variant={'outline'} onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
