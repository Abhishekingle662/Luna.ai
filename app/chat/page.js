'use client'
import { Box, Fab, Stack, TextField, Typography, useMediaQuery, CssBaseline } from '@mui/material'
import { useState, useMemo, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SendIcon from '@mui/icons-material/Send'
import { keyframes } from '@mui/system'
import dynamic from 'next/dynamic'

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

// Component for the animated moon
const LunarPhase = ({ size = 60 }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    // Calculate moon phase based on current date
    // The lunar cycle is approximately 29.53 days
    const date = new Date();
    const dayOfMonth = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Simple algorithm to roughly calculate moon phase
    const moonPhase = ((year - 2000) % 19) * 11 + month + dayOfMonth;
    setPhase(moonPhase % 30); // 0-29 (0 = new moon, 15 = full moon)
    
    const intervalId = setInterval(() => {
      // Slightly change phase for animation effect
      setPhase(prev => (prev + 0.1) % 30);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Calculate shadow position based on phase
  const shadowOffset = Math.sin((phase / 30) * Math.PI * 2) * (size / 2);
  
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

// Star component
const Star = ({ size, top, left, delay }) => (
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
      animation: `${float} ${4 + Math.random() * 4}s infinite ease-in-out ${delay}s`,
    }}
  />
);

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
            typography: {
              fontFamily: '"Orbitron", "Roboto", "Arial", sans-serif',
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
        const lines = content.split('•').filter(line => line.trim() !== '');
        
        if (lines.length > 1) {
          return (
            <ul>
              {lines.map((line, index) => (
                <li key={index}>{line.trim()}</li>
              ))}
            </ul>
          );
        } else {
          return <span>{content}</span>;
        }
      };


    // Function to send a message to the AI
    const sendMessage = async () => {
        if (!message.trim() || isLoading) return;
        setIsLoading(true)

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
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
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
                    direction={'column'}
                    width={isMobile ? "100%" : "800px"}
                    height="100vh"
                    sx={{
                        background: 'rgba(25, 25, 35, 0.75)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: isMobile ? 0 : '20px',
                        overflow: 'hidden',
                        border: '1px solid rgba(149, 117, 205, 0.3)',
                        boxShadow: '0 0 20px rgba(149, 117, 205, 0.5)',
                        zIndex: 5,
                    }}
                >
                    {/* Title */}
                    <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        align="center" 
                        sx={{
                            color: '#9575CD',
                            fontFamily: '"Orbitron", sans-serif',
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
                                    borderRadius={5}
                                    p={1.5}
                                    maxWidth={isMobile ? "85%" : "70%"}
                                    sx={{
                                        boxShadow: message.role === 'assistant' 
                                            ? '0 0 15px rgba(93, 63, 211, 0.5)'
                                            : '0 0 15px rgba(30, 136, 229, 0.5)',
                                        backdropFilter: 'blur(5px)',
                                    }}
                                >
                                    <Typography variant={isMobile ? "body2" : "body1"}>
                                        {formatMessage(message.content)}
                                    </Typography>
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
