'use client';
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats, AdaptiveDpr, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './globe.css';

// Optimized Stars using InstancedMesh for performance - Multiple Instances
function Stars({ count = 2000 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Generate star positions once and memoize
  const { positions, colors, scales } = useMemo(() => {
    const pos = [];
    const col = [];
    const scl = [];
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution around globe with multiple layers
      const layer = Math.floor(i / (count / 3)); // Create 3 layers
      const baseRadius = 30 + layer * 50;
      const radius = baseRadius + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos.push([
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ]);
      
      // Different star colors based on layer
      let intensity, colorVariation;
      if (layer === 0) {
        // Close stars - brighter white
        intensity = 0.8 + Math.random() * 0.2;
        colorVariation = 0.1;
      } else if (layer === 1) {
        // Medium stars - blue-white
        intensity = 0.6 + Math.random() * 0.3;
        colorVariation = 0.3;
      } else {
        // Distant stars - dimmer, more colorful
        intensity = 0.4 + Math.random() * 0.4;
        colorVariation = 0.5;
      }
      
      col.push([
        intensity, 
        intensity, 
        intensity + Math.random() * colorVariation
      ]);
      
      // Random scales based on layer
      const baseScale = layer === 0 ? 1.2 : layer === 1 ? 0.8 : 0.5;
      scl.push(baseScale + Math.random() * 0.8);
    }
    
    return { positions: pos, colors: col, scales: scl };
  }, [count]);
  
  // Enhanced twinkling animation with different frequencies
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    positions.forEach((pos, i) => {
      dummy.position.set(...pos);
      
      // Layer-based twinkling with different frequencies
      const layer = Math.floor(i / (count / 3));
      const frequency = layer === 0 ? 3 : layer === 1 ? 2 : 1;
      const twinkle = Math.sin(time * frequency + i * 0.1) * 0.15 + 0.85;
      
      dummy.scale.setScalar(scales[i] * twinkle);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color="white" transparent opacity={0.9} />
    </instancedMesh>
  );
}

// Simplified Globe with realistic Earth textures
function Globe({ enableTextures = true }) {
  const globeRef = useRef();
  
  // Use all local texture maps for the globe
  const earthTexture = useTexture('/images/freepik__diffusion-map-of-a-world-map-showing-land-and-ocea__31103.png');
  const normalTexture = useTexture('/images/freepik__normal-map-of-a-world-map-showing-simulated-surfac__31104.png');
  const diffusionTexture = useTexture('/images/freepik__diffusion-map-of-a-world-map-showing-land-and-ocea__31103.png');
  const roughnessTexture = useTexture('/images/freepik__roughness-map-of-a-world-map-showing-terrain-rough__31105.png');
  const specularTexture = useTexture('/images/freepik__specular-map-of-a-world-map-showing-reflectivity-w__31106.png');
  const lightsTexture = useTexture('/images/earth_lights_texture.jpg');
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002; // Slow rotation
    }
  });
  
  // Configure all local textures
  useEffect(() => {
    [earthTexture, normalTexture, diffusionTexture, roughnessTexture, specularTexture, lightsTexture].forEach(texture => {
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16; // High quality filtering
        texture.generateMipmaps = true;
        texture.flipY = false; // Ensure proper texture orientation
      }
    });
  }, [earthTexture, normalTexture, diffusionTexture, roughnessTexture, specularTexture, lightsTexture]);
  
  return (
    <group key={`globe-${enableTextures}`}>
      {/* Main Earth Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[5, 80, 40]} />
        <meshStandardMaterial
          key={`globe-material-${enableTextures}`}
          map={enableTextures ? earthTexture : undefined}
          normalMap={enableTextures ? normalTexture : undefined}
          normalScale={[0.6, 0.6]}
          roughnessMap={enableTextures ? roughnessTexture : undefined}
          roughness={0.7}
          metalnessMap={enableTextures ? specularTexture : undefined}
          metalness={0.1}
          aoMap={enableTextures ? diffusionTexture : undefined}
          aoMapIntensity={0.8}
          envMapIntensity={1.2}
          displacementMap={enableTextures ? normalTexture : undefined}
          displacementScale={0.1}
          color={enableTextures ? "#ffffff" : "#4A90E2"}
        />
      </mesh>
      
      {/* Night Lights Layer - only when textures are enabled */}
      {enableTextures && (
        <mesh scale={1.08}>
          <sphereGeometry args={[5, 40, 20]} />
          <meshBasicMaterial
            map={lightsTexture}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            color="#FFE4B5"
          />
        </mesh>
      )}
    </group>
  );
}

// Texture loading component with fallback
function TexturedGlobe({ enableTextures = true }) {
  return (
    <React.Suspense 
      fallback={
        <SimpleGlobe />
      }
    >
      <Globe key={`textured-globe-${enableTextures}`} enableTextures={enableTextures} />
    </React.Suspense>
  );
}

// Simple Globe fallback without textures
function SimpleGlobe() {
  const globeRef = useRef();
  const atmosphereRef = useRef();
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[5, 64, 32]} />
        <meshPhongMaterial 
          color="#4A90E2"
          shininess={100}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <mesh ref={atmosphereRef} scale={1.05}>
        <sphereGeometry args={[5, 32, 16]} />
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh scale={1.02}>
        <sphereGeometry args={[5, 32, 16]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}





// Lighting setup
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow={false} // Disabled for performance
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.3} 
        color="#4A90E2" 
      />
    </>
  );
}

