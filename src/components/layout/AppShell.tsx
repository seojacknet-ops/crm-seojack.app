"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

// Routes that should render without the app shell (no sidebar/header)
const STANDALONE_ROUTES = ['/login', '/onboarding']

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith("/admin")
    
    // Check if current route should be standalone (no shell)
    const isStandaloneRoute = STANDALONE_ROUTES.some(route => 
        pathname === route || pathname?.startsWith(`${route}/`)
    )

    // Admin pages and standalone routes render without shell
    if (isAdmin || isStandaloneRoute) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    )
}
