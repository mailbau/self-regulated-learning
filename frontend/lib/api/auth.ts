import type { User } from "@/types"
import { apiRequest, publicRequest, getAccessToken, setAccessToken } from "./client"

export interface LoginResponse {
    token: string
    role: string
}

export interface MessageResponse {
    message: string
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    return publicRequest<LoginResponse>("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })
}

export async function register(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
): Promise<MessageResponse> {
    return publicRequest<MessageResponse>("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, username, password }),
    })
}

export async function logout(): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/api/logout", { method: "POST" })
}

export async function requestReset(email: string): Promise<MessageResponse> {
    return publicRequest<MessageResponse>("/api/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
}

export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    return publicRequest<MessageResponse>("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
    })
}

export async function getCurrentUser(): Promise<User> {
    const token = getAccessToken()
    if (!token) {
        throw new Error("No token found")
    }

    let userId: string
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        userId = payload.sub
    } catch {
        setAccessToken(null)
        throw new Error("Invalid token format")
    }

    return apiRequest<User>(`/users/id/${userId}`)
}

export async function updateProfile(userData: {
    first_name: string
    last_name: string
    email: string
    username: string
}): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    })
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    })
}
