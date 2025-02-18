import type { ListType, Card } from "@/types";
import { getBoard, updateBoard } from "@/utils/api";
import { NextRouter } from "next/router";

export async function updateBoardState(boardId: string | null, lists: ListType[]) {
    if (!boardId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await updateBoard(token, boardId, lists);
        if (!response.ok) {
            console.error("Failed to update board:", await response.text());
        }
    } catch (error) {
        console.error("Error updating board:", error);
    }
}

export function addCard(
    lists: ListType[],
    setLists: React.Dispatch<React.SetStateAction<ListType[]>>,
    listId: string,
    courseCode: string,
    courseName: string,
    material: string,
    difficulty: "easy" | "medium" | "hard",
    boardId: string | null
) {
    const newCard: Card = {
        id: `${courseCode}-${courseName}-${material}`,
        title: `${courseName} [${courseCode}]`,
        sub_title: material,
        description: "",
        difficulty,
        priority: "medium",
        learning_strategy: "Learning Strategy 1",
    };

    const updatedLists = lists.map((list) =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
    );

    setLists(updatedLists);
    updateBoardState(boardId, updatedLists);
}

export function updateCard(
    lists: ListType[],
    setLists: React.Dispatch<React.SetStateAction<ListType[]>>,
    boardId: string | null,
    cardId: string,
    field: keyof Card,
    newValue: any
) {
    const updatedLists = lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) => (card.id === cardId ? { ...card, [field]: newValue } : card)),
    }));

    setLists(updatedLists);
    updateBoardState(boardId, updatedLists);
}

export function moveCard(
    lists: ListType[],
    setLists: React.Dispatch<React.SetStateAction<ListType[]>>,
    boardId: string | null,
    sourceIndex: number,
    destinationIndex: number,
    sourceDroppableId: string,
    destinationDroppableId: string
) {
    const sourceListIndex = lists.findIndex((list) => list.id === sourceDroppableId);
    const destListIndex = lists.findIndex((list) => list.id === destinationDroppableId);

    if (sourceListIndex < 0 || destListIndex < 0) return;

    const sourceList = { ...lists[sourceListIndex] };
    const destList = { ...lists[destListIndex] };

    const [movedCard] = sourceList.cards.splice(sourceIndex, 1);

    if (sourceList.id === destList.id) {
        sourceList.cards.splice(destinationIndex, 0, movedCard);
    } else {
        destList.cards.splice(destinationIndex, 0, movedCard);
    }

    const updatedLists = [...lists];
    updatedLists[sourceListIndex] = sourceList;
    updatedLists[destListIndex] = destList;

    setLists(updatedLists);
    updateBoardState(boardId, updatedLists);
}

export async function fetchBoardData(
    setLists: (lists: ListType[]) => void,
    setBoardId: (id: string | null) => void,
    setBoardName: (name: string) => void,
    router: NextRouter
) {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/login");
        return;
    }

    try {
        const response = await getBoard(token);
        if (!response.ok) {
            router.push("/login");
            return;
        }

        const data = await response.json();
        setLists(data.lists);
        setBoardId(data.id);
        setBoardName(data.name);
    } catch (error) {
        console.error("Error fetching board data:", error);
        router.push("/login");
    }
}