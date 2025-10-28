import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ClipboardList, Clock, CheckCircle, UserCheck, Wrench, AlertTriangle, Award, Zap, Star } from 'lucide-react';
import { RequestDetailsDialog } from './RequestDetailsDialog';
import { StatCard } from './StatCard';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import type { MaintenanceRequest } from '../contexts/MaintenanceContext';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const { requests, assignRequest, updateRequestStatus, slaSettings } = useMaintenance();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const inProgressRequests = requests.filter(req => req.status === 'in_progress');
  const completedRequests = requests.filter(req => req.status === 'completed');

  const myRequests = requests.filter(req => req.assignedTo === user?.id);
  const myInProgress = myRequests.filter(req => req.status === 'in_progress');
  const myCompleted = myRequests.filter(req => req.status === 'completed');

  // Calculate average rating
  const ratedRequests = myCompleted.filter(req => req.rating !== undefined);
  const averageRating = ratedRequests.length > 0 
    ? ratedRequests.reduce((sum, req) => sum + (req.rating || 0), 0) / ratedRequests.length 
    : 0;

  const handleAcceptJob = (request: MaintenanceRequest) => {
    if (!user) return;
    assignRequest(request.id, user.id, user.name);
    toast.success('รับงานสำเร็จ', {
      description: `คุณได้รับงาน "${request.title}" แล้ว`,
    });
  };

  const handleCompleteJob = (request: MaintenanceRequest) => {
    updateRequestStatus(request.id, 'completed');
    toast.success('อัปเดตสถานะสำเร็จ', {
      description: `งาน "${request.title}" เสร็จสิ้นแล้ว`,
    });
  };

  const checkSLA = (request: MaintenanceRequest) => {
    const now = new Date();
    const createdAt = new Date(request.createdAt);
    const hoursPassed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const slaLimit = slaSettings[request.priority];
    return hoursPassed > slaLimit;
  };

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

  const renderRequestCard = (request: MaintenanceRequest, showActions: boolean = false) => {
    const isOverSLA = checkSLA(request);

    return (
      <motion.div
        key={request.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group relative p-5 border rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden ${
          isOverSLA && request.status !== 'completed' 
            ? 'border-red-300 bg-gradient-to-br from-red-50/80 to-white shadow-md' 
            : 'border-gray-200 bg-gradient-to-br from-white to-gray-50/30 hover:border-[#C91A1A]/30'
        }`}
      >
        {/* Hover effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#C91A1A]/5 to-[#E44646]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status indicator line */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
          isOverSLA && request.status !== 'completed' ? 'bg-red-500' :
          request.priority === 'high' ? 'bg-red-400' :
          request.priority === 'medium' ? 'bg-amber-400' :
          'bg-blue-500'
        }`}></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{request.title}</h3>
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
                <Badge variant="outline" className="border-gray-300">
                  {request.dormBuilding} ห้อง {request.roomNumber}
                </Badge>
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
                  <span className="text-[#C91A1A] font-medium">ผู้รับผิดชอบ: {request.assignedToName}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedRequest(request)}
              className="hover:bg-[#C91A1A] hover:text-white transition-all duration-200"
            >
              ดูรายละเอียด
            </Button>
            {showActions && (
              <>
                {request.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleAcceptJob(request)}
                    className="bg-[#C91A1A] hover:bg-[#991B1B] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    รับงาน
                  </Button>
                )}
                {request.status === 'in_progress' && request.assignedTo === user?.id && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteJob(request)}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    ทำงานเสร็จ
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#C91A1A] to-[#E44646] p-8 shadow-2xl"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-red-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative text-white space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white mb-2 text-3xl flex items-center gap-3"
          >
            <Wrench className="w-8 h-8 text-white" />
            แดชบอร์ดช่าง
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-red-100 text-xl flex items-center gap-2"
          >
            สวัสดี, {user?.name}
            <span className="inline-block animate-wave">🔧</span>
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="งานของฉัน (รอดำเนินการ)"
            value={myRequests.filter(r => r.status === 'pending').length}
            description="งานที่รับไปแล้ว"
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
            title="กำลังทำงาน"
            value={myInProgress.length}
            description="งานที่กำลังดำเนินการ"
            icon={Zap}
            iconColor="text-[#C91A1A]"
            iconBg="bg-red-100"
            gradientFrom="from-[#C91A1A]"
            gradientTo="to-[#E44646]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="งานที่เสร็จแล้ว"
            value={myCompleted.length}
            description="งานที่ทำเสร็จสมบูรณ์"
            icon={Award}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            gradientFrom="from-green-400"
            gradientTo="to-green-600"
            trend={{ value: 15, isPositive: true }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB81C] to-amber-600"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#FFB81C] rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#FFB81C]">
                    {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                  </span>
                  <span className="text-xl text-gray-600">/5</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">คะแนนเฉลี่ยจากผู้ใช้</p>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? 'text-[#FFB81C] fill-[#FFB81C]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  จาก {ratedRequests.length} งานที่ได้รับการประเมิน
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C91A1A] to-[#E44646]"></div>
          <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <CardTitle className="text-[#C91A1A] flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              จัดการงานซ่อม
            </CardTitle>
            <CardDescription>รับงาน ติดตามสถานะ และอัปเดตงานซ่อมทั้งหมด</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-xl">
                <TabsTrigger 
                  value="pending"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C91A1A] data-[state=active]:to-[#E44646] data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  รอรับงาน ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="in_progress"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C91A1A] data-[state=active]:to-[#E44646] data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  กำลังซ่อม ({inProgressRequests.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C91A1A] data-[state=active]:to-[#E44646] data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  เสร็จสิ้น ({completedRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6 space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>ไม่มีงานที่รอรับ</p>
                  </div>
                ) : (
                  pendingRequests.map(request => renderRequestCard(request, true))
                )}
              </TabsContent>

              <TabsContent value="in_progress" className="mt-6 space-y-4">
                {inProgressRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>ไม่มีงานที่กำลังดำเนินการ</p>
                  </div>
                ) : (
                  inProgressRequests.map(request => renderRequestCard(request, true))
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6 space-y-4">
                {completedRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>ยังไม่มีงานที่เสร็จสิ้น</p>
                  </div>
                ) : (
                  completedRequests.map(request => renderRequestCard(request, false))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};
