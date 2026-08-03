"use client"

import { useState } from "react"
import AnalyticsModal from "@/components/analytics/AnalyticsModal"
import { BarChart3, Archive } from "lucide-react"

interface KanbanBoardHeaderProps {
    boardName: string
    onShowArchived: () => void
}

export default function KanbanBoardHeader({ boardName, onShowArchived }: KanbanBoardHeaderProps) {
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 border-b border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {boardName || "Loading Board..."}
            </h1>
            <div className="flex gap-3">
                <button
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg border border-indigo-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    onClick={() => setIsAnalyticsOpen(true)}
                >
                    <BarChart3 size={18} />
                    <span className="hidden sm:inline">Analytics</span>
                </button>
                <button
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg border border-purple-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    onClick={onShowArchived}
                >
                    <Archive size={18} />
                    <span className="hidden sm:inline">Archived</span>
                </button>
            </div>

            <AnalyticsModal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
        </div>
    )
}
