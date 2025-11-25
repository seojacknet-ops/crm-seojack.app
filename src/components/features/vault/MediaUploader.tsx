"use client"

import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, Loader2 } from "lucide-react"
import { useMediaStore } from "@/lib/store/media-store"
import { cn } from "@/lib/utils"

export const MediaUploader = () => {
    const { uploadFile, isUploading } = useMediaStore()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            uploadFile(file)
        })
    }, [uploadFile])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'application/pdf': []
        }
    })

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 min-h-[200px]",
                isDragActive ? "border-brand-purple bg-brand-purple/5" : "border-border hover:bg-surface-hover",
                isUploading && "opacity-50 pointer-events-none"
            )}
        >
            <input {...getInputProps()} />

            {isUploading ? (
                <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
            ) : (
                <div className="p-4 bg-secondary rounded-full">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
            )}

            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                    {isDragActive ? "Drop files here" : "Click or drag files to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, PDF (Max 10MB)
                </p>
            </div>
        </div>
    )
}
