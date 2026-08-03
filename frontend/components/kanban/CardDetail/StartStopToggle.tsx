"use client"

import { Clock, Pause } from "lucide-react"

interface StartStopToggleProps {
    isActive: boolean
    elapsedMinutes: number
    totalMinutes: number
    onToggle: () => void
    disabled?: boolean
}

/** Presentational timer control; session tracking lives in useCardDetail. */
export default function StartStopToggle({ isActive, elapsedMinutes, totalMinutes, onToggle, disabled = false }: StartStopToggleProps) {
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
                    onClick={onToggle}
                    disabled={disabled}
                    className={`relative flex items-center px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${disabled
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : isActive
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-400"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border border-green-400"
                        }`}
                >
                    {isActive ? (
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

                {disabled && (
                    <div className="absolute -top-8 left-0 w-max max-w-xs px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Not editable in Reflection (Done) stage
                    </div>
                )}
            </div>

            <div className="flex flex-col text-sm text-indigo-600 dark:text-indigo-400">
                {isActive && <div>Current session: {formatTime(elapsedMinutes)}</div>}
                {totalMinutes > 0 && <div>Total study time: {formatTime(totalMinutes)}</div>}
            </div>
        </div>
    )
}
