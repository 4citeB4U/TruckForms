// src/components/layout/header.tsx
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Truck, Building2, Bot } from 'lucide-react';
import Image from 'next/image';
import { useBranding } from '@/context/branding-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { BrandingCustomizer } from './branding-customizer';
import { useState } from 'react';
import { CommandBar } from './command-bar';
import { useCommand } from '@/context/command-context';


export function Header() {
  const { logo } = useBranding();
  const isMobile = useIsMobile();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const { setCommandOpen } = useCommand();
  
  return (
    <>
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 no-print">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        {logo ? (
          <Image src={logo} alt="Company Logo" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Truck className="h-5 w-5" />
          </div>
        )}
        <h1 className="font-headline text-xl font-semibold tracking-tight">TruckForms</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
            <Bot className="mr-2 h-4 w-4" />
            Agent Lee
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsCustomizerOpen(true)}>
            <Building2 className="mr-2 h-4 w-4" />
            Customize Branding
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://placehold.co/32x32.png" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <BrandingCustomizer open={isCustomizerOpen} onOpenChange={setIsCustomizerOpen} />
    <CommandBar />
    </>
  );
}
