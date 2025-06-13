import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Image } from 'lucide-react';

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
  @keyframes logoRotate {
    0% { transform: rotateY(0deg) rotateX(-5deg); }
    100% { transform: rotateY(360deg) rotateX(-5deg); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  const [scrollProgress, setScrollProgress] = useState(0)
  // Track scroll progress for hiding/showing the WelcomeBox
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      const progress = window.scrollY / max
      setScrollProgress(progress)
      
      // Debug logging for scroll interactions
      if (progress > 0.8 && scrollProgress <= 0.8) {
        console.log('🌙 WelcomeBox hiding - Luna Avatar appearing!')
      } else if (progress <= 0.8 && scrollProgress > 0.8) {
        console.log('👋 WelcomeBox reappearing - Luna Avatar hiding!')
      }
    }
    
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollProgress])

  // Prefetch the chat route on component mount for faster navigation
  useEffect(() => {
    router.prefetch('/chat')
  }, [router])

  const handleChatRedirect = () => {
    setIsLoading(true)
    try {
      router.push('/chat')
    } catch (error) {
      console.error('Router navigation failed:', error)
      window.location.href = '/chat'
    }
  }

  // Minimal Luna.ai Logo styles
  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem'
  }

  const logoStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '0.5rem',
    boxShadow: '0 0 10px rgba(240, 246, 252, 0.3)',
    animation: 'logoRotate 12s linear infinite',
    border: '1px solid rgba(240, 246, 252, 0.2)'
  }


  const containerStyle = {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    background: 'rgba(15, 20, 25, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(240, 246, 252, 0.15)',
    borderRadius: '16px',
    padding: '1.25rem 1.5rem',
    fontFamily: 'Space Grotesk, sans-serif',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',    zIndex: 10,
    minWidth: '200px',
    maxWidth: '240px'
  }
  
  const hoverStyle = {
    transform: 'translateY(-2px)',
    background: 'rgb(128, 128, 128)',
    border: '1px solid rgba(240, 246, 252, 0.3)',
    boxShadow: '0 8px 32px rgba(240, 246, 252, 0.15)',
    color: 'black',
  }  // Hide WelcomeBox when Luna Avatar appears (80% scroll progress)
  const shouldHide = scrollProgress > 0.8

  return (
    <motion.div
      style={{
        ...containerStyle,
        pointerEvents: shouldHide ? 'none' : 'auto'
      }}
      whileHover={shouldHide ? {} : hoverStyle}
      onClick={shouldHide ? undefined : handleChatRedirect}
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: shouldHide ? 0 : 1, 
        y: shouldHide ? -20 : 0,
        scale: shouldHide ? 0.9 : 1
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut"
      }}
    >
      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          color: '#f0f6fc'
        }}>
          <div style={{ 
            width: '16px', 
            height: '16px', 
            border: '2px solid rgba(240, 246, 252, 0.3)',
            borderTop: '2px solid #f0f6fc',
            borderRadius: '50%',
            marginBottom: '0.5rem',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Starting...</div>
        </div>
      ) : (
        <>
          <div style={logoContainerStyle}>
            <Img
              src="/favicon_io/android-chrome-192x192.png" 
              alt="Luna.ai" 
              style={logoStyle}
            />
            <span style={{ 
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#f0f6fc',
              letterSpacing: '0.5px'
            }}>Luna.ai</span>
          </div>
          
          <div style={{ 
            fontSize: '0.8rem',
            color: 'rgba(240, 246, 252, 0.8)',
            marginBottom: '0.75rem',
            lineHeight: '1.3'
          }}>
            Start your cosmic journey
          </div>
          
          <div style={{ 
            fontSize: '0.7rem',
            color: 'rgba(240, 246, 252, 0.6)',
            fontStyle: 'italic'
          }}>
            Click to explore →
          </div>
        </>
      )}
    </motion.div>
  )
}
