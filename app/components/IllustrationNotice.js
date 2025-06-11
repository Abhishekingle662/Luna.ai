import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Keyframes for pulsing animation
const pulseKeyframes = `
  @keyframes interaction-pulse {
    0% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
    100% { opacity: 0.7; transform: scale(1); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 0.9; transform: translateY(0); }
  }
`;

// Inject styles into head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

export default function IllustrationNotice() {
  const [isVisible, setIsVisible] = useState(true)
  const [mouseActivity, setMouseActivity] = useState(false)

  // Hide hints after user shows mouse activity or after 10 seconds
  useEffect(() => {
    const handleMouseMove = () => {
      setMouseActivity(true)
      // Auto-hide after user moves mouse
      setTimeout(() => setIsVisible(false), 3000)
    }

    // Auto-hide after 10 seconds
    const autoHideTimer = setTimeout(() => setIsVisible(false), 10000)

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(autoHideTimer)
    }
  }, [])

  if (!isVisible) return null
  const style = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    background: 'rgba(36, 41, 46, 0.85)',
    color: '#f0f6fc',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    fontFamily: 'Space Grotesk, sans-serif',
    textAlign: 'left',
    lineHeight: 1.4,
    border: '1px solid rgba(240, 246, 252, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(240, 246, 252, 0.1)',
    transition: 'all 0.3s ease',
    maxWidth: '280px',
    zIndex: 10,
    animation: 'fade-in 0.5s ease-out, interaction-pulse 3s infinite ease-in-out',
    backdropFilter: 'blur(10px)'
  }

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.8rem',
    color: '#f0f6fc',
    textShadow: '0 0 5px rgba(240, 246, 252, 0.5)'
  }

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.9, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}    >      <div style={titleStyle}>📍 Illustration Notice</div>
      
      <div style={{
        fontSize: '0.8rem',
        lineHeight: '1.4',
        opacity: 0.9,
        textAlign: 'left'
      }}>
        The Moon, Earth, and other celestial objects are not to scale and are positioned for illustration purposes only.
      </div>
      
      <div style={{
        fontSize: '0.7rem',
        marginTop: '0.8rem',
        opacity: 0.6,
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Interactive 3D visualization
      </div>
    </motion.div>
  )
}
