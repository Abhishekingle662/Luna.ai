'use client'
import { Box, Typography, Button, useTheme, useMediaQuery, Container } from '@mui/material';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { keyframes } from '@mui/system';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Import particles background dynamically to avoid SSR issues
const ParticlesBg = dynamic(() => import('particles-bg'), { ssr: false });

// Define keyframe animations for visual effects
const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const glow = keyframes`
  0% {
    text-shadow: 0 0 5px #5D3FD3, 0 0 10px #5D3FD3;
  }
  50% {
    text-shadow: 0 0 20px #5D3FD3, 0 0 30px #5D3FD3, 0 0 40px #5D3FD3;
  }
  100% {
    text-shadow: 0 0 5px #5D3FD3, 0 0 10px #5D3FD3;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulseOpacity = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
`;

const orbitAnim = keyframes`
  0% {
    transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
  }
`;

// Starfield with parallax effect
const StarfieldCanvas = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Mouse movement for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create stars with different sizes and speeds for parallax
    const starLayers = [
      { count: 200, speed: 0.1, size: 1, color: 'rgba(255, 255, 255, 0.5)' },
      { count: 100, speed: 0.2, size: 2, color: 'rgba(255, 255, 255, 0.7)' },
      { count: 50, speed: 0.3, size: 3, color: 'rgba(255, 255, 255, 0.9)' }
    ];
    
    // Create stars for each layer
    const layers = starLayers.map(layer => {
      return Array.from({ length: layer.count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * layer.size + 0.5,
        speed: layer.speed,
        color: layer.color,
        twinkleSpeed: 2 + Math.random() * 5,
        twinklePhase: Math.random() * Math.PI * 2
      }));
    });
    
    // Animation loop
    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and animate stars from each layer with parallax effect
      layers.forEach((stars, layerIndex) => {
        stars.forEach(star => {
          // Calculate parallax offset based on mouse position
          const parallaxX = mousePosition.x * star.speed * 50;
          const parallaxY = mousePosition.y * star.speed * 50;
          
          // Calculate actual position with parallax
          const x = (star.x + parallaxX) % canvas.width;
          const y = (star.y + parallaxY) % canvas.height;
          
          // Apply twinkling effect
          const twinkleFactor = 0.7 + 0.3 * Math.sin(frame * 0.01 * star.twinkleSpeed + star.twinklePhase);
          
          // Draw star
          ctx.beginPath();
          ctx.arc(
            x < 0 ? x + canvas.width : x, 
            y < 0 ? y + canvas.height : y, 
            star.radius * twinkleFactor, 
            0, 
            Math.PI * 2
          );
          
          // Star color with twinkling intensity
          ctx.fillStyle = star.color.replace(')', `, ${twinkleFactor})`).replace('rgba', 'rgba');
          ctx.fill();
          
          // Move star slightly for animation
          star.y += star.speed * 0.2;
          
          // Reset star position if it goes off screen
          if (star.y > canvas.height) star.y = 0;
          if (star.x > canvas.width) star.x = 0;
        });
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
    />
  );
};

