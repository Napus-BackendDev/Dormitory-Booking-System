import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface RepairType {
  id: string;
  name: string;
  description?: string;
  category: 'electrical' | 'plumbing' | 'furniture' | 'network' | 'other';
  estimatedTime: number; // minutes
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useRepairType() {
  const api = useApi<RepairType[]>();
  const [repairTypes, setRepairTypes] = useState<RepairType[]>([]);

  const getRepairTypes = useCallback(async (filters?: {
    category?: string;
    isActive?: boolean;
  }) => {
    try {
      const query = new URLSearchParams();
      if (filters?.category) query.set('category', filters.category);
      if (filters?.isActive !== undefined) query.set('isActive', String(filters.isActive));

      const endpoint = `/repair-types?${query.toString()}`;
      const result = await api.execute(endpoint);
      
      if (result) {
        setRepairTypes(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch repair types:', error);
      throw error;
    }
  }, [api]);

  const createRepairType = useCallback(async (data: Omit<RepairType, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await api.execute('/repair-types', {
        method: 'POST',
        body: data,
      });
      
      if (result) {
        setRepairTypes(prev => [...prev, result]);
      }
      return result;
    } catch (error) {
      console.error('Failed to create repair type:', error);
      throw error;
    }
  }, [api]);

  const updateRepairType = useCallback(async (id: string, data: Partial<RepairType>) => {
    try {
      const result = await api.execute(`/repair-types/${id}`, {
        method: 'PUT',
        body: data,
      });
      
      if (result) {
        setRepairTypes(prev => prev.map(type => 
          type.id === id ? { ...type, ...result } : type
        ));
      }
      return result;
    } catch (error) {
      console.error('Failed to update repair type:', error);
      throw error;
    }
  }, [api]);

  const deleteRepairType = useCallback(async (id: string) => {
    try {
      await api.execute(`/repair-types/${id}`, { method: 'DELETE' });
      setRepairTypes(prev => prev.filter(type => type.id !== id));
    } catch (error) {
      console.error('Failed to delete repair type:', error);
      throw error;
    }
  }, [api]);

  return {
    repairTypes,
    loading: api.loading,
    error: api.error,
    getRepairTypes,
    createRepairType,
    updateRepairType,
    deleteRepairType,
    refresh: () => getRepairTypes(),
  };
}