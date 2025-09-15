
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import LiquidCursor from '@/components/shared/liquid-cursor';
import { CartProvider } from '@/context/cart-context';
import CartSidebar from '@/components/marketplace/cart-sidebar';
import { FeatherlightProvider } from '@/context/featherlight-context';
import { UserPreferencesProvider } from '@/context/user-preferences-context';

export const metadata: Metadata = {
  title: 'Viraasat Connect',
  description: 'An AI-powered marketplace for local artisans.',
};

export default function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <UserPreferencesProvider>
          <FeatherlightProvider>
            <CartProvider>
              <LiquidCursor />
              {children}
              <CartSidebar />
              <Toaster />
            </CartProvider>
          </FeatherlightProvider>
        </UserPreferencesProvider>
      </body>
    </html>
  );
}
