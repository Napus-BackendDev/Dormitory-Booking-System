import Link from "next/link";
import { Wrench } from "lucide-react";

const userdata = {
  name: "สมหญิง ผู้จัดการ",
  position: "หัวหน้างาน",
};

const eachpage = [
    { name: "แดชบอร์ด", href: "/dashboard" },
    { name: "รายงานและสถิติ", href: "/reports" },
    { name: "โปรไฟล์", href: "/profile" },
]
export default function Navbar() {
  return (
    <div className="flex items-center justify-center bg-white border-b border-gray-20">
      <nav className="flex w-full max-w-5xl justify-between items-center py-4">
        <div className="flex  items-center gap-2">
          <div className="bg-linear-to-r from-main to-sub-linear p-2 rounded-xl flex items-center justify-center">
            <Wrench className=" text-amber-400" />
          </div>
          <div className="flex flex-col ">
            <span className="font-semibold text-main">
              MFU Maintenance
            </span>
            <span className="text-sm text-gray-500">ระบบแจ้งซ่อมบำรุง</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={"/dashboard"} className="bg-linear-to-b from-main to-sub-linear text-white py-2 px-4 rounded-xl"> แดชบอร์ด </Link>
          <Link href={"/reports"} className=" text-black py-2 px-4 rounded-xl"> รายงานและสถิติ </Link>
          <Link href={"/profile"} className="text-black py-2 px-4 rounded-xl"> โปรไฟล์ </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-linear-to-r from-main to-sub-linear text-amber-400 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
            {userdata.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-black ">{userdata.name}</span>
            <span className="text-sm text-gray-500">{userdata.position}</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
