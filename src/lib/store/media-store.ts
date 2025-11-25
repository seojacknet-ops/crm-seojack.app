import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

export type FileType = 'image' | 'document' | 'other'

export interface MediaFile {
    id: string
    name: string
    url: string
    type: FileType
    size: string
    folderId: string
    createdAt: string
}

export interface Folder {
    id: string
    name: string
    icon?: string
}

interface MediaState {
    files: MediaFile[]
    folders: Folder[]
    currentFolderId: string
    isUploading: boolean

    setCurrentFolder: (folderId: string) => void
    uploadFile: (file: File) => Promise<void>
    deleteFile: (fileId: string) => void
}

const initialFolders: Folder[] = [
    { id: 'all', name: 'All Files' },
    { id: 'logos', name: 'Logos' },
    { id: 'images', name: 'Images' },
    { id: 'documents', name: 'Documents' },
]

const initialFiles: MediaFile[] = [
    {
        id: '1',
        name: 'seo-jack-logo.png',
        url: '#', // Mock URL
        type: 'image',
        size: '245 KB',
        folderId: 'logos',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'hero-banner.jpg',
        url: '#',
        type: 'image',
        size: '1.2 MB',
        folderId: 'images',
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'contract-v1.pdf',
        url: '#',
        type: 'document',
        size: '450 KB',
        folderId: 'documents',
        createdAt: new Date().toISOString(),
    },
]

export const useMediaStore = create<MediaState>()(
    persist(
        (set, get) => ({
            files: initialFiles,
            folders: initialFolders,
            currentFolderId: 'all',
            isUploading: false,

            setCurrentFolder: (folderId) => set({ currentFolderId: folderId }),

            uploadFile: async (file) => {
                set({ isUploading: true })

                try {
                    // Simulate upload delay
                    await new Promise((resolve) => setTimeout(resolve, 1500))

                    const newFile: MediaFile = {
                        id: Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        url: URL.createObjectURL(file),
                        type: file.type.startsWith('image/') ? 'image' : 'document',
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        folderId: get().currentFolderId === 'all' ? 'images' : get().currentFolderId,
                        createdAt: new Date().toISOString(),
                    }

                    set((state) => ({
                        files: [newFile, ...state.files],
                        isUploading: false,
                    }))

                    toast.success(`${file.name} uploaded successfully!`)
                } catch (error) {
                    set({ isUploading: false })
                    toast.error('Upload failed. Please try again.')
                }
            },

            deleteFile: (fileId) => {
                const file = get().files.find(f => f.id === fileId)
                set((state) => ({
                    files: state.files.filter((f) => f.id !== fileId),
                }))
                if (file) {
                    toast.success(`${file.name} deleted`)
                }
            },
        }),
        {
            name: 'seojack-media-storage',
        }
    )
)
