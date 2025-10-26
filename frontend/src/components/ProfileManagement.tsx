import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ClipboardList,
  CheckCircle,
  Star,
  Home,
} from 'lucide-react';

export const ProfileManagement: React.FC = () => {
  const { user } = useAuth();
  const { requests } = useMaintenance();

  if (!user) return null;

  // Calculate user statistics
  const userRequests = requests.filter(req => req.userId === user.id);
  const completedRequests = userRequests.filter(req => req.status === 'completed');
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const inProgressRequests = userRequests.filter(req => req.status === 'in_progress');

  // Calculate average rating
  const requestsWithRating = completedRequests.filter(req => req.rating);
  const averageRating =
    requestsWithRating.length > 0
      ? (
          requestsWithRating.reduce((sum, req) => sum + (req.rating || 0), 0) /
          requestsWithRating.length
        ).toFixed(1)
      : 'N/A';

  // For technicians, show assigned tasks
  const assignedRequests = requests.filter(req => req.assignedTo === user.id);
  const completedAssigned = assignedRequests.filter(req => req.status === 'completed');

  const getRoleText = (role: string) => {
    switch (role) {
      case 'user':
        return 'ผู้ใช้ทั่วไป';
      case 'technician':
        return 'ทีมช่าง / เจ้าหน้าที่ซ่อม';
      case 'supervisor':
        return 'หัวหน้างาน / แอดมิน';
      default:
        return role;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'user':
        return <Badge className="bg-red-50 text-[#C91A1A] hover:bg-red-100 border-0">ผู้ใช้ทั่วไป</Badge>;
      case 'technician':
        return <Badge className="bg-[#C91A1A] text-white hover:bg-[#E44646] border-0">ทีมช่าง</Badge>;
      case 'supervisor':
        return <Badge className="bg-[#E44646] text-white hover:bg-[#C91A1A] border-0">หัวหน้างาน</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#C91A1A] via-[#E44646] to-[#C91A1A] p-8 shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        <div className="relative text-white">
          <h1 className="text-white mb-2">โปรไฟล์ผู้ใช้</h1>
          <p className="text-[#FFB81C] text-lg">ข้อมูลส่วนตัวและสถิติการใช้งาน 👤</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="md:col-span-2 border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-[#C91A1A]">ข้อมูลส่วนตัว</CardTitle>
            <CardDescription>รายละเอียดบัญชีผู้ใช้</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C91A1A] to-[#E44646] rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#E44646]/20">
                <span className="text-3xl font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                {getRoleBadge(user.role)}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">อีเมล</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.department && (
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">หน่วยงาน</p>
                    <p className="text-sm">{user.department}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">บทบาท</p>
                  <p className="text-sm">{getRoleText(user.role)}</p>
                </div>
              </div>

              {user.dormBuilding && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">อาคาร/หอพัก</p>
                    <p className="text-sm">{user.dormBuilding}</p>
                  </div>
                </div>
              )}

              {user.roomNumber && (
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">หมายเลขห้อง</p>
                    <p className="text-sm">{user.roomNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-[#C91A1A]">สถิติโดยรวม</CardTitle>
            <CardDescription>ภาพรวมการใช้งาน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.role === 'user' && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">งานที่แจ้ง</span>
                  </div>
                  <span className="text-lg">{userRequests.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">เสร็จสิ้น</span>
                  </div>
                  <span className="text-lg">{completedRequests.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">คะแนนเฉลี่ย</span>
                  </div>
                  <span className="text-lg">{averageRating}</span>
                </div>
              </>
            )}

            {user.role === 'technician' && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">งานที่รับ</span>
                  </div>
                  <span className="text-lg">{assignedRequests.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">เสร็จสิ้น</span>
                  </div>
                  <span className="text-lg">{completedAssigned.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">อัตราสำเร็จ</span>
                  </div>
                  <span className="text-lg">
                    {assignedRequests.length > 0
                      ? Math.round((completedAssigned.length / assignedRequests.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </>
            )}

            {user.role === 'supervisor' && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">งานทั้งหมด</span>
                  </div>
                  <span className="text-lg">{requests.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">เสร็จสิ้น</span>
                  </div>
                  <span className="text-lg">
                    {requests.filter(req => req.status === 'completed').length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">อัตราสำเร็จ</span>
                  </div>
                  <span className="text-lg">
                    {requests.length > 0
                      ? Math.round(
                          (requests.filter(req => req.status === 'completed').length /
                            requests.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User-specific Statistics */}
      {user.role === 'user' && userRequests.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-[#C91A1A]">สถิติการแจ้งซ่อม</CardTitle>
            <CardDescription>รายละเอียดงานที่แจ้ง</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">รอดำเนินการ</p>
                <p className="text-2xl">{pendingRequests.length}</p>
                <p className="text-xs text-gray-500 mt-1">รายการ</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">กำลังซ่อม</p>
                <p className="text-2xl">{inProgressRequests.length}</p>
                <p className="text-xs text-gray-500 mt-1">รายการ</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">เสร็จสิ้น</p>
                <p className="text-2xl">{completedRequests.length}</p>
                <p className="text-xs text-gray-500 mt-1">รายการ</p>
              </div>
            </div>

            {requestsWithRating.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="text-sm mb-4">การให้คะแนนของคุณ</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">{averageRating}</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= parseFloat(averageRating.toString())
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      จาก {requestsWithRating.length} การให้คะแนน
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technician-specific Statistics */}
      {user.role === 'technician' && assignedRequests.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-[#C91A1A]">สถิติการทำงาน</CardTitle>
            <CardDescription>รายละเอียดงานที่รับผิดชอบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">กำลังดำเนินการ</p>
                <p className="text-2xl">
                  {assignedRequests.filter(req => req.status === 'in_progress').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">รายการ</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">เสร็จสิ้นแล้ว</p>
                <p className="text-2xl">{completedAssigned.length}</p>
                <p className="text-xs text-gray-500 mt-1">รายการ</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">อัตราความสำเร็จ</p>
                <p className="text-2xl">
                  {assignedRequests.length > 0
                    ? Math.round((completedAssigned.length / assignedRequests.length) * 100)
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-500 mt-1">ของงานทั้งหมด</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
