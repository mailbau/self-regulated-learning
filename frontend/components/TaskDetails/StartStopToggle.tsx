"use client"

import { Clock, Pause } from "lucide-react"
import { useState, useEffect } from "react"

interface StartStopToggleProps {
    cardId: string
    listName: string
    onToggleStateChange?: (isActive: boolean) => void
}

export default function StartStopToggle({ cardId, listName, onToggleStateChange }: StartStopToggleProps) {
    const [isToggleOn, setIsToggleOn] = useState(false)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [totalStudyTime, setTotalStudyTime] = useState<number>(0)
    const [elapsedTime, setElapsedTime] = useState<number>(0)
    const [startTime, setStartTime] = useState<Date | null>(null)
    const isDisabled = listName === "Reflection (Done)"

    // Notify parent component when toggle state changes
    useEffect(() => {
        onToggleStateChange?.(isToggleOn)
    }, [isToggleOn, onToggleStateChange])

    // Check if there's an active session when component mounts
    useEffect(() => {
        checkActiveSession()
        fetchStudySessions()
    }, [cardId])

    // Timer effect
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null

        if (isToggleOn && startTime) {
            intervalId = setInterval(() => {
                const now = new Date()
                const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60) // in minutes
                setElapsedTime(elapsed)
            }, 60000) // Update every minute
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [isToggleOn, startTime])

    const checkActiveSession = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-sessions/card/${cardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                console.error("Failed to fetch study sessions")
                return
            }

            const data = await response.json()

            // Check if there's an active session (one without end_time)
            const activeSession = data.sessions.find((session: any) => !session.end_time)

            if (activeSession) {
                setIsToggleOn(true)
                setCurrentSessionId(activeSession._id)
                setStartTime(new Date(activeSession.start_time))

                // Calculate elapsed time
                const now = new Date()
                const start = new Date(activeSession.start_time)
                const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60)
                setElapsedTime(elapsed)
            }
        } catch (error) {
            console.error("Error checking active session:", error)
        }
    }

    const fetchStudySessions = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-sessions/card/${cardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                console.error("Failed to fetch study sessions")
                return
            }

            const data = await response.json()
            setTotalStudyTime(data.total_study_time_minutes)
        } catch (error) {
            console.error("Error fetching study sessions:", error)
        }
    }

    const handleToggle = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            if (!isToggleOn) {
                // Start new session
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-sessions/start`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ card_id: cardId }),
                })

                if (!response.ok) {
                    console.error("Failed to start study session")
                    return
                }

                const data = await response.json()
                setCurrentSessionId(data._id)
                setStartTime(new Date())
                setIsToggleOn(true)
            } else {
                // End current session
                if (currentSessionId) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study-sessions/end`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ session_id: currentSessionId }),
                    })

                    if (!response.ok) {
                        console.error("Failed to end study session")
                        return
                    }

                    setCurrentSessionId(null)
                    setStartTime(null)
                    setIsToggleOn(false)
                    setElapsedTime(0)
                    fetchStudySessions() // Refresh total study time
                }
            }
        } catch (error) {
            console.error("Error handling study session:", error)
        }
    }

    const formatTime = (minutes: number) => {
        const totalSeconds = minutes * 60
        const days = Math.floor(totalSeconds / (24 * 3600))
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
        const remainingMinutes = Math.floor((totalSeconds % 3600) / 60)

        if (days > 0) {
            return `${days}d ${hours}h ${remainingMinutes}m`
        } else if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`
        } else {
            return `${remainingMinutes}m`
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="relative group">
                <button
                    onClick={handleToggle}
                    disabled={isDisabled}
                    className={`relative flex items-center px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${isDisabled
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : isToggleOn
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-400"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border border-green-400"
                        }`}
                >
                    {isToggleOn ? (
                        <>
                            <Pause className="h-4 w-4 mr-2" />
                            <span className="font-medium">Stop Timer</span>
                        </>
                    ) : (
                        <>
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-medium">Start Timer</span>
                        </>
                    )}
                </button>

                {isDisabled && (
                    <div className="absolute -top-8 left-0 w-max max-w-xs px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Not editable in Reflection (Done) stage
                    </div>
                )}
            </div>

            <div className="flex flex-col text-sm text-indigo-600 dark:text-indigo-400">
                {isToggleOn && <div>Current session: {formatTime(elapsedTime)}</div>}
                {totalStudyTime > 0 && <div>Total study time: {formatTime(totalStudyTime)}</div>}
            </div>
        </div>
    )
}
