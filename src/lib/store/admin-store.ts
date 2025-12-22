import { create } from 'zustand'
import { UserDocument, ProjectDocument, TicketDocument } from '@/lib/schemas/firebase'
import { databaseService } from '@/services/database'
import { getStripeStats } from '@/app/admin/actions'

interface AdminState {
    projects: ProjectDocument[]
    users: UserDocument[]
    tickets: TicketDocument[]
    isLoading: boolean
    stats: {
        totalRevenue: number
        activeProjects: number
        openTickets: number
    }

    fetchDashboardData: () => Promise<void>
}

export const useAdminStore = create<AdminState>()((set, get) => ({
    projects: [],
    users: [],
    tickets: [],
    isLoading: false,
    stats: {
        totalRevenue: 0,
        activeProjects: 0,
        openTickets: 0
    },

    fetchDashboardData: async () => {
        set({ isLoading: true })
        try {
            // Parallel fetch
            const [projects, users, tickets, stripeStats] = await Promise.all([
                databaseService.query<any>('projects'),
                databaseService.query<any>('users'),
                databaseService.query<any>('tickets'),
                getStripeStats()
            ])

            const activeProjects = projects.length
            const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length

            set({
                projects,
                users,
                tickets,
                stats: {
                    totalRevenue: stripeStats.totalRevenue,
                    activeProjects,
                    openTickets
                },
                isLoading: false
            })

        } catch (error) {
            console.error('Failed to fetch admin dashboard data:', error)
            set({ isLoading: false })
        }
    }
}))
