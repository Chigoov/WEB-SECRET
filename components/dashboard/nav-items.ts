import { PenSquare, Search, Vault, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Create Message', href: '/dashboard', icon: PenSquare },
  { label: 'Search Message', href: '/dashboard/search', icon: Search },
  { label: 'My Vault', href: '/dashboard/vault', icon: Vault },
]
