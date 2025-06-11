'use client'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import Moon from './components/Moon'
import Earth from './components/Earth'
import Starfield from './components/Starfield'
import WelcomeBox from './components/WelcomeBox'

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
        >
          <color attach="background" args={['#000']} />
          <Starfield count={2000} radius={300} depth={400} />          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          {/* Position Moon prominently in view, Earth far behind/to the side - only visible when rotating */}
          <Moon position={[2.2, 1.2, 0]} scale={0.8} />
          <Earth position={[-250.0, -10.0, -250.0]} scale={0.4} />
          {/* disable wheel zoom so scroll drives our scroll animation */}
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>

        <WelcomeBox />

      </section>      {/* actual page content for scrolling */}
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
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Luna.ai</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Explore our cosmic interface. Scroll down to see the Moon rotate clockwise as you move through the galaxy.
        </p>
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Features</h2>
          <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            <li>Interactive 3D Moon model with scroll-driven rotation</li>
            <li>Dynamic starfield background</li>
            <li>Smooth scroll‑driven animations</li>
            <li>Responsive design that adapts to your screen</li>
          </ul>
        </section>
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About Us</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Luna.ai brings the universe to your fingertips. Harnessing cutting‑edge WebGL and VR techniques, we make space exploration accessible to all.
          </p>
        </section>
        <section style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Experience the Cosmos</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            As you scroll through this page, watch how the moon rotates in harmony with your journey. The animation is designed to be smooth and non-intrusive, enhancing your reading experience rather than distracting from it.
          </p>
        </section>
        {/* add more sections as needed */}
      </div>
    </div>
  )
}