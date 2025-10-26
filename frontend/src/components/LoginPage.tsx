import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Wrench, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002D72] via-[#0a4a9d] to-[#002D72] p-4 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      {/* Floating orbs with animation */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-64 h-64 bg-[#FFB81C] rounded-full blur-3xl"
      ></motion.div>
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-[#FFB81C] rounded-full blur-3xl"
      ></motion.div>
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#FFB81C] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      ></motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-2xl border-0 relative z-10 backdrop-blur-sm bg-white">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="relative">
                {/* Animated glow effect */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-[#002D72] to-[#0a4a9d] rounded-2xl blur-xl"
                ></motion.div>
                
                <div className="relative bg-gradient-to-br from-[#002D72] to-[#0a4a9d] p-5 rounded-2xl shadow-2xl">
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Wrench className="w-12 h-12 text-[#FFB81C]" />
                  </motion.div>
                  
                  {/* Sparkle effect */}
                  <motion.div
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-[#FFB81C]" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-3xl bg-gradient-to-r from-[#002D72] via-[#0a4a9d] to-[#002D72] bg-clip-text text-transparent">
                MFU Dorm Maintenance
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                ระบบแจ้งซ่อมบำรุงหอพัก<br/>มหาวิทยาลัยแม่ฟ้าหลวง
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@dorm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#002D72]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#002D72]"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#002D72] to-[#0a4a9d] hover:from-[#0a4a9d] hover:to-[#002D72] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 text-base py-6" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⚙️
                    </motion.div>
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFB81C]" />
                ทดสอบระบบด้วยบัญชี
                <Sparkles className="w-4 h-4 text-[#FFB81C]" />
              </p>
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-[#002D72] hover:text-white hover:border-[#002D72] transition-all duration-200 group shadow-sm hover:shadow-md"
                    onClick={() => quickLogin('user@dorm.com')}
                    type="button"
                  >
                    <span className="mr-3 text-lg">👤</span>
                    <div className="text-left flex-1">
                      <div className="text-sm">ผู้ใช้ทั่วไป (นักศึกษา)</div>
                      <div className="text-xs text-gray-500 group-hover:text-[#FFB81C] transition-colors">user@dorm.com</div>
                    </div>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-[#002D72] hover:text-white hover:border-[#002D72] transition-all duration-200 group shadow-sm hover:shadow-md"
                    onClick={() => quickLogin('technician@dorm.com')}
                    type="button"
                  >
                    <span className="mr-3 text-lg">🔧</span>
                    <div className="text-left flex-1">
                      <div className="text-sm">ทีมช่าง / เจ้าหน้าที่ซ่อม</div>
                      <div className="text-xs text-gray-500 group-hover:text-[#FFB81C] transition-colors">technician@dorm.com</div>
                    </div>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-[#002D72] hover:text-white hover:border-[#002D72] transition-all duration-200 group shadow-sm hover:shadow-md"
                    onClick={() => quickLogin('supervisor@dorm.com')}
                    type="button"
                  >
                    <span className="mr-3 text-lg">👔</span>
                    <div className="text-left flex-1">
                      <div className="text-sm">หัวหน้างาน / แอดมิน</div>
                      <div className="text-xs text-gray-500 group-hover:text-[#FFB81C] transition-colors">supervisor@dorm.com</div>
                    </div>
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
