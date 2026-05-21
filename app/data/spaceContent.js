export const missionStats = [
  { label: 'Learning paths', value: '4' },
  { label: 'Interactive labs', value: '3' },
  { label: 'Core topics', value: '12+' },
];

export const homeMissions = [
  {
    title: 'Ask Luna',
    description: 'A focused AI guide for space and science questions.',
    href: '/chat',
    accent: 'cyan',
  },
  {
    title: 'Explore Lessons',
    description: 'Short modules on planets, stars, black holes, missions, and cosmic scale.',
    href: '/learn',
    accent: 'amber',
  },
  {
    title: 'Run Simulations',
    description: 'Play with facts, gravity presets, and external NASA visualizations.',
    href: '/games',
    accent: 'green',
  },
  {
    title: 'Open Globe',
    description: 'Spin a textured Earth scene and tune the starfield experience.',
    href: '/globe',
    accent: 'rose',
  },
];

export const learningTopics = [
  {
    id: 'solar-system',
    title: 'Solar System',
    group: 'Fundamentals',
    level: 'Starter',
    duration: '8 min',
    image: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=900&q=80',
    description: 'Follow the Sun, rocky worlds, gas giants, moons, dwarf planets, and the scale between them.',
    keyIdeas: ['Planet families', 'Orbital distance', 'Moons and rings'],
  },
  {
    id: 'black-holes',
    title: 'Black Holes',
    group: 'Astrophysics',
    level: 'Intermediate',
    duration: '10 min',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80',
    description: 'Understand event horizons, accretion disks, gravitational lensing, and why escape velocity matters.',
    keyIdeas: ['Event horizon', 'Spacetime curvature', 'Accretion disks'],
  },
  {
    id: 'exoplanets',
    title: 'Exoplanets',
    group: 'Discovery',
    level: 'Starter',
    duration: '7 min',
    image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80',
    description: 'Learn how astronomers detect distant worlds with transits, wobble, and direct imaging.',
    keyIdeas: ['Transit method', 'Habitable zones', 'Star systems'],
  },
  {
    id: 'stars',
    title: 'Stars',
    group: 'Astrophysics',
    level: 'Starter',
    duration: '9 min',
    image: 'https://images.unsplash.com/photo-1539321908154-04927596764d?auto=format&fit=crop&w=900&q=80',
    description: 'Trace stellar birth, fusion, color, lifespan, supernovae, neutron stars, and stellar remnants.',
    keyIdeas: ['Fusion', 'Life cycles', 'Supernovae'],
  },
  {
    id: 'cosmology',
    title: 'Cosmology',
    group: 'Deep Space',
    level: 'Advanced',
    duration: '12 min',
    image: 'https://images.unsplash.com/photo-1532010940201-c31e6beacd39?auto=format&fit=crop&w=900&q=80',
    description: 'Connect the Big Bang, cosmic microwave background, dark matter, and expansion of the universe.',
    keyIdeas: ['Cosmic timeline', 'Dark matter', 'Expansion'],
  },
  {
    id: 'space-missions',
    title: 'Space Missions',
    group: 'Exploration',
    level: 'Starter',
    duration: '8 min',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    description: 'Compare robotic probes, crewed programs, space telescopes, rovers, and mission tradeoffs.',
    keyIdeas: ['Mission design', 'Rovers', 'Space telescopes'],
  },
];

export const physicsTopics = [
  {
    id: 'gravity',
    title: 'Gravity and Orbits',
    tag: 'Mechanics',
    equation: 'F = G(m1m2)/r^2',
    description: 'Mass curves motion. Use gravity to explain falling objects, satellite orbits, and mission paths.',
    checkpoints: ['Force depends on mass and distance', 'Stable orbit needs sideways velocity', 'Energy changes with altitude'],
  },
  {
    id: 'waves',
    title: 'Light and Waves',
    tag: 'Radiation',
    equation: 'v = f lambda',
    description: 'Light carries information across space through wavelength, frequency, spectra, and Doppler shifts.',
    checkpoints: ['No medium required for light', 'Redshift tracks motion and expansion', 'Spectra reveal composition'],
  },
  {
    id: 'relativity',
    title: 'Relativity',
    tag: 'Spacetime',
    equation: 'E = mc^2',
    description: 'High speeds and strong gravity change measurements of time, length, mass, and energy.',
    checkpoints: ['Light speed is the limit', 'Time dilation is measurable', 'Gravity bends spacetime'],
  },
  {
    id: 'quantum',
    title: 'Quantum Physics',
    tag: 'Particles',
    equation: 'Delta x Delta p >= hbar/2',
    description: 'Small-scale physics explains atoms, radiation, tunneling, fusion, and compact stellar objects.',
    checkpoints: ['Measurement affects state', 'Energy levels are discrete', 'Uncertainty is fundamental'],
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    tag: 'Energy',
    equation: 'P = sigma A T^4',
    description: 'Heat, radiation, pressure, and entropy shape stars, atmospheres, engines, and the universe.',
    checkpoints: ['Stars radiate by temperature', 'Entropy sets direction', 'Fusion converts mass to energy'],
  },
];

export const gameTabs = [
  {
    id: 'facts',
    title: 'Cosmic Facts',
    description: 'Collect fast science cards and use them as chat prompts.',
  },
  {
    id: 'gravity',
    title: 'Gravity Lab',
    description: 'Tune orbital presets and compare how mass, speed, and trails change the motion.',
  },
  {
    id: 'nasa',
    title: 'NASA Eyes',
    description: 'Jump into official NASA visualizers for Earth, the Solar System, and exoplanets.',
  },
];
