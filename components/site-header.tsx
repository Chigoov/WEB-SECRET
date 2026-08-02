import Link from 'next/link'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Brand />
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          variant="outline"
          size="sm"
        >
          Login / Register
        </Button>
      </div>
    </header>
  )
}
