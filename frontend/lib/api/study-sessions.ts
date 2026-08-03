import type { StudySession, StudySessionsResponse } from "@/types"
import { apiRequest } from "./client"
import type { MessageResponse } from "./auth"

export async function getSessionsForCard(cardId: string): Promise<StudySessionsResponse> {
    return apiRequest<StudySessionsResponse>(`/api/study-sessions/card/${cardId}`)
}

export async function startSession(cardId: string): Promise<StudySession> {
    return apiRequest<StudySession>("/api/study-sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: cardId }),
    })
}

export async function endSession(sessionId: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/api/study-sessions/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
    })
}
