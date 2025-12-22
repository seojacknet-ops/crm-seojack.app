'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, User, Menu, Settings, LogOut, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/components/layout/Sidebar";
import { authService, AuthUser } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { notificationService } from '@/services/notification.service';
import { NotificationDocument } from '@/lib/schemas/firebase';

export const Header = () => {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [notifications, setNotifications] = useState<NotificationDocument[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.length > 0
        ? pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1))
        : ['Home'];

    useEffect(() => {
        const init = async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);

                // Subscribe to notifications
                const unsubscribe = notificationService.subscribeToNotifications(currentUser.id, (notifs) => {
                    setNotifications(notifs);
                });
                return () => unsubscribe();
            }
        };
        init();

        // Click outside listener for notifications
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = async (id: string) => {
        await notificationService.markAsRead(id);
    };

    const handleMarkAllRead = async () => {
        if (user) {
            await notificationService.markAllAsRead(user.id);
            // Optimistically update local state for immediate feedback
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    return (
        <header className="h-16 backdrop-blur-md bg-background/80 border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
                            <Menu className="w-6 h-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="flex flex-col h-full bg-background">
                            <div className="p-6 border-b border-border">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    <img
                                        src="/seojack-logo-dark.png"
                                        alt="SEOJack"
                                        className="h-8 w-auto object-contain"
                                    />
                                </h1>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                                ? 'bg-brand-purple text-white shadow-brand'
                                                : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground hover:border-brand-purple/20'
                                                }`}
                                        >
                                            <item.icon
                                                className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-brand-purple'
                                                    }`}
                                            />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="p-4 border-t border-border space-y-1">
                                <Link
                                    href="/settings"
                                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
                                >
                                    <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
                                    Settings
                                </Link>
                                <button
                                    onClick={async () => {
                                        await signOut();
                                        window.location.href = 'https://seojack.website';
                                    }}
                                    className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium text-foreground hidden sm:inline">Dashboard</span>
                    <span className="font-medium text-foreground sm:hidden">Home</span>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb}>
                            <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                            <span className={`font-medium ${index === breadcrumbs.length - 1 ? 'text-brand-purple' : 'text-muted-foreground'}`}>
                                {crumb}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <ThemeToggle />

                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-muted-foreground hover:text-brand-purple transition-colors rounded-full hover:bg-surface-hover"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-pink rounded-full border-2 border-background animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="font-semibold text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-brand-purple hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                            onClick={() => handleMarkAsRead(notif.id)}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${notif.type === 'message' ? 'bg-purple-100 text-purple-600' :
                                                    notif.type === 'billing' ? 'bg-green-100 text-green-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                                </span>
                                            </div>
                                            <h4 className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {notif.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {notif.message}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-foreground">{user?.name || 'Loading...'}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.plan || 'Starter'} Plan</p>
                    </div>
                    <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple border border-brand-purple/20 overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
