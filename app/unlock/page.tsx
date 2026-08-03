import Link from 'next/link'
import { Brand } from '@/components/brand'
import { UnlockForm } from '@/components/landing/unlock-form'
import { Button } from '@/components/ui/button'

export default function UnlockPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <Brand />
        <div className="space-y-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            Buka pesan rahasia
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Masukkan sandi rahasia yang kamu terima. Kamu tidak perlu login
            untuk membaca pesan.
          </p>
        </div>
        <div className="w-full">
          <UnlockForm />
        </div>
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          Masuk ke vault
        </Button>
      </div>
    </main>
  )
}
