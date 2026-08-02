import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SecretMessageRow } from '@/lib/types'

export const dynamic = 'force-dynamic'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function preview(content: string) {
  return content.length > 72 ? `${content.slice(0, 72)}...` : content
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const [profilesResult, messagesResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*').order('created_at', {
      ascending: false,
    }),
  ])

  const messages = (messagesResult.data ?? []) as SecretMessageRow[]
  const queryError = profilesResult.error?.message ?? messagesResult.error?.message

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            System-wide user and message activity.
          </p>
        </div>
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          variant="outline"
        >
          Dashboard
        </Button>
      </div>

      {queryError && (
        <Card className="border-destructive/30">
          <CardContent className="text-sm text-destructive">
            {queryError}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardDescription>Total users</CardDescription>
            <CardTitle className="text-3xl">
              {profilesResult.count ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardDescription>Total messages</CardDescription>
            <CardTitle className="text-3xl">{messages.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="overflow-hidden border-border/70 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Destroy</TableHead>
              <TableHead>Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(new Date(message.created_at))}
                  </TableCell>
                  <TableCell className="font-mono">
                    {message.secret_code}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {message.user_id}
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.is_read ? 'secondary' : 'outline'}>
                      {message.is_read ? 'read' : 'unread'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {message.destroy_after_read ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="max-w-xs text-muted-foreground">
                    {preview(message.content)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
