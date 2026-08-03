"use client"

import { useState } from "react"
import KanbanBoardHeader from "./KanbanBoardHeader"
import KanbanBoardContent from "./KanbanBoardContent"
import ArchivedTasksModal from "./ArchivedTasksModal"
import { useBoard } from "@/hooks/useBoard"
import type { Card } from "@/types"

export default function KanbanBoard() {
    const {
        lists,
        boardName,
        addCard,
        cancelAddingCard,
        moveCardFromDropResult,
        updateCardField,
        archiveCard,
        restoreCard,
        deleteCard,
    } = useBoard()
    const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false)

    // Get archived tasks and include their column (list) title
    const archivedCards: Card[] = lists.flatMap(
        (list) =>
            list.cards.filter((card) => card.archived && !card.deleted).map((card) => ({ ...card, listTitle: list.title })), // Add listTitle dynamically
    )

    return (
        <div className="rounded-xl shadow-sm bg-white dark:bg-slate-800 overflow-hidden">
            <KanbanBoardHeader boardName={boardName} onShowArchived={() => setIsArchivedModalOpen(true)} />
            <div className="p-4 md:p-6">
                <KanbanBoardContent
                    lists={lists}
                    onAddCard={addCard}
                    onCancelAddCard={cancelAddingCard}
                    onMoveCard={moveCardFromDropResult}
                    onUpdateField={updateCardField}
                    onArchive={archiveCard}
                    onDelete={deleteCard}
                />
            </div>

            {/* Archived Tasks Modal */}
            {isArchivedModalOpen && (
                <ArchivedTasksModal
                    archivedTasks={archivedCards}
                    onClose={() => setIsArchivedModalOpen(false)}
                    onRestore={restoreCard}
                    onDelete={deleteCard}
                />
            )}
        </div>
    )
}
