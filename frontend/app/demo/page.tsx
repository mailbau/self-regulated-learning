"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { GraduationCap, Github, Loader2, ShieldCheck, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { enterDemoSession } from "@/lib/demo/enterDemoSession"

const GITHUB_URL = "https://github.com/mailbau/self-regulated-learning"

export default function DemoLanding() {
    const router = useRouter()
    const [loadingRole, setLoadingRole] = useState<"student" | "admin" | null>(null)
    const [error, setError] = useState<string | null>(null)

    const enterDemo = async (role: "student" | "admin") => {
        setLoadingRole(role)
        setError(null)
        try {
            await enterDemoSession(role)
            router.push(role === "admin" ? "/admin" : "/board")
        } catch {
            setError("Couldn't start the demo. Please try again.")
            setLoadingRole(null)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <Image src="/logogamatutor.png" alt="GAMATUTOR Logo" width={32} height={32} />
                <span className="font-bold text-xl">GAMATUTOR.ID</span>
            </div>

            <div className="w-full max-w-3xl text-center mb-8 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                    <Sparkles className="h-4 w-4" />
                    No account, no backend, no setup
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Try the Kanban Learning Board
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Explore a self-regulated learning board with realistic sample data, from either
                    side of the app. No account needed.
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="max-w-md mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 sm:grid-cols-2 w-full max-w-3xl">
                <Card className="border-muted/60 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">🎓</div>
                            <CardTitle>Try as Student</CardTitle>
                        </div>
                        <CardDescription>
                            Manage a personal Kanban board across Planning, Monitoring, Controlling, and
                            Reflection — with pre-filled courses, checklists, grades, and analytics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => enterDemo("student")} disabled={loadingRole !== null}>
                            {loadingRole === "student" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Try as Student
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-muted/60 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">🛠️</div>
                            <CardTitle>Try as Admin</CardTitle>
                        </div>
                        <CardDescription>
                            Manage courses and learning strategies, browse student boards and card
                            movement history, and review system logs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => enterDemo("admin")}
                            disabled={loadingRole !== null}
                        >
                            {loadingRole === "admin" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Try as Admin
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 text-sm text-muted-foreground max-w-md text-center">
                <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Your changes are saved locally in your browser for this session — nothing is sent to a server.
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">
                        <GraduationCap className="h-4 w-4" />
                        Go to the real login page
                    </Link>
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                        <Github className="h-4 w-4" />
                        View on GitHub
                    </a>
                </div>
            </div>
        </div>
    )
}
