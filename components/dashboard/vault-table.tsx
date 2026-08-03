import { Flame, Vault as VaultIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import type { VaultMessage } from '@/lib/types'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function VaultTable({ messages }: { messages: VaultMessage[] }) {
  if (messages.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <VaultIcon />
          </EmptyMedia>
          <EmptyTitle>Your vault is empty</EmptyTitle>
          <EmptyDescription>
            Messages you lock will appear here so you can track their status.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Card className="overflow-x-auto border-border/70 py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Created</TableHead>
            <TableHead>Secret Code</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {dateFormatter.format(new Date(message.createdAt))}
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <span className="font-mono">{message.code}</span>
                  {message.destroyAfterReading && (
                    <Flame
                      className="size-3.5 text-muted-foreground"
                      aria-label="Destroys after reading"
                    />
                  )}
                </span>
              </TableCell>
              <TableCell className="min-w-64 max-w-sm whitespace-pre-wrap text-muted-foreground">
                {message.content}
              </TableCell>
              <TableCell className="text-right">
                <StatusBadge status={message.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
