# Components Structure

โครงสร้างโฟลเดอร์ components ที่จัดระเบียบและเข้าใจง่าย

## 📁 โครงสร้าง

```
components/
├── auth/                    # 🔐 Authentication Components
│   ├── LoginPage.tsx       # หน้า Login
│   └── index.ts            # Exports
│
├── common/                  # 🔄 Shared/Common Components
│   ├── AnimatedCounter.tsx # ตัวนับแบบ Animated
│   ├── Navbar.tsx          # Navigation Bar
│   ├── StatCard.tsx        # Card แสดงสถิติ
│   └── TicketTimeline.tsx  # Timeline ของ Ticket
│
├── dashboards/              # 📊 Dashboard Pages
│   ├── UserDashboard.tsx         # Dashboard สำหรับ User/Student
│   ├── TechnicianDashboard.tsx   # Dashboard สำหรับ Technician
│   ├── SupervisorDashboard.tsx   # Dashboard สำหรับ Supervisor
│   └── AdminDashboard.tsx        # Dashboard สำหรับ Admin
│
├── features/                # ✨ Feature-Specific Components
│   ├── maintenance/         # 🔧 Maintenance Feature
│   │   ├── MaintenanceRequestForm.tsx
│   │   ├── RequestDetailsDialog.tsx
│   │   ├── RatingDialog.tsx
│   │   ├── SLAConfigDialog.tsx
│   │   └── TechnicianDetailDialog.tsx
│   │
│   ├── profile/            # 👤 Profile Feature
│   │   └── ProfileManagement.tsx
│   │
│   └── reports/            # 📈 Reports Feature
│       └── ReportsAnalytics.tsx
│
└── ui/                      # 🎨 UI Components (shadcn/ui)
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── dialog.tsx
    └── ... (other UI components)
```

## 📝 การใช้งาน

### Import แบบ Absolute Path
ใช้ `@/` alias สำหรับ import components:

```tsx
// ✅ ถูกต้อง
import { LoginPage } from '@/components/auth/LoginPage';
import { Navbar } from '@/components/common/Navbar';
import { UserDashboard } from '@/components/dashboards/UserDashboard';
import { MaintenanceRequestForm } from '@/components/features/maintenance/MaintenanceRequestForm';
import { Button } from '@/components/ui/button';

// ❌ ไม่แนะนำ (Relative Path)
import { LoginPage } from '../auth/LoginPage';
import { Navbar } from './Navbar';
```

## 🎯 หลักการจัดโครงสร้าง

1. **auth/** - Components เกี่ยวกับ Authentication (Login, Register, etc.)
2. **common/** - Components ที่ใช้ร่วมกันทั่วทั้ง App
3. **dashboards/** - หน้า Dashboard แต่ละ Role
4. **features/** - Components แยกตาม Feature เฉพาะ
5. **ui/** - UI Components พื้นฐาน (shadcn/ui)

## 💡 Tips

- ใช้ Absolute Path (`@/`) แทน Relative Path เสมอ
- Component ที่เกี่ยวข้องกันให้จัดไว้ใน Feature เดียวกัน
- Common components ควรเป็น Reusable และไม่ควร depend on specific features
