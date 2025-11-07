/**
 * Type definitions for the Dorm Maintenance System
 */

export type UserRole = 'user' | 'technician' | 'supervisor'

export type RequestStatus = 'pending' | 'in_progress' | 'done' | 'rejected'

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent'

export type RequestCategory = 
  | 'electrical'
  | 'plumbing'
  | 'furniture'
  | 'air_conditioning'
  | 'door_window'
  | 'other'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  roomNumber?: string
  buildingNumber?: string
  department?: string
  profileImage?: string
  specialization?: string[] // For technicians
  createdAt: Date
}

export interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: RequestCategory
  priority: RequestPriority
  status: RequestStatus
  location: string
  roomNumber?: string
  buildingNumber?: string
  images?: string[]
  userId: string
  userName: string
  technicianId?: string
  technicianName?: string
  createdAt: Date
  updatedAt: Date
  acceptedAt?: Date
  completedAt?: Date
  rejectedReason?: string
  rating?: number
  feedback?: string
}

export interface SLAConfig {
  low: number      // hours
  medium: number   // hours
  high: number     // hours
  urgent: number   // hours
}

export interface TechnicianStats {
  id: string
  name: string
  specialization: string[]
  totalCompleted: number
  averageRating: number
  activeRequests: number
  completionRate: number
  averageResponseTime: number // hours
  onTimeCompletion: number // percentage
  ratings: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  recentFeedback: Array<{
    id: string
    rating: number
    comment: string
    date: Date
    requestTitle: string
  }>
}

export interface DashboardStats {
  totalRequests: number
  pendingRequests: number
  inProgressRequests: number
  completedRequests: number
  averageCompletionTime: number // hours
  userSatisfaction: number // percentage
  slaCompliance: number // percentage
}

export interface FilterOptions {
  status?: RequestStatus[]
  priority?: RequestPriority[]
  category?: RequestCategory[]
  dateFrom?: Date
  dateTo?: Date
  searchQuery?: string
}

export interface SortOption {
  field: 'createdAt' | 'priority' | 'status' | 'category'
  direction: 'asc' | 'desc'
}

export const CATEGORY_LABELS: Record<RequestCategory, string> = {
  electrical: 'ไฟฟ้า',
  plumbing: 'ประปา',
  furniture: 'เฟอร์นิเจอร์',
  air_conditioning: 'เครื่องปรับอากาศ',
  door_window: 'ประตู/หน้าต่าง',
  other: 'อื่นๆ',
}

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
  urgent: 'เร่งด่วน',
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'รอดำเนินการ',
  in_progress: 'กำลังดำเนินการ',
  done: 'เสร็จสิ้น',
  rejected: 'ปฏิเสธ',
}
