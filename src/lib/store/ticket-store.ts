import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TicketStatus = 'open' | 'in_progress' | 'awaiting_info' | 'completed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Comment {
    id: string
    ticketId: string
    message: string
    isStaffReply: boolean
    createdAt: string
    authorName: string
}

export interface Ticket {
    id: string
    title: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    createdAt: string
    updatedAt: string
}

interface TicketState {
    tickets: Ticket[]
    comments: Record<string, Comment[]> // Map ticketId to comments

    createTicket: (title: string, description: string, priority: TicketPriority) => void
    addComment: (ticketId: string, message: string, isStaffReply?: boolean) => void
    updateStatus: (ticketId: string, status: TicketStatus) => void
}

const initialTickets: Ticket[] = [
    {
        id: 'T-101',
        title: 'Homepage Hero Image Alignment',
        description: 'The hero image looks stretched on mobile devices.',
        status: 'in_progress',
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'T-102',
        title: 'Typo in About Section',
        description: 'It says "profesional" instead of "professional".',
        status: 'open',
        priority: 'low',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
        id: 'T-103',
        title: 'Contact Form Not Sending',
        description: 'We tested the form and didn\'t receive an email.',
        status: 'completed',
        priority: 'critical',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    }
]

const initialComments: Record<string, Comment[]> = {
    'T-101': [
        {
            id: 'c1',
            ticketId: 'T-101',
            message: 'The hero image looks stretched on mobile devices. Can we fix this?',
            isStaffReply: false,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            authorName: 'Client',
        },
        {
            id: 'c2',
            ticketId: 'T-101',
            message: 'Thanks for reporting. We are looking into the CSS media queries now.',
            isStaffReply: true,
            createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
            authorName: 'Support Team',
        }
    ]
}

export const useTicketStore = create<TicketState>()(
    persist(
        (set, get) => ({
            tickets: initialTickets,
            comments: initialComments,

            createTicket: (title, description, priority) => {
                const newTicket: Ticket = {
                    id: `T-${Math.floor(Math.random() * 1000) + 100}`,
                    title,
                    description,
                    status: 'open',
                    priority,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
                set((state) => ({
                    tickets: [newTicket, ...state.tickets],
                    comments: { ...state.comments, [newTicket.id]: [] }
                }))
            },

            addComment: (ticketId, message, isStaffReply = false) => {
                const newComment: Comment = {
                    id: Math.random().toString(36).substr(2, 9),
                    ticketId,
                    message,
                    isStaffReply,
                    createdAt: new Date().toISOString(),
                    authorName: isStaffReply ? 'Support Team' : 'You',
                }

                set((state) => ({
                    comments: {
                        ...state.comments,
                        [ticketId]: [...(state.comments[ticketId] || []), newComment]
                    },
                    tickets: state.tickets.map(t =>
                        t.id === ticketId ? { ...t, updatedAt: new Date().toISOString() } : t
                    )
                }))
            },

            updateStatus: (ticketId, status) => {
                set((state) => ({
                    tickets: state.tickets.map(t =>
                        t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
                    )
                }))
            },
        }),
        {
            name: 'seojack-ticket-storage',
        }
    )
)
