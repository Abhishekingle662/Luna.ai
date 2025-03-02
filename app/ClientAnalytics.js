'use client';

import GoogleAnalytics from './GoogleAnalytics';
import { useEffect } from 'react';

export default function ClientAnalytics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'test_event', {
        'event_category': 'testing',
        'event_label': 'GA4 implementation test'
      });
    //   console.log('Test event sent to Google Analytics');
    }
  }, []);

  return <GoogleAnalytics GA_MEASUREMENT_ID="G-2F84GPF4QD" debug={true} />;
}