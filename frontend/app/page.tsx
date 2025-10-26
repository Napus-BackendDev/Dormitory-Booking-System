import { Dashboard } from "@/components/Dashboard";
import { Crown, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg font-sans">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center  py-8  sm:items-start">
        <Dashboard
          headerIcon={<Crown className="text-yellow w-6 h-6" />}
          header="แดชบอร์ดหัวหน้างาน"
          subheader="สวัสดี, สมหญิง ผู้จัดการ 👔"
          buttonIcon={<Settings className="w-5 h-5" />}
          buttonName="ตั้งเวลามาตรฐาน"
        />
      </main>
    </div>
  );
}
