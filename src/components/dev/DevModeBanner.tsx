'use client';

import React, { useState, useEffect } from 'react';
import { X, Wrench, User, Users, Shield } from 'lucide-react';
import { 
    isDevModeEnabled, 
    getDevUserType, 
    clearDevMode,
    setDevUserType,
    getDevRedirectPath,
    DevUserType 
} from '@/lib/dev/dev-mode';
import { useRouter, usePathname } from 'next/navigation';

export function DevModeBanner() {
    const router = useRouter();
    const pathname = usePathname();
    const [isDevMode, setIsDevMode] = useState(false);
    const [userType, setUserType] = useState<DevUserType>('none');
    const [showSwitcher, setShowSwitcher] = useState(false);

    useEffect(() => {
        // Check on mount and when pathname changes
        setIsDevMode(isDevModeEnabled());
        setUserType(getDevUserType());
    }, [pathname]);

    const handleExitDevMode = () => {
        clearDevMode();
        router.push('/login');
    };

    const handleSwitchUser = (type: DevUserType) => {
        setDevUserType(type);
        setUserType(type);
        setShowSwitcher(false);
        const redirectPath = getDevRedirectPath(type);
        router.push(redirectPath);
    };

    if (!isDevMode) return null;

    const userTypeConfig = {
        new_user: { label: 'New User', icon: User, color: 'blue' },
        returning_user: { label: 'Returning User', icon: Users, color: 'green' },
        admin: { label: 'Admin', icon: Shield, color: 'red' },
        none: { label: 'None', icon: Wrench, color: 'gray' },
    };

    const config = userTypeConfig[userType];
    const IconComponent = config.icon;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Wrench className="h-4 w-4" />
                    <span className="text-sm font-medium">Dev Mode Active</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                        {config.label}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* User Type Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSwitcher(!showSwitcher)}
                            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                        >
                            <IconComponent className="h-3 w-3" />
                            Switch User
                        </button>

                        {showSwitcher && (
                            <div className="absolute right-0 top-full mt-1 bg-gray-900 rounded-lg shadow-xl py-1 min-w-[160px] animate-in fade-in slide-in-from-top-1">
                                <button
                                    onClick={() => handleSwitchUser('new_user')}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-800 flex items-center gap-2 ${userType === 'new_user' ? 'bg-gray-800' : ''}`}
                                >
                                    <User className="h-3 w-3 text-blue-400" />
                                    New User
                                </button>
                                <button
                                    onClick={() => handleSwitchUser('returning_user')}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-800 flex items-center gap-2 ${userType === 'returning_user' ? 'bg-gray-800' : ''}`}
                                >
                                    <Users className="h-3 w-3 text-green-400" />
                                    Returning User
                                </button>
                                <button
                                    onClick={() => handleSwitchUser('admin')}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-800 flex items-center gap-2 ${userType === 'admin' ? 'bg-gray-800' : ''}`}
                                >
                                    <Shield className="h-3 w-3 text-red-400" />
                                    Admin
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Exit Dev Mode */}
                    <button
                        onClick={handleExitDevMode}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                    >
                        <X className="h-3 w-3" />
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
}

