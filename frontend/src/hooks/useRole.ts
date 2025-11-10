import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export function useRole() {
  const api = useApi<Role[]>();
  const [roles, setRoles] = useState<Role[]>([]);

  const getRoles = useCallback(async (includeUserCount = false) => {
    try {
      const endpoint = `/roles${includeUserCount ? '?includeUserCount=true' : ''}`;
      const result = await api.execute(endpoint);
      
      if (result) {
        setRoles(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      throw error;
    }
  }, [api]);

  const createRole = useCallback(async (data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>) => {
    try {
      const result = await api.execute('/roles', {
        method: 'POST',
        body: data,
      });
      
      if (result) {
        setRoles(prev => [...prev, result]);
      }
      return result;
    } catch (error) {
      console.error('Failed to create role:', error);
      throw error;
    }
  }, [api]);

  const updateRole = useCallback(async (id: string, data: Partial<Role>) => {
    try {
      const result = await api.execute(`/roles/${id}`, {
        method: 'PUT',
        body: data,
      });
      
      if (result) {
        setRoles(prev => prev.map(role => 
          role.id === id ? { ...role, ...result } : role
        ));
      }
      return result;
    } catch (error) {
      console.error('Failed to update role:', error);
      throw error;
    }
  }, [api]);

  const deleteRole = useCallback(async (id: string) => {
    try {
      await api.execute(`/roles/${id}`, { method: 'DELETE' });
      setRoles(prev => prev.filter(role => role.id !== id));
    } catch (error) {
      console.error('Failed to delete role:', error);
      throw error;
    }
  }, [api]);

  return {
    roles,
    loading: api.loading,
    error: api.error,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    refresh: () => getRoles(),
  };
}