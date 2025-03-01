'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Tooltip, Modal, Paper, Slider, Button } from '@mui/material';
import { keyframes } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

// Animation keyframes
const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Enhanced planet data
const planetsData = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#A9A9A9',
    orbitRadius: 100,
    size: 10,
    orbitPeriod: 88,
    rotationPeriod: 58.6,
    facts: [
      'Closest planet to the Sun',
      'Has virtually no atmosphere',
      'Surface temperatures range from -290°F to 800°F',
      'A Mercury day (sunrise to sunrise) lasts 176 Earth days'
    ],
    missions: ['Mariner 10', 'MESSENGER', 'BepiColombo'],
    image: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc0?q=80&w=150&auto=format'
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#E6C229',
    orbitRadius: 130,
    size: 14,
    orbitPeriod: 225,
    rotationPeriod: 243,
    facts: [
      'Hottest planet in our solar system',
      'Rotates backward compared to other planets',
      'Thick atmosphere traps heat in a runaway greenhouse effect',
      'Surface pressure is 92 times that of Earth'
    ],
    missions: ['Venera program', 'Magellan', 'Venus Express'],
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=150&auto=format'
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#1E90FF',
    orbitRadius: 160,
    size: 15,
    orbitPeriod: 365,
    rotationPeriod: 1,
    facts: [
      'Only known planet with life',
      '71% of surface covered by water',
      'Protective magnetic field shields us from solar radiation',
      'Perfect distance from Sun for liquid water'
    ],
    missions: ['ISS', 'Hubble Space Telescope', 'Countless satellites'],
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=150&auto=format'
  },
{
    id: 'mars',
    name: 'Mars',
    color: '#FF4500',
    orbitRadius: 190,
    size: 12,
    orbitPeriod: 687,
    rotationPeriod: 1.03,
    facts: [
        'Known as the Red Planet',
        'Has the largest volcano in the solar system',
        'Contains the deepest known canyon in the solar system',
        'Has two small moons: Phobos and Deimos'
    ],
    missions: ['Curiosity', 'Perseverance', 'InSight'],
    image: 'https://images.unsplash.com/photo-1614728894747-a83421789f10?q=80&w=150&auto=format'
},
{
    id: 'jupiter',
    name: 'Jupiter',
    color: '#DEB887',
    orbitRadius: 230,
    size: 25,
    orbitPeriod: 4333,
    rotationPeriod: 0.41,
    facts: [
        'Largest planet in our solar system',
        'Has the Great Red Spot, a giant storm',
        'Has at least 79 moons',
        'Strong magnetic field'
    ],
    missions: ['Juno', 'Galileo', 'Voyager 1 & 2'],
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=150&auto=format'
},
{
    id: 'saturn',
    name: 'Saturn',
    color: '#FFD700',
    orbitRadius: 270,
    size: 20,
    orbitPeriod: 10759,
    rotationPeriod: 0.45,
    facts: [
        'Known for its spectacular ring system',
        'Has the moon Titan with lakes of liquid methane',
        'Least dense planet in the solar system',
        'Has at least 82 moons'
    ],
    missions: ['Cassini', 'Voyager 1 & 2', 'Pioneer 11'],
    image: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc0?q=80&w=150&auto=format'
},
{
    id: 'uranus',
    name: 'Uranus',
    color: '#00CED1',
    orbitRadius: 310,
    size: 17,
    orbitPeriod: 30687,
    rotationPeriod: 0.72,
    facts: [
        'Rotates on its side',
        'Has 13 known rings',
        'The coldest planetary atmosphere in the solar system',
        'Has 27 known moons'
    ],
    missions: ['Voyager 2'],
    image: 'https://images.unsplash.com/photo-1614314107768-6018061c5bc1?q=80&w=150&auto=format'
},
{
    id: 'neptune',
    name: 'Neptune',
    color: '#4169E1',
    orbitRadius: 350,
    size: 16,
    orbitPeriod: 60190,
    rotationPeriod: 0.67,
    facts: [
        'Has the strongest winds in the solar system',
        'Has 14 known moons',
        'Has a dark spot similar to Jupiter\'s',
        'The most distant planet from the Sun'
    ],
    missions: ['Voyager 2'],
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=150&auto=format'
},
{
    id: 'pluto',
    name: 'Pluto',
    color: '#8B4513',
    orbitRadius: 390,
    size: 8,
    orbitPeriod: 90560,
    rotationPeriod: 6.39,
    facts: [
        'Dwarf planet since 2006',
        'Has 5 known moons',
        'Smaller than Earth\'s moon',
        'Has a heart-shaped glacier'
    ],
    missions: ['New Horizons'],
    image: 'https://images.unsplash.com/photo-1614314107769-2018061c5bc1?q=80&w=150&auto=format'
}
];

