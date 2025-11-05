import React, { useState } from 'react';
import { X, Wrench, Building, Hash, FileText, Upload, AlertCircle, ChevronDown, Send } from 'lucide-react';
import './Maintenance_Booking.css';

interface MaintenanceBookingProps {
    isOpen: boolean;
    onClose: () => void;
}

const MaintenanceBooking = ({ isOpen, onClose }: MaintenanceBookingProps) => {
    const [formData, setFormData] = useState({
        building: 'หอพักชาย A',
        roomNumber: '301',
        title: '',
        description: '',
        priority: 'ปานกลาง',
        images: [] as File[]
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // Handle form submission
        console.log('Form submitted:', formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="maintenance-booking-overlay" onClick={onClose}>
            <div className="maintenance-booking" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="close-button" onClick={onClose}>
                    <X className="close-icon" />
                </button>

                {/* Dialog Header */}
                <div className="dialog-header">
                    <div className="header-content">
                        <div className="header-icon-container">
                            <Wrench className="header-icon" />
                        </div>
                        <div className="header-text-container">
                            <div className="header-title">
                                <h2 className="header-title-text">แจ้งซ่อมใหม่</h2>
                            </div>
                            <div className="header-subtitle">
                                <p className="header-subtitle-text">กรุณากรอกรายละเอียดการแจ้งซ่อมให้ครบถ้วน</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="form-container">
                    {/* Building and Room Number Row */}
                    <div className="input-group">
                        <div className="input-row">
                            <div className="input-container">
                                <div className="input-label">
                                    <Building className="label-icon" />
                                    <span className="label-text">อาคาร/หอพัก</span>
                                </div>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.building}
                                    onChange={(e) => handleInputChange('building', e.target.value)}
                                />
                            </div>
                            <div className="input-container">
                                <div className="input-label">
                                    <Hash className="label-icon" />
                                    <span className="label-text">หมายเลขห้อง</span>
                                </div>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.roomNumber}
                                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Title Field */}
                    <div className="input-container-full">
                        <div className="input-label">
                            <FileText className="label-icon" />
                            <span className="label-text">หัวข้อ / ปัญหา</span>
                        </div>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="เช่น ท่อน้ำรั่ว, แอร์เสีย, หลอดไฟไม่ติด"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                    </div>

                    {/* Description Field */}
                    <div className="textarea-container">
                        <div className="textarea-label">
                            <span className="textarea-label-text">รายละเอียด</span>
                        </div>
                        <textarea
                            className="textarea-field"
                            placeholder="อธิบายปัญหาโดยละเอียด เช่น อาการที่พบ ความรุนแรง เป็นต้น..."
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="image-upload-container">
                        <div className="upload-label">
                            <Upload className="upload-label-icon" />
                            <span className="upload-label-text">แนบรูปภาพ (ไม่บังคับ)</span>
                        </div>
                        <div className="upload-controls">
                            <button className="upload-button">
                                <Upload className="upload-icon" />
                                <span className="upload-button-text">เลือกรูปภาพ</span>
                            </button>
                            <span className="upload-info">0/5 รูป (สูงสุด 5MB ต่อรูป)</span>
                        </div>
                        <div className="upload-hint">
                            <span className="upload-hint-text">💡 แนบรูปภาพเพื่อให้ช่างเข้าใจปัญหาได้ชัดเจนยิ่งขึ้น</span>
                        </div>
                    </div>

                    {/* Priority Selection */}
                    <div className="priority-container">
                        <div className="priority-label">
                            <AlertCircle className="priority-label-icon" />
                            <span className="priority-label-text">ระดับความเร่งด่วน</span>
                        </div>
                        <div className="priority-select">
                            <div className="priority-content">
                                <div className="priority-badge">
                                    <span className="priority-badge-text">ปานกลาง</span>
                                </div>
                                <div className="priority-description">
                                    <span className="priority-description-text">ควรแก้ไขเร็ว</span>
                                </div>
                            </div>
                            <ChevronDown className="priority-dropdown-icon" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="cancel-button" onClick={onClose}>
                            <span className="cancel-button-text">ยกเลิก</span>
                        </button>
                        <button className="submit-button" onClick={handleSubmit}>
                            <Send className="submit-icon" />
                            <span className="submit-button-text">ส่งคำขอ</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceBooking;
