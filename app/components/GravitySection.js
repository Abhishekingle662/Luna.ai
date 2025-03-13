'use client'

import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { keyframes } from '@mui/system';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { InlineMath, BlockMath } from 'react-katex';
import GravityVisualization from './GravityVisualization';
import OrbitalAnimation from './OrbitalAnimation';

// Define animations
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

export default function GravitySection() {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, color: '#9575CD', fontWeight: 'bold' }}>
        Gravity and Orbits
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        Explore the fascinating world of gravity and orbits. Learn about Newton&apos;s Law of Universal Gravitation, Kepler&apos;s Laws, and more through interactive visualizations.
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 4,
          '& .MuiTabs-indicator': {
            backgroundColor: '#9575CD',
          },
          '& .MuiTab-root': {
            color: '#E0E0E0',
            '&.Mui-selected': {
              color: '#9575CD',
            }
          }
        }}
      >
        <Tab label="Newton&apos;s Law" />
        <Tab label="Kepler&apos;s Laws" />
        <Tab label="Einstein&apos;s Theory" />
      </Tabs>
      
      {activeTab === 0 && (
        <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Newton&apos;s Law of Universal Gravitation states that every particle attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them.
          </Typography>
          
          <BlockMath math={"F = G \\frac{m_1 m_2}{r^2}"} />
          
          <Box component="ul" sx={{ pl: 2, my: 3 }}>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>F</strong> is the gravitational force between masses
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>G</strong> is the gravitational constant (<InlineMath math={"6.674 \\times 10^{-11} m^3 kg^{-1} s^{-2}"} />)
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>m₁ and m₂</strong> are the masses of the objects
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>r</strong> is the distance between the centers of the masses
              </Typography>
            </Box>
          </Box>
          
          <GravityVisualization />
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Kepler&apos;s Three Laws describe the motion of planets around the Sun:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, my: 3 }}>
            <Box component="li" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#9575CD' }}>
                First Law: The Law of Ellipses
              </Typography>
              <Typography variant="body1">
                Planets move in elliptical orbits with the Sun at one focus.
              </Typography>
            </Box>
            
            <Box component="li" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#9575CD' }}>
                Second Law: The Law of Equal Areas
              </Typography>
              <Typography variant="body1">
                A line connecting a planet to the Sun sweeps out equal areas in equal time intervals.
              </Typography>
            </Box>
            
            <Box component="li" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#9575CD' }}>
                Third Law: The Law of Harmonies
              </Typography>
              <Typography variant="body1">
                The square of a planet&apos;s orbital period is proportional to the cube of its semi-major axis:
              </Typography>
              <Box sx={{ my: 2 }}>
                <BlockMath math={"\\frac{T^2}{a^3} = \\frac{4\\pi^2}{G(M + m)}"} />
              </Box>
              <Typography variant="body1">
                Where T is the orbital period, a is the semi-major axis, G is the gravitational constant, M is the mass of the Sun, and m is the mass of the planet.
              </Typography>
            </Box>
          </Box>
          
          <OrbitalAnimation />
        </Box>
      )}
      
      {activeTab === 2 && (
        <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Einstein&apos;s Theory of General Relativity revolutionized our understanding of gravity, showing that it&apos;s not a force but a curvature of spacetime caused by mass and energy.
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, color: '#9575CD' }}>
            Einstein&apos;s Field Equation
          </Typography>
          
          <BlockMath math={"G_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}"} />
          
          <Box sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              This compact equation describes how matter and energy (represented by the stress-energy tensor T) curves spacetime (represented by the Einstein tensor G).
            </Typography>
            
            <Typography variant="body1" sx={{ mt: 3 }}>
              Key differences from Newtonian gravity:
            </Typography>
            
            <Box component="ul" sx={{ pl: 2, my: 2 }}>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Gravity is not a force, but a curvature of spacetime
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Light is affected by gravity because it follows the curvature of spacetime
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Time runs slower in stronger gravitational fields (gravitational time dilation)
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Explains phenomena like Mercury&apos;s orbit, gravitational lensing, and gravitational waves
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Placeholder for Einstein visualizations */}
          <Box sx={{ 
            height: 300, 
            backgroundColor: 'rgba(25, 25, 35, 0.7)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed rgba(149, 117, 205, 0.5)'
          }}>
            <Typography variant="body1" sx={{ color: '#aaa' }}>
              Spacetime curvature visualization coming soon...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
