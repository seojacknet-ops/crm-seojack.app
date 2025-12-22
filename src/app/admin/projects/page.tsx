'use client';

import React from 'react';
import { useAdminStore } from '@/lib/store/admin-store';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Filter, MoreHorizontal, Clock, AlertCircle } from "lucide-react"
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const stages = [
    { id: 'onboarding', name: 'Onboarding', color: 'bg-blue-500' },
    { id: 'design', name: 'Design', color: 'bg-purple-500' },
    { id: 'development', name: 'Dev', color: 'bg-orange-500' },
    { id: 'review', name: 'Review', color: 'bg-yellow-500' },
    { id: 'live', name: 'Live', color: 'bg-green-500' },
]

export default function ProjectsPage() {
    const { projects, users, isLoading, fetchDashboardData } = useAdminStore();

    React.useEffect(() => {
        if (projects.length === 0) {
            fetchDashboardData();
        }
    }, []);

    const getOwnerName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
    };

    const getOwnerPlan = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user ? user.plan : 'starter';
    };

    return (
        <div className="p-6 h-full flex flex-col max-w-[1800px] mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project Pipeline</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track project progress from onboarding to launch.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button className="h-9 bg-indigo-600 hover:bg-indigo-700"><Plus className="mr-2 h-4 w-4" /> New Project</Button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 -mx-6 px-6">
                <div className="flex gap-6 min-w-max h-full">
                    {stages.map((stage) => {
                        const stageProjects = projects.filter(p => p.status === stage.id);
                        return (
                            <div key={stage.id} className="w-80 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h3 className="uppercase tracking-wide text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                                        {stage.name}
                                    </h3>
                                    <span className="text-xs font-medium text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                        {isLoading ? '-' : stageProjects.length}
                                    </span>
                                </div>

                                <div className="space-y-3 overflow-y-auto flex-1 pr-2 pb-2 custom-scrollbar">
                                    {isLoading ? (
                                        [1, 2].map(i => (
                                            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                                        ))
                                    ) : (
                                        stageProjects.map((project) => (
                                            <Link href={`/admin/projects/${project.id}`} key={project.id}>
                                                <Card className="group cursor-pointer border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900 rounded-lg mb-3">
                                                    <CardContent className="p-4 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{project.businessName || 'Untitled'}</h4>
                                                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 capitalize">
                                                                    {getOwnerPlan(project.userId)}
                                                                </Badge>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-2 text-gray-300 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="h-3 w-3" />
                                                            </Button>
                                                        </div>

                                                        <div className="pt-2 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                <span>
                                                                    {project.updatedAt ? formatDistanceToNow(new Date(project.updatedAt as any), { addSuffix: true }) : 'Just now'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))
                                    )}

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
