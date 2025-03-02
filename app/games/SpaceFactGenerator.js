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
import ShuffleIcon from '@mui/icons-material/Shuffle';
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
        image: "https://images.unsplash.com/photo-1560996050-9a5de56605c3?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "One million Earths could fit inside the Sun.",
        category: "Sun",
        image: "https://images.unsplash.com/photo-1532768778661-1b323a16e0cf?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "The hottest planet in our solar system is Venus, not Mercury.",
        category: "Planets",
        image: "https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg"
    },
    {
        fact: "A year on Mercury is just 88 Earth days long.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/600px-Mercury_in_color_-_Prockter07-edit1.jpg"
    },
    {
        fact: "The largest volcano in our solar system, Olympus Mons, is on Mars. It's about the size of Arizona.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mars_Express_-_Olympus_Mons.jpg/600px-Mars_Express_-_Olympus_Mons.jpg"
    },
    {
        fact: "We always see the same side of the Moon from Earth because it rotates at the same rate it orbits Earth.",
        category: "Moon",
        image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "The Moon is moving away from Earth at a rate of about 3.8 centimeters per year.",
        category: "Moon",
        image: "https://images.pexels.com/photos/47367/full-moon-moon-bright-sky-47367.jpeg"
    },
    {
        fact: "Jupiter has 79 confirmed moons, the most of any planet in our solar system.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Jupiter_New_Horizons.jpg/600px-Jupiter_New_Horizons.jpg"
    },
    {
        fact: "The largest storm in our solar system is Jupiter's Great Red Spot, which has been raging for over 400 years.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Jupiter_Great_Red_Spot_with_moons_Io_and_Ganymede_-_2019-06-12_6969.jpg/600px-Jupiter_Great_Red_Spot_with_moons_Io_and_Ganymede_-_2019-06-12_6969.jpg"
    },
    {
        fact: "Saturn's rings are made mostly of ice and rock, ranging in size from tiny grains to boulders as big as houses.",
        category: "Planets",
        image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "It takes sunlight about 8 minutes and 20 seconds to reach Earth.",
        category: "Space",
        image: "https://images.pexels.com/photos/87611/sun-fireball-solar-flare-sunlight-87611.jpeg"
    },
    {
        fact: "The Milky Way galaxy is approximately 100,000 light-years across.",
        category: "Galaxies",
        image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "There are more stars in the universe than grains of sand on all of Earth's beaches combined.",
        category: "Stars",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "A neutron star can spin at a rate of 600 rotations per second.",
        category: "Stars",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Artist%27s_concept_of_a_neutron_star.jpg/600px-Artist%27s_concept_of_a_neutron_star.jpg"
    },
    {
        fact: "Black holes can have the mass of over 20 billion suns. These are called supermassive black holes.",
        category: "Black Holes",
        image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "The first photograph of a black hole was published in April 2019. It was captured by the Event Horizon Telescope.",
        category: "Black Holes",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/600px-Black_hole_-_Messier_87_crop_max_res.jpg"
    },
    {
        fact: "The closest galaxy to the Milky Way is the Andromeda Galaxy, which is 2.5 million light-years away.",
        category: "Galaxies",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Andromeda_galaxy_Ssc2005-20a1.jpg/600px-Andromeda_galaxy_Ssc2005-20a1.jpg"
    },
    {
        fact: "The Hubble Space Telescope orbits Earth at a speed of 17,000 mph (27,300 km/h).",
        category: "Space Exploration",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/600px-HST-SM4.jpeg"
    },
    {
        fact: "The International Space Station is the largest human-made structure in space and can be seen from Earth with the naked eye.",
        category: "Space Exploration",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "There is a planet named HD 189733b where it rains glass sideways in winds of 5,400 mph (8,700 km/h).",
        category: "Exoplanets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Exoplanet_HD_189733_b.jpg/600px-Exoplanet_HD_189733_b.jpg"
    },
    {
        fact: "The Voyager 1 spacecraft is the most distant human-made object, currently over 14 billion miles (22.5 billion km) from Earth.",
        category: "Space Exploration",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Voyager.jpg/600px-Voyager.jpg"
    },
    {
        fact: "The largest known star, UY Scuti, is more than 1,700 times the radius of the Sun.",
        category: "Stars",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/UY_Scuti_size_comparison_to_the_sun.png/600px-UY_Scuti_size_comparison_to_the_sun.png"
    },
    {
        fact: "A day on Venus is longer than a year on Venus. It takes Venus 243 Earth days to rotate once on its axis and 225 Earth days to orbit the Sun.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg"
    },
    {
        fact: "The astronauts' footprints on the Moon will likely remain there for at least 100 million years since there's no wind or water to erode them.",
        category: "Moon",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Apollo_11_bootprint.jpg/600px-Apollo_11_bootprint.jpg"
    },
    {
        fact: "If two pieces of the same type of metal touch in space, they will permanently bond together. This is called cold welding.",
        category: "Space",
        image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "Scientists have discovered a planet made of diamonds, called 55 Cancri e.",
        category: "Exoplanets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/55_Cancri_e_-_artist_impression.jpg/600px-55_Cancri_e_-_artist_impression.jpg"
    },
    {
        fact: "The Boötes void is an enormous empty region of space that spans nearly 330 million light-years and contains very few galaxies.",
        category: "Space",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        fact: "There's a giant cloud of alcohol in Sagittarius B. It contains enough ethyl alcohol to fill 400 trillion trillion pints of beer.",
        category: "Space",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Milky_Way_IR_Spitzer.jpg/600px-Milky_Way_IR_Spitzer.jpg"
    },
    {
        fact: "The Olympus Mons on Mars is the tallest mountain in our solar system, standing at 22 km (13.6 miles) high.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Olympus_Mons_alt.jpg/600px-Olympus_Mons_alt.jpg"
    },
    {
        fact: "The core of Jupiter is so hot that it liquefies diamonds.",
        category: "Planets",
        image: "https://images.unsplash.com/photo-1630839437035-dac17da580d0?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        title: "Black Hole Power",
        fact: "If you could harness the energy that a black hole releases, a black hole the size of a coin could power all of Earth's electrical needs for a year.",
        category: "Black Holes",
        image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        title: "Diamond Planet",
        fact: "There's a planet called 55 Cancri e that is believed to be made largely of diamond. The planet's surface is estimated to be worth $26.9 nonillion (that's 30 zeros!)",
        category: "Exoplanets",
        image: "https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg"
    },
    {
        title: "Space Smell",
        fact: "Astronauts report that space has a distinct smell: a mix of hot metal, seared steak, raspberries, and rum. This odor clings to their suits after spacewalks.",
        category: "Space Exploration",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        title: "Venus Day",
        fact: "A day on Venus (243 Earth days) is longer than a year on Venus (225 Earth days). It also rotates backwards compared to most planets.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Venus_globe.jpg/600px-Venus_globe.jpg"
    },
    {
        title: "Cosmic Symphony",
        fact: "Galaxies make sound! NASA has converted the electromagnetic waves from celestial objects into audible frequencies, creating what astronomers call 'cosmic symphonies'.",
        category: "Galaxies",
        image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        title: "Neutron Star Density",
        fact: "A teaspoon of neutron star material would weigh about 4 billion tons—roughly the weight of all humans combined or a mountain on Earth.",
        category: "Stars",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Neutron_star_illustrated.jpg/600px-Neutron_star_illustrated.jpg"
    },
    {
        title: "Earth's Cosmic Address",
        fact: "Our complete cosmic address is: Earth, Solar System, Orion Arm, Milky Way Galaxy, Local Group, Virgo Supercluster, Laniakea Supercluster, Universe.",
        category: "Cosmology",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        title: "Cosmic Echoes",
        fact: "The Cosmic Microwave Background Radiation is the afterglow of the Big Bang, and it's visible as static on about 1% of untuned analog TV sets.",
        category: "Cosmology",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Ilc_9yr_moll4096.png/600px-Ilc_9yr_moll4096.png"
    },
    {
        title: "Jupiter's Storms",
        fact: "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years. It's so large that three Earths could fit inside it.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg"
    },
    {
        title: "Speed of Light Limit",
        fact: "If you could travel at the speed of light, it would still take you 100,000 years to cross our Milky Way galaxy from one end to the other.",
        category: "Physics",
        image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        title: "Space is Silent",
        fact: "There is no sound in space because sound waves need a medium to travel through, and space is a vacuum. The explosions we see in sci-fi movies would be completely silent.",
        category: "Physics",
        image: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-4.0.3&auto=format&fit=crop"
    },
    {
        title: "Martian Sunsets",
        fact: "Sunsets on Mars appear blue due to the way fine dust particles in the thin Martian atmosphere scatter light. On Earth, our thicker atmosphere scatters blue light, giving us red sunsets.",
        category: "Planets",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Mars_sunset_PIA00920.jpg/600px-Mars_sunset_PIA00920.jpg"
    },
    {
        title: "Stellar Nursery",
        fact: "The Pillars of Creation in the Eagle Nebula are stellar nurseries where new stars are born. These towering columns of gas and dust are several light-years tall.",
        category: "Nebulae",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/The_Pillars_of_Creation.jpg/600px-The_Pillars_of_Creation.jpg"
    },
    {
        title: "Moon Dust Danger",
        fact: "Lunar dust is extremely abrasive and clingy due to its jagged shape and electrostatic charge. It posed serious health concerns for Apollo astronauts who described it smelling like spent gunpowder.",
        category: "Moon",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Lunar_Soil_Sample.jpg/600px-Lunar_Soil_Sample.jpg"
    },
    {
        title: "Galactic Collision",
        fact: "Our Milky Way galaxy is on a collision course with the Andromeda galaxy. They will begin to merge in about 4.5 billion years, forming a new galaxy sometimes called 'Milkomeda'.",
        category: "Galaxies",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Andromeda_and_Milky_Way_collision.jpg/600px-Andromeda_and_Milky_Way_collision.jpg"
    }
];

