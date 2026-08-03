import type { ColumnMovement, Links } from "@/types"
import { apiRequest } from "./client"
import type { MessageResponse } from "./auth"

export async function updateLinks(cardId: string, links: string[]): Promise<{ links: Links[] }> {
    return apiRequest<{ links: Links[] }>(`/api/cards/${cardId}/links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links }),
    })
}

export async function getCardMovements(cardId: string): Promise<ColumnMovement[]> {
    return apiRequest<ColumnMovement[]>(`/api/cards/${cardId}/get-movements`)
}

export async function createCardMovement(
    cardId: string,
    fromColumn: string,
    toColumn: string
): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/api/cards/${cardId}/create-movements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_column: fromColumn, to_column: toColumn }),
    })
}
