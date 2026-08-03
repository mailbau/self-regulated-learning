"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { DropResult } from "react-beautiful-dnd"
import type { Card, Difficulty, List, MoveCardEvent } from "@/types"
import { api } from "@/lib/api"
import { ApiError } from "@/lib/api/client"
import { DEFAULT_LEARNING_STRATEGY } from "@/lib/constants"
import { useToast } from "@/hooks/use-toast"

export function useBoard() {
    const router = useRouter()
    const { toast } = useToast()
    const [lists, setLists] = useState<List[]>([])
    const [boardId, setBoardId] = useState<string | null>(null)
    const [boardName, setBoardName] = useState<string>("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        const loadBoard = async () => {
            try {
                const board = await api.getBoard()
                if (!active) return
                setLists(board.lists)
                setBoardId(board.id)
                setBoardName(board.name)
            } catch {
                router.push("/login")
            } finally {
                if (active) setLoading(false)
            }
        }

        loadBoard()
        return () => {
            active = false
        }
    }, [router])

    const persist = useCallback(
        async (nextLists: List[], id: string | null) => {
            if (!id) return
            try {
                await api.updateBoard(id, nextLists)
            } catch (err) {
                toast({
                    title: "Failed to save board",
                    description: err instanceof ApiError ? err.message : "Please check your connection and try again.",
                    variant: "destructive",
                })
            }
        },
        [toast]
    )

    const addCard = useCallback(
        (listId: string, courseCode: string, courseName: string, material: string, difficulty: Difficulty) => {
            const now = new Date().toISOString()
            const newCard: Card = {
                id: `${courseCode}-${courseName}-${material}`,
                title: `${courseName} [${courseCode}]`,
                sub_title: material,
                description: "",
                difficulty,
                priority: "medium",
                learning_strategy: DEFAULT_LEARNING_STRATEGY,
                created_at: now,
                column_movements: [{ fromColumn: "initial", toColumn: listId, timestamp: now }],
            }

            setLists((prev) => {
                const next = prev.map((list) => (list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list))
                persist(next, boardId)
                return next
            })
        },
        [boardId, persist]
    )

    const updateCardField = useCallback(
        <K extends keyof Card>(cardId: string, field: K, value: Card[K]) => {
            setLists((prev) => {
                const next = prev.map((list) => ({
                    ...list,
                    cards: list.cards.map((card) => (card.id === cardId ? { ...card, [field]: value } : card)),
                }))
                persist(next, boardId)
                return next
            })
        },
        [boardId, persist]
    )

    const moveCard = useCallback(
        (event: MoveCardEvent) => {
            setLists((prev) => {
                const sourceListIndex = prev.findIndex((list) => list.id === event.sourceListId)
                const destListIndex = prev.findIndex((list) => list.id === event.destListId)
                if (sourceListIndex < 0 || destListIndex < 0) return prev

                const sourceList = { ...prev[sourceListIndex], cards: [...prev[sourceListIndex].cards] }
                const destList =
                    sourceList.id === prev[destListIndex].id
                        ? sourceList
                        : { ...prev[destListIndex], cards: [...prev[destListIndex].cards] }

                const [movedCard] = sourceList.cards.splice(event.sourceIndex, 1)
                if (!movedCard) return prev

                if (sourceList.id === destList.id) {
                    sourceList.cards.splice(event.destIndex, 0, movedCard)
                } else {
                    destList.cards.splice(event.destIndex, 0, movedCard)
                    const now = new Date().toISOString()
                    movedCard.column_movements = [
                        ...(movedCard.column_movements || []),
                        { fromColumn: sourceList.id, toColumn: destList.id, timestamp: now },
                    ]
                    api.createCardMovement(movedCard.id, sourceList.id, destList.id).catch((err) => {
                        toast({
                            title: "Move wasn't recorded",
                            description:
                                err instanceof ApiError
                                    ? err.message
                                    : "The card moved, but its history may be out of date.",
                            variant: "destructive",
                        })
                    })
                }

                const next = [...prev]
                next[sourceListIndex] = sourceList
                next[destListIndex] = destList
                persist(next, boardId)
                return next
            })
        },
        [boardId, persist, toast]
    )

    const moveCardFromDropResult = useCallback(
        (result: DropResult) => {
            const { source, destination, draggableId } = result
            if (!destination) return

            moveCard({
                cardId: draggableId,
                sourceListId: source.droppableId,
                destListId: destination.droppableId,
                sourceIndex: source.index,
                destIndex: destination.index,
            })
        },
        [moveCard]
    )

    const archiveCard = useCallback((cardId: string) => updateCardField(cardId, "archived", true), [updateCardField])
    const restoreCard = useCallback((cardId: string) => updateCardField(cardId, "archived", false), [updateCardField])
    const deleteCard = useCallback((cardId: string) => updateCardField(cardId, "deleted", true), [updateCardField])

    const cancelAddingCard = useCallback((listId: string) => {
        setLists((prev) => prev.map((list) => (list.id === listId ? { ...list, isAddingCard: false } : list)))
    }, [])

    return {
        lists,
        setLists,
        boardId,
        boardName,
        loading,
        addCard,
        updateCardField,
        moveCard,
        moveCardFromDropResult,
        archiveCard,
        restoreCard,
        deleteCard,
        cancelAddingCard,
    }
}
