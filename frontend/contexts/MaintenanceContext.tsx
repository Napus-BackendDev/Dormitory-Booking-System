import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useTicket from '@/hooks/useTicket';
import { useAuth } from './AuthContext';
import { Ticket, TicketStatus } from '@/types/Ticket';

export type TicketEventType =
  | 'created'           // สร้างคำร้อง
  | 'assigned'          // มอบหมายช่าง
  | 'status_changed'    // เปลี่ยนสถานะ
  | 'note_added'        // เพิ่มโน้ต
  | 'completed'         // ทำงานเสร็จสิ้น
  | 'rated'             // ให้คะแนน
  | 'updated';          // อัพเดทข้อมูล

export interface TicketEvent {
  id: string;
  ticketId: string;
  type: TicketEventType;
  description: string;
  userId: string;
  userName: string;
  userRole?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SLASettings {
  high: number; // hours
  medium: number;
  low: number;
}

interface MaintenanceContextType {
  tickets: Ticket[];
  addTicket: (request: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateTicketStatus: (id: string, status: TicketStatus, technicianId?: string, technicianName?: string) => void;
  assign: (id: string, technicianId: string) => Promise<void>;
  complete: (id: string, technicianId: string) => Promise<void>;
  refetch: () => Promise<void>;
  slaSettings: SLASettings;
  updateSLASettings: (settings: SLASettings) => void;
  getTicketById: (id: string) => Ticket | undefined;
  addEvent: (event: Omit<TicketEvent, 'id' | 'timestamp'>) => void;
  addNote: (ticketId: string, note: string, userId: string, userName: string, userRole?: string) => void;
  getEventsByTicketId: (ticketId: string) => TicketEvent[];
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

// Start with empty arrays — real data will come from the ticket API (useTicket)
const initialEvents: TicketEvent[] = [];
const initialRequests: Ticket[] = [];

export const MaintenanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialRequests);
  const [events, setEvents] = useState<TicketEvent[]>(initialEvents);
  const [slaSettings, setSLASettings] = useState<SLASettings>({
    high: 24,
    medium: 48,
    low: 72,
  });

  // Integrate tickets from API via useTicket
  const { tickets: ticketList, fetchAll: fetchTickets, acceptTicket, completeTicket } = useTicket();
  const { user, loading: authLoading } = useAuth();

  // Fetch tickets when auth is ready and we have a user.
  useEffect(() => {
    if (authLoading || !user) return;
    try {
      if (fetchTickets) {
        fetchTickets();
      }
    } catch (e) {
      // ignore
    }
    // run whenever user/auth loading changes
  }, [authLoading, user]);

  // Map incoming tickets into Ticket and replace local tickets
  useEffect(() => {
    // If there are no tickets, clear requests/events to avoid using local mock data
    if (!ticketList || ticketList.length === 0) {
      setTickets([]);
      setEvents([]);
      return;
    }

    const mapped = ticketList.map((t: any): Ticket => ({
      id: t.id,
      userId: t.userId ?? 'system',
      userName: t.userName ?? 'ระบบ',
      title: t.title ?? (t.code ?? 'Ticket'),
      description: t.description ?? '',
      images: t.photo ? (Array.isArray(t.photo) ? t.photo : [t.photo]) : t.images ?? [],
      status: t.status ?? 'ASSIGNED',
      priority: t.priority,
      createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
      technicianId: t.technicianId ?? t.assignedTo ?? undefined,
      technicianName: t.technicianName ?? t.assignedToName ?? undefined,
      rating: t.rating ?? undefined,
      feedback: t.feedback ?? undefined,
    }));

    // Map ticket events if provided by API into our TicketEvent shape
    const mappedEvents: TicketEvent[] = [];
    ticketList.forEach((t: any) => {
      if (Array.isArray(t.events) && t.events.length > 0) {
        t.events.forEach((e: any) => {
          mappedEvents.push({
            id: e.id || `evt-${t.id}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            ticketId: t.id,
            type: (e.type as TicketEventType) || 'updated',
            description: e.description || e.note || '',
            userId: e.userId || e.createdBy || t.userId || 'system',
            userName: e.userName || e.createdByName || t.userName || 'ระบบ',
            userRole: e.userRole || undefined,
            timestamp: e.timestamp ? new Date(e.timestamp) : e.createdAt ? new Date(e.createdAt) : new Date(),
            metadata: e.metadata || {},
          });
        });
      }
    });

    // Replace tickets/events with API data (no local mock data)
    setTickets(mapped);
    // sort events newest-first
    setEvents(mappedEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, [ticketList]);

  const addEvent = (event: Omit<TicketEvent, 'id' | 'timestamp'>) => {
    const newEvent: TicketEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const addNote = (ticketId: string, note: string, userId: string, userName: string, userRole?: string) => {
    addEvent({
      ticketId,
      type: 'note_added',
      description: note,
      userId,
      userName,
      userRole,
      metadata: { note },
    });
  };

  const getEventsByTicketId = (ticketId: string): TicketEvent[] => {
    return events.filter(event => event.ticketId === ticketId).sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const addTicket = (request: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...request,
      id: Date.now().toString(),
      status: 'ASSIGNED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (
    id: string,
    status: TicketStatus,
    technicianId?: string,
    technicianName?: string
  ) => {
    const request = tickets.find(req => req.id === id);
    const oldStatus = request?.status;

    setTickets(prev =>
      prev.map(req =>
        req.id === id
          ? {
            ...req,
            status,
            updatedAt: new Date(),
            ...(technicianId && { technicianId, technicianName }),
            ...(status === 'COMPLETED' && { completedAt: new Date() }),
          }
          : req
      )
    );
  };

  const assign = async (ticketId: string, technicianId: string) => {
    try {
      if (acceptTicket) {
        const res = await acceptTicket(ticketId, technicianId);
        if (!res) throw new Error('Accept ticket API returned empty');
      }
    } catch (err) {
      console.error('assignTicket failed:', err);
    }
  };

  const complete = async (ticketId: string, technicianId: string) => {
    try {
      if (completeTicket) {
        const res = await completeTicket(ticketId, technicianId);
        if (!res) throw new Error('Complete ticket API returned empty');
      }
    } catch (err) {
      console.error('completeTicket failed:', err);
    }
  };

  const refetch = async () => {
    try {
      if (fetchTickets) await fetchTickets();
    } catch (err) {
      console.error('refetch tickets failed', err);
    }
  };

  const updateSLASettings = (settings: SLASettings) => {
    setSLASettings(settings);
  };

  const getTicketById = (id: string) => {
    return tickets.find(req => req.id === id);
  };

  return (
    <MaintenanceContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        assign,
        complete,
        refetch,
        slaSettings,
        updateSLASettings,
        getTicketById,
        addEvent,
        addNote,
        getEventsByTicketId,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
