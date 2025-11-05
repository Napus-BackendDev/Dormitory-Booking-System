import { Wrench, User } from "lucide-react";

const userdata = {
    name: "สมชาย ใจดี",
    position: "ผู้ใช้ทั่วไป",
};

type PageType = 'dashboard' | 'profile';

interface UserNavbarProps {
    onNavigate?: (page: PageType) => void;
    currentPage?: PageType;
}

export default function UserNavbar({ onNavigate, currentPage }: UserNavbarProps) {
    return (
        <div className="flex items-center justify-center bg-white border-b border-gray-200">
            <nav className="flex w-full max-w-5xl justify-between items-center py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-xl flex items-center justify-center">
                        <Wrench className="text-yellow-400 w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-main text-lg">
                            MFU Maintenance
                        </span>
                        <span className="text-sm text-gray-500">ระบบแจ้งซ่อมบำรุง</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onNavigate?.('dashboard')}
                        className={`py-2 px-4 rounded-xl font-medium transition-colors ${currentPage === 'dashboard'
                                ? 'bg-gradient-to-b from-red-600 to-red-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        แดชบอร์ด
                    </button>
                    <button
                        onClick={() => onNavigate?.('profile')}
                        className={`py-2 px-4 rounded-xl font-medium transition-colors ${currentPage === 'profile'
                                ? 'bg-gradient-to-b from-red-600 to-red-500 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        โปรไฟล์
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-red-600 to-red-500 text-yellow-400 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        {userdata.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{userdata.name}</span>
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-500" />
                            <span className="text-sm text-gray-500">{userdata.position}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}