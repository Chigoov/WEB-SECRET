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
    title: 'Welcome back',
    description: 'Sign in to reach your vault.',
    action: 'Sign in',
    switchText: 'New to Cipher?',
    switchCta: 'Create an account',
    switchHref: '/register',
  },
  register: {
    title: 'Create your account',
    description: 'Start sending secret messages in seconds.',
    action: 'Create account',
    switchText: 'Already have an account?',
    switchCta: 'Sign in',
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
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                required
              />
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
        </CardFooter>
      </form>
    </Card>
  )
}
