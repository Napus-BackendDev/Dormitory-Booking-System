'use client';

import { AuthProvider } from '../contexts/AuthContext';
import { MaintenanceProvider } from '../contexts/MaintenanceContext';
import { Toaster } from '../components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MaintenanceProvider>
        {children}
        <Toaster />
      </MaintenanceProvider>
    </AuthProvider>
  );
}
