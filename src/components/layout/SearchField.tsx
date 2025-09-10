"use client";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchField() {
    const router = useRouter();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const q = (form.q as HTMLInputElement).value.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`);
    }

    return (
        <form onSubmit={handleSubmit} method="GET" action="/search">
            <motion.div className="relative" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search Sol Mate..."
                    name="q"
                    className="pl-10 transition-all duration-300 bg-slate-50 border-slate-200 focus:bg-white focus:border-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:focus:bg-slate-700 dark:focus:border-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
            </motion.div>
        </form>
    );
}
