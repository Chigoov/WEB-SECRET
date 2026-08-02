'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { ActionResult } from '@/lib/types'

type AuthSuccess = {
  message: string
  redirectTo: string
}

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

export async function signUpAction(
  _previousState: ActionResult<AuthSuccess>,
  formData: FormData,
): Promise<ActionResult<AuthSuccess>> {
  const email = readString(formData, 'email').toLowerCase()
  const password = readString(formData, 'password')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }
  if (!data.user) return { error: 'Unable to create account.' }

  revalidatePath('/', 'layout')

  return {
    success: {
      message: data.session
        ? 'Account created.'
        : 'Account created. Check your email if confirmation is enabled.',
      redirectTo: data.session ? '/dashboard' : '/login',
    },
  }
}

export async function signInAction(
  _previousState: ActionResult<AuthSuccess>,
  formData: FormData,
): Promise<ActionResult<AuthSuccess>> {
  const email = readString(formData, 'email').toLowerCase()
  const password = readString(formData, 'password')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')

  return {
    success: {
      message: 'Signed in.',
      redirectTo: '/dashboard',
    },
  }
}

export async function signOutAction(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
