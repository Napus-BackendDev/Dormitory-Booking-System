import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Building {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'maintenance';
}

export interface MaintenanceType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface BuildingContextType {
  buildings: Building[];
  maintenanceTypes: MaintenanceType[];
  addBuilding: (building: Omit<Building, 'id'>) => void;
  updateBuilding: (id: string, building: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  addMaintenanceType: (type: Omit<MaintenanceType, 'id' | 'createdAt'>) => void;
  updateMaintenanceType: (id: string, type: Partial<MaintenanceType>) => void;
  deleteMaintenanceType: (id: string) => void;
}

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

// Mock data
const initialBuildings: Building[] = [
  { id: '1', name: 'หอพักชาย A', code: 'DORM-A', status: 'active' },
  { id: '2', name: 'หอพักหญิง B', code: 'DORM-B', status: 'active' },
  { id: '3', name: 'หอพักนานาชาติ C', code: 'DORM-C', status: 'active' },
];

const initialMaintenanceTypes: MaintenanceType[] = [
  {
    id: '1',
    name: 'ไฟฟ้า',
    description: 'ปัญหาเกี่ยวกับระบบไฟฟ้า หลอดไฟ ปลั๊กไฟ สวิตช์',
    icon: 'Zap',
    color: 'yellow',
    status: 'active',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    name: 'ประปา',
    description: 'ปัญหาเกี่ยวกับระบบประปา ท่อน้ำรั่ว ห้องน้ำอุดตัน',
    icon: 'Droplets',
    color: 'blue',
    status: 'active',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '3',
    name: 'เครื่องปรับอากาศ',
    description: 'ปัญหาเกี่ยวกับแอร์ ไม่เย็น เสียงดัง',
    icon: 'Wind',
    color: 'cyan',
    status: 'active',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '4',
    name: 'เฟอร์นิเจอร์',
    description: 'ปัญหาเกี่ยวกับเฟอร์นิเจอร์ โต๊ะ เก้าอี้ ตู้',
    icon: 'Armchair',
    color: 'brown',
    status: 'active',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '5',
    name: 'ประตู/หน้าต่าง',
    description: 'ปัญหาเกี่ยวกับประตู หน้าต่าง บานพับ กุญแจ',
    icon: 'DoorOpen',
    color: 'gray',
    status: 'active',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '6',
    name: 'อื่นๆ',
    description: 'ปัญหาอื่นๆ ที่ไม่อยู่ในหมวดหมู่ข้างต้น',
    icon: 'MoreHorizontal',
    color: 'purple',
    status: 'active',
    createdAt: new Date('2025-01-01'),
  },
];

export const BuildingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>(initialMaintenanceTypes);

  const addBuilding = (building: Omit<Building, 'id'>) => {
    const newBuilding: Building = {
      ...building,
      id: Date.now().toString(),
    };
    setBuildings(prev => [...prev, newBuilding]);
  };

  const updateBuilding = (id: string, building: Partial<Building>) => {
    setBuildings(prev =>
      prev.map(b => (b.id === id ? { ...b, ...building } : b))
    );
  };

  const deleteBuilding = (id: string) => {
    setBuildings(prev => prev.filter(b => b.id !== id));
  };

  const addMaintenanceType = (type: Omit<MaintenanceType, 'id' | 'createdAt'>) => {
    const newType: MaintenanceType = {
      ...type,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setMaintenanceTypes(prev => [...prev, newType]);
  };

  const updateMaintenanceType = (id: string, type: Partial<MaintenanceType>) => {
    setMaintenanceTypes(prev =>
      prev.map(t => (t.id === id ? { ...t, ...type } : t))
    );
  };

  const deleteMaintenanceType = (id: string) => {
    setMaintenanceTypes(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BuildingContext.Provider
      value={{
        buildings,
        maintenanceTypes,
        addBuilding,
        updateBuilding,
        deleteBuilding,
        addMaintenanceType,
        updateMaintenanceType,
        deleteMaintenanceType,
      }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildings = () => {
  const context = useContext(BuildingContext);
  if (context === undefined) {
    throw new Error('useBuildings must be used within a BuildingProvider');
  }
  return context;
};
