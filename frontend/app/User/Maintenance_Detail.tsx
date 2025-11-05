import { X, AlertTriangle, Camera, MapPin, User, Calendar, Clock } from 'lucide-react';
import './Maintenance_Detail.css';

interface MaintenanceDetailProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MaintenanceDetail({ isOpen, onClose }: MaintenanceDetailProps) {
    if (!isOpen) return null;

    return (
        <div className="maintenance-detail-overlay">
            <div className="maintenance-detail-dialog">
                {/* Close Button */}
                <button className="close-button" onClick={onClose}>
                    <X className="close-icon" />
                </button>

                {/* Dialog Header */}
                <div className="dialog-header">
                    <div className="header-container">
                        <h2 className="detail-title">รายละเอียดคำขอซ่อม</h2>

                        <div className="request-details-dialog">
                            <div className="request-header-container">
                                <h3 className="request-heading">หกฟกฟกฟห</h3>
                                <div className="status-badge">
                                    <AlertTriangle className="status-icon" />
                                    <span className="status-text">รอดำเนินการ</span>
                                </div>
                            </div>

                            <div className="priority-container-detail">
                                <span className="priority-label-detail">ความเร่งด่วน:</span>
                                <div className="priority-badge-detail">
                                    <span className="priority-text">ปานกลาง</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dialog Content */}
                <div className="dialog-content">
                    {/* Problem Details */}
                    <div className="problem-details-container">
                        <div className="problem-header">
                            <AlertTriangle className="problem-icon" />
                            <span className="problem-label">รายละเอียดปัญหา</span>
                        </div>
                        <div className="problem-description">
                            <span className="problem-text">กฟหกฟหฟกห</span>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="image-section">
                        <div className="image-header">
                            <Camera className="image-icon" />
                            <span className="image-label">รูปภาพประกอบ (1 รูป)</span>
                        </div>
                        <div className="image-container">
                            <div className="maintenance-image">
                                {/* Empty placeholder for now to avoid image errors */}
                            </div>
                        </div>
                    </div>

                    {/* Info Cards Grid */}
                    <div className="info-cards-container">
                        {/* Location Card */}
                        <div className="info-card location-card">
                            <div className="card-content">
                                <div className="card-icon-container location-icon-container">
                                    <MapPin className="card-icon" />
                                </div>
                                <div className="card-text-container">
                                    <span className="card-label">สถานที่</span>
                                    <span className="card-value">หอพักชาย A</span>
                                    <span className="card-detail">ห้อง 301</span>
                                </div>
                            </div>
                        </div>

                        {/* Reporter Card */}
                        <div className="info-card reporter-card">
                            <div className="card-content">
                                <div className="card-icon-container reporter-icon-container">
                                    <User className="card-icon" />
                                </div>
                                <div className="card-text-container">
                                    <span className="card-label">ผู้แจ้ง</span>
                                    <span className="card-value">สมชาย ใจดี</span>
                                </div>
                            </div>
                        </div>

                        {/* Date Card */}
                        <div className="info-card date-card">
                            <div className="card-content">
                                <div className="card-icon-container date-icon-container">
                                    <Calendar className="card-icon" />
                                </div>
                                <div className="card-text-container">
                                    <span className="card-label">วันที่แจ้ง</span>
                                    <span className="card-value">23 ตุลาคม 2568</span>
                                    <span className="card-detail">00:57 น.</span>
                                </div>
                            </div>
                        </div>

                        {/* Last Update Card */}
                        <div className="info-card update-card">
                            <div className="card-content">
                                <div className="card-icon-container update-icon-container">
                                    <Clock className="card-icon" />
                                </div>
                                <div className="card-text-container">
                                    <span className="card-label">อัปเดตล่าสุด</span>
                                    <span className="card-value">23 ตุลาคม 2568</span>
                                    <span className="card-detail">00:57 น.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
