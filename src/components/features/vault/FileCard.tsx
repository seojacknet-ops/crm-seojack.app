"use client"

import React from "react"
import { MediaFile, useMediaStore } from "@/lib/store/media-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Image as ImageIcon, MoreVertical, Download, Trash2 } from "lucide-react"

interface FileCardProps {
    file: MediaFile
}

export const FileCard = ({ file }: FileCardProps) => {
    const { deleteFile } = useMediaStore()

    return (
        <Card className="group relative overflow-hidden hover:border-brand-purple transition-all">
            {/* Preview Area */}
            <div className="aspect-square bg-secondary/50 flex items-center justify-center relative">
                {file.type === 'image' ? (
                    // In a real app, use Next.js Image with the real URL
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${file.url})` }}>
                        {/* Fallback for mock URLs that are just '#' */}
                        {file.url === '#' && <ImageIcon className="w-12 h-12 text-muted-foreground opacity-20" />}
                    </div>
                ) : (
                    <FileText className="w-12 h-12 text-muted-foreground" />
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full">
                        <Download className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => deleteFile(file.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* File Info */}
            <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="truncate">
                        <p className="font-medium text-sm truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>

                    {/* Mobile/Accessible Menu */}
                    <div className="md:hidden">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </Card>
    )
}
