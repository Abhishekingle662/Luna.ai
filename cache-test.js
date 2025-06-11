// Cache Testing Utility - Add to browser console to test caching
(function() {
  console.log('🚀 Luna.ai Cache Testing Utility');
  
  // Test 1: Check if service worker is registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        console.log('✅ Service Worker registered:', registrations[0].scope);
      } else {
        console.log('❌ No service worker found');
      }
    });
  }
  
  // Test 2: Check Cache API availability
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      console.log('✅ Cache API available. Cache names:', cacheNames);
      
      // Check specific Luna.ai caches
      cacheNames.forEach(name => {
        if (name.includes('luna')) {
          caches.open(name).then(cache => {
            cache.keys().then(keys => {
              console.log(`📦 Cache "${name}" contains ${keys.length} items:`, 
                keys.slice(0, 3).map(k => k.url));
            });
          });
        }
      });
    });
  } else {
    console.log('❌ Cache API not available');
  }
  
  // Test 3: Check if moon model is being cached
  setTimeout(() => {
    if (window.lunaCache) {
      window.lunaCache.report().then(report => {
        console.log('📊 Cache Report:', report);
        
        if (report.totalEntries > 0) {
          console.log('✅ Assets are being cached successfully!');
        } else {
          console.log('⚠️ No assets cached yet. Try refreshing the page.');
        }
      });
    }
  }, 3000);
  
  console.log('🔍 Cache test complete. Check results above.');
  console.log('💡 Tip: Run window.showLunaCache() to see cache status overlay');
})();
