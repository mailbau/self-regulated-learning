export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }
}

let accessToken: string | null = null

export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    if (!accessToken) {
        accessToken = localStorage.getItem("token")
    }
    return accessToken
}

export function setAccessToken(token: string | null) {
    accessToken = token
    if (token) {
        localStorage.setItem("token", token)
    } else {
        localStorage.removeItem("token")
    }
}

export function loadAccessTokenFromStorage() {
    const token = localStorage.getItem("token")
    if (token) {
        accessToken = token
    }
}

export async function authorizedFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    const token = getAccessToken()
    if (!token) {
        throw new ApiError("No access token available", 401)
    }

    const response = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    })

    if (response.status === 401) {
        setAccessToken(null)
    }

    return response
}

async function extractErrorMessage(response: Response): Promise<string> {
    try {
        const body = await response.json()
        return body?.message || body?.error || response.statusText
    } catch {
        return response.statusText || `Request failed with status ${response.status}`
    }
}

/** Parses a JSON response, throwing an ApiError with a readable message on failure. */
export async function parseJson<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new ApiError(await extractErrorMessage(response), response.status)
    }
    return response.json() as Promise<T>
}

/** Issues an authenticated request and returns parsed JSON, throwing ApiError on failure. */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await authorizedFetch(`${API_URL}${path}`, init)
    return parseJson<T>(response)
}

/** Issues an unauthenticated request (login/register/etc.) and returns parsed JSON. */
export async function publicRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, init)
    return parseJson<T>(response)
}
