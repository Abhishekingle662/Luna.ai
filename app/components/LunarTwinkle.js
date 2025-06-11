'use client'
import React, { useEffect, useState } from 'react'

export default function LunarTwinkle() {
  const [stars, setStars] = useState([])

  useEffect(() => {
    // Generate random twinkling stars
    const generateStars = () => {
      const newStars = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: 1 + Math.random() * 3,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2
      }))
      setStars(newStars)
    }

    generateStars()
  }, [])

  const starStyle = (star) => ({
    position: 'fixed',
    top: `${star.top}%`,
    left: `${star.left}%`,
    width: `${star.size}px`,
    height: `${star.size}px`,
    backgroundColor: '#f0f6fc',
    borderRadius: '50%',
    opacity: 0.6,
    animation: `lunarTwinkle ${star.duration}s infinite ${star.delay}s ease-in-out`,
    boxShadow: `0 0 ${star.size * 2}px rgba(240, 246, 252, 0.4)`,
    zIndex: 1,
    pointerEvents: 'none'
  })

  // Inject CSS animation keyframes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('lunar-twinkle-styles')
      if (!existingStyle) {
        const style = document.createElement('style')
        style.id = 'lunar-twinkle-styles'
        style.textContent = `
          @keyframes lunarTwinkle {
            0%, 100% { 
              opacity: 0.3; 
              transform: scale(0.8);
              box-shadow: 0 0 2px rgba(240, 246, 252, 0.3);
            }
            50% { 
              opacity: 1; 
              transform: scale(1.2);
              box-shadow: 0 0 10px rgba(240, 246, 252, 0.8);
            }
          }
          
          @keyframes lunarGlow {
            0% { 
              text-shadow: 0 0 10px rgba(240, 246, 252, 0.5);
            }
            50% { 
              text-shadow: 0 0 20px rgba(240, 246, 252, 0.8), 0 0 30px rgba(240, 246, 252, 0.4);
            }
            100% { 
              text-shadow: 0 0 10px rgba(240, 246, 252, 0.5);
            }
          }

          @keyframes lunarPulse {
            0% { 
              box-shadow: 0 0 5px rgba(240, 246, 252, 0.4);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 20px rgba(240, 246, 252, 0.8);
              transform: scale(1.02);
            }
            100% { 
              box-shadow: 0 0 5px rgba(240, 246, 252, 0.4);
              transform: scale(1);
            }
          }

          .lunar-glow {
            animation: lunarGlow 3s ease-in-out infinite;
          }

          .lunar-pulse {
            animation: lunarPulse 4s ease-in-out infinite;
          }

          .lunar-text-glow {
            text-shadow: 0 0 10px rgba(240, 246, 252, 0.5);
          }
        `
        document.head.appendChild(style)
      }
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {stars.map((star) => (
        <div key={star.id} style={starStyle(star)} />
      ))}
    </div>
  )
}
