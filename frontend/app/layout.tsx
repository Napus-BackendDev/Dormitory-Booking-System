import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'MFU Dorm Maintenance System',
  description: 'ระบบจัดการงานซ่อมบำรุงหอพักมหาวิทยาลัยแม่ฟ้าหลวง',
  keywords: ['maintenance', 'dorm', 'MFU', 'repair', 'request'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
