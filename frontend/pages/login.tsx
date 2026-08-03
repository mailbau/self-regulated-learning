"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Player from "@/components/LottiePlayer"
import { api, isDemoMode } from "@/lib/api"
import { setAccessToken, ApiError } from "@/lib/api/client"
import { enterDemoSession, type DemoRole } from "@/lib/demo/enterDemoSession"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, LockKeyhole, User, Loader2 } from "lucide-react"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [demoLoadingRole, setDemoLoadingRole] = useState<DemoRole | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleDemoLogin = async (role: DemoRole) => {
        setDemoLoadingRole(role)
        setError(null)
        try {
            await enterDemoSession(role)
            router.push(role === "admin" ? "/admin" : "/board")
        } catch {
            setError("Couldn't start the demo. Please try again.")
            setDemoLoadingRole(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const data = await api.login(username, password)
            setAccessToken(data.token)

            if (data.role === "admin") {
                router.push("/admin")
            } else {
                router.push("/board")
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Connection error. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted pt-4 sm:pt-8 px-4">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <Image
                    src="/logogamatutor.png"
                    alt="GAMATUTOR Logo"
                    width={32}
                    height={32}
                />
                <span className="font-bold text-xl">GAMATUTOR.ID</span>
            </div>

            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left side - Animation (shown only in landscape orientation) */}
                <div className="landscape-only w-full lg:w-1/2 flex flex-col items-center">
                    <div className="relative w-full max-w-md">
                        <Player
                            src="https://assets7.lottiefiles.com/packages/lf20_87uabjh2.json"
                            className="w-full h-full"
                            loop
                            autoplay
                        />
                    </div>
                    <div className="text-center mt-4 space-y-2">
                        <h2 className="text-2xl font-bold">Welcome Back!</h2>
                        <p className="text-muted-foreground max-w-md">
                            Log in to access your personalized learning experience and continue your educational journey.
                        </p>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full lg:w-1/2 max-w-md">
                    {isDemoMode && (
                        <Card className="border-muted/60 shadow-lg mb-4">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Just here to look around?</CardTitle>
                                <CardDescription>Skip the form and try the demo instantly.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => handleDemoLogin("student")}
                                    disabled={demoLoadingRole !== null}
                                >
                                    {demoLoadingRole === "student" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    🎓 Try as Student
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleDemoLogin("admin")}
                                    disabled={demoLoadingRole !== null}
                                >
                                    {demoLoadingRole === "admin" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    🛠️ Try as Admin
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                    <Card className="border-muted/60 shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive" className="text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            placeholder="Enter your username"
                                            className="pl-9"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="pl-9"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full" disabled={loading || !username || !password}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>

                                <div className="text-center text-sm">
                                    Don't have an account?{" "}
                                    <Link href="/register" className="text-primary font-medium hover:underline">
                                        Create an account
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

