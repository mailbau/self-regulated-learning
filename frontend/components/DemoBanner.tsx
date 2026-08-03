"use client"

import { useRouter } from "next/router"
import { FlaskConical } from "lucide-react"
import { isDemoMode } from "@/lib/api"
import { resetDemoData } from "@/lib/demo/storage"

export default function DemoBanner() {
    const router = useRouter()

    if (!isDemoMode) return null

    const handleReset = () => {
        resetDemoData()
        router.push("/demo")
    }

    return (
        <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-amber-400 px-4 py-1.5 text-center text-sm font-medium text-amber-950">
            <span className="flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4" />
                Demo Mode — data is stored locally in your browser
            </span>
            <button
                onClick={handleReset}
                className="rounded-md border border-amber-950/30 bg-amber-300 px-2 py-0.5 text-xs font-semibold hover:bg-amber-200 transition-colors"
            >
                Reset Demo Data
            </button>
        </div>
    )
}
