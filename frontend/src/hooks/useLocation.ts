import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface Location {
  id: string;
  building: string;
  floor: number;
  roomNumber: string;
  roomType: 'dormitory' | 'common' | 'facility';
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useLocation() {
  const api = useApi<Location[]>();
  const [locations, setLocations] = useState<Location[]>([]);

  const getLocations = useCallback(async (filters?: {
    building?: string;
    floor?: number;
    roomType?: string;
    isActive?: boolean;
  }) => {
    try {
      const query = new URLSearchParams();
      if (filters?.building) query.set('building', filters.building);
      if (filters?.floor) query.set('floor', String(filters.floor));
      if (filters?.roomType) query.set('roomType', filters.roomType);
      if (filters?.isActive !== undefined) query.set('isActive', String(filters.isActive));

      const endpoint = `/locations?${query.toString()}`;
      const result = await api.execute(endpoint);
      
      if (result) {
        setLocations(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      throw error;
    }
  }, [api]);

  const createLocation = useCallback(async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await api.execute('/locations', {
        method: 'POST',
        body: data,
      });
      
      if (result) {
        setLocations(prev => [...prev, result]);
      }
      return result;
    } catch (error) {
      console.error('Failed to create location:', error);
      throw error;
    }
  }, [api]);

  const updateLocation = useCallback(async (id: string, data: Partial<Location>) => {
    try {
      const result = await api.execute(`/locations/${id}`, {
        method: 'PUT',
        body: data,
      });
      
      if (result) {
        setLocations(prev => prev.map(loc => 
          loc.id === id ? { ...loc, ...result } : loc
        ));
      }
      return result;
    } catch (error) {
      console.error('Failed to update location:', error);
      throw error;
    }
  }, [api]);

  const deleteLocation = useCallback(async (id: string) => {
    try {
      await api.execute(`/locations/${id}`, { method: 'DELETE' });
      setLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (error) {
      console.error('Failed to delete location:', error);
      throw error;
    }
  }, [api]);

  return {
    locations,
    loading: api.loading,
    error: api.error,
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    refresh: () => getLocations(),
  };
}