import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import { ClientProvider } from '@/lib/client-context';
import { SidebarProvider } from '@/lib/sidebar-context';
import { ToastProvider } from '@/lib/toast-context';
import MainContent from '@/components/layout/MainContent';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'QuantumBlack AI Advisory Platform',
  description: 'AI Strategy & Advisory Platform for consulting teams and clients.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SidebarProvider>
          <ToastProvider>
            <ClientProvider>
              <Sidebar />
              <MainContent>{children}</MainContent>
            </ClientProvider>
          </ToastProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
