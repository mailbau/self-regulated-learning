"use client"

import { useCallback, useEffect, useState } from "react"
import type { Card } from "@/types"
import { api } from "@/lib/api"
import { ApiError } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

interface UseCardDetailOptions {
    card: Card
    onUpdateField: <K extends keyof Card>(cardId: string, field: K, value: Card[K]) => void
}

/** Wraps the per-card study timer/session tracking and field-update callbacks used by the card detail modal. */
export function useCardDetail({ card, onUpdateField }: UseCardDetailOptions) {
    const { toast } = useToast()
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [totalStudyMinutes, setTotalStudyMinutes] = useState(0)
    const [elapsedMinutes, setElapsedMinutes] = useState(0)
    const [startTime, setStartTime] = useState<Date | null>(null)

    const refreshSessions = useCallback(async () => {
        try {
            const data = await api.getSessionsForCard(card.id)
            setTotalStudyMinutes(data.total_study_time_minutes)

            const active = data.sessions.find((session) => !session.end_time)
            if (active) {
                setIsTimerActive(true)
                setCurrentSessionId(active._id)
                const start = new Date(active.start_time)
                setStartTime(start)
                setElapsedMinutes(Math.floor((Date.now() - start.getTime()) / 60000))
            }
        } catch (err) {
            toast({
                title: "Couldn't load study sessions",
                description: err instanceof ApiError ? err.message : "Please try again.",
                variant: "destructive",
            })
        }
    }, [card.id, toast])

    useEffect(() => {
        refreshSessions()
    }, [refreshSessions])

    useEffect(() => {
        if (!isTimerActive || !startTime) return
        const interval = setInterval(() => {
            setElapsedMinutes(Math.floor((Date.now() - startTime.getTime()) / 60000))
        }, 60000)
        return () => clearInterval(interval)
    }, [isTimerActive, startTime])

    const toggleTimer = useCallback(async () => {
        try {
            if (!isTimerActive) {
                const session = await api.startSession(card.id)
                setCurrentSessionId(session._id)
                setStartTime(new Date())
                setElapsedMinutes(0)
                setIsTimerActive(true)
            } else if (currentSessionId) {
                await api.endSession(currentSessionId)
                setCurrentSessionId(null)
                setStartTime(null)
                setElapsedMinutes(0)
                setIsTimerActive(false)
                await refreshSessions()
            }
        } catch (err) {
            toast({
                title: "Timer action failed",
                description: err instanceof ApiError ? err.message : "Please try again.",
                variant: "destructive",
            })
        }
    }, [isTimerActive, currentSessionId, card.id, refreshSessions, toast])

    const updateField = useCallback(
        <K extends keyof Card>(field: K, value: Card[K]) => {
            onUpdateField(card.id, field, value)
        },
        [card.id, onUpdateField]
    )

    return {
        isTimerActive,
        totalStudyMinutes,
        elapsedMinutes,
        toggleTimer,
        updateField,
    }
}
