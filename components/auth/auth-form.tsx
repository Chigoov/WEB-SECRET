'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signInAction, signUpAction } from '@/app/actions/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import type { ActionResult } from '@/lib/types'

interface AuthFormProps {
  mode: 'login' | 'register'
}

type AuthSuccess = {
  message: string
  redirectTo: string
}

const initialState: ActionResult<AuthSuccess> = {}

const copy = {
  login: {
    title: 'Masuk dulu',
    description: 'Gunakan nama unik kamu untuk membuka vault.',
    action: 'Masuk',
    switchText: 'Belum punya akun?',
    switchCta: 'Buat akun',
    switchHref: '/register',
  },
  register: {
    title: 'Buat akun',
    description: 'Pilih nama unik, lalu mulai simpan pesan rahasia.',
    action: 'Buat akun',
    switchText: 'Sudah punya akun?',
    switchCta: 'Masuk',
    switchHref: '/login',
  },
} as const

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="h-10 w-full" disabled={pending}>
      {pending ? 'Please wait...' : label}
    </Button>
  )
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const t = copy[mode]
  const [state, formAction] = useActionState(
    mode === 'login' ? signInAction : signUpAction,
    initialState,
  )

  useEffect(() => {
    if (state.error) toast.error(state.error)
    if (!state.success) return

    toast.success(state.success.message)
    router.replace(state.success.redirectTo)
    router.refresh()
  }, [router, state])

  return (
    <Card className="w-full max-w-sm border-border/70">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Nama unik</FieldLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="contoh: chigoov_01"
                pattern="[A-Za-z0-9_-]{3,32}"
                title="Gunakan 3-32 karakter: huruf, angka, _ atau -"
                required
              />
              {mode === 'register' && (
                <FieldDescription>
                  Gunakan 3-32 karakter: huruf, angka, _ atau -.
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                placeholder="********"
                minLength={mode === 'register' ? 8 : undefined}
                required
              />
              {mode === 'register' && (
                <FieldDescription>
                  Use at least 8 characters.
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 flex-col gap-4">
          <SubmitButton label={t.action} />
          <p className="text-center text-sm text-muted-foreground">
            {t.switchText}{' '}
            <Link
              href={t.switchHref}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {t.switchCta}
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Punya sandi rahasia dari orang lain?{' '}
            <Link
              href="/unlock"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Buka pesan
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
