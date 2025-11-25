/**
 * Storage Service Interface
 * 
 * This service abstracts file storage operations, making it easy to swap
 * implementations (e.g., from mock to AWS S3 or Firebase Storage).
 */

export interface StorageFile {
    id: string
    name: string
    url: string
    size: number
    type: string
    uploadedAt: Date
}

export interface UploadOptions {
    folder?: string
    maxSize?: number
    allowedTypes?: string[]
}

export interface StorageService {
    /**
     * Upload a file to storage
     */
    upload(file: File, options?: UploadOptions): Promise<StorageFile>

    /**
     * Delete a file from storage
     */
    delete(fileId: string): Promise<void>

    /**
     * List files in a folder
     */
    list(folder?: string): Promise<StorageFile[]>

    /**
     * Get a download URL for a file
     */
    getDownloadUrl(fileId: string): Promise<string>

    /**
     * Get file metadata
     */
    getMetadata(fileId: string): Promise<StorageFile>
}

/**
 * Mock implementation for development
 */
export class MockStorageService implements StorageService {
    private files: Map<string, StorageFile> = new Map()

    async upload(file: File, options?: UploadOptions): Promise<StorageFile> {
        // Validate file size
        if (options?.maxSize && file.size > options.maxSize) {
            throw new Error(`File size exceeds ${options.maxSize} bytes`)
        }

        // Validate file type
        if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
            throw new Error(`File type ${file.type} not allowed`)
        }

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const storageFile: StorageFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
            type: file.type,
            uploadedAt: new Date()
        }

        this.files.set(storageFile.id, storageFile)
        return storageFile
    }

    async delete(fileId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500))

        if (!this.files.has(fileId)) {
            throw new Error('File not found')
        }

        this.files.delete(fileId)
    }

    async list(folder?: string): Promise<StorageFile[]> {
        await new Promise(resolve => setTimeout(resolve, 300))
        return Array.from(this.files.values())
    }

    async getDownloadUrl(fileId: string): Promise<string> {
        const file = this.files.get(fileId)
        if (!file) {
            throw new Error('File not found')
        }
        return file.url
    }

    async getMetadata(fileId: string): Promise<StorageFile> {
        const file = this.files.get(fileId)
        if (!file) {
            throw new Error('File not found')
        }
        return file
    }
}

// Export singleton instance
export const storageService = new MockStorageService()
