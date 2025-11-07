# Components Structure

โครงสร้างองค์ประกอบของ Frontend ที่จัดระเบียบเพื่อความเข้าใจง่าย

## 📁 โครงสร้างโฟลเดอร์

```
components/
├── auth/              # 🔐 Authentication Components
│   ├── LoginPage.tsx
│   └── index.ts
│
├── dashboard/         # 📊 Dashboard Components
│   ├── SupervisorDashboard.tsx
│   ├── TechnicianDashboard.tsx
│   ├── UserDashboard.tsx
│   └── index.ts
│
├── dialogs/          # 💬 Dialog Components
│   ├── RatingDialog.tsx
│   ├── RequestDetailsDialog.tsx
│   ├── SLAConfigDialog.tsx
│   ├── TechnicianDetailDialog.tsx
│   └── index.ts
│
├── forms/            # 📝 Form Components
│   ├── MaintenanceRequestForm.tsx
│   └── index.ts
│
├── profile/          # 👤 Profile Components
│   ├── ProfileManagement.tsx
│   └── index.ts
│
├── reports/          # 📈 Reports & Analytics
│   ├── ReportsAnalytics.tsx
│   └── index.ts
│
├── shared/           # 🔄 Shared/Common Components
│   ├── AnimatedCounter.tsx
│   ├── Navbar.tsx
│   ├── StatCard.tsx
│   └── index.ts
│
└── ui/               # 🎨 UI Primitives (shadcn/ui)
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    └── ... (other UI components)
```

## 📖 วิธีการใช้งาน

### Import จากแต่ละโฟลเดอร์:

```typescript
// Authentication
import { LoginPage } from '@/components/auth';

// Dashboards
import { UserDashboard, TechnicianDashboard, SupervisorDashboard } from '@/components/dashboard';

// Dialogs
import { RatingDialog, RequestDetailsDialog, TechnicianDetailDialog } from '@/components/dialogs';

// Forms
import { MaintenanceRequestForm } from '@/components/forms';

// Profile
import { ProfileManagement } from '@/components/profile';

// Reports
import { ReportsAnalytics } from '@/components/reports';

// Shared Components
import { Navbar, StatCard, AnimatedCounter } from '@/components/shared';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

## 🎯 หลักการจัดโครงสร้าง

1. **auth/** - Component ที่เกี่ยวกับการ Login และ Authentication
2. **dashboard/** - Component Dashboard ต่างๆ สำหรับแต่ละ role (User, Technician, Supervisor)
3. **dialogs/** - Component Modal/Dialog ทั้งหมด
4. **forms/** - Component Form ต่างๆ สำหรับรับข้อมูล
5. **profile/** - Component ที่เกี่ยวกับการจัดการ Profile
6. **reports/** - Component สำหรับ Reports และ Analytics
7. **shared/** - Component ที่ใช้ร่วมกันในหลายๆ ส่วน (Navbar, Counter, Card ฯลฯ)
8. **ui/** - UI primitives จาก shadcn/ui (Button, Input, Card ฯลฯ)

## � Import Path Rules

### สำหรับ Components ภายใน subfolder (auth/, dashboard/, dialogs/, etc.):
- Import contexts: `'../../contexts/...'`
- Import UI components: `'../ui/...'`
- Import components จาก subfolder อื่น: `'../dialogs/...'`, `'../forms/...'`, `'../shared/...'`

### ตัวอย่าง Import Paths:

**ใน components/dashboard/UserDashboard.tsx:**
```typescript
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { MaintenanceRequestForm } from '../forms/MaintenanceRequestForm';
import { RequestDetailsDialog } from '../dialogs/RequestDetailsDialog';
import { StatCard } from '../shared/StatCard';
```

**ใน components/dialogs/RatingDialog.tsx:**
```typescript
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
```

**ใน app/page.tsx:**
```typescript
import { LoginPage } from '../components/auth';
import { UserDashboard } from '../components/dashboard';
import { Navbar } from '../components/shared';
```

## �💡 ข้อดีของโครงสร้างใหม่

- ✅ **ค้นหาง่าย** - รู้ทันทีว่า component อยู่ที่ไหน
- ✅ **จัดกลุ่มชัดเจน** - แยกตามหน้าที่การใช้งาน
- ✅ **Import สะดวก** - ใช้ index.ts ในการ export ทุกโฟลเดอร์
- ✅ **Scale ได้ง่าย** - เพิ่ม component ใหม่ได้ง่ายในโฟลเดอร์ที่เหมาะสม
- ✅ **Maintenance ง่าย** - แก้ไขและดูแลรักษาง่ายขึ้น
- ✅ **Path ชัดเจน** - Import paths ถูกต้องและสอดคล้องกันทั้งหมด

## ✨ การเปลี่ยนแปลงที่ทำ

1. ✅ ย้ายไฟล์ทั้งหมดไปยังโฟลเดอร์ที่เหมาะสม
2. ✅ อัพเดท index.ts ในทุกโฟลเดอร์
3. ✅ แก้ไข import paths ทั้งหมดให้ถูกต้อง
4. ✅ ตรวจสอบและแก้ไข relative paths ทั้งหมด
5. ✅ ไม่มี TypeScript errors
