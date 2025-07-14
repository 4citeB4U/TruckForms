// src/components/layout/sidebar-nav.tsx
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { FORM_CATEGORIES } from '@/lib/constants';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function SidebarNav() {
  const pathname = usePathname();

  const defaultActiveCategory = FORM_CATEGORIES.find(category => 
    category.items.some(item => pathname.startsWith(item.href))
  )?.title;

  return (
    <Sidebar className="border-r no-print">
      <SidebarHeader>
        {/* Placeholder for a logo or app name in sidebar header */}
      </SidebarHeader>
      <SidebarContent className="p-0">
        <Accordion type="multiple" defaultValue={defaultActiveCategory ? [defaultActiveCategory] : ['Driver']} className="w-full">
          {FORM_CATEGORIES.map((category) => (
            <AccordionItem value={category.title} key={category.title} className="border-b-0">
              <AccordionTrigger className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:no-underline hover:bg-accent rounded-md">
                {category.title}
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <SidebarMenu className="py-2 pl-4">
                  {category.items.map((item) => (
                     <SidebarMenuItem key={`${item.href}-${item.title}`}>
                      <Link href={item.href} passHref>
                        <SidebarMenuButton
                          isActive={pathname === item.href}
                          tooltip={{ children: item.title }}
                          className="justify-start"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
             <Link href="#" passHref>
                <SidebarMenuButton
                tooltip={{ children: 'Settings' }}
                className="justify-start"
                >
                <Settings />
                <span>Settings</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="#" passHref>
                <SidebarMenuButton
                tooltip={{ children: 'Logout' }}
                className="justify-start"
                >
                <LogOut />
                <span>Logout</span>
                </SidebarMenuButton>
             </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-4 text-center text-xs text-muted-foreground">
            <p>Leeway forms.</p>
            <p>By Rapid Web Development.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
