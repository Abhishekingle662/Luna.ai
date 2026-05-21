'use client';

import { ExternalLink, Globe2, Orbit, Satellite } from 'lucide-react';

const nasaOptions = [
  {
    id: 'eyes-on-earth',
    title: 'Eyes on Earth',
    description: "Track satellites, Earth systems, and climate data in NASA's interactive viewer.",
    image: 'https://cdn.mos.cms.futurecdn.net/n3jFt7cqbddTJa3fKhPzja-1200-80.jpg',
    link: 'https://eyes.nasa.gov/apps/earth/',
    icon: Satellite,
  },
  {
    id: 'eyes-on-solar-system',
    title: 'Eyes on the Solar System',
    description: "Explore planets, moons, asteroids, comets, and spacecraft in NASA's 3D orrery.",
    image: 'https://cdn.arstechnica.net/wp-content/uploads/2023/07/GettyImages-460712793-scaled.jpg',
    link: 'https://eyes.nasa.gov/apps/orrery/',
    icon: Orbit,
  },
  {
    id: 'eyes-on-exoplanets',
    title: 'Eyes on Exoplanets',
    description: 'Browse confirmed worlds beyond our Sun and compare distant planetary systems.',
    image: 'https://time.com/wp-content/uploads/2015/11/exoplanets_by_jaysimons-d9dv6th-large.jpg',
    link: 'https://eyes.nasa.gov/apps/exo/',
    icon: Globe2,
  },
];

export default function NasaEyes() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {nasaOptions.map((option) => {
        const Icon = option.icon;

        return (
          <article key={option.id} className="space-card overflow-hidden">
            <div className="aspect-[16/10] overflow-hidden">
              <div
                aria-hidden="true"
                className="h-full w-full bg-cover bg-center transition duration-300 hover:scale-[1.03]"
                style={{ backgroundImage: `url(${option.image})` }}
              />
            </div>
            <div className="p-5">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                <Icon size={18} />
              </div>
              <h2 className="text-xl font-black text-white">{option.title}</h2>
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-[var(--space-muted)]">{option.description}</p>
              <a
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-100 hover:text-white"
              >
                Launch NASA app
                <ExternalLink size={15} />
              </a>
            </div>
          </article>
        );
      })}
    </section>
  );
}
