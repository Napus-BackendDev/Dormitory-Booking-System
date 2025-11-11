export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4'

export type Ticket = {
    id: string
    code: string
    title: string
    description: string
    status: string
    priority: TicketPriority
    photo?: any
    dueAt: Date
    createdAt: Date
    repairTypeId?: string
    locationId?: string
}