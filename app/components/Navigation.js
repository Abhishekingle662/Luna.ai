'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Bot, Gamepad2, Globe2, Home, Orbit, Sigma } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', shortLabel: 'Home', icon: Home },
  { href: '/chat', label: 'Luna Chat', shortLabel: 'Chat', icon: Bot },
  { href: '/learn', label: 'Learn', shortLabel: 'Learn', icon: BookOpen },
  { href: '/games', label: 'Games', shortLabel: 'Games', icon: Gamepad2 },
  { href: '/globe', label: 'Globe', shortLabel: 'Globe', icon: Globe2 },
  { href: '/learn/mathphysics', label: 'Physics', shortLabel: 'Physics', icon: Sigma },
];

function isActivePath(pathname, href) {
  if (href === '/') {
    return pathname === '/';
  }

  if (href === '/learn') {
    return pathname === '/learn';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 hidden border-b border-white/10 bg-[#080b12]/90 backdrop-blur-xl md:block">
        <div className="luna-container flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3" aria-label="Go to Luna.ai home">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
              <Orbit size={19} />
            </span>
            <span>
              <span className="block text-sm font-black tracking-wide text-white">Luna.ai</span>
              <span className="block text-[11px] font-semibold text-[var(--space-muted)]">Space learning lab</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Primary navigation">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition',
                    active
                      ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                      : 'border-transparent text-[var(--space-muted)] hover:border-white/10 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#080b12]/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
        aria-label="Primary navigation"
      >
        <div className="mx-auto grid max-w-xl grid-cols-6 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-lg border text-[11px] font-bold transition',
                  active
                    ? 'border-cyan-300/30 bg-cyan-300/10 text-white'
                    : 'border-transparent text-[var(--space-muted)] hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                <Icon size={18} />
                <span className="leading-none">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
