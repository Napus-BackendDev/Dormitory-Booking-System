import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  employeeId?: string;
  phone?: string;
  department?: string;
  roomNumber?: string;
  building?: string;
  profileImage?: string;
  isActive: boolean;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  
  role: {
    id: string;
    name: string;
    description: string;
  };
}

export function useUser() {
  const api = useApi<User[]>();
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = useCallback(async (filters?: {
    role?: string;
    department?: string;
    isActive?: boolean;
    search?: string;
  }) => {
    try {
      const query = new URLSearchParams();
      if (filters?.role) query.set('role', filters.role);
      if (filters?.department) query.set('department', filters.department);
      if (filters?.isActive !== undefined) query.set('isActive', String(filters.isActive));
      if (filters?.search) query.set('search', filters.search);

      const endpoint = `/users?${query.toString()}`;
      const result = await api.execute(endpoint);
      
      if (result) {
        setUsers(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }, [api]);

  const getUser = useCallback(async (id: string) => {
    try {
      return await api.execute(`/users/${id}`);
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  }, [api]);

  const getTechnicians = useCallback(async (available = true) => {
    try {
      return await api.execute(`/users?role=technician&isActive=${available}`);
    } catch (error) {
      console.error('Failed to get technicians:', error);
      throw error;
    }
  }, [api]);

  const createUser = useCallback(async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>) => {
    try {
      const result = await api.execute('/users', {
        method: 'POST',
        body: data,
      });
      
      if (result) {
        setUsers(prev => [...prev, result]);
      }
      return result;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }, [api]);

  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    try {
      const result = await api.execute(`/users/${id}`, {
        method: 'PUT',
        body: data,
      });
      
      if (result) {
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, ...result } : user
        ));
      }
      return result;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }, [api]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await api.execute(`/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }, [api]);

  return {
    users,
    loading: api.loading,
    error: api.error,
    getUsers,
    getUser,
    getTechnicians,
    createUser,
    updateUser,
    deleteUser,
    refresh: () => getUsers(),
  };
}