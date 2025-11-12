import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import type { TicketPriority, TicketStatus } from "../../../types/Ticket";
import { useBuildings } from "../../../contexts/BuildingContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { toast } from "sonner";
import { Wrench, AlertCircle, Zap, Send, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { } from "../../../contexts/MaintenanceContext";
import useTicket from "../../../hooks/useTicket";

interface MaintenanceRequestFormProps {
  open: boolean;
  onClose: () => void;
}

export const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const { create } = useTicket();
  const { maintenanceTypes } = useBuildings();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("P2");
  const [photos, setPhotos] = useState<File[]>([]);

  const now = new Date();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    if (photos.length + newFiles.length > 5) {
      toast.error("สามารถอัพโหลดรูปภาพได้สูงสุด 5 รูป");
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
        return false;
      }
      return true;
    });

    setPhotos((prev) => [...prev, ...validFiles]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {

      const res = await create({
        title,
        description,
        status: "ASSIGNED", 
        priority: priority,
        photo: photos,
        // SLA P2 Mockup
        responseDueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        resolveDueAt: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        userId: user.id,
      });

      if (res) {
        toast.success("แจ้งซ่อมสำเร็จ 🎉", {
          description: "ทีมงานจะดำเนินการตรวจสอบโดยเร็วที่สุด",
        });
      }

      // reset form
      setTitle("");
      setDescription("");
      setMaintenanceType("");
      setPriority("P2");
      setPhotos([]);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการส่งคำขอซ่อม");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-0 shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DC2626] via-[#FCD34D] to-[#DC2626]" />
        <DialogHeader className="pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-3 bg-gradient-to-br from-[#DC2626] to-[#EF4444] rounded-xl shadow-lg"
            >
              <Wrench className="w-6 h-6 text-[#FCD34D]" />
            </motion.div>
            <div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">
                แจ้งซ่อมใหม่
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                กรุณากรอกรายละเอียดการแจ้งซ่อมให้ครบถ้วน
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Maintenance Type */}
          <div className="space-y-2">
            <Label htmlFor="maintenanceType" className="text-gray-700 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#DC2626]" />
              ประเภทการซ่อม
            </Label>
            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทการซ่อม" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceTypes
                  .filter((t) => t.status === "active")
                  .map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#DC2626]" />
              หัวข้อ / ปัญหา
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="เช่น ท่อน้ำรั่ว, แอร์เสีย, หลอดไฟไม่ติด"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              รายละเอียด
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="อธิบายปัญหาโดยละเอียด..."
              rows={4}
            />
          </div>

          {/* Upload */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-gray-700">
              <Image className="w-4 h-4 text-[#DC2626]" />
              แนบรูปภาพ (ไม่บังคับ)
            </Label>
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
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={photos.length >= 5}
                className="border-2 border-dashed border-gray-300 hover:border-[#DC2626]"
              >
                <Image className="w-4 h-4 mr-2" />
                เลือกรูปภาพ
              </Button>
              <span className="text-xs text-gray-500">
                {photos.length}/5 รูป (สูงสุด 5MB ต่อรูป)
              </span>
            </div>

            <AnimatePresence>
              {photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-5 gap-3"
                >
                  {photos.map((file, index) => (
                    <motion.div
                      key={index}
                      className="relative group aspect-square"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="flex items-center gap-2 text-gray-700">
              <Zap className="w-4 h-4 text-[#FCD34D]" />
              ระดับความเร่งด่วน
            </Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">ต่ำ - ไม่เร่งด่วน</SelectItem>
                <SelectItem value="medium">ปานกลาง - ควรแก้ไขเร็ว</SelectItem>
                <SelectItem value="high">สูง - เร่งด่วนมาก</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              ส่งคำขอ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
