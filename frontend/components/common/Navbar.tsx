import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Wrench, User, LogOut, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleText = (role: string) => {
    switch (role) {
      case 'user':
        return 'ผู้ใช้ทั่วไป';
      case 'technician':
        return 'ทีมช่าง';
      case 'supervisor':
        return 'หัวหน้างาน';
      case 'admin':
        return 'ผู้ดูแลระบบ';
      default:
        return role;
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'แดชบอร์ด', roles: ['user', 'technician', 'supervisor', 'admin'] },
      { id: 'reports', label: 'รายงานและสถิติ', roles: ['supervisor', 'technician', 'admin'] },
      { id: 'profile', label: 'โปรไฟล์', roles: ['user', 'technician', 'supervisor', 'admin'] },
    ];

    return baseItems.filter(item => item.roles.includes(user.role));
  };

  return (
    <nav className="bg-white/95 border-b border-gray-200 sticky top-0 z-50 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo and Title */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              {/* Animated glow */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-[#DC2626] to-[#EF4444] rounded-lg blur"
              ></motion.div>
              
              <div className="relative bg-gradient-to-br from-[#DC2626] to-[#EF4444] p-2 rounded-lg shadow-xl">
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Wrench className="w-5 h-5 text-[#FCD34D]" />
                </motion.div>
              </div>
            </div>
            <div>
              <h2 className="text-sm bg-gradient-to-r from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">
                MFU Maintenance
              </h2>
              <p className="text-xs text-gray-500">ระบบแจ้งซ่อมบำรุง</p>
            </div>
          </motion.div>

          {/* Enhanced Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {getNavItems().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => onNavigate(item.id)}
                  className={`relative transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white shadow-lg'
                      : 'hover:bg-[#DC2626]/5'
                  }`}
                >
                  {currentPage === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#DC2626] to-[#EF4444] rounded-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="gap-2 hover:bg-[#DC2626]/5 transition-all duration-200">
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-br from-[#DC2626] to-[#EF4444] rounded-full blur-sm"
                    ></motion.div>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-[#DC2626] to-[#EF4444] rounded-full flex items-center justify-center shadow-lg ring-2 ring-[#FCD34D]/30">
                      <span className="text-sm text-[#FCD34D]">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FCD34D]" />
                      {getRoleText(user.role)}
                    </p>
                  </div>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#DC2626] to-[#EF4444] rounded-full flex items-center justify-center">
                    <span className="text-[#FCD34D]">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>โปรไฟล์</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>ออกจากระบบ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
