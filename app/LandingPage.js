'use client'
import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import Moon from './components/Moon'
import Earth from './components/Earth'
import Starfield from './components/Starfield'
import WelcomeBox from './components/WelcomeBox'
import ScrollCamera from './components/ScrollCamera'
import InteractionHints from './components/IllustrationNotice'
import Navigation from './components/Navigation'

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  // Add pulse animation for Luna Focus Mode indicator
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }
    }
  }, [])  // Track scroll progress for hiding/showing content
  useEffect(() => {
    let maxScrollPosition = null
    const LUNA_THRESHOLD = 1

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      const progress = window.scrollY / max
      
      // Set maximum scroll position when reaching Luna threshold
      if (progress >= LUNA_THRESHOLD && maxScrollPosition === null) {
        maxScrollPosition = window.scrollY
        console.log('🔒 Luna Avatar revealed - scroll limit set at:', maxScrollPosition)
      }
      
      // Allow scrolling back up, but prevent going beyond Luna reveal point
      if (maxScrollPosition !== null && window.scrollY > maxScrollPosition) {
        window.scrollTo(0, maxScrollPosition)
        setScrollProgress(LUNA_THRESHOLD)
        return
      }
      
      // Reset max position if scrolling back up significantly
      if (progress < LUNA_THRESHOLD - 0.05) {
        maxScrollPosition = null
        console.log('🔓 Scroll limit removed - returning to normal scrolling')
      }
      
      // Update scroll progress - allow it to exceed LUNA_THRESHOLD for UI state management
      setScrollProgress(progress)
      
      // Debug logging for text content transitions
      if (progress > LUNA_THRESHOLD && scrollProgress <= LUNA_THRESHOLD) {
        console.log('📝 Landing page text hiding - Luna Avatar focus mode!')
      } else if (progress <= LUNA_THRESHOLD && scrollProgress > LUNA_THRESHOLD) {
        console.log('📖 Landing page text reappearing!')
      }
    }

    const onWheel = (e) => {
      const max = document.body.scrollHeight - window.innerHeight
      const progress = window.scrollY / max
      
      // Only prevent wheel events when trying to scroll down past Luna threshold
      if (progress >= LUNA_THRESHOLD && e.deltaY > 0) {
        e.preventDefault()
        return false
      }
    }

    const onKeyDown = (e) => {
      const max = document.body.scrollHeight - window.innerHeight
      const progress = window.scrollY / max
      
      if (progress >= LUNA_THRESHOLD) {
        if (e.key === 'Escape') {
          // Allow Escape key to exit Luna focus mode
          const targetPosition = window.scrollY - 200
          window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' })
          console.log('⌨️ User pressed Escape to exit Luna focus mode')
          return
        }
        // Only prevent keys that would scroll down
        if (['ArrowDown', 'PageDown', 'End', ' '].includes(e.key)) {
          e.preventDefault()
          return false
        }
      }
    }

    const onTouchMove = (e) => {
      const max = document.body.scrollHeight - window.innerHeight
      const progress = window.scrollY / max
      
      // Only prevent touch events when at Luna threshold and trying to scroll down
      if (progress >= LUNA_THRESHOLD) {
        const touch = e.touches[0]
        if (touch && touch.clientY < window.innerHeight / 2) {
          // User is swiping down (finger moving up)
          e.preventDefault()
          return false
        }
      }
    }    
    window.addEventListener('scroll', onScroll)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [scrollProgress])
  return (
    <div>
      <Navigation />
      {/* sticky 3D scene + overlays */}
      <section
        style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          zIndex: 0
        }}
      >        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}
        >          <color attach="background" args={['#000']} />
          <Starfield 
            scale={15} 
            position={[-15, -20, 20]} 
            rotation={[0, 0, 0]}
            autoRotate={true}
            rotationSpeed={0.0008}
          />          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
            {/* Additional soft lighting for Luna's appearance - moved closer to center */}
          <pointLight position={[0, 0, 2]} intensity={0.3} color="#87ceeb" distance={3} decay={2} />          {/* Position Moon much closer to camera and centered for better focus */}
          <Moon position={[0, 0, 2]} scale={1.2} />
          
          <Earth position={[-250.0, -10.0, -250.0]} scale={0.4} />
          
          {/* Custom scroll-driven camera controller */}
          <ScrollCamera />        </Canvas>

        <WelcomeBox />
        <InteractionHints />      </section>

      {/* actual page content for scrolling */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#eee',
          borderRadius: '20px',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 2px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05)
          `,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: 1.6,
          padding: '2rem',
          maxWidth: '60%', // Limit width to prevent text from going under the moon
          marginLeft: 'auto',
          marginRight: 'auto',
          pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto'
        }}        animate={{ 
          opacity: scrollProgress > 0.8 ? 0 : 1,
          y: scrollProgress > 0.8 ? 30 : 0,
          scale: scrollProgress > 0.8 ? 0.9 : 1,
          filter: scrollProgress > 0.8 ? 'blur(5px)' : 'blur(0px)'
        }}
        transition={{ 
          duration: 0.5, 
          ease: "easeInOut"
        }}
      ><h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Luna.ai 🌙</h1>        
        
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Finally, an AI that&apos;s over the moon about helping you! Literally. We&apos;re so lunar-tic about space exploration that we built our entire interface around it. Scroll down to get uncomfortably close to the Moon (don&apos;t worry, it won&apos;t file a restraining order).
        </p>
        
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About Luna.ai</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            We&apos;re not just another AI company - we&apos;re the AI company that thinks the Moon is pretty neat. While other AIs are busy trying to take over the world, Luna.ai is here to take you on a cosmic joy ride! 🚀
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1.5rem' }}>
            Our team consists of space enthusiasts, code wizards, and at least three people who unironically believe in moon cheese. We&apos;ve combined cutting-edge WebGL with an unhealthy obsession with lunar surfaces to create something truly out of this world.
          </p>
        </section>        
       
        
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>How to Navigate Our Lunar Madness</h2>          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            <strong>Step 1:</strong> Scroll down like you&apos;re digging to the center of the Earth (but stop at the Moon) <br/>
            <strong>Step 2:</strong> Use your mouse to spin the Moon like a cosmic disco ball <br/>
            <strong>Step 3:</strong> Marvel at our programming skills while questioning our life choices <br/>
            <strong>Step 4:</strong> Click that &apos;Start your cosmic journey&apos; button and prepare for lunar hilarity! 
          </p>
        </section>
        
       
        <section style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready for Takeoff? 🚀</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Houston, we have a solution! Whether you&apos;re here to chat with our AI, explore the cosmos, or just procrastinate productively, Luna.ai has got you covered. 
          </p>          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1.5rem' }}>
            So what are you waiting for? Click that shiny button up there and let&apos;s launch into a conversation that&apos;s literally out of this world! And remember - at Luna.ai, we don&apos;t just reach for the stars, we make them our background! 🌟
          </p>        </section>
        {/* add more sections as needed */}
      </motion.div>      {/* Luna Focus Mode Indicator */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          background: 'rgba(15, 20, 25, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(240, 246, 252, 0.2)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '0.85rem',
          color: '#e6f3ff',
          zIndex: 20,
          pointerEvents: 'auto',
          cursor: 'pointer'
        }}
        animate={{ 
          opacity: scrollProgress >= 0.8 ? 1 : 0,
          y: scrollProgress >= 0.8 ? 0 : 20,
          scale: scrollProgress >= 0.8 ? 1 : 0.9
        }}
        transition={{ 
          duration: 0.4, 
          ease: "easeInOut",
          delay: scrollProgress >= 0.8 ? 0.2 : 0
        }}        onClick={() => {
          // Allow user to exit Luna focus mode by scrolling back up
          const targetPosition = window.scrollY - 300 // Scroll back more to get out of Luna zone
          window.scrollTo({ top: Math.max(0, targetPosition), behavior: 'smooth' })
          console.log('👆 User manually exited Luna focus mode')
        }}
        whileHover={{
          scale: 1.05,
          backgroundColor: 'rgba(15, 20, 25, 0.95)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#9575cd',
              boxShadow: '0 0 8px rgba(149, 117, 205, 0.6)',
              animation: 'pulse 2s infinite'
            }} />
            <span>🌙 Luna Focus Mode</span>
          </div>
          <div style={{ 
            fontSize: '0.7rem', 
            color: 'rgba(240, 246, 252, 0.7)',
            fontStyle: 'italic'
          }}>
            Click here to exit
          </div>
        </div>
      </motion.div>
    </div>
  )
}