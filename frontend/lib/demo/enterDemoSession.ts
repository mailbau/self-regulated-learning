import { api } from "@/lib/api"
import { setAccessToken } from "@/lib/api/client"

export type DemoRole = "student" | "admin"

/** Logs into the fixed demo account for the given role and stores the resulting session token. */
export async function enterDemoSession(role: DemoRole): Promise<void> {
    const username = role === "admin" ? "demo_admin" : "demo_student"
    const { token } = await api.login(username, "demo")
    setAccessToken(token)
}
