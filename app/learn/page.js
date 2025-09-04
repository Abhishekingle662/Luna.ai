'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Home, MessageCircle, Gamepad2, BookOpen, Calculator, Atom, Telescope, Rocket } from 'lucide-react';
import Navigation from '../components/Navigation';
import dynamic from 'next/dynamic';
import {
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box, 
  IconButton, 
  Tabs, 
  Tab, 
  Paper, 
  Zoom
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Games as GamesIcon, 
  Calculate as CalculateIcon, 
  Chat as ChatIcon 
} from '@mui/icons-material';

// Dynamic import for ParticlesBg to avoid SSR issues
const ParticlesBg = dynamic(() => import('particles-bg'), { 
  ssr: false,
  loading: () => <div className="bg-lunar-deep" />
});



// Learning topic categories
const learningCategories = [
  {
    id: 'fundamentals',
    title: 'Space Fundamentals',
    icon: Telescope,
    description: 'Learn the basics of astronomy and space science',
    topics: [
      { title: 'The Solar System', description: 'Explore planets, moons, and other celestial bodies' },
      { title: 'Stars and Galaxies', description: 'Understanding stellar evolution and cosmic structures' },
      { title: 'Space Exploration History', description: 'Journey through humanity\'s quest to explore space' },
      { title: 'Astronomical Instruments', description: 'Tools that help us observe the universe' }
    ]
  },
  {
    id: 'physics',
    title: 'Astrophysics',
    icon: Atom,
    description: 'Dive into the physics that governs the cosmos',
    topics: [
      { title: 'Gravity and Orbits', description: 'How celestial bodies interact through gravitational forces' },
      { title: 'Light and Radiation', description: 'Understanding electromagnetic spectrum in space' },
      { title: 'Black Holes and Relativity', description: 'Extreme physics in the most exotic objects' },
      { title: 'Quantum Mechanics in Space', description: 'How quantum effects shape the universe' }
    ]
  },
  {
    id: 'math',
    title: 'Mathematical Concepts',
    icon: Calculator,
    description: 'Mathematical principles behind space phenomena',
    topics: [
      { title: 'Orbital Mechanics', description: 'Calculate trajectories and spacecraft paths' },
      { title: 'Distance and Scale', description: 'Understanding cosmic measurements and scales' },
      { title: 'Physics Equations', description: 'Key formulas used in astrophysics' },
      { title: 'Statistics in Astronomy', description: 'Data analysis in astronomical research' }
    ]
  },
  {
    id: 'exploration',
    title: 'Space Missions',
    icon: Rocket,
    description: 'Learn about past, current, and future space missions',
    topics: [
      { title: 'Historic Missions', description: 'Apollo, Voyager, and other landmark missions' },
      { title: 'Current Missions', description: 'Active space exploration programs' },
      { title: 'Future Plans', description: 'Upcoming missions to Mars, Moon, and beyond' },
      { title: 'Mission Planning', description: 'How space missions are designed and executed' }
    ]
  }
]

// Topic Card Component
const TopicCard = ({ topic, index }) => (
  <motion.div
    className="card cursor-pointer group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
  >
    <h3 className="text-xl font-space-grotesk font-semibold text-lunar-accent mb-3 group-hover:lunar-glow transition-all duration-300">
      {topic.title}
    </h3>
    <p className="font-lato text-lunar-light leading-relaxed">
      {topic.description}
    </p>
    <div className="mt-4 flex justify-end">
      <span className="text-sm font-lato text-lunar-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Learn more →
      </span>
    </div>
  </motion.div>
)

// Category Section Component
const CategorySection = ({ category, isActive }) => {
  if (!isActive) return null;
  
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {category.topics.map((topic, index) => (
        <TopicCard key={topic.title} topic={topic} index={index} />
      ))}
    </motion.div>
  );
}

