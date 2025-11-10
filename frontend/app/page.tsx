'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/components/auth/LoginPage'
import { UserDashboard } from '@/components/dashboards/UserDashboard'
import { TechnicianDashboard } from '@/components/dashboards/TechnicianDashboard'
import { SupervisorDashboard } from '@/components/dashboards/SupervisorDashboard'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { Navbar } from '@/components/common/Navbar'
import { ProfileManagement } from '@/components/features/profile/ProfileManagement'
import { ReportsAnalytics } from '@/components/features/reports/ReportsAnalytics'

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Reset to dashboard when user changes (login/logout)
  useEffect(() => {
    if (user) {
      setCurrentPage('dashboard')
    }
  }, [user])

  if (!isAuthenticated || !user) {
    return <LoginPage />
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'user':
        return <UserDashboard />
      case 'technician':
        return <TechnicianDashboard />
      case 'supervisor':
        return <SupervisorDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return <UserDashboard />
    }
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard()
      case 'reports':
        // Only show reports for supervisor and admin
        if (user.role === 'supervisor' || user.role === 'admin') {
          return <ReportsAnalytics />
        }
        return renderDashboard()
      case 'profile':
        return <ProfileManagement />
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
