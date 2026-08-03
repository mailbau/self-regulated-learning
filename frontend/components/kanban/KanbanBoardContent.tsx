"use client"

import { useState } from "react"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
import type { Card, Difficulty, List } from "@/types"
import { COLUMN_TITLES } from "@/lib/constants"
import KanbanColumn from "./KanbanColumn"
import CardDetail from "./CardDetail/CardDetail"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface KanbanBoardContentProps {
    lists: List[]
    onAddCard: (listId: string, courseCode: string, courseName: string, material: string, difficulty: Difficulty) => void
    onCancelAddCard: (listId: string) => void
    onMoveCard: (result: DropResult) => void
    onUpdateField: <K extends keyof Card>(cardId: string, field: K, value: Card[K]) => void
    onArchive: (cardId: string) => void
    onDelete: (cardId: string) => void
}

export default function KanbanBoardContent({
    lists,
    onAddCard,
    onCancelAddCard,
    onMoveCard,
    onUpdateField,
    onArchive,
    onDelete,
}: KanbanBoardContentProps) {
    const [selectedCard, setSelectedCard] = useState<{ listId: string; card: Card } | null>(null)
    const [showNotesAlert, setShowNotesAlert] = useState(false)
    const [pendingMove, setPendingMove] = useState<DropResult | null>(null)

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (!destination) return

        // Check if moving to Reflection column
        const destinationList = lists.find(list => list.id === destination.droppableId)
        if (destinationList?.title === COLUMN_TITLES.REFLECTION) {
            const sourceList = lists.find(list => list.id === source.droppableId)
            const card = sourceList?.cards[source.index]

            if (!card?.notes) {
                setPendingMove(result)
                setShowNotesAlert(true)
                return
            }
        }

        onMoveCard(result)
    }

    const handleNotesAlertConfirm = () => {
        if (pendingMove) {
            const { source } = pendingMove
            const sourceList = lists.find(list => list.id === source.droppableId)
            const card = sourceList?.cards[source.index]
            if (card) {
                setSelectedCard({ listId: source.droppableId, card })
            }
        }
        setShowNotesAlert(false)
        setPendingMove(null)
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex h-full">
                <div className="flex flex-grow gap-4 overflow-x-auto pb-4 px-1 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-transparent bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4QkE2Q2EiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTYgNmg2djZoLTZ2LTZ6bS02IDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTEyIDZoNnY2aC02di02em0wLTEyaDZ2LTZoLTZ2NnoiLz48L2c+PC9nPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTYgNmg2djZoLTZ2LTZ6bS02IDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTEyIDZoNnY2aC02di02em0wLTEyaDZ2LTZoLTZ2NnoiLz48L2c+PC9nPjwvc3ZnPg==')]">
                    {lists.map((list) => (
                        <KanbanColumn
                            key={list.id}
                            id={list.id}
                            title={list.title}
                            cards={list.cards.filter((card) => !card.archived && !card.deleted)}
                            isAddingCard={list.isAddingCard}
                            onAddCard={onAddCard}
                            onCardClick={(listId, card) => setSelectedCard({ listId, card })}
                            onCancelAddCard={onCancelAddCard}
                        />
                    ))}
                </div>
            </div>

            {selectedCard && (
                <CardDetail
                    listName={lists.find((list) => list.id === selectedCard.listId)?.title || ""}
                    card={selectedCard.card}
                    onClose={() => setSelectedCard(null)}
                    onUpdateField={onUpdateField}
                    onArchive={(cardId) => {
                        onArchive(cardId)
                        setSelectedCard(null)
                    }}
                    onDelete={(cardId) => {
                        onDelete(cardId)
                        setSelectedCard(null)
                    }}
                />
            )}

            <AlertDialog open={showNotesAlert} onOpenChange={setShowNotesAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Notes Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please add your learning notes/summary before moving this task to the Reflection column. This helps track your learning progress and understanding.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowNotesAlert(false)
                            setPendingMove(null)
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleNotesAlertConfirm}>Add Notes Now</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DragDropContext>
    )
}
