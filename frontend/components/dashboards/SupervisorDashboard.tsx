import React, { useState } from 'react';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  AlertTriangle,
  ClipboardList,
  Clock,
  CheckCircle,
  Filter,
  TrendingUp,
  Settings,
  Crown,
  Award,
  Zap,
  Eye,
  Users,
  Star,
  User,
} from 'lucide-react';
import { RequestDetailsDialog } from '../features/maintenance/RequestDetailsDialog';
import { SLAConfigDialog } from '../features/maintenance/SLAConfigDialog';
import { TechnicianDetailDialog } from '../features/maintenance/TechnicianDetailDialog';
import { StatCard } from '../common/StatCard';
import { motion } from 'framer-motion';
import type { MaintenanceRequest, RequestStatus, RequestPriority } from '../../contexts/MaintenanceContext';

export const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { requests, slaSettings } = useMaintenance();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showSLAConfig, setShowSLAConfig] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<RequestPriority | 'all'>('all');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);
  const [selectedTechnicianName, setSelectedTechnicianName] = useState<string>('');

  // Calculate statistics
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const inProgressCount = requests.filter(req => req.status === 'in_progress').length;
  const completedCount = requests.filter(req => req.status === 'completed').length;

  const checkSLA = (request: MaintenanceRequest) => {
    const now = new Date();
    const createdAt = new Date(request.createdAt);
    const hoursPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const slaLimit = slaSettings[request.priority];
    return hoursPassed > slaLimit;
  };

  const overSLACount = requests.filter(
    req => req.status !== 'completed' && checkSLA(req)
  ).length;

  // Get unique technicians
  const technicians = Array.from(
    new Set(
      requests
        .filter(req => req.assignedTo && req.assignedToName)
        .map(req => JSON.stringify({ id: req.assignedTo, name: req.assignedToName }))
    )
  ).map(str => JSON.parse(str));

  // Calculate technician stats
  const technicianStats = technicians.map(tech => {
    const techRequests = requests.filter(req => req.assignedTo === tech.id);
    const completed = techRequests.filter(req => req.status === 'completed');
    const rated = completed.filter(req => req.rating !== undefined);
    const avgRating = rated.length > 0 
      ? rated.reduce((sum, req) => sum + (req.rating || 0), 0) / rated.length 
      : 0;

    return {
      ...tech,
      totalJobs: techRequests.length,
      completedJobs: completed.length,
      inProgressJobs: techRequests.filter(req => req.status === 'in_progress').length,
      averageRating: avgRating,
      ratedCount: rated.length,
    };
  }).sort((a, b) => b.averageRating - a.averageRating);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && req.priority !== priorityFilter) return false;
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">ด่วน</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">ปานกลาง</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">ต่ำ</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">รอดำเนินการ</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-[#002D72] hover:bg-blue-200 border-0">กำลังซ่อม</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">เสร็จสิ้น</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const calculateCompletionRate = () => {
    if (requests.length === 0) return 0;
    return Math.round((completedCount / requests.length) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#002D72] via-[#0a4a9d] to-[#002D72] p-8 shadow-2xl"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-[#FFB81C]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-[#FFB81C]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative flex items-center justify-between">
          <div className="text-white space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white mb-2 text-3xl flex items-center gap-3"
            >
              <Crown className="w-8 h-8 text-[#FFB81C]" />
              แดชบอร์ดหัวหน้างาน
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#FFB81C] text-xl flex items-center gap-2"
            >
              สวัสดี, {user?.name}
              <span className="inline-block animate-wave">👔</span>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={() => setShowSLAConfig(true)}
              className="bg-[#FFB81C] text-[#002D72] hover:bg-[#ffd166] shadow-2xl hover:shadow-[0_20px_50px_rgba(255,184,28,0.5)] hover:scale-105 transition-all duration-300 text-base px-6 py-6 rounded-xl group"
            >
              <Settings className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              ตั้งค่า SLA
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="รอดำเนินการ"
            value={pendingCount}
            description="งานที่รอจัดการ"
            icon={Clock}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
            gradientFrom="from-orange-400"
            gradientTo="to-orange-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="กำลังดำเนินการ"
            value={inProgressCount}
            description="งานที่กำลังซ่อม"
            icon={Zap}
            iconColor="text-[#002D72]"
            iconBg="bg-blue-100"
            gradientFrom="from-[#002D72]"
            gradientTo="to-[#0a4a9d]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="เสร็จสิ้น"
            value={completedCount}
            description="งานที่ทำเสร็จแล้ว"
            icon={Award}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            gradientFrom="from-green-400"
            gradientTo="to-green-600"
            trend={{ value: 18, isPositive: true }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="เกิน SLA"
            value={overSLACount}
            description="งานที่เกินกำหนด"
            icon={AlertTriangle}
            iconColor="text-red-600"
            iconBg="bg-red-100"
            gradientFrom="from-red-400"
            gradientTo="to-red-600"
            trend={overSLACount > 0 ? { value: 5, isPositive: false } : undefined}
          />
        </motion.div>
      </div>

      {/* Technicians Performance */}
      {technicians.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#002D72] via-[#FFB81C] to-[#002D72]"></div>
            <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#002D72]/10 rounded-lg">
                  <Users className="w-5 h-5 text-[#002D72]" />
                </div>
                <div>
                  <CardTitle className="text-[#002D72]">ประสิทธิภาพช่างแต่ละคน</CardTitle>
                  <CardDescription>สถิติและคะแนนของช่างทั้งหมด ({technicians.length} คน)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicianStats.map((tech, index) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + (index * 0.05) }}
                    onClick={() => {
                      setSelectedTechnicianId(tech.id);
                      setSelectedTechnicianName(tech.name);
                    }}
                    className="group relative p-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-[#002D72]/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#002D72]/5 to-[#FFB81C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Top Performer Badge */}
                    {index === 0 && tech.averageRating > 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-[#FFB81C] to-amber-500 text-white border-0 shadow-lg">
                          <Crown className="w-3 h-3 mr-1" />
                          อันดับ 1
                        </Badge>
                      </div>
                    )}

                    <div className="relative space-y-4">
                      {/* Technician Info */}
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-[#002D72] to-[#0a4a9d] rounded-xl shadow-lg">
                          <User className="w-6 h-6 text-[#FFB81C]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                          <p className="text-xs text-gray-500">ช่างซ่อมบำรุง</p>
                        </div>
                      </div>

                      {/* Rating */}
                      {tech.averageRating > 0 ? (
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">คะแนนเฉลี่ย</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-[#FFB81C] fill-[#FFB81C]" />
                              <span className="text-lg font-bold text-[#FFB81C]">{tech.averageRating.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(tech.averageRating)
                                    ? 'text-[#FFB81C] fill-[#FFB81C]'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">จาก {tech.ratedCount} งานที่ประเมิน</p>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                          <Star className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">ยังไม่มีคะแนน</p>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                          <p className="text-xl font-bold text-[#002D72]">{tech.totalJobs}</p>
                          <p className="text-xs text-gray-600">งานทั้งหมด</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-blue-200">
                          <p className="text-xl font-bold text-blue-600">{tech.inProgressJobs}</p>
                          <p className="text-xs text-gray-600">กำลังทำ</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg border border-green-200">
                          <p className="text-xl font-bold text-green-600">{tech.completedJobs}</p>
                          <p className="text-xs text-gray-600">เสร็จแล้ว</p>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Button
                        className="w-full bg-gradient-to-r from-[#002D72] to-[#0a4a9d] hover:from-[#0a4a9d] hover:to-[#002D72] text-white shadow-lg hover:shadow-xl group-hover:scale-105 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTechnicianId(tech.id);
                          setSelectedTechnicianName(tech.name);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Filters and List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#002D72] via-[#FFB81C] to-[#002D72]"></div>
          <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#002D72]/10 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-[#002D72]" />
                </div>
                <div>
                  <CardTitle className="text-[#002D72]">จัดการงานทั้งหมด</CardTitle>
                  <CardDescription>กรองและดูรายละเอียดงานซ่อม ({filteredRequests.length} รายการ)</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#002D72]/5 to-[#FFB81C]/5 rounded-xl border border-[#002D72]/10">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">อัตราความสำเร็จ</p>
                    <p className="text-lg text-[#002D72]">{calculateCompletionRate()}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3 mt-4 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestStatus | 'all')}>
                  <SelectTrigger className="bg-white border-gray-300 focus:ring-[#002D72] focus:border-[#002D72]">
                    <SelectValue placeholder="กรองตามสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="pending">รอดำเนินการ</SelectItem>
                    <SelectItem value="in_progress">กำลังซ่อม</SelectItem>
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as RequestPriority | 'all')}>
                  <SelectTrigger className="bg-white border-gray-300 focus:ring-[#002D72] focus:border-[#002D72]">
                    <SelectValue placeholder="กรองตามความสำคัญ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกระดับ</SelectItem>
                    <SelectItem value="high">ด่วน</SelectItem>
                    <SelectItem value="medium">ปานกลาง</SelectItem>
                    <SelectItem value="low">ต่ำ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>ไม่พบรายการที่ตรงกับเงื่อนไข</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request, index) => {
                  const isOverSLA = checkSLA(request);
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`group relative p-5 border rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        isOverSLA && request.status !== 'completed'
                          ? 'border-red-300 bg-gradient-to-br from-red-50/80 to-white shadow-md'
                          : 'border-gray-200 bg-gradient-to-br from-white to-gray-50/30 hover:border-[#002D72]/30'
                      }`}
                    >
                      {/* Hover effect background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#002D72]/5 to-[#FFB81C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Status indicator line */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                        isOverSLA && request.status !== 'completed' ? 'bg-red-500' :
                        request.status === 'completed' ? 'bg-green-500' :
                        request.status === 'in_progress' ? 'bg-blue-600' :
                        'bg-orange-400'
                      }`}></div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{request.title}</h3>
                              {getStatusBadge(request.status)}
                              {getPriorityBadge(request.priority)}
                              {isOverSLA && request.status !== 'completed' && (
                                <Badge variant="destructive" className="text-xs flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  เกิน SLA
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span>ผู้แจ้ง: {request.userName}</span>
                              <span>
                                {new Date(request.createdAt).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {request.assignedToName && (
                                <span className="text-[#002D72] font-medium">
                                  ผู้รับผิดชอบ: {request.assignedToName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="bg-[#002D72] hover:bg-[#0a4a9d] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-xl"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Technician Detail Dialog */}
      {selectedTechnicianId && (
        <TechnicianDetailDialog
          open={!!selectedTechnicianId}
          onClose={() => {
            setSelectedTechnicianId(null);
            setSelectedTechnicianName('');
          }}
          technicianId={selectedTechnicianId}
          technicianName={selectedTechnicianName}
        />
      )}

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {showSLAConfig && (
        <SLAConfigDialog open={showSLAConfig} onClose={() => setShowSLAConfig(false)} />
      )}
    </div>
  );
};
