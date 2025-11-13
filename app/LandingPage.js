'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter();
  const [ctaScale, setCtaScale] = React.useState(1);

  const handleChatClick = () => {
    router.push('/chat');
  };

  // Inject lunar theme styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --lunar-deep: #111316;
        --lunar-dark: #24292e;
        --lunar-gray: #3d444c;
        --lunar-light: #c8d1d9;
        --lunar-accent: #f0f6fc;
        --lunar-accent-text: #111316;
        --lunar-purple: #9575cd;
        --font-exo-2: '__Exo_2_b441d4', '__Exo_2_Fallback_b441d4';
      }
      
      .lunar-headline {
        text-align: center;
        box-sizing: border-box;
        margin: 0;
        scrollbar-width: none;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        color: var(--lunar-accent);
        padding: 20px;
        font-size: xxx-large;
      }
      
      .lunar-subtitle {
        --lunar-deep: #111316;
        --lunar-dark: #24292e;
        --lunar-gray: #3d444c;
        --lunar-light: #c8d1d9;
        --lunar-accent: #f0f6fc;
        --lunar-accent-text: #111316;
        --lunar-purple: #9575cd;
        color: #c8d1d9 !important;
        font-family: 'Lato', sans-serif;
        --font-exo-2: '__Exo_2_b441d4', '__Exo_2_Fallback_b441d4';
        text-align: center;
        box-sizing: border-box;
        margin: 0;
        scrollbar-width: none;
        margin-inline: auto;
        padding: 10px;
        font-size: x-large;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/assets/earth.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Yellow + Orange shade overlay (between video and content) */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 5,
          background:
            'linear-gradient(120deg, rgba(255,193,7,0.18) 0%, rgba(255,152,0,0.14) 35%, rgba(255,87,34,0.12) 100%)',
          mixBlendMode: 'soft-light',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Overlay section */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center z-10 bg-[rgba(10,20,40,0.45)] backdrop-blur-sm">
        <h1 className="lunar-headline mb-6 tracking-tight drop-shadow-lg">
          ChatGPT but for Space
        </h1>
        <p className="lunar-subtitle mb-10 max-w-xl mx-auto">
          Your cosmic AI companion for exploring the universe, learning, and chatting about space.
        </p>
        <button
          onClick={handleChatClick}
          style={{
            padding: '1rem 2.5rem',
            background: '#1e293b', // solid space-themed color
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.18rem',
            border: '2px solid #38bdf8',
            borderRadius: '999px',
            boxShadow: '0 4px 32px #FFA239, 0 2px 8px #FEEE91',
            textShadow: '0 1px 8px #2451eb',
            letterSpacing: '0.03em',
            cursor: 'pointer',
            marginTop: '1rem',
            outline: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            transform: `scale(${ctaScale})`,
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={() => setCtaScale(1.07)}
          onMouseLeave={() => setCtaScale(1)}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>
            Talk to Luna 
          </span>
        </button>
      </div>
    </div>
  );
}