import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'technician' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
  dormBuilding?: string;
  roomNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users สำหรับทดสอบ
const mockUsers: Record<string, User> = {
  'user@dorm.com': {
    id: '1',
    name: 'สมชาย ใจดี',
    email: 'user@dorm.com',
    role: 'user',
    department: 'คณะวิศวกรรมศาสตร์',
    phone: '081-234-5678',
    dormBuilding: 'หอพักชาย A',
    roomNumber: '301',
  },
  'technician@dorm.com': {
    id: '2',
    name: 'สมศักดิ์ ช่างซ่อม',
    email: 'technician@dorm.com',
    role: 'technician',
    department: 'ทีมซ่อมบำรุง',
    phone: '081-345-6789',
  },
  'supervisor@dorm.com': {
    id: '3',
    name: 'สมหญิง ผู้จัดการ',
    email: 'supervisor@dorm.com',
    role: 'supervisor',
    department: 'ฝ่ายบริหาร',
    phone: '081-456-7890',
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers[email];
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