export default function SpaceFactGenerator() {
  const [currentFact, setCurrentFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Get a random fact
  const getRandomFact = () => {
    setLoading(true);
    setFadeIn(false);
    
    setTimeout(() => {
      let newFact;
      do {
        newFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
      } while (currentFact && newFact.fact === currentFact.fact);
      
      setCurrentFact(newFact);
      setLoading(false);
      setFadeIn(true);
    }, 600);
  };
  
  // Initialize with a random fact - only on client side
  useEffect(() => {
    // Only set initial fact on client side
    if (!hasInitialized) {
      const initialFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
      setCurrentFact(initialFact);
      setHasInitialized(true);
    }
  }, [hasInitialized]);
  
  // For the stars background, use a fixed number of stars with predictable positions
  const renderStars = () => {
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
      // Add more with fixed positions as needed
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
        {hasInitialized ? (
          <>
            {loading ? (
              <CircularProgress sx={{ color: '#9575CD', my: 10 }} />
            ) : (
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
                  animation: fadeIn ? `${fadeIn} 0.6s ease` : 'none',
                }}
              >
                {currentFact?.image && (
                  <CardMedia
                    component="img"
                    height="240"
                    image={currentFact.image}
                    alt="Space image"
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  {currentFact?.title && (
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
                    {currentFact?.fact}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.6)',
                      display: 'block',
                      mb: 2
                    }}
                  >
                    Category: {currentFact?.category}
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
                    Next Fact
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <CircularProgress sx={{ color: '#9575CD', my: 10 }} />
        )}
      </Box>
    </Box>
  );
}