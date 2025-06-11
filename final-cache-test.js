// Final Cache System Test
// Run this in browser console to verify caching functionality

console.log('🚀 Luna.ai Final Cache System Test');
console.log('=====================================');

// Test 1: Check if AssetCache is available
if (typeof window !== 'undefined' && window.lunaCache) {
  console.log('✅ AssetCache is available globally');
  
  // Test 2: Check cache status
  window.lunaCache.getStats().then(stats => {
    console.log('📊 Current Cache Stats:', stats);
    
    if (stats.memoryCache.size > 0 || stats.persistentCache.size > 0) {
      console.log('✅ Cache contains assets');
    } else {
      console.log('ℹ️ Cache is empty (expected on first visit)');
    }
  });
  
  // Test 3: Test preloading functionality
  console.log('🔄 Testing asset preloading...');
  window.lunaCache.preloadAsset('/models/moon.glb', 'high').then((result) => {
    if (result) {
      console.log('✅ Moon model preloaded successfully');
      console.log('⚡ Subsequent loads will be instant!');
    } else {
      console.log('❌ Moon model preload failed');
    }
  }).catch(error => {
    console.log('❌ Error during preload:', error);
  });
  
} else {
  console.log('❌ AssetCache not available - check ClientLayout.js');
}

// Test 4: Check Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      console.log('✅ Service Worker is registered');
      console.log('🔧 SW State:', registration.active?.state);
    } else {
      console.log('❌ Service Worker not registered');
    }
  });
} else {
  console.log('❌ Service Worker not supported');
}

// Test 5: Performance timing
if (window.performance && window.performance.navigation) {
  const navTiming = window.performance.navigation;
  const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
  
  console.log('📈 Page Load Performance:');
  console.log(`   • Total Load Time: ${loadTime}ms`);
  console.log(`   • Navigation Type: ${navTiming.type === 0 ? 'Normal' : navTiming.type === 1 ? 'Reload' : 'Back/Forward'}`);
  
  if (loadTime < 2000) {
    console.log('✅ Fast load time - caching may be working!');
  } else {
    console.log('⚠️ Slow load time - first visit or cache miss');
  }
}

console.log('=====================================');
console.log('🌙 Test your 3D model caching:');
console.log('1. Navigate to different pages');
console.log('2. Return to home page');
console.log('3. Watch for "loaded from cache! ⚡" messages');
console.log('4. Check cache stats: window.lunaCache.getStats()');
