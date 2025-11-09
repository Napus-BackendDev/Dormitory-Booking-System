'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { MaintenanceProvider } from '@/contexts/MaintenanceContext'
import { BuildingProvider } from '@/contexts/BuildingContext'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BuildingProvider>
        <MaintenanceProvider>
          {children}
          <Toaster />
        </MaintenanceProvider>
      </BuildingProvider>
    </AuthProvider>
  )
}
