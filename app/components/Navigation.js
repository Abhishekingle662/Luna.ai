'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle, Gamepad2, Calculator, Globe, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
    { href: '/games', label: 'Games', icon: Gamepad2 },
    { href: '/globe', label: 'Globe', icon: Globe },
    { href: '/learn/mathphysics', label: 'Math & Physics', icon: Calculator },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'rgba(17, 19, 22, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(61, 68, 76, 0.3)',
          boxShadow: '0 -10px 15px -3px rgba(240, 246, 252, 0.1)'
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex justify-center items-center space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`nav-item flex flex-col items-center space-y-1 px-4 py-3 rounded-xl group relative transition-all duration-300 ${
                        active ? 'nav-item-active' : ''
                      }`}
                      style={{
                        color: active ? '#f0f6fc' : '#c8d1d9',
                        minWidth: '80px'
                      }}
                    >
                      <Icon 
                        size={20} 
                        className="group-hover:scale-110 transition-transform duration-200" 
                        style={{ color: active ? '#9575cd' : '#c8d1d9' }}
                      />
                      <span 
                        className="text-xs font-medium tracking-wide" 
                        style={{ 
                          fontFamily: 'Space Grotesk, sans-serif',
                          color: active ? '#9575cd' : '#c8d1d9'
                        }}
                      >
                        {item.label}
                      </span>
                      {active && (
                        <motion.div
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ backgroundColor: '#9575cd' }}
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="px-4 py-3">
            <div className="flex justify-center items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`nav-item flex flex-col items-center space-y-1 px-2 py-2 rounded-lg group relative transition-all duration-300 ${
                        active ? 'nav-item-active' : ''
                      }`}
                      style={{
                        color: active ? '#f0f6fc' : '#c8d1d9',
                        minWidth: '60px'
                      }}
                    >
                      <Icon 
                        size={18} 
                        className="group-hover:scale-110 transition-transform duration-200" 
                        style={{ color: active ? '#9575cd' : '#c8d1d9' }}
                      />
                      <span 
                        className="text-xs font-medium" 
                        style={{ 
                          fontFamily: 'Space Grotesk, sans-serif',
                          color: active ? '#9575cd' : '#c8d1d9'
                        }}
                      >
                        {item.label.split(' ')[0]}
                      </span>
                      {active && (
                        <motion.div
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ backgroundColor: '#9575cd' }}
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <style jsx>{`
          .nav-item:hover {
            color: #f0f6fc !important;
            background-color: rgba(61, 68, 76, 0.25);
            box-shadow: 0 4px 12px rgba(240, 246, 252, 0.1);
            transform: translateY(-2px);
          }
          
          .nav-item:hover svg {
            color: #9575cd !important;
          }
          
          .nav-item:hover span {
            color: #9575cd !important;
          }
          
          .nav-item-active {
            background-color: rgba(149, 117, 205, 0.15);
            box-shadow: 0 4px 12px rgba(149, 117, 205, 0.2);
          }
          
          .nav-item::after {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%) translateY(-6px);
            width: 60%;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(149, 117, 205, 0.8), transparent);
            border-radius: 1px;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .nav-item:hover::after {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
            box-shadow: 0 0 8px rgba(149, 117, 205, 0.4);
          }
        `}</style>
      </motion.nav>

      {/* Spacer for bottom navigation */}
      <div className="h-20" />
    </>
  );
};

export default Navigation;
