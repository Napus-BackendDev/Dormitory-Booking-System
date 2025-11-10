import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'technician' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users สำหรับทดสอบ
const mockUsers: Record<string, User> = {
  'user@dorm.com': {
    id: '1',
    name: 'สมชาย ใจดี',
    email: 'user@dorm.com',
    role: 'user',
    phone: '081-234-5678',
  },
  'technician@dorm.com': {
    id: '2',
    name: 'สมศักดิ์ ช่างซ่อม',
    email: 'technician@dorm.com',
    role: 'technician',
    phone: '081-345-6789',
  },
  'supervisor@dorm.com': {
    id: '3',
    name: 'สมหญิง ผู้จัดการ',
    email: 'supervisor@dorm.com',
    role: 'supervisor',
    phone: '081-456-7890',
  },
  'admin@dorm.com': {
    id: '4',
    name: 'ผู้ดูแลระบบ',
    email: 'admin@dorm.com',
    role: 'admin',
    phone: '081-567-8901',
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = mockUsers[email];
      if (foundUser) {
        setUser(foundUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setLoading(false);
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
        loading,
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
