import Link from 'next/link'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Brand({
  className,
  href = '/',
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 font-medium tracking-tight',
        className,
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Lock className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base">Cipher</span>
    </Link>
  )
}
