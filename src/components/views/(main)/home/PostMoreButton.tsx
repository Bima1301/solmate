import { PostData } from "@/lib/types";
import { useState } from "react";
import DeletePostDialog from "./DeletePostDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";


interface PostMoreButtonProps {
    post: PostData;
    className?: string;
}

export default function PostMoreButton({ post, className }: PostMoreButtonProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button size={'icon'} variant={'ghost'} className={className}>
                        <MoreHorizontal className="size-5 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-[8px]">
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="rounded-[8px] cursor-pointer">
                        <span className="flex items-center gap-3 text-destructive">
                            <Trash className="size-4" />
                            Delete
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeletePostDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
        </>
    )
}
