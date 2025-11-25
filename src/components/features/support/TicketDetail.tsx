"use client"

import React from "react"
import { useTicketStore, Ticket } from "@/lib/store/ticket-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "./StatusBadge"
import { Send, User, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketDetailProps {
    ticket: Ticket
}

export const TicketDetail = ({ ticket }: TicketDetailProps) => {
    const { comments, addComment } = useTicketStore()
    const [message, setMessage] = React.useState("")
    const ticketComments = comments[ticket.id] || []
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [ticketComments])

    const handleSend = () => {
        if (!message.trim()) return
        addComment(ticket.id, message)
        setMessage("")
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b border-border py-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            <StatusBadge status={ticket.status} />
                        </div>
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    </div>
                    <StatusBadge priority={ticket.priority} />
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Original Description as first message */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 max-w-[80%]">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold">You</span>
                                <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="bg-secondary p-3 rounded-lg rounded-tl-none text-sm">
                                {ticket.description}
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    {ticketComments.map((comment) => (
                        <div key={comment.id} className={cn("flex gap-3", comment.isStaffReply ? "flex-row-reverse" : "")}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                comment.isStaffReply ? "bg-brand-purple text-white" : "bg-secondary"
                            )}>
                                {comment.isStaffReply ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4 text-muted-foreground" />}
                            </div>

                            <div className={cn("space-y-1 max-w-[80%]", comment.isStaffReply ? "items-end flex flex-col" : "")}>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-semibold">{comment.authorName}</span>
                                    <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-lg text-sm",
                                    comment.isStaffReply ? "bg-brand-purple text-white rounded-tr-none" : "bg-secondary rounded-tl-none"
                                )}>
                                    {comment.message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-card">
                    <div className="flex gap-2">
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your reply..."
                            className="min-h-[50px] max-h-[100px] resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                        />
                        <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
