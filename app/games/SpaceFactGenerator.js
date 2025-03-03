'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CardMedia,
  CircularProgress,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { keyframes } from '@mui/system';

// Animation for stars twinkling
const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// NASA API endpoints - move key to environment variable in production
const NASA_API_KEY = 'QwBO9buK8b8mmqmTcwnIDOCuuAOW5CogPKWvYVZt'; // Use your NASA API key or DEMO_KEY
const APOD_API = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
const NASA_LIBRARY_API = 'https://images-api.nasa.gov';
const NASA_TECHPORT_API = `https://api.nasa.gov/techport/api/projects?api_key=${NASA_API_KEY}`;
const NASA_EPIC_API = `https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_API_KEY}`;

// Categories for images search
const CATEGORIES = [
  "nebula", "galaxy", "star", "planet", "moon", 
  "sun", "asteroid", "comet", "black hole", "supernova", 
  "mars", "jupiter", "saturn", "space exploration"
];

// Backup facts in case API fails
const FALLBACK_FACTS = [
  {
    title: "Black Hole Power",
    fact: "If you could harness the energy that a black hole releases, a black hole the size of a coin could power all of Earth's electrical needs for a year.",
    category: "Black Holes"
  },
  {
    title: "Diamond Planet",
    fact: "There's a planet called 55 Cancri e that is believed to be made largely of diamond. The planet's surface is estimated to be worth $26.9 nonillion.",
    category: "Exoplanets"
  },
  {
    title: "Space Smell",
    fact: "Astronauts report that space has a distinct smell: a mix of hot metal, seared steak, raspberries, and rum. This odor clings to their suits after spacewalks.",
    category: "Space Exploration"
  }
];

