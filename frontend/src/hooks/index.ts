// Core hooks
export { useApi } from './useApi';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { usePagination } from './usePagination';
export { useNotifications } from './useNotifications';

// Module-based hooks (ตามชื่อ backend modules)
export { useAttachment } from './useAttachment';
export { useLocation } from './useLocation';
export { useRepairType } from './useRepairType';
export { useRole } from './useRole';
export { useSurvey } from './useSurvey';
export { useTicket } from './useTicket';
export { useTicketEvent } from './useTicketEvent';
export { useUser } from './useUser';

// Types
export type { Attachment } from './useAttachment';
export type { Location } from './useLocation';
export type { RepairType } from './useRepairType';
export type { Role } from './useRole';
export type { Survey, SurveyStats } from './useSurvey';
export type { Ticket } from './useTicket';
export type { TicketEvent } from './useTicketEvent';
export type { User } from './useUser';
export type { Notification, NotificationType } from './useNotifications';