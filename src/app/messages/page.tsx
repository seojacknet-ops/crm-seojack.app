'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Paperclip, Smile, File, X, Loader2 } from 'lucide-react';
import { authService, AuthUser } from '@/services/auth';
import { chatService } from '@/services/chat.service';
import { storageService } from '@/services/storage';
import { ConversationDocument, MessageDocument } from '@/lib/schemas/firebase';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function MessagesPage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [conversations, setConversations] = useState<ConversationDocument[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageDocument[]>([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch User & Subscribe to Conversations
    useEffect(() => {
        const init = async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);

                // Subscribe to conversation list
                const unsubscribe = chatService.subscribeToConversations(currentUser.id, (convs) => {
                    setConversations(convs);

                    // Auto-select first conversation if none selected
                    if (!activeConversationId && convs.length > 0) {
                        setActiveConversationId(convs[0].id);
                    } else if (convs.length === 0) {
                        // Create default support conversation if none exists
                        createSupportConversation(currentUser.id);
                    }
                });

                return () => unsubscribe();
            }
        };
        init();
    }, []);

    // 2. Create Default Conversation
    const createSupportConversation = async (userId: string) => {
        try {
            // Use userId as projectId for the default support channel
            const convId = await chatService.getOrCreateConversation(userId, userId);
            setActiveConversationId(convId);
        } catch (error) {
            console.error("Failed to create support conversation", error);
        }
    };

    // 3. Subscribe to Messages for Active Conversation
    useEffect(() => {
        if (!activeConversationId || !user) return;

        const unsubscribe = chatService.subscribeToMessages(activeConversationId, (msgs) => {
            setMessages(msgs);
            // Mark as read
            chatService.markAsRead(activeConversationId, user.id);
            // Scroll to bottom
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsubscribe();
    }, [activeConversationId, user]);

    // 4. Send Message Handler
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!inputText.trim() && attachments.length === 0) || !activeConversationId || !user || isSending) return;

        setIsSending(true);
        try {
            let uploadedAttachments: any[] = [];

            // Upload attachments first
            if (attachments.length > 0) {
                setIsUploading(true);
                uploadedAttachments = await Promise.all(attachments.map(async (file) => {
                    const upload = await storageService.upload(file, {
                        folder: `conversations/${activeConversationId}/attachments`
                    });
                    return {
                        url: upload.url,
                        name: upload.name,
                        type: upload.type,
                        size: upload.size
                    };
                }));
                setIsUploading(false);
            }

            await chatService.sendMessage(
                activeConversationId,
                user.id,
                user.name || 'User',
                inputText,
                false, // Client is not staff
                uploadedAttachments
            );

            setInputText('');
            setAttachments([]);
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
            {/* Sidebar (Threads) */}
            <div className="w-80 border-r border-gray-100 flex flex-col hidden md:flex">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-brand-purple"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((thread) => {
                        const unread = user ? (thread.unreadCount?.[user.id] || 0) : 0;
                        return (
                            <div
                                key={thread.id}
                                onClick={() => setActiveConversationId(thread.id)}
                                className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors ${activeConversationId === thread.id ? 'bg-brand-purple/5 border-r-2 border-brand-purple' : ''
                                    }`}
                            >
                                <div className="relative mr-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                        S
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className={`text-sm font-semibold truncate ${activeConversationId === thread.id ? 'text-brand-purple' : 'text-gray-900'}`}>
                                            SEOJack Support
                                        </h3>
                                        {thread.lastMessage && (
                                            <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(thread.lastMessage.timestamp.toDate(), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">
                                        {thread.lastMessage?.text || 'No messages yet'}
                                    </p>
                                </div>
                                {unread > 0 && (
                                    <div className="ml-2 bg-brand-purple text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                        {unread}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {conversations.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No conversations yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50/50">
                {/* Chat Header */}
                <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <h2 className="font-bold text-gray-900">SEOJack Support</h2>
                        <span className="ml-3 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">Online</span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-400">
                        <button className="hover:text-brand-purple"><Phone className="w-5 h-5" /></button>
                        <button className="hover:text-brand-purple"><Video className="w-5 h-5" /></button>
                        <button className="hover:text-brand-purple"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'items-end justify-end' : 'items-end'}`}>
                                {!isMe && <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs font-bold text-gray-500">S</div>}
                                <div className={`max-w-md space-y-2 ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-2xl shadow-sm ${isMe
                                            ? 'bg-brand-purple text-white rounded-br-none'
                                            : 'bg-white border border-gray-100 rounded-bl-none text-gray-800'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>

                                    {/* Attachments */}
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="space-y-1">
                                            {msg.attachments.map((att, idx) => (
                                                <a
                                                    key={idx}
                                                    href={att.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center p-2 rounded-lg text-xs ${isMe ? 'bg-brand-purple-dark/20 text-white' : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    <File className="w-3 h-3 mr-2" />
                                                    <span className="truncate max-w-[150px]">{att.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    <div className={`text-xs ${isMe ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                                        {msg.createdAt ? formatDistanceToNow(
                                            'toDate' in msg.createdAt ? (msg.createdAt as any).toDate() : msg.createdAt,
                                            { addSuffix: true }
                                        ) : 'Sending...'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {/* Attachment Preview */}
                    {attachments.length > 0 && (
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                            {attachments.map((file, idx) => (
                                <div key={idx} className="relative bg-gray-100 rounded-lg p-2 pr-8 flex items-center">
                                    <File className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="text-xs text-gray-700 truncate max-w-[100px]">{file.name}</span>
                                    <button
                                        onClick={() => removeAttachment(idx)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                                    >
                                        <X className="w-3 h-3 text-gray-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-brand-purple/20 focus-within:border-brand-purple transition-all">
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-gray-400 hover:text-brand-purple mr-2"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                            disabled={isSending}
                        />
                        <button type="button" className="text-gray-400 hover:text-brand-purple mx-2"><Smile className="w-5 h-5" /></button>
                        <button
                            type="submit"
                            disabled={(!inputText.trim() && attachments.length === 0) || isSending}
                            className={`p-2 rounded-lg transition-colors shadow-lg ${(!inputText.trim() && attachments.length === 0) || isSending
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-brand-purple text-white hover:bg-brand-purple-dark shadow-brand-purple/20'
                                }`}
                        >
                            {isSending || isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
