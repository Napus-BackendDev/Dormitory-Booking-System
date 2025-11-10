import React, { useMemo } from 'react';
import { useMaintenance } from '../../../contexts/MaintenanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  BarChart3,
  Download,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  PieChart as PieChartIcon,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

export const ReportsAnalytics: React.FC = () => {
  const { requests } = useMaintenance();

  // Get today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get this week's date range
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  // Daily statistics
  const todayRequests = requests.filter(
    req => new Date(req.createdAt) >= today && new Date(req.createdAt) < tomorrow
  );
  const todayCompleted = requests.filter(
    req =>
      req.completedAt &&
      new Date(req.completedAt) >= today &&
      new Date(req.completedAt) < tomorrow
  );
  const todayPending = requests.filter(
    req =>
      req.status !== 'completed' &&
      new Date(req.createdAt) < tomorrow
  );

  // Weekly statistics
  const weekRequests = requests.filter(
    req => new Date(req.createdAt) >= startOfWeek && new Date(req.createdAt) < endOfWeek
  );
  const weekCompleted = requests.filter(
    req =>
      req.completedAt &&
      new Date(req.completedAt) >= startOfWeek &&
      new Date(req.completedAt) < endOfWeek
  );
  const weekCompletionRate =
    weekRequests.length > 0
      ? Math.round((weekCompleted.length / weekRequests.length) * 100)
      : 0;

  // Average rating
  const completedWithRating = requests.filter(req => req.rating);
  const averageRating =
    completedWithRating.length > 0
      ? (
          completedWithRating.reduce((sum, req) => sum + (req.rating || 0), 0) /
          completedWithRating.length
        ).toFixed(1)
      : 0;

  // By priority breakdown
  const highPriorityCount = requests.filter(req => req.priority === 'high').length;
  const mediumPriorityCount = requests.filter(req => req.priority === 'medium').length;
  const lowPriorityCount = requests.filter(req => req.priority === 'low').length;

  // By status breakdown
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const inProgressCount = requests.filter(req => req.status === 'in_progress').length;
  const completedCount = requests.filter(req => req.status === 'completed').length;

  // Chart data
  const dailyChartData = [
    { name: 'งานใหม่', value: todayRequests.length, fill: '#DC2626' },
    { name: 'งานเสร็จ', value: todayCompleted.length, fill: '#10b981' },
    { name: 'งานค้าง', value: todayPending.length, fill: '#f59e0b' },
  ];

  const statusChartData = [
    { name: 'รอดำเนินการ', value: pendingCount, fill: '#f59e0b' },
    { name: 'กำลังซ่อม', value: inProgressCount, fill: '#DC2626' },
    { name: 'เสร็จสิ้น', value: completedCount, fill: '#10b981' },
  ];

  const priorityChartData = [
    { name: 'ด่วน', value: highPriorityCount, fill: '#ef4444' },
    { name: 'ปานกลาง', value: mediumPriorityCount, fill: '#FFB81C' },
    { name: 'ต่ำ', value: lowPriorityCount, fill: '#6b7280' },
  ];

  // 7-day trend data
  const trendData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRequests = requests.filter(
        req => new Date(req.createdAt) >= date && new Date(req.createdAt) < nextDate
      );
      const dayCompleted = requests.filter(
        req =>
          req.completedAt &&
          new Date(req.completedAt) >= date &&
          new Date(req.completedAt) < nextDate
      );

      data.push({
        date: date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
        งานใหม่: dayRequests.length,
        งานเสร็จ: dayCompleted.length,
      });
    }
    return data;
  }, [requests, today]);

  // Completion rate trend (last 7 days)
  const completionRateData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRequests = requests.filter(
        req => new Date(req.createdAt) >= date && new Date(req.createdAt) < nextDate
      );
      const dayCompleted = requests.filter(
        req =>
          req.completedAt &&
          new Date(req.completedAt) >= date &&
          new Date(req.completedAt) < nextDate
      );

      const rate = dayRequests.length > 0 ? Math.round((dayCompleted.length / dayRequests.length) * 100) : 0;

      data.push({
        date: date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
        'อัตราสำเร็จ': rate,
      });
    }
    return data;
  }, [requests, today]);

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        total: requests.length,
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        averageRating: averageRating,
      },
      daily: {
        new: todayRequests.length,
        completed: todayCompleted.length,
        pending: todayPending.length,
      },
      weekly: {
        new: weekRequests.length,
        completed: weekCompleted.length,
        completionRate: weekCompletionRate,
      },
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maintenance-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header with gradient */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#DC2626] p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB81C]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="text-white">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white mb-2 text-3xl"
            >
              รายงานและสถิติ
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#FFB81C] text-xl"
            >
              ภาพรวมการดำเนินงานซ่อมบำรุง 📈
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={handleExportReport}
              className="bg-[#FFB81C] text-[#DC2626] hover:bg-[#ffd166] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลดรายงาน
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Daily Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#DC2626]" />
              <CardTitle className="text-[#DC2626]">สรุปรายวัน</CardTitle>
            </div>
            <CardDescription>
              {today.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200 shadow-md"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-[#DC2626] p-3 rounded-xl shadow-lg">
                      <BarChart3 className="w-6 h-6 text-[#FFB81C]" />
                    </div>
                    <p className="text-xs text-gray-600 text-center">งานใหม่</p>
                    <p className="text-2xl font-bold text-[#DC2626]">{todayRequests.length}</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 shadow-md"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-600 p-3 rounded-xl shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-gray-600 text-center">งานเสร็จ</p>
                    <p className="text-2xl font-bold text-green-700">{todayCompleted.length}</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200 shadow-md"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-gray-600 text-center">งานค้าง</p>
                    <p className="text-2xl font-bold text-orange-700">{todayPending.length}</p>
                  </div>
                </motion.div>
              </div>

              {/* Daily Bar Chart */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#DC2626]" />
                  สถิติรายวัน
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {dailyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 7-Day Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#DC2626]" />
              <CardTitle className="text-[#DC2626]">แนวโน้ม 7 วันย้อนหลัง</CardTitle>
            </div>
            <CardDescription>เปรียบเทียบงานใหม่และงานที่เสร็จสิ้น</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="งานใหม่" 
                  stroke="#DC2626" 
                  strokeWidth={3}
                  dot={{ fill: '#DC2626', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="งานเสร็จ" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Completion Rate Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#DC2626]" />
              <CardTitle className="text-[#DC2626]">อัตราการซ่อมสำเร็จ</CardTitle>
            </div>
            <CardDescription>เปอร์เซ็นต์ความสำเร็จในการซ่อม 7 วันย้อนหลัง</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={completionRateData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB81C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFB81C" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="อัตราสำเร็จ" 
                  stroke="#FFB81C" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRate)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pie Charts - Status and Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#DC2626]" />
                <CardTitle className="text-[#DC2626]">สถานะงานทั้งหมด</CardTitle>
              </div>
              <CardDescription>แบ่งตามสถานะการดำเนินงาน</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3 min-w-[200px]">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">รอดำเนินการ</span>
                    </div>
                    <Badge className="bg-orange-500">{pendingCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="text-sm">กำลังซ่อม</span>
                    </div>
                    <Badge className="bg-red-600">{inProgressCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">เสร็จสิ้น</span>
                    </div>
                    <Badge className="bg-green-500">{completedCount}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#002D72]" />
                <CardTitle className="text-[#002D72]">ระดับความเร่งด่วน</CardTitle>
              </div>
              <CardDescription>แบ่งตามความสำคัญของงาน</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3 min-w-[200px]">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">ด่วน</span>
                    </div>
                    <Badge className="bg-red-500">{highPriorityCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FFB81C] rounded-full"></div>
                      <span className="text-sm">ปานกลาง</span>
                    </div>
                    <Badge className="bg-[#FFB81C] text-gray-900">{mediumPriorityCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm">ต่ำ</span>
                    </div>
                    <Badge className="bg-gray-500">{lowPriorityCount}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Customer Satisfaction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FFB81C]" />
              <CardTitle className="text-[#002D72]">ความพึงพอใจ</CardTitle>
            </div>
            <CardDescription>คะแนนเฉลี่ยจากผู้ใช้บริการ</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 shadow-md">
                <div className="text-5xl font-bold text-[#FFB81C]">{averageRating}</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= parseFloat(averageRating.toString())
                          ? 'text-[#FFB81C] fill-[#FFB81C]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  จาก {completedWithRating.length} รีวิว
                </p>
              </div>

              <div className="flex-1 w-full">
                <p className="text-sm font-semibold text-gray-700 mb-4">การให้คะแนน</p>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = completedWithRating.filter(req => req.rating === rating).length;
                    const percentage =
                      completedWithRating.length > 0
                        ? (count / completedWithRating.length) * 100
                        : 0;

                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-sm font-semibold text-gray-700">{rating}</span>
                          <Star className="w-4 h-4 text-[#FFB81C] fill-[#FFB81C]" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.7 + rating * 0.1 }}
                            className="bg-gradient-to-r from-[#FFB81C] to-amber-400 h-3 rounded-full shadow-sm"
                          ></motion.div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
