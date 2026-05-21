'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, FlaskConical, Sigma } from 'lucide-react';
import { physicsTopics } from '../../data/spaceContent';

export default function MathPhysicsPage() {
  const [selectedTopic, setSelectedTopic] = useState(physicsTopics[0]);

  return (
    <main className="luna-page pb-28 pt-20 md:pb-12 md:pt-24">
      <section className="luna-container">
        <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--space-muted)] hover:text-white">
          <ArrowLeft size={16} />
          Learn
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <Sigma size={15} />
              Math and Physics
            </div>
            <h1 className="mt-4 text-balance text-4xl font-black leading-tight text-white sm:text-5xl">
              Turn cosmic ideas into equations you can reason through.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--space-muted)]">
              Each module keeps the formula visible, then connects it to an actual space-science use case.
            </p>

            <div className="mt-8 grid gap-3">
              {physicsTopics.map((topic) => {
                const active = selectedTopic.id === topic.id;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={[
                      'space-card p-4 text-left',
                      active ? 'border-cyan-300/40 bg-cyan-300/10' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span>
                        <span className="space-chip">{topic.tag}</span>
                        <span className="mt-3 block text-lg font-black text-white">{topic.title}</span>
                      </span>
                      <ArrowRight size={17} className="mt-2 text-[var(--space-muted)]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <article className="space-panel p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="space-chip">
                <FlaskConical size={14} />
                {selectedTopic.tag}
              </span>
              <span className="space-chip">Concept card</span>
            </div>

            <h2 className="mt-5 text-3xl font-black text-white">{selectedTopic.title}</h2>
            <p className="mt-3 text-base leading-7 text-[var(--space-muted)]">{selectedTopic.description}</p>

            <div className="mt-6 rounded-lg border border-amber-300/25 bg-amber-300/10 p-5">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">Core equation</div>
              <div className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xl font-bold text-white">
                {selectedTopic.equation}
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {selectedTopic.checkpoints.map((checkpoint) => (
                <div key={checkpoint} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <CheckCircle2 size={18} className="mt-0.5 flex-none text-emerald-200" />
                  <p className="text-sm leading-6 text-[var(--space-muted)]">{checkpoint}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={`/chat?topic=${selectedTopic.id}`} className="space-button">
                Ask Luna
                <Bot size={17} />
              </Link>
              <Link href="/games" className="space-button-secondary">
                Open labs
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
