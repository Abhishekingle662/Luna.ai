import { Inter, Exo_2, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import ClientLayout from './ClientLayout';
import dynamic from 'next/dynamic';

// Import the analytics component with no SSR
const ClientAnalytics = dynamic(() => import('./ClientAnalytics'), { ssr: false });

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
    <html lang="en">      <head>
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Optimized font loading */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;700&display=swap" rel="stylesheet" />
        
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
        
      </head><body className={`${inter.className} ${spaceGrotesk.variable} ${exo2.variable} bg-lunar-deep text-lunar-light font-lato`}>
        <ClientAnalytics />
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        
        {/* Register service worker for enhanced caching */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
        
        {/* Clear old service worker cache */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                  registration.unregister();
                }
              });
              // Clear all caches
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  names.forEach(function(name) {
                    caches.delete(name);
                  });
                });
              }
            }
          `
        }} />
      </body>
    </html>
  );
}