// Space topics data
const spaceTopics = [
  {
    id: 'solar-system',
    title: 'Our Solar System',
    image: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29sYXIlMjBzeXN0ZW18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    description: 'Learn about our Sun and the eight planets orbiting it, from the rocky inner worlds to the gas giants of the outer solar system.',
    facts: [
      'The Solar System formed about 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud.',
      'The four inner planets (Mercury, Venus, Earth, and Mars) are terrestrial planets made mostly of rock and metal.',
      'The four outer planets (Jupiter, Saturn, Uranus, and Neptune) are gas giants composed mainly of hydrogen and helium.',
      'Pluto was reclassified as a dwarf planet in 2006, along with Ceres, Haumea, Makemake, and Eris.'
    ]
  },
  {
    id: 'black-holes',
    title: 'Black Holes',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxhY2slMjBob2xlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    description: 'Explore the mysterious cosmic objects where gravity is so strong that nothing, not even light, can escape once it comes too close.',
    facts: [
      'Black holes form when very massive stars die and collapse under their own gravity.',
      'In 2019, astronomers captured the first image of a black hole\'s shadow, located in the galaxy M87.',
      'Supermassive black holes with masses millions or billions of times that of our Sun exist at the centers of most galaxies.',
      'Despite their name, black holes are not empty space—they contain an enormous amount of matter compressed into a tiny area.'
    ]
  },
  {
    id: 'exoplanets',
    title: 'Exoplanets',
    image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGV4b3BsYW5ldHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    description: 'Discover worlds beyond our solar system, from gas giants to potentially habitable Earth-like planets.',
    facts: [
      'Over 5,000 exoplanets have been confirmed as of 2023, with thousands more candidates awaiting confirmation.',
      'The first exoplanets were discovered in the 1990s, and the field has exploded since then thanks to missions like Kepler and TESS.',
      'Some exoplanets orbit multiple stars, just like Tatooine from Star Wars.',
      'Scientists use various methods to detect exoplanets, including the transit method (watching for dips in star brightness) and the radial velocity method (measuring a star\'s "wobble").'
    ]
  },
  {
    id: 'cosmology',
    title: 'Cosmology',
    image: 'https://images.unsplash.com/photo-1532010940201-c31e6beacd39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29zbW9sb2d5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    description: 'Study the origin, evolution, and ultimate fate of the universe, from the Big Bang to the distant future.',
    facts: [
      'The universe is estimated to be about 13.8 billion years old, based on observations of the cosmic microwave background radiation.',
      'According to the Big Bang theory, the universe expanded from an extremely hot, dense state.',
      'Dark energy makes up about 68% of the universe and is responsible for its accelerating expansion.',
      'Dark matter makes up about 27% of the universe, but we can only detect it through its gravitational effects.'
    ]
  },
  {
    id: 'stars',
    title: 'Stars & Stellar Evolution',
    image: 'https://images.unsplash.com/photo-1539321908154-04927596764d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    description: 'Understand how stars form, live, and die - from stellar nurseries to supernovas and neutron stars.',
    facts: [
      'Stars form from clouds of gas and dust called nebulae when gravity pulls the matter together.',
      'Our Sun is a medium-sized yellow dwarf star in the middle of its life cycle, about 4.6 billion years old.',
      'Massive stars end their lives in spectacular explosions called supernovas, which create many of the elements heavier than iron.',
      'After a supernova, the core of the star may become a neutron star or black hole, depending on its mass.'
    ]
  },
  {
    id: 'space-exploration',
    title: 'Space Exploration',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BhY2UlMjBleHBsb3JhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    description: 'Follow humanity\'s journey to the stars, from the first satellites to the International Space Station and Mars rovers.',
    facts: [
      'The first human-made object to reach space was the Soviet Union\'s Sputnik 1 satellite in 1957.',
      'The first human in space was Yuri Gagarin, who orbited Earth on April 12, 1961.',
      'Apollo 11 astronauts Neil Armstrong and Buzz Aldrin were the first humans to walk on the Moon on July 20, 1969.',
      'As of 2023, rovers like Perseverance and Curiosity are exploring Mars, while Voyager 1 and 2 continue to send data from interstellar space.'
    ]
  }
];

// Remove the duplicate function definition and keep only one export default
export default function LearnPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  // Check for mobile on client side only
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 600);
      }
    };
    
    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Space-themed light theme
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Twinkling starfield background */}
      <div className="starfield-bg" />      <Navigation />      <Container maxWidth="lg" sx={{ minHeight: '100vh', pt: { xs: 4, md: 6 }, pb: 10 }}>
        {/* Enhanced Header */}
        <Box sx={{ textAlign: 'center', mb: 10, position: 'relative', mt: { xs: 2, md: 4 } }}>
          {/* Decorative background glow */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '300px', md: '500px' },
              height: { xs: '300px', md: '500px' },
              background: 'radial-gradient(circle, rgba(240, 246, 252, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: -1,
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          
          <Typography 
            variant="h1" 
            component="h1"
            sx={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              color: 'transparent',
              background: 'linear-gradient(135deg, rgba(240, 246, 252, 1) 0%, rgba(240, 246, 252, 0.7) 50%, rgba(240, 246, 252, 1) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              letterSpacing: { xs: '2px', md: '4px' },
              textShadow: '0 0 30px rgba(240, 246, 252, 0.3)',
              mb: 4,
              position: 'relative',
              lineHeight: 1.1,
              animation: 'cosmic-glow 4s ease-in-out infinite alternate',              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: 'linear-gradient(45deg, transparent, rgba(240, 246, 252, 0.05), transparent)',
                borderRadius: '50%',
                zIndex: -1,
                animation: 'rotate 20s linear infinite',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, rgba(240, 246, 252, 0.6), transparent)',
                borderRadius: '2px',
                animation: 'pulse 2s ease-in-out infinite',
              },
              '@keyframes cosmic-glow': {
                '0%': {
                  textShadow: '0 0 20px rgba(240, 246, 252, 0.3), 0 0 40px rgba(240, 246, 252, 0.1)',
                  transform: 'scale(1)',
                },
                '100%': {
                  textShadow: '0 0 40px rgba(240, 246, 252, 0.5), 0 0 80px rgba(240, 246, 252, 0.2)',
                  transform: 'scale(1.01)',
                },
              },
              '@keyframes rotate': {
                '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
              },
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.3 },
                '50%': { opacity: 1 },
              },
            }}
          >
            Space Science Academy
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#c8d1d9', 
              maxWidth: '900px', 
              mx: 'auto', 
              opacity: 0.85, 
              fontFamily: 'Lato, sans-serif',
              fontWeight: 300,
              lineHeight: 1.7,
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.2)',
              px: { xs: 2, md: 0 },
              animation: 'fadeInUp 1.2s ease-out 0.6s both',
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                '100%': {
                  opacity: 0.9,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            Explore the wonders of our universe through these educational topics
          </Typography>
            {/* Floating particles effect */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -2 }}>
            {[...Array(4)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: '3px',
                  height: '3px',
                  background: 'rgba(240, 246, 252, 0.4)',
                  borderRadius: '50%',
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animation: `float-particle-${i} ${4 + Math.random() * 3}s ease-in-out infinite`,
                  '@keyframes float-particle-0': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: 0.2 },
                    '50%': { transform: 'translateY(-25px) translateX(15px)', opacity: 0.6 },
                  },
                  '@keyframes float-particle-1': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: 0.3 },
                    '50%': { transform: 'translateY(-20px) translateX(-10px)', opacity: 0.7 },
                  },
                  '@keyframes float-particle-2': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: 0.2 },
                    '50%': { transform: 'translateY(-30px) translateX(20px)', opacity: 0.5 },
                  },
                  '@keyframes float-particle-3': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: 0.4 },
                    '50%': { transform: 'translateY(-22px) translateX(-15px)', opacity: 0.8 },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
        {selectedTopic ? (
          /* Topic detail view */
          <Zoom in={animateIn}>
            <Paper elevation={3} className="card" sx={{ p: { xs: 2, md: 4 }, animation: 'fadeIn 0.5s ease-out' }}>
              <Box sx={{ mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBackClick} variant="outlined" sx={{ mb: 2 }}>
                  Back to Topics
                </Button>
                <Typography variant="h4" className="lunar-glow" sx={{ mb: 3, fontFamily: 'Space Grotesk, sans-serif', color: '#f0f6fc', fontWeight: 'bold' }}>
                  {selectedTopic.title}
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <Box
                    component="img"
                    src={selectedTopic.image}
                    alt={selectedTopic.title}
                    sx={{ width: '100%', borderRadius: '0.75rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', mb: { xs: 2, md: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', color: '#c8d1d9', fontFamily: 'Lato, sans-serif' }}>
                    {selectedTopic.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, color: '#f0f6fc', fontWeight: 'bold', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Key Facts
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {selectedTopic.facts.map((fact, index) => (
                      <Box component="li" key={index} sx={{ mb: 2, color: '#c8d1d9', fontFamily: 'Lato, sans-serif' }}>
                        <Typography variant="body1">{fact}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      component={Link}
                      href={`/chat?topic=${selectedTopic.id}`}
                      startIcon={<ChatIcon />}
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
                sx={{ mb: 3 }}
              >
                {spaceTopics.map((topic, index) => (
                  <Tab 
                    key={topic.id} 
                    label={topic.title}
                    sx={{ color: '#c8d1d9', fontFamily: 'Space Grotesk, sans-serif', '&.Mui-selected': { color: '#f0f6fc' } }} 
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
                    <Card onClick={() => handleTopicClick(spaceTopics[currentTab])} className="card" sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia component="img" height="200" image={spaceTopics[currentTab].image} alt={spaceTopics[currentTab].title} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#f0f6fc', fontFamily: 'Space Grotesk, sans-serif' }}>
                          {spaceTopics[currentTab].title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#c8d1d9', fontFamily: 'Lato, sans-serif' }}>
                          {spaceTopics[currentTab].description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ) : (
                // Desktop: Show all topics in grid
                spaceTopics.map((topic, index) => (
                  <Grid item xs={12} sm={6} md={4} key={topic.id}>
                    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card onClick={() => handleTopicClick(topic)} className="card" sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia component="img" height="200" image={topic.image} alt={topic.title} />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#f0f6fc', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {topic.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#c8d1d9', fontFamily: 'Lato, sans-serif' }}>
                            {topic.description}
                          </Typography>
                        </CardContent>
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
          <IconButton component={Link} href="/chat" color="primary" size="large" sx={{ bgcolor: '#24292e', backdropFilter: 'blur(5px)', p: 2, boxShadow: '0 0 15px rgba(240, 246, 252, 0.2)', '&:hover': { bgcolor: '#3d444c' } }}>
            <ChatIcon sx={{ fontSize: '2rem', color: '#111316' }} />
          </IconButton>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
