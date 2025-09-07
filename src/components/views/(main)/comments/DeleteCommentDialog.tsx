import LoadingButton from "@/components/secondary/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { CommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "@/store/mutations/comments";

interface DeleteCommentDialogProps {
    comment: CommentData;
    open: boolean;
    onClose: () => void;
}

export default function DeleteCommentDialog({ comment, open, onClose }: DeleteCommentDialogProps) {
    const mutation = useDeleteCommentMutation();

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
                    Delete Comment?
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this comment? This action cannot be undone.
                </DialogDescription>
                <DialogFooter>
                    <LoadingButton
                        variant={'destructive'}
                        onClick={() => mutation.mutate(comment.id, { onSuccess: () => onClose() })}
                        loading={mutation.isPending}
                    >
                        Delete Comment
                    </LoadingButton>
                    <Button variant={'outline'} onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
