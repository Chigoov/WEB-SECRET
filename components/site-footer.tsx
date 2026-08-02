export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 text-sm text-muted-foreground sm:px-6">
        <span>Cipher</span>
        <span>&copy; {new Date().getFullYear()} Cipher. All rights reserved.</span>
      </div>
    </footer>
  )
}
