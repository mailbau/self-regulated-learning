"use client"

import type React from "react"
import { useEffect } from "react"
import { loadAccessTokenFromStorage } from "@/lib/api/client"
import DemoBanner from "@/components/DemoBanner"
import { Toaster } from "@/components/ui/toaster"

export default function AppProviders({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        loadAccessTokenFromStorage()
    }, [])

    return (
        <>
            <DemoBanner />
            {children}
            <Toaster />
        </>
    )
}
