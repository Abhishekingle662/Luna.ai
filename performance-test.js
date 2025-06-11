// Quick Performance Test for Luna.ai
// Run this in browser console to test WelcomeBox functionality

console.log('🧪 Luna.ai Performance Test Started');
console.log('===================================');

// Test 1: Page Load Performance
const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
console.log(`📊 Page Load Time: ${loadTime}ms`);

if (loadTime < 3000) {
  console.log('✅ Fast loading - Good performance!');
} else if (loadTime < 5000) {
  console.log('⚠️ Moderate loading - Consider optimization');
} else {
  console.log('❌ Slow loading - Needs optimization');
}

// Test 2: Check WelcomeBox Element
const welcomeBox = document.querySelector('[data-welcomebox]') || 
                  document.querySelector('div[style*="position: absolute"][style*="top: 5%"]');

if (welcomeBox) {
  console.log('✅ WelcomeBox found in DOM');
  
  // Test CSS animations
  const computedStyle = window.getComputedStyle(welcomeBox);
  console.log(`📱 WelcomeBox opacity: ${computedStyle.opacity}`);
  console.log(`🎨 WelcomeBox transform: ${computedStyle.transform}`);
  
  // Test clickability
  if (computedStyle.cursor === 'pointer' || computedStyle.pointerEvents !== 'none') {
    console.log('✅ WelcomeBox is clickable');
  } else {
    console.log('❌ WelcomeBox may not be clickable');
  }
} else {
  console.log('❌ WelcomeBox not found - check rendering');
}

// Test 3: Check Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      console.log('✅ Service Worker registered');
      console.log(`🔧 SW State: ${registration.active?.state || 'inactive'}`);
    } else {
      console.log('⚠️ Service Worker not registered');
    }
  });
}

// Test 4: Check for Cache System
setTimeout(() => {
  if (window.lunaCache) {
    console.log('✅ Luna Cache system available');
    window.lunaCache.getCacheStats().then(stats => {
      console.log('📊 Cache Stats:', stats);
    }).catch(() => {
      console.log('⚠️ Cache stats unavailable');
    });
  } else {
    console.log('ℹ️ Cache system not yet loaded (normal for optimized loading)');
  }
}, 3000);

// Test 5: Animation Performance
const testElement = welcomeBox;
if (testElement) {
  const startTime = performance.now();
  
  // Trigger a style change to test rendering performance
  testElement.style.transform = 'translateY(-5px)';
  
  requestAnimationFrame(() => {
    const endTime = performance.now();
    const animationTime = endTime - startTime;
    
    console.log(`🎬 Animation Response Time: ${animationTime.toFixed(2)}ms`);
    
    if (animationTime < 16) {
      console.log('✅ Smooth animations (60fps capable)');
    } else if (animationTime < 33) {
      console.log('⚠️ Moderate animation performance (30fps)');
    } else {
      console.log('❌ Slow animations - may cause jank');
    }
    
    // Reset transform
    testElement.style.transform = '';
  });
}

console.log('===================================');
console.log('🎯 Test completed! Check results above.');

// Bonus: Add keyboard shortcut to toggle cache status
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    if (window.lunaCache) {
      window.lunaCache.getCacheStats().then(stats => {
        console.log('🔍 Current Cache Status:', stats);
      });
    } else {
      console.log('⚠️ Cache system not available');
    }
  }
});

console.log('💡 Tip: Press Ctrl+Shift+C to check cache status anytime');
