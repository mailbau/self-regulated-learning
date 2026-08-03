import type { Card } from "./card"

export interface List {
    id: string
    title: string
    cards: Card[]
    isAddingCard: boolean
}

export interface Board {
    id: string
    name: string
    lists: List[]
}
