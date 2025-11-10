import React, { useState } from 'react';
import { useMaintenance } from '../../../contexts/MaintenanceContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';
import { Star, Send, Heart, User, Wrench, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MaintenanceRequest } from '../../../contexts/MaintenanceContext';

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
      <DialogContent className="max-w-xl border-0 shadow-2xl bg-white/98 backdrop-blur-sm">
        {/* Gradient header bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DC2626] via-[#FCD34D] to-[#DC2626]"></div>
        
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
                className="p-3 bg-gradient-to-br from-[#DC2626] to-[#EF4444] rounded-xl shadow-lg"
              >
                <Heart className="w-6 h-6 text-[#FCD34D]" />
              </motion.div>
              <div>
                <DialogTitle className="text-2xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">
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
            className="p-5 bg-gradient-to-br from-[#DC2626]/10 to-white rounded-xl border-2 border-[#DC2626]/20 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-[#DC2626] to-[#EF4444] rounded-full shadow-lg">
                <User className="w-8 h-8 text-[#FCD34D]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">ช่างผู้รับผิดชอบ</p>
                <p className="text-xl font-bold text-[#DC2626]">{request.assignedToName || 'ไม่ระบุ'}</p>
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
            className="flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200"
          >
            {/* Emoji Display */}
            <motion.div
              key={currentRating}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-6xl mb-4"
            >
              {getRatingEmoji(currentRating)}
            </motion.div>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-3">
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
                        ? 'text-[#FCD34D] fill-[#FCD34D] drop-shadow-lg'
                        : 'text-gray-300 hover:text-[#FCD34D]/50'
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
                  currentRating > 0 ? 'text-[#002D72]' : 'text-gray-500'
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
            className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200"
          >
            <h4 className="text-sm font-semibold text-[#002D72] mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              รายละเอียดงานที่ซ่อม
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600">ปัญหา:</span>
                <span className="font-medium">{request.title}</span>
              </div>
              {request.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">เสร็จเมื่อ:</span>
                  <span className="font-medium">
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
              className="border-gray-300 focus:ring-[#002D72] focus:border-[#002D72] transition-all duration-200 resize-none"
            />
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Heart className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
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
              className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#002D72]/10 to-[#FFB81C]/10 rounded-xl border border-[#FFB81C]/30"
            >
              <Star className="w-5 h-5 text-[#FFB81C] fill-[#FFB81C]" />
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
              className="bg-gradient-to-r from-[#002D72] to-[#0a4a9d] hover:from-[#0a4a9d] hover:to-[#002D72] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
