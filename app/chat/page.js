'use client'
import { Box, Fab, Stack, TextField, Typography, useMediaQuery, CssBaseline } from '@mui/material'
import { useState, useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SendIcon from '@mui/icons-material/Send'
import { keyframes } from '@mui/system'

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

    // Create a fixed light theme
    const theme = useMemo(
        () =>
          createTheme({
            palette: {
              mode: 'light',
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
            {/* Main Content - Remove pt (padding-top) since header is gone */}
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: 'url("https://media.giphy.com/media/vTr3WiTdqpL6GOT5mF/giphy.gif")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Main chat container - Update height calculation since header is gone */}
                <Stack
                    direction={'column'}
                    width={isMobile ? "100%" : "800px"}
                    height="100vh"
                    sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: isMobile ? 0 : '20px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Title */}
                    <Typography variant={isMobile ? "h5" : "h4"} align="center" color="secondary">
                    LUNA.ai
                    </Typography>

                    
                    {/* Chat messages */}
                    <Stack
                        direction={'column'}
                        spacing={2}
                        flexGrow={1}
                        overflow="auto"
                        maxHeight={isMobile ? "calc(100% - 140px)" : "calc(100% - 120px)"}
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
                                            ? 'primary.main'
                                            : 'secondary.main'
                                    }
                                    color="white"
                                    borderRadius={5}
                                    p={1.5}
                                    maxWidth={isMobile ? "85%" : "70%"}
                                >
                                    <Typography variant={isMobile ? "body2" : "body1"}>
                                        {formatMessage(message.content)}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                    {/* Input area */}
                    <Stack direction={'row'} spacing={1} alignItems="flex-end">
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
                                '&:hover': {
                                    transform: 'scale(1.1)',
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
