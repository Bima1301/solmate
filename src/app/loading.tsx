import React from 'react'
import { Sparkles } from 'lucide-react'

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center shadow-lg animate-stop-go-rotate">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-lg font-semibold text-slate-800 dark:text-white animate-pulse">
                    Loading...
                </div>
            </div>
        </div>
    )
}
