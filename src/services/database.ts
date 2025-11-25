/**
 * Database Service Interface
 * 
 * This service provides generic CRUD operations, making it easy to swap
 * implementations (e.g., from mock to Firestore or PostgreSQL).
 */

export interface DatabaseDocument {
    id: string
    createdAt: Date
    updatedAt: Date
    [key: string]: any
}

export interface QueryOptions {
    limit?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    where?: Array<{
        field: string
        operator: '==' | '!=' | '>' | '<' | '>=' | '<='
        value: any
    }>
}

export interface DatabaseService {
    /**
     * Create a new document
     */
    create<T extends DatabaseDocument>(
        collection: string,
        data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<T>

    /**
     * Read a document by ID
     */
    read<T extends DatabaseDocument>(
        collection: string,
        id: string
    ): Promise<T | null>

    /**
     * Update a document
     */
    update<T extends DatabaseDocument>(
        collection: string,
        id: string,
        data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<T>

    /**
     * Delete a document
     */
    delete(collection: string, id: string): Promise<void>

    /**
     * Query documents with filters
     */
    query<T extends DatabaseDocument>(
        collection: string,
        options?: QueryOptions
    ): Promise<T[]>

    /**
     * Subscribe to real-time updates
     */
    subscribe<T extends DatabaseDocument>(
        collection: string,
        id: string,
        callback: (doc: T | null) => void
    ): () => void
}

/**
 * Mock implementation for development
 */
export class MockDatabaseService implements DatabaseService {
    private collections: Map<string, Map<string, DatabaseDocument>> = new Map()

    private getCollection(name: string): Map<string, DatabaseDocument> {
        if (!this.collections.has(name)) {
            this.collections.set(name, new Map())
        }
        return this.collections.get(name)!
    }

    async create<T extends DatabaseDocument>(
        collection: string,
        data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<T> {
        await new Promise(resolve => setTimeout(resolve, 300))

        const doc: T = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            updatedAt: new Date()
        } as T

        this.getCollection(collection).set(doc.id, doc)
        return doc
    }

    async read<T extends DatabaseDocument>(
        collection: string,
        id: string
    ): Promise<T | null> {
        await new Promise(resolve => setTimeout(resolve, 200))
        return (this.getCollection(collection).get(id) as T) || null
    }

    async update<T extends DatabaseDocument>(
        collection: string,
        id: string,
        data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<T> {
        await new Promise(resolve => setTimeout(resolve, 300))

        const existing = this.getCollection(collection).get(id)
        if (!existing) {
            throw new Error('Document not found')
        }

        const updated: T = {
            ...existing,
            ...data,
            updatedAt: new Date()
        } as T

        this.getCollection(collection).set(id, updated)
        return updated
    }

    async delete(collection: string, id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200))

        if (!this.getCollection(collection).has(id)) {
            throw new Error('Document not found')
        }

        this.getCollection(collection).delete(id)
    }

    async query<T extends DatabaseDocument>(
        collection: string,
        options?: QueryOptions
    ): Promise<T[]> {
        await new Promise(resolve => setTimeout(resolve, 300))

        let results = Array.from(this.getCollection(collection).values()) as T[]

        // Apply where filters
        if (options?.where) {
            results = results.filter(doc => {
                return options.where!.every(condition => {
                    const value = doc[condition.field]
                    switch (condition.operator) {
                        case '==': return value === condition.value
                        case '!=': return value !== condition.value
                        case '>': return value > condition.value
                        case '<': return value < condition.value
                        case '>=': return value >= condition.value
                        case '<=': return value <= condition.value
                        default: return true
                    }
                })
            })
        }

        // Apply ordering
        if (options?.orderBy) {
            results.sort((a, b) => {
                const aVal = a[options.orderBy!]
                const bVal = b[options.orderBy!]
                const direction = options.orderDirection === 'desc' ? -1 : 1
                return aVal > bVal ? direction : -direction
            })
        }

        // Apply limit
        if (options?.limit) {
            results = results.slice(0, options.limit)
        }

        return results
    }

    subscribe<T extends DatabaseDocument>(
        collection: string,
        id: string,
        callback: (doc: T | null) => void
    ): () => void {
        // In a real implementation, this would set up a real-time listener
        // For mock, we just call the callback once
        const doc = this.getCollection(collection).get(id) as T || null
        callback(doc)

        // Return unsubscribe function
        return () => {
            console.log(`Unsubscribed from ${collection}/${id}`)
        }
    }
}

// Export singleton instance
export const databaseService = new MockDatabaseService()
