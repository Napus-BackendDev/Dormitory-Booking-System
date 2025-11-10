'use client';

import { AuthProvider } from '../../contexts/AuthContext';
import { MaintenanceProvider } from '../../contexts/MaintenanceContext';

export const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <MaintenanceProvider>
        {children}
      </MaintenanceProvider>
    </AuthProvider>
  );
};