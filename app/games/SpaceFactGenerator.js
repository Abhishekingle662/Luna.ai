'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CardMedia,
  CircularProgress
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
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

// Comprehensive collection of space facts
const spaceFacts = [
  {
    fact: "The Sun makes up 99.86% of the mass in the solar system.",
    category: "Sun",
    image: "https://images.unsplash.com/photo-1532760270572-c2c147bc9ce1?q=80&w=500&auto=format"
  },
  {
    fact: "One million Earths could fit inside the Sun.",
    category: "Sun",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=500&auto=format"
  },
  {
    fact: "The hottest planet in our solar system is Venus, not Mercury.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1612686635542-2bd9b6d5e21e?q=80&w=500&auto=format"
  },
  {
    fact: "A year on Mercury is just 88 Earth days long.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=500&auto=format"
  },
  {
    fact: "The largest volcano in our solar system, Olympus Mons, is on Mars. It's about the size of Arizona.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614728894747-a83421789f10?q=80&w=500&auto=format"
  },
  {
    fact: "We always see the same side of the Moon from Earth because it rotates at the same rate it orbits Earth.",
    category: "Moon",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=500&auto=format"
  },
  {
    fact: "The Moon is moving away from Earth at a rate of about 3.8 centimeters per year.",
    category: "Moon",
    image: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=500&auto=format"
  },
  {
    fact: "Jupiter has 79 confirmed moons, the most of any planet in our solar system.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=500&auto=format"
  },
  {
    fact: "The largest storm in our solar system is Jupiter's Great Red Spot, which has been raging for over 400 years.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=500&auto=format"
  },
  {
    fact: "Saturn's rings are made mostly of ice and rock, ranging in size from tiny grains to boulders as big as houses.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc0?q=80&w=500&auto=format"
  },
  {
    fact: "It takes sunlight about 8 minutes and 20 seconds to reach Earth.",
    category: "Space",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500&auto=format"
  },
  {
    fact: "The Milky Way galaxy is approximately 100,000 light-years across.",
    category: "Galaxies",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500&auto=format"
  },
  {
    fact: "There are more stars in the universe than grains of sand on all of Earth's beaches combined.",
    category: "Stars",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format"
  },
  {
    fact: "A neutron star can spin at a rate of 600 rotations per second.",
    category: "Stars",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=500&auto=format"
  },
  {
    fact: "Black holes can have the mass of over 20 billion suns. These are called supermassive black holes.",
    category: "Black Holes",
    image: "https://images.unsplash.com/photo-1544656376-ffe19d4b7353?q=80&w=500&auto=format"
  },
  {
    fact: "The first photograph of a black hole was published in April 2019. It was captured by the Event Horizon Telescope.",
    category: "Black Holes",
    image: "https://images.unsplash.com/photo-1560507074-b9eb544a9464?q=80&w=500&auto=format"
  },
  {
    fact: "The closest galaxy to the Milky Way is the Andromeda Galaxy, which is 2.5 million light-years away.",
    category: "Galaxies",
    image: "https://images.unsplash.com/photo-1518589794402-47d0ecccc35e?q=80&w=500&auto=format"
  },
  {
    fact: "The Hubble Space Telescope orbits Earth at a speed of 17,000 mph (27,300 km/h).",
    category: "Space Exploration",
    image: "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?q=80&w=500&auto=format"
  },
  {
    fact: "The International Space Station is the largest human-made structure in space and can be seen from Earth with the naked eye.",
    category: "Space Exploration",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format"
  },
  {
    fact: "There is a planet named HD 189733b where it rains glass sideways in winds of 5,400 mph (8,700 km/h).",
    category: "Exoplanets",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=500&auto=format"
  },
  {
    fact: "The Voyager 1 spacecraft is the most distant human-made object, currently over 14 billion miles (22.5 billion km) from Earth.",
    category: "Space Exploration",
    image: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=500&auto=format"
  },
  {
    fact: "The largest known star, UY Scuti, is more than 1,700 times the radius of the Sun.",
    category: "Stars",
    image: "https://images.unsplash.com/photo-1532680678473-2c8cb4c75355?q=80&w=500&auto=format"
  },
  {
    fact: "A day on Venus is longer than a year on Venus. It takes Venus 243 Earth days to rotate once on its axis and 225 Earth days to orbit the Sun.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=500&auto=format"
  },
  {
    fact: "The astronauts' footprints on the Moon will likely remain there for at least 100 million years since there's no wind or water to erode them.",
    category: "Moon",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=500&auto=format"
  },
  {
    fact: "If two pieces of the same type of metal touch in space, they will permanently bond together. This is called cold welding.",
    category: "Space",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format"
  },
  {
    fact: "Scientists have discovered a planet made of diamonds, called 55 Cancri e.",
    category: "Exoplanets",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=500&auto=format"
  },
  {
    fact: "The Boötes void is an enormous empty region of space that spans nearly 330 million light-years and contains very few galaxies.",
    category: "Space",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500&auto=format"
  },
  {
    fact: "There's a giant cloud of alcohol in Sagittarius B. It contains enough ethyl alcohol to fill 400 trillion trillion pints of beer.",
    category: "Space",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format"
  },
  {
    fact: "The Olympus Mons on Mars is the tallest mountain in our solar system, standing at 22 km (13.6 miles) high.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614728894747-a83421789f10?q=80&w=500&auto=format"
  },
  {
    fact: "The core of Jupiter is so hot that it liquefies diamonds.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=500&auto=format"
  },
  {
    title: "Black Hole Power",
    fact: "If you could harness the energy that a black hole releases, a black hole the size of a coin could power all of Earth's electrical needs for a year.",
    category: "Black Holes",
    image: "https://images.unsplash.com/photo-1534420118249-a24190185504?q=80&w=500&auto=format"
  },
  {
    title: "Diamond Planet",
    fact: "There's a planet called 55 Cancri e that is believed to be made largely of diamond. The planet's surface is estimated to be worth $26.9 nonillion (that's 30 zeros!)",
    category: "Exoplanets",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500&auto=format"
  },
  {
    title: "Space Smell",
    fact: "Astronauts report that space has a distinct smell: a mix of hot metal, seared steak, raspberries, and rum. This odor clings to their suits after spacewalks.",
    category: "Space Exploration",
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=500&auto=format"
  },
  {
    title: "Venus Day",
    fact: "A day on Venus (243 Earth days) is longer than a year on Venus (225 Earth days). It also rotates backwards compared to most planets.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=500&auto=format"
  },
  {
    title: "Cosmic Symphony",
    fact: "Galaxies make sound! NASA has converted the electromagnetic waves from celestial objects into audible frequencies, creating what astronomers call 'cosmic symphonies'.",
    category: "Galaxies",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500&auto=format"
  },
  {
    title: "Neutron Star Density",
    fact: "A teaspoon of neutron star material would weigh about 4 billion tons—roughly the weight of all humans combined or a mountain on Earth.",
    category: "Stars",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500&auto=format"
  },
  {
    title: "Earth's Cosmic Address",
    fact: "Our complete cosmic address is: Earth, Solar System, Orion Arm, Milky Way Galaxy, Local Group, Virgo Supercluster, Laniakea Supercluster, Universe.",
    category: "Cosmology",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=500&auto=format"
  },
  {
    title: "Cosmic Echoes",
    fact: "The Cosmic Microwave Background Radiation is the afterglow of the Big Bang, and it's visible as static on about 1% of untuned analog TV sets.",
    category: "Cosmology",
    image: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?q=80&w=500&auto=format"
  },
  {
    title: "Jupiter's Storms",
    fact: "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years. It's so large that three Earths could fit inside it.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=500&auto=format"
  },
  {
    title: "Speed of Light Limit",
    fact: "If you could travel at the speed of light, it would still take you 100,000 years to cross our Milky Way galaxy from one end to the other.",
    category: "Physics",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format"
  },
  {
    title: "Space is Silent",
    fact: "There is no sound in space because sound waves need a medium to travel through, and space is a vacuum. The explosions we see in sci-fi movies would be completely silent.",
    category: "Physics",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=500&auto=format"
  },
  {
    title: "Martian Sunsets",
    fact: "Sunsets on Mars appear blue due to the way fine dust particles in the thin Martian atmosphere scatter light. On Earth, our thicker atmosphere scatters blue light, giving us red sunsets.",
    category: "Planets",
    image: "https://images.unsplash.com/photo-1614728894747-a83421789f10?q=80&w=500&auto=format"
  },
  {
    title: "Stellar Nursery",
    fact: "The Pillars of Creation in the Eagle Nebula are stellar nurseries where new stars are born. These towering columns of gas and dust are several light-years tall.",
    category: "Nebulae",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500&auto=format"
  },
  {
    title: "Moon Dust Danger",
    fact: "Lunar dust is extremely abrasive and clingy due to its jagged shape and electrostatic charge. It posed serious health concerns for Apollo astronauts who described it smelling like spent gunpowder.",
    category: "Moon",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=500&auto=format"
  },
  {
    title: "Galactic Collision",
    fact: "Our Milky Way galaxy is on a collision course with the Andromeda galaxy. They will begin to merge in about 4.5 billion years, forming a new galaxy sometimes called 'Milkomeda'.",
    category: "Galaxies",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500&auto=format"
  }
];

export default function SpaceFactGenerator() {
  const [currentFact, setCurrentFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Make sure we're on client-side
  useEffect(() => {
    setMounted(true);
    // Initialize with a random fact
    const initialFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    setCurrentFact(initialFact);
  }, []);
  
  // Get a random fact
  const getRandomFact = () => {
    setLoading(true);
    setIsAnimating(false);
    
    setTimeout(() => {
      let newFact;
      do {
        newFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
      } while (currentFact && newFact.fact === currentFact.fact);
      
      setCurrentFact(newFact);
      setLoading(false);
      setIsAnimating(true);
    }, 600);
  };

  // If not mounted yet (server-side), return a loader
  if (!mounted) {
    return <CircularProgress sx={{ color: '#9575CD', my: 10 }} />;
  }
  
  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      {/* Star background */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {/* Render a fixed number of stars with deterministic positions */}
        {[...Array(10)].map((_, i) => (
          <Box
            key={`star-${i}`}
            sx={{
              position: 'absolute',
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              backgroundColor: '#fff',
              borderRadius: '50%',
              top: `${(i * 10) % 100}%`,
              left: `${((i * 7) + 5) % 100}%`,
              animation: `${twinkle} ${(i % 5) + 2}s infinite`,
            }}
          />
        ))}
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
              animation: isAnimating ? `${fadeIn} 0.6s ease` : 'none',
            }}
          >
            {currentFact.image && (
              <CardMedia
                component="img"
                height="240"
                image={currentFact.image}
                alt={currentFact.title || "Space image"}
              />
            )}
            <CardContent sx={{ p: 3 }}>
              {currentFact.title && (
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
              )}
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#fff', 
                  mb: 2 
                }}
              >
                {currentFact.fact}
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  display: 'block',
                  mb: 2
                }}
              >
                Category: {currentFact.category}
              </Typography>
              
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
      </Box>
    </Box>
  );
}