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

function normalizeUsername(value: string) {
  return value.toLowerCase()
}

function usernameError(username: string) {
  if (!username) return 'Unique name and password are required.'
  if (!/^[a-z0-9_-]{3,32}$/.test(username)) {
    return 'Unique name must be 3-32 characters: letters, numbers, _ or - only.'
  }
  return null
}

function authEmail(username: string) {
  return `${username}@cipher.local`
}

export async function signUpAction(
  _previousState: ActionResult<AuthSuccess>,
  formData: FormData,
): Promise<ActionResult<AuthSuccess>> {
  const username = normalizeUsername(readString(formData, 'username'))
  const password = readString(formData, 'password')
  const validationError = usernameError(username)

  if (validationError || !password) {
    return { error: validationError ?? 'Unique name and password are required.' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const supabase = await createClient()
  const email = authEmail(username)
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    if (error.message.toLowerCase().includes('already')) {
      return { error: 'That unique name is already taken.' }
    }
    return { error: error.message }
  }
  if (!data.user) return { error: 'Unable to create account.' }

  revalidatePath('/', 'layout')

  return {
    success: {
      message: 'Account created.',
      redirectTo: data.session ? '/dashboard' : '/login',
    },
  }
}

export async function signInAction(
  _previousState: ActionResult<AuthSuccess>,
  formData: FormData,
): Promise<ActionResult<AuthSuccess>> {
  const username = normalizeUsername(readString(formData, 'username'))
  const password = readString(formData, 'password')
  const validationError = usernameError(username)

  if (validationError || !password) {
    return { error: validationError ?? 'Unique name and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: authEmail(username),
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        error:
          'Supabase email confirmation is still active. Turn it off to use unique-name login.',
      }
    }
    return { error: 'Unique name or password is incorrect.' }
  }

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
