import React from 'react';
import { User, Mail, Phone, Building, Key, Calendar, CheckCircle, Clock, Star, Wrench } from 'lucide-react';
import './Dashboard_User.css';
import './Profile_User.css';

type PageType = 'dashboard' | 'profile';

interface ProfileProps {
    onNavigate?: (page: PageType) => void;
    currentPage?: PageType;
}

const Profile = ({ onNavigate, currentPage }: ProfileProps) => {
    return (
        <div className="dashboard-container">
            {/* Navbar */}
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
                <div className="profile-management">
                    {/* Header Banner */}
                    <div className="profile-header-banner">
                        <div className="profile-banner-content">
                            <h1 className="profile-banner-title">โปรไฟล์ผู้ใช้</h1>
                            <p className="profile-banner-subtitle">ข้อมูลส่วนตัวและสถิติการใช้งาน 👤</p>
                        </div>
                    </div>

                    {/* Profile Content Container */}
                    <div className="profile-content-container">
                        {/* Personal Information Card */}
                        <div className="profile-info-card">
                            <div className="profile-card-header">
                                <div className="profile-card-title">ข้อมูลส่วนตัว</div>
                                <div className="profile-card-description">รายละเอียดบัญชีผู้ใช้</div>
                            </div>

                            <div className="profile-card-content">
                                {/* User Profile Section */}
                                <div className="profile-user-section-main">
                                    <div className="profile-avatar-large">
                                        <span className="profile-avatar-text">ส</span>
                                    </div>
                                    <div className="profile-user-details">
                                        <h3 className="profile-username">สมชาย ใจดี</h3>
                                        <div className="profile-user-badge">ผู้ใช้ทั่วไป</div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="profile-divider"></div>

                                {/* Information Grid */}
                                <div className="profile-info-grid">
                                    <div className="profile-info-item">
                                        <Mail className="profile-info-icon" />
                                        <div className="profile-info-content">
                                            <p className="profile-info-label">อีเมล</p>
                                            <p className="profile-info-value">user@dorm.com</p>
                                        </div>
                                    </div>

                                    <div className="profile-info-item">
                                        <Phone className="profile-info-icon" />
                                        <div className="profile-info-content">
                                            <p className="profile-info-label">เบอร์โทรศัพท์</p>
                                            <p className="profile-info-value">081-234-5678</p>
                                        </div>
                                    </div>

                                    <div className="profile-info-item">
                                        <Building className="profile-info-icon" />
                                        <div className="profile-info-content">
                                            <p className="profile-info-label">หน่วยงาน</p>
                                            <p className="profile-info-value">คณะวิศวกรรมศาสตร์</p>
                                        </div>
                                    </div>

                                    <div className="profile-info-item">
                                        <User className="profile-info-icon" />
                                        <div className="profile-info-content">
                                            <p className="profile-info-label">บทบาท</p>
                                            <p className="profile-info-value">ผู้ใช้ทั่วไป</p>
                                        </div>
                                    </div>

                                    <div className="profile-info-item">
                                        <Building className="profile-info-icon" />
                                        <div className="profile-info-content">
                                            <p className="profile-info-label">อาคาร/หอพัก</p>
                                            <p className="profile-info-value">หอพักชาย A</p>
                                        </div>
                                    </div>

                                    <div className="profile-info-item">
                                        <Key className="profile-info-icon" />
                                        <div className="profile-info-content">
                                            <p className="profile-info-label">หมายเลขห้อง</p>
                                            <p className="profile-info-value">301</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Card */}
                        <div className="profile-stats-card">
                            <div className="profile-card-header">
                                <div className="profile-card-title">สถิติโดยรวม</div>
                                <div className="profile-card-description">ภาพรวมการใช้งาน</div>
                            </div>

                            <div className="profile-stats-content">
                                <div className="profile-stat-item">
                                    <div className="profile-stat-icon-wrapper">
                                        <Calendar className="profile-stat-icon" />
                                    </div>
                                    <div className="profile-stat-details">
                                        <span className="profile-stat-label">งานที่แจ้ง</span>
                                        <span className="profile-stat-number">2</span>
                                    </div>
                                </div>

                                <div className="profile-stat-item">
                                    <div className="profile-stat-icon-wrapper">
                                        <CheckCircle className="profile-stat-icon profile-stat-icon-green" />
                                    </div>
                                    <div className="profile-stat-details">
                                        <span className="profile-stat-label">เสร็จสิ้น</span>
                                        <span className="profile-stat-number">0</span>
                                    </div>
                                </div>

                                <div className="profile-stat-item">
                                    <div className="profile-stat-icon-wrapper">
                                        <Star className="profile-stat-icon profile-stat-icon-yellow" />
                                    </div>
                                    <div className="profile-stat-details">
                                        <span className="profile-stat-label">คะแนนเฉลี่ย</span>
                                        <span className="profile-stat-number">N/A</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Repair Statistics Card */}
                    <div className="profile-repair-stats-card">
                        <div className="profile-card-header">
                            <div className="profile-card-title">สถิติการแจ้งซ่อม</div>
                            <div className="profile-card-description">รายละเอียดงานที่แจ้ง</div>
                        </div>

                        <div className="profile-repair-stats-grid">
                            <div className="profile-repair-stat-item profile-repair-pending">
                                <p className="profile-repair-stat-label">รอดำเนินการ</p>
                                <p className="profile-repair-stat-number">1</p>
                                <p className="profile-repair-stat-unit">รายการ</p>
                            </div>

                            <div className="profile-repair-stat-item profile-repair-progress">
                                <p className="profile-repair-stat-label">กำลังซ่อม</p>
                                <p className="profile-repair-stat-number">1</p>
                                <p className="profile-repair-stat-unit">รายการ</p>
                            </div>

                            <div className="profile-repair-stat-item profile-repair-completed">
                                <p className="profile-repair-stat-label">เสร็จสิ้น</p>
                                <p className="profile-repair-stat-number">0</p>
                                <p className="profile-repair-stat-unit">รายการ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
