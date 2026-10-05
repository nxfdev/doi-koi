import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'DOI KOI — Bogura at your doorsteps | Authentic Bogura Doi',
  description:
    'Experience authentic Bogura Doi crafted in traditional terracotta shora over slow wood embers. Direct delivery to your doorsteps in Dhaka and across Bangladesh.',
  keywords: [
    'Bogura doi',
    'Bogurar doi',
    'Authentic Bogura doi',
    'Mishti doi Bangladesh',
    'Doi delivery Dhaka',
    'Bangladeshi doi',
    'Traditional Bogura doi',
    'Doi Koi',
  ],
  authors: [{ name: 'DOI KOI' }],
  openGraph: {
    title: 'DOI KOI — Bogura at your doorsteps',
    description:
      'Traditional product. Contemporary presentation. Authentic Bogura doi delivered directly to your doorstep in Dhaka & Bangladesh.',
    url: 'https://doikoi.com',
    siteName: 'DOI KOI',
    images: [
      {
        url: '/assets/home/hero/hero-doi.png',
        width: 800,
        height: 800,
        alt: 'DOI KOI — Bogura at your doorsteps',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOI KOI — Bogura at your doorsteps',
    description: 'Traditional product. Contemporary presentation.',
    images: ['/assets/home/hero/hero-doi.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#FCE08B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} font-sans`}>
      <body className="bg-[#FCE08B] text-[#763C1E] min-h-screen flex flex-col font-sans selection:bg-[#763C1E] selection:text-[#FCE08B]">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
