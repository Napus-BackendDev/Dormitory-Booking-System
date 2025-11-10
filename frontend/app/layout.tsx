import { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'MFU Dorm Maintenance System',
  description: 'ระบบจัดการงานซ่อมบำรุงหอพักมหาวิทยาลัยแม่ฟ้าหลวง',
  keywords: ['maintenance', 'dorm', 'MFU', 'repair', 'request'],
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased bg-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
