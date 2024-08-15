'use client'
import { useSession } from '@/context/SessionProvider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from 'lucide-react'
import { logout } from '@/actions/logout/action'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useQueryClient } from '@tanstack/react-query'

interface UserButtonProps {
    className?: string
}

export default function UserButton({ className }: UserButtonProps) {
    const { user } = useSession()
    const { theme, setTheme } = useTheme()
    const queryClient = useQueryClient();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn("flex-none rounded-full", className)}>
                <UserAvatar avatarUrl={user.avatarUrl} size={40} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-[8px]'>
                <DropdownMenuLabel className='font-normal'>
                    Logged in as @<strong>{user.username}</strong>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/users/${user.username}`}>
                    <DropdownMenuItem className='rounded-[8px] cursor-pointer'>
                        <UserIcon className='mr-2 size-4' />
                        Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Monitor className='mr-2 size-4' />
                        Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent className='rounded-[8px]'>
                            <DropdownMenuItem
                                className='rounded-[8px] cursor-pointer'
                                onClick={() => {
                                    setTheme('system')
                                }}
                            >
                                <Monitor className='mr-2 size-4' />
                                System Default
                                {theme === 'system' && <Check className='ms-2 size-3' />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className='rounded-[8px] cursor-pointer'
                                onClick={() => {
                                    setTheme('light')
                                }}
                            >
                                <Sun className='mr-2 size-4' />
                                Light
                                {theme === 'light' && <Check className='ms-2 size-3' />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className='rounded-[8px] cursor-pointer'
                                onClick={() => {
                                    setTheme('dark')
                                }}
                            >
                                <Moon className='mr-2 size-4' />
                                Dark
                                {theme === 'dark' && <Check className='ms-2 size-3' />}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='rounded-[8px] cursor-pointer'
                    onClick={() => {
                        queryClient.clear();
                        logout()
                    }}
                >
                    <LogOutIcon className='mr-2 size-4' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
