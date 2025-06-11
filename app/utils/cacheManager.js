// Cache management utilities
import assetCache from './assetCache'

export class CacheManager {
  constructor() {
    this.maxCacheAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    this.maxCacheSize = 100 // Maximum number of cached items
  }

  // Initialize cache management
  async init() {
    await this.cleanup()
    this.startPeriodicCleanup()
  }

  // Clean up old cache entries
  async cleanup() {
    try {
      const now = Date.now()
      const cacheKeys = await this.getCacheKeys()
      
      for (const key of cacheKeys) {
        const metadata = await this.getCacheMetadata(key)
        if (metadata && (now - metadata.timestamp) > this.maxCacheAge) {
          await this.removeFromCache(key)
          console.log(`Removed expired cache entry: ${key}`)
        }
      }

      // If cache is still too large, remove oldest entries
      const remainingKeys = await this.getCacheKeys()
      if (remainingKeys.length > this.maxCacheSize) {
        const sortedKeys = await this.sortKeysByAge(remainingKeys)
        const keysToRemove = sortedKeys.slice(this.maxCacheSize)
        
        for (const key of keysToRemove) {
          await this.removeFromCache(key)
          console.log(`Removed cache entry due to size limit: ${key}`)
        }
      }
    } catch (error) {
      console.warn('Error during cache cleanup:', error)
    }
  }

  // Start periodic cleanup (every hour)
  startPeriodicCleanup() {
    setInterval(() => {
      this.cleanup()
    }, 60 * 60 * 1000) // 1 hour
  }

  // Get all cache keys
  async getCacheKeys() {
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open('luna-ai-assets-v1')
        const requests = await cache.keys()
        return requests.map(req => req.url)
      } catch (error) {
        console.warn('Error getting cache keys:', error)
        return []
      }
    }
    return []
  }

  // Get cache metadata
  async getCacheMetadata(key) {
    try {
      const metadata = localStorage.getItem(`cache_meta_${key}`)
      return metadata ? JSON.parse(metadata) : null
    } catch (error) {
      return null
    }
  }

  // Set cache metadata
  async setCacheMetadata(key, metadata) {
    try {
      localStorage.setItem(`cache_meta_${key}`, JSON.stringify({
        ...metadata,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('Error setting cache metadata:', error)
    }
  }

  // Remove from cache
  async removeFromCache(key) {
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open('luna-ai-assets-v1')
        await cache.delete(key)
        localStorage.removeItem(`cache_meta_${key}`)
      } catch (error) {
        console.warn('Error removing from cache:', error)
      }
    }
  }

  // Sort keys by age (oldest first)
  async sortKeysByAge(keys) {
    const keyData = await Promise.all(
      keys.map(async (key) => ({
        key,
        metadata: await this.getCacheMetadata(key)
      }))
    )

    return keyData
      .sort((a, b) => {
        const aTime = a.metadata?.timestamp || 0
        const bTime = b.metadata?.timestamp || 0
        return aTime - bTime
      })
      .map(item => item.key)
  }

  // Get cache size in bytes (approximation)
  async getCacheSize() {
    let totalSize = 0
    
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open('luna-ai-assets-v1')
        const requests = await cache.keys()
        
        for (const request of requests) {
          const response = await cache.match(request)
          if (response) {
            const blob = await response.blob()
            totalSize += blob.size
          }
        }
      } catch (error) {
        console.warn('Error calculating cache size:', error)
      }
    }
    
    return totalSize
  }

  // Clear all caches
  async clearAll() {
    await assetCache.clearAllCaches()
    
    // Clear metadata
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('cache_meta_')) {
        localStorage.removeItem(key)
      }
    })
    
    console.log('All caches cleared')
  }

  // Get detailed cache report
  async getReport() {
    const keys = await this.getCacheKeys()
    const size = await this.getCacheSize()
    const stats = await assetCache.getCacheStats()
    
    return {
      totalEntries: keys.length,
      totalSize: this.formatBytes(size),
      memoryCache: stats.memoryCache,
      persistentCache: stats.persistentCache,
      lastCleanup: localStorage.getItem('luna_last_cleanup') || 'Never',
      entries: keys.slice(0, 10) // First 10 entries for debugging
    }
  }

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Create singleton instance
const cacheManager = new CacheManager()

// Initialize when browser is ready
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    cacheManager.init()
  })
  
  // Expose for debugging
  window.lunaCache = {
    manager: cacheManager,
    clear: () => cacheManager.clearAll(),
    report: () => cacheManager.getReport(),
    cleanup: () => cacheManager.cleanup()
  }
}

export default cacheManager
