// Enhanced service worker for caching chat resources and 3D models
const CACHE_NAME = 'luna-ai-v3'
const ASSETS_CACHE = 'luna-assets-v2'
const CHAT_CACHE = 'luna-chat-v2'

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/chat',
  '/_next/static/css/app/chat/page.css',
  '/_next/static/chunks/app/chat/page.js'
]

// 3D models and heavy assets to cache
const ASSET_RESOURCES = [
  '/models/moon.glb',
  '/images/subtle-space-bg.png',
  '/images/subtle-stars-bg.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CHAT_CACHE).then((cache) => {
        return cache.addAll(STATIC_RESOURCES).catch(err => {
          console.warn('Failed to cache some static resources:', err)
        })
      }),
      // Cache 3D models and assets
      caches.open(ASSETS_CACHE).then((cache) => {
        return cache.addAll(ASSET_RESOURCES).catch(err => {
          console.warn('Failed to cache some assets:', err)
        })
      })
    ])
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== ASSETS_CACHE && cacheName !== CHAT_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Take control of all pages
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle 3D models and assets
  if (url.pathname.includes('/models/') || url.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            console.log('Serving asset from cache:', url.pathname)
            return response
          }
          
          // If not in cache, fetch and cache it
          return fetch(request).then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone())
              console.log('Cached new asset:', url.pathname)
            }
            return response
          }).catch(err => {
            console.warn('Failed to fetch asset:', url.pathname, err)
            // Return a fallback or let it fail gracefully
            throw err
          })
        })
      })
    )
    return
  }

  // Handle chat resources
  if (url.pathname.includes('/chat')) {
    event.respondWith(
      caches.open(CHAT_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            console.log('Serving chat resource from cache:', url.pathname)
            return response
          }
          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone())
            }
            return response
          })
        })
      })
    )
    return
  }

  // For all other requests, use network first, then cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request)
    })
  )
})
