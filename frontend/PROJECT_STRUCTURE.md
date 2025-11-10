# Frontend Project Structure

โครงสร้างโปรเจค Frontend ที่จัดระเบียบและเข้าใจง่าย

## 📁 โครงสร้างหลัก

```
frontend/
├── app/                     # 📄 Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── providers.tsx       # Context providers
│
├── components/              # 🧩 React Components
│   ├── auth/               # Authentication
│   ├── common/             # Shared components
│   ├── dashboards/         # Dashboard pages
│   ├── features/           # Feature-specific
│   └── ui/                 # UI components
│
├── contexts/                # 🔄 React Context
│   ├── AuthContext.tsx     # Authentication state
│   ├── BuildingContext.tsx # Building data
│   └── MaintenanceContext.tsx # Maintenance requests
│
├── lib/                     # 🛠️ Utilities
│   ├── constants.ts        # Constants
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Helper functions
│
├── styles/                  # 🎨 Styles
│   └── globals.css
│
├── public/                  # 📦 Static files
│
├── next.config.js          # ⚙️ Next.js config
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind config
└── package.json            # Dependencies

```

## 🎯 Path Aliases

ใช้ `@/` สำหรับ import:

```tsx
// Components
import { LoginPage } from '@/components/auth/LoginPage';
import { Navbar } from '@/components/common/Navbar';
import { UserDashboard } from '@/components/dashboards/UserDashboard';

// Contexts
import { useAuth } from '@/contexts/AuthContext';
import { useMaintenance } from '@/contexts/MaintenanceContext';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Utils
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/constants';
```

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `UserDashboard.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Styles**: kebab-case (e.g., `globals.css`)

### Components
```tsx
// ✅ ถูกต้อง
export const UserDashboard: React.FC = () => { ... }

// ❌ ไม่แนะนำ
export default function UserDashboard() { ... }
```

### Contexts
```tsx
// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { ... }

// Hook
export const useAuth = () => { ... }
```

## 🚀 การเริ่มต้น

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📚 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Axios
