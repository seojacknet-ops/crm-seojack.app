/**
 * Centralized Zod Schemas
 * 
 * This file contains all validation schemas used across the application.
 * Centralizing schemas ensures consistency and makes them easy to maintain.
 */

import { z } from "zod"

// ============================================================================
// Onboarding Schemas
// ============================================================================

export const onboardingVibeSchema = z.object({
    style: z.enum(['modern', 'classic', 'bold']),
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
})

export const onboardingContentSchema = z.object({
    logo: z.string().optional(),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
})

export const onboardingGoalSchema = z.object({
    goal: z.enum(['leads', 'sales', 'awareness']),
})

export const onboardingDataSchema = z.object({
    style: z.enum(['modern', 'classic', 'bold']).optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    logo: z.string().optional(),
    bio: z.string().optional(),
    goal: z.enum(['leads', 'sales', 'awareness']).optional(),
})

// ============================================================================
// User Profile Schemas
// ============================================================================

export const userProfileSchema = z.object({
    id: z.string(),
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    plan: z.enum(['starter', 'growth', 'pro']),
    avatar: z.string().url().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
})

export const updateProfileSchema = userProfileSchema.partial().omit({ id: true })

// ============================================================================
// Support Ticket Schemas
// ============================================================================

export const ticketSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Please provide more detail"),
    type: z.enum(["bug", "tweak", "feature"]),
})

export const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty"),
})

// ============================================================================
// Media/File Schemas
// ============================================================================

export const fileUploadSchema = z.object({
    file: z.instanceof(File),
    folder: z.string().optional(),
})

export const fileMetadataSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    type: z.enum(['image', 'document', 'other']),
    size: z.string(),
    folderId: z.string(),
    createdAt: z.string().datetime(),
})

// ============================================================================
// Billing Schemas
// ============================================================================

export const planSchema = z.enum(['starter', 'growth', 'pro'])

export const subscriptionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    plan: planSchema,
    status: z.enum(['active', 'canceled', 'past_due']),
    currentPeriodEnd: z.string().datetime(),
    cancelAtPeriodEnd: z.boolean(),
})

// ============================================================================
// Auth Schemas
// ============================================================================

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

// ============================================================================
// Type Exports (Inferred from schemas)
// ============================================================================

export type OnboardingVibeData = z.infer<typeof onboardingVibeSchema>
export type OnboardingContentData = z.infer<typeof onboardingContentSchema>
export type OnboardingGoalData = z.infer<typeof onboardingGoalSchema>
export type OnboardingData = z.infer<typeof onboardingDataSchema>

export type UserProfile = z.infer<typeof userProfileSchema>
export type UpdateProfile = z.infer<typeof updateProfileSchema>

export type TicketData = z.infer<typeof ticketSchema>
export type CommentData = z.infer<typeof commentSchema>

export type FileUpload = z.infer<typeof fileUploadSchema>
export type FileMetadata = z.infer<typeof fileMetadataSchema>

export type Plan = z.infer<typeof planSchema>
export type Subscription = z.infer<typeof subscriptionSchema>

export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
