'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Card,
  CardMedia,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import { keyframes } from '@mui/system';

// Animation for bouncing effect
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(var(--bounce-height, -100px));
  }
`;

// Planet data with gravity values (m/s²)
const planetData = [
  {
    name: 'Mercury',
    gravity: 3.7,
    color: '#A9A9A9',
    image: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc0?q=80&w=150&auto=format',
    description: 'The smallest and innermost planet in the Solar System.'
  },
  {
    name: 'Venus',
    gravity: 8.87,
    color: '#E6C229',
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=150&auto=format',
    description: 'Venus has a thick atmosphere causing a runaway greenhouse effect.'
  },
  {
    name: 'Earth',
    gravity: 9.81,
    color: '#1E90FF',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=150&auto=format',
    description: 'Our home planet with moderate gravity and suitable conditions for life.'
  },
  {
    name: 'Moon',
    gravity: 1.62,
    color: '#D3D3D3',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=150&auto=format',
    description: 'Earth\'s only natural satellite with about 1/6 of Earth\'s gravity.'
  },
  {
    name: 'Mars',
    gravity: 3.71,
    color: '#FF4500',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421789f10?q=80&w=150&auto=format',
    description: 'The Red Planet has about 38% of Earth\'s surface gravity.'
  },
  {
    name: 'Jupiter',
    gravity: 24.79,
    color: '#DEB887',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=150&auto=format',
    description: 'The largest planet in our solar system with 2.5 times Earth\'s gravity.'
  },
  {
    name: 'Saturn',
    gravity: 10.44,
    color: '#FFD700',
    image: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc0?q=80&w=150&auto=format',
    description: 'Known for its rings, Saturn has slightly stronger gravity than Earth.'
  },
  {
    name: 'Uranus',
    gravity: 8.69,
    color: '#00CED1',
    image: 'https://images.unsplash.com/photo-1614314107768-6018061c5bc1?q=80&w=150&auto=format',
    description: 'The third-largest planet with gravity slightly less than Earth\'s.'
  },
  {
    name: 'Neptune',
    gravity: 11.15,
    color: '#4169E1',
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=150&auto=format',
    description: 'The windiest planet with gravity slightly stronger than Earth\'s.'
  },
  {
    name: 'Pluto',
    gravity: 0.62,
    color: '#8B4513',
    image: 'https://images.unsplash.com/photo-1614314107769-2018061c5bc1?q=80&w=150&auto=format',
    description: 'A dwarf planet with very low gravity, about 6% of Earth\'s.'
  }
];

// Object types for simulation
const objectTypes = ['ball', 'human', 'feather', 'car'];

// Export the component with a consistent name
export default function GravitySimulator() {
  const [selectedPlanet, setSelectedPlanet] = useState('Earth');
  const [mass, setMass] = useState(70); // kg
  const [bounceHeight, setBounceHeight] = useState(100); // px
  const [objectType, setObjectType] = useState('ball');
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [useCustomGravity, setUseCustomGravity] = useState(false);
  const [customGravity, setCustomGravity] = useState(9.81);
  const [surfaceWeight, setSurfaceWeight] = useState(70 * 9.81); // N = mass * gravity
  
  // Get the selected planet data
  const planet = planetData.find(p => p.name === selectedPlanet);
  
  // Calculate gravity value based on selection
  const gravityValue = useCustomGravity ? customGravity : (planet ? planet.gravity : 9.81);
  
  // Update surface weight when relevant values change
  useEffect(() => {
    setSurfaceWeight(mass * gravityValue);
  }, [mass, gravityValue]);
  
  // Get the appropriate emoji for the selected object
  const getObjectEmoji = () => {
    switch(objectType) {
      case 'ball': return '🏀';
      case 'human': return '🧍';
      case 'feather': return '🪶';
      case 'car': return '🚗';
      default: return '🏀';
    }
  };
  
  // Normalize bounce height based on gravity (lower gravity = higher bounce)
  const getNormalizedBounceHeight = () => {
    // Base height is from slider
    const baseHeight = bounceHeight;
    
    // Earth gravity is the reference (9.81 m/s²)
    const gravityRatio = 9.81 / gravityValue;
    
    // Adjust height based on gravity (higher ratio = higher bounce)
    // We use sqrt for more natural physics feel (not linear)
    return baseHeight * Math.sqrt(gravityRatio);
  };
  
  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              bgcolor: 'rgba(25, 25, 35, 0.8)',
              p: 3,
              borderRadius: '15px',
              border: '1px solid rgba(149, 117, 205, 0.3)',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              height: '100%',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#9575CD',
                mb: 2,
                fontFamily: 'var(--font-space-grotesk), sans-serif',
              }}
            >
              Simulation Controls
            </Typography>
            
            {/* Planet selector */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth disabled={useCustomGravity}>
                <InputLabel 
                  id="planet-select-label"
                  sx={{ 
                    color: useCustomGravity ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)'
                  }}
                >
                  Select Planet
                </InputLabel>
                <Select
                  labelId="planet-select-label"
                  id="planet-select"
                  value={selectedPlanet}
                  label="Select Planet"
                  onChange={(e) => setSelectedPlanet(e.target.value)}
                  sx={{
                    color: useCustomGravity ? 'rgba(255,255,255,0.4)' : '#fff',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(149, 117, 205, 0.5)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(149, 117, 205, 0.8)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#9575CD',
                    },
                  }}
                >
                  {planetData.map((planet) => (
                    <MenuItem key={planet.name} value={planet.name}>
                      {planet.name} - {planet.gravity.toFixed(2)} m/s²
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Mass control */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                Object Mass: {mass} kg
              </Typography>
              <Slider
                value={mass}
                min={1}
                max={200}
                onChange={(_, newValue) => setMass(newValue)}
                valueLabelDisplay="auto"
                sx={{
                  color: '#9575CD',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#9575CD',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#9575CD',
                  },
                }}
              />
            </Box>
            
            {/* Object type selector */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                Object Type
              </Typography>
              <Grid container spacing={1}>
                {objectTypes.map((type) => (
                  <Grid item xs={3} key={type}>
                    <Button
                      variant={objectType === type ? 'contained' : 'outlined'}
                      onClick={() => setObjectType(type)}
                      sx={{
                        minWidth: '40px',
                        p: 1,
                        bgcolor: objectType === type ? 'rgba(149, 117, 205, 0.8)' : 'transparent',
                        borderColor: 'rgba(149, 117, 205, 0.5)',
                        '&:hover': {
                          bgcolor: objectType === type ? 'rgba(149, 117, 205, 0.9)' : 'rgba(149, 117, 205, 0.1)',
                        },
                      }}
                    >
                      {type === 'ball' && '🏀'}
                      {type === 'human' && '🧍'}
                      {type === 'feather' && '🪶'}
                      {type === 'car' && '🚗'}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {/* Bounce height control */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                Bounce Height
              </Typography>
              <Slider
                value={bounceHeight}
                min={20}
                max={300}
                onChange={(_, newValue) => setBounceHeight(newValue)}
                valueLabelDisplay="auto"
                sx={{
                  color: '#9575CD',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#9575CD',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#9575CD',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                Simulation Speed
              </Typography>
              <Slider
                value={simulationSpeed}
                min={0.5}
                max={2}
                step={0.1}
                onChange={(_, newValue) => setSimulationSpeed(newValue)}
                valueLabelDisplay="auto"
                sx={{
                  color: '#9575CD',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#9575CD',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#9575CD',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1, display: 'flex', alignItems: 'center' }}>
                Custom Gravity
                <Tooltip title="Enable to set your own gravity value">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'rgba(149, 117, 205, 0.8)' }} />
                </Tooltip>
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Button
                    variant={useCustomGravity ? "contained" : "outlined"}
                    onClick={() => setUseCustomGravity(!useCustomGravity)}
                    sx={{
                      bgcolor: useCustomGravity ? 'rgba(149, 117, 205, 0.8)' : 'transparent',
                      color: '#fff',
                      borderColor: 'rgba(149, 117, 205, 0.5)',
                      '&:hover': {
                        bgcolor: useCustomGravity ? 'rgba(149, 117, 205, 0.9)' : 'rgba(149, 117, 205, 0.1)',
                      },
                    }}
                  >
                    {useCustomGravity ? "Enabled" : "Disabled"}
                  </Button>
                </Grid>
                <Grid item xs>
                  <Slider
                    value={customGravity}
                    min={0.1}
                    max={30}
                    step={0.1}
                    onChange={(_, newValue) => setCustomGravity(newValue)}
                    valueLabelDisplay="auto"
                    disabled={!useCustomGravity}
                    sx={{
                      color: useCustomGravity ? '#9575CD' : 'rgba(149, 117, 205, 0.3)',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#9575CD',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#9575CD',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    value={customGravity}
                    type="number"
                    size="small"
                    disabled={!useCustomGravity}
                    onChange={(e) => setCustomGravity(Math.max(0.1, Math.min(30, parseFloat(e.target.value) || 0.1)))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">m/s²</InputAdornment>,
                      sx: { color: useCustomGravity ? '#fff' : 'rgba(255, 255, 255, 0.5)' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(149, 117, 205, 0.5)' },
                        '&:hover fieldset': { borderColor: 'rgba(149, 117, 205, 0.8)' },
                        '&.Mui-focused fieldset': { borderColor: '#9575CD' },
                      },
                      '& .MuiInputBase-input': { color: '#fff' },
                      width: '100%',
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            
            {/* Weight on selected planet calculation */}
            <Box sx={{ 
              bgcolor: 'rgba(25, 25, 35, 0.5)', 
              p: 2, 
              borderRadius: 2,
              border: '1px solid rgba(149, 117, 205, 0.2)',
              mt: 4 
            }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                Physics Data:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Gravity:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#9575CD', fontWeight: 'bold' }}>
                    {gravityValue.toFixed(2)} m/s²
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Weight on {useCustomGravity ? 'Custom' : planet?.name}:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#9575CD', fontWeight: 'bold' }}>
                    {surfaceWeight.toFixed(2)} N
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Bounce Time:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#9575CD', fontWeight: 'bold' }}>
                    {(Math.sqrt(2 * getNormalizedBounceHeight() / 100 / gravityValue) * 2).toFixed(2)} s
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        {/* Simulation visualization */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              bgcolor: 'rgba(25, 25, 35, 0.8)',
              p: 3,
              height: '100%',
              minHeight: '500px',
              borderRadius: '15px',
              border: '1px solid rgba(149, 117, 205, 0.3)',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#9575CD',
                mb: 2,
                fontFamily: 'var(--font-space-grotesk), sans-serif',
              }}
            >
              {useCustomGravity ? 'Custom Gravity' : planet?.name} Simulation
            </Typography>
            
            {/* Planet info */}
            {!useCustomGravity && planet && (
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Card sx={{ 
                  width: 100, 
                  mr: 2,
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                }}>
                  <CardMedia
                    component="img"
                    image={planet.image}
                    alt={planet.name}
                    sx={{ 
                      height: 100,
                      borderRadius: '50%',
                      border: `2px solid ${planet.color}`,
                    }}
                  />
                </Card>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                    {planet.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Relative gravity: {(planet.gravity / 9.81).toFixed(2)}× Earth
                  </Typography>
                </Box>
              </Box>
            )}
            
            {/* Simulation area */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(149, 117, 205, 0.2)',
              p: 2,
            }}>
              {/* Stars background for space feel */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {[...Array(50)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      width: Math.random() * 3 + 1 + 'px',
                      height: Math.random() * 3 + 1 + 'px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 100 + '%',
                      opacity: Math.random() * 0.7 + 0.3,
                    }}
                  />
                ))}
              </Box>
              
              {/* Bouncing object */}
              <Box
                sx={{
                  fontSize: objectType === 'human' ? '40px' : '60px',
                  alignSelf: 'center',
                  mb: 2,
                  animation: `${bounce} ${2 / simulationSpeed}s infinite ease-in-out`,
                  transformOrigin: 'center bottom',
                  position: 'relative',
                  '--bounce-height': `-${getNormalizedBounceHeight()}px`,
                }}
              >
                {getObjectEmoji()}
              </Box>
              
              {/* Surface */}
              <Box sx={{ 
                height: '30px', 
                bgcolor: useCustomGravity ? 'rgba(149, 117, 205, 0.3)' : planet?.color || '#1E90FF',
                opacity: 0.4,
                width: '100%',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography variant="caption" sx={{ color: '#fff' }}>
                  Surface
                </Typography>
              </Box>
            </Box>
            
            {/* Educational note */}
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 2, textAlign: 'center' }}>
              Gravity affects how objects move and behave. On planets with stronger gravity, objects fall faster and bounce less high.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}