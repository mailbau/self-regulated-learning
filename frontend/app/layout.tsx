import "@/styles/globals.css"
import type { Metadata } from "next"
import type React from "react"
import AppProviders from "@/components/AppProviders"

export const metadata: Metadata = {
    title: "GAMATUTOR.ID — Kanban Learning Board",
    description: "A self-regulated learning Kanban board for university students.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
            <body className="h-full flex flex-col">
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    )
}
