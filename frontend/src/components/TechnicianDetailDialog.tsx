import React from "react";
import { useMaintenance } from "../contexts/MaintenanceContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Star,
  User,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Award,
  MessageSquare,
  Calendar,
  BarChart3,
} from "lucide-react";
import { motion } from "motion/react";
import type { MaintenanceRequest } from "../contexts/MaintenanceContext";

interface TechnicianDetailDialogProps {
  open: boolean;
  onClose: () => void;
  technicianId: string;
  technicianName: string;
}

export const TechnicianDetailDialog: React.FC<TechnicianDetailDialogProps> = ({
  open,
  onClose,
  technicianId,
  technicianName,
}) => {
  const { requests } = useMaintenance();

  // Filter requests for this technician
  const technicianRequests = requests.filter(
    (req) => req.assignedTo === technicianId
  );
  const completedRequests = technicianRequests.filter(
    (req) => req.status === "completed"
  );
  const inProgressRequests = technicianRequests.filter(
    (req) => req.status === "in_progress"
  );
  const pendingRequests = technicianRequests.filter(
    (req) => req.status === "pending"
  );

  // Calculate ratings
  const ratedRequests = completedRequests.filter(
    (req) => req.rating !== undefined
  );
  const averageRating =
    ratedRequests.length > 0
      ? ratedRequests.reduce((sum, req) => sum + (req.rating || 0), 0) /
        ratedRequests.length
      : 0;

  // Get feedback
  const feedbackList = completedRequests
    .filter((req) => req.feedback)
    .sort(
      (a, b) =>
        new Date(b.completedAt || b.updatedAt).getTime() -
        new Date(a.completedAt || a.updatedAt).getTime()
    );

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: ratedRequests.filter((req) => req.rating === stars).length,
    percentage:
      ratedRequests.length > 0
        ? (ratedRequests.filter((req) => req.rating === stars).length /
            ratedRequests.length) *
          100
        : 0,
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] border-0 shadow-2xl bg-gray-100">
        {/* Gradient header bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C91A1A] via-[#FFB81C] to-[#C91A1A]"></div>

        <DialogHeader className="pb-6 border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-4 bg-gradient-to-br from-[#C91A1A] to-[#E44646] rounded-2xl shadow-lg"
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex-1">
                <DialogTitle className="text-2xl bg-gradient-to-r from-[#C91A1A] to-[#E44646] bg-clip-text text-transparent">
                  {technicianName}
                </DialogTitle>
                <DialogDescription className="text-gray-600 flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4" />
                  ช่างซ่อมบำรุง - ข้อมูลผลงานและประสิทธิภาพ
                </DialogDescription>
              </div>
              {/* Overall Rating Badge */}
              {averageRating > 0 && (
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-[#FFB81C]/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-[#FFB81C] fill-[#FFB81C]" />
                    <span className="text-3xl font-bold text-[#FFB81C]">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">คะแนนเฉลี่ย</p>
                </div>
              )}
            </div>
          </motion.div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6">
            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#C91A1A]" />
                สถิติการทำงาน
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <Card className="border border-orange-200 shadow-md bg-gradient-to-br from-orange-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-8 h-8 text-orange-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {pendingRequests.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">งานรอดำเนินการ</p>
                  </CardContent>
                </Card>

                <Card className="border border-red-200 shadow-md bg-gradient-to-br from-red-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-8 h-8 text-[#C91A1A]" />
                      <span className="text-2xl font-bold text-gray-900">
                        {inProgressRequests.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">กำลังทำงาน</p>
                  </CardContent>
                </Card>

                <Card className="border border-green-200 shadow-md bg-gradient-to-br from-green-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {completedRequests.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">งานเสร็จสิ้น</p>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 shadow-md bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-8 h-8 text-[#C91A1A]" />
                      <span className="text-2xl font-bold text-gray-900">
                        {technicianRequests.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">งานทั้งหมด</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Rating Distribution */}
            {ratedRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#FFB81C]" />
                  การกระจายคะแนน ({ratedRequests.length} งานที่ได้รับการประเมิน)
                </h3>
                <div className="space-y-3">
                  {ratingDistribution.map(({ stars, count, percentage }) => (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm font-medium text-gray-700">
                          {stars}
                        </span>
                        <Star className="w-4 h-4 text-[#FFB81C] fill-[#FFB81C]" />
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-[#FFB81C] to-amber-500 rounded-full"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-16 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Feedback */}
            {feedbackList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C91A1A]" />
                  ความคิดเห็นจากผู้ใช้บริการ
                </h3>
                <div className="space-y-3">
                  {feedbackList.slice(0, 5).map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (request.rating || 0)
                                    ? "text-[#FFB81C] fill-[#FFB81C]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge className="bg-[#FFB81C]/10 text-[#FFB81C] border-0 text-xs">
                            {request.rating}/5
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {request.completedAt &&
                            new Date(request.completedAt).toLocaleDateString(
                              "th-TH",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-900 italic mb-2">
                        &ldquo;{request.feedback}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          {request.title}
                        </Badge>
                        <span>•</span>
                        <span>
                          {request.dormBuilding} ห้อง {request.roomNumber}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {feedbackList.length > 5 && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    และอีก {feedbackList.length - 5} ความคิดเห็น
                  </p>
                )}
              </motion.div>
            )}

            {/* No Data State */}
            {technicianRequests.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">ยังไม่มีข้อมูลงานของช่างท่านนี้</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
