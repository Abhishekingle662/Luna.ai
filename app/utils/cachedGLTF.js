import { useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import assetCache from './assetCache'

// Enhanced useGLTF hook with caching
export function useCachedGLTF(url) {
  const [cachedUrl, setCachedUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadModel = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to get from cache first
        const cached = await assetCache.get(url, 'model')
        
        if (cached && mounted) {
          setCachedUrl(cached)
          setIsLoading(false)
          return
        }

        // If not cached, preload and cache it
        const preloaded = await assetCache.preloadAsset(url, 'model')
        
        if (preloaded && mounted) {
          setCachedUrl(preloaded)
        } else if (mounted) {
          // Fallback to original URL if caching fails
          setCachedUrl(url)
        }
        
        if (mounted) {
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err)
          setCachedUrl(url) // Fallback to original URL
          setIsLoading(false)
        }
      }
    }

    loadModel()

    return () => {
      mounted = false
    }
  }, [url])

  // Use the original useGLTF with either cached URL or original URL
  const gltf = useGLTF(cachedUrl || url)

  return {
    ...gltf,
    isLoading,
    error,
    isCached: !!cachedUrl && cachedUrl !== url
  }
}

// Preload function that works with the cache
export async function preloadGLTF(url) {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return url
  }

  try {
    const cached = await assetCache.get(url, 'model')
    if (cached) {
      useGLTF.preload(cached)
      return cached
    }

    const preloaded = await assetCache.preloadAsset(url, 'model')
    if (preloaded) {
      useGLTF.preload(preloaded)
      return preloaded
    }

    // Fallback to original preload
    useGLTF.preload(url)
    return url
  } catch (error) {
    console.warn('Error preloading GLTF:', error)
    useGLTF.preload(url)
    return url
  }
}
