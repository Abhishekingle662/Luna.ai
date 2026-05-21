'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Bot, Clock, Gauge, Search, Sigma, Sparkles } from 'lucide-react';
import { learningTopics } from '../data/spaceContent';

const filters = ['All', 'Fundamentals', 'Astrophysics', 'Discovery', 'Deep Space', 'Exploration'];

export default function LearnPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState(learningTopics[0]);

  const visibleTopics = useMemo(() => {
    if (activeFilter === 'All') {
      return learningTopics;
    }

    return learningTopics.filter((topic) => topic.group === activeFilter);
  }, [activeFilter]);

  return (
    <main className="luna-page pb-28 pt-20 md:pb-12 md:pt-24">
      <section className="luna-container">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="self-start">
            <div className="eyebrow flex items-center gap-2">
              <BookOpen size={15} />
              Learn
            </div>
            <h1 className="mt-4 text-balance text-4xl font-black leading-tight text-white sm:text-5xl">
              Build a space science map one mission at a time.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--space-muted)]">
              Choose a topic, scan the key ideas, then jump into Luna with the topic already framed for a science-first explanation.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/learn/mathphysics" className="space-button">
                Math and physics
                <Sigma size={17} />
              </Link>
              <Link href="/chat" className="space-button-secondary">
                Ask Luna
                <Bot size={17} />
              </Link>
            </div>

            <div className="mt-8 space-panel p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Search size={16} className="text-cyan-200" />
                Mission filters
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={[
                      'rounded-full border px-3 py-2 text-sm font-bold transition',
                      activeFilter === filter
                        ? 'border-cyan-300/40 bg-cyan-300/10 text-white'
                        : 'border-white/10 bg-white/[0.04] text-[var(--space-muted)] hover:text-white',
                    ].join(' ')}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <article className="space-panel overflow-hidden">
            <div className="relative min-h-[230px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedTopic.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="space-chip">{selectedTopic.group}</span>
                  <span className="space-chip">
                    <Gauge size={13} />
                    {selectedTopic.level}
                  </span>
                  <span className="space-chip">
                    <Clock size={13} />
                    {selectedTopic.duration}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white">{selectedTopic.title}</h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-base leading-7 text-[var(--space-muted)]">{selectedTopic.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {selectedTopic.keyIdeas.map((idea) => (
                  <div key={idea} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <Sparkles size={16} className="mb-2 text-amber-200" />
                    <div className="text-sm font-bold text-white">{idea}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={`/chat?topic=${selectedTopic.id}`} className="space-button">
                  Ask about {selectedTopic.title}
                  <ArrowRight size={17} />
                </Link>
                <Link href="/games" className="space-button-secondary">
                  Try a lab
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="luna-container mt-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleTopics.map((topic) => {
            const active = selectedTopic.id === topic.id;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={[
                  'space-card group overflow-hidden text-left',
                  active ? 'border-cyan-300/40 bg-cyan-300/10' : '',
                ].join(' ')}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="h-full w-full bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url(${topic.image})` }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-cyan-200">{topic.group}</span>
                    <ArrowRight size={16} className="text-[var(--space-muted)]" />
                  </div>
                  <h3 className="mt-3 text-xl font-black text-white">{topic.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--space-muted)]">{topic.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="luna-container mt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--space-muted)] hover:text-white">
          <ArrowLeft size={16} />
          Home
        </Link>
      </section>
    </main>
  );
}
