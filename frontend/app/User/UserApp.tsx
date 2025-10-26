'use client';

import React, { useState } from 'react';
import Dashboard from './Dashboard_User';
import Profile from './Profile_User';

export type PageType = 'dashboard' | 'profile';

const UserApp = () => {
    const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

    const handleNavigation = (page: PageType) => {
        setCurrentPage(page);
    };

    if (currentPage === 'profile') {
        return <Profile onNavigate={handleNavigation} currentPage={currentPage} />;
    }

    return <Dashboard onNavigate={handleNavigation} currentPage={currentPage} />;
};

export default UserApp;