/**
 * Authentication Service Interface
 * 
 * This service abstracts authentication logic, making it easy to swap
 * implementations (e.g., from mock to Firebase Auth) without changing components.
 */

export interface AuthUser {
    id: string
    email: string
    name: string
    plan: 'starter' | 'growth' | 'pro'
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    name: string
}

export interface AuthService {
    /**
     * Log in a user with email and password
     */
    login(credentials: LoginCredentials): Promise<AuthUser>

    /**
     * Register a new user
     */
    register(data: RegisterData): Promise<AuthUser>

    /**
     * Log out the current user
     */
    logout(): Promise<void>

    /**
     * Get the currently authenticated user
     */
    getCurrentUser(): Promise<AuthUser | null>

    /**
     * Send a password reset email
     */
    resetPassword(email: string): Promise<void>

    /**
     * Update user profile
     */
    updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser>
}

/**
 * Mock implementation for development
 */
export class MockAuthService implements AuthService {
    private currentUser: AuthUser | null = {
        id: '1',
        email: 'alex@example.com',
        name: 'Alex Johnson',
        plan: 'pro'
    }

    async login(credentials: LoginCredentials): Promise<AuthUser> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (!this.currentUser) {
            throw new Error('Invalid credentials')
        }

        return this.currentUser
    }

    async register(data: RegisterData): Promise<AuthUser> {
        await new Promise(resolve => setTimeout(resolve, 1000))

        this.currentUser = {
            id: Math.random().toString(36).substr(2, 9),
            email: data.email,
            name: data.name,
            plan: 'starter'
        }

        return this.currentUser
    }

    async logout(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500))
        this.currentUser = null
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        return this.currentUser
    }

    async resetPassword(email: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`Password reset email sent to ${email}`)
    }

    async updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (!this.currentUser) {
            throw new Error('No user logged in')
        }

        this.currentUser = { ...this.currentUser, ...data }
        return this.currentUser
    }
}

// Export singleton instance
export const authService = new MockAuthService()
