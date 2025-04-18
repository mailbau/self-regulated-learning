"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Percent, HelpCircle } from "lucide-react"

interface GradeInputProps {
    preTestGrade?: string | number
    postTestGrade?: string | number
    onUpdatePreTestGrade: (newGrade: string) => void
    onUpdatePostTestGrade: (newGrade: string) => void
}

export default function GradeInput({
    preTestGrade = "",
    postTestGrade = "",
    onUpdatePreTestGrade,
    onUpdatePostTestGrade
}: GradeInputProps) {
    const [preTestValue, setPreTestValue] = useState(preTestGrade.toString())
    const [postTestValue, setPostTestValue] = useState(postTestGrade.toString())
    const [showTooltip, setShowTooltip] = useState(false)

    useEffect(() => {
        setPreTestValue(preTestGrade.toString())
        setPostTestValue(postTestGrade.toString())
    }, [preTestGrade, postTestGrade])

    const handlePreTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === "" || /^(\d+\.?\d*|\.\d+)$/.test(value)) {
            setPreTestValue(value)
        }
    }

    const handlePostTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === "" || /^(\d+\.?\d*|\.\d+)$/.test(value)) {
            setPostTestValue(value)
        }
    }

    const handlePreTestBlur = () => {
        let formattedGrade = preTestValue.trim()
        if (formattedGrade !== "" && !isNaN(Number(formattedGrade))) {
            const numValue = Number.parseFloat(formattedGrade)
            if (numValue > 100) {
                formattedGrade = "100"
            }
            formattedGrade = numValue.toString()
        }
        setPreTestValue(formattedGrade)
        onUpdatePreTestGrade(formattedGrade)
    }

    const handlePostTestBlur = () => {
        let formattedGrade = postTestValue.trim()
        if (formattedGrade !== "" && !isNaN(Number(formattedGrade))) {
            const numValue = Number.parseFloat(formattedGrade)
            if (numValue > 100) {
                formattedGrade = "100"
            }
            formattedGrade = numValue.toString()
        }
        setPostTestValue(formattedGrade)
        onUpdatePostTestGrade(formattedGrade)
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                    Pre-test Grade
                    <button
                        type="button"
                        className="ml-1.5 text-gray-400 hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => setShowTooltip(!showTooltip)}
                        aria-label="Pre-test grade information"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </button>
                </label>

                {showTooltip && (
                    <div className="absolute z-10 -top-2 left-16 transform -translate-y-full w-64 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                        Enter your grade from the pre-test assessment.
                        <div className="absolute bottom-0 left-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                )}

                <div className="relative">
                    <input
                        type="text"
                        value={preTestValue}
                        onChange={handlePreTestChange}
                        onBlur={handlePreTestBlur}
                        placeholder="Enter pre-test grade"
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        aria-label="Pre-test grade"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Percent className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="relative">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                    Post-test Grade
                    <button
                        type="button"
                        className="ml-1.5 text-gray-400 hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => setShowTooltip(!showTooltip)}
                        aria-label="Post-test grade information"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </button>
                </label>

                {showTooltip && (
                    <div className="absolute z-10 -top-2 left-16 transform -translate-y-full w-64 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                        Enter your grade from the post-test assessment.
                        <div className="absolute bottom-0 left-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                )}

                <div className="relative">
                    <input
                        type="text"
                        value={postTestValue}
                        onChange={handlePostTestChange}
                        onBlur={handlePostTestBlur}
                        placeholder="Enter post-test grade"
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        aria-label="Post-test grade"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Percent className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    )
}

