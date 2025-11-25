"use client"

import React from "react"
import { TicketList } from "@/components/features/support/TicketList"
import { TicketDetail } from "@/components/features/support/TicketDetail"
import { NewTicketDialog } from "@/components/features/support/NewTicketDialog"
import { useTicketStore, Ticket } from "@/lib/store/ticket-store"
import { MessageSquare } from "lucide-react"

export default function SupportPage() {
    const { tickets } = useTicketStore()
    const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null)

    const selectedTicket = tickets.find(t => t.id === selectedTicketId)

    // Auto-select first ticket if none selected and tickets exist
    React.useEffect(() => {
        if (!selectedTicketId && tickets.length > 0) {
            setSelectedTicketId(tickets[0].id)
        }
    }, [tickets, selectedTicketId])

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Support & Revisions</h1>
                    <p className="text-muted-foreground">Track bugs, request changes, and chat with the team.</p>
                </div>
                <NewTicketDialog />
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Sidebar List */}
                <div className="lg:col-span-4 overflow-y-auto pr-2">
                    <TicketList
                        onSelectTicket={(t) => setSelectedTicketId(t.id)}
                        selectedTicketId={selectedTicketId || undefined}
                    />
                </div>

                {/* Detail View */}
                <div className="lg:col-span-8 h-full">
                    {selectedTicket ? (
                        <TicketDetail ticket={selectedTicket} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl bg-secondary/10">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a ticket to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
