import TrendsSidebar from "@/components/layout/TrendsSidebar";
import Bookmarks from "@/components/views/(main)/bookmark/Bookmarks";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bookmarks",
}

export default function page() {
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <div className="rounded-2xl bg-card p-5 shadow-sm border dark:border-slate-700 border-slate-200">
                    <h1 className="text-center text-2xl font-bold">
                        Bookmarks
                    </h1>
                </div>
                <Bookmarks />
            </div>
            <TrendsSidebar />
        </main>
    )
}
