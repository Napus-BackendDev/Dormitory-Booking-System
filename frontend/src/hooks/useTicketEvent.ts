import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface TicketEvent {
  id: string;
  ticketId: string;
  type: 'created' | 'assigned' | 'status_changed' | 'comment' | 'completed' | 'cancelled';
  note?: string;
  userId: string;
  previousValue?: string;
  newValue?: string;
  createdAt: string;
  
  // Relations
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function useTicketEvent() {
  const api = useApi<TicketEvent[]>();
  const [events, setEvents] = useState<TicketEvent[]>([]);

  const getEventsByTicket = useCallback(async (ticketId: string) => {
    try {
      const result = await api.execute(`/ticket-events?ticketId=${ticketId}`);
      if (result) {
        setEvents(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch ticket events:', error);
      throw error;
    }
  }, [api]);

  const createEvent = useCallback(async (data: {
    ticketId: string;
    type: string;
    note?: string;
    previousValue?: string;
    newValue?: string;
  }) => {
    try {
      const result = await api.execute('/ticket-events', {
        method: 'POST',
        body: data,
      });
      
      if (result) {
        setEvents(prev => [...prev, result]);
      }
      return result;
    } catch (error) {
      console.error('Failed to create ticket event:', error);
      throw error;
    }
  }, [api]);

  const addComment = useCallback(async (ticketId: string, note: string) => {
    return createEvent({
      ticketId,
      type: 'comment',
      note,
    });
  }, [createEvent]);

  const logStatusChange = useCallback(async (
    ticketId: string, 
    previousStatus: string, 
    newStatus: string, 
    note?: string
  ) => {
    return createEvent({
      ticketId,
      type: 'status_changed',
      previousValue: previousStatus,
      newValue: newStatus,
      note,
    });
  }, [createEvent]);

  return {
    events,
    loading: api.loading,
    error: api.error,
    getEventsByTicket,
    createEvent,
    addComment,
    logStatusChange,
  };
}