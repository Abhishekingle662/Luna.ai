'use client'
import { Box, Fab, Stack, TextField, Typography, useMediaQuery, CssBaseline, Tooltip, Button, Container, IconButton, Paper } from '@mui/material'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SendIcon from '@mui/icons-material/Send'
import { keyframes } from '@mui/system'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeRaw from 'rehype-raw';
import Link from '@mui/material/Link'
import GamesIcon from '@mui/icons-material/Games';
import HomeIcon from '@mui/icons-material/Home'; 
import ScienceIcon from '@mui/icons-material/Science';


// Import particles background dynamically to avoid SSR issues
const ParticlesBg = dynamic(() => import('particles-bg'), { ssr: false })



// Define keyframe animations for visual effects
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

// Lunar phase animation
const lunarRotate = keyframes`
  0% {
    transform: rotate(0deg);
    box-shadow: inset -20px 0 0 5px rgba(255, 255, 255, 0.6);
  }
  50% {
    transform: rotate(180deg);
    box-shadow: inset 20px 0 0 5px rgba(255, 255, 255, 0.6);
  }
  100% {
    transform: rotate(360deg);
    box-shadow: inset -20px 0 0 5px rgba(255, 255, 255, 0.6);
  }
`

// Floating stars animation
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
`

// Add this keyframe animation with your other animations
const waveMotion = keyframes`
  0% {
    transform: translateY(0) scaleY(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-5px) scaleY(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scaleY(1);
    opacity: 0.5;
  }
`;

// Add these new keyframe animations with your other animations at the top
const borderGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(240, 246, 252, 0.3), 0 0 0 1px rgba(240, 246, 252, 0.2);
  }
  50% {
    box-shadow: 0 0 8px rgba(240, 246, 252, 0.5), 0 0 0 1px rgba(240, 246, 252, 0.3);
  }
  100% {
    box-shadow: 0 0 5px rgba(240, 246, 252, 0.3), 0 0 0 1px rgba(240, 246, 252, 0.2);
  }
`;

const subtleRotate = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Luna-specific animations for enhanced visual flow
const lunarPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
`;

const starFloat = keyframes`
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-20px) translateX(15px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
`;

const cosmicBreath = keyframes`
  0% {
    box-shadow: 0 0 20px rgba(240, 246, 252, 0.3), inset 0 0 20px rgba(240, 246, 252, 0.1);
  }
  50% {
    box-shadow: 0 0 40px rgba(240, 246, 252, 0.6), inset 0 0 40px rgba(240, 246, 252, 0.2);
  }
  100% {
    box-shadow: 0 0 20px rgba(240, 246, 252, 0.3), inset 0 0 20px rgba(240, 246, 252, 0.1);
  }
`;

// Add global styles to prevent layout shifts
const GlobalStyle = `
  * {
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  
  #__next {
    min-height: 100vh;
    position: relative;
  }
`;

// Add global styles for Luna animations
const lunaGlobalStyles = `
  @keyframes lunarPulse {
    0% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 0.6; }
  }
  @keyframes starFloat {
    0% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-20px) translateX(15px); }
    100% { transform: translateY(0px) translateX(0px); }
  }  @keyframes cosmicBreath {
    0% { box-shadow: 0 0 20px rgba(240, 246, 252, 0.3), inset 0 0 20px rgba(240, 246, 252, 0.1); }
    50% { box-shadow: 0 0 40px rgba(240, 246, 252, 0.6), inset 0 0 40px rgba(240, 246, 252, 0.2); }
    100% { box-shadow: 0 0 20px rgba(240, 246, 252, 0.3), inset 0 0 20px rgba(240, 246, 252, 0.1); }
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = lunaGlobalStyles;
  document.head.appendChild(style);
}

// Component for the animated moon
const LunarPhase = ({ size = 60 }) => {
  const [phase, setPhase] = useState(0);
  const [shadowOffset, setShadowOffset] = useState(0);
  
  useEffect(() => {
    // Calculate moon phase based on current date
    // The lunar cycle is approximately 29.53 days
    const date = new Date();
    const dayOfMonth = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Simple algorithm to roughly calculate moon phase
    const moonPhase = ((year - 2000) % 19) * 11 + month + dayOfMonth;
    const newPhase = moonPhase % 30; // 0-29 (0 = new moon, 15 = full moon)
    
    setPhase(newPhase);
    // Calculate shadow position based on phase
    setShadowOffset(Math.sin((newPhase / 30) * Math.PI * 2) * (size / 2));
    
    const intervalId = setInterval(() => {
      // Slightly change phase for animation effect
      setPhase(prev => {
        const updatedPhase = (prev + 0.1) % 30;
        setShadowOffset(Math.sin((updatedPhase / 30) * Math.PI * 2) * (size / 2));
        return updatedPhase;
      });
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [size]);
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#f5f5f5',
        boxShadow: `inset ${shadowOffset}px 0 0 5px rgba(0, 0, 0, 0.8)`,
        animation: `${pulse} 8s infinite ease-in-out`,
        zIndex: 10,
      }}
    />
  );
};

// Updated Star component
const Star = ({ size, top, left, delay }) => {
  const [animDuration, setAnimDuration] = useState(4);
  
  // Generate random animation duration on client
  useEffect(() => {
    setAnimDuration(4 + Math.random() * 4);
  }, []);
  
  return (
    <Box
      sx={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        backgroundColor: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
        animation: `${float} ${animDuration}s infinite ease-in-out ${delay}s`,
      }}
    />
  );
};


// Enhanced CosmicWavesIndicator with Luna theme
const CosmicWavesIndicator = () => {
  // Use state to store random heights
  const [waveHeights, setWaveHeights] = useState([15, 15, 15, 15, 15]);
  
  // Generate random heights after component mounts (client-side only)
  useEffect(() => {
    setWaveHeights([
      10 + Math.random() * 20,
      10 + Math.random() * 20,
      10 + Math.random() * 20,
      10 + Math.random() * 20,
      10 + Math.random() * 20
    ]);
  }, []);
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 1,
        my: 1,
        width: '100%',
        height: '50px',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(240, 246, 252, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${lunarPulse} 3s infinite ease-in-out`,
          zIndex: -1,
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 1,
          height: '30px',
        }}
      >        {[0, 1, 2, 3, 4].map((index) => (
          <Box
            key={index}
            sx={{
              width: '4px',
              height: `${waveHeights[index]}px`,
              backgroundColor: index % 2 === 0 ? '#f0f6fc' : '#c8d1d9',
              borderRadius: '2px',
              animation: `${waveMotion} ${1 + index * 0.2}s infinite ease-in-out ${index * 0.1}s`,
              boxShadow: index % 2 === 0 
                ? '0 0 8px #f0f6fc, 0 0 12px #f0f6fc' 
                : '0 0 8px #c8d1d9, 0 0 12px #c8d1d9',
            }}
          />
        ))}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(240, 246, 252, 0.8)',
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          letterSpacing: '1px',
          textShadow: '0 0 5px rgba(240, 246, 252, 0.5)',
          animation: `${pulse} 2s infinite ease-in-out`,
        }}
      >
        Computing cosmic response...
      </Typography>
    </Box>
  );
};

export default function Home() {
    // Initialize state variables
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi, my name is LUNA and I am here to help you understand the COSMOS. Ask me anything about the outer space!",
        },
    ])
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    // Check if the device is mobile
    const isMobile = useMediaQuery('(max-width:600px)')
    const [isRecording, setIsRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [stars, setStars] = useState([])

    // Add this new ref for scrolling to the latest message
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
      // Add this function to scroll to the bottom when new messages arrive
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Update when messages change to scroll to bottom
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
    
    // Generate random stars on component mount
    useEffect(() => {
        const newStars = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            size: 2 + Math.random() * 5,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 2
        }));
        setStars(newStars);
    }, []);

    // Create a space-themed light theme
    const theme = useMemo(
        () =>
          createTheme({
            palette: {            mode: 'light',
              primary: {
                main: 'rgba(240, 246, 252, 0.7)', // Grayish white for space theme
              },
              secondary: {
                main: '#1E88E5', // Blue for user messages
              },
              background: {
                default: '#121212',
                paper: 'rgba(25, 25, 35, 0.85)',
              },
              text: {
                primary: '#E0E0E0',
              },
            },
            // In your theme configuration in chat/page.js
            typography: {
                fontFamily: 'var(--font-space-grotesk), "Roboto", "Arial", sans-serif',
                // Adjust font sizes for mobile readability
                body1: {
                  fontSize: '0.95rem',
                },
                caption: {
                  fontSize: '0.75rem',
                }
            },
            components: {
              MuiTextField: {
                styleOverrides: {
                  root: {
                    '& .MuiOutlinedInput-root': {                      '& fieldset': {
                        borderColor: 'rgba(240, 246, 252, 0.5)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(240, 246, 252, 0.8)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(240, 246, 252, 0.7)',
                      },
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },                    '& .MuiInputLabel-root': {
                      color: 'rgba(240, 246, 252, 0.7)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#E0E0E0',
                    },
                  },
                },
              },
              // Add more mobile-friendly styling
              MuiFab: {
                styleOverrides: {
                  root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  },
                  sizeSmall: {
                    width: '40px',
                    height: '40px',
                    minHeight: '40px',
                  }
                }
              }
            },
          }),
        [],
    )

// formatting the text reply from the chatbot
    const formatMessage = (content) => {
      return (
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  className="code-block"
                  wrapLines={true}
                  showLineNumbers={true}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },
            h1: ({node, ...props}) => <Typography variant="h5" color="#9575CD" sx={{mt: 2, mb: 1, fontWeight: 'bold'}} {...props} />,
            h2: ({node, ...props}) => <Typography variant="h6" color="#9575CD" sx={{mt: 1.5, mb: 1, fontWeight: 'bold'}} {...props} />,
            h3: ({node, ...props}) => <Typography variant="subtitle1" color="#9575CD" sx={{mt: 1, mb: 0.5, fontWeight: 'bold'}} {...props} />,
            p: ({node, ...props}) => <Typography variant="body1" sx={{my: 0.5}} {...props} />,
            ul: ({node, ...props}) => <Box component="ul" sx={{ml: 2, mt: 0.5, mb: 1}} {...props} />,
            ol: ({node, ...props}) => <Box component="ol" sx={{ml: 2, mt: 0.5, mb: 1}} {...props} />,
            li: ({node, ...props}) => <Box component="li" sx={{mb: 0.5}} {...props} />,
            a: ({node, ...props}) => (
              <Link 
                {...props} 
                sx={{
                  color: '#90CAF9',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#90CAF9'
                  }
                }}
                target="_blank"
                rel="noopener"
              />
            ),
            blockquote: ({node, ...props}) => (
              <Box
                component="blockquote"
                sx={{
                  borderLeft: '3px solid #9575CD',
                  pl: 2,                  my: 1,
                  py: 0.5,
                  backgroundColor: 'rgba(240, 246, 252, 0.1)',
                  borderRadius: '0 4px 4px 0',
                }}
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      );
    };


    // Function to send a message to the AI
    const sendMessage = async () => {
        if (!message.trim() || isLoading) return;
        setIsLoading(true)

        // Record animation start time
    const animationStartTime = Date.now();  

        setMessage('')
        setMessages((messages) => [
            ...messages,
            { role: 'user', content: message },
            { role: 'assistant', content: '' },
        ])

        try {
            // Send the message to the API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...messages, { role: 'user', content: message }]),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            // Read the streaming response
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const text = decoder.decode(value, { stream: true })
                setMessages((messages) => {
                    let lastMessage = messages[messages.length - 1]
                    let otherMessages = messages.slice(0, messages.length - 1)
                    return [
                        ...otherMessages,
                        { ...lastMessage, content: lastMessage.content + text },
                    ]
                })
            }
        } catch (error) {
            console.error('Error:', error)
            setMessages((messages) => [
                ...messages,
                { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
            ])
        }

              // Calculate how long the animation has been showing
            const animationDisplayTime = Date.now() - animationStartTime;
            
            // If it's been less than 1500ms, wait the remaining time
            const minimumDisplayTime = 1500; // 1.5 seconds
            if (animationDisplayTime < minimumDisplayTime) {
                await new Promise(resolve => 
                    setTimeout(resolve, minimumDisplayTime - animationDisplayTime)
                );
              }

        setIsLoading(false)
    }    // Handle Enter key press to send message
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            sendMessage()
        }
    };

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        
        {/* Enhanced Luna-themed background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #111316 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)',
          zIndex: -2
        }} />
        
        {/* Particle background with Luna theme */}
        <ParticlesBg 
          type="cobweb" 
          bg={false} 
          color="#8364E8" 
          num={isMobile ? 25 : 50}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: -1 
          }} 
        />

        {/* Ambient lunar glow effect */}
        <div style={{
          position: 'fixed',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(240, 246, 252, 0.1) 0%, rgba(240, 246, 252, 0.05) 30%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'lunarPulse 8s infinite ease-in-out',
          zIndex: -1,
          display: { xs: 'none', md: 'block' }
        }} />

        {/* Additional floating particles */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(240, 246, 252, 0.8), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(200, 209, 217, 0.6), transparent),            radial-gradient(1px 1px at 90px 40px, rgba(240, 246, 252, 0.9), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(240, 246, 252, 0.7), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(240, 246, 252, 0.8), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          animation: 'starFloat 20s linear infinite',
          zIndex: -1,
          opacity: 0.6
        }} />        {/* Main Layout Wrapper */}
        <Box
          sx={{
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Enhanced Navigation with Luna styling */}
          <Box sx={{ position: 'fixed', top: 20, left: 20, zIndex: 10, display: { xs: 'none', md: 'block' } }}>
            <Button
              component={Link}
              href="/"
              startIcon={<HomeIcon />}              sx={{
                color: '#f0f6fc',
                borderColor: 'rgba(240, 246, 252, 0.5)',
                background: 'rgba(17, 19, 22, 0.7)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: 'rgba(240, 246, 252, 0.7)',
                  backgroundColor: 'rgba(240, 246, 252, 0.2)',
                  boxShadow: '0 0 15px rgba(240, 246, 252, 0.4)',
                  transform: 'scale(1.05)',
                },
                borderRadius: '30px',
                px: 2,
                py: 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 0 10px rgba(240, 246, 252, 0.3)',
              }}
              variant="outlined"
            >
              Home
            </Button>
          </Box>

          {/* Enhanced Learn Space Science Button */}
          <Box 
            sx={{ 
              position: 'fixed', 
              right: 20, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              zIndex: 999,
              display: { xs: 'none', md: 'block' }
            }}
          >
            <Button
              component={Link}
              href="/learn"
              sx={{                color: '#ffffff',
                background: 'linear-gradient(135deg, rgba(130, 131, 133, 0.8) 0%, rgba(176, 180, 184, 0.8) 100%)',
                borderColor: 'rgba(240, 246, 252, 0.7)',
                border: '2px solid',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgb(212, 214, 216) 0%, rgb(231, 234, 236) 100%)',
                  boxShadow: '0 0 25px rgba(240, 246, 252, 0.8), 0 0 50px rgba(240, 246, 252, 0.4)',
                  color: 'rgba(107, 110, 114, 0.7)',
                  transform: 'scale(1.05)',
                },
                borderRadius: '30px',
                px: 2,
                py: 1,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'flex',                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 0 15px rgba(240, 246, 252, 0.5), 0 0 30px rgba(240, 246, 252, 0.2)',
                
              }}
            >
              <ScienceIcon sx={{ mb: 1, fontSize: '1.8rem' }} />
              <span className="font-space-grotesk">Learn Space Science</span>
            </Button>
          </Box>
            
          {/* Only show lunar phase on desktop */}
          {!isMobile && <LunarPhase size={isMobile ? 40 : 80} />}
          
          {/* Only show stars on desktop */}
          {!isMobile && stars.map(star => (
            <Star 
              key={star.id}
              size={star.size}
              top={star.top}
              left={star.left}
              delay={star.delay}
            />          ))}          {/* Main Content with enhanced Luna styling */}
          <Container
            maxWidth="lg"
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: { xs: '20px 16px 120px 16px', md: '40px 24px 120px 24px' },
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: { xs: '100%', lg: '1200px' },
              background: 'rgba(17, 19, 22, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: { xs: 0, md: '20px' },
              border: { xs: 'none', md: '1px solid rgba(240, 246, 252, 0.1)' },
              animation: `${cosmicBreath} 10s infinite ease-in-out`,
              overflow: 'hidden',
            }}
          >{/* Enhanced Title with cosmic styling */}          <Typography 
            variant={isMobile ? "h6" : "h4"} 
            align="center" 
            sx={{
              color: '#f0f6fc',
              fontFamily: 'var(--font-exo-2), sans-serif',
              textShadow: '0 0 10px rgba(240, 246, 252, 0.7), 0 0 20px rgba(240, 246, 252, 0.3), 0 0 40px rgba(240, 246, 252, 0.2)',
              fontWeight: 700,
              letterSpacing: isMobile ? '2px' : '3px',
              marginBottom: { xs: '15px', md: '20px' },
              marginTop: { xs: '20px', md: '20px' },
              animation: `${pulse} 5s infinite ease-in-out`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(240, 246, 252, 0.8), transparent)',
                borderRadius: '2px',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(240, 246, 252, 0.6), transparent)',
                borderRadius: '1px',
              }
            }}
          >
            LUNA.ai
          </Typography>          {/* Enhanced Chat container with Luna styling */}
          <Box 
            ref={messagesContainerRef}
            sx={{ 
              width: '100%', 
              maxWidth: '900px', 
              margin: '0 auto', 
              display: 'flex', 
              flexDirection: 'column', 
              flex: 1,
              overflow: 'auto',
              minHeight: 0,
              paddingBottom: '120px', // Fixed padding to prevent shifts
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(240, 246, 252, 0.4), transparent)',
                zIndex: 1,
              }
            }}
          >{messages.map((message, index) => (
              <Box 
                key={index}
                sx={{
                  width: '100%',
                  py: { xs: 2, md: 3 },
                  px: { xs: 2, md: 3 },
                  bgcolor: message.role === 'assistant' 
                    ? 'rgba(36, 41, 46, 0.8)' 
                    : 'rgba(61, 68, 76, 0.7)',
                  borderBottom: message.role === 'assistant'
                    ? '1px solid rgba(240, 246, 252, 0.2)'
                    : '1px solid rgba(200, 209, 217, 0.3)',
                  animation: `${fadeIn} 0.3s ease-out`,
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: message.role === 'assistant'
                      ? 'linear-gradient(90deg, rgba(240, 246, 252, 0), rgba(240, 246, 252, 0.4), rgba(240, 246, 252, 0))'
                      : 'linear-gradient(90deg, rgba(200, 209, 217, 0), rgba(200, 209, 217, 0.4), rgba(200, 209, 217, 0))',
                  },
                  '&:first-of-type': {
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                  },
                  '&:last-of-type': {
                    borderBottomLeftRadius: message.role === 'user' ? '12px' : '0px',
                    borderBottomRightRadius: message.role === 'user' ? '12px' : '0px',
                  },
                }}
              >
                <Box
                  sx={{
                    maxWidth: '100%',
                    margin: '0 auto',
                    width: '100%',
                  }}
                ><Typography 
                    variant="caption" 
                    sx={{ 
                      color: message.role === 'assistant' ? '#f0f6fc' : '#c8d1d9',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      mb: 1,
                      display: 'block',
                      fontSize: { xs: '0.65rem', md: '0.75rem' },
                      textShadow: message.role === 'assistant' ? '0 0 5px rgba(240, 246, 252, 0.3)' : 'none'
                    }}
                  >
                    {message.role === 'assistant' ? 'LUNA' : 'You'}
                  </Typography>
                  <Box sx={{ 
                    color: 'white',
                    '& .code-block': {
                      borderRadius: '4px',
                      margin: { xs: '6px 0', md: '8px 0' },
                      maxWidth: '100%',
                      overflow: 'auto',
                      fontSize: { xs: '0.75rem', md: '0.85rem' },                      border: '1px solid rgba(240, 246, 252, 0.3)',
                      boxShadow: '0 0 10px rgba(240, 246, 252, 0.1)',
                    },
                    '& .inline-code': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                      fontSize: { xs: '0.8em', md: '0.9em' }
                    },
                    '& a': {
                      color: '#90CAF9',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#42A5F5'
                      }
                    },
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '4px',
                      margin: { xs: '6px 0', md: '8px 0' }
                    },
                    '& p': {
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      lineHeight: { xs: 1.5, md: 1.6 },
                      margin: { xs: '0.5em 0', md: '0.75em 0' }
                    }
                  }}>
                    {message.content ? formatMessage(message.content) : 
                      message.role === 'assistant' && isLoading && index === messages.length - 1 ? 
                      <CosmicWavesIndicator /> : null
                    }
                  </Box>
                </Box>
              </Box>
            ))}            {/* Input area - positioned inline on desktop when not fixed */}
            {/* This section has been removed - input is now always fixed */}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </Box>          {/* Fixed Input area - Always shown */}
          <Paper 
            elevation={3}
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0,
              right: 0,
              width: '100%', 
              bgcolor: 'rgba(36, 41, 46, 0.95)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(240, 246, 252, 0.3)',
              pt: { xs: 1.5, md: 2 },
              pb: { xs: 2, md: 3 },
              px: { xs: 1.5, md: 2 },
              zIndex: 10,
              animation: `${fadeIn} 0.3s ease-out`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, rgba(240, 246, 252, 0), rgba(240, 246, 252, 0.6), rgba(240, 246, 252, 0))',
              },
              boxShadow: '0 -5px 15px rgba(0,0,0,0.3), 0 -1px 3px rgba(240, 246, 252, 0.2)'
            }}
          >
              <Stack 
                direction={'row'} 
                spacing={1} 
                alignItems="flex-end"                sx={{
                  maxWidth: '900px',  // Match the max-width of message containers
                  margin: '0 auto',
                  width: '100%',
                  px: { xs: 0.5, md: 1 },  // Add some padding to align with messages
                }}
              >
                <TextField
                  label="Message"
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading || isRecording}
                  multiline
                  maxRows={3}
                  size="small"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '18px', md: '8px' },  // More rounded corners
                      paddingRight: '12px',                      '& fieldset': {
                        borderColor: 'rgba(240, 246, 252, 0.4)',
                        transition: 'border-color 0.3s',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(240, 246, 252, 0.7)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(240, 246, 252, 0.7)',
                        boxShadow: '0 0 0 2px rgba(240, 246, 252, 0.2)',
                      },
                    }
                  }}
                />

                {/* Add Learn Space Science button for mobile */}
                <Tooltip title="Learn Space Science">
                  <Fab
                    color="primary"
                    component={Link}
                    href="/learn"
                    size="small"
                    sx={{
                      minHeight: { xs: '40px', md: '48px' },
                      height: { xs: '40px', md: '48px' },
                      width: { xs: '40px', md: '48px' },
                      transition: 'transform 0.2s, box-shadow 0.2s',                      background: 'linear-gradient(45deg, rgba(240, 246, 252, 0.7) 30%, rgba(240, 246, 252, 0.7) 90%)',
                      boxShadow: '0 0 10px rgba(240, 246, 252, 0.7)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 15px rgba(240, 246, 252, 1), 0 0 2px #fff',
                      },
                      display: { xs: 'flex', md: 'none' },  // Only show on mobile
                    }}
                  >
                    <ScienceIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                  </Fab>
                </Tooltip>

                <Tooltip title="Explore Space Games">
                  <Fab
                    color="rgba(107, 110, 114, 0.7)"
                    component={Link}
                    href="/games"
                    size="small"
                    sx={{
                      minHeight: { xs: '40px', md: '48px' },
                      height: { xs: '40px', md: '48px' },
                      width: { xs: '40px', md: '48px' },
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      background: 'rgba(123, 166, 223, 0.7)',
                      boxShadow: '0 0 10px rgba(30, 136, 229, 0.7)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 15px rgba(30, 136, 229, 1), 0 0 2px #fff',
                      },
                    }}
                  >
                    <GamesIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                  </Fab>
                </Tooltip>

                <Fab
                  color="primary"
                  onClick={sendMessage}
                  disabled={isLoading || isRecording}
                  size="small"
                  sx={{
                    minHeight: { xs: '40px', md: '48px' },
                    height: { xs: '40px', md: '48px' },                    width: { xs: '40px', md: '48px' },
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    background: 'linear-gradient(45deg, rgba(240, 246, 252, 0.7) 30%, rgba(240, 246, 252, 0.7) 90%)',
                    boxShadow: '0 0 10px rgba(240, 246, 252, 0.7)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 15px rgba(240, 246, 252, 1), 0 0 2px #fff',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },                  }}                >
                  <SendIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </Fab>
              </Stack>
            </Paper>
        </Container>
        </Box>
      </ThemeProvider>
    );
}

