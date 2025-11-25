import { MediaUploader } from "@/components/features/vault/MediaUploader"
import { FileGrid } from "@/components/features/vault/FileGrid"
import { FolderList } from "@/components/features/vault/FolderList"
import { Card } from "@/components/ui/card"

export default function MediaVaultPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Media Vault</h1>
                <p className="text-muted-foreground">Securely upload and manage your brand assets.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <Card className="w-full lg:w-64 p-4 h-fit shrink-0">
                    <FolderList />
                </Card>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <MediaUploader />
                    <FileGrid />
                </div>
            </div>
        </div>
    )
}
