"use client"

import { useCallback, useEffect, useState } from "react"
import type { ProgressReport } from "@/types"
import { api } from "@/lib/api"
import { ApiError } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

/** Fetches the progress report whenever `enabled` becomes true (e.g. a dashboard modal opening). */
export function useAnalytics(enabled: boolean) {
    const { toast } = useToast()
    const [report, setReport] = useState<ProgressReport | null>(null)
    const [loading, setLoading] = useState(true)

    const refresh = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.getProgressReport()
            setReport(data)
        } catch (err) {
            toast({
                title: "Couldn't load analytics",
                description: err instanceof ApiError ? err.message : "Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        if (enabled) {
            refresh()
        }
    }, [enabled, refresh])

    return { report, loading, refresh }
}
