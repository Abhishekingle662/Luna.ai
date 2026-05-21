import { Inter, Exo_2, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-space-grotesk',
});
const exo2 = Exo_2({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-exo-2',
});

export const metadata = {
  title: "Luna.ai",
  description: "Your Cosmic Guide to Exploring the Universe!",
  robots: "index, follow",
  other: {
    'color-scheme': 'dark',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Critical CSS hint */}
        <meta name="critical-css" content="true" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Favicon links */}
        <link rel="icon" href="/favicon_io/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon_io/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon_io/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon_io/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable} ${exo2.variable} bg-lunar-deep text-lunar-light font-lato`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