export default function SpaceFactGenerator() {
  // Add a client-side check to prevent SSR issues
  const [isClient, setIsClient] = useState(false);
  const [currentFact, setCurrentFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateFadeIn, setAnimateFadeIn] = useState(false);
  const [factSource, setFactSource] = useState('');
  const [nasaData, setNasaData] = useState([]);

  // Check for client-side rendering first
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch APOD data - only run on the client
  const fetchAPOD = useCallback(async () => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    setAnimateFadeIn(false);
    
    try {
      // Get a random date within the last 5 years for APOD
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setFullYear(today.getFullYear() - 5);
      
      const randomTime = pastDate.getTime() + Math.random() * (today.getTime() - pastDate.getTime());
      const randomDate = new Date(randomTime);
      
      const formattedDate = randomDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const response = await fetch(`${APOD_API}&date=${formattedDate}`);
      
      if (!response.ok) {
        throw new Error(`NASA API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      // Skip videos, only use images
      if (data.media_type === 'video') {
        // Try again if we get a video
        fetchAPOD();
        return;
      }
      
      // Use the APOD explanation as the fact
      const factText = data.explanation.split('. ').slice(0, 3).join('. ') + '.'; // First 3 sentences
      
      setCurrentFact({
        title: data.title,
        fact: factText,
        image: data.url,
        date: data.date,
        category: 'Astronomy',
        copyright: data.copyright || 'NASA'
      });
      
      setFactSource('apod');
      setLoading(false);
      setAnimateFadeIn(true);
    } catch (err) {
      console.error('Error fetching APOD data:', err);
      setError('Failed to fetch data from NASA API. Trying backup source...');
      // Fall back to search API
      fetchNASALibrary();
    }
  }, [isClient]); // Add dependencies here

  // Fetch from NASA Image Library and get associated details
  const fetchNASALibrary = async () => {
    if (!isClient) return;
    
    setLoading(true);
    setError(null);
    setAnimateFadeIn(false);
    
    try {
      // Get random category
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const randomPage = Math.floor(Math.random() * 10) + 1; // Get a random page of results
      
      const response = await fetch(
        `${NASA_LIBRARY_API}/search?q=${randomCategory}&media_type=image&page=${randomPage}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA Library API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.collection.items || data.collection.items.length === 0) {
        throw new Error('No images found');
      }
      
      // Get a random item from the results
      const randomIndex = Math.floor(Math.random() * data.collection.items.length);
      const item = data.collection.items[randomIndex];
      
      if (!item.links || !item.data || !item.data[0]) {
        throw new Error('Invalid image data structure');
      }
      
      // Use the item description as the fact
      let factTitle = item.data[0].title || randomCategory;
      let factText = '';
      
      if (item.data[0].description && item.data[0].description.length > 10) {
        // Use the description from the NASA Library API
        factText = item.data[0].description.split('. ').slice(0, 3).join('. ') + '.';
      } else {
        // If no good description, fetch a related fact from another NASA API
        try {
          const epicResponse = await fetch(NASA_EPIC_API);
          if (epicResponse.ok) {
            const epicData = await epicResponse.json();
            if (epicData && epicData.length > 0) {
              const randomEpicIndex = Math.floor(Math.random() * epicData.length);
              factText = `The Earth Polychromatic Imaging Camera (EPIC) captured this image of Earth on ${epicData[randomEpicIndex].date}. EPIC provides full disc imagery of the Earth and captures unique perspectives of certain astronomical events.`;
            }
          }
        } catch (epicErr) {
          console.error('Error fetching EPIC data:', epicErr);
          // Use a fallback fact if both API calls fail
          const randomFallback = FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
          factTitle = randomFallback.title;
          factText = randomFallback.fact;
        }
      }
      
      setCurrentFact({
        title: factTitle,
        fact: factText,
        image: item.links[0].href,
        date: item.data[0].date_created?.split('T')[0] || 'Unknown date',
        category: randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1),
        nasa_id: item.data[0].nasa_id
      });
      
      setFactSource('search');
      setLoading(false);
      setAnimateFadeIn(true);
    } catch (err) {
      console.error('Error fetching NASA Library data:', err);
      setError('Failed to fetch NASA images. Displaying a stored fact instead.');
      displayFallbackFact();
    }
  };

  // Display a fallback fact if everything else fails
  const displayFallbackFact = () => {
    if (!isClient) return;
    
    const randomFact = FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
    
    setCurrentFact({
      title: randomFact.title,
      fact: randomFact.fact,
      // Use a default NASA image as fallback
      image: 'https://images.nasa.gov/images/as17-148-22727~medium.jpg', 
      category: randomFact.category,
      fallback: true
    });
    
    setLoading(false);
    setAnimateFadeIn(true);
    setFactSource('fallback');
  };

  // Get a new random space fact/image
  const getRandomFact = () => {
    // Randomly choose between APOD and search
    if (Math.random() > 0.3) {
      fetchAPOD();
    } else {
      fetchNASALibrary();
    }
  };
  
  // Initialize with a random fact only after confirming we're on the client
  useEffect(() => {
    if (isClient) {
      fetchAPOD();
    }
  }, [isClient, fetchAPOD]); // Include both dependencies
  
  // For the stars background, use a fixed number of stars with predictable positions
  const renderStars = () => {
    if (!isClient) return null;
    
    const stars = [];
    
    // Use fixed positions that will be the same on server and client
    const positions = [
      { top: '10%', left: '20%', size: '2px', delay: '3s' },
      { top: '25%', left: '15%', size: '3px', delay: '4s' },
      { top: '30%', left: '70%', size: '1px', delay: '2s' },
      { top: '45%', left: '30%', size: '2px', delay: '5s' },
      { top: '60%', left: '80%', size: '1px', delay: '3s' },
      { top: '70%', left: '10%', size: '3px', delay: '4s' },
      { top: '80%', left: '60%', size: '2px', delay: '2s' },
      { top: '90%', left: '40%', size: '1px', delay: '5s' },
      { top: '15%', left: '90%', size: '2px', delay: '3s' },
      { top: '50%', left: '50%', size: '3px', delay: '4s' },
    ];
    
    positions.forEach((pos, i) => {
      stars.push(
        <Box
          key={`star-${i}`}
          sx={{
            position: 'absolute',
            width: pos.size,
            height: pos.size,
            backgroundColor: '#fff',
            borderRadius: '50%',
            top: pos.top,
            left: pos.left,
            animation: `${twinkle} ${pos.delay} infinite`,
          }}
        />
      );
    });
    
    return stars;
  };

  // Show loading state during SSR or initial client load
  if (!isClient) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Typography variant="body1" sx={{ color: '#9575CD' }}>
          Loading cosmic facts...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      {/* Star background with fixed positions */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {renderStars()}
      </Box>

      {/* Content section */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 0 },
      }}>
        {error && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2, 
              bgcolor: 'rgba(25, 25, 35, 0.9)', 
              color: '#FFD700',
              '.MuiAlert-icon': {
                color: '#FFD700'
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        {loading ? (
          <CircularProgress sx={{ color: '#9575CD', my: 10 }} />
        ) : currentFact ? (
          <Card 
            sx={{ 
              maxWidth: 600, 
              width: '100%', 
              bgcolor: 'rgba(25, 25, 35, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(149, 117, 205, 0.3)',
              boxShadow: '0 0 20px rgba(149, 117, 205, 0.5)',
              borderRadius: 2,
              overflow: 'hidden',
              animation: animateFadeIn ? `${fadeIn} 0.6s ease` : 'none',
            }}
          >
            {currentFact.image && (
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={currentFact.image}
                  alt={currentFact.title || "Space image"}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                {currentFact.date && (
                  <Chip
                    icon={<DateRangeIcon sx={{ color: '#fff !important' }} />}
                    label={currentFact.date}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'rgba(25, 25, 35, 0.7)',
                      color: '#fff',
                      borderColor: 'rgba(149, 117, 205, 0.5)',
                      '& .MuiChip-icon': {
                        color: '#fff'
                      }
                    }}
                    variant="outlined"
                  />
                )}
              </Box>
            )}
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#9575CD',
                  mb: 1,
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                }}
              >
                {currentFact.title}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#fff', 
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                {currentFact.fact}
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 3 }}>
                <Chip 
                  icon={<CategoryIcon sx={{ color: '#fff !important' }} />}
                  label={currentFact.category}
                  sx={{
                    bgcolor: 'rgba(35, 35, 45, 0.8)',
                    color: '#fff',
                    borderColor: 'rgba(149, 117, 205, 0.5)',
                  }}
                  variant="outlined"
                />
                
                <Chip 
                  icon={<RocketLaunchIcon sx={{ color: '#fff !important' }} />}
                  label={
                    factSource === 'apod' 
                      ? 'Astronomy Picture of the Day' 
                      : factSource === 'search'
                        ? 'NASA Image Library'
                        : 'Space Facts Archive'
                  }
                  sx={{
                    bgcolor: 'rgba(35, 35, 45, 0.8)',
                    color: '#fff',
                    borderColor: 'rgba(149, 117, 205, 0.5)',
                  }}
                  variant="outlined"
                />
              </Stack>
              
              <Button
                variant="contained"
                startIcon={<AutorenewIcon />}
                onClick={getRandomFact}
                sx={{
                  bgcolor: 'rgba(149, 117, 205, 0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(149, 117, 205, 1)',
                  }
                }}
              >
                Next Cosmic Fact
              </Button>
            </CardContent>
          </Card>
        ) : (
          <CircularProgress sx={{ color: '#9575CD', my: 10 }} />
        )}

        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255,255,255,0.6)',
            mt: 2, 
            textAlign: 'center',
            maxWidth: '600px'
          }}
        >
          Data sourced from NASA Open APIs. Images and facts courtesy of NASA&apos;s Astronomy Picture of the Day and NASA Image Library.
        </Typography>
      </Box>
    </Box>
  );
}