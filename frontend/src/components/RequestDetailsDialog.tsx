import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, User, MapPin, Clock, Star, CheckCircle2, AlertCircle, Zap, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { MaintenanceRequest } from '../contexts/MaintenanceContext';

interface RequestDetailsDialogProps {
  request: MaintenanceRequest;
  open: boolean;
  onClose: () => void;
}

export const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({
  request,
  open,
  onClose,
}) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอดำเนินการ';
      case 'in_progress':
        return 'กำลังซ่อม';
      case 'completed':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'ด่วน';
      case 'medium':
        return 'ปานกลาง';
      case 'low':
        return 'ต่ำ';
      default:
        return priority;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getStatusText(status)}
        </Badge>;
      case 'in_progress':
        return <Badge className="bg-red-100 text-[#C91A1A] hover:bg-red-200 border-0 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {getStatusText(status)}
        </Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {getStatusText(status)}
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {getPriorityText(priority)}
        </Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">
          {getPriorityText(priority)}
        </Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">
          {getPriorityText(priority)}
        </Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl border-0 shadow-2xl bg-white backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        {/* Gradient header bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C91A1A] via-[#E44646] to-[#C91A1A]"></div>
        
        <DialogHeader className="pb-6 border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DialogTitle className="text-2xl bg-gradient-to-r from-[#C91A1A] to-[#E44646] bg-clip-text text-transparent mb-2">
              รายละเอียดคำขอซ่อม
            </DialogTitle>
            <DialogDescription className="sr-only">
              แสดงรายละเอียดของคำขอซ่อมบำรุง รหัสงาน {request.id}
            </DialogDescription>
            
            {/* Title and Status */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl text-gray-900 flex-1">{request.title}</h3>
                {getStatusBadge(request.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">ความเร่งด่วน:</span>
                {getPriorityBadge(request.priority)}
              </div>
            </div>
          </motion.div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-transparent rounded-xl border border-gray-200"
          >
            <h4 className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C91A1A]" />
              รายละเอียดปัญหา
            </h4>
            <p className="text-gray-900">{request.description}</p>
          </motion.div>

          {/* Images */}
          {request.images && request.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-3"
            >
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#C91A1A]" />
                รูปภาพประกอบ ({request.images.length} รูป)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {request.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="group relative aspect-square cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={image}
                      alt={`รูปภาพที่ ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-[#C91A1A] transition-all duration-200 shadow-md group-hover:shadow-xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Location */}
            <div className="p-4 bg-transparent rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#C91A1A]" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">สถานที่</p>
                  <p className="font-semibold text-gray-900">{request.dormBuilding}</p>
                  <p className="text-sm text-gray-700">ห้อง {request.roomNumber}</p>
                </div>
              </div>
            </div>

            {/* Reporter */}
            <div className="p-4 bg-transparent rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <User className="w-5 h-5 text-[#C91A1A]" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">ผู้แจ้ง</p>
                  <p className="font-semibold text-gray-900">{request.userName}</p>
                </div>
              </div>
            </div>

            {/* Created Date */}
            <div className="p-4 bg-transparent rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#C91A1A]" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">วันที่แจ้ง</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(request.createdAt).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(request.createdAt).toLocaleString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} น.
                  </p>
                </div>
              </div>
            </div>

            {/* Updated Date */}
            <div className="p-4 bg-transparent rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="w-5 h-5 text-[#C91A1A]" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">อัปเดตล่าสุด</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(request.updatedAt).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(request.updatedAt).toLocaleString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} น.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assigned Technician */}
          {request.assignedToName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-transparent rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#C91A1A] to-[#E44646] rounded-xl shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">ช่างผู้รับผิดชอบ</p>
                  <p className="font-semibold text-[#C91A1A] text-lg">{request.assignedToName}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Completion Info */}
          {request.status === 'completed' && request.completedAt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-600 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-green-800">งานเสร็จสิ้น</h4>
              </div>

              <div className="space-y-4">
                {/* Completion Date */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">วันที่เสร็จสิ้น</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(request.completedAt).toLocaleString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {request.rating && (
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-[#FFB81C]/30 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#FFB81C] rounded-lg">
                          <Star className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-700">คะแนนช่าง {request.assignedToName}</span>
                          <p className="text-xs text-gray-500">ความพึงพอใจในการให้บริการ</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-[#FFB81C]">{request.rating}/5</span>
                    </div>
                    <div className="flex gap-1 justify-center py-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-7 h-7 ${
                            i < request.rating!
                              ? 'text-[#FFB81C] fill-[#FFB81C] drop-shadow-md'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {request.feedback && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700">ความคิดเห็นเกี่ยวกับช่าง</span>
                        <p className="text-xs text-gray-500">ผู้ใช้บริการประเมินการให้บริการ</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-900 italic leading-relaxed">&ldquo;{request.feedback}&rdquo;</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
