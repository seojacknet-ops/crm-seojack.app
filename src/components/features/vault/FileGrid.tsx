"use client"

import React from "react"
import { useMediaStore } from "@/lib/store/media-store"
import { FileCard } from "./FileCard"
import { FolderOpen, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export const FileGrid = () => {
    const { files, currentFolderId } = useMediaStore()

    const filteredFiles = files.filter((file) => {
        if (currentFolderId === 'all') return true
        return file.folderId === currentFolderId
    })

    if (filteredFiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-6 bg-secondary/50 rounded-full mb-6">
                    <FolderOpen className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No files yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Upload your logo, images, or documents to get started. Drag and drop files into the upload area above.
                </p>
                <Button
                    onClick={() => {
                        // Scroll to uploader
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload Files
                </Button>
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
