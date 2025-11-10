import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useBuildings } from '../../contexts/BuildingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Crown,
  Users,
  MapPin,
  Wrench,
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  UserCircle,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  TrendingUp,
  ClipboardList,
  CheckCircle,
  Clock,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '../common/StatCard';
import { toast } from 'sonner';
import type { UserRole } from '../../contexts/AuthContext';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// Removed - now using Building type from BuildingContext

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  status: 'active' | 'inactive';
  totalCompleted: number;
  rating: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'maintenance' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive';
  createdAt: Date;
}



export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { requests } = useMaintenance();
  const { 
    buildings, 
    maintenanceTypes,
    addBuilding, 
    updateBuilding, 
    deleteBuilding,
    addMaintenanceType,
    updateMaintenanceType,
    deleteMaintenanceType
  } = useBuildings();
  
  // Users Management
  const [users, setUsers] = useState<ManagedUser[]>([
    {
      id: '1',
      name: 'สมชาย ใจดี',
      email: 'somchai@dorm.com',
      password: 'password123',
      role: 'user',
      phone: '081-234-5678',
      status: 'active',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'สมหญิง ศรีสุข',
      email: 'somying@dorm.com',
      password: 'password123',
      role: 'user',
      phone: '081-345-6789',
      status: 'active',
      createdAt: new Date('2024-01-20'),
    },
  ]);

  // Buildings Management - now using BuildingContext

  // Technicians Management
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: '1',
      name: 'ช่างสมศักดิ์',
      email: 'tech1@dorm.com',
      phone: '081-111-2222',
      specialization: ['ไฟฟ้า', 'ประปา'],
      status: 'active',
      totalCompleted: 45,
      rating: 4.5,
    },
    {
      id: '2',
      name: 'ช่างวิชัย',
      email: 'tech2@dorm.com',
      phone: '081-222-3333',
      specialization: ['แอร์', 'เฟอร์นิเจอร์'],
      status: 'active',
      totalCompleted: 38,
      rating: 4.8,
    },
  ]);

  // Announcements Management
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'maintenance' | 'urgent',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });



  const [searchUsers, setSearchUsers] = useState('');
  const [searchBuildings, setSearchBuildings] = useState('');
  const [searchTechnicians, setSearchTechnicians] = useState('');
  const [searchMaintenanceTypes, setSearchMaintenanceTypes] = useState('');
  
  const [filterUserRole, setFilterUserRole] = useState<UserRole | 'all'>('all');
  const [filterBuildingStatus, setFilterBuildingStatus] = useState<'all' | 'active' | 'maintenance'>('all');
  const [filterTechnicianStatus, setFilterTechnicianStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterMaintenanceTypeStatus, setFilterMaintenanceTypeStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isBuildingDialogOpen, setIsBuildingDialogOpen] = useState(false);
  const [isTechnicianDialogOpen, setIsTechnicianDialogOpen] = useState(false);
  const [isMaintenanceTypeDialogOpen, setIsMaintenanceTypeDialogOpen] = useState(false);
  
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [editingMaintenanceType, setEditingMaintenanceType] = useState<any>(null);
  
  // Password visibility state
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as UserRole,
    phone: '',
  });

  const [buildingForm, setBuildingForm] = useState({
    name: '',
    code: '',
  });

  const [technicianForm, setTechnicianForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
  });



  const [maintenanceTypeForm, setMaintenanceTypeForm] = useState({
    name: '',
    description: '',
    icon: 'Wrench',
    color: 'blue',
  });

  // Statistics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const inProgressRequests = requests.filter(r => r.status === 'in_progress').length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;

  // Filter functions
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchUsers.toLowerCase());
    const matchesRole = filterUserRole === 'all' || u.role === filterUserRole;
    return matchesSearch && matchesRole;
  });

  const filteredBuildings = buildings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchBuildings.toLowerCase()) ||
                         b.code.toLowerCase().includes(searchBuildings.toLowerCase());
    const matchesStatus = filterBuildingStatus === 'all' || b.status === filterBuildingStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredTechnicians = technicians.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTechnicians.toLowerCase()) ||
                         t.email.toLowerCase().includes(searchTechnicians.toLowerCase());
    const matchesStatus = filterTechnicianStatus === 'all' || t.status === filterTechnicianStatus;
    return matchesSearch && matchesStatus;
  });



  const filteredMaintenanceTypes = maintenanceTypes.filter(mt => {
    const matchesSearch = mt.name.toLowerCase().includes(searchMaintenanceTypes.toLowerCase()) ||
                         mt.description.toLowerCase().includes(searchMaintenanceTypes.toLowerCase());
    const matchesStatus = filterMaintenanceTypeStatus === 'all' || mt.status === filterMaintenanceTypeStatus;
    return matchesSearch && matchesStatus;
  });

  // CRUD operations for Users
  const handleAddUser = () => {
    // Validate password
    if (!userForm.password) {
      toast.error('กรุณากรอกรหัสผ่าน');
      return;
    }
    if (userForm.password.length < 6) {
      toast.error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (userForm.password !== userForm.confirmPassword) {
      toast.error('รหัสผ่านไม่ตรงกัน');
      return;
    }

    const { confirmPassword, ...userDataWithoutConfirm } = userForm;
    const newUser: ManagedUser = {
      id: Date.now().toString(),
      ...userDataWithoutConfirm,
      status: 'active',
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
    setIsUserDialogOpen(false);
    resetUserForm();
    toast.success('เพิ่มผู้ใช้สำเร็จ');
  };

  const handleEditUser = (user: ManagedUser) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '', // Don't show existing password
      confirmPassword: '',
      role: user.role,
      phone: user.phone || '',
    });
    setIsUserDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      // Validate password if provided
      if (userForm.password) {
        if (userForm.password.length < 6) {
          toast.error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
          return;
        }
        if (userForm.password !== userForm.confirmPassword) {
          toast.error('รหัสผ่านไม่ตรงกัน');
          return;
        }
      }

      const { confirmPassword, ...userDataWithoutConfirm } = userForm;
      const updatedData = userForm.password 
        ? userDataWithoutConfirm 
        : { ...userDataWithoutConfirm, password: editingUser.password }; // Keep old password if not changed

      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...updatedData } : u));
      setIsUserDialogOpen(false);
      setEditingUser(null);
      resetUserForm();
      toast.success('อัปเดตผู้ใช้สำเร็จ');
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('ลบผู้ใช้สำเร็จ');
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      phone: '',
    });
  };

  // CRUD operations for Buildings - now using BuildingContext
  const handleAddBuilding = () => {
    addBuilding({
      ...buildingForm,
      status: 'active',
    });
    setIsBuildingDialogOpen(false);
    resetBuildingForm();
    toast.success('เพิ่มอาคารสำเร็จ');
  };

  const handleEditBuilding = (building: any) => {
    setEditingBuilding(building);
    setBuildingForm({
      name: building.name,
      code: building.code,
    });
    setIsBuildingDialogOpen(true);
  };

  const handleUpdateBuilding = () => {
    if (editingBuilding) {
      updateBuilding(editingBuilding.id, buildingForm);
      setIsBuildingDialogOpen(false);
      setEditingBuilding(null);
      resetBuildingForm();
      toast.success('อัปเดตอาคารสำเร็จ');
    }
  };

  const handleDeleteBuilding = (id: string) => {
    deleteBuilding(id);
    toast.success('ลบอาคารสำเร็จ');
  };

  const resetBuildingForm = () => {
    setBuildingForm({
      name: '',
      code: '',
    });
  };

  // CRUD operations for Technicians
  const handleAddTechnician = () => {
    const newTechnician: Technician = {
      id: Date.now().toString(),
      name: technicianForm.name,
      email: technicianForm.email,
      phone: technicianForm.phone,
      specialization: technicianForm.specialization.split(',').map(s => s.trim()),
      status: 'active',
      totalCompleted: 0,
      rating: 0,
    };
    setTechnicians([...technicians, newTechnician]);
    setIsTechnicianDialogOpen(false);
    resetTechnicianForm();
    toast.success('เพิ่มช่างสำเร็จ');
  };

  const handleEditTechnician = (technician: Technician) => {
    setEditingTechnician(technician);
    setTechnicianForm({
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      specialization: technician.specialization.join(', '),
    });
    setIsTechnicianDialogOpen(true);
  };

  const handleUpdateTechnician = () => {
    if (editingTechnician) {
      setTechnicians(technicians.map(t => t.id === editingTechnician.id ? {
        ...t,
        name: technicianForm.name,
        email: technicianForm.email,
        phone: technicianForm.phone,
        specialization: technicianForm.specialization.split(',').map(s => s.trim()),
      } : t));
      setIsTechnicianDialogOpen(false);
      setEditingTechnician(null);
      resetTechnicianForm();
      toast.success('อัปเดตช่างสำเร็จ');
    }
  };

  const handleDeleteTechnician = (id: string) => {
    setTechnicians(technicians.filter(t => t.id !== id));
    toast.success('ลบช่างสำเร็จ');
  };

  const resetTechnicianForm = () => {
    setTechnicianForm({
      name: '',
      email: '',
      phone: '',
      specialization: '',
    });
  };

  // CRUD operations for Announcements
  const handleAddAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      ...announcementForm,
      status: 'active',
      createdAt: new Date(),
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setIsAnnouncementDialogOpen(false);
    resetAnnouncementForm();
    toast.success('เพิ่มประกาศสำเร็จ');
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
    });
    setIsAnnouncementDialogOpen(true);
  };

  const handleUpdateAnnouncement = () => {
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...announcementForm } : a));
      setIsAnnouncementDialogOpen(false);
      setEditingAnnouncement(null);
      resetAnnouncementForm();
      toast.success('อัปเดตประกาศสำเร็จ');
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success('ลบ���ระกาศสำเร็จ');
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
    });
  };

  // CRUD operations for Maintenance Types
  const handleAddMaintenanceType = () => {
    addMaintenanceType({
      ...maintenanceTypeForm,
      status: 'active',
    });
    setIsMaintenanceTypeDialogOpen(false);
    resetMaintenanceTypeForm();
    toast.success('เพิ่มประเภทการซ่อมสำเร็จ');
  };

  const handleEditMaintenanceType = (type: any) => {
    setEditingMaintenanceType(type);
    setMaintenanceTypeForm({
      name: type.name,
      description: type.description,
      icon: type.icon,
      color: type.color,
    });
    setIsMaintenanceTypeDialogOpen(true);
  };

  const handleUpdateMaintenanceType = () => {
    if (editingMaintenanceType) {
      updateMaintenanceType(editingMaintenanceType.id, maintenanceTypeForm);
      setIsMaintenanceTypeDialogOpen(false);
      setEditingMaintenanceType(null);
      resetMaintenanceTypeForm();
      toast.success('อัปเดตประเภทการซ่อมสำเร็จ');
    }
  };

  const handleDeleteMaintenanceType = (id: string) => {
    deleteMaintenanceType(id);
    toast.success('ลบประเภทการซ่อมสำเร็จ');
  };

  const resetMaintenanceTypeForm = () => {
    setMaintenanceTypeForm({
      name: '',
      description: '',
      icon: 'Wrench',
      color: 'blue',
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'supervisor':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'technician':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      admin: 'ผู้ดูแลระบบ',
      supervisor: 'หัวหน้างาน',
      technician: 'ช่างเทคนิค',
      user: 'ผู้ใช้ทั่วไป',
    };
    return labels[role];
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
      gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
      brown: { bg: 'bg-amber-100', text: 'text-amber-600' },
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">จัดการระบบ</h1>
              <p className="text-gray-600">ยินดีต้อนรับ, {user?.name}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="รายการทั้งหมด"
          value={totalRequests}
          description="คำขอซ่อมทั้งหมด"
          icon={ClipboardList}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          gradientFrom="from-blue-400"
          gradientTo="to-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="รอดำเนินการ"
          value={pendingRequests}
          description="รอการตอบรับ"
          icon={Clock}
          iconColor="text-yellow-600"
          iconBg="bg-yellow-100"
          gradientFrom="from-yellow-400"
          gradientTo="to-yellow-600"
        />
        <StatCard
          title="กำลังดำเนินการ"
          value={inProgressRequests}
          description="กำลังดำเนินการ"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
          gradientFrom="from-purple-400"
          gradientTo="to-purple-600"
        />
        <StatCard
          title="เสร็จสิ้น"
          value={completedRequests}
          description="ดำเนินการสำเร็จ"
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          gradientFrom="from-green-400"
          gradientTo="to-green-600"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Management Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-red-50">
              <TabsTrigger value="users" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                ผู้ใช้
              </TabsTrigger>
              <TabsTrigger value="buildings" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Building2 className="h-4 w-4 mr-2" />
                อาคาร
              </TabsTrigger>
              <TabsTrigger value="technicians" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Wrench className="h-4 w-4 mr-2" />
                ช่างเทคนิค
              </TabsTrigger>
              <TabsTrigger value="maintenanceTypes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <ClipboardList className="h-4 w-4 mr-2" />
                ประเภทการซ่อม
              </TabsTrigger>
            </TabsList>

            {/* Users Management */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">ประกอบการการจัดการผู้ใช้งาน</h3>
                <Button
                  onClick={() => {
                    setEditingUser(null);
                    resetUserForm();
                    setIsUserDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มผู้ใช้ใหม่
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหา..."
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterUserRole} onValueChange={(value) => setFilterUserRole(value as UserRole | 'all')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ทุกบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกบทบาท</SelectItem>
                    <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                    <SelectItem value="technician">ช่างเทคนิค</SelectItem>
                    <SelectItem value="supervisor">หัวหน้างาน</SelectItem>
                    <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <UserCircle className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900">{user.name}</span>
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {getRoleLabel(user.role)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </span>
                              {user.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Key className="h-3 w-3" />
                                {showPasswords[user.id] ? user.password : '••••••••'}
                                <button
                                  onClick={() => setShowPasswords({ ...showPasswords, [user.id]: !showPasswords[user.id] })}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {showPasswords[user.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Buildings Management */}
            <TabsContent value="buildings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">จัดการอาคารหอพัก</h3>
                <Button
                  onClick={() => {
                    setEditingBuilding(null);
                    resetBuildingForm();
                    setIsBuildingDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มอาคารใหม่
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหา..."
                    value={searchBuildings}
                    onChange={(e) => setSearchBuildings(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterBuildingStatus} onValueChange={(value) => setFilterBuildingStatus(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="active">ใช้งาน</SelectItem>
                    <SelectItem value="maintenance">ซ่อมบำรุง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredBuildings.map((building) => (
                  <motion.div
                    key={building.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{building.name}</span>
                            <Badge variant="outline" className="text-gray-600">
                              {building.code}
                            </Badge>
                            <Badge className={building.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                              {building.status === 'active' ? 'ใช้งาน' : 'ซ่อมบำรุง'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBuilding(building)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBuilding(building.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Technicians Management */}
            <TabsContent value="technicians" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">จัดการช่างเทคนิค</h3>
                <Button
                  onClick={() => {
                    setEditingTechnician(null);
                    resetTechnicianForm();
                    setIsTechnicianDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มช่างใหม่
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหา..."
                    value={searchTechnicians}
                    onChange={(e) => setSearchTechnicians(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterTechnicianStatus} onValueChange={(value) => setFilterTechnicianStatus(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="active">ทำงาน</SelectItem>
                    <SelectItem value="inactive">ไม่ทำงาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredTechnicians.map((tech) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Wrench className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900">{tech.name}</span>
                              <Badge className={tech.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                {tech.status === 'active' ? 'ทำงาน' : 'ไม่ทำงาน'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {tech.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {tech.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 ml-14">
                          <div className="flex gap-1">
                            {tech.specialization.map((spec, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                          <span>งานสำเร็จ: {tech.totalCompleted}</span>
                          <span className="flex items-center gap-1">
                            ⭐ {tech.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTechnician(tech)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTechnician(tech.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Maintenance Types Management */}
            <TabsContent value="maintenanceTypes" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">จัดการประเภทการซ่อม</h3>
                <Button
                  onClick={() => {
                    setEditingMaintenanceType(null);
                    resetMaintenanceTypeForm();
                    setIsMaintenanceTypeDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มประเภทใหม่
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหา..."
                    value={searchMaintenanceTypes}
                    onChange={(e) => setSearchMaintenanceTypes(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterMaintenanceTypeStatus} onValueChange={(value) => setFilterMaintenanceTypeStatus(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="active">ใช้งาน</SelectItem>
                    <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredMaintenanceTypes.map((type) => {
                  const colorClasses = getColorClasses(type.color);
                  return (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                            <Wrench className={`h-5 w-5 ${colorClasses.text}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900">{type.name}</span>
                              <Badge className={type.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                {type.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMaintenanceType(type)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMaintenanceType(type.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>


          </Tabs>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลผู้ใช้ด้านล่าง
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อ-นามสกุล</Label>
              <Input
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
            <div className="space-y-2">
              <Label>อีเมล</Label>
              <Input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  รหัสผ่าน
                  {editingUser && <span className="text-xs text-gray-500 ml-1">(เว้นว่างถ้าไม่เปลี่ยน)</span>}
                  {!editingUser && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder={editingUser ? "••••••••" : "อย่างน้อย 6 ตัวอักษร"}
                  required={!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  ยืนยันรหัสผ่าน
                  {editingUser && <span className="text-xs text-gray-500 ml-1">(เว้นว่างถ้าไม่เปลี่ยน)</span>}
                  {!editingUser && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  type="password"
                  value={userForm.confirmPassword}
                  onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                  placeholder={editingUser ? "••••••••" : "ยืนยันรหัสผ่าน"}
                  required={!editingUser}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>บทบาท</Label>
              <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value as UserRole })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                  <SelectItem value="technician">ช่างเทคนิค</SelectItem>
                  <SelectItem value="supervisor">หัวหน้างาน</SelectItem>
                  <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>เบอร์โทรศัพท์</Label>
              <Input
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                placeholder="081-234-5678"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button 
              onClick={editingUser ? handleUpdateUser : handleAddUser}
              className="bg-red-600 hover:bg-red-700"
            >
              {editingUser ? 'บันทึก' : 'เพิ่ม'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Building Dialog */}
      <Dialog open={isBuildingDialogOpen} onOpenChange={setIsBuildingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBuilding ? 'แก้ไขอาคาร' : 'เพิ่มอาคารใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลอาคารด้านล่าง
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่ออาคาร</Label>
              <Input
                value={buildingForm.name}
                onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                placeholder="เช่น หอพักชาย A"
              />
            </div>
            <div className="space-y-2">
              <Label>รหัสอาคาร</Label>
              <Input
                value={buildingForm.code}
                onChange={(e) => setBuildingForm({ ...buildingForm, code: e.target.value })}
                placeholder="เช่น DORM-A"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuildingDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button 
              onClick={editingBuilding ? handleUpdateBuilding : handleAddBuilding}
              className="bg-red-600 hover:bg-red-700"
            >
              {editingBuilding ? 'บันทึก' : 'เพิ่ม'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Technician Dialog */}
      <Dialog open={isTechnicianDialogOpen} onOpenChange={setIsTechnicianDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTechnician ? 'แก้ไขช่าง' : 'เพิ่มช่างใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลช่างเทคนิคด้านล่าง
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อ-นามสกุล</Label>
              <Input
                value={technicianForm.name}
                onChange={(e) => setTechnicianForm({ ...technicianForm, name: e.target.value })}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
            <div className="space-y-2">
              <Label>อีเมล</Label>
              <Input
                type="email"
                value={technicianForm.email}
                onChange={(e) => setTechnicianForm({ ...technicianForm, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>เบอร์โทรศัพท์</Label>
              <Input
                value={technicianForm.phone}
                onChange={(e) => setTechnicianForm({ ...technicianForm, phone: e.target.value })}
                placeholder="081-234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label>ความเชี่ยวชาญ (คั่นด้วยจุลภาค)</Label>
              <Input
                value={technicianForm.specialization}
                onChange={(e) => setTechnicianForm({ ...technicianForm, specialization: e.target.value })}
                placeholder="เช่น ไฟฟ้า, ประปา"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTechnicianDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button 
              onClick={editingTechnician ? handleUpdateTechnician : handleAddTechnician}
              className="bg-red-600 hover:bg-red-700"
            >
              {editingTechnician ? 'บันทึก' : 'เพิ่ม'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance Type Dialog */}
      <Dialog open={isMaintenanceTypeDialogOpen} onOpenChange={setIsMaintenanceTypeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMaintenanceType ? 'แก้ไขประเภทการซ่อม' : 'เพิ่มประเภทการซ่อมใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลประเภทการซ่อมด้านล่าง
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อประเภท</Label>
              <Input
                value={maintenanceTypeForm.name}
                onChange={(e) => setMaintenanceTypeForm({ ...maintenanceTypeForm, name: e.target.value })}
                placeholder="เช่น ไฟฟ้า"
              />
            </div>
            <div className="space-y-2">
              <Label>คำอธิบาย</Label>
              <Textarea
                value={maintenanceTypeForm.description}
                onChange={(e) => setMaintenanceTypeForm({ ...maintenanceTypeForm, description: e.target.value })}
                placeholder="อธิบายรายละเอียดประเภทการซ่อม"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>สี</Label>
              <Select 
                value={maintenanceTypeForm.color} 
                onValueChange={(value) => setMaintenanceTypeForm({ ...maintenanceTypeForm, color: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">น้ำเงิน</SelectItem>
                  <SelectItem value="green">เขียว</SelectItem>
                  <SelectItem value="yellow">เหลือง</SelectItem>
                  <SelectItem value="red">แดง</SelectItem>
                  <SelectItem value="purple">ม่วง</SelectItem>
                  <SelectItem value="orange">ส้ม</SelectItem>
                  <SelectItem value="cyan">ฟ้า</SelectItem>
                  <SelectItem value="gray">เทา</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaintenanceTypeDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button 
              onClick={editingMaintenanceType ? handleUpdateMaintenanceType : handleAddMaintenanceType}
              className="bg-red-600 hover:bg-red-700"
            >
              {editingMaintenanceType ? 'บันทึก' : 'เพิ่ม'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
