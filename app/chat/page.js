'use client'
import { Box, Fab, Stack, TextField, Typography, useMediaQuery, CssBaseline, Tooltip, Button, Container, IconButton, Paper } from '@mui/material'
import { useState, useMemo, useEffect, useRef } from 'react'
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


// Updated CosmicWavesIndicator with client-side random values
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
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <Box
            key={index}
            sx={{
              width: '4px',
              height: `${waveHeights[index]}px`, // Use stored heights
              backgroundColor: index % 2 === 0 ? '#9370DB' : '#4169E1',
              borderRadius: '2px',
              animation: `${waveMotion} ${1 + index * 0.2}s infinite ease-in-out ${index * 0.1}s`,
              boxShadow: index % 2 === 0 
                ? '0 0 8px #9370DB, 0 0 12px #9370DB' 
                : '0 0 8px #4169E1, 0 0 12px #4169E1',
            }}
          />
        ))}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          letterSpacing: '1px',
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
    
    // Add this function to scroll to the bottom when new messages arrive
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // Add this effect to scroll when messages change
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
            palette: {
              mode: 'light',
              primary: {
                main: '#5D3FD3', // Purple for space theme
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
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(149, 117, 205, 0.5)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(149, 117, 205, 0.8)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5D3FD3',
                      },
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#9575CD',
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
                  pl: 2,
                  my: 1,
                  py: 0.5,
                  backgroundColor: 'rgba(149, 117, 205, 0.1)',
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
    }

    // Handle Enter key press to send message
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            sendMessage()
        }
    }


    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Reduce particles on mobile for better performance */}
        <ParticlesBg type="cobweb" bg={true} color="#8364E8" num={isMobile ? 25 : 50} />

        {/* Navigation */}
        <Box sx={{ position: 'fixed', top: 20, left: 20, zIndex: 10, display: { xs: 'none', md: 'block' } }}>
          <Button
            component={Link}
            href="/"
            startIcon={<HomeIcon />}
            sx={{
              color: '#9575CD',
              borderColor: 'rgba(149, 117, 205, 0.5)',
              '&:hover': {
                borderColor: '#9575CD',
                backgroundColor: 'rgba(149, 117, 205, 0.1)',
              },
              backdropFilter: 'blur(5px)',
              borderRadius: '30px',
              px: 2
            }}
            variant="outlined"
          >
            Home
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
          />
        ))}
        
        {/* Main Content */}
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: { xs: '50px 0 0', md: '100px 0 30px' },
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Title */}
          <Typography 
            variant={isMobile ? "h6" : "h4"} 
            align="center" 
            sx={{
              color: '#9575CD',
              fontFamily: 'var(--font-exo-2), sans-serif',
              textShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
              fontWeight: 700,
              letterSpacing: isMobile ? '2px' : '3px',
              padding: isMobile ? '0 0 10px' : '0 0 20px',
              animation: `${pulse} 5s infinite ease-in-out`,
            }}
          >
            LUNA.ai
          </Typography>

          {/* Chat container */}
          <Box sx={{ 
            width: '100%', 
            maxWidth: '800px', 
            margin: '0 auto', 
            px: { xs: 0, md: 0 },  // No horizontal padding on mobile
            display: 'flex', 
            flexDirection: 'column', 
            flex: 1,  // Take remaining space
            overflow: 'auto',  // Allow scrolling
            // Add padding at the bottom to ensure messages aren't hidden behind the input area
            pb: { xs: '70px', md: '90px' }
          }}>
            {messages.map((message, index) => (
              <Box 
                key={index}
                sx={{
                  width: '100%',
                  py: { xs: 2, md: 4 },  // Less vertical padding on mobile
                  px: { xs: 2, md: 4 },  // Less horizontal padding on mobile
                  bgcolor: message.role === 'assistant' 
                    ? 'rgba(25, 25, 35, 0.75)' 
                    : 'rgba(35, 35, 45, 0.6)',
                  borderBottom: '1px solid rgba(149, 117, 205, 0.15)',
                  animation: `${fadeIn} 0.3s ease-out`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: message.role === 'assistant' ? '#9575CD' : '#64B5F6',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      mb: 1,
                      display: 'block',
                      // Smaller text on mobile
                      fontSize: { xs: '0.65rem', md: '0.75rem' }
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
                      fontSize: { xs: '0.75rem', md: '0.85rem' }
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
                    // Better typography for mobile
                    '& p': {
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      lineHeight: { xs: 1.5, md: 1.6 },
                      margin: { xs: '0.5em 0', md: '0.75em 0' }
                    }
                  }}>
                    {/* Show message content or loading indicator */}
                    {message.content ? formatMessage(message.content) : 
                      message.role === 'assistant' && isLoading && index === messages.length - 1 ? 
                      <CosmicWavesIndicator /> : null
                    }
                  </Box>
                </Box>
              </Box>
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input area - fixed at bottom */}
          <Paper 
            elevation={3}
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0,
              right: 0,
              width: '100%', 
              bgcolor: 'rgba(25, 25, 35, 0.9)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(149, 117, 205, 0.3)',
              pt: { xs: 1.5, md: 2 },
              pb: { xs: 2, md: 3 },
              px: { xs: 1.5, md: 2 },
              zIndex: 10
            }}
          >
            <Stack 
              direction={'row'} 
              spacing={1} 
              alignItems="flex-end"
              sx={{
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%',
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
                maxRows={3}  // Limit to 3 rows on mobile
                size="small"  // Always use small on mobile
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '18px', md: '4px' },  // More rounded on mobile like modern chat apps
                    paddingRight: '12px',  // Leave space for the button
                  }
                }}
              />

              {/* Games button - smaller on mobile */}
              <Tooltip title="Explore Space Games">
                <Fab
                  color="secondary"
                  component={Link}
                  href="/games"
                  size="small"  // Always small on mobile
                  sx={{
                    minHeight: { xs: '40px', md: '48px' },
                    height: { xs: '40px', md: '48px' },
                    width: { xs: '40px', md: '48px' },
                    transition: 'transform 0.2s',  // Faster animation on mobile
                    background: 'linear-gradient(45deg, #1E88E5 30%, #42A5F5 90%)',
                    boxShadow: '0 0 10px rgba(30, 136, 229, 0.7)',
                    '&:hover': {
                      transform: 'scale(1.05)',  // Smaller scale effect on mobile
                      boxShadow: '0 0 15px rgba(30, 136, 229, 1)',
                    },
                  }}
                >
                  <GamesIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </Fab>
              </Tooltip>

              {/* Send button - smaller on mobile */}
              <Fab
                color="primary"
                onClick={sendMessage}
                disabled={isLoading || isRecording}
                size="small"  // Always small on mobile
                sx={{
                  minHeight: { xs: '40px', md: '48px' },
                  height: { xs: '40px', md: '48px' },
                  width: { xs: '40px', md: '48px' },
                  transition: 'transform 0.2s',  // Faster animation on mobile
                  background: 'linear-gradient(45deg, #5D3FD3 30%, #7B68EE 90%)',
                  boxShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
                  '&:hover': {
                    transform: 'scale(1.05)',  // Smaller scale effect on mobile
                    boxShadow: '0 0 15px rgba(149, 117, 205, 1)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                <SendIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
              </Fab>
            </Stack>
          </Paper>
        </Box>
      </ThemeProvider>
    )
}

