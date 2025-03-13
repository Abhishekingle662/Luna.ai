'use client'

import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card,           
  CardContent,    
  CardMedia,      
  Grid, 
  Button, 
  Container,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Zoom,
  CssBaseline,
  useMediaQuery,
  Slider,
  TextField,
  Collapse
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { keyframes } from '@mui/system';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import GravitySection from '../../components/GravitySection';

// Dynamic import for MathJax
const MathJax = dynamic(
  async () => {
    const MathJaxModule = await import('react-mathjax2');
    return MathJaxModule.MathJax;
  },
  {
    ssr: false,
    loading: () => <div>Loading MathJax...</div>,
  }
);

// Import particles background dynamically to avoid SSR issues
const ParticlesBg = dynamic(() => import('particles-bg'), { ssr: false });

// Define animations
const float = keyframes`
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-15px) translateX(10px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(149, 117, 205, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(149, 117, 205, 0.9);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(149, 117, 205, 0.7);
  }
`;

const glow = keyframes`
  0% {
    text-shadow: 0 0 5px rgba(149, 117, 205, 0.7);
  }
  50% {
    text-shadow: 0 0 15px rgba(149, 117, 205, 1), 0 0 20px rgba(149, 117, 205, 0.8);
  }
  100% {
    text-shadow: 0 0 5px rgba(149, 117, 205, 0.7);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// Physics concepts data
const physicsTopics = [
  {
    id: 'gravity',
    title: 'Gravity and Orbits',
    description: 'Explore gravitational forces and how objects orbit in space.',
    summary: 'Gravity is the fundamental force that governs the motion of celestial bodies. Understanding gravity allows us to predict the orbits of planets, moons, and satellites.',
    equations: [
      { label: "Newton's Law of Universal Gravitation", equation: "F = G \\frac{m_1 m_2}{r^2}", description: "Describes the gravitational force between two masses." },
      { label: "Gravitational Potential Energy", equation: "U = -G \\frac{m_1 m_2}{r}", description: "Represents the energy required to separate two masses to infinity." },
      { label: "Orbital Velocity", equation: "v = \\sqrt{\\frac{GM}{r}}", description: "Calculates the velocity required for an object to maintain a stable orbit." },
      { label: "Kepler's Third Law", equation: "T^2 \\propto r^3", description: "Relates the orbital period to the semi-major axis of the orbit." },
    ],
    facts: [
      "Gravity is the force that attracts two bodies toward each other, proportional to their masses.",
      "Earth's gravity gives objects a downward acceleration of 9.8 m/s².",
      "Einstein's theory of General Relativity describes gravity as a curvature of spacetime.",
      "Black holes have gravity so strong that not even light can escape.",
    ],
    visualization: {
      type: 'image',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Earth_Gravity_animation.gif/300px-Earth_Gravity_animation.gif',
      alt: 'Gravity Visualization',
      caption: 'Visualization of Earth\'s gravity affecting objects.'
    }
  },
  {
    id: 'waves',
    title: 'Wave Physics',
    description: 'Understand the properties and behaviors of waves in various mediums.',
    summary: 'Wave physics is crucial for understanding light, sound, and other phenomena in space. It helps us analyze the electromagnetic spectrum and the behavior of gravitational waves.',
    equations: [
      { label: "Wave Equation", equation: "\\frac{\\partial^2 y}{\\partial t^2} = v^2 \\frac{\\partial^2 y}{\\partial x^2}", description: "Describes the propagation of waves through a medium." },
      { label: "Wave Speed", equation: "v = f \\lambda", description: "Relates the speed of a wave to its frequency and wavelength." },
      { label: "Doppler Effect", equation: "f' = f \\frac{v \\pm v_r}{v \\mp v_s}", description: "Explains the change in frequency of a wave due to the relative motion of the source and observer." },
    ],
    facts: [
      "Light waves can travel through the vacuum of space, unlike sound waves which need a medium.",
      "The electromagnetic spectrum includes radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays.",
      "Gravitational waves are ripples in spacetime caused by violent cosmic events like merging black holes.",
      "The light from distant galaxies is redshifted due to the expansion of the universe."
    ],
    visualization: {
      type: 'youtube',
      src: 'https://www.youtube.com/embed/3QvvcjE-4j8',
      alt: 'Wave Visualization',
      caption: 'Visualization of wave propagation.'
    }
  },
  {
    id: 'relativity',
    title: 'Special Relativity',
    description: 'Discover how space and time are relative at high speeds.',
    summary: 'Special relativity revolutionized our understanding of space and time, showing that they are relative and interconnected. It is essential for understanding high-speed phenomena in space.',
    equations: [
      { label: "Time Dilation", equation: "\\Delta t' = \\frac{\\Delta t}{\\sqrt{1-\\frac{v^2}{c^2}}}", description: "Describes how time passes slower for moving objects." },
      { label: "Length Contraction", equation: "L' = L\\sqrt{1-\\frac{v^2}{c^2}}", description: "Explains how the length of an object appears shorter when it moves at high speeds." },
      { label: "Mass-Energy Equivalence", equation: "E = mc^2", description: "Shows the relationship between energy and mass." },
      { label: "Relativistic Momentum", equation: "p = \\frac{mv}{\\sqrt{1-\\frac{v^2}{c^2}}}", description: "Calculates the momentum of an object moving at relativistic speeds." },
    ],
    facts: [
      "Einstein's Special Relativity shows that time passes slower for moving objects, an effect called time dilation.",
      "Nothing can travel faster than the speed of light in vacuum (299,792,458 m/s).",
      "Traveling near the speed of light, an object's mass effectively increases from an observer's perspective.",
      "The famous equation E=mc² shows that mass and energy are equivalent and can be converted into each other."
    ],
    visualization: {
      type: 'simulation',
      src: '/simulations/relativity',
      alt: 'Relativity Simulation',
      caption: 'Interactive simulation of time dilation and length contraction.'
    }
  },
  {
    id: 'quantum',
    title: 'Quantum Physics',
    description: 'Peer into the strange world of quantum mechanics and particle behavior.',
    summary: 'Quantum physics governs the behavior of matter at the smallest scales. It is essential for understanding the properties of stars, black holes, and other exotic objects in space.',
    equations: [
      { label: "Schrödinger Equation", equation: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi", description: "Describes the time evolution of quantum systems." },
      { label: "Heisenberg Uncertainty Principle", equation: "\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}", description: "States that it is impossible to know both the position and momentum of a particle with perfect accuracy." },
      { label: "De Broglie Wavelength", equation: "\\lambda = \\frac{h}{p}", description: "Relates the wavelength of a particle to its momentum." },
      { label: "Quantum Energy Levels", equation: "E_n = -\\frac{13.6 \\text{ eV}}{n^2}", description: "Calculates the energy levels of electrons in atoms." },
    ],
    facts: [
      "Quantum physics describes nature at the smallest scales of atoms and subatomic particles.",
      "Particles can exist in multiple states simultaneously (superposition) until measured.",
      "Quantum entanglement allows particles to be connected regardless of distance.",
      "The Schrödinger's cat thought experiment illustrates the paradoxical nature of quantum superposition."
    ],
    visualization: {
      type: 'simulation',
      src: '/simulations/quantum',
      alt: 'Quantum Simulation',
      caption: 'Interactive simulation of quantum phenomena.'
    }
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    description: 'Study how energy transfers and transforms in physical systems.',
    summary: 'Thermodynamics is crucial for understanding the energy balance in stars, planets, and other celestial bodies. It helps us analyze the flow of heat and the efficiency of energy conversion processes.',
    equations: [
      { label: "First Law", equation: "\\Delta U = Q - W", description: "States that the change in internal energy of a system is equal to the heat added minus the work done." },
      { label: "Entropy", equation: "\\Delta S = \\frac{Q}{T}", description: "Measures the disorder in a system." },
      { label: "Ideal Gas Law", equation: "PV = nRT", description: "Relates the pressure, volume, and temperature of an ideal gas." },
      { label: "Stefan-Boltzmann Law", equation: "P = \\sigma A T^4", description: "Calculates the power radiated by a black body." },
    ],
    facts: [
      "The laws of thermodynamics govern energy transformations in the universe.",
      "Entropy measures disorder in a system and always increases in isolated systems (Second Law).",
      "Stars like our Sun are powered by nuclear fusion, converting mass to energy according to E=mc².",
      "The eventual heat death of the universe is a prediction based on the Second Law of Thermodynamics."
    ],
    visualization: {
      type: 'simulation',
      src: '/simulations/thermodynamics',
      alt: 'Thermodynamics Simulation',
      caption: 'Interactive simulation of thermodynamic processes.'
    }
  },
];

// Placeholder components for each section
function WavePhysicsSection() {
  return <Typography>Content for Wave Physics section will go here.</Typography>;
}

function RelativitySection() {
  return <Typography>Content for Special Relativity section will go here.</Typography>;
}

function QuantumPhysicsSection() {
  return <Typography>Content for Quantum Physics section will go here.</Typography>;
}

function ThermodynamicsSection() {
  return <Typography>Content for Thermodynamics section will go here.</Typography>;
}

export default function MathPhysicsPage() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Space-themed light theme
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#9575CD', // Purple for space theme
      },
      secondary: {
        main: '#1E88E5', // Blue
      },
      background: {
        default: '#121212',
        paper: 'rgba(25, 25, 35, 0.85)',
      },
      text: {
        primary: '#E0E0E0',
      },
    },
    typography: {
      fontFamily: 'var(--font-space-grotesk), "Roboto", "Arial", sans-serif',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(25, 25, 35, 0.7)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 20px rgba(149, 117, 205, 0.4)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '30px',
            textTransform: 'none',
            fontWeight: 'bold',
            padding: '8px 20px',
          },
        },
      },
    },
  });

  useEffect(() => {
    // Reset animation when topic changes
    setAnimateIn(false);
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, [selectedTopic]);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleBackClick = () => {
    setSelectedTopic(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Particles background */}
      <ParticlesBg type="cobweb" bg={true} color="#8364E8" num={isMobile ? 25 : 50} />
      
      {/* Main container */}
      <Container maxWidth="lg" sx={{ minHeight: '100vh', pt: { xs: 8, md: 12 }, pb: 10 }}>
        {/* Navigation buttons */}
        <Box sx={{ position: 'fixed', top: 20, left: 20, zIndex: 10 }}>
          <Button
            component={Link}
            href="/learn"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              color: '#9575CD',
              borderColor: 'rgba(149, 117, 205, 0.5)',
              backdropFilter: 'blur(5px)',
              '&:hover': {
                borderColor: '#9575CD',
                backgroundColor: 'rgba(149, 117, 205, 0.1)',
              },
            }}
          >
            Back to Learn
          </Button>
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              color: '#9575CD',
              fontFamily: 'var(--font-exo-2), sans-serif',
              textShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
              fontWeight: 700,
              letterSpacing: { xs: '2px', md: '3px' },
              mb: 2,
              animation: `${pulse} 5s infinite ease-in-out`,
            }}
          >
            Space Math & Physics
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#E0E0E0', 
              maxWidth: '700px', 
              mx: 'auto',
              opacity: 0.9,
            }}
          >
            Explore the mathematical and physical principles behind the cosmos
          </Typography>
        </Box>

        {selectedTopic ? (
          /* Topic detail view */
          <Zoom in={animateIn}>
            <Paper 
              elevation={3}
              sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: 'rgba(25, 25, 35, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(149, 117, 205, 0.3)',
                animation: `${fadeIn} 0.5s ease-out`,
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Button 
                  startIcon={<ArrowBackIcon />} 
                  onClick={handleBackClick}
                  sx={{ mb: 2 }}
                >
                  Back to Topics
                </Button>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 3, 
                    color: '#9575CD',
                    fontWeight: 'bold',
                  }}
                >
                  {selectedTopic.title}
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={12}>
                  {selectedTopic.id === 'gravity' && <GravitySection />}
                  {selectedTopic.id === 'waves' && <WavePhysicsSection />}
                  {selectedTopic.id === 'relativity' && <RelativitySection />}
                  {selectedTopic.id === 'quantum' && <QuantumPhysicsSection />}
                  {selectedTopic.id === 'thermodynamics' && <ThermodynamicsSection />}
                  
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      component={Link}
                      href={`/chat?topic=${selectedTopic.id}`}
                      startIcon={<ChatIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #5D3FD3 30%, #9575CD 90%)',
                        boxShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
                        '&:hover': {
                          boxShadow: '0 0 15px rgba(149, 117, 205, 1)',
                        },
                      }}
                    >
                      Ask LUNA about {selectedTopic.title}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        ) : (
          /* Topics grid view */
          <Box>
            {/* Topic tabs for mobile */}
            {isMobile && (
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#9575CD',
                  }
                }}
              >
                {physicsTopics.map((topic, index) => (
                  <Tab 
                    key={topic.id} 
                    label={topic.title}
                    sx={{
                      color: '#E0E0E0',
                      '&.Mui-selected': {
                        color: '#9575CD',
                      }
                    }} 
                  />
                ))}
              </Tabs>
            )}
            
            {/* Topics grid */}
            <Grid container spacing={3}>
              {isMobile ? (
                // Mobile: Show only current tab
                <Grid item xs={12}>
                  <Zoom in={true}>
                    <Card 
                      onClick={() => handleTopicClick(physicsTopics[currentTab])}
                      sx={{ 
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#9575CD' }}>
                          {physicsTopics[currentTab].title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {physicsTopics[currentTab].description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ) : (
                // Desktop: Show all topics in grid
                physicsTopics.map((topic, index) => (
                  <Grid item key={topic.id} xs={12} sm={6} md={4}>
                    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card 
                        sx={{
                          backgroundColor: 'rgba(25, 25, 35, 0.7)',
                          backdropFilter: 'blur(10px)',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(149, 117, 205, 0.4)',
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#9575CD' }}>
                            {topic.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {topic.description}
                          </Typography>
                        </CardContent>
                        <Box sx={{ p: 2 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleTopicClick(topic)}
                            sx={{
                              background: 'linear-gradient(45deg, #5D3FD3 30%, #9575CD 90%)',
                              boxShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
                              '&:hover': {
                                boxShadow: '0 0 15px rgba(149, 117, 205, 1)',
                              },
                            }}
                          >
                            Learn More
                          </Button>
                        </Box>
                      </Card>
                    </Zoom>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
        
        {/* Chat button */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 10 }}>
          <IconButton 
            component={Link} 
            href="/chat"
            color="primary"
            size="large"
            sx={{ 
              bgcolor: 'rgba(25, 25, 35, 0.7)',
              backdropFilter: 'blur(5px)',
              p: 2,
              boxShadow: '0 0 15px rgba(149, 117, 205, 0.7)',
              '&:hover': {
                bgcolor: 'rgba(35, 35, 45, 0.8)',
                animation: `${pulse} 2s infinite`,
              }
            }}
          >
            <ChatIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
