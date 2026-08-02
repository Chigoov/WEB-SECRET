import { Badge } from '@/components/ui/badge'
import type { MessageStatus } from '@/lib/types'

export function StatusBadge({ status }: { status: MessageStatus }) {
  if (status === 'read') {
    return <Badge variant="secondary">Read</Badge>
  }
  return <Badge variant="outline">Unread</Badge>
}
