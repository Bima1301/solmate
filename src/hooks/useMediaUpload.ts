
import { useUploadThing } from "@/lib/uploadthing"
import { useState } from "react"
import { toast } from "sonner"

export interface Attachment {
    file: File,
    mediaId?: string
    isUploading: boolean
}

export default function useMediaUpload() {
    const [attachments, setAttachments] = useState<Attachment[]>([])

    const [uploadProgress, setUploadProgress] = useState<number>()

    const { startUpload, isUploading } = useUploadThing('attachment', {
        onBeforeUploadBegin(files) {
            const renamedFiles = files.map((file) => {
                const extention = file.name.split('.').pop()
                return new File(
                    [file],
                    `attachment_${crypto.randomUUID()}.${extention}`,
                    {
                        type: file.type
                    }
                )
            })

            setAttachments(prev => [
                ...prev,
                ...renamedFiles.map(file => ({ file, isUploading: true }))
            ])

            return renamedFiles;
        },
        onUploadProgress: setUploadProgress,
        onClientUploadComplete(res) {
            setAttachments(prev => prev.map(attach => {
                const uploadResult = res.find(result => result.name === attach.file.name)

                if (!uploadResult) return attach

                return {
                    ...attach,
                    mediaId: uploadResult.serverData.mediaId,
                    isUploading: false
                }
            }))
        },
        onUploadError(error) {
            setAttachments(prev => prev.filter((attach) => !attach.isUploading));
            toast.error(error.message)
        }
    })

    function handleStartUpload(files: File[]) {
        if (isUploading) {
            toast.error('Please wait for the current upload to complete')
            return
        }

        if (attachments.length + files.length > 5) {
            toast.error('You can only upload up to 5 files')
            return
        }

        startUpload(files)
    }

    function removeAttachment(fileName: string) {
        setAttachments(prev => prev.filter(attach => attach.file.name !== fileName))
    }

    function reset() {
        setAttachments([])
        setUploadProgress(undefined)
    }

    return {
        startUpload: handleStartUpload,
        attachments,
        isUploading,
        uploadProgress,
        removeAttachment,
        reset
    }
}
