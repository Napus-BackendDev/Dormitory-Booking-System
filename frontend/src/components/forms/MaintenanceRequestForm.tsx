import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Wrench, AlertCircle, Zap, Send, Building, Hash, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { RequestPriority } from '../../contexts/MaintenanceContext';

interface MaintenanceRequestFormProps {
  open: boolean;
  onClose: () => void;
}

export const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({
  open,
  onClose,
}) => {
  const { user } = useAuth();
  const { addRequest } = useMaintenance();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dormBuilding, setDormBuilding] = useState(user?.dormBuilding || '');
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || '');
  const [priority, setPriority] = useState<RequestPriority>('medium');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limit to 5 images
    if (images.length + files.length > 5) {
      toast.error('สามารถอัพโหลดรูปภาพได้สูงสุด 5 รูป');
      return;
    }

    // Convert files to base64
    Array.from(files).forEach(file => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    addRequest({
      userId: user.id,
      userName: user.name,
      dormBuilding,
      roomNumber,
      title,
      description,
      priority,
      images: images.length > 0 ? images : undefined,
    });

    toast.success('แจ้งซ่อมสำเร็จ! 🎉', {
      description: 'ทีมงานจะดำเนินการตรวจสอบโดยเร็วที่สุด',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setImages([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-0 shadow-2xl bg-white backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        {/* Gradient header bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C91A1A] via-[#E44646] to-[#C91A1A]"></div>
        
        <DialogHeader className="pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-3 bg-gradient-to-br from-[#C91A1A] to-[#E44646] rounded-xl shadow-lg"
            >
              <Wrench className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-[#C91A1A] to-[#E44646] bg-clip-text text-transparent">
                แจ้งซ่อมใหม่
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                กรุณากรอกรายละเอียดการแจ้งซ่อมให้ครบถ้วน
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Location Information */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="dormBuilding" className="flex items-center gap-2 text-gray-700">
                <Building className="w-4 h-4 text-[#C91A1A]" />
                อาคาร/หอพัก
              </Label>
              <Input
                id="dormBuilding"
                value={dormBuilding}
                onChange={(e) => setDormBuilding(e.target.value)}
                required
                placeholder="เช่น หอพักชาย A"
                className="bg-transparent border-gray-300 focus:ring-[#C91A1A] focus:border-[#C91A1A] transition-all duration-200"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="roomNumber" className="flex items-center gap-2 text-gray-700">
                <Hash className="w-4 h-4 text-[#C91A1A]" />
                หมายเลขห้อง
              </Label>
              <Input
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                placeholder="เช่น 301"
                className="bg-transparent border-gray-300 focus:ring-[#C91A1A] focus:border-[#C91A1A] transition-all duration-200"
              />
            </motion.div>
          </div>

          {/* Problem Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="title" className="flex items-center gap-2 text-gray-700">
              <AlertCircle className="w-4 h-4 text-[#C91A1A]" />
              หัวข้อ / ปัญหา
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="เช่น ท่อน้ำรั่ว, แอร์เสีย, หลอดไฟไม่ติด"
              className="bg-transparent border-gray-300 focus:ring-[#C91A1A] focus:border-[#C91A1A] transition-all duration-200"
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor="description" className="text-gray-700">
              รายละเอียด
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="อธิบายปัญหาโดยละเอียด เช่น อาการที่พบ ความรุนแรง เป็นต้น..."
              rows={4}
              className="bg-transparent border-gray-300 focus:ring-[#C91A1A] focus:border-[#C91A1A] transition-all duration-200 resize-none"
            />
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="space-y-3"
          >
            <Label className="flex items-center gap-2 text-gray-700">
              <Image className="w-4 h-4 text-[#C91A1A]" />
              แนบรูปภาพ (ไม่บังคับ)
            </Label>
            
            <div className="space-y-3">
              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={images.length >= 5}
                  className="bg-transparent border-2 border-dashed border-gray-300 hover:border-[#C91A1A] hover:bg-[#C91A1A]/5 transition-all duration-200"
                >
                  <Image className="w-4 h-4 mr-2" />
                  เลือกรูปภาพ
                </Button>
                <span className="text-xs text-gray-500">
                  {images.length}/5 รูป (สูงสุด 5MB ต่อรูป)
                </span>
              </div>

              {/* Image Preview Grid */}
              <AnimatePresence>
                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-5 gap-3"
                  >
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group aspect-square"
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-xs text-gray-500">
              💡 แนบรูปภาพเพื่อให้ช่างเข้าใจปัญหาได้ชัดเจนยิ่งขึ้น
            </p>
          </motion.div>

          {/* Priority */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="priority" className="flex items-center gap-2 text-gray-700">
              <Zap className="w-4 h-4 text-[#FFB81C]" />
              ระดับความเร่งด่วน
            </Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as RequestPriority)}>
              <SelectTrigger className="bg-transparent border-gray-300 focus:ring-[#C91A1A] focus:border-[#C91A1A]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">ต่ำ</Badge>
                    <span>ไม่เร่งด่วน</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">ปานกลาง</Badge>
                    <span>ควรแก้ไขเร็ว</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs">สูง</Badge>
                    <span>เร่งด่วนมาก</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
              className="bg-gradient-to-r from-[#C91A1A] to-[#E44646] hover:from-[#E44646] hover:to-[#C91A1A] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              ส่งคำขอ
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
