'use client'

import { Button } from "@/components/ui/button"
import { Bell, Bookmark, Home, Mail } from "lucide-react"
import Link from "next/link"
import { Icon } from '@iconify/react';

interface MenuBarProps {
    className?: string
}

export default function MenuBar({ className }: MenuBarProps) {
    return (
        <div className={className}>
            <Button
                variant={"ghost"}
                className="flex items-center justify-start gap-3 lg:hover:dark:bg-transparent lg:hover:bg-transparent hover:text-primary"
                title="Home"
                asChild
            >
                <Link href='/'>
                    <Icon icon='flat-color-icons:home' className="size-8" />
                    <span className="hidden lg:inline">
                        Home
                    </span>
                </Link>
            </Button>
            <Button
                variant={"ghost"}
                className="flex items-center justify-start gap-3 lg:hover:dark:bg-transparent lg:hover:bg-transparent hover:text-primary"
                title="Notifications"
                asChild
            >
                <Link href='/notifications'>
                    <Icon icon='noto-v1:bellhop-bell' className="size-8" />
                    <span className="hidden lg:inline">
                        Notifications
                    </span>
                </Link>
            </Button>
            <Button
                variant={"ghost"}
                className="flex items-center justify-start gap-3 lg:hover:dark:bg-transparent lg:hover:bg-transparent hover:text-primary"
                title="Messages"
                asChild
            >
                <Link href='/messages'>
                    <Icon icon='fluent-emoji-flat:closed-mailbox-with-raised-flag' className="size-8" />
                    <span className="hidden lg:inline">
                        Messages
                    </span>
                </Link>
            </Button>
            <Button
                variant={"ghost"}
                className="flex items-center justify-start gap-3 lg:hover:dark:bg-transparent lg:hover:bg-transparent hover:text-primary"
                title="Bookmarks"
                asChild
            >
                <Link href='/bookmarks'>
                    <Icon icon='emojione:bookmark' className="size-8" />
                    <span className="hidden lg:inline">
                        Bookmarks
                    </span>
                </Link>
            </Button>
        </div>
    )
}
