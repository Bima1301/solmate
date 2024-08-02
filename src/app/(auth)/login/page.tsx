import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LoginForm from '../../../components/views/(auth)/login/LoginForm'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
    title: "Login",
}

export default function Login() {
    return (
        <main className='flex h-screen items-center justify-center p-5'>
            <Toaster />
            <div className='flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-xl overflow-hidden bg-card shadow-2xl'>
                <div className='md:w-1/2 w-full md:space-y-10 space-y-8 overflow-y-auto md:p-10 p-8'>
                    <div className='space-y-1 text-center'>
                        <h1 className='md:text-3xl text-xl font-bold'>
                            Welcome to <span className='text-primary'>Solmate</span>
                        </h1>
                        <p className='text-muted-foreground md:text-sm text-xs'>
                            A simple and minimalistic social media platform for everyone.
                        </p>
                    </div>
                    <div className='md:space-y-5 space-y-3'>
                        <h3 className='text-center md:text-xl font-bold'>
                            Log in
                        </h3>
                        <LoginForm />
                        <div className='flex flex-row items-center justify-center gap-3 font-light md:text-sm text-xs'>
                            <p>Don&apos;t have an account?</p>
                            <Link href='/signup' className='block text-center hover:underline'>
                                Sign up here.
                            </Link>
                        </div>
                    </div>
                </div>
                <Image
                    src={'/images/login-image.webp'}
                    alt='Log in'
                    width={1920}
                    height={1080}
                    className='w-1/2 hidden md:block object-cover'
                />
            </div>
        </main>
    )
}
