import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AL-SHOP – Urban Caps',
  description: 'Gorras urbanas de edición limitada. Streetwear premium con diseños exclusivos. Estilo urbano, actitud sin límites.',
  keywords: ['gorras', 'streetwear', 'urban', 'caps', 'AL-SHOP'],
  openGraph: {
    title: 'AL-SHOP – Urban Caps',
    description: 'Gorras urbanas de edición limitada. Streetwear premium.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-dark-950 text-dark-100">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}