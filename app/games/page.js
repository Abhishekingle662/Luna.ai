'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Activity, Dices, Gamepad2 } from 'lucide-react';
import { gameTabs } from '../data/spaceContent';

const SpaceFactGenerator = dynamic(() => import('./SpaceFactGenerator'), {
  loading: () => <LabLoading />,
  ssr: false,
});

const GravitySimulator = dynamic(() => import('./GravitySimulator'), {
  loading: () => <LabLoading />,
  ssr: false,
});

const NasaEyes = dynamic(() => import('./NasaEyes'), {
  loading: () => <LabLoading />,
  ssr: false,
});

function LabLoading() {
  return (
    <div className="space-panel grid min-h-[340px] place-items-center p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-200/20 border-t-cyan-200" />
    </div>
  );
}

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState('facts');

  return (
    <main className="luna-page pb-28 pt-20 md:pb-12 md:pt-24">
      <section className="luna-container">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="self-start">
            <div className="eyebrow flex items-center gap-2">
              <Gamepad2 size={15} />
              Games and Labs
            </div>
            <h1 className="mt-4 text-balance text-4xl font-black leading-tight text-white sm:text-5xl">
              Play with the systems behind space science.
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--space-muted)]">
              Short interactive sections for fast learning loops: get a fact, test a motion idea, or open a NASA visualizer.
            </p>

            <div className="mt-7 grid gap-3">
              {gameTabs.map((tab) => {
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      'space-card p-4 text-left',
                      active ? 'border-cyan-300/40 bg-cyan-300/10' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-cyan-200">
                        {tab.id === 'facts' && <Dices size={18} />}
                        {tab.id === 'gravity' && <Activity size={18} />}
                        {tab.id === 'nasa' && <Gamepad2 size={18} />}
                      </span>
                      <span>
                        <span className="block font-black text-white">{tab.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--space-muted)]">{tab.description}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section>
            {activeTab === 'facts' && <SpaceFactGenerator />}
            {activeTab === 'gravity' && <GravitySimulator />}
            {activeTab === 'nasa' && <NasaEyes />}
          </section>
        </div>
      </section>
    </main>
  );
}
