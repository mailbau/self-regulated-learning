"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"
import { api } from "@/lib/api"
import { setAccessToken } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

interface UseAuthOptions {
    /** Path to redirect to when there's no authenticated user. Omit to skip the guard. */
    redirectTo?: string
}

export function useAuth({ redirectTo }: UseAuthOptions = {}) {
    const router = useRouter()
    const { toast } = useToast()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        const loadUser = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
            if (!token) {
                if (redirectTo) router.push(redirectTo)
                if (active) setLoading(false)
                return
            }

            try {
                const currentUser = await api.getCurrentUser()
                if (active) setUser(currentUser)
            } catch {
                setAccessToken(null)
                if (redirectTo) router.push(redirectTo)
            } finally {
                if (active) setLoading(false)
            }
        }

        loadUser()
        return () => {
            active = false
        }
    }, [router, redirectTo])

    const login = useCallback(async (username: string, password: string) => {
        const { token } = await api.login(username, password)
        setAccessToken(token)
        const currentUser = await api.getCurrentUser()
        setUser(currentUser)
        return currentUser
    }, [])

    const logout = useCallback(async () => {
        try {
            await api.logout()
        } catch (err) {
            toast({
                title: "Logout may not have fully completed",
                description: err instanceof Error ? err.message : "The server could not be reached.",
                variant: "destructive",
            })
        } finally {
            setAccessToken(null)
            setUser(null)
            router.push("/login")
        }
    }, [router, toast])

    return { user, loading, login, logout }
}
