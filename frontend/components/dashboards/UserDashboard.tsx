import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ClipboardList, Clock, CheckCircle, Plus, Eye, Award, Zap, Star } from 'lucide-react';
import { MaintenanceRequestForm } from '../features/maintenance/MaintenanceRequestForm';
import { RequestDetailsDialog } from '../features/maintenance/RequestDetailsDialog';
import { RatingDialog } from '../features/maintenance/RatingDialog';
import { StatCard } from '../common/StatCard';
import { motion } from 'framer-motion';
import { Ticket } from '@/types/Ticket';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets } = useMaintenance();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Ticket | null>(null);
  const [ratingRequest, setRatingRequest] = useState<Ticket | null>(null);

  const userRequests = tickets.filter(req => req.userId === user?.id);

  const pendingCount = userRequests.filter(req => req.status === 'ASSIGNED').length;
  const inProgressCount = userRequests.filter(req => req.status === 'IN_PROGRESS').length;
  const completedCount = userRequests.filter(req => req.status === 'COMPLETED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">รอดำเนินการ</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-red-100 text-[#DC2626] hover:bg-red-200 border-0">กำลังซ่อม</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">เสร็จสิ้น</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'P1':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">ด่วน</Badge>;
      case 'P2':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">ปานกลาง</Badge>;
      case 'P3':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">ต่ำ</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with gradient and animations */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#DC2626] p-8 shadow-2xl"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-[#FCD34D]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-[#FCD34D]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative flex items-center justify-between">
          <div className="text-white space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white mb-2 text-3xl"
            >
              แดชบอร์ดผู้ใช้
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#FCD34D] text-xl flex items-center gap-2"
            >
              สวัสดี, {user?.name} 
              <span className="inline-block animate-wave">👋</span>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={() => setShowRequestForm(true)}
              className="bg-[#FCD34D] text-[#1F2937] hover:bg-[#FDE68A] shadow-2xl hover:shadow-[0_20px_50px_rgba(252,211,77,0.5)] hover:scale-105 transition-all duration-300 text-base px-6 py-6 rounded-xl group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              แจ้งซ่อมใหม่
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Status Cards with enhanced animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="รอดำเนินการ"
            value={pendingCount}
            description="คำขอที่รอการจัดการ"
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
            title="กำลังซ่อม"
            value={inProgressCount}
            description="กำลังดำเนินการ"
            icon={Zap}
            iconColor="text-[#DC2626]"
            iconBg="bg-red-100"
            gradientFrom="from-[#DC2626]"
            gradientTo="to-[#EF4444]"
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
            description="งานที่เสร็จแล้ว"
            icon={Award}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            gradientFrom="from-green-400"
            gradientTo="to-green-600"
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
      </div>

      {/* Recent Requests with glass effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DC2626] via-[#FCD34D] to-[#DC2626]"></div>
          <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#DC2626]/10 rounded-lg">
                <ClipboardList className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div>
                <CardTitle className="text-[#DC2626]">คำขอซ่อมล่าสุด</CardTitle>
                <CardDescription>รายการแจ้งซ่อมทั้งหมดของคุณ</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {userRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>ยังไม่มีรายการแจ้งซ่อม</p>
                <p className="text-sm mt-2">คลิกปุ่ม "แจ้งซ่อมใหม่" เพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group relative flex items-center justify-between p-5 border border-gray-200 rounded-2xl hover:shadow-xl hover:border-[#DC2626]/30 transition-all duration-300 bg-gradient-to-r from-white to-gray-50/30 overflow-hidden"
                  >
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/5 to-[#FCD34D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Status indicator line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                      request.status === 'ASSIGNED' ? 'bg-orange-400' :
                      request.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                      'bg-green-500'
                    }`}></div>

                    <div className="flex-1 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{request.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                          {request.technicianName && (
                            <p className="text-sm text-gray-500 mt-2">
                              ผู้รับผิดชอบ: {request.technicianName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                      {/* Rating Button - show only for completed requests without rating */}
                      {request.status === 'COMPLETED' && !request.rating && (
                        <Button
                          size="sm"
                          onClick={() => setRatingRequest(request)}
                          className="bg-gradient-to-r from-[#FCD34D] to-amber-500 hover:from-amber-500 hover:to-[#FCD34D] text-gray-900 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-xl"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          ให้คะแนน
                        </Button>
                      )}
                      
                      {/* View Details Button */}
                      <Button
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                        className="bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-xl"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <MaintenanceRequestForm 
        open={showRequestForm} 
        onClose={() => setShowRequestForm(false)} 
      />

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {ratingRequest && (
        <RatingDialog
          request={ratingRequest}
          open={!!ratingRequest}
          onClose={() => setRatingRequest(null)}
        />
      )}
    </div>
  );
};
