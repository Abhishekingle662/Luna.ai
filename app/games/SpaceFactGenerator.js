'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, RefreshCcw, Sparkles } from 'lucide-react';

const spaceFacts = [
  {
    title: 'Solar Dominance',
    fact: 'The Sun contains about 99.86% of the mass in the Solar System.',
    category: 'Sun',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Venus Timing',
    fact: 'A day on Venus is longer than a Venus year because it rotates very slowly.',
    category: 'Planets',
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Moon Drift',
    fact: 'The Moon is moving away from Earth by roughly 3.8 centimeters per year.',
    category: 'Moon',
    image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Milky Way Scale',
    fact: 'The Milky Way is roughly 100,000 light-years across.',
    category: 'Galaxies',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Neutron Star Density',
    fact: 'A teaspoon of neutron star material would weigh billions of tons on Earth.',
    category: 'Stars',
    image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Blue Mars Sunsets',
    fact: 'Fine dust in the Martian atmosphere can make sunsets appear blue.',
    category: 'Mars',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421789f10?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Cold Welding',
    fact: 'Clean pieces of the same metal can bond in space when they touch in vacuum.',
    category: 'Spacecraft',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Cosmic Address',
    fact: 'Earth sits in the Solar System, inside the Orion Arm of the Milky Way, within the Local Group.',
    category: 'Cosmology',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
  },
];

export default function SpaceFactGenerator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seen, setSeen] = useState(1);

  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * spaceFacts.length));
  }, []);

  const currentFact = spaceFacts[currentIndex];
  const progress = useMemo(() => Math.min(100, Math.round((seen / spaceFacts.length) * 100)), [seen]);

  function nextFact() {
    setCurrentIndex((index) => {
      let next = index;
      while (next === index) {
        next = Math.floor(Math.random() * spaceFacts.length);
      }
      return next;
    });
    setSeen((value) => Math.min(spaceFacts.length, value + 1));
  }

  return (
    <article className="space-panel overflow-hidden">
      <div className="relative min-h-[260px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentFact.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/50 to-transparent" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
          <span className="space-chip">
            <Sparkles size={14} />
            {currentFact.category}
          </span>
          <span className="space-chip">{seen}/{spaceFacts.length}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h2 className="text-3xl font-black text-white">{currentFact.title}</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--space-muted)]">{currentFact.fact}</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-cyan-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={nextFact} className="space-button">
            New fact
            <RefreshCcw size={17} />
          </button>
          <Link href={`/chat?topic=${encodeURIComponent(currentFact.category.toLowerCase())}`} className="space-button-secondary">
            Ask Luna
            <Bot size={17} />
          </Link>
          <Link href="/learn" className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[var(--space-muted)] hover:text-white">
            Learn more
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
