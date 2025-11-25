'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Globe, MessageSquare, HardDrive, CreditCard, Settings, LogOut } from 'lucide-react';

export const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'My Website', href: '/website', icon: Globe },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Media Vault', href: '/vault', icon: HardDrive },
    { label: 'Billing', href: '/billing', icon: CreditCard },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-background border-r border-border h-screen fixed left-0 top-0 z-40">
            {/* Logo Area */}
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold tracking-tight">
                    <span className="text-foreground">SEO</span>
                    <span className="bg-gradient-to-r from-brand-purple to-accent-pink bg-clip-text text-transparent">Jack</span>
                </h1>
            </div>

            {/* Navigation */}
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

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border space-y-1">
                <Link
                    href="/settings"
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
                >
                    <Settings className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-foreground" />
                    Settings
                </Link>
                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Log Out
                </button>
            </div>
        </aside>
    );
};
