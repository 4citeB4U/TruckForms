import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  role?: string;
  description?: string;
}

export interface NavItemGroup {
    title: string;
    items: NavItem[];
}
