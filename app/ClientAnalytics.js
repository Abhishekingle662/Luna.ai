'use client';

import GoogleAnalytics from './GoogleAnalytics';
import { useEffect } from 'react';

export default function ClientAnalytics() {
  useEffect(() => {
    // Wait a moment for GA to initialize
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Check if gtag exists
        if (typeof window.gtag === 'function') {
          console.log('✅ gtag is available');
          
          // Send test event
          window.gtag('event', 'test_event', {
            'event_category': 'testing',
            'event_label': 'GA4 implementation test',
            'debug_mode': true
          });
          
          console.log('Test event sent to Google Analytics');
        } else {
          console.error('❌ gtag is not available');
        }
      }
    }, 2000); // Give GA time to load
  }, []);

  return <GoogleAnalytics GA_MEASUREMENT_ID="G-2F84GPF4QD" debug={true} />;
}