import type { Board, List } from "@/types"
import { apiRequest } from "./client"
import type { MessageResponse } from "./auth"

export async function getBoard(): Promise<Board> {
    return apiRequest<Board>("/board")
}

export async function getBoardByUser(userId: string): Promise<Board> {
    return apiRequest<Board>(`/board/${userId}`)
}

export async function updateBoard(boardId: string, lists: List[]): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/update-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, lists }),
    })
}

export async function createBoard(name: string): Promise<Board> {
    return apiRequest<Board>("/create-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    })
}

export async function searchBoards(query: string): Promise<{ id: string; name: string }[]> {
    return apiRequest<{ id: string; name: string }[]>(`/search-boards?q=${encodeURIComponent(query)}`)
}
