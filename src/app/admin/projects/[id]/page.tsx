'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store/admin-store';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Mail, Clock, CheckCircle, FileText, Layout } from 'lucide-react';
import { ProjectTimeline } from '@/components/features/dashboard/ProjectTimeline';
import { format } from 'date-fns';

export default function AdminProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { projects, users, isLoading, fetchDashboardData } = useAdminStore();
    const projectId = params.id as string;

    React.useEffect(() => {
        if (projects.length === 0) {
            fetchDashboardData();
        }
    }, []);

    const project = projects.find(p => p.id === projectId);
    const user = project ? users.find(u => u.id === project.userId) : null;

    if (isLoading) {
        return <div className="p-8 text-center">Loading project details...</div>;
    }

    if (!project) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Project Not Found</h2>
                <Button onClick={() => router.push('/admin/projects')}>Back to Projects</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin/projects')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{project.businessName}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{project.industry}</span>
                            <span>•</span>
                            <span className="capitalize">{project.status} Phase</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Edit Details</Button>
                    <Button>Update Status</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProjectTimeline />
                        </CardContent>
                    </Card>

                    {/* Project Brief */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Brief</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                                <p className="text-gray-900">{project.brief?.pubDescription || 'No description provided.'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Target Audience</h4>
                                    <p className="text-gray-900">{project.brief?.targetCustomer || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Design Preferences</h4>
                                    <p className="text-gray-900">{project.brief?.vibe || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Client Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                            {user.name?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Plan</span>
                                            <Badge variant="outline" className="capitalize">{user.plan}</Badge>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Joined</span>
                                            <span>{user.createdAt ? format(new Date(user.createdAt as any), 'MMM d, yyyy') : '-'}</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full mt-2">
                                        <Mail className="mr-2 h-4 w-4" /> Email Client
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-gray-500">Client information not available.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" /> View Files
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Layout className="mr-2 h-4 w-4" /> Preview Website
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                <ExternalLink className="mr-2 h-4 w-4" /> Open in Stripe
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
