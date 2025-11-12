export type TicketPriority = 'P1' | 'P2' | 'P3'

export type TicketStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export type Ticket = {
    id: string
    code?: string
    title: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    photo?: File[] | string[]
    images?: string[]
    responseDueAt?: string | Date
    resolveDueAt?: string | Date
    createdAt: Date
    updatedAt: Date
    repairTypeId?: string
    repairTypeName?: string
    locationId?: string
    userId?: string
    userName?: string
    technicianId?: string
    technicianName?: string
    rating?: number
    feedback?: string
}

