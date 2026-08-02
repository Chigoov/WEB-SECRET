import { PenSquare, Vault, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Create Message', href: '/dashboard', icon: PenSquare },
  { label: 'My Vault', href: '/dashboard/vault', icon: Vault },
]
