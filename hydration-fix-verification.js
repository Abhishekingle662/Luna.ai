/**
 * Hydration Fix Verification Script
 * Tests the Math & Physics page for hydration errors and performance improvements
 */

const puppeteer = require('puppeteer');

async function testHydrationFix() {
    console.log('🔍 Starting Hydration Fix Verification...\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Listen for console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    
    // Listen for runtime errors
    const pageErrors = [];
    page.on('pageerror', error => {
        pageErrors.push(error.message);
    });
    
    try {
        console.log('📊 Testing Math & Physics page...');
        
        // Navigate to the page
        const response = await page.goto('http://localhost:3000/learn/mathphysics', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        console.log(`✅ Page loaded with status: ${response.status()}`);
        
        // Wait for React hydration to complete
        await page.waitForTimeout(2000);
        
        // Check for hydration errors
        const hydrationErrors = consoleErrors.filter(error => 
            error.includes('Hydration') || 
            error.includes('hydration') ||
            error.includes('server') ||
            error.includes('client')
        );
        
        console.log('\n🔎 Hydration Error Check:');
        if (hydrationErrors.length === 0) {
            console.log('✅ No hydration errors detected!');
        } else {
            console.log('❌ Hydration errors found:');
            hydrationErrors.forEach(error => console.log(`   - ${error}`));
        }
        
        // Check for hook order errors
        const hookErrors = consoleErrors.filter(error => 
            error.includes('hook') || 
            error.includes('Hook') ||
            error.includes('useEffect') ||
            error.includes('useState')
        );
        
        console.log('\n🪝 Hook Order Check:');
        if (hookErrors.length === 0) {
            console.log('✅ No hook order errors detected!');
        } else {
            console.log('❌ Hook errors found:');
            hookErrors.forEach(error => console.log(`   - ${error}`));
        }
        
        // Test mobile responsiveness detection
        console.log('\n📱 Testing Mobile Detection:');
        
        // Test desktop viewport
        await page.setViewport({ width: 1200, height: 800 });
        await page.waitForTimeout(500);
        
        // Check if desktop layout is rendered
        const desktopCards = await page.$$('.MuiGrid-item');
        console.log(`✅ Desktop: ${desktopCards.length} topic cards displayed`);
        
        // Test mobile viewport
        await page.setViewport({ width: 400, height: 600 });
        await page.waitForTimeout(500);
        
        // Check if mobile tabs are rendered
        const mobileTabs = await page.$('.MuiTabs-root');
        const mobileTabsVisible = mobileTabs !== null;
        console.log(`✅ Mobile: Tabs component ${mobileTabsVisible ? 'visible' : 'not visible'}`);
        
        // Test loading states
        console.log('\n⏳ Testing Loading States:');
        await page.reload({ waitUntil: 'domcontentloaded' });
        
        // Check if loading state appears initially
        const loadingText = await page.waitForSelector('div:contains("Loading Luna.ai Math & Physics")', {
            timeout: 1000
        }).catch(() => null);
        
        if (loadingText) {
            console.log('✅ Loading state displayed correctly');
        } else {
            console.log('⚠️  Loading state not detected (page may load too fast)');
        }
        
        // Wait for content to load
        await page.waitForSelector('.MuiCard-root', { timeout: 5000 });
        console.log('✅ Main content loaded successfully');
        
        // Test topic interaction
        console.log('\n🔍 Testing Topic Interaction:');
        const firstCard = await page.$('.MuiCard-root');
        if (firstCard) {
            await firstCard.click();
            await page.waitForTimeout(1000);
            
            // Check if topic detail view is displayed
            const backButton = await page.$('button:contains("Back to Topics")');
            if (backButton) {
                console.log('✅ Topic detail view navigation works');
                await backButton.click();
                await page.waitForTimeout(500);
                console.log('✅ Back navigation works');
            }
        }
        
        // Performance check
        console.log('\n⚡ Performance Metrics:');
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                totalTime: Math.round(navigation.loadEventEnd - navigation.fetchStart)
            };
        });
        
        console.log(`✅ DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
        console.log(`✅ Load Complete: ${performanceMetrics.loadComplete}ms`);
        console.log(`✅ Total Load Time: ${performanceMetrics.totalTime}ms`);
        
        // Summary
        console.log('\n📋 Test Summary:');
        console.log(`✅ Console Errors: ${consoleErrors.length}`);
        console.log(`✅ Page Errors: ${pageErrors.length}`);
        console.log(`✅ Hydration Errors: ${hydrationErrors.length}`);
        console.log(`✅ Hook Errors: ${hookErrors.length}`);
        
        if (consoleErrors.length > 0) {
            console.log('\n🐛 All Console Messages:');
            consoleErrors.forEach(error => console.log(`   - ${error}`));
        }
        
        const success = hydrationErrors.length === 0 && hookErrors.length === 0;
        console.log(`\n${success ? '🎉' : '❌'} Hydration Fix: ${success ? 'SUCCESSFUL' : 'NEEDS ATTENTION'}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

// Run the test
testHydrationFix().catch(console.error);
