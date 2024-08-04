"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SearchField() {
    const router = useRouter()

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const search = (form.search as HTMLInputElement).value.trim()
        if (!search) return;
        router.push(`/search?q=${encodeURIComponent(search)}`)
    }

    return (
        <form onSubmit={handleSubmit} method="GET" action={"/search"}>
            <div className="relative bg-white/10 dark:bg-black rounded-full overflow-hidden">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                    name="search"
                    placeholder="Search"
                    className="ps-11 bg-transparent border-none"
                />
            </div>
        </form>
    )
}