export default function SolarSystemExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  
  // New state for planets with randomized positions
  const [planets, setPlanets] = useState([]);
  
  // Initialize planets with random positions on their orbits
  useEffect(() => {
    const initializedPlanets = planetsData.map(planet => {
      // Random angle between 0-360 degrees for starting position
      const startAngle = Math.random() * 360;
      return {
        ...planet,
        startAngle,
        // Convert numerical values to strings with units for CSS
        orbitRadiusStr: `${planet.orbitRadius}px`,
        sizeStr: `${planet.size}px`,
      };
    });
    
    setPlanets(initializedPlanets);
  }, []);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
    setModalOpen(true);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ 
      x: touch.clientX - position.x, 
      y: touch.clientY - position.y 
    });
  };

  // handleTouchMove function for smoother touch experience
const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent page scrolling while dragging
    
    const touch = e.touches[0];
    const dragX = touch.clientX - dragStart.x;
    const dragY = touch.clientY - dragStart.y;
    
    // Add resistance at edges to prevent dragging too far
    const maxDrag = 1000 * zoomLevel;
    const clampedX = Math.max(-maxDrag, Math.min(dragX, maxDrag));
    const clampedY = Math.max(-maxDrag, Math.min(dragY, maxDrag));
    
    setPosition({
      x: clampedX,
      y: clampedY
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Add this handler to your component
  const handleWheel = (e) => {
    e.preventDefault();
    // Adjust zoom based on wheel direction
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prevZoom => {
      const newZoom = prevZoom + delta;
      return Math.max(0.5, Math.min(newZoom, 3)); // Clamp between 0.5 and 3
    });
  };

  // Add this function to your component
  const trackPlanet = (planetId) => {
    const planet = planets.find(p => p.id === planetId);
    if (!planet) return;
    
    // Calculate position based on orbit radius and current angle
    // This is a simplified calculation
    setZoomLevel(1.5);
    setPosition({
      x: 0, // Center horizontally
      y: 0  // Center vertically
    });
    
    // Focus on the selected planet
    setSelectedPlanet(planet);
    setModalOpen(true);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Controls */}
      <Box 
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 50,
        }}
      >
        <Tooltip title="Zoom In">
          <IconButton 
            onClick={handleZoomIn}
            sx={{ 
              bgcolor: 'rgba(25, 25, 35, 0.7)',
              color: '#9575CD',
              '&:hover': { bgcolor: 'rgba(25, 25, 35, 0.9)' }
            }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton 
            onClick={handleZoomOut}
            sx={{ 
              bgcolor: 'rgba(25, 25, 35, 0.7)',
              color: '#9575CD',
              '&:hover': { bgcolor: 'rgba(25, 25, 35, 0.9)' }
            }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Fullscreen">
          <IconButton 
            onClick={toggleFullscreen}
            sx={{ 
              bgcolor: 'rgba(25, 25, 35, 0.7)',
              color: '#9575CD',
              '&:hover': { bgcolor: 'rgba(25, 25, 35, 0.9)' }
            }}
          >
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset View">
          <IconButton 
            onClick={handleReset}
            sx={{ 
              bgcolor: 'rgba(25, 25, 35, 0.7)',
              color: '#9575CD',
              '&:hover': { bgcolor: 'rgba(25, 25, 35, 0.9)' }
            }}
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: isFullscreen ? '100vh' : (isMobile ? '400px' : '600px'),
          position: 'relative',
          background: 'radial-gradient(ellipse at center, #1B2735 0%, #090A0F 100%)',
          borderRadius: isFullscreen ? '0' : '10px',
          overflow: 'hidden',
          padding: 2,
          border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: isFullscreen ? 'none' : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ touchAction: 'none' }} // Prevents mobile scroll events from interfering
      >
        {/* Solar System Content with enhanced 3D effect */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            // Add perspective for 3D effect
            perspective: '1000px',
          }}
        >
          {/* Sun in the center */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? '30px' : '40px',
              height: isMobile ? '30px' : '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFF959 0%, #FFA500 100%)',
              boxShadow: '0 0 30px 10px rgba(255, 165, 0, 0.7)',
              animation: `${pulse} 3s infinite ease-in-out`,
              zIndex: 10,
              cursor: 'pointer',
            }}
            onClick={() => handlePlanetClick({
              id: 'sun',
              name: 'Sun',
              facts: [
                'Center of our solar system',
                'Accounts for 99.86% of the solar system\'s mass',
                'Core temperature is about 15 million °C',
                'Light takes 8 minutes to reach Earth'
              ],
              missions: ['Parker Solar Probe', 'Solar Orbiter', 'SOHO'],
              image: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?q=80&w=150&auto=format'
            })}
          />
          
          {/* Orbits and Planets with custom starting positions */}
          {planets.map((planet) => (
            <Box key={planet.id} sx={{
              // Create a slight 3D tilt effect for the solar system
              transform: 'rotateX(75deg)',
              transformStyle: 'preserve-3d',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '1px',  // Just a point
              height: '1px', // Just a point
            }}>
              {/* Orbit path */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: isMobile ? `calc(${planet.orbitRadiusStr} * 0.7)` : planet.orbitRadiusStr,
                  height: isMobile ? `calc(${planet.orbitRadiusStr} * 0.7)` : planet.orbitRadiusStr,
                  transform: `
                    translate(-50%, -50%)
                    rotateX(${75 + (planet.id === 'pluto' ? 15 : planet.id === 'mercury' ? -8 : 0)}deg)
                    rotateZ(${planet.id === 'pluto' ? 15 : planet.id === 'uranus' ? -10 : 0}deg)
                  `,
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 1,
                }}
              />
              
              {/* Planet with custom animation for individual starting position */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: isMobile ? `calc(${planet.sizeStr} * 0.7)` : planet.sizeStr,
                  height: isMobile ? `calc(${planet.sizeStr} * 0.7)` : planet.sizeStr,
                  borderRadius: '50%',
                  backgroundColor: planet.color,
                  // Position planets along their orbit with a random starting angle
                  transform: `
                    rotate(${planet.startAngle}deg)
                    translateX(${isMobile ? planet.orbitRadius * 0.7 / 2 : planet.orbitRadius / 2}px)
                  `,
                  transformOrigin: 'center center',
                  animation: `${orbit} ${planet.orbitPeriod / 10}s linear infinite`,
                  zIndex: 5,
                  cursor: 'pointer',
                  boxShadow: `0 0 10px ${planet.color}80`,
                  '&:hover': {
                    boxShadow: `0 0 15px ${planet.color}`,
                  },
                }}
                onClick={() => handlePlanetClick(planet)}
              >
                {/* Planet label for better visibility */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '8px',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                    pointerEvents: 'none',
                    textShadow: '0 0 2px #000',
                  }}
                >
                  {planet.name}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Zoom Level Indicator */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
          Zoom: {Math.round(zoomLevel * 100)}%
        </Typography>
        <Slider
          value={zoomLevel * 100}
          min={50}
          max={300}
          step={25}
          onChange={(_, value) => setZoomLevel(value / 100)}
          sx={{ 
            width: '200px',
            '& .MuiSlider-thumb': {
              backgroundColor: '#9575CD',
            },
            '& .MuiSlider-track': {
              backgroundColor: '#9575CD',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        />
        <Tooltip title="Reset View">
          <IconButton 
            onClick={handleReset}
            size="small"
            sx={{ color: '#9575CD' }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Instructions */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 100,
          left: 10,
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          zIndex: 5,
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: '4px',
        }}
      >
        Click planets to learn more • Drag to move • Use controls to zoom
      </Box>
      
      {/* Planet Info Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="planet-info-modal"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : '500px',
            bgcolor: 'rgba(25, 25, 35, 0.95)',
            border: '1px solid rgba(149, 117, 205, 0.3)',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(149, 117, 205, 0.5)',
            p: 3,
            color: '#E0E0E0',
          }}
        >
          {selectedPlanet && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h2" color="#9575CD" fontFamily="var(--font-exo-2), sans-serif">
                  {selectedPlanet.name}
                </Typography>
                <IconButton onClick={() => setModalOpen(false)} sx={{ color: '#9575CD' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2}>
                <Box
                  component="img"
                  src={selectedPlanet.image}
                  alt={selectedPlanet.name}
                  sx={{
                    width: isMobile ? '100%' : '150px',
                    height: isMobile ? '150px' : '150px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                    mb: isMobile ? 2 : 0
                  }}
                />
                
                <Box flex={1}>
                  <Typography variant="h6" color="#9575CD" fontFamily="var(--font-space-grotesk), sans-serif" mb={1}>
                    Interesting Facts
                  </Typography>
                  <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
                    {selectedPlanet.facts.map((fact, index) => (
                      <li key={index}>
                        <Typography variant="body2" mb={0.5}>
                          {fact}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                  
                  <Typography variant="h6" color="#9575CD" fontFamily="var(--font-space-grotesk), sans-serif" mb={1}>
                    Notable Missions
                  </Typography>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {selectedPlanet.missions.map((mission, index) => (
                      <li key={index}>
                        <Typography variant="body2">
                          {mission}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Modal>

      {/* Planet Selector */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
        {planets.map(planet => (
          <Button 
            key={planet.id}
            variant="outlined"
            size="small"
            onClick={() => trackPlanet(planet.id)}
            sx={{
              color: planet.color,
              borderColor: `${planet.color}50`,
              '&:hover': {
                borderColor: planet.color,
                backgroundColor: `${planet.color}20`
              }
            }}
          >
            {planet.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
}