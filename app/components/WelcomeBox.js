import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Keyframes for twinkling and glowing effects
const twinkleKeyframes = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes lunarGlow {
    0% { text-shadow: 0 0 10px rgba(240, 246, 252, 0.5); }
    50% { text-shadow: 0 0 20px rgba(240, 246, 252, 0.8), 0 0 30px rgba(240, 246, 252, 0.4); }
    100% { text-shadow: 0 0 10px rgba(240, 246, 252, 0.5); }
  }
`;

// Inject styles into head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = twinkleKeyframes;
  document.head.appendChild(style);
}

export default function WelcomeBox() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Prefetch the chat route on component mount for faster navigation
  useEffect(() => {
    router.prefetch('/chat')
  }, [router])

  const handleChatRedirect = () => {
    setIsLoading(true)
    // Use window.location as fallback to ensure proper navigation
    try {
      router.push('/chat')
    } catch (error) {
      console.error('Router navigation failed:', error)
      window.location.href = '/chat'
    }
  }

  const style = {
    position: 'absolute',
    top: '5%',
    right: '5%',
    background: 'rgba(36, 41, 46, 0.9)',
    color: '#f0f6fc',
    padding: '1.5rem 2rem',
    borderRadius: '12px',
    fontFamily: 'Space Grotesk, sans-serif',
    textAlign: 'center',
    lineHeight: 1.4,
    cursor: 'pointer',
    border: '1px solid rgba(240, 246, 252, 0.3)',
    boxShadow: '0 4px 20px rgba(240, 246, 252, 0.2), 0 0 10px rgba(240, 246, 252, 0.1)',
    transition: 'all 0.3s ease',
    maxWidth: '280px',
    zIndex: 10
  }
  const hoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 30px rgba(240, 246, 252, 0.4), 0 0 20px rgba(240, 246, 252, 0.3)',
    border: '1px solid rgba(240, 246, 252, 0.6)',
    textShadow: '0 0 10px rgba(240, 246, 252, 0.5)'
  }
  return (
    <motion.div
      style={style}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={hoverStyle}
      onClick={handleChatRedirect}
    >
      {isLoading ? (        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px solid rgba(240, 246, 252, 0.3)',
            borderTop: '2px solid #f0f6fc',
            borderRadius: '50%',
            marginBottom: '0.5rem',
            animation: 'spin 1s linear infinite'
          }} className="spinner" />
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Loading Luna.ai...</div>
        </div>
      ) : (        <>          <div style={{ marginBottom: '0.5rem' }}>Welcome to</div>
          <div style={{ 
            fontSize: '2rem', 
            color: '#f0f6fc', 
            marginBottom: '0.5rem',
            textShadow: '0 0 10px rgba(240, 246, 252, 0.7), 0 0 20px rgba(240, 246, 252, 0.3)',
            animation: 'twinkle 1.5s infinite'
          }}>Luna.ai</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '300', marginBottom: '0.5rem' }}>
            Click to start your cosmic journey
          </div>          <div style={{ fontSize: '0.75rem', opacity: 0.7, fontStyle: 'italic' }}>
            🌙 Drag to rotate the Moon!
          </div>
        </>)}
    </motion.div>
  )
}
