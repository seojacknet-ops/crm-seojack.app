'use client';

import Link from "next/link"
import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/features/admin/AdminGuard';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Inbox,
    Ticket,
    LogOut
} from "lucide-react"
import { useAuth } from '@/hooks/useAuth';

const navigation = [
    { name: 'Command Center', href: '/admin', icon: LayoutDashboard },
    { name: 'Clients', href: '/admin/users', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Inbox', href: '/admin/inbox', icon: Inbox },
    { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, signOut } = useAuth();

    return (
        <AdminGuard>
            <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col flex-shrink-0 z-40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                    <div className="p-8 pb-6">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            SEOJACK <span className="text-gray-400 font-normal">OPS</span>
                        </h1>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar">
                        <ul className="space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group"
                                    >
                                        <item.icon className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 pb-20">
                        <div className="flex items-center gap-3 mb-3">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || 'Admin'}
                                    className="h-9 w-9 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800 object-cover"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white dark:ring-gray-800">
                                    {(user?.displayName || 'Admin').substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user?.displayName || 'Admin User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut className="h-3 w-3" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 h-full overflow-y-auto bg-gray-50/50 dark:bg-gray-950 relative">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    )
}
