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
import { Home, MessageCircle, Gamepad2, Calculator } from 'lucide-react';

// Navigation Header Component
const NavigationHeader = () => (
  <header className="nav-header p-4 fixed top-0 left-0 right-0 z-50 bg-lunar-dark/80 backdrop-blur-lg border-b border-lunar-gray">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-space-grotesk font-bold text-lunar-accent lunar-glow">
        Luna.ai
      </Link>
      
      <nav className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2 text-lunar-light hover:text-lunar-accent transition-colors">
          <Home size={20} />
          <span className="hidden sm:inline font-lato">Home</span>
        </Link>
        <Link href="/chat" className="flex items-center space-x-2 text-lunar-light hover:text-lunar-accent transition-colors">
          <MessageCircle size={20} />
          <span className="hidden sm:inline font-lato">Chat</span>
        </Link>
        <Link href="/games" className="flex items-center space-x-2 text-lunar-light hover:text-lunar-accent transition-colors">
          <Gamepad2 size={20} />
          <span className="hidden sm:inline font-lato">Games</span>
        </Link>
        <Link href="/learn" className="flex items-center space-x-2 text-lunar-light hover:text-lunar-accent transition-colors">
          <Calculator size={20} />
          <span className="hidden sm:inline font-lato">Learn</span>
        </Link>
      </nav>
    </div>
  </header>
);

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

// Import particles background dynamically with error handling
const ParticlesBg = dynamic(() => 
  import('particles-bg').catch((error) => {
    console.warn('Failed to load particles-bg:', error);
    // Return a fallback component that renders nothing
    return { default: () => null };
  }), { 
  ssr: false,
  loading: () => <div style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
    zIndex: -1 
  }} />
});

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
    box-shadow: 0 0 10px rgba(240, 246, 252, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(240, 246, 252, 0.9);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(240, 246, 252, 0.7);
  }
`;

const glow = keyframes`
  0% {
    text-shadow: 0 0 5px rgba(240, 246, 252, 0.7);
  }
  50% {
    text-shadow: 0 0 15px rgba(240, 246, 252, 1), 0 0 20px rgba(240, 246, 252, 0.8);
  }
  100% {
    text-shadow: 0 0 5px rgba(240, 246, 252, 0.7);
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

  // Lunar Shadow monochrome theme
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#f0f6fc' }, // accent
      secondary: { main: '#3d444c' },
      background: {
        default: '#111316',
        paper: '#24292e',
      },
      text: {
        primary: '#c8d1d9',
        secondary: '#c8d1d9',
      },
    },
    typography: {
      fontFamily: 'Lato, sans-serif',
      h1: { fontFamily: 'Space Grotesk, sans-serif', color: '#f0f6fc', fontWeight: 700 },
      h2: { fontFamily: 'Space Grotesk, sans-serif', color: '#f0f6fc', fontWeight: 700 },
      h3: { fontFamily: 'Space Grotesk, sans-serif', color: '#f0f6fc', fontWeight: 700 },
      h4: { fontFamily: 'Space Grotesk, sans-serif', color: '#f0f6fc', fontWeight: 700 },
      h5: { fontFamily: 'Space Grotesk, sans-serif', color: '#f0f6fc', fontWeight: 700 },
      h6: { fontFamily: 'Space Grotesk, sans-serif', color: '#f0f6fc', fontWeight: 700 },
      body1: { color: '#c8d1d9' },
      body2: { color: '#c8d1d9' },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#24292e',
            border: '1px solid #3d444c',
            borderRadius: '0.75rem',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(240, 246, 252, 0.1)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem',
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: 'Space Grotesk, sans-serif',
            padding: '12px 24px',
          },
          contained: {
            backgroundColor: '#f0f6fc',
            color: '#111316',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/rocky-wall.png")',
            backgroundBlendMode: 'overlay',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#f0f6fc',
              color: '#111316',
              transform: 'translateY(-2px)',
              boxShadow: '0 0 20px rgba(240, 246, 252, 0.3)',
            },
          },
          outlined: {
            border: '1px solid #f0f6fc',
            color: '#f0f6fc',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: '#f0f6fc',
              color: '#111316',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#24292e',
            border: '1px solid #3d444c',
            borderRadius: '0.75rem',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#f0f6fc',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: '#c8d1d9',
            '&.Mui-selected': {
              color: '#f0f6fc',
            },
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
      <NavigationHeader />

      {/* Particles background */}
      <ParticlesBg type="cobweb" bg={true} color="#f0f6fc" num={isMobile ? 25 : 50} />        {/* Main container */}
      <Container maxWidth="lg" sx={{ minHeight: '100vh', pt: { xs: 12, md: 14 }, pb: 10 }}>
        {/* Header with integrated back button */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Button
              component={Link}
              href="/learn"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{
                color: 'rgba(240, 246, 252, 0.9)',
                borderColor: 'rgba(240, 246, 252, 0.5)',
                backdropFilter: 'blur(5px)',
                mr: 3,
                '&:hover': {
                  borderColor: 'rgba(240, 246, 252, 0.9)',
                  backgroundColor: 'rgba(240, 246, 252, 0.1)',
                },
              }}
            >
              Back to Learn
            </Button>
          </Box>          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              color: 'rgba(240, 246, 252, 0.9)',
              fontFamily: 'var(--font-exo-2), sans-serif',
              textShadow: '0 0 10px rgba(240, 246, 252, 0.7)',
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
                backgroundColor: 'rgba(25, 25, 35, 0.8)',                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(240, 246, 252, 0.3)',
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
                </Button>                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 3, 
                    color: 'rgba(240, 246, 252, 0.9)',
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
                        background: 'linear-gradient(45deg, rgba(240, 246, 252, 0.7) 30%, rgba(240, 246, 252, 0.7) 90%)',
                        boxShadow: '0 0 10px rgba(240, 246, 252, 0.7)',
                        '&:hover': {
                          boxShadow: '0 0 15px rgba(240, 246, 252, 1)',
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
                scrollButtons="auto"                sx={{ 
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'rgba(240, 246, 252, 0.9)',
                  }
                }}
              >
                {physicsTopics.map((topic, index) => (
                  <Tab 
                    key={topic.id} 
                    label={topic.title}                    sx={{
                      color: '#E0E0E0',
                      '&.Mui-selected': {
                        color: 'rgba(240, 246, 252, 0.9)',
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
                      <CardContent sx={{ flexGrow: 1 }}>                        <Typography gutterBottom variant="h5" component="h2" sx={{ color: 'rgba(240, 246, 252, 0.9)' }}>
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
                        <CardContent sx={{ flexGrow: 1 }}>                          <Typography gutterBottom variant="h5" component="h2" sx={{ color: 'rgba(240, 246, 252, 0.9)' }}>
                            {topic.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {topic.description}
                          </Typography>
                        </CardContent>
                        <Box sx={{ p: 2 }}>                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleTopicClick(topic)}
                            sx={{
                              background: 'linear-gradient(45deg, rgba(240, 246, 252, 0.7) 30%, rgba(240, 246, 252, 0.7) 90%)',
                              boxShadow: '0 0 10px rgba(240, 246, 252, 0.7)',
                              '&:hover': {
                                boxShadow: '0 0 15px rgba(240, 246, 252, 1)',
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
              p: 2,              boxShadow: '0 0 15px rgba(240, 246, 252, 0.7)',
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
