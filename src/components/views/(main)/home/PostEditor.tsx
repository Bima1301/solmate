"use client"

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "@/actions/posts/editor/actions";
import { useSession } from "@/context/SessionProvider";
import UserAvatar from "@/components/layout/UserAvatar";
import { Button } from "@/components/ui/button";
import { useSubmitPostMutation } from "@/mutations/posts/editor";
import LoadingButton from "@/components/secondary/LoadingButton";

export default function PostEditor() {
    const { user } = useSession()
    const mutation = useSubmitPostMutation()

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false
            }),
            Placeholder.configure({
                placeholder: "Write something amazing..."
            })
        ],
    })

    const input = editor?.getText({
        blockSeparator: "\n",
    }) || ""


    function onSubmit() {
        mutation.mutate(input, {
            onSuccess: () => {
                editor?.commands.clearContent()
            }
        })
    }

    return (
        <div className="flex flex-col gap-5 rounded-[8px] bg-card p-5 shadow overflow-x-hidden">
            <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-row items-center gap-2">
                    <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline w-full h-full max-w-[40px]" />
                    <p className="text-gray-800 dark:text-white/80">
                        {user.displayName}
                    </p>
                </div>
            </div>
            <EditorContent
                editor={editor}
                className="w-full max-h-[20rem] min-h-[4rem] focus:border-none overflow-y-auto md:ps-[48px] break-all text-gray-800 dark:text-white/70"
            />
            <div className="flex w-full justify-end border-t pt-4">
                <LoadingButton
                    loading={mutation.isPending}
                    onClick={onSubmit}
                    disabled={!input.trim()}
                    className="min-w-20"
                >
                    Post
                </LoadingButton>
            </div>
        </div>
    )
}
