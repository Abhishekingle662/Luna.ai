'use client'
import { useState, useEffect } from 'react'

export default function CacheStatus() {
  const [stats, setStats] = useState(null)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    // Only show in development
    const isDev = process.env.NODE_ENV === 'development'
    if (!isDev) return

    setShowStats(true)

    const updateStats = async () => {
      // Only try to get stats if window.lunaCache is available
      if (typeof window !== 'undefined' && window.lunaCache) {
        try {
          const cacheStats = await window.lunaCache.getCacheStats()
          setStats(cacheStats)
        } catch (error) {
          // Ignore errors
          setStats(null)
        }
      }
    }

    // Initial update after a delay
    const timer = setTimeout(updateStats, 2000)
    
    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  if (!showStats || !stats) return null
  const cacheEfficiency = stats.totalAssets > 0 ? 
    ((stats.memoryCache.size + stats.persistentCache.size) / stats.totalAssets * 100).toFixed(1) : 0;
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'rgba(36, 41, 46, 0.9)',
      color: '#f0f6fc',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontFamily: 'Space Grotesk, monospace',
      zIndex: 1000,
      border: '1px solid rgba(240, 246, 252, 0.3)',
      boxShadow: '0 4px 10px rgba(240, 246, 252, 0.1)',
      minWidth: '160px'
    }}>
      <div style={{ color: '#f0f6fc', fontWeight: 'bold', marginBottom: '4px' }}>
        Cache Status
      </div>
      <div>Memory: {stats.memoryCache?.size || 0} assets</div>
      <div>Persistent: {stats.persistentCache?.size || 0} assets</div>
      <div>Total: {stats.totalAssets || 0}</div>      <div style={{ 
        color: cacheEfficiency > 0 ? '#c8d1d9' : '#f0f6fc',
        marginTop: '4px'
      }}>
        Efficiency: {cacheEfficiency}%
      </div>
      <button
        onClick={() => setShowStats(false)}        style={{
          background: 'none',
          border: '1px solid #3d444c',
          color: '#f0f6fc',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '10px',
          marginTop: '4px',
          cursor: 'pointer'
        }}
      >
        Hide
      </button>
    </div>
  )
}
