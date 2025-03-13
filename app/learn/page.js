'use client'
import { useState, useEffect } from 'react';
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
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { keyframes } from '@mui/system';
import dynamic from 'next/dynamic';
import GamesIcon from '@mui/icons-material/Games';

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

export default function LearnPage() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

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
            href="/chat"
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
            Back to Chat
          </Button>
        </Box>

        {/* Games button */}
        <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 10 }}>
          <Button
            component={Link}
            href="/games"
            startIcon={<GamesIcon />}
            variant="outlined"
            sx={{
              color: '#64B5F6',
              borderColor: 'rgba(100, 181, 246, 0.5)',
              backdropFilter: 'blur(5px)',
              '&:hover': {
                borderColor: '#64B5F6',
                backgroundColor: 'rgba(100, 181, 246, 0.1)',
              },
            }}
          >
            Space Games
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
            Space Science Academy
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
            Explore the wonders of our universe through these educational topics
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
                <Grid item xs={12} md={5}>
                  <Box
                    component="img"
                    src={selectedTopic.image}
                    alt={selectedTopic.title}
                    sx={{
                      width: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      mb: { xs: 2, md: 0 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                    {selectedTopic.description}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      color: '#9575CD',
                      fontWeight: 'bold',
                    }}
                  >
                    Key Facts
                  </Typography>
                  
                  <Box component="ul" sx={{ pl: 2 }}>
                    {selectedTopic.facts.map((fact, index) => (
                      <Box 
                        component="li" 
                        key={index} 
                        sx={{ 
                          mb: 2,
                          animation: `${fadeIn} ${0.3 + index * 0.1}s ease-out`,
                        }}
                      >
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
                {spaceTopics.map((topic, index) => (
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
                      onClick={() => handleTopicClick(spaceTopics[currentTab])}
                      sx={{ 
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={spaceTopics[currentTab].image}
                        alt={spaceTopics[currentTab].title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#9575CD' }}>
                          {spaceTopics[currentTab].title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {spaceTopics[currentTab].description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ) : (
                // Desktop: Show all topics in grid
                spaceTopics.map((topic, index) => (
                  <Grid item key={topic.id} xs={12} sm={6} md={4}>
                    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card 
                        onClick={() => handleTopicClick(topic)}
                        sx={{ 
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={topic.image}
                          alt={topic.title}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#9575CD' }}>
                            {topic.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
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
