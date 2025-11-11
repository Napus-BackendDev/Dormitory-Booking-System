export type AttachmentType = 'IMAGE' | 'VIDEO'

export type Attachment = {
  id: string
  url: string
  type: AttachmentType
  createdAt: Date
  ticketId?: string
}
