'use client'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import Moon from './components/Moon'
import Earth from './components/Earth'
import Starfield from './components/Starfield'
import WelcomeBox from './components/WelcomeBox'
import ScrollCamera from './components/ScrollCamera'
import InteractionHints from './components/IllustrationNotice'

export default function LandingPage() {
  return (
    <div>
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
          />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />          {/* Position Moon prominently in view, Earth far behind/to the side - only visible when rotating */}
          <Moon position={[2.2, 1.2, 0]} scale={0.8} />
          <Earth position={[-250.0, -10.0, -250.0]} scale={0.4} />
          {/* Custom scroll-driven camera controller */}
          <ScrollCamera />        </Canvas>

        <WelcomeBox />
        <InteractionHints />

      </section>{/* actual page content for scrolling */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: '100vh',
          backgroundColor: 'rgb(255, 255, 255, .3)',
          color: '#eee',
          borderRadius: '5%',
          boxShadow: ' 5px 10px 20px #888888 inset',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: 1.6,
          padding: '2rem',
          maxWidth: '60%', // Limit width to prevent text from going under the moon
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Luna.ai</h1>        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Explore our cosmic interface with focused Moon interaction. Scroll down to get closer to the Moon, then use your mouse to rotate around it for detailed views of the lunar surface.
        </p>
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Interactive Features</h2>          <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            <li>🖱️ <strong>Mouse Controls:</strong> Drag to rotate around Moon</li>
            <li>🌙 <strong>Interactive 3D Moon:</strong> Explore our detailed lunar model from every angle</li>
            <li>📜 <strong>Scroll-driven approach:</strong> Page scrolling smoothly brings you closer to the Moon</li>
            <li>🌟 <strong>Dynamic starfield:</strong> Immersive space environment that responds to your movement</li>
            <li>📱 <strong>Touch Support:</strong> Gesture controls on mobile and tablet devices</li>
            <li>⚡ <strong>Optimized Performance:</strong> Smooth 3D rendering with focused interaction</li>
          </ul>
        </section>
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About Us</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Luna.ai brings the universe to your fingertips. Harnessing cutting‑edge WebGL and VR techniques, we make space exploration accessible to all.
          </p>
        </section>        <section style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Experience the Cosmos</h2>          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Enjoy a focused lunar exploration experience! Scroll down this page to automatically approach the Moon, then use your mouse to rotate around it for detailed surface views. The interaction is designed to complement the scroll-based journey without interfering with the page navigation.
          </p>          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1.5rem' }}>
            <strong>How to explore:</strong> As you scroll down, the camera smoothly moves closer to the Moon. Once you&apos;re close, drag to rotate your view around the Moon for different perspectives. This creates a perfect balance between guided exploration and interactive freedom.
          </p>
        </section>
        {/* add more sections as needed */}
      </div>
    </div>
  )
}