'use client'
import { useEffect } from 'react'
import assetCache from '../utils/assetCache'

// List of assets to preload and cache
const ASSETS_TO_PRELOAD = [
  { url: '/models/moon.glb', type: 'model', priority: 'high' },
  // Add more assets here as needed
]

export default function AssetPreloaderFixed() {
  useEffect(() => {
    // Delay preloading to not block initial render
    const timer = setTimeout(async () => {
      // Only run on client-side
      if (typeof window === 'undefined') {
        return
      }

      console.log('🚀 Starting background asset preloading...')

      // Sort by priority (high priority first)
      const sortedAssets = ASSETS_TO_PRELOAD.sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 }
        return (priorities[b.priority] || 1) - (priorities[a.priority] || 1)
      })

      // Preload assets in order
      for (const asset of sortedAssets) {
        try {
          const cached = await assetCache.preloadAsset(asset.url, asset.type)
          if (cached) {
            console.log(`✅ Cached ${asset.type}: ${asset.url}`)
          } else {
            console.log(`⚠️ Failed to cache ${asset.type}: ${asset.url}`)
          }
        } catch (error) {
          console.warn(`Failed to preload ${asset.url}:`, error)
        }
      }

      console.log('🎯 Background asset preloading complete')
    }, 2000) // 2 second delay

    return () => clearTimeout(timer)
  }, [])

  // Don't render anything - this runs in background
  return null
}