// Planet component with orbital system
const Planet = ({ size, top, left, image, rotationSpeed, hasRings = false, satellites = [] }) => {
  // Fallback image path if image is not provided or fails to load
  const imgSrc = image || "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=150&auto=format";
  
  return (
    <Box
      sx={{
        position: 'absolute',
        width: `${size * 3}px`,
        height: `${size * 3}px`,
        top: `${top}%`,
        left: `${left}%`,
        animation: `${float} ${7 + Math.random() * 5}s infinite ease-in-out`,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Planetary Glow */}
      <Box
        sx={{
          position: 'absolute',
          width: `${size * 1.3}px`,
          height: `${size * 1.3}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(8px)',
          opacity: 0.8,
          animation: `${pulseOpacity} 8s infinite ease-in-out`,
        }}
      />
      
      {/* Planetary Rings (if applicable) */}
      {hasRings && (
        <>
          <Box
            sx={{
              position: 'absolute',
              width: `${size * 2.2}px`,
              height: `${size * 0.6}px`,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              transform: 'rotate(25deg)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              opacity: 0.7,
              animation: `${rotate} ${rotationSpeed * 1.5}s infinite linear`,
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              width: `${size * 2}px`,
              height: `${size * 0.5}px`,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              transform: 'rotate(25deg)',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
              opacity: 0.5,
            }}
          />
        </>
      )}
      
      {/* Planet Body */}
      <Box
        sx={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          animation: `${rotate} ${rotationSpeed}s infinite linear`,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt="Planet"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* Atmosphere glow effect */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: 'inset 10px -10px 20px rgba(0, 0, 0, 0.5), inset -10px 10px 20px rgba(255, 255, 255, 0.3)',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
          }}
        />
      </Box>
      
      {/* Satellites/Moons */}
      {satellites.map((satellite, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: `${rotate} ${satellite.orbitPeriod}s infinite linear ${satellite.delay}s`,
            transformOrigin: 'center',
            zIndex: satellite.isFront ? 3 : 1,
          }}
        >
          {/* Satellite/Moon */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${satellite.size}px`,
              height: `${satellite.size}px`,
              borderRadius: '50%',
              backgroundColor: satellite.color || '#f5f5f5',
              boxShadow: `0 0 10px ${satellite.glow || 'rgba(255, 255, 255, 0.8)'}`,
              transform: `translate(-50%, -50%) rotate(${satellite.startAngle}deg) translateX(${satellite.distance}px)`,
              '--orbit-radius': `${satellite.distance}px`,
              animation: `${orbitAnim} ${satellite.orbitPeriod}s infinite linear`,
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

// Nebula component
const Nebula = ({ size, top, left, colors, rotation = 0 }) => (
  <Box
    sx={{
      position: 'absolute',
      width: `${size}px`,
      height: `${size * 0.7}px`,
      top: `${top}%`,
      left: `${left}%`,
      borderRadius: '50%',
      transform: `rotate(${rotation}deg)`,
      background: `radial-gradient(ellipse at center, ${colors[0]} 0%, ${colors[1]} 40%, transparent 75%)`,
      filter: 'blur(20px)',
      opacity: 0.4,
      animation: `${pulseOpacity} ${15 + Math.random() * 10}s infinite ease-in-out`,
      zIndex: 0,
    }}
  />
);

// Meteor animation
const meteorAnimation = keyframes`
  0% {
    transform: translate(-100%, -100%) rotate(45deg);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(200%, 200%) rotate(45deg);
    opacity: 0;
  }
`;

// Meteor component
const Meteor = () => {
  const [position, setPosition] = useState({
    top: Math.random() * 30,
    left: Math.random() * 30,
    duration: 2 + Math.random() * 3,
    size: 100 + Math.random() * 100
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setPosition({
        top: Math.random() * 30,
        left: Math.random() * 30,
        duration: 2 + Math.random() * 3,
        size: 100 + Math.random() * 100
      });
    }, position.duration * 1000);
    
    return () => clearInterval(timer);
  }, [position.duration]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${position.left}%`,
        width: `${position.size}px`,
        height: '2px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
        boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
        animation: `${meteorAnimation} ${position.duration}s linear`,
        transformOrigin: 'left top',
        zIndex: 1,
      }}
    />
  );
};

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isShortScreen = useMediaQuery('(max-height: 700px)');
  const isVeryShortScreen = useMediaQuery('(max-height: 500px)');
  const [nebulae, setNebulae] = useState([]);
  const [meteors, setMeteors] = useState([]);

  // Generate cosmic elements on mount
  useEffect(() => {
    // Create nebulae
    const newNebulae = [
      { id: 1, size: isMobile ? 200 : 400, top: 20, left: 70, colors: ['rgba(147, 112, 219, 0.4)', 'rgba(72, 61, 139, 0.1)'], rotation: 45 },
      { id: 2, size: isMobile ? 300 : 600, top: 70, left: 20, colors: ['rgba(30, 144, 255, 0.3)', 'rgba(0, 0, 128, 0.1)'], rotation: -30 },
      { id: 3, size: isMobile ? 150 : 300, top: 40, left: -10, colors: ['rgba(255, 105, 180, 0.3)', 'rgba(128, 0, 128, 0.1)'], rotation: 15 }
    ];
    
    // Create meteors
    const newMeteors = Array.from({ length: 3 }, (_, i) => ({ id: i }));
    
    setNebulae(newNebulae);
    setMeteors(newMeteors);
  }, [isMobile]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'relative',
        minHeight: {
          xs: isVeryShortScreen ? '100%' : '100vh',
        },
        py: isShortScreen ? 2 : 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      {/* Advanced Starfield Background */}
      <StarfieldCanvas />
      
      {/* Particle Background */}
      <ParticlesBg
        type="cobweb"
        bg={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
        color="#5D3FD3"
        num={isMobile ? 30 : 50}
      />
      
      {/* Nebulae */}
      {nebulae.map(nebula => (
        <Nebula
          key={nebula.id}
          size={nebula.size}
          top={nebula.top}
          left={nebula.left}
          colors={nebula.colors}
          rotation={nebula.rotation}
        />
      ))}
      
      {/* Planets */}
      <Planet 
        size={isMobile ? 40 : isTablet ? 60 : 100}
        top={isMobile ? 15 : 20}
        left={isMobile ? 70 : 75}
        image="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=150&auto=format"
        rotationSpeed={200}
        satellites={[
          { size: 8, distance: isMobile ? 55 : 80, orbitPeriod: 10, delay: 0, startAngle: 0, isFront: true },
          { size: 5, distance: isMobile ? 70 : 100, orbitPeriod: 15, delay: 1, startAngle: 120, isFront: false }
        ]}
      />
      
      <Planet 
        size={isMobile ? 30 : isTablet ? 45 : 70}
        top={isMobile ? 65 : 70}
        left={isMobile ? 15 : 20}
        image="https://images.unsplash.com/photo-1614314169000-4f4bdbe8f1c2?q=80&w=150&auto=format"
        rotationSpeed={180}
        hasRings={true}
      />
      
      {/* Meteors */}
      {meteors.map(meteor => (
        <Meteor key={meteor.id} />
      ))}
      
      {/* Main Content (Glass Card) */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: {
            xs: isShortScreen ? '1rem' : '1.5rem',
            sm: isShortScreen ? '1.5rem' : '2rem',
            md: isShortScreen ? '2rem' : '2.5rem',
          },
          borderRadius: '20px',
          width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
          maxWidth: '800px',
          my: isShortScreen ? 2 : 0,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          animation: 'fadeIn 0.8s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Typography 
          variant={isMobile || isShortScreen ? 'h3' : 'h2'} 
          gutterBottom
          sx={{
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontWeight: 700,
            fontSize: {
              xs: isShortScreen ? '1.5rem' : '1.75rem',
              sm: isShortScreen ? '2rem' : '2.5rem',
              md: isShortScreen ? '2.75rem' : '3.25rem',
            },
            mb: isShortScreen ? 1 : 2,
            fontFamily: '"Orbitron", sans-serif',
            animation: `${glow} 4s infinite ease-in-out`,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: '25%',
              bottom: '-5px',
              width: '50%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #9575CD, transparent)',
              borderRadius: '3px',
            }
          }}
        >
          LUNA.ai
        </Typography>

        <Typography 
          variant={isMobile || isShortScreen ? 'h6' : 'h5'} 
          sx={{
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontSize: {
              xs: isShortScreen ? '0.875rem' : '1rem',
              sm: isShortScreen ? '1rem' : '1.25rem',
              md: isShortScreen ? '1.25rem' : '1.5rem',
            },
            mb: isShortScreen ? 1 : 2,
          }}
        >
          Your cosmic companion for exploring the wonders of space and the universe
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '20px',
            fontSize: {
              xs: isShortScreen ? '0.75rem' : '0.875rem',
              sm: isShortScreen ? '0.875rem' : '1rem',
            },
          }}
        >
          Ask questions about planets, stars, galaxies, space exploration, and cosmic phenomena.
          LUNA will be your guide to understanding the mysteries of the cosmos.
        </Typography>
        
        <Button
          variant="contained"
          size={isMobile || isShortScreen ? "medium" : "large"}
          component={Link}
          href="/chat"
          sx={{ 
            mt: { 
              xs: isShortScreen ? 1 : 2,
              sm: isShortScreen ? 2 : 3,
              md: isShortScreen ? 3 : 4,
            },
            px: isShortScreen ? { xs: 2, sm: 3, md: 4 } : { xs: 3, sm: 4, md: 5 },
            py: isShortScreen ? { xs: 0.5, sm: 1, md: 1.5 } : { xs: 1, sm: 1.5, md: 2 },
            background: 'linear-gradient(45deg, #5D3FD3 30%, #7B68EE 90%)',
            boxShadow: '0 0 20px rgba(93, 63, 211, 0.4)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: `${shimmer} 3s infinite`,
            },
            '&:hover': {
              transform: 'scale(1.05) translateY(-3px)',
              boxShadow: '0 7px 30px rgba(93, 63, 211, 0.6)',
              background: 'linear-gradient(45deg, #7B68EE 30%, #9575CD 90%)',
            },
            '&:active': {
              transform: 'scale(0.98) translateY(2px)',
              boxShadow: '0 2px 10px rgba(93, 63, 211, 0.4)',
            },
            borderRadius: '30px',
            fontWeight: 600,
            letterSpacing: '2px',
            fontFamily: '"Orbitron", sans-serif',
          }}
        >
          Begin Your Cosmic Journey
        </Button>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(149, 117, 205, 0.7)',
            marginTop: '20px',
            fontSize: {
              xs: '0.7rem',
              sm: '0.75rem',
            },
            textAlign: 'center',
          }}
        >
          Powered by OpenAI · Explore the cosmos with LUNA
        </Typography>

        
      </Box>
    </Box>
  );
}