'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, User, Menu, Settings, LogOut } from 'lucide-react';

import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/components/layout/Sidebar";

export const Header = () => {
    const pathname = usePathname();

    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.length > 0
        ? pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1))
        : ['Home'];

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
                                    <span className="text-foreground">SEO</span>
                                    <span className="bg-gradient-to-r from-brand-purple to-accent-pink bg-clip-text text-transparent">Jack</span>
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
                                <button className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
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

                <button className="relative p-2 text-muted-foreground hover:text-brand-purple transition-colors rounded-full hover:bg-surface-hover">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent-pink rounded-full border-2 border-background"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-foreground">Alex Johnson</p>
                        <p className="text-xs text-muted-foreground">Pro Plan</p>
                    </div>
                    <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple border border-brand-purple/20">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};
