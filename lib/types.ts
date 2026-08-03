export type MessageStatus = 'read' | 'unread'

export type ActionResult<T = unknown> = {
  error?: string
  success?: T
}

export interface VaultMessage {
  id: string
  code: string
  createdAt: string
  status: MessageStatus
  destroyAfterReading: boolean
}

export interface UnlockPayload {
  content: string
  destroyed: boolean
}

export interface ProfileRow {
  id: string
  email: string
  username: string
  role: string
  created_at: string
}

export interface SecretMessageRow {
  id: string
  user_id: string
  content: string
  secret_code: string
  is_read: boolean
  destroy_after_read: boolean
  created_at: string
}
