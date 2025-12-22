import { Timestamp } from 'firebase/firestore';

export interface UserDocument {
    id: string;
    email: string;
    name: string;
    phone?: string;
    company?: string;
    avatarUrl?: string;
    role: 'client' | 'admin';

    // Subscription
    plan: 'starter' | 'growth' | 'pro';
    stripeCustomerId?: string;
    subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'trialing';
    subscriptionEndDate?: Timestamp;

    // Metadata
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastLoginAt?: Timestamp;
    onboardingComplete: boolean;
    leadCaptureComplete?: boolean;
}

export interface ProjectDocument {
    id: string;
    userId: string;  // Owner

    // Business Info (from onboarding)
    businessName: string;
    industry: string;
    location: string;
    serviceArea: string;

    // Brand & Design
    brief: {
        pubDescription: string;
        services: string[];
        uniqueSellingPoints: string[];
        certifications: string[];
        targetCustomer: string;
        pricePositioning: string;

        // Design direction
        inspirationUrls: string[];
        vibe: string;
        colorPalette: string;

        // Contact
        phone: string;
        email: string;
        businessHours: string;
        socialLinks: Record<string, string>;
    };

    // Project Status
    status: 'onboarding' | 'briefing' | 'design' | 'development' | 'review' | 'live';
    currentPhase: number;

    // Assets
    logoUrl?: string;
    photos: string[];
    domain?: string;

    // Timeline
    createdAt: Timestamp;
    updatedAt: Timestamp;
    estimatedLaunch?: Timestamp;
    launchedAt?: Timestamp;

    // Assignment
    assignedTo?: string[];  // Staff user IDs
}

export interface ConversationDocument {
    id: string;
    projectId: string;
    participants: string[];  // User IDs (client + staff)

    // Preview data (denormalized for list view)
    lastMessage: {
        text: string;
        senderId: string;
        timestamp: Timestamp;
    } | null;
    unreadCount: Record<string, number>;  // userId -> count

    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface MessageDocument {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    isStaff: boolean;

    text: string;
    attachments?: {
        url: string;
        name: string;
        type: string;
        size: number;
    }[];

    readBy: string[];  // User IDs who have read
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketDocument {
    id: string;
    projectId: string;
    userId: string;

    title: string;
    description: string;
    type: 'bug' | 'tweak' | 'feature';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'awaiting_info' | 'completed';

    assignedTo?: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
    resolvedAt?: Timestamp;
}

export interface NotificationDocument {
    id: string;
    userId: string;
    type: 'message' | 'system' | 'billing' | 'project';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Timestamp;
}
