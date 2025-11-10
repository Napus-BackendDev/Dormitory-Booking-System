'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ReportsAnalytics } from '@/components/features/reports/ReportsAnalytics'
import { Navbar } from '@/components/common/Navbar'

export default function ReportsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    } else if (!loading && user && user.role !== 'supervisor' && user.role !== 'admin') {
      // Only supervisor and admin can access reports
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, user, router])

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

  if (!isAuthenticated || !user || (user.role !== 'supervisor' && user.role !== 'admin')) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportsAnalytics />
      </main>
    </div>
  )
}
