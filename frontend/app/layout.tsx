import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import { ClientProvider } from '@/lib/client-context';
import { SidebarProvider } from '@/lib/sidebar-context';
import { ToastProvider } from '@/lib/toast-context';
import MainContent from '@/components/layout/MainContent';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SearchProvider } from '@/lib/search-context';
import { ThemeProvider } from '@/lib/theme-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'QuantumBlack AI Advisory Platform',
    template: '%s | QuantumBlack AI',
  },
  description: 'AI Strategy & Advisory Platform for consulting teams and clients.',
  openGraph: {
    title: 'QuantumBlack AI Advisory Platform',
    description: 'AI Strategy & Advisory Platform for consulting teams and clients.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased theme-dark`}>
        <ThemeProvider>
          <SidebarProvider>
            <ToastProvider>
              <ClientProvider>
                <SearchProvider>
                  <Sidebar />
                  <MainContent>
                    <ErrorBoundary>{children}</ErrorBoundary>
                  </MainContent>
                </SearchProvider>
              </ClientProvider>
            </ToastProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
