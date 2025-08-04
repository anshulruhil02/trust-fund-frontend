import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import { Providers } from './providers'; // Import the new Web3 provider

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'WorthyTrust - Blockchain Trust Fund',
  description: 'Secure blockchain-based trust fund management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {/* The new Providers component wraps everything to provide wallet state */}
        <Providers>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
