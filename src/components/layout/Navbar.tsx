import Link from 'next/link'
import React from 'react'
import UserButton from './UserButton'
import SearchField from './SearchField'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    return (
        <header className='sticky top-0 z-10 shadow bg-black dark:bg-gray-900 text-white'>
            <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3'>
                <Link href='/' className='font-extrabold text-3xl'>
                    Sol <span className='italic text-primary text-xl'>Mate</span>
                </Link>
                <SearchField />
                <UserButton className='sm:ms-auto' />
            </div>

        </header>
    )
}
