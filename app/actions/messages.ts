'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import type { ActionResult, UnlockPayload, VaultMessage } from '@/lib/types'

type CreateMessageSuccess = {
  code: string
}

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

export async function createSecretMessage(
  _previousState: ActionResult<CreateMessageSuccess>,
  formData: FormData,
): Promise<ActionResult<CreateMessageSuccess>> {
  const content = readString(formData, 'content')
  const secretCode = readString(formData, 'secret_code').toLowerCase()
  const destroyAfterRead = formData.get('destroy_after_read') === 'on'

  if (!content || !secretCode) {
    return { error: 'Message and secret code are required.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be signed in to create a message.' }
  }

  const { error } = await supabase.from('messages').insert({
    user_id: user.id,
    content,
    secret_code: secretCode,
    destroy_after_read: destroyAfterRead,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/vault')

  return {
    success: {
      code: secretCode,
    },
  }
}

export async function getUserVaultMessages(): Promise<VaultMessage[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return []

  const { data, error } = await supabase
    .from('messages')
    .select('id, secret_code, is_read, destroy_after_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((message) => ({
    id: message.id,
    code: message.secret_code,
    createdAt: message.created_at,
    status: message.is_read ? 'read' : 'unread',
    destroyAfterReading: message.destroy_after_read,
  }))
}

export async function unlockSecretMessage(
  _previousState: ActionResult<UnlockPayload>,
  formData: FormData,
): Promise<ActionResult<UnlockPayload>> {
  const secretCode = readString(formData, 'secret_code').toLowerCase()

  if (!secretCode) {
    return { error: 'Secret code is required.' }
  }

  const supabase = await createClient()
  const { data: message, error } = await supabase
    .rpc('unlock_secret_message', { input_secret_code: secretCode })
    .maybeSingle<UnlockPayload>()

  if (error) return { error: error.message }
  if (!message) return { error: 'Invalid code or message destroyed.' }

  revalidatePath('/dashboard/vault')

  return {
    success: {
      content: message.content,
      destroyed: message.destroyed,
    },
  }
}
