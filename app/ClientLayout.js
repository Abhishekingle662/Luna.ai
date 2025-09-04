'use client'

import { usePathname } from 'next/navigation';
import LandingPage from './LandingPage';
import Navigation from './components/Navigation';
import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isHomePage) {
    return <LandingPage />;
  }

  return (
    <>
      {children}
      <Navigation />
    </>
  );
}


