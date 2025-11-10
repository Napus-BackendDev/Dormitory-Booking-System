import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RequestStatus = 'pending' | 'in_progress' | 'completed';
export type RequestPriority = 'low' | 'medium' | 'high';

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
  metadata?: Record<string, any>; // เก็บข้อมูลเพิ่มเติม เช่น status เก่า/ใหม่, คะแนน, ฯลฯ
}

export interface MaintenanceRequest {
  id: string;
  userId: string;
  userName: string;
  maintenanceType?: string; // ID of maintenance type
  maintenanceTypeName?: string; // Name of maintenance type for display
  title: string;
  description: string;
  images?: string[];
  status: RequestStatus;
  priority: RequestPriority;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  assignedToName?: string;
  completedAt?: Date;
  rating?: number;
  feedback?: string;
}

export interface SLASettings {
  high: number; // hours
  medium: number;
  low: number;
}

interface MaintenanceContextType {
  requests: MaintenanceRequest[];
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus, assignedTo?: string, assignedToName?: string) => void;
  assignRequest: (id: string, technicianId: string, technicianName: string) => void;
  completeRequest: (id: string, rating?: number, feedback?: string) => void;
  slaSettings: SLASettings;
  updateSLASettings: (settings: SLASettings) => void;
  getRequestById: (id: string) => MaintenanceRequest | undefined;
  // Ticket Events
  events: TicketEvent[];
  addEvent: (event: Omit<TicketEvent, 'id' | 'timestamp'>) => void;
  addNote: (ticketId: string, note: string, userId: string, userName: string, userRole?: string) => void;
  getEventsByTicketId: (ticketId: string) => TicketEvent[];
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

// Mock data - Initial events for existing requests
const initialEvents: TicketEvent[] = [
  // Events for ticket #1 (pending)
  {
    id: 'evt-1-1',
    ticketId: '1',
    type: 'created',
    description: 'สร้างคำขอซ่อม: ท่อน้ำรั่ว',
    userId: '1',
    userName: 'สมชาย ใจดี',
    userRole: 'user',
    timestamp: new Date('2025-10-20T08:00:00'),
    metadata: { title: 'ท่อน้ำรั่ว', category: 'ประปา', priority: 'high' },
  },
  // Events for ticket #2 (in_progress)
  {
    id: 'evt-2-1',
    ticketId: '2',
    type: 'created',
    description: 'สร้างคำขอซ่อม: แอร์เสีย',
    userId: '1',
    userName: 'สมชาย ใจดี',
    userRole: 'user',
    timestamp: new Date('2025-10-18T10:00:00'),
    metadata: { title: 'แอร์เสีย', category: 'เครื่องปรับอากาศ', priority: 'medium' },
  },
  {
    id: 'evt-2-2',
    ticketId: '2',
    type: 'assigned',
    description: 'มอบหมายงานให้ช่าง สมศักดิ์ ช่างซ่อม',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'supervisor',
    timestamp: new Date('2025-10-18T14:00:00'),
    metadata: { technicianId: '2', technicianName: 'สมศักดิ์ ช่างซ่อม' },
  },
  {
    id: 'evt-2-3',
    ticketId: '2',
    type: 'status_changed',
    description: 'เปลี่ยนสถานะเป็น "กำลังซ่อม"',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'technician',
    timestamp: new Date('2025-10-18T14:00:00'),
    metadata: { oldStatus: 'pending', newStatus: 'in_progress' },
  },
  {
    id: 'evt-2-4',
    ticketId: '2',
    type: 'note_added',
    description: 'ได้ตรวจสอบแอร์แล้ว พบว่าคอมเพรสเซอร์มีปัญหา กำลังหาชิ้นส่วนมาเปลี่ยน',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'technician',
    timestamp: new Date('2025-10-19T14:00:00'),
    metadata: { note: 'ได้ตรวจสอบแอร์แล้ว พบว่าคอมเพรสเซอร์มีปัญหา กำลังหาชิ้นส่วนมาเปลี่ยน' },
  },
  // Events for ticket #3 (completed)
  {
    id: 'evt-3-1',
    ticketId: '3',
    type: 'created',
    description: 'สร้างคำขอซ่อม: หลอดไฟเสีย',
    userId: '4',
    userName: 'สมหมาย นักเรียน',
    userRole: 'user',
    timestamp: new Date('2025-10-15T09:00:00'),
    metadata: { title: 'หลอดไฟเสีย', category: 'ไฟฟ้า', priority: 'low' },
  },
  {
    id: 'evt-3-2',
    ticketId: '3',
    type: 'assigned',
    description: 'มอบหมายงานให้ช่าง สมศักดิ์ ช่างซ่อม',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'supervisor',
    timestamp: new Date('2025-10-15T10:00:00'),
    metadata: { technicianId: '2', technicianName: 'สมศักดิ์ ช่างซ่อม' },
  },
  {
    id: 'evt-3-3',
    ticketId: '3',
    type: 'status_changed',
    description: 'เปลี่ยนสถานะเป็น "กำลังซ่อม"',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'technician',
    timestamp: new Date('2025-10-15T10:00:00'),
    metadata: { oldStatus: 'pending', newStatus: 'in_progress' },
  },
  {
    id: 'evt-3-4',
    ticketId: '3',
    type: 'completed',
    description: 'งานซ่อมเสร็จสิ้น',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'technician',
    timestamp: new Date('2025-10-16T11:00:00'),
    metadata: { completedAt: new Date('2025-10-16T11:00:00') },
  },
  {
    id: 'evt-3-5',
    ticketId: '3',
    type: 'rated',
    description: 'ผู้ใช้ให้คะแนน 5/5 ดาว: "ซ่อมเร็วมาก ขอบคุณครับ"',
    userId: '4',
    userName: 'สมหมาย นักเรียน',
    userRole: 'user',
    timestamp: new Date('2025-10-16T12:00:00'),
    metadata: { rating: 5, feedback: 'ซ่อมเร็วมาก ขอบคุณครับ' },
  },
  // Events for ticket #4 (pending)
  {
    id: 'evt-4-1',
    ticketId: '4',
    type: 'created',
    description: 'สร้างคำขอซ่อม: ประตูหลุด',
    userId: '5',
    userName: 'สมใจ ดีงาม',
    userRole: 'user',
    timestamp: new Date('2025-10-19T15:30:00'),
    metadata: { title: 'ประตูหลุด', category: 'ประตู/หน้าต่าง', priority: 'medium' },
  },
  // Events for ticket #5 (in_progress)
  {
    id: 'evt-5-1',
    ticketId: '5',
    type: 'created',
    description: 'สร้างคำขอซ่อม: ห้องน้ำอุดตัน',
    userId: '6',
    userName: 'สมศรี สวยงาม',
    userRole: 'user',
    timestamp: new Date('2025-10-20T07:00:00'),
    metadata: { title: 'ห้องน้ำอุดตัน', category: 'ประปา', priority: 'high' },
  },
  {
    id: 'evt-5-2',
    ticketId: '5',
    type: 'assigned',
    description: 'มอบหมายงานให้ช่าง สมศักดิ์ ช่างซ่อม',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'supervisor',
    timestamp: new Date('2025-10-20T08:00:00'),
    metadata: { technicianId: '2', technicianName: 'สมศักดิ์ ช่างซ่อม' },
  },
  {
    id: 'evt-5-3',
    ticketId: '5',
    type: 'status_changed',
    description: 'เปลี่ยนสถานะเป็น "กำลังซ่อม"',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'technician',
    timestamp: new Date('2025-10-20T08:00:00'),
    metadata: { oldStatus: 'pending', newStatus: 'in_progress' },
  },
  {
    id: 'evt-5-4',
    ticketId: '5',
    type: 'note_added',
    description: 'กำลังทำการสูบน้ำและทำความสะอาดท่อ',
    userId: '2',
    userName: 'สมศักดิ์ ช่างซ่อม',
    userRole: 'technician',
    timestamp: new Date('2025-10-20T09:00:00'),
    metadata: { note: 'กำลังทำการสูบน้ำและทำความสะอาดท่อ' },
  },
];

// Mock data
const initialRequests: MaintenanceRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'สมชาย ใจดี',
    maintenanceType: '2',
    maintenanceTypeName: 'ประปา',
    title: 'ท่อน้ำรั่ว',
    description: 'ท่อน้ำในห้องน้ำรั่วมาก น้ำไหลออกมาตลอดเวลา',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2025-10-20T08:00:00'),
    updatedAt: new Date('2025-10-20T08:00:00'),
  },
  {
    id: '2',
    userId: '1',
    userName: 'สมชาย ใจดี',
    maintenanceType: '3',
    maintenanceTypeName: 'เครื่องปรับอากาศ',
    title: 'แอร์เสีย',
    description: 'แอร์ไม่เย็น มีเสียงดังผิดปกติ',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date('2025-10-18T10:00:00'),
    updatedAt: new Date('2025-10-19T14:00:00'),
    assignedTo: '2',
    assignedToName: 'สมศักดิ์ ช่างซ่อม',
  },
  {
    id: '3',
    userId: '4',
    userName: 'สมหมาย นักเรียน',
    maintenanceType: '1',
    maintenanceTypeName: 'ไฟฟ้า',
    title: 'หลอดไฟเสีย',
    description: 'หลอดไฟในห้องนอนเสีย',
    status: 'completed',
    priority: 'low',
    createdAt: new Date('2025-10-15T09:00:00'),
    updatedAt: new Date('2025-10-16T11:00:00'),
    completedAt: new Date('2025-10-16T11:00:00'),
    assignedTo: '2',
    assignedToName: 'สมศักดิ์ ช่างซ่อม',
    rating: 5,
    feedback: 'ซ่อมเร็วมาก ขอบคุณครับ',
  },
  {
    id: '4',
    userId: '5',
    userName: 'สมใจ ดีงาม',
    maintenanceType: '5',
    maintenanceTypeName: 'ประตู/หน้าต่าง',
    title: 'ประตูหลุด',
    description: 'บานพับประตูหลุด เปิดปิดไม่ได้',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2025-10-19T15:30:00'),
    updatedAt: new Date('2025-10-19T15:30:00'),
  },
  {
    id: '5',
    userId: '6',
    userName: 'สมศรี สวยงาม',
    maintenanceType: '2',
    maintenanceTypeName: 'ประปา',
    title: 'ห้องน้ำอุดตัน',
    description: 'ห้องน้ำอุดตัน น้ำระบายไม่ได้',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date('2025-10-20T07:00:00'),
    updatedAt: new Date('2025-10-20T09:00:00'),
    assignedTo: '2',
    assignedToName: 'สมศักดิ์ ช่างซ่อม',
  },
];

export const MaintenanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [events, setEvents] = useState<TicketEvent[]>(initialEvents);
  const [slaSettings, setSLASettings] = useState<SLASettings>({
    high: 24,
    medium: 72,
    low: 168,
  });

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

  const addRequest = (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRequests(prev => [newRequest, ...prev]);
    
    // Add creation event
    addEvent({
      ticketId: newRequest.id,
      type: 'created',
      description: `สร้างคำขอซ่อม: ${newRequest.title}`,
      userId: request.userId,
      userName: request.userName,
      userRole: 'user',
      metadata: {
        title: newRequest.title,
        category: newRequest.maintenanceTypeName,
        priority: newRequest.priority,
      },
    });
  };

  const updateRequestStatus = (
    id: string,
    status: RequestStatus,
    assignedTo?: string,
    assignedToName?: string
  ) => {
    const request = requests.find(req => req.id === id);
    const oldStatus = request?.status;
    
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status,
              updatedAt: new Date(),
              ...(assignedTo && { assignedTo, assignedToName }),
              ...(status === 'completed' && { completedAt: new Date() }),
            }
          : req
      )
    );

    // Add status change event
    if (request && oldStatus !== status) {
      const statusText = {
        pending: 'รอดำเนินการ',
        in_progress: 'กำลังซ่อม',
        completed: 'เสร็จสิ้น',
      };
      
      addEvent({
        ticketId: id,
        type: 'status_changed',
        description: `เปลี่ยนสถานะจาก "${statusText[oldStatus!]}" เป็น "${statusText[status]}"`,
        userId: assignedTo || 'system',
        userName: assignedToName || 'ระบบ',
        userRole: 'technician',
        metadata: {
          oldStatus,
          newStatus: status,
        },
      });
    }
  };

  const assignRequest = (id: string, technicianId: string, technicianName: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              assignedTo: technicianId,
              assignedToName: technicianName,
              status: 'in_progress' as RequestStatus,
              updatedAt: new Date(),
            }
          : req
      )
    );

    // Add assignment event
    addEvent({
      ticketId: id,
      type: 'assigned',
      description: `มอบหมายงานให้ช่าง ${technicianName}`,
      userId: technicianId,
      userName: technicianName,
      userRole: 'supervisor',
      metadata: {
        technicianId,
        technicianName,
      },
    });

    // Add status change to in_progress
    addEvent({
      ticketId: id,
      type: 'status_changed',
      description: `เปลี่ยนสถานะเป็น "กำลังซ่อม"`,
      userId: technicianId,
      userName: technicianName,
      userRole: 'technician',
      metadata: {
        oldStatus: 'pending',
        newStatus: 'in_progress',
      },
    });
  };

  const completeRequest = (id: string, rating?: number, feedback?: string) => {
    const request = requests.find(req => req.id === id);
    
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'completed' as RequestStatus,
              completedAt: new Date(),
              updatedAt: new Date(),
              ...(rating && { rating }),
              ...(feedback && { feedback }),
            }
          : req
      )
    );

    // Add completion event
    if (request) {
      addEvent({
        ticketId: id,
        type: 'completed',
        description: `งานซ่อมเสร็จสิ้น`,
        userId: request.assignedTo || request.userId,
        userName: request.assignedToName || request.userName,
        userRole: 'technician',
        metadata: {
          completedAt: new Date(),
        },
      });

      // Add rating event if provided
      if (rating) {
        addEvent({
          ticketId: id,
          type: 'rated',
          description: `ผู้ใช้ให้คะแนน ${rating}/5 ดาว${feedback ? `: "${feedback}"` : ''}`,
          userId: request.userId,
          userName: request.userName,
          userRole: 'user',
          metadata: {
            rating,
            feedback,
          },
        });
      }
    }
  };

  const updateSLASettings = (settings: SLASettings) => {
    setSLASettings(settings);
  };

  const getRequestById = (id: string) => {
    return requests.find(req => req.id === id);
  };

  return (
    <MaintenanceContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        assignRequest,
        completeRequest,
        slaSettings,
        updateSLASettings,
        getRequestById,
        events,
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
