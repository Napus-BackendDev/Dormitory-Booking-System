import React, { useState } from 'react';
import { useMaintenance } from '../contexts/MaintenanceContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Star, Send, Heart, User, Wrench, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { MaintenanceRequest } from '../contexts/MaintenanceContext';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  request: MaintenanceRequest;
}

export const RatingDialog: React.FC<RatingDialogProps> = ({ open, onClose, request }) => {
  const { completeRequest } = useMaintenance();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('กรุณาให้คะแนน', {
        description: 'โปรดเลือกคะแนนความพึงพอใจ 1-5 ดาว',
      });
      return;
    }

    completeRequest(request.id, rating, feedback || undefined);

    toast.success('🎉 ขอบคุณสำหรับการให้คะแนน!', {
      description: `คุณให้คะแนนช่าง ${request.assignedToName} ${rating} ดาว`,
    });

    // Reset form
    setRating(0);
    setFeedback('');
    onClose();
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1: return 'ไม่พอใจมาก';
      case 2: return 'ไม่พอใจ';
      case 3: return 'พอใช้';
      case 4: return 'พอใจ';
      case 5: return 'พอใจมาก';
      default: return 'กรุณาให้คะแนนช่าง';
    }
  };

  const getRatingEmoji = (stars: number) => {
    switch (stars) {
      case 1: return '😞';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '🤩';
      default: return '⭐';
    }
  };

  const currentRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-w-xl border-0 shadow-2xl bg-white p-6 rounded-2xl max-h-[85vh] overflow-y-auto">
  {/* Gradient header bar */}
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C91A1A] via-[#E44646] to-[#C91A1A]"></div>
        
        <DialogHeader className="pb-6 border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-3 bg-gradient-to-br from-[#C91A1A] to-[#E44646] rounded-xl shadow-sm"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <DialogTitle className="text-2xl text-[#C91A1A]">
                  ให้คะแนนช่างผู้ซ่อม
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  ประเมินคุณภาพการให้บริการ
                </DialogDescription>
              </div>
            </div>
          </motion.div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Technician Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-[#C91A1A] to-[#E44646] rounded-full shadow-sm">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">ช่างผู้รับผิดชอบ</p>
                <p className="text-xl font-bold text-slate-900 mb-1">{request.assignedToName || 'ไม่ระบุ'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Wrench className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-600">ช่างซ่อมบำรุง</p>
                </div>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-1" />
                <span className="text-xs text-green-700 font-medium">งานเสร็จสิ้น</span>
              </div>
            </div>
          </motion.div>

          {/* Rating Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center justify-center py-8 px-6 bg-gray-50 rounded-2xl border border-gray-100"
          >
            {/* Emoji Display */}
              <motion.div
              key={currentRating}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-6xl mb-3"
            >
              {getRatingEmoji(currentRating)}
            </motion.div>

            {/* Star Rating */}
            <div className="flex items-center gap-3 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-200 ${
                      star <= currentRating
                        ? 'text-[#E44646] fill-[#E44646] drop-shadow-sm'
                              : 'text-gray-300 hover:text-[#E44646]/50'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Rating Label */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentRating}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`font-semibold text-lg ${
                  currentRating > 0 ? 'text-slate-900' : 'text-gray-500'
                }`}
              >
                {getRatingLabel(currentRating)}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Work Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 bg-white rounded-xl border border-gray-100"
          >
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-3">
              <Wrench className="w-4 h-4 text-[#C91A1A]" />
              รายละเอียดงานที่ซ่อม
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">สถานที่:</span>
                <span className="font-medium text-gray-800">{request.dormBuilding} ห้อง {request.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ปัญหา:</span>
                <span className="font-medium text-gray-800">{request.title}</span>
              </div>
              {request.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">เสร็จเมื่อ:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(request.completedAt).toLocaleString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Feedback Textarea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-gray-700">
              ความคิดเห็นเกี่ยวกับการให้บริการของช่าง (ไม่บังคับ)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="เช่น ช่างทำงานรวดเร็ว สุภาพ อธิบายปัญหาได้ชัดเจน..."
              rows={4}
              className="border-gray-300 bg-gray-50 placeholder-gray-400 focus:ring-[#C91A1A] focus:border-[#C91A1A] transition-all duration-200 resize-none p-3"
            />
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Heart className="w-4 h-4 text-[#C91A1A] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">
                คะแนนและความคิดเห็นของคุณจะช่วยให้ช่างพัฒนาการให้บริการได้ดีขึ้น และเป็นข้อมูลสำหรับผู้บริหารในการประเมินผลงาน
              </p>
            </div>
          </motion.div>

          {/* Star Count Indicator */}
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <Star className="w-5 h-5 text-[#E44646] fill-[#E44646]" />
              <span className="text-sm font-semibold text-gray-700">
                คุณให้คะแนนช่าง {request.assignedToName} {rating} จาก 5 ดาว
              </span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex gap-3 justify-end pt-6 border-t border-gray-200"
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-gray-100 border-gray-300 transition-all duration-200"
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit"
              disabled={rating === 0}
              className="bg-gradient-to-r from-[#C91A1A] to-[#E44646] hover:from-[#E44646] hover:to-[#C91A1A] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-4 h-4 mr-2" />
              ส่งคะแนน
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
