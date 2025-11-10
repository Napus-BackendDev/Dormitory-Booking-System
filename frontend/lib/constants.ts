/**
 * Application constants
 */

import type { SLAConfig } from './types'

// Default SLA configuration (in hours)
export const DEFAULT_SLA_CONFIG: SLAConfig = {
  low: 72,      // 3 days
  medium: 48,   // 2 days
  high: 24,     // 1 day
  urgent: 4,    // 4 hours
}

// MFU Brand Colors
export const MFU_COLORS = {
  navy: '#002D72',
  navyDark: '#001d4a',
  navyLight: '#0a4a9d',
  gold: '#FFB81C',
  goldLight: '#ffd166',
  goldDark: '#e6a000',
} as const

// Status colors
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  done: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
} as const

// Priority colors
export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
} as const

// Category icons (using lucide-react icon names)
export const CATEGORY_ICONS = {
  electrical: 'Zap',
  plumbing: 'Droplet',
  furniture: 'Armchair',
  air_conditioning: 'Wind',
  door_window: 'DoorOpen',
  other: 'Wrench',
} as const

// Export file formats
export const EXPORT_FORMATS = ['pdf', 'excel', 'csv'] as const

// Pagination
export const ITEMS_PER_PAGE = 10

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy'
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm'
export const TIME_FORMAT = 'HH:mm'

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'mfu_dorm_user',
  THEME: 'mfu_dorm_theme',
  SLA_CONFIG: 'mfu_dorm_sla_config',
} as const
