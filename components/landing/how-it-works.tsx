import { PenLine, KeyRound, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const steps = [
  {
    icon: PenLine,
    title: 'Write & lock',
    description:
      'Compose your message and seal it with a custom secret code only you choose.',
  },
  {
    icon: KeyRound,
    title: 'Share the code',
    description:
      'Send the code through any channel. The recipient never needs an account to open it.',
  },
  {
    icon: Flame,
    title: 'Destroy on read',
    description:
      'Optionally have the message erase itself the moment it is opened. Nothing lingers.',
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="border-border/70">
            <CardHeader>
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <CardTitle className="mt-3 text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
