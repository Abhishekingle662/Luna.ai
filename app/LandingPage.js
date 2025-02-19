import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isShortScreen = useMediaQuery('(max-height: 700px)');
  const isVeryShortScreen = useMediaQuery('(max-height: 500px)');

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'relative',
        minHeight: {
          xs: isVeryShortScreen ? '100%' : '100vh',
        },
        py: isShortScreen ? 2 : 0,
        backgroundImage: 'url("https://33.media.tumblr.com/5ab91dfb029f1745f2e318f0c554fadd/tumblr_nx7xf40vg31qaityko1_1280.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        px: { xs: 2, sm: 4, md: 6 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          padding: {
            xs: isShortScreen ? '0.75rem' : '1rem',
            sm: isShortScreen ? '1rem' : '1.5rem',
            md: isShortScreen ? '1.5rem' : '2rem',
          },
          borderRadius: '20px',
          width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
          maxWidth: '800px',
          my: isShortScreen ? 2 : 0,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Typography 
          variant={isMobile || isShortScreen ? 'h3' : 'h2'} 
          gutterBottom
          sx={{
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontWeight: 700,
            fontSize: {
              xs: isShortScreen ? '1.5rem' : '1.75rem',
              sm: isShortScreen ? '2rem' : '2.5rem',
              md: isShortScreen ? '2.75rem' : '3.25rem',
            },
            mb: isShortScreen ? 1 : 2,
          }}
        >
          Welcome to LUNA.ai
        </Typography>
        <Typography 
          variant={isMobile || isShortScreen ? 'h6' : 'h5'} 
          sx={{
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontSize: {
              xs: isShortScreen ? '0.875rem' : '1rem',
              sm: isShortScreen ? '1rem' : '1.25rem',
              md: isShortScreen ? '1.25rem' : '1.5rem',
            },
            mb: isShortScreen ? 1 : 2,
          }}
        >
          Your guide to the outer space!!
        </Typography>
        <Button
          variant="contained"
          size={isMobile || isShortScreen ? "medium" : "large"}
          component={Link}
          href="/chat"
          sx={{ 
            mt: { 
              xs: isShortScreen ? 1 : 2,
              sm: isShortScreen ? 2 : 3,
              md: isShortScreen ? 3 : 4,
            },
            px: isShortScreen ? { xs: 2, sm: 3, md: 4 } : { xs: 3, sm: 4, md: 5 },
            py: isShortScreen ? { xs: 0.5, sm: 1, md: 1.5 } : { xs: 1, sm: 1.5, md: 2 },
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
              boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
            },
            '&:active': {
              transform: 'translateY(1px)',
            },
            borderRadius: '25px',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Start Chatting
        </Button>
      </Box>
    </Box>
  );
}