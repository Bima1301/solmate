"use client"

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useSession } from "@/context/SessionProvider";
import UserAvatar from "@/components/layout/UserAvatar";
import { useSubmitPostMutation } from "@/store/mutations/posts/editor";
import LoadingButton from "@/components/secondary/LoadingButton";
import useMediaUpload, { Attachment } from "../../../../hooks/useMediaUpload";
import { ClipboardEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cardHoverVariants } from "@/lib/framer-motion";

export default function PostEditor() {
    const { user } = useSession()
    const mutation = useSubmitPostMutation()

    const {
        startUpload,
        attachments,
        isUploading,
        uploadProgress,
        removeAttachment,
        reset: resetMediaUploads
    } = useMediaUpload()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: startUpload
    })

    const { onClick, ...rootProps } = getRootProps()

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
        mutation.mutate({
            content: input,
            mediaIds: attachments.map(a => a.mediaId).filter(Boolean) as string[]
        }, {
            onSuccess: () => {
                editor?.commands.clearContent();
                resetMediaUploads()
            }
        })
    }

    function onPaste(e: ClipboardEvent<HTMLInputElement>) {
        const files = Array.from(e.clipboardData.items).filter(item => item.kind === 'file').map(item => item.getAsFile()) as File[]
        startUpload(files)
    }

    return (
        <motion.div whileHover={cardHoverVariants}>
            <Card className="mb-6 border shadow-sm backdrop-blur-sm transition-colors duration-300 border-slate-200 bg-white/90 dark:border-slate-700 dark:bg-slate-800/90">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline w-full h-full max-w-[40px]" />
                        <div className="flex-1" {...rootProps} >
                            <EditorContent
                                editor={editor}
                                className={cn("border-0 bg-transparent text-base placeholder:text-slate-500 focus:ring-0 p-0 dark:placeholder:text-slate-400 dark:text-slate-100 mb-5", isDragActive && 'outline-dashed')}
                                onPaste={onPaste}
                            />
                            <input
                                {...getInputProps()}
                            />
                            {!!attachments.length && (
                                <AttachmentPreviews
                                    attachments={attachments}
                                    removeAttachment={removeAttachment}
                                />
                            )}
                            <div className="flex items-center justify-between mt-4">
                                {isUploading && (
                                    <>
                                        <span className="text-sm">
                                            {uploadProgress ?? 0}%
                                        </span>
                                        <Loader2 className="size-5 animate-spin text-primary" />
                                    </>
                                )}
                                <div className="flex gap-2 justify-between items-center w-full">
                                    <AddAttachmentButton
                                        onFilesSelected={startUpload}
                                        disabled={isUploading || attachments.length > 5}
                                    />

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <LoadingButton
                                            loading={mutation.isPending}
                                            onClick={onSubmit}
                                            disabled={!input.trim() || isUploading}
                                            className="min-w-20"
                                        >
                                            Post
                                        </LoadingButton>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div >
        // <div className="flex flex-col gap-5 rounded-[8px] bg-card p-5 shadow overflow-x-hidden">
        //     <div className="flex flex-row justify-between w-full items-center">
        //         <div className="flex flex-row items-center gap-2">
        //             <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline w-full h-full max-w-[40px]" />
        //             <p className="text-gray-800 dark:text-white/80">
        //                 {user.displayName}
        //             </p>
        //         </div>
        //     </div>
        //     <div {...rootProps} className="w-full">
        //         <EditorContent
        //             editor={editor}
        //             className={cn("w-full max-h-[20rem] min-h-[4rem] focus:border-none overflow-y-auto md:ps-[48px] break-all text-gray-800 dark:text-white/70", isDragActive && 'outline-dashed')}
        //             onPaste={onPaste}
        //         />
        //         <input
        //             {...getInputProps()}
        //         />
        //     </div>
        //     {!!attachments.length && (
        //         <AttachmentPreviews
        //             attachments={attachments}
        //             removeAttachment={removeAttachment}
        //         />
        //     )}
        //     <div className="flex w-full justify-end border-t pt-4 gap-3 items-center">
        //         {isUploading && (
        //             <>
        //                 <span className="text-sm">
        //                     {uploadProgress ?? 0}%
        //                 </span>
        //                 <Loader2 className="size-5 animate-spin text-primary" />
        //             </>
        //         )}
        //         <AddAttachmentButton
        //             onFilesSelected={startUpload}
        //             disabled={isUploading || attachments.length > 5}
        //         />
        //         <LoadingButton
        //             loading={mutation.isPending}
        //             onClick={onSubmit}
        //             disabled={!input.trim() || isUploading}
        //             className="min-w-20"
        //         >
        //             Post
        //         </LoadingButton>
        //     </div>
        // </div>
    )
}

interface AddAttachmentButtonProps {
    onFilesSelected: (files: File[]) => void
    disabled: boolean
}

function AddAttachmentButton({ disabled, onFilesSelected }: AddAttachmentButtonProps) {
    const fileInoutRef = useRef<HTMLInputElement>(null)
    return (
        <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-600 dark:text-slate-400 dark:hover:text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                    onClick={() => fileInoutRef.current?.click()}
                    disabled={disabled}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Media
                </Button>
            </motion.div>
            <input
                type="file"
                accept="image/*, video/*"
                multiple
                ref={fileInoutRef}
                className="hidden sr-only"
                onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length) {
                        onFilesSelected(files)
                        e.target.value = ''
                    }
                }}
            />
        </>
    )
}

interface AttachmentPreviewsProps {
    attachments: Attachment[]
    removeAttachment: (fileName: string) => void
}

function AttachmentPreviews({ attachments, removeAttachment }: AttachmentPreviewsProps) {
    return (
        <div className={cn("flex flex-col gap-3", attachments.length > 1 && 'sm:grid sm:grid-cols-2')}>
            {attachments.map(attachment => (
                <AttachmentPreview
                    key={attachment.file.name}
                    attachment={attachment}
                    onRemoeClick={() => removeAttachment(attachment.file.name)}
                />
            ))}
        </div>
    )

}

interface AttachmentPreviewProps {
    attachment: Attachment
    onRemoeClick: () => void
}

function AttachmentPreview({ attachment: { file, mediaId, isUploading }, onRemoeClick }: AttachmentPreviewProps) {
    const src = URL.createObjectURL(file)
    return (
        <div className={cn("relative mx-auto size-fit", isUploading && 'opacity-50')}>
            {file.type.startsWith("image") ? (
                <Image
                    src={src}
                    alt="Attachment preview"
                    width={500}
                    height={500}
                    className="size-fit max-h-[30rem] rounded-2xl"
                />
            ) : (
                <video controls className="size-fit max-h-[30rem] rounded-2xl">
                    <source src={src} type={file.type} />
                </video>
            )}
            {!isUploading && (
                <button
                    onClick={onRemoeClick}
                    className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
                >
                    <X size={20} />
                </button>
            )}
        </div>
    )
}