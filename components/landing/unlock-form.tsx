'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { KeyRound, ShieldAlert, Unlock } from 'lucide-react'
import { unlockSecretMessage } from '@/app/actions/messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ActionResult, UnlockPayload } from '@/lib/types'

const initialState: ActionResult<UnlockPayload> = {}

function UnlockButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="h-11 px-5 sm:w-auto">
      <Unlock data-icon="inline-start" />
      {pending ? 'Membuka...' : 'Buka'}
    </Button>
  )
}

export function UnlockForm() {
  const [state, formAction] = useActionState(
    unlockSecretMessage,
    initialState,
  )

  if (state.success) {
    return (
      <Card className="border-border/70 bg-muted/40 text-left">
        <CardHeader>
          <CardTitle className="text-lg">Pesan terbuka</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 py-1">
          <p className="text-sm leading-relaxed text-foreground">
            {state.success.content}
          </p>
          {state.success.destroyed && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ShieldAlert className="size-3.5" aria-hidden="true" />
              Pesan ini diatur untuk terhapus setelah dibaca.
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <KeyRound
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            name="secret_code"
            placeholder="Masukkan sandi rahasia"
            aria-label="Sandi rahasia"
            className="h-11 pl-9 font-mono"
            maxLength={80}
            required
          />
        </div>
        <UnlockButton />
      </div>

      {state.error && (
        <p className="text-left text-sm text-destructive">{state.error}</p>
      )}
    </form>
  )
}
