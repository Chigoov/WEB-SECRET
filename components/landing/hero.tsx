import { UnlockForm } from '@/components/landing/unlock-form'

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24">
      <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
        End-to-end secret sharing
      </span>
      <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Send messages that vanish once they&apos;re read
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
        Write a private note, lock it behind a secret code, and share the code
        however you like. Recipients unlock it instantly — no account, no trace
        left behind.
      </p>
      <div className="mx-auto mt-8 max-w-lg">
        <UnlockForm />
      </div>
    </section>
  )
}
