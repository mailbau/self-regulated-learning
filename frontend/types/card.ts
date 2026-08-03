export type Difficulty = "easy" | "medium" | "hard" | "expert"
export type Priority = "low" | "medium" | "high" | "critical"

export interface ChecklistItem {
    id: string
    text: string
    completed: boolean
}

export interface Checklists {
    id: string
    title: string
    items: ChecklistItem[]
}

export interface Links {
    id: string
    url: string
}

export interface ColumnMovement {
    fromColumn: string
    toColumn: string
    timestamp: string
}

export interface Card {
    id: string
    title: string
    sub_title: string
    description?: string
    difficulty: Difficulty
    priority: Priority
    learning_strategy: string
    archived?: boolean
    deleted?: boolean
    checklists?: Checklists[]
    links?: Links[]
    rating?: number
    notes?: string
    pre_test_grade?: string
    post_test_grade?: string
    created_at: string
    column_movements: ColumnMovement[]
}

export interface MoveCardEvent {
    cardId: string
    sourceListId: string
    destListId: string
    sourceIndex: number
    destIndex: number
}
