"use client"

import React from "react"
import { useMediaStore } from "@/lib/store/media-store"
import { Button } from "@/components/ui/button"
import { Folder, Image, FileText, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

export const FolderList = () => {
    const { folders, currentFolderId, setCurrentFolder } = useMediaStore()

    const getIcon = (id: string) => {
        switch (id) {
            case 'all': return LayoutGrid
            case 'logos': return Folder
            case 'images': return Image
            case 'documents': return FileText
            default: return Folder
        }
    }

    return (
        <div className="space-y-2">
            <h3 className="px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Folders
            </h3>
            <div className="space-y-1">
                {folders.map((folder) => {
                    const Icon = getIcon(folder.id)
                    const isActive = currentFolderId === folder.id

                    return (
                        <Button
                            key={folder.id}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start",
                                isActive ? "bg-brand-purple/10 text-brand-purple" : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => setCurrentFolder(folder.id)}
                        >
                            <Icon className={cn("w-4 h-4 mr-2", isActive && "text-brand-purple")} />
                            {folder.name}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
