
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/auth/AuthProvider';
import { CompanyProvider } from '@/auth/CompanyContext';

export const metadata: Metadata = {
  title: 'TruckForms',
  description: 'Modern forms engine for the logistics industry.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only redirect to login if not already on login page
  if (typeof window !== 'undefined') {
    const isLoginPage = window.location.pathname === '/login';
    if (!isLoginPage) {
      window.location.href = '/login';
      return null;
    }
  }
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <AuthProvider>
          <CompanyProvider>
            {children}
            <Toaster />
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
