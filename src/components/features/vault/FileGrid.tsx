"use client"

import React from "react"
import { useMediaStore } from "@/lib/store/media-store"
import { FileCard } from "./FileCard"
import { FolderOpen } from "lucide-react"

export const FileGrid = () => {
    const { files, currentFolderId } = useMediaStore()

    const filteredFiles = files.filter((file) => {
        if (currentFolderId === 'all') return true
        return file.folderId === currentFolderId
    })

    if (filteredFiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="p-4 bg-secondary rounded-full mb-4">
                    <FolderOpen className="w-8 h-8 opacity-50" />
                </div>
                <p>No files found in this folder.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} />
            ))}
        </div>
    )
}
