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
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast } from 'sonner';
import { Clock, Save, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface SLAConfigDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SLAConfigDialog: React.FC<SLAConfigDialogProps> = ({ open, onClose }) => {
  const { slaSettings, updateSLASettings } = useMaintenance();
  
  // Default SLA values (in hours)
  const DEFAULT_SLA = {
    high: 4,
    medium: 24,
    low: 72,
  };
  
  const [highPriority, setHighPriority] = useState(slaSettings.high.toString());
  const [mediumPriority, setMediumPriority] = useState(slaSettings.medium.toString());
  const [lowPriority, setLowPriority] = useState(slaSettings.low.toString());

  const handleReset = () => {
    setHighPriority(DEFAULT_SLA.high.toString());
    setMediumPriority(DEFAULT_SLA.medium.toString());
    setLowPriority(DEFAULT_SLA.low.toString());
    
    updateSLASettings(DEFAULT_SLA);
    
    toast.success('🔄 รีเซ็ตค่า SLA สำเร็จ', {
      description: `กลับไปใช้ค่าเริ่มต้น: ด่วน ${DEFAULT_SLA.high} ชม., ปานกลาง ${DEFAULT_SLA.medium} ชม., ต่ำ ${DEFAULT_SLA.low} ชม.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSettings = {
      high: parseInt(highPriority),
      medium: parseInt(mediumPriority),
      low: parseInt(lowPriority),
    };

    // Validation
    if (newSettings.high <= 0 || newSettings.medium <= 0 || newSettings.low <= 0) {
      toast.error('กรุณากรอกค่าที่มากกว่า 0');
      return;
    }

    if (newSettings.high > newSettings.medium || newSettings.medium > newSettings.low) {
      toast.error('กรุณาตรวจสอบค่า SLA', {
        description: 'งานด่วนควรมีเวลาน้อยกว่างานปานกลางและงานต่ำ',
      });
      return;
    }

    updateSLASettings(newSettings);
    
    toast.success('✅ บันทึกการตั้งค่า SLA สำเร็จ', {
      description: 'ระบบจะใช้ค่า SLA ใหม่ในการตรวจสอบงาน',
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-0 shadow-2xl bg-white/98 backdrop-blur-sm">
        {/* Gradient header bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#002D72] via-[#FFB81C] to-[#002D72]"></div>
        
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
                className="p-3 bg-gradient-to-br from-[#002D72] to-[#0a4a9d] rounded-xl shadow-lg"
              >
                <Clock className="w-6 h-6 text-[#FFB81C]" />
              </motion.div>
              <div>
                <DialogTitle className="text-2xl bg-gradient-to-r from-[#002D72] to-[#0a4a9d] bg-clip-text text-transparent">
                  ตั้งค่า SLA
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Service Level Agreement
                </DialogDescription>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              กำหนดเวลามาตรฐานสำหรับการดำเนินการตามระดับความเร่งด่วน
            </p>
          </motion.div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-5">
            {/* High Priority */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3 p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border-2 border-red-200"
            >
              <Label htmlFor="high-priority" className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-red-500 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold">งานด่วน</span>
                  <p className="text-xs text-gray-600 font-normal">ต้องดำเนินการให้เสร็จภายใน</p>
                </div>
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="high-priority"
                  type="number"
                  min="1"
                  value={highPriority}
                  onChange={(e) => setHighPriority(e.target.value)}
                  required
                  className="border-red-300 focus:ring-red-500 focus:border-red-500"
                />
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">ชั่วโมง</span>
              </div>
            </motion.div>

            {/* Medium Priority */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3 p-4 bg-gradient-to-br from-amber-50 to-white rounded-xl border-2 border-amber-200"
            >
              <Label htmlFor="medium-priority" className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-[#FFB81C] rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold">งานปานกลาง</span>
                  <p className="text-xs text-gray-600 font-normal">ต้องดำเนินการให้เสร็จภายใน</p>
                </div>
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="medium-priority"
                  type="number"
                  min="1"
                  value={mediumPriority}
                  onChange={(e) => setMediumPriority(e.target.value)}
                  required
                  className="border-amber-300 focus:ring-[#FFB81C] focus:border-[#FFB81C]"
                />
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">ชั่วโมง</span>
              </div>
            </motion.div>

            {/* Low Priority */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200"
            >
              <Label htmlFor="low-priority" className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-gray-500 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold">งานต่ำ</span>
                  <p className="text-xs text-gray-600 font-normal">ต้องดำเนินการให้เสร็จภายใน</p>
                </div>
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="low-priority"
                  type="number"
                  min="1"
                  value={lowPriority}
                  onChange={(e) => setLowPriority(e.target.value)}
                  required
                  className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
                />
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">ชั่วโมง</span>
              </div>
            </motion.div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#002D72] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#002D72]">💡 หมายเหตุ:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• งานที่เกินเวลา SLA จะถูกแสดงเป็นสีแดงเพื่อเตือน</li>
                  <li>• งานด่วนควรมีเวลาน้อยกว่างานปานกลางและงานต่ำ</li>
                  <li>• เวลาเริ่มนับตั้งแต่เวลาที่แจ้งซ่อม</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 justify-between pt-6 border-t border-gray-200"
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="hover:bg-orange-50 border-orange-300 text-orange-700 hover:border-orange-400 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              รีเซ็ตค่าเริ่มต้น
            </Button>
            <div className="flex gap-3">
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
                className="bg-gradient-to-r from-[#002D72] to-[#0a4a9d] hover:from-[#0a4a9d] hover:to-[#002D72] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                บันทึกการตั้งค่า
              </Button>
            </div>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
