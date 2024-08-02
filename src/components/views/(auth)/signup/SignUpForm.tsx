"use client"

import { signupSchema, SignUpValues } from "@/lib/validation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState, useTransition } from "react"
import { signUp } from "../../../../app/(auth)/signup/actions"
import { useToast } from "@/components/ui/use-toast"
import { PasswordInput } from "@/components/secondary/PasswordInput"
import LoadingButton from "@/components/secondary/LoadingButton"

export default function SignUpForm() {
    const [error, setError] = useState<string>();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        }
    })

    async function onSubmit(values: SignUpValues) {
        setError(undefined);
        startTransition(async () => {
            const { error } = await signUp(values)
            if (error) {
                setError(error)
            }
        })
    }

    useEffect(() => {
        if (error) {
            console.log(error)
            toast({
                title: "Uh oh! Something went wrong.",
                description: error,
            })
        }
    }, [error, toast])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-3 space-y-2">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <FormControl>
                                <Input {...field} id="username" placeholder="Username" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                                <Input {...field} id="username" placeholder="Email" type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} id="username" placeholder="Password" type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <LoadingButton
                    loading={isPending}
                    type="submit" className="w-full">
                    Create Account
                </LoadingButton>
            </form>
        </Form>
    )
}
