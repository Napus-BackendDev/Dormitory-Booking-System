'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Wrench, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // Map roles to user emails
  const roleMap: { [key: string]: string } = {
    'user': 'user@dorm.com',
    'technician': 'technician@dorm.com',
    'supervisor': 'supervisor@dorm.com'
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setEmail(roleMap[role] || '');
    setPassword('password');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-8 py-6 flex items-center gap-3">
        <div className="bg-[#DC2626] rounded-lg p-2">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">MFU Maintenance</h1>
          <p className="text-sm text-gray-600">ระบบแจ้งซ่อมบำรุง</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg border border-gray-200">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#DC2626] rounded-lg p-4">
              <Wrench className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              ระบบแจ้งซ่อมหอพัก
            </h2>
            <p className="text-sm text-gray-600">
              มหาวิทยาลัยแม่ฟ้าหลวง
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm text-gray-700">
                เลือกผู้ใช้งาน (สำหรับทดสอบ)
              </Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="!bg-white !border-gray-300 focus:ring-2 focus:ring-red-500 text-gray-700">
                  <SelectValue placeholder="เลือกผู้ใช้งาน..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="user">นักศึกษา/บุคลากร</SelectItem>
                  <SelectItem value="technician">ทีมช่าง</SelectItem>
                  <SelectItem value="supervisor">หัวหน้างาน</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-gray-700">
                ชื่อผู้ใช้
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="กรุณากรอกชื่อผู้ใช้"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700">
                รหัสผ่าน
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="กรุณากรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 font-medium"
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>

          {/* Roles Info Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-5 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">บทบาทในระบบ</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-medium">นักศึกษา/บุคลากร :</span>
                <span>แจ้งซ่อมและติดตามสถานะ</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">ทีมช่าง :</span>
                <span>รับงานและอัปเดตสถานะการซ่อม</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium">หัวหน้างาน :</span>
                <span>บริหารจัดการและดูรายงาน</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};