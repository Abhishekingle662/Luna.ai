// Enhanced caching utility for 3D models and other assets
class AssetCache {
  constructor() {
    this.cache = new Map()
    this.persistentCache = null
    this.initPersistentCache()
  }

  async initPersistentCache() {
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        this.persistentCache = await caches.open('luna-ai-assets-v1')
      } catch (error) {
        console.warn('Cache API not available:', error)
      }
    }
  }

  // Cache key generator for models
  generateCacheKey(url, type = 'model') {
    return `${type}_${url}`
  }

  // Get from memory cache first, then persistent cache
  async get(url, type = 'model') {
    const key = this.generateCacheKey(url, type)
    
    // Try memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    // Try persistent cache (Cache API)
    if (this.persistentCache) {
      try {
        const response = await this.persistentCache.match(url)
        if (response) {
          const blob = await response.blob()
          const objectUrl = URL.createObjectURL(blob)
          
          // Store in memory cache for faster subsequent access
          this.cache.set(key, objectUrl)
          return objectUrl
        }
      } catch (error) {
        console.warn('Error accessing persistent cache:', error)
      }
    }

    return null
  }

  // Store in both memory and persistent cache
  async set(url, data, type = 'model') {
    const key = this.generateCacheKey(url, type)
    
    // Store in memory cache
    this.cache.set(key, data)

    // Store in persistent cache
    if (this.persistentCache && typeof data === 'string' && data.startsWith('blob:')) {
      try {
        const response = await fetch(data)
        const clonedResponse = response.clone()
        await this.persistentCache.put(url, clonedResponse)
      } catch (error) {
        console.warn('Error storing in persistent cache:', error)
      }
    }
  }

  // Preload and cache multiple assets
  async preloadAssets(assets) {
    const promises = assets.map(asset => this.preloadAsset(asset.url, asset.type))
    return Promise.allSettled(promises)
  }
  // Preload a single asset
  async preloadAsset(url, type = 'model') {
    // Only run on client-side
    if (typeof window === 'undefined') {
      console.warn('Asset caching is only available on client-side')
      return null
    }

    const cached = await this.get(url, type)
    if (cached) {
      return cached
    }

    try {
      // Resolve relative URLs to absolute URLs
      const absoluteUrl = new URL(url, window.location.origin).href
      
      const response = await fetch(absoluteUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${absoluteUrl}: ${response.statusText}`)
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      await this.set(url, objectUrl, type)
      return objectUrl
    } catch (error) {
      console.error('Error preloading asset:', error)
      return null
    }
  }

  // Clear memory cache (keep persistent cache)
  clearMemoryCache() {
    // Clean up blob URLs to prevent memory leaks
    this.cache.forEach(value => {
      if (typeof value === 'string' && value.startsWith('blob:')) {
        URL.revokeObjectURL(value)
      }
    })
    this.cache.clear()
  }

  // Clear all caches
  async clearAllCaches() {
    this.clearMemoryCache()
    
    if (this.persistentCache) {
      try {
        const keys = await this.persistentCache.keys()
        await Promise.all(keys.map(key => this.persistentCache.delete(key)))
      } catch (error) {
        console.warn('Error clearing persistent cache:', error)
      }
    }
  }

  // Get cache statistics
  async getCacheStats() {
    const memorySize = this.cache.size
    let persistentSize = 0
    
    if (this.persistentCache) {
      try {
        const keys = await this.persistentCache.keys()
        persistentSize = keys.length
      } catch (error) {
        console.warn('Error getting persistent cache stats:', error)
      }
    }
    
    return {
      memoryCache: memorySize,
      persistentCache: persistentSize,
      total: memorySize + persistentSize
    }
  }
}

// Create singleton instance
const assetCache = new AssetCache()

// Export for use in components
export default assetCache

// Hook for React components
export function useAssetCache() {
  return assetCache
}
