'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID, debug = false }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && pathname && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
        debug_mode: true  // Force debug mode
      });
    }
  }, [pathname, GA_MEASUREMENT_ID]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('GA script loaded successfully');
        }}
        onError={(e) => {
          console.error('Error loading GA script:', e);
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            debug_mode: true,  // Force debug mode
            send_page_view: true
          });
          console.log('Google Analytics initialized with ID: ${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
