"use client"

import React from "react"
import { TicketStatus, TicketPriority } from "@/lib/store/ticket-store"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
    status?: TicketStatus
    priority?: TicketPriority
    className?: string
}

export const StatusBadge = ({ status, priority, className }: StatusBadgeProps) => {
    if (status) {
        const styles = {
            open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            in_progress: "bg-brand-purple/10 text-brand-purple border-brand-purple/20",
            awaiting_info: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            completed: "bg-green-500/10 text-green-500 border-green-500/20",
        }

        const labels = {
            open: "Open",
            in_progress: "In Progress",
            awaiting_info: "Awaiting Info",
            completed: "Completed",
        }

        return (
            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status], className)}>
                {labels[status]}
            </span>
        )
    }

    if (priority) {
        const styles = {
            low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
            medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
            critical: "bg-red-500/10 text-red-500 border-red-500/20",
        }

        return (
            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[priority], className)}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
        )
    }

    return null
}
