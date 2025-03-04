"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, File, Check, AlertCircle } from "lucide-react"

export default function FileUpload() {
    const [showUpload, setShowUpload] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFiles(Array.from(event.target.files))
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(Array.from(e.dataTransfer.files))
        }
    }

    const handleUpload = () => {
        if (files.length === 0) {
            alert("Please select a file first.")
            return
        }

        setUploadStatus("uploading")

        // Simulate upload process
        setTimeout(() => {
            console.log("Files selected:", files)
            setUploadStatus("success")

            // Reset after showing success
            setTimeout(() => {
                setFiles([])
                setShowUpload(false)
                setUploadStatus("idle")
            }, 1500)
        }, 1500)
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const getFileIcon = (file: File) => {
        const extension = file.name.split(".").pop()?.toLowerCase()

        if (file.type.startsWith("image/")) {
            return URL.createObjectURL(file)
        }

        return null
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="mt-4 mb-2">
            {!showUpload ? (
                <button
                    onClick={() => setShowUpload(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Upload size={18} />
                    Upload File
                </button>
            ) : (
                <div className="border border-gray-300 rounded-lg bg-white shadow-md overflow-hidden transition-all duration-300">
                    <div className="bg-blue-50 p-3 border-b border-gray-300 flex justify-between items-center">
                        <h3 className="font-medium text-blue-700">Upload Files</h3>
                        <button onClick={() => setShowUpload(false)} className="text-gray-500 hover:text-gray-700">
                            <X size={18} />
                        </button>
                    </div>

                    <div className={`p-6 ${uploadStatus === "uploading" ? "opacity-50 pointer-events-none" : ""}`}>
                        {/* Drag & Drop Area */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerFileInput}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />

                            <div className="flex flex-col items-center">
                                <Upload className="h-12 w-12 text-blue-500 mb-3" />
                                <p className="text-sm font-medium text-gray-700 mb-1">Drag & drop files here, or click to browse</p>
                                <p className="text-xs text-gray-500">Supports any file type</p>
                            </div>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                                            <div className="flex-shrink-0 mr-3">
                                                {getFileIcon(file) ? (
                                                    <img
                                                        src={getFileIcon(file) || "/placeholder.svg"}
                                                        alt={file.name}
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                ) : (
                                                    <File className="h-10 w-10 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeFile(index)
                                                }}
                                                className="ml-2 text-gray-400 hover:text-red-500"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setFiles([])
                                setShowUpload(false)
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-100 transition-colors"
                            disabled={uploadStatus === "uploading"}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={files.length === 0 || uploadStatus === "uploading"}
                            className={`px-4 py-2 rounded-md text-white text-sm flex items-center gap-2 transition-colors ${files.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : uploadStatus === "success"
                                    ? "bg-green-600"
                                    : uploadStatus === "error"
                                        ? "bg-red-600"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {uploadStatus === "uploading" ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : uploadStatus === "success" ? (
                                <>
                                    <Check size={18} />
                                    Uploaded!
                                </>
                            ) : uploadStatus === "error" ? (
                                <>
                                    <AlertCircle size={18} />
                                    Failed
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Upload
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

