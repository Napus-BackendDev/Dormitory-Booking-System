'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserDashboard } from '@/components/dashboards/UserDashboard'
import { TechnicianDashboard } from '@/components/dashboards/TechnicianDashboard'
import { SupervisorDashboard } from '@/components/dashboards/SupervisorDashboard'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { Navbar } from '@/components/common/Navbar'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC2626] mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  )
}
