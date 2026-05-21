'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './globe.css';

function StarField({ count }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const radius = 28 + Math.random() * 82;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      return {
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ],
        scale: 0.45 + Math.random() * 1.1,
        phase: index * 0.13,
      };
    });
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    stars.forEach((star, index) => {
      const twinkle = 0.82 + Math.sin(state.clock.elapsedTime * 1.8 + star.phase) * 0.18;
      dummy.position.set(...star.position);
      dummy.scale.setScalar(star.scale * twinkle);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
    </instancedMesh>
  );
}

function Earth({ texturesEnabled }) {
  const groupRef = useRef(null);
  const [earth, normal, roughness, specular, lights] = useTexture([
    '/images/freepik__diffusion-map-of-a-world-map-showing-land-and-ocea__31103.png',
    '/images/freepik__normal-map-of-a-world-map-showing-simulated-surfac__31104.png',
    '/images/freepik__roughness-map-of-a-world-map-showing-terrain-rough__31105.png',
    '/images/freepik__specular-map-of-a-world-map-showing-reflectivity-w__31106.png',
    '/images/earth_lights_texture.jpg',
  ]);

  useEffect(() => {
    [earth, normal, roughness, specular, lights].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 8;
    });
  }, [earth, normal, roughness, specular, lights]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0018;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[5, 96, 48]} />
        <meshStandardMaterial
          map={texturesEnabled ? earth : undefined}
          normalMap={texturesEnabled ? normal : undefined}
          roughnessMap={texturesEnabled ? roughness : undefined}
          metalnessMap={texturesEnabled ? specular : undefined}
          normalScale={[0.45, 0.45]}
          roughness={0.72}
          metalness={0.08}
          color={texturesEnabled ? '#ffffff' : '#2e91d0'}
        />
      </mesh>

      {texturesEnabled && (
        <mesh scale={1.04}>
          <sphereGeometry args={[5, 64, 32]} />
          <meshBasicMaterial
            map={lights}
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            color="#ffdca8"
          />
        </mesh>
      )}

      <mesh scale={1.08}>
        <sphereGeometry args={[5, 64, 32]} />
        <meshBasicMaterial color="#6ed8ff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Scene({ starCount, texturesEnabled }) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight position={[8, 6, 8]} intensity={1.25} />
      <pointLight position={[-12, -4, -8]} intensity={0.38} color="#62d8ff" />
      <Suspense fallback={null}>
        <Earth texturesEnabled={texturesEnabled} />
      </Suspense>
      <StarField count={starCount} />
      <OrbitControls
        enablePan={false}
        minDistance={12}
        maxDistance={42}
        autoRotate
        autoRotateSpeed={0.28}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

function GlobeControls({ starCount, setStarCount, texturesEnabled, setTexturesEnabled, detailsOpen, setDetailsOpen }) {
  return (
    <div className="globe-controls">
      <h2>Globe controls</h2>
      <label className="globe-range">
        <span>Stars: {starCount.toLocaleString()}</span>
        <input
          className="range-control"
          type="range"
          min="500"
          max="3000"
          step="100"
          value={starCount}
          onChange={(event) => setStarCount(Number(event.target.value))}
        />
      </label>
      <label className="globe-toggle">
        <input
          type="checkbox"
          checked={texturesEnabled}
          onChange={(event) => setTexturesEnabled(event.target.checked)}
        />
        <span>Earth textures</span>
      </label>
      <label className="globe-toggle">
        <input
          type="checkbox"
          checked={detailsOpen}
          onChange={(event) => setDetailsOpen(event.target.checked)}
        />
        <span>Details panel</span>
      </label>
      <p>Drag to rotate. Scroll to zoom.</p>
    </div>
  );
}

export default function GlobePage() {
  const [mounted, setMounted] = useState(false);
  const [starCount, setStarCount] = useState(1200);
  const [texturesEnabled, setTexturesEnabled] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="globe-page grid place-items-center">
        <div className="space-panel p-6 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cyan-200/20 border-t-cyan-200" />
          <p className="font-black text-white">Loading 3D globe</p>
        </div>
      </main>
    );
  }

  return (
    <main className="globe-page">
      <Canvas
        camera={{ position: [0, 0, 19], fov: 48 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.75]}
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        <Scene starCount={starCount} texturesEnabled={texturesEnabled} />
      </Canvas>

      {detailsOpen && (
        <aside className="globe-info">
          <span className="eyebrow">Globe</span>
          <h1>Luna.ai Earth Lab</h1>
          <p>Textured Earth, city lights, atmosphere, orbit controls, and a tunable starfield.</p>
          <div className="globe-metrics">
            <span>{starCount.toLocaleString()} stars</span>
            <span>{texturesEnabled ? 'HD textures' : 'Simple mode'}</span>
          </div>
        </aside>
      )}

      <GlobeControls
        starCount={starCount}
        setStarCount={setStarCount}
        texturesEnabled={texturesEnabled}
        setTexturesEnabled={setTexturesEnabled}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
      />
    </main>
  );
}
