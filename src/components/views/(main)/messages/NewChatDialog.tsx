import UserAvatar from "@/components/layout/UserAvatar"
import LoadingButton from "@/components/secondary/LoadingButton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSession } from "@/context/SessionProvider"
import useDebounce from "@/hooks/useDebounce"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Check, Loader2, Search, SearchIcon, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { UserResponse } from "stream-chat"
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react"

interface NewChatDialogProps {
    onOpenChange: (open: boolean) => void
    onChatCreated: () => void
}

export default function NewChatDialog({ onChatCreated, onOpenChange }: NewChatDialogProps) {
    const { client, setActiveChannel } = useChatContext()

    const { user: loggedInUser } = useSession()

    const [searchInput, setSearchInput] = useState("")

    const searchInputDebounce = useDebounce(searchInput, 250)

    const [selectedUsers, setSelectedUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>([])

    const { data, isFetching, isError, isSuccess } = useQuery({
        queryKey: ['stream-users', searchInputDebounce],
        queryFn: async () => client.queryUsers(
            {
                id: { $ne: loggedInUser.id },
                role: { $ne: "admin" },
                ...(searchInputDebounce ? {
                    $or: [
                        {
                            name: { $autocomplete: searchInputDebounce }
                        },
                        {
                            username: { $autocomplete: searchInputDebounce }
                        }
                    ]
                } : {})
            },
            { name: 1, username: 1 },
            { limit: 15 }
        )
    })

    const mutation = useMutation({
        mutationFn: async () => {
            const channel = client.channel("messaging", {
                members: [loggedInUser.id, ...selectedUsers.map(user => user.id)],
                name: selectedUsers.length > 1 ? loggedInUser.displayName + ", " + selectedUsers.map(user => user.name).join(", ") : undefined
            })

            await channel.create()
            return channel
        },
        onSuccess: (channel) => {
            setActiveChannel(channel)
            onChatCreated()
        },
        onError: (error) => {
            console.error("Error starting chat", error)
            toast.error("Failed to create chat. Please try again.")
        }
    })

    return (
        <Dialog
            open
            onOpenChange={onOpenChange}
        >
            <DialogContent className="rounded-[8px]">
                <DialogHeader className="pt-6 px-0">
                    <DialogTitle>
                        New Chat
                    </DialogTitle>
                </DialogHeader>
                <div >
                    <div className="relative mb-5" >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search Sol Mate..."
                            className="pl-10 transition-all duration-300 bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:focus:bg-slate-700 dark:focus:border-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    {!!selectedUsers.length && (
                        <div className=" mt-4 flex flex-wrap gap-2 p-2">
                            {selectedUsers.map(user => (
                                <SelectedUserTag
                                    key={user.id}
                                    user={user}
                                    onRemove={() => {
                                        setSelectedUsers(prev => prev.filter(u => u.id !== user.id))
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <hr />
                    <div className="h-96 overflow-y-auto">
                        {isSuccess && data.users.map(user => <UserResult
                            key={user.id}
                            user={user}
                            selected={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
                            onClick={() => {
                                setSelectedUsers(prev => prev.some(u => u.id === user.id) ? prev.filter(u => u.id !== user.id) : [...prev, user])
                            }}
                        />)}
                        {isSuccess && !data.users.length && (
                            <p className="my-3 text-center text-muted-foreground">
                                No users found. Try a different search.
                            </p>
                        )}
                        {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
                        {isError && (
                            <p className="my-3 text-center text-destructive">
                                An error occurred while loading users.
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter className="px-0 md:pb-6 pb-3">
                    <LoadingButton
                        disabled={!selectedUsers.length}
                        onClick={() => mutation.mutate()}
                        loading={mutation.isPending}
                    >
                        Start Chat
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface UserResultProps {
    user: UserResponse<DefaultStreamChatGenerics>
    selected: boolean
    onClick: () => void
}

function UserResult({ user, selected, onClick }: UserResultProps) {
    return (
        <button
            className="flex w-full items-center justify-between px-4 py-1.5 transition-colors hover:bg-muted50"
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                <UserAvatar
                    avatarUrl={user.image}
                    className="md:size-8 size-5"
                />
                <div className="flex flex-col text-start">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-muted-foreground">@{user.username}</p>
                </div>
            </div>
            {selected && (
                <Check className="size-5 text-green-500" />
            )}
        </button>
    )
}

interface SelectedUserTagProps {
    user: UserResponse<DefaultStreamChatGenerics>
    onRemove: () => void
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
    return (
        <button className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50" onClick={onRemove}>
            <UserAvatar
                avatarUrl={user.image}
                size={24}
            />
            <p className="font-bold">{user.name}</p>
            <X className="mx-2 size-5 text-muted-foreground" />
        </button>
    )
}