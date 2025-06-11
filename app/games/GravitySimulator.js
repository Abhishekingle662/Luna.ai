'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Play, Pause, Info, Zap, Settings } from 'lucide-react';

// Physics constants
const GRAVITY_CONSTANT = 0.1;
const DAMPING = 0.999;

// Preset scenarios
const scenarios = [  {
    name: "Earth-Moon System",
    description: "Simplified Earth-Moon gravitational interaction",
    bodies: [
      { id: 1, x: 200, y: 200, vx: 0, vy: 0, mass: 100, radius: 20, color: '#4A90E2', name: 'Earth' },
      { id: 2, x: 350, y: 200, vx: 0, vy: 2, mass: 20, radius: 8, color: '#E5E7EB', name: 'Moon' }
    ]
  },
  {
    name: "Binary Star System",
    description: "Two massive stars orbiting their common center",
    bodies: [
      { id: 1, x: 180, y: 200, vx: 0, vy: 1, mass: 80, radius: 16, color: '#F59E0B', name: 'Star A' },
      { id: 2, x: 320, y: 200, vx: 0, vy: -1, mass: 80, radius: 16, color: '#EF4444', name: 'Star B' }
    ]
  },
  {
    name: "Three Body Problem",
    description: "Chaotic three-body gravitational interaction",
    bodies: [
      { id: 1, x: 200, y: 150, vx: 1, vy: 0, mass: 60, radius: 12, color: '#8B5CF6', name: 'Body 1' },
      { id: 2, x: 300, y: 200, vx: 0, vy: 1, mass: 60, radius: 12, color: '#06D6A0', name: 'Body 2' },
      { id: 3, x: 250, y: 280, vx: -1, vy: -1, mass: 60, radius: 12, color: '#F72585', name: 'Body 3' }
    ]
  }
];

