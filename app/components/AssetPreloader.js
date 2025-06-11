'use client'
import { useEffect } from 'react'

// List of assets to preload and cache
const ASSETS_TO_PRELOAD = [
  { url: '/models/moon.glb', type: 'model', priority: 'high' },
  // Add more assets here as needed
  // { url: '/textures/stars.jpg', type: 'texture', priority: 'low' },
]

export default function AssetPreloader() {
  useEffect(() => {
    // Delay preloading to not block initial render
    const timer = setTimeout(async () => {
      // Only run on client-side
      if (typeof window === 'undefined') {
        return
      }

      // Dynamically import asset cache to avoid SSR issues
      let assetCache
      try {
        const { default: cache } = await import('../utils/assetCache')
        assetCache = cache
      } catch (error) {
        console.warn('Failed to load asset cache:', error)
        return
      }

      console.log('🚀 Starting background asset preloading...')

      // Sort by priority (high priority first)
      const sortedAssets = ASSETS_TO_PRELOAD.sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 }
        return (priorities[b.priority] || 1) - (priorities[a.priority] || 1)
      })

      // Load assets in background without blocking UI
      for (const asset of sortedAssets) {
        try {
          await assetCache.preloadAsset(asset.url, asset.type)
          console.log(`✅ Background cached: ${asset.url}`)
        } catch (error) {
          console.warn(`❌ Failed to cache ${asset.url}:`, error)
        }
      }

      // Log cache statistics
      try {
        const stats = await assetCache.getCacheStats()
        console.log('📊 Asset Cache Statistics:', stats)
      } catch (error) {
        console.warn('Failed to get cache stats:', error)
      }
    }, 2000) // 2 second delay to allow initial render

    return () => clearTimeout(timer)
  }, [])

  // Don't render anything - this runs in background
  return null
}
