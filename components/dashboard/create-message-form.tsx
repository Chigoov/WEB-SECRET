'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { createSecretMessage } from '@/app/actions/messages'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from '@/components/ui/field'
import type { ActionResult } from '@/lib/types'

type CreateMessageSuccess = {
  code: string
}

const initialState: ActionResult<CreateMessageSuccess> = {}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="h-10" disabled={disabled || pending}>
      <Lock data-icon="inline-start" />
      {pending ? 'Locking...' : 'Lock & Save'}
    </Button>
  )
}

export function CreateMessageForm() {
  const [message, setMessage] = useState('')
  const [code, setCode] = useState('')
  const [destroy, setDestroy] = useState(true)
  const [state, formAction] = useActionState(createSecretMessage, initialState)

  useEffect(() => {
    if (state.error) toast.error(state.error)
    if (!state.success) return

    toast.success('Message locked', {
      description: `Share the code "${state.success.code}" with your recipient.`,
    })
    setMessage('')
    setCode('')
    setDestroy(true)
  }, [state])

  return (
    <Card className="border-border/70">
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="content">Secret message</FieldLabel>
              <Textarea
                id="content"
                name="content"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type the message you want to keep secret..."
                className="min-h-40 resize-y"
                maxLength={5000}
                required
              />
              <FieldDescription>
                Only someone with the code can read this. Max 5,000
                characters.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="secret_code">Secret code</FieldLabel>
              <Input
                id="secret_code"
                name="secret_code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. blue-harbor"
                className="font-mono sm:max-w-xs"
                maxLength={80}
                required
              />
              <FieldDescription>
                Choose something memorable but hard to guess.
              </FieldDescription>
            </Field>

            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="destroy">Destroy after reading</FieldLabel>
                <FieldDescription>
                  The message erases itself once opened.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="destroy"
                checked={destroy}
                onCheckedChange={setDestroy}
              />
              {destroy && (
                <input type="hidden" name="destroy_after_read" value="on" />
              )}
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6">
          <SubmitButton disabled={!message.trim() || !code.trim()} />
        </CardFooter>
      </form>
    </Card>
  )
}
