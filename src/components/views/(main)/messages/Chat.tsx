"use client"

import useInitializeChatClient from '@/hooks/useInitializeChatClient'
import { Loader2 } from 'lucide-react'
import { Chat as StreamChat, useChatContext } from "stream-chat-react"
import ChatSidebar from './ChatSidebar'
import ChatChannel from './ChatChannel'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export default function Chat() {
    const chatClient = useInitializeChatClient()

    const { resolvedTheme } = useTheme()

    const [sidebarOpen, setSidebarOpen] = useState(true)

    if (!chatClient) {
        return <Loader2 className='mx-auto my-3 animate-spin' />
    }

    return (
        <main className='relative w-full h-[calc(100vh-8rem)] overflow-hidden rounded-2xl dark:border-slate-700 dark:bg-slate-800/90 dark:hover:shadow-slate-900/20 border-slate-200 bg-white/90'>
            <div className='absolute inset-0 flex w-full h-full'>
                <StreamChat
                    client={chatClient}
                    theme={
                        resolvedTheme === 'dark' ? "str-chat__theme-dark" : "str-chat__theme-light"
                    }
                >
                    <ChatSidebar
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <ChatChannel
                        open={!sidebarOpen}
                        openSidebar={() => setSidebarOpen(true)}
                    />
                </StreamChat>
            </div>
        </main>
    )
}