export default function GravitySimulator() {
  const [bodies, setBodies] = useState(scenarios[0].bodies);
  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showTrails, setShowTrails] = useState(true);
  const [trails, setTrails] = useState([]);
  const [gravityStrength, setGravityStrength] = useState(1);
  const [selectedBody, setSelectedBody] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const updateSimulation = useCallback(() => {
    setBodies(prevBodies => {
      const newBodies = prevBodies.map(body => ({ ...body }));
      
      // Calculate gravitational forces
      for (let i = 0; i < newBodies.length; i++) {
        let fx = 0, fy = 0;
        
        for (let j = 0; j < newBodies.length; j++) {
          if (i !== j) {
            const dx = newBodies[j].x - newBodies[i].x;
            const dy = newBodies[j].y - newBodies[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              const force = (GRAVITY_CONSTANT * gravityStrength * newBodies[i].mass * newBodies[j].mass) / (distance * distance);
              fx += force * dx / distance;
              fy += force * dy / distance;
            }
          }
        }
        
        // Update velocity and position
        newBodies[i].vx += fx / newBodies[i].mass;
        newBodies[i].vy += fy / newBodies[i].mass;
        newBodies[i].vx *= DAMPING;
        newBodies[i].vy *= DAMPING;
        newBodies[i].x += newBodies[i].vx;
        newBodies[i].y += newBodies[i].vy;
        
        // Boundary conditions
        if (newBodies[i].x < 0 || newBodies[i].x > 500) newBodies[i].vx *= -0.8;
        if (newBodies[i].y < 0 || newBodies[i].y > 400) newBodies[i].vy *= -0.8;
        newBodies[i].x = Math.max(0, Math.min(500, newBodies[i].x));
        newBodies[i].y = Math.max(0, Math.min(400, newBodies[i].y));
      }
      
      // Update trails
      if (showTrails) {
        setTrails(prevTrails => {
          const newTrails = [...prevTrails];
          newBodies.forEach(body => {
            newTrails.push({ x: body.x, y: body.y, color: body.color, bodyId: body.id });
          });
          return newTrails.slice(-500); // Keep last 500 trail points
        });
      }
      
      return newBodies;
    });
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    }
  }, [gravityStrength, showTrails, isRunning]);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, updateSimulation]);

  const resetSimulation = () => {
    setIsRunning(false);
    setBodies(scenarios[currentScenario].bodies);
    setTrails([]);
  };

  const loadScenario = (index) => {
    setIsRunning(false);
    setCurrentScenario(index);
    setBodies(scenarios[index].bodies);
    setTrails([]);
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const clearTrails = () => {
    setTrails([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="text-lunar-accent" size={32} />
          <h2 className="text-3xl font-space-grotesk font-bold text-lunar-light">
            Gravity Simulator
          </h2>
          <Zap className="text-lunar-accent" size={32} />
        </div>
        <p className="text-lunar-muted font-lato">
          Explore the fundamental force that shapes our universe
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card space-y-6">
            <h3 className="text-xl font-space-grotesk font-bold text-lunar-light mb-4">
              Controls
            </h3>

            {/* Simulation Controls */}
            <div className="space-y-4">
              <button
                onClick={toggleSimulation}
                className={`w-full btn-primary flex items-center justify-center space-x-2 ${isRunning ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                <span>{isRunning ? 'Pause' : 'Start'} Simulation</span>
              </button>

              <button
                onClick={resetSimulation}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>
            </div>

            {/* Scenario Selection */}
            <div>
              <h4 className="text-lg font-space-grotesk font-semibold text-lunar-light mb-3">
                Scenarios
              </h4>
              <div className="space-y-2">
                {scenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => loadScenario(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentScenario === index 
                        ? 'bg-lunar-accent/20 border border-lunar-accent/50' 
                        : 'bg-lunar-medium/30 hover:bg-lunar-medium/50'
                    }`}
                  >
                    <div className="font-space-grotesk font-semibold text-lunar-light">
                      {scenario.name}
                    </div>
                    <div className="text-sm text-lunar-muted font-lato">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div>
              <h4 className="text-lg font-space-grotesk font-semibold text-lunar-light mb-3 flex items-center space-x-2">
                <Settings size={18} />
                <span>Settings</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-lato text-lunar-muted mb-2">
                    Gravity Strength: {gravityStrength.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={gravityStrength}
                    onChange={(e) => setGravityStrength(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showTrails"
                    checked={showTrails}
                    onChange={(e) => setShowTrails(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showTrails" className="text-sm font-lato text-lunar-light">
                    Show Trails
                  </label>
                </div>

                {showTrails && (
                  <button
                    onClick={clearTrails}
                    className="w-full btn-secondary text-sm"
                  >
                    Clear Trails
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simulation Canvas */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card">
            <div className="relative bg-lunar-deep rounded-lg border border-lunar-medium/30 overflow-hidden">
              <svg
                width="500"
                height="400"
                className="w-full h-auto"
                viewBox="0 0 500 400"
              >
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke="rgb(61, 68, 76)"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
                <rect width="500" height="400" fill="url(#grid)" />

                {/* Trails */}
                {showTrails && trails.map((trail, index) => (
                  <circle
                    key={index}
                    cx={trail.x}
                    cy={trail.y}
                    r="1"
                    fill={trail.color}
                    opacity={0.3}
                  />
                ))}

                {/* Bodies */}
                {bodies.map((body) => (
                  <g key={body.id}>
                    {/* Body glow effect */}
                    <circle
                      cx={body.x}
                      cy={body.y}
                      r={body.radius + 4}
                      fill={body.color}
                      opacity="0.3"
                      filter="blur(2px)"
                    />
                    {/* Main body */}
                    <circle
                      cx={body.x}
                      cy={body.y}
                      r={body.radius}
                      fill={body.color}
                      stroke="#ffffff"
                      strokeWidth="1"
                      opacity="0.9"
                      className="cursor-pointer"
                      onClick={() => setSelectedBody(body)}
                    />
                    {/* Body label */}
                    <text
                      x={body.x}
                      y={body.y - body.radius - 8}
                      textAnchor="middle"
                      className="text-xs fill-lunar-light font-lato"
                    >
                      {body.name}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Status indicator */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm font-lato text-lunar-light">
                  {isRunning ? 'Running' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Body Info Panel */}
            <AnimatePresence>
              {selectedBody && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-4 bg-lunar-medium/30 rounded-lg border border-lunar-medium/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-space-grotesk font-semibold text-lunar-light flex items-center space-x-2">
                      <Info size={16} />
                      <span>{selectedBody.name}</span>
                    </h4>
                    <button
                      onClick={() => setSelectedBody(null)}
                      className="text-lunar-muted hover:text-lunar-light"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm font-lato">
                    <div>
                      <span className="text-lunar-muted">Mass:</span>
                      <span className="text-lunar-light ml-2">{selectedBody.mass}</span>
                    </div>
                    <div>
                      <span className="text-lunar-muted">Radius:</span>
                      <span className="text-lunar-light ml-2">{selectedBody.radius}px</span>
                    </div>
                    <div>
                      <span className="text-lunar-muted">Velocity X:</span>
                      <span className="text-lunar-light ml-2">{selectedBody.vx.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-lunar-muted">Velocity Y:</span>
                      <span className="text-lunar-light ml-2">{selectedBody.vy.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Information Panel */}
      <motion.div 
        className="mt-8 card-secondary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-space-grotesk font-bold text-lunar-light mb-4 flex items-center space-x-2">
          <Info size={20} />
          <span>About Gravity</span>
        </h3>
        <p className="text-lunar-muted font-lato leading-relaxed">
          Gravity is one of the four fundamental forces of nature. This simulator demonstrates how massive objects 
          attract each other with a force proportional to their masses and inversely proportional to the square 
          of the distance between them. Try different scenarios to see how gravity shapes orbital mechanics, 
          from planetary systems to binary stars.
        </p>
      </motion.div>
    </div>
  );
}
