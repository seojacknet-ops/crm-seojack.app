"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Ticket, DollarSign, ArrowRight, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAdminStore } from "@/lib/store/admin-store"

export default function AdminDashboard() {
    const { stats, projects, isLoading, fetchDashboardData } = useAdminStore()

    React.useEffect(() => {
        fetchDashboardData()
    }, [])

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Command Center</h1>
                    <p className="text-sm text-muted-foreground mt-1">Overview of your agency's performance and critical tasks.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 text-muted-foreground hover:text-foreground">
                        <Search className="mr-2 h-4 w-4" />
                        Search (⌘K)
                    </Button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{isLoading ? "..." : stats.activeProjects}</div>
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">Total active projects</p>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                            <Ticket className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{isLoading ? "..." : stats.openTickets}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue (Est.)</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">£{isLoading ? "..." : stats.totalRevenue}</div>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                            <span className="text-muted-foreground font-normal">Based on active plans</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Pipeline */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Project Pipeline</h2>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-indigo-600">View Board <ArrowRight className="ml-1 h-3 w-3" /></Button>
                    </div>
                    <Card className="border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {projects.length === 0 && !isLoading && (
                                    <div className="text-center text-muted-foreground py-4">No projects found.</div>
                                )}
                                {projects.map((project) => (
                                    <div key={project.id} className="space-y-2 group cursor-pointer border-b border-gray-50 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between text-sm items-center">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-base">{project.businessName}</span>
                                                <span className="text-xs text-muted-foreground">ID: {project.id.substring(0, 8)}</span>
                                            </div>
                                            <Badge variant="secondary" className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-wide px-2.5 py-0.5">{project.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
