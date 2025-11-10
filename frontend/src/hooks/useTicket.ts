import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface Ticket {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reporterId: string;
  assigneeId?: string;
  locationId?: string;
  repairTypeId?: string;
  dueAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  reporter?: {
    id: string;
    name: string;
    email: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  location?: {
    building: string;
    roomNumber: string;
  };
  repairType?: {
    name: string;
    category: string;
  };
  attachments?: Array<{
    id: string;
    url: string;
    filename: string;
  }>;
}

export function useTicket() {
  const api = useApi<Ticket[]>();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const getTickets = useCallback(async (filters?: {
    status?: string;
    priority?: string;
    assigneeId?: string;
    reporterId?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const query = new URLSearchParams();
      if (filters?.status) query.set('status', filters.status);
      if (filters?.priority) query.set('priority', filters.priority);
      if (filters?.assigneeId) query.set('assigneeId', filters.assigneeId);
      if (filters?.reporterId) query.set('reporterId', filters.reporterId);
      if (filters?.page) query.set('page', String(filters.page));
      if (filters?.limit) query.set('limit', String(filters.limit));

      const endpoint = `/tickets?${query.toString()}`;
      const result = await api.execute(endpoint);
      
      if (result) {
        setTickets(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      throw error;
    }
  }, [api]);

  const createTicket = useCallback(async (data: {
    title: string;
    description: string;
    priority: string;
    locationId?: string;
    repairTypeId?: string;
  }) => {
    try {
      const result = await api.execute('/tickets', {
        method: 'POST',
        body: data,
      });
      
      if (result) {
        setTickets(prev => [result, ...prev]);
      }
      return result;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  }, [api]);

  const getTicket = useCallback(async (id: string) => {
    try {
      return await api.execute(`/tickets/${id}`);
    } catch (error) {
      console.error('Failed to get ticket:', error);
      throw error;
    }
  }, [api]);

  const updateTicket = useCallback(async (id: string, data: Partial<Ticket>) => {
    try {
      const result = await api.execute(`/tickets/${id}`, {
        method: 'PUT',
        body: data,
      });
      
      if (result) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === id ? { ...ticket, ...result } : ticket
        ));
      }
      return result;
    } catch (error) {
      console.error('Failed to update ticket:', error);
      throw error;
    }
  }, [api]);

  const assignTicket = useCallback(async (id: string, assigneeId: string) => {
    try {
      const result = await api.execute(`/tickets/${id}/assign`, {
        method: 'PUT',
        body: { assigneeId },
      });
      
      if (result) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === id ? { ...ticket, ...result } : ticket
        ));
      }
      return result;
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      throw error;
    }
  }, [api]);

  const completeTicket = useCallback(async (id: string, note?: string) => {
    try {
      return await updateTicket(id, { 
        status: 'completed', 
        completedAt: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Failed to complete ticket:', error);
      throw error;
    }
  }, [updateTicket]);

  return {
    tickets,
    loading: api.loading,
    error: api.error,
    getTickets,
    createTicket,
    getTicket,
    updateTicket,
    assignTicket,
    completeTicket,
    refresh: () => getTickets(),
  };
}