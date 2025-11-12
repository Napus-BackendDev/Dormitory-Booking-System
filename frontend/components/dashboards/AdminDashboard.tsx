import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import useUser from '@/hooks/useUser';
import useLocation from '@/hooks/useLocation';
import useRepairType from '@/hooks/useRepairType';
import { Card, CardContent } from '../ui/card';
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
import { Role } from '@/types/Role';
import { User } from '@/types/User';

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
  const { tickets } = useMaintenance();

  // Users Management (data from hook)
  const { users, setUsers: setHookUsers, fetchAll: fetchUsers } = useUser();
  const { locations, fetchAll: fetchLocations, create: createLocation, update: updateLocation, remove: removeLocation, setLocations } = useLocation();
  const { repairTypes, fetchAll: fetchRepairTypes, create: createRepairType, update: updateRepairType, remove: removeRepairType, setRepairTypes } = useRepairType();

  const displayUsers = users ?? [];

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
  const [searchRepairTypes, setSearchRepairTypes] = useState('');

  const [filterUserRole, setFilterUserRole] = useState<Role | 'all'>('all');

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isBuildingDialogOpen, setIsBuildingDialogOpen] = useState(false);
  const [isRepairTypeDialogOpen, setIsRepairTypeDialogOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<any>(null);
  const [editingRepairType, setEditingRepairType] = useState<any>(null);

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: { name: 'USER' },
  });

  const [buildingForm, setBuildingForm] = useState({
    name: '',
    address: '',
  });

  const [repairTypeForm, setRepairTypeForm] = useState({
    name: '',
    description: '',
    color: 'blue',
  });

  // Statistics
  const totalRequests = tickets.length;
  const pendingRequests = tickets.filter(r => r.status === 'ASSIGNED').length;
  const inProgressRequests = tickets.filter(r => r.status === 'IN_PROGRESS').length;
  const completedRequests = tickets.filter(r => r.status === 'COMPLETED').length;

  // Load data from APIs on mount
  useEffect(() => {
    // fetch users, locations, and repair types from their hooks
    try {
      fetchUsers && fetchUsers();
    } catch (e) {
      // ignore - hooks already set error state
    }
    try {
      fetchLocations && fetchLocations();
    } catch (e) { }
    try {
      fetchRepairTypes && fetchRepairTypes();
    } catch (e) { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter functions
  const filteredUsers = (displayUsers).filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUsers.toLowerCase());
    const selectedRoleName = filterUserRole === 'all' ? 'all' : (typeof filterUserRole === 'string' ? filterUserRole : filterUserRole.name);
    const userRoleName = (u.role && u.role.name) ? u.role.name.toLowerCase() : 'user';
    const matchesRole = selectedRoleName === 'all' || userRoleName === selectedRoleName.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const filteredBuildings = (locations ?? []).filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchBuildings.toLowerCase()) ||
      (b.address || '').toLowerCase().includes(searchBuildings.toLowerCase());
    return matchesSearch;
  });

  // use repairTypes from hook
  const maintenanceSource = repairTypes ?? [];

  const filteredRepairTypes = (maintenanceSource || []).filter(mt => {
    const matchesSearch = mt.name.toLowerCase().includes(searchRepairTypes.toLowerCase()) ||
      (mt.description || '').toLowerCase().includes(searchRepairTypes.toLowerCase());
    return matchesSearch;
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
    const newUser: User = {
      id: Date.now().toString(),
      ...userDataWithoutConfirm,
      createdAt: new Date(),
    };
    setHookUsers([...(users ?? []), newUser]);
    setIsUserDialogOpen(false);
    resetUserForm();
    toast.success('เพิ่มผู้ใช้สำเร็จ');
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: { name: user?.role?.name || "" }
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

      setHookUsers((users ?? []).map(u => u.id === editingUser.id ? { ...u, ...updatedData } : u));
      setIsUserDialogOpen(false);
      setEditingUser(null);
      resetUserForm();
      toast.success('อัปเดตผู้ใช้สำเร็จ');
    }
  };

  const handleDeleteUser = (id: string) => {
    setHookUsers((users ?? []).filter(u => u.id !== id));
    toast.success('ลบผู้ใช้สำเร็จ');
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: { name: 'USER' } as Role,
    });
  };

  // CRUD operations for Buildings - now using BuildingContext
  const handleAddBuilding = async () => {
    try {
      const created = await createLocation({ name: buildingForm.name, address: buildingForm.address });
      // update hook state so UI refreshes immediately
      if (created && setLocations) {
        setLocations([...(locations ?? []), created]);
      }
      setIsBuildingDialogOpen(false);
      resetBuildingForm();
      toast.success('เพิ่มอาคารสำเร็จ');
    } catch (e) {
      toast.error('ไม่สามารถเพิ่มอาคารได้');
    }
  };

  const handleEditBuilding = (building: any) => {
    setEditingBuilding(building);
    setBuildingForm({
      name: building.name,
      address: building.address || '',
    });
    setIsBuildingDialogOpen(true);
  };

  const handleUpdateBuilding = async () => {
    if (editingBuilding) {
      try {
        const updated = await updateLocation(editingBuilding.id, { name: buildingForm.name, address: buildingForm.address });
        if (updated && setLocations) {
          setLocations((locations ?? []).map((l: any) => (l.id === updated.id ? updated : l)));
        }
        setIsBuildingDialogOpen(false);
        setEditingBuilding(null);
        resetBuildingForm();
        toast.success('อัปเดตอาคารสำเร็จ');
      } catch (e) {
        toast.error('ไม่สามารถอัปเดตอาคารได้');
      }
    }
  };

  const handleDeleteBuilding = async (id: string) => {
    try {
      await removeLocation(id);
      if (setLocations) {
        setLocations((locations ?? []).filter((l: any) => l.id !== id));
      }
      toast.success('ลบอาคารสำเร็จ');
    } catch (e) {
      toast.error('ไม่สามารถลบอาคารได้');
    }
  };

  const resetBuildingForm = () => {
    setBuildingForm({
      name: '',
      address: '',
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

  // CRUD operations for Repair Types (use repair-type hook)
  const handleAddRepairType = async () => {
    try {
      const created = await createRepairType({
        ...repairTypeForm,
      });
      if (created && setRepairTypes) {
        setRepairTypes([...(repairTypes ?? []), created]);
      } else {
        // fallback: refetch if setter not available
        fetchRepairTypes && (await fetchRepairTypes());
      }
      setIsRepairTypeDialogOpen(false);
      resetRepairTypeForm();
      toast.success('เพิ่มประเภทการซ่อมสำเร็จ');
    } catch (e) {
      toast.error('ไม่สามารถเพิ่มประเภทการซ่อมได้');
    }
  };

  const handleEditRepairType = (type: any) => {
    setEditingRepairType(type);
    setRepairTypeForm({
      name: type.name,
      description: type.description || '',
      color: type.color || 'blue',
    });
    setIsRepairTypeDialogOpen(true);
  };

  const handleUpdateRepairType = async () => {
    if (editingRepairType) {
      try {
        const updated = await updateRepairType(editingRepairType.id, repairTypeForm);
        if (updated && setRepairTypes) {
          setRepairTypes((repairTypes ?? []).map((t: any) => (t.id === updated.id ? updated : t)));
        } else {
          fetchRepairTypes && (await fetchRepairTypes());
        }
        setIsRepairTypeDialogOpen(false);
        setEditingRepairType(null);
        resetRepairTypeForm();
        toast.success('อัปเดตประเภทการซ่อมสำเร็จ');
      } catch (e) {
        toast.error('ไม่สามารถอัปเดตประเภทการซ่อมได้');
      }
    }
  };

  const handleDeleteRepairType = async (id: string) => {
    try {
      await removeRepairType(id);
      if (setRepairTypes) {
        setRepairTypes((repairTypes ?? []).filter((t: any) => t.id !== id));
      } else {
        fetchRepairTypes && (await fetchRepairTypes());
      }
      toast.success('ลบประเภทการซ่อมสำเร็จ');
    } catch (e) {
      toast.error('ไม่สามารถลบประเภทการซ่อมได้');
    }
  };

  const resetRepairTypeForm = () => {
    setRepairTypeForm({
      name: '',
      description: '',
      color: 'blue',
    });
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role.name.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'SUPERVISOR':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'TECHNICIAN':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleLabel = (role: Role) => {
    const labels = {
      admin: 'ผู้ดูแลระบบ',
      supervisor: 'หัวหน้างาน',
      technician: 'ช่างเทคนิค',
      user: 'ผู้ใช้ทั่วไป',
    };
    return labels[role.name.toLowerCase() as keyof typeof labels];
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
            <TabsList className="grid w-full grid-cols-3 bg-red-50">
              <TabsTrigger value="users" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                ผู้ใช้
              </TabsTrigger>
              <TabsTrigger value="buildings" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Building2 className="h-4 w-4 mr-2" />
                อาคาร
              </TabsTrigger>
              <TabsTrigger value="repairTypes" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
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
                <Select
                  value={filterUserRole ? (typeof filterUserRole === 'string' ? filterUserRole : filterUserRole.name) : 'all'}
                  onValueChange={(value) => setFilterUserRole(value as Role | 'all')}
                >
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
                {filteredUsers.map((u) => (
                  <motion.div
                    key={u.id}
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
                              <span className="text-gray-900">{u.name}</span>
                              <Badge className={getRoleBadgeColor(u.role ?? ({ name: 'user' } as Role))}>
                                {getRoleLabel(u.role ?? ({ name: 'user' } as Role))}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {u.email}
                              </span>
                              {(u as any).phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {(u as any).phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Key className="h-3 w-3" />
                                {showPasswords[u.id] ? u.password : '••••••••'}
                                <button
                                  onClick={() => setShowPasswords({ ...showPasswords, [u.id]: !showPasswords[u.id] })}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {showPasswords[u.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
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
                          onClick={() => handleEditUser(u as User)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id)}
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
                {/* filter by building status removed — buildings are driven by API */}
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
                              {building.address}
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

            {/* Maintenance Types Management */}
            <TabsContent value="repairTypes" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">จัดการประเภทการซ่อม</h3>
                <Button
                  onClick={() => {
                    setEditingRepairType(null);
                    resetRepairTypeForm();
                    setIsRepairTypeDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มประเภทใหม่
                </Button>
              </div>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหา..."
                  value={searchRepairTypes}
                  onChange={(e) => setSearchRepairTypes(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3">
                {filteredRepairTypes.map((type) => {
                  const colorClasses = getColorClasses(type.color || 'gray');
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
                            </div>
                            <p className="text-gray-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRepairType(type)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRepairType(type.id)}
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
              <Select value={userForm.role.name} onValueChange={(value) => setUserForm({ ...userForm, role: { name: value } })}>
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
                value={buildingForm.address}
                onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
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

      {/* Maintenance Type Dialog */}
      <Dialog open={isRepairTypeDialogOpen} onOpenChange={setIsRepairTypeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRepairType ? 'แก้ไขประเภทการซ่อม' : 'เพิ่มประเภทการซ่อมใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลประเภทการซ่อมด้านล่าง
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อประเภท</Label>
              <Input
                value={repairTypeForm.name}
                onChange={(e) => setRepairTypeForm({ ...repairTypeForm, name: e.target.value })}
                placeholder="เช่น ไฟฟ้า"
              />
            </div>
            <div className="space-y-2">
              <Label>คำอธิบาย</Label>
              <Textarea
                value={repairTypeForm.description}
                onChange={(e) => setRepairTypeForm({ ...repairTypeForm, description: e.target.value })}
                placeholder="อธิบายรายละเอียดประเภทการซ่อม"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>สี</Label>
              <Select
                value={repairTypeForm.color}
                onValueChange={(value) => setRepairTypeForm({ ...repairTypeForm, color: value })}
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
            <Button variant="outline" onClick={() => setIsRepairTypeDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={editingRepairType ? handleUpdateRepairType : handleAddRepairType}
              className="bg-red-600 hover:bg-red-700"
            >
              {editingRepairType ? 'บันทึก' : 'เพิ่ม'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
