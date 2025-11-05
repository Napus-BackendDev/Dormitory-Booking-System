import { Bell, User, Calendar, CheckCircle, Clock, Zap, Eye, Wrench, Award } from 'lucide-react';
import { useState } from 'react';
import './Dashboard_User.css';
import MaintenanceBooking from './Maintenance_Booking';
import MaintenanceDetail from './Maintenance_Detail';

type PageType = 'dashboard' | 'profile';

interface DashboardProps {
    onNavigate?: (page: PageType) => void;
    currentPage?: PageType;
}

export default function Dashboard({ onNavigate, currentPage }: DashboardProps) {
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [isMaintenanceDetailOpen, setIsMaintenanceDetailOpen] = useState(false);

    const handleNewMaintenanceRequest = () => {
        setIsMaintenanceModalOpen(true);
    };

    const handleViewDetails = () => {
        setIsMaintenanceDetailOpen(true);
    };

    return (
        <div className="dashboard-container">
            {/* Header/Navbar */}
            <div className="navbar">
                <div className="navbar-content">
                    <div className="navbar-left">
                        <div className="logo-container">
                            <div className="logo-icon">
                                <Wrench className="logo-wrench" />
                            </div>
                        </div>
                        <div className="brand-text">
                            <h2 className="brand-title">MFU Maintenance</h2>
                            <p className="brand-subtitle">ระบบแจ้งซ่อมบำรุง</p>
                        </div>
                    </div>

                    <div className="navbar-right">
                        <button
                            className={`btn-dashboard ${currentPage === 'dashboard' ? 'active' : ''}`}
                            onClick={() => onNavigate?.('dashboard')}
                        >
                            แดชบอร์ด
                        </button>
                        <button
                            className={`btn-profile ${currentPage === 'profile' ? 'active' : ''}`}
                            onClick={() => onNavigate?.('profile')}
                        >
                            โปรไฟล์
                        </button>

                        <div className="user-section">
                            <div className="user-avatar-container">
                                <div className="user-avatar">
                                    <span className="user-initial">ส</span>
                                </div>
                            </div>
                            <div className="user-info">
                                <p className="user-name">สมชาย ใจดี</p>
                                <p className="user-role">
                                    <User className="user-icon" />
                                    ผู้ใช้ทั่วไป
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Welcome Banner */}
                <div className="welcome-banner">
                    <div className="welcome-text">
                        <h1 className="welcome-title">แดชบอร์ดผู้ใช้</h1>
                        <p className="welcome-greeting">สวัสดี, สุรพัฒน์ ฟิต 👋</p>
                    </div>
                    <button className="btn-add" onClick={handleNewMaintenanceRequest}>+ แจ้งซ่อมใหม่</button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    {/* Card 1 - รอดำเนินการ */}
                    <div className="stat-card stat-card-orange">
                        <div className="stat-card-content">
                            <div className="stat-header">
                                <div className="stat-title-section">
                                    <span className="stat-label">รอดำเนินการ</span>
                                </div>
                                <div className="stat-icon-container stat-icon-container-orange">
                                    <Clock className="stat-icon stat-icon-orange" />
                                </div>
                            </div>

                            <div className="stat-content">
                                <div className="stat-number-section">
                                    <span className="stat-number">1</span>
                                </div>
                                <p className="stat-description">คำขอที่รอการจัดการ</p>
                                <div className="stat-progress-container">
                                    <div className="stat-progress stat-progress-orange"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - กำลังซ่อม */}
                    <div className="stat-card stat-card-blue">
                        <div className="stat-card-content">
                            <div className="stat-header">
                                <div className="stat-title-section">
                                    <span className="stat-label">กำลังซ่อม</span>
                                </div>
                                <div className="stat-icon-container stat-icon-container-blue">
                                    <Zap className="stat-icon stat-icon-blue" />
                                </div>
                            </div>

                            <div className="stat-content">
                                <div className="stat-number-section">
                                    <span className="stat-number">1</span>
                                </div>
                                <p className="stat-description">กำลังดำเนินการ</p>
                                <div className="stat-progress-container">
                                    <div className="stat-progress stat-progress-blue"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - เสร็จสิ้น */}
                    <div className="stat-card stat-card-green">
                        <div className="stat-card-content">
                            <div className="stat-header">
                                <div className="stat-title-section">
                                    <span className="stat-label">เสร็จสิ้น</span>
                                </div>
                                <div className="stat-icon-container stat-icon-container-green">
                                    <Award className="stat-icon stat-icon-green" />
                                </div>
                            </div>

                            <div className="stat-content">
                                <div className="stat-number-section">
                                    <span className="stat-number">0</span>
                                </div>
                                {/* แก้ส่วนนี้ให้ description และ percentage อยู่บรรทัดเดียวกัน */}
                                <div className="stat-description-section">
                                    <span className="stat-description">งานที่เสร็จแล้ว</span>
                                    <span className="stat-percentage">↑ 12%</span>
                                </div>
                                <div className="stat-progress-container">
                                    <div className="stat-progress stat-progress-green"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Requests */}
                <div className="requests-container">
                    <div className="requests-header">
                        <div className="requests-header-content">
                            <div className="requests-icon-container">
                                <Calendar className="requests-icon" />
                            </div>
                            <div className="requests-text-container">
                                <h2 className="requests-title">คำขอซ่อมล่าสุด</h2>
                                <span className="requests-subtitle">รายการแจ้งซ่อมทั้งหมดของคุณ</span>
                            </div>
                        </div>
                    </div>

                    <div className="requests-list">
                        {/* First Request */}
                        <div className="request-card request-card-orange">
                            <div className="request-content">
                                <h3 className="request-title">ห้องคู่</h3>
                                <p className="request-description">
                                    คำร้องขอห้องพักในหอพักชายแกนกลางราชการ
                                </p>
                                <div className="request-tags">
                                    <span className="tag tag-orange">รออนุมัติ</span>
                                    <span className="tag tag-gray">อาคาร</span>
                                    <span className="tag tag-gray">กดข้างล A - 301</span>
                                </div>
                            </div>
                            <button className="btn-view-details" onClick={handleViewDetails}>
                                <Eye className="btn-icon" />
                                ดูรายละเอียด
                            </button>
                        </div>

                        {/* Second Request */}
                        <div className="request-card request-card-blue">
                            <div className="request-content">
                                <h3 className="request-title">ห้องสี่</h3>
                                <p className="request-description">
                                    ห้องพักโดยมีผู้ดูแลห้องพัก
                                </p>
                                <div className="request-tags">
                                    <span className="tag tag-blue">ที่ได้รับ</span>
                                    <span className="tag tag-gray">อนุมัติ</span>
                                    <span className="tag tag-gray">กดข้างล A - 301</span>
                                </div>
                                <p className="request-note">อันดับของคือ: สิทธิ์ 6 ห้องใหญ่</p>
                            </div>
                            <button className="btn-view-details" onClick={handleViewDetails}>
                                <Eye className="btn-icon" />
                                ดูรายละเอียด
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maintenance Booking Modal */}
            <MaintenanceBooking
                isOpen={isMaintenanceModalOpen}
                onClose={() => setIsMaintenanceModalOpen(false)}
            />

            {/* Maintenance Detail Modal */}
            <MaintenanceDetail
                isOpen={isMaintenanceDetailOpen}
                onClose={() => setIsMaintenanceDetailOpen(false)}
            />
        </div>
    );
}