'use client'
import { Box, Fab, Stack, TextField, Typography, useMediaQuery, CssBaseline } from '@mui/material'
import { useState, useMemo, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SendIcon from '@mui/icons-material/Send'
import { keyframes } from '@mui/system'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeRaw from 'rehype-raw';
import Link from '@mui/material/Link'

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
            {/* Particle Background */}
            <ParticlesBg type="cobweb" bg={true} color="#8364E8" num={50} />
            
            {/* Main Content */}
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* Lunar Phase Animation */}
                <LunarPhase size={isMobile ? 40 : 80} />
                
                {/* Animated Stars */}
                {stars.map(star => (
                    <Star 
                        key={star.id}
                        size={star.size}
                        top={star.top}
                        left={star.left}
                        delay={star.delay}
                    />
                ))}
                
                {/* Main chat container */}
                <Stack
                    direction="column"
                    sx={{
                      /* Use full width on small screens (xs), and a fixed width on medium (md) and above */
                      width: { xs: "100%", md: "800px" },
                      /* For height, use full viewport height on mobile and a bit less on larger screens */
                      height: { xs: "100%", md: "80vh" },
                      background: "rgba(25, 25, 35, 0.75)",
                      backdropFilter: "blur(10px)",
                      /* No border radius on mobile, rounded corners on larger screens */
                      borderRadius: { xs: 0, md: "20px" },
                      overflow: "hidden",
                      border: "1px solid rgba(149, 117, 205, 0.3)",
                      boxShadow: "0 0 20px rgba(149, 117, 205, 0.5)",
                      zIndex: 5,
                      /* Center the container horizontally on desktop */
                      mx: { xs: 0, md: "auto" },
                    }}
                  >

                    {/* Title */}
                    <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        align="center" 
                        sx={{
                            color: '#9575CD',
                            fontFamily: 'var(--font-exo-2), sans-serif',  // Changed from Orbitron to Exo 2
                            textShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
                            fontWeight: 700,
                            letterSpacing: '3px',
                            padding: '15px 0',
                            animation: `${pulse} 5s infinite ease-in-out`,
                        }}
                    >
                        LUNA.ai
                    </Typography>

                    {/* Chat messages */}
                    <Stack
                        direction={'column'}
                        spacing={2}
                        flexGrow={1}
                        overflow="auto"
                        maxHeight={isMobile ? "calc(100% - 140px)" : "calc(100% - 120px)"}
                        sx={{
                            padding: '10px 15px',
                            backgroundImage: 'linear-gradient(rgba(25, 25, 35, 0.5), rgba(25, 25, 35, 0.7))',
                            backdropFilter: 'blur(5px)',
                        }}
                    >
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                display="flex"
                                justifyContent={
                                    message.role === 'assistant' ? 'flex-start' : 'flex-end'
                                }
                                sx={{
                                    animation: `${fadeIn} 0.3s ease-out`,
                                }}
                            >
                                <Box
                                  bgcolor={
                                    message.role === 'assistant'
                                      ? 'rgba(93, 63, 211, 0.8)'
                                      : 'rgba(30, 136, 229, 0.8)'
                                  }
                                  color="white"
                                  borderRadius={3}
                                  p={2}
                                  maxWidth={isMobile ? "85%" : "70%"}
                                  sx={{
                                    boxShadow: message.role === 'assistant' 
                                      ? '0 0 15px rgba(93, 63, 211, 0.5)'
                                      : '0 0 15px rgba(30, 136, 229, 0.5)',
                                    backdropFilter: 'blur(5px)',
                                    '& .code-block': {
                                      borderRadius: '4px',
                                      margin: '8px 0',
                                      maxWidth: '100%',
                                      overflow: 'auto',
                                      fontSize: '0.85rem'
                                    },
                                    '& .inline-code': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                      padding: '2px 4px',
                                      borderRadius: '3px',
                                      fontFamily: 'monospace',
                                      fontSize: '0.9em'
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
                                      margin: '8px 0'
                                    }
                                  }}
                                >
                                  {/* Show actual message content or placeholder for empty assistant messages */}
                                  {message.content ? formatMessage(message.content) : 
                                    message.role === 'assistant' && isLoading && index === messages.length - 1 ? 
                                      <CosmicWavesIndicator /> : null
                                  }
                                </Box>
                            </Box>
                        ))}
                    </Stack>


                    {/* Input area */}
                    <Stack 
                        direction={'row'} 
                        spacing={1} 
                        alignItems="flex-end"
                        sx={{
                            padding: '10px',
                            borderTop: '1px solid rgba(149, 117, 205, 0.3)',
                        }}
                    >
                        <TextField
                            label="Message"
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading || isRecording}
                            multiline
                            maxRows={4}
                            size={isMobile ? "small" : "medium"}
                        />

                        {/* Send message button */}
                        <Fab
                            color="primary"
                            onClick={sendMessage}
                            disabled={isLoading || isRecording}
                            size={isMobile ? "small" : "medium"}
                            sx={{
                                transition: 'transform 0.3s',
                                background: 'linear-gradient(45deg, #5D3FD3 30%, #7B68EE 90%)',
                                boxShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 0 15px rgba(149, 117, 205, 1)',
                                },
                                '&:active': {
                                    transform: 'scale(0.9)',
                                },
                            }}
                        >
                            <SendIcon />
                        </Fab>
                    </Stack>
                </Stack>
            </Box>
        </ThemeProvider>
        
    )
}
