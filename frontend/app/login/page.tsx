'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Router will redirect automatically via useEffect
    } catch (err) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      {/* Logo in top-left */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#DC2626] rounded-md flex items-center justify-center shadow-md">
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">MFU Maintenance</p>
          <p className="text-xs text-gray-500">ระบบแจ้งซ่อมบำรุง</p>
        </div>
      </div>

      {/* Main login card */}
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Red wrench icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#DC2626] rounded-xl flex items-center justify-center shadow-md">
              <Wrench className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-xl text-gray-900">
              ระบบแจ้งซ่อมบำรุง
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              มหาวิทยาลัยแม่ฟ้าหลวง
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700">
                อีเมล์
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="กรุณากรอกอีเมล์"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Password field */}
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
                className="w-full"
              />
            </div>

            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5"
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>

          {/* Test accounts info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-semibold text-gray-900 mb-2">🔑 บัญชีทดสอบ</p>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>👤 ผู้ใช้ทั่วไป: <span className="font-mono bg-white px-2 py-0.5 rounded">user@dorm.com</span></p>
              <p>🔧 ทีมช่าง: <span className="font-mono bg-white px-2 py-0.5 rounded">technician@dorm.com</span></p>
              <p>👨‍💼 หัวหน้างาน: <span className="font-mono bg-white px-2 py-0.5 rounded">supervisor@dorm.com</span></p>
              <p>⚙️ ผู้ดูแลระบบ: <span className="font-mono bg-white px-2 py-0.5 rounded">admin@dorm.com</span></p>
              <p className="text-gray-500 mt-2">รหัสผ่าน: อะไรก็ได้</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom left icon (from design) */}
      <div className="absolute bottom-6 left-6">
        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">N</span>
        </div>
      </div>
    </div>
  );
};
