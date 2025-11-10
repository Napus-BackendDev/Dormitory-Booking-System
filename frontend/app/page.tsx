'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/components/auth/LoginPage'
import { UserDashboard } from '@/components/dashboards/UserDashboard'
import { TechnicianDashboard } from '@/components/dashboards/TechnicianDashboard'
import { SupervisorDashboard } from '@/components/dashboards/SupervisorDashboard'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { Navbar } from '@/components/common/Navbar'
import { ReportsAnalytics } from '@/components/features/reports/ReportsAnalytics'
import { ProfileManagement } from '@/components/features/profile/ProfileManagement'

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

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
        if (user.role === 'supervisor' || user.role === 'technician' || user.role === 'admin') {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
