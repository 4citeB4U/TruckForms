import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { BrandingProvider } from '@/context/branding-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrandingProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <SidebarNav />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-8 md:gap-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </BrandingProvider>
  );
}
