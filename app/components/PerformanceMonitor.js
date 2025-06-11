'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      // Log Core Web Vitals
      const logCWV = (metric) => {
        console.log(`${metric.name}: ${metric.value}`);
      };

      // Measure First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            logCWV({
              name: entry.name,
              value: entry.startTime
            });
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });

      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
