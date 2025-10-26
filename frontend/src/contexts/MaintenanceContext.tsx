import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RequestStatus = 'pending' | 'in_progress' | 'completed';
export type RequestPriority = 'low' | 'medium' | 'high';

export interface MaintenanceRequest {
  id: string;
  userId: string;
  userName: string;
  dormBuilding: string;
  roomNumber: string;
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
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

// Mock data
const initialRequests: MaintenanceRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'สมชาย ใจดี',
    dormBuilding: 'หอพักชาย A',
    roomNumber: '301',
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
    dormBuilding: 'หอพักชาย A',
    roomNumber: '301',
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
    dormBuilding: 'หอพักหญิง B',
    roomNumber: '205',
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
    dormBuilding: 'หอพักชาย C',
    roomNumber: '402',
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
    dormBuilding: 'หอพักหญิง A',
    roomNumber: '102',
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
  const [slaSettings, setSLASettings] = useState<SLASettings>({
    high: 24,
    medium: 72,
    low: 168,
  });

  const addRequest = (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (
    id: string,
    status: RequestStatus,
    assignedTo?: string,
    assignedToName?: string
  ) => {
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
  };

  const completeRequest = (id: string, rating?: number, feedback?: string) => {
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