// Main Scene Component with multiple star layers
function Scene({ starCount, enableTextures }) {
  return (
    <>
      <Lighting />
      <TexturedGlobe key={`textured-globe-${enableTextures}`} enableTextures={enableTextures} />
      
      {/* Multiple star instances for depth and variety */}
      <Stars count={Math.floor(starCount * 0.4)} key={`close-${starCount}`} />
      <Stars count={Math.floor(starCount * 0.35)} key={`medium-${starCount}`} />
      <Stars count={Math.floor(starCount * 0.25)} key={`far-${starCount}`} />
      
      <OrbitControls 
        enablePan={false}
        minDistance={12}
        maxDistance={100}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// Simplified Performance settings component
function PerformanceControls({ onStarCountChange, onToggleTextures, onToggleStats, enableTextures, showStats }) {
  const [starCount, setStarCount] = useState(1500);
  
  const handleStarChange = (value) => {
    setStarCount(value);
    onStarCountChange(value);
  };
  
  const handleTexturesToggle = (checked) => {
    onToggleTextures(checked);
  };
  
  const handleStatsToggle = (checked) => {
    onToggleStats(checked);
  };
  
  return (
    <div className="globe-controls" style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 100,
      minWidth: '240px',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(149, 117, 205, 0.3)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#4A90E2' }}>
        ✨ Globe Controls
      </h3>
      
      <div style={{ marginBottom: '12px' }}>
        <label>⭐ Stars: {starCount.toLocaleString()}</label>
        <input
          type="range"
          min="500"
          max="4000"
          step="100"
          value={starCount}
          onChange={(e) => handleStarChange(parseInt(e.target.value))}
          style={{ width: '100%', marginTop: '5px' }}
        />
      </div>
      

      

      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={enableTextures}
            onChange={(e) => handleTexturesToggle(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          🌍 Earth Textures
        </label>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={showStats}
            onChange={(e) => handleStatsToggle(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          📊 Performance Stats
        </label>
      </div>
      
      <div style={{ 
        fontSize: '10px', 
        opacity: 0.7, 
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '10px',
        marginTop: '10px'
      }}>
        🖱️ Mouse: Rotate & Zoom<br/>
        🖱️ Scroll: Zoom in/out<br/>
        🔄 Auto-rotation enabled<br/>
        🌎 HD Earth textures loaded<br/>
        ⚡ Optimized for performance
      </div>
    </div>
  );
}

// Main Globe Page Component
export default function GlobePage() {
  const [mounted, setMounted] = useState(false);
  const [starCount, setStarCount] = useState(1500);
  const [enableTextures, setEnableTextures] = useState(true);
  const [showStats, setShowStats] = useState(true);
  
  const handleToggleTextures = (value) => {
    setEnableTextures(value);
  };
  
  const handleToggleStats = (value) => {
    setShowStats(value);
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'monospace'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-text" style={{ fontSize: '18px', marginBottom: '10px' }}>
            🌍 Loading 3D Globe Visualization...
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            Initializing stars, fireworks, and orbital mechanics
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="globe-page" style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', 
      overflow: 'hidden' 
    }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        gl={{ 
          antialias: window.innerWidth < 768 ? false : true, // Disable on mobile
          alpha: false,
          powerPreference: "high-performance",
          precision: "lowp"
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]} // Adaptive pixel ratio
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        
        <React.Suspense fallback={null}>
          <Scene 
            starCount={starCount}
            enableTextures={enableTextures}
          />
        </React.Suspense>
      </Canvas>
      
      {showStats && (
        <div className="globe-info" style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: 100,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '12px',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(149, 117, 205, 0.3)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#4A90E2' }}>
            🌙 Luna.ai - Interactive Earth Globe
          </h2>
          • {starCount.toLocaleString()}+ multi-layered stars with twinkling<br/>
          • Realistic Earth textures with surface details<br/>
          • Real-time performance optimization<br/>
          • Interactive 3D orbit controls<br/>
          • HD Earth surface, normal, roughness, and specular maps<br/>
          • City lights illumination
        </div>
      )}
      
      <PerformanceControls 
        onStarCountChange={setStarCount}
        onToggleTextures={handleToggleTextures}
        onToggleStats={handleToggleStats}
        enableTextures={enableTextures}
        showStats={showStats}
      />
      
      {/* Enhanced Navigation */}
      <div style={{
        position: 'absolute',
        bottom: 15,
        left: 15,
        zIndex: 100
      }}>
        <a 
          href="/"
          className="back-button"
          style={{
            color: '#4A90E2',
            textDecoration: 'none',
            fontFamily: 'monospace',
            fontSize: '14px',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '10px 15px',
            borderRadius: '8px',
            border: '2px solid #4A90E2',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(5px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#4A90E2';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.8)';
            e.target.style.color = '#4A90E2';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Back to Luna.ai
        </a>
        
        <div style={{
          marginTop: '8px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'monospace'
        }}>
          Press F11 for fullscreen experience
        </div>
      </div>
      
      {/* Performance indicator */}
      <div style={{
        position: 'absolute',
        bottom: 15,
        right: 15,
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'monospace',
        fontSize: '10px',
        zIndex: 100
      }}>
        Stars: {starCount.toLocaleString()} | 
        Textures: HD Earth Maps | 
        FPS: Optimized
      </div>
    </div>
  );
}
