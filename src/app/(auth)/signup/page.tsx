import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
    title: "Sign Up",
}

export default function SignUp() {
    return (
        <main className='flex h-screen items-center justify-center p-5'>
            <div className='flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card shadow-2xl'>
                <div className='md:w-1/2 w-full space-y-10 overflow-y-auto p-10'>
                    <div className='space-y-1 text-center'>
                        <h1 className='text-3xl font-bold'>
                            Sign Up to Solmate
                        </h1>
                        <p className='text-muted-foreground'>
                            A simple and minimalistic social media platform for everyone.
                        </p>
                    </div>
                    <div className='space-y-5'>
                        form
                        <div className='flex flex-row items-center gap-3 font-light text-sm'>
                            <p>Already have an account?</p>
                            <Link href='/login' className='block text-center hover:underline'>
                                Log in here.
                            </Link>
                        </div>
                    </div>
                </div>
                <Image
                    src={'/images/signup-image.jpg'}
                    alt='Sign Up'
                    width={1920}
                    height={1080}
                    className='w-1/2 hidden md:block object-cover'
                />
            </div>
        </main>
    )
}
