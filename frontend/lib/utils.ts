// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"
// import type { SLAConfig } from './types'
// import { Ticket } from "@/types/Ticket"

// /**
//  * Merge class names with Tailwind
//  */
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// /**
//  * Format date to Thai locale
//  */
// export function formatDate(date: Date | string): string {
//   const d = typeof date === 'string' ? new Date(date) : date
//   return new Intl.DateTimeFormat('th-TH', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   }).format(d)
// }

// /**
//  * Format date and time to Thai locale
//  */
// export function formatDateTime(date: Date | string): string {
//   const d = typeof date === 'string' ? new Date(date) : date
//   return new Intl.DateTimeFormat('th-TH', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   }).format(d)
// }

// /**
//  * Format relative time (e.g., "2 hours ago")
//  */
// export function formatRelativeTime(date: Date | string): string {
//   const d = typeof date === 'string' ? new Date(date) : date
//   const now = new Date()
//   const diffInMs = now.getTime() - d.getTime()
//   const diffInMinutes = Math.floor(diffInMs / 60000)
//   const diffInHours = Math.floor(diffInMinutes / 60)
//   const diffInDays = Math.floor(diffInHours / 24)

//   if (diffInMinutes < 1) return 'เมื่อสักครู่'
//   if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`
//   if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`
//   if (diffInDays < 30) return `${diffInDays} วันที่แล้ว`
  
//   return formatDate(d)
// }

// /**
//  * Calculate hours between two dates
//  */
// export function getHoursDifference(startDate: Date, endDate: Date): number {
//   const diffInMs = endDate.getTime() - startDate.getTime()
//   return Math.floor(diffInMs / (1000 * 60 * 60))
// }

// /**
//  * Check if request is overdue based on SLA
//  */
// export function isRequestOverdue(
//   request: Ticket,
//   slaConfig: SLAConfig
// ): boolean {
//   if (request.status === 'done' || request.status === 'rejected') {
//     return false
//   }

//   const slaHours = slaConfig[request.priority]
//   const hoursSinceCreated = getHoursDifference(
//     new Date(request.createdAt),
//     new Date()
//   )

//   return hoursSinceCreated > slaHours
// }

// /**
//  * Get remaining time for SLA in hours
//  */
// export function getRemainingTime(
//   request: MaintenanceRequest,
//   slaConfig: SLAConfig
// ): number {
//   const slaHours = slaConfig[request.priority]
//   const hoursSinceCreated = getHoursDifference(
//     new Date(request.createdAt),
//     new Date()
//   )

//   return Math.max(0, slaHours - hoursSinceCreated)
// }

// /**
//  * Format hours to human readable string
//  */
// export function formatHours(hours: number): string {
//   if (hours < 1) {
//     const minutes = Math.floor(hours * 60)
//     return `${minutes} นาที`
//   }
//   if (hours < 24) {
//     return `${Math.floor(hours)} ชั่วโมง`
//   }
//   const days = Math.floor(hours / 24)
//   const remainingHours = hours % 24
//   if (remainingHours === 0) {
//     return `${days} วัน`
//   }
//   return `${days} วัน ${Math.floor(remainingHours)} ชั่วโมง`
// }

// /**
//  * Generate random ID
//  */
// export function generateId(): string {
//   return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
// }

// /**
//  * Truncate text with ellipsis
//  */
// export function truncate(text: string, maxLength: number): string {
//   if (text.length <= maxLength) return text
//   return text.slice(0, maxLength) + '...'
// }

// /**
//  * Calculate percentage
//  */
// export function calculatePercentage(value: number, total: number): number {
//   if (total === 0) return 0
//   return Math.round((value / total) * 100)
// }

// /**
//  * Debounce function
//  */
// export function debounce<T extends (...args: any[]) => any>(
//   func: T,
//   wait: number
// ): (...args: Parameters<T>) => void {
//   let timeout: NodeJS.Timeout | null = null
  
//   return function executedFunction(...args: Parameters<T>) {
//     const later = () => {
//       timeout = null
//       func(...args)
//     }
    
//     if (timeout) clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//   }
// }

// /**
//  * Download data as file
//  */
// export function downloadFile(data: string, filename: string, type: string) {
//   const blob = new Blob([data], { type })
//   const url = window.URL.createObjectURL(blob)
//   const link = document.createElement('a')
//   link.href = url
//   link.download = filename
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   window.URL.revokeObjectURL(url)
// }

// /**
//  * Convert data to CSV format
//  */
// export function convertToCSV(data: any[], headers: string[]): string {
//   const csvRows = []
//   csvRows.push(headers.join(','))
  
//   for (const row of data) {
//     const values = headers.map(header => {
//       const value = row[header]
//       return typeof value === 'string' && value.includes(',')
//         ? `"${value}"`
//         : value
//     })
//     csvRows.push(values.join(','))
//   }
  
//   return csvRows.join('\n')
// }
