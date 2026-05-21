'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, Gamepad2, Globe2, Orbit, Play, Rocket, Sparkles } from 'lucide-react';
import { homeMissions, missionStats } from './data/spaceContent';

const accentClasses = {
  cyan: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  amber: 'border-amber-300/25 bg-amber-300/10 text-amber-100',
  green: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
  rose: 'border-rose-300/25 bg-rose-300/10 text-rose-100',
};

const missionIcons = {
  'Ask Luna': Bot,
  'Explore Lessons': BookOpen,
  'Run Simulations': Gamepad2,
  'Open Globe': Globe2,
};

export default function LandingPage() {
  return (
    <main className="luna-page">
      <section className="relative min-h-[82svh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/assets/earth.mp4"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,13,0.86),rgba(7,8,13,0.52)_48%,rgba(7,8,13,0.78)),linear-gradient(180deg,rgba(7,8,13,0.35),rgba(7,8,13,0.94))]" />

        <header className="relative z-10 border-b border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="luna-container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="Luna.ai home">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
                <Orbit size={19} />
              </span>
              <span className="text-sm font-black tracking-wide text-white">Luna.ai</span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex" aria-label="Home navigation">
              <Link href="/learn" className="space-button-secondary h-10 min-h-10 px-3 text-sm">
                Learn
              </Link>
              <Link href="/games" className="space-button-secondary h-10 min-h-10 px-3 text-sm">
                Games
              </Link>
              <Link href="/globe" className="space-button-secondary h-10 min-h-10 px-3 text-sm">
                Globe
              </Link>
            </nav>
          </div>
        </header>

        <div className="luna-container relative z-10 grid min-h-[calc(82svh-4rem)] items-center gap-8 py-12 md:grid-cols-[1.04fr_0.96fr]">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="space-chip">
                <Sparkles size={14} />
                Interactive space learning
              </span>
              <span className="space-chip">
                <Rocket size={14} />
                Science-only AI guide
              </span>
            </div>

            <h1 className="text-balance text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Luna.ai
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--space-muted)] sm:text-xl">
              A cleaner, game-ready learning platform for asking science questions, exploring lessons, running space labs, and spinning through Earth in 3D.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/chat" className="space-button">
                Start with Luna
                <ArrowRight size={18} />
              </Link>
              <Link href="/games" className="space-button-secondary">
                Open the labs
                <Play size={17} />
              </Link>
            </div>
          </div>

          <div className="space-panel p-4">
            <div className="grid grid-cols-3 gap-2">
              {missionStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-xs font-semibold leading-tight text-[var(--space-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              {homeMissions.map((mission) => {
                const Icon = missionIcons[mission.title];

                return (
                  <Link
                    key={mission.title}
                    href={mission.href}
                    className={`group rounded-lg border p-4 transition hover:-translate-y-0.5 ${accentClasses[mission.accent]}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-lg border border-current/25 bg-black/20">
                        <Icon size={19} />
                      </span>
                      <span>
                        <span className="block font-black text-white">{mission.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--space-muted)]">{mission.description}</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="luna-section">
        <div className="luna-container">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Mission path', 'Move from a question into a lesson, then into a lab without changing context.'],
              ['Mobile first', 'Large touch targets, compact cards, and fixed navigation for quick sessions.'],
              ['Low-cost AI', 'The chat route keeps Luna focused on space and science with a low-cost model default.'],
            ].map(([title, text]) => (
              <div key={title} className="space-card p-5">
                <h2 className="text-xl font-black text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--space-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
