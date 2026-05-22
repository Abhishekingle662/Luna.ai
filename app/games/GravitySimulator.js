'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Gauge,
  MousePointer2,
  Orbit,
  Pause,
  Play,
  Rocket,
  RotateCcw,
  Target,
  Trash2,
} from 'lucide-react';

const WORLD_WIDTH = 900;
const WORLD_HEIGHT = 560;
const BASE_G = 0.047;
const SOFTENING = 32;
const MAX_TRAIL_POINTS = 760;
const PROBE_COLORS = ['#62d8ff', '#ffd166', '#78e0b1', '#ff7aa8', '#a78bfa'];

const presets = [
  {
    id: 'earth-orbit',
    title: 'Earth Orbit',
    subtitle: 'A spacecraft with enough sideways velocity keeps falling around Earth.',
    lesson: 'Stable orbit is a balance between gravity pulling inward and velocity carrying the craft sideways.',
    focusId: 'station',
    gravityScale: 1,
    timeScale: 1,
    rings: [
      { radius: 190, label: 'low orbit' },
      { radius: 280, label: 'higher orbit' },
    ],
    bodies: [
      {
        id: 'earth',
        name: 'Earth',
        role: 'Primary body',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 8000,
        radius: 34,
        color: '#4aa3ff',
        fixed: true,
        glow: 24,
      },
      {
        id: 'station',
        name: 'Orbiter',
        role: 'Spacecraft',
        x: 0,
        y: -190,
        vx: 1.42,
        vy: 0,
        mass: 3,
        radius: 6,
        color: '#ffd166',
        trail: true,
      },
    ],
  },
  {
    id: 'transfer',
    title: 'Transfer Burn',
    subtitle: 'A faster spacecraft stretches its path toward a higher orbit.',
    lesson: 'Adding velocity at low altitude raises the opposite side of the orbit before the craft circularizes.',
    focusId: 'transfer-craft',
    gravityScale: 1,
    timeScale: 0.85,
    rings: [
      { radius: 145, label: 'parking orbit' },
      { radius: 310, label: 'target orbit' },
    ],
    bodies: [
      {
        id: 'earth',
        name: 'Earth',
        role: 'Primary body',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 8300,
        radius: 34,
        color: '#4aa3ff',
        fixed: true,
        glow: 24,
      },
      {
        id: 'transfer-craft',
        name: 'Transfer craft',
        role: 'Spacecraft',
        x: 0,
        y: -145,
        vx: 1.85,
        vy: 0,
        mass: 2,
        radius: 6,
        color: '#78e0b1',
        trail: true,
      },
    ],
  },
  {
    id: 'binary-star',
    title: 'Binary Stars',
    subtitle: 'Two stars orbit the shared center of mass while a probe threads the system.',
    lesson: 'When two massive bodies move, the stable path is around the system barycenter, not one fixed point.',
    focusId: 'probe',
    gravityScale: 1,
    timeScale: 0.75,
    rings: [{ radius: 118, label: 'barycenter path' }],
    bodies: [
      {
        id: 'star-a',
        name: 'Star A',
        role: 'Star',
        x: -118,
        y: 0,
        vx: 0,
        vy: -0.72,
        mass: 3600,
        radius: 20,
        color: '#ffd166',
        trail: true,
        glow: 36,
      },
      {
        id: 'star-b',
        name: 'Star B',
        role: 'Star',
        x: 118,
        y: 0,
        vx: 0,
        vy: 0.72,
        mass: 3600,
        radius: 20,
        color: '#ff7aa8',
        trail: true,
        glow: 36,
      },
      {
        id: 'probe',
        name: 'Survey probe',
        role: 'Spacecraft',
        x: 0,
        y: -235,
        vx: 1.22,
        vy: 0,
        mass: 1,
        radius: 5,
        color: '#62d8ff',
        trail: true,
      },
    ],
  },
  {
    id: 'slingshot',
    title: 'Gravity Assist',
    subtitle: 'A probe bends past a massive planet and leaves with a new direction.',
    lesson: 'A flyby changes the probe velocity relative to the Sun by exchanging momentum with the planet.',
    focusId: 'flyby-probe',
    gravityScale: 0.92,
    timeScale: 0.9,
    rings: [
      { radius: 235, label: 'planet orbit' },
      { radius: 340, label: 'escape corridor' },
    ],
    bodies: [
      {
        id: 'sun',
        name: 'Sun',
        role: 'Star',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 11200,
        radius: 30,
        color: '#ffd166',
        fixed: true,
        glow: 40,
      },
      {
        id: 'jupiter',
        name: 'Giant planet',
        role: 'Planet',
        x: 235,
        y: 0,
        vx: 0,
        vy: 1.5,
        mass: 700,
        radius: 17,
        color: '#d9a066',
        trail: true,
        glow: 15,
      },
      {
        id: 'flyby-probe',
        name: 'Flyby probe',
        role: 'Spacecraft',
        x: -315,
        y: -95,
        vx: 1.86,
        vy: 0.25,
        mass: 1,
        radius: 5,
        color: '#62d8ff',
        trail: true,
      },
    ],
  },
];

function cloneBodies(bodies) {
  return bodies.map((body) => ({ ...body }));
}

function buildTrailMap(bodies) {
  const map = new Map();
  bodies.forEach((body) => {
    if (body.trail) {
      map.set(body.id, [{ x: body.x, y: body.y }]);
    }
  });
  return map;
}

function computeAccelerations(bodies, gravityScale) {
  return bodies.map((body, index) => {
    if (body.fixed) {
      return { ax: 0, ay: 0 };
    }

    let ax = 0;
    let ay = 0;

    for (let otherIndex = 0; otherIndex < bodies.length; otherIndex += 1) {
      if (index === otherIndex) {
        continue;
      }

      const other = bodies[otherIndex];
      const dx = other.x - body.x;
      const dy = other.y - body.y;
      const distanceSquared = dx * dx + dy * dy + SOFTENING * SOFTENING;
      const distance = Math.sqrt(distanceSquared);
      const pull = (BASE_G * gravityScale * other.mass) / distanceSquared;

      ax += (pull * dx) / distance;
      ay += (pull * dy) / distance;
    }

    return { ax, ay };
  });
}

function advanceBodies(bodies, gravityScale, dt) {
  const accelerations = computeAccelerations(bodies, gravityScale);

  bodies.forEach((body, index) => {
    if (body.fixed) {
      return;
    }

    body.vx += accelerations[index].ax * dt;
    body.vy += accelerations[index].ay * dt;
    body.x += body.vx * dt;
    body.y += body.vy * dt;
  });
}

function getPrimaryBody(bodies) {
  return bodies.reduce((largest, body) => (body.mass > largest.mass ? body : largest), bodies[0]);
}

function getBodyTelemetry(body, bodies, gravityScale) {
  if (!body || bodies.length === 0) {
    return null;
  }

  const primary = getPrimaryBody(bodies);
  const dx = body.x - primary.x;
  const dy = body.y - primary.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
  const mu = BASE_G * gravityScale * primary.mass;
  const energy = primary.id === body.id || distance < 1 ? 0 : 0.5 * speed * speed - mu / distance;

  let state = 'Primary';
  if (primary.id !== body.id) {
    if (energy > 0.02) {
      state = 'Escape';
    } else if (energy > -0.012) {
      state = 'High-energy';
    } else {
      state = 'Bound orbit';
    }
  }

  return {
    name: body.name,
    role: body.role,
    speed,
    distance,
    energy,
    state,
    bodyCount: bodies.length,
  };
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return '0.00';
  }

  return value.toFixed(digits);
}

export default function GravitySimulator() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(0);
  const lastTelemetryRef = useRef(0);
  const launchDraftRef = useRef(null);
  const selectedIdRef = useRef(presets[0].focusId);
  const probeCountRef = useRef(0);
  const paramsRef = useRef({
    isRunning: false,
    gravityScale: presets[0].gravityScale,
    timeScale: presets[0].timeScale,
    showTrails: true,
    showVectors: true,
    activeTool: 'inspect',
  });
  const simRef = useRef({
    presetId: presets[0].id,
    bodies: cloneBodies(presets[0].bodies),
    trails: buildTrailMap(presets[0].bodies),
    rings: presets[0].rings,
  });

  const [activePreset, setActivePreset] = useState(presets[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [gravityScale, setGravityScale] = useState(presets[0].gravityScale);
  const [timeScale, setTimeScale] = useState(presets[0].timeScale);
  const [showTrails, setShowTrails] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [activeTool, setActiveTool] = useState('inspect');
  const [selectedId, setSelectedId] = useState(presets[0].focusId);
  const [telemetry, setTelemetry] = useState(() =>
    getBodyTelemetry(presets[0].bodies.find((body) => body.id === presets[0].focusId), presets[0].bodies, presets[0].gravityScale),
  );

  const preset = useMemo(
    () => presets.find((item) => item.id === activePreset) ?? presets[0],
    [activePreset],
  );

  useEffect(() => {
    paramsRef.current = {
      isRunning,
      gravityScale,
      timeScale,
      showTrails,
      showVectors,
      activeTool,
    };
  }, [activeTool, gravityScale, isRunning, showTrails, showVectors, timeScale]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;

    if (!canvas || !wrap) {
      return null;
    }

    const rect = wrap.getBoundingClientRect();
    const cssWidth = Math.max(320, rect.width);
    const cssHeight = Math.max(420, Math.min(620, cssWidth * 0.62));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const nextWidth = Math.floor(cssWidth * dpr);
    const nextHeight = Math.floor(cssHeight * dpr);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    return { cssWidth, cssHeight, dpr };
  }, []);

  const getView = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { cssWidth: 900, cssHeight: 560, scale: 1 };
    }

    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width || 900;
    const cssHeight = rect.height || 560;
    const scale = Math.min(cssWidth / WORLD_WIDTH, cssHeight / WORLD_HEIGHT);

    return { cssWidth, cssHeight, scale };
  }, []);

  const worldToScreen = useCallback((point, view) => {
    return {
      x: view.cssWidth / 2 + point.x * view.scale,
      y: view.cssHeight / 2 + point.y * view.scale,
    };
  }, []);

  const screenToWorld = useCallback(
    (event) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const view = getView();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      return {
        x: (x - view.cssWidth / 2) / view.scale,
        y: (y - view.cssHeight / 2) / view.scale,
      };
    },
    [getView],
  );

  const drawArrow = useCallback((ctx, start, end, color, width = 2) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < 4) {
      return;
    }

    const angle = Math.atan2(dy, dx);
    const headLength = Math.min(12, Math.max(7, length * 0.22));

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.88;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle - Math.PI / 7),
      end.y - headLength * Math.sin(angle - Math.PI / 7),
    );
    ctx.lineTo(
      end.x - headLength * Math.cos(angle + Math.PI / 7),
      end.y - headLength * Math.sin(angle + Math.PI / 7),
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const size = resizeCanvas();
    if (!size) {
      return;
    }

    const { cssWidth, cssHeight, dpr } = size;
    const ctx = canvas.getContext('2d');
    const view = {
      cssWidth,
      cssHeight,
      scale: Math.min(cssWidth / WORLD_WIDTH, cssHeight / WORLD_HEIGHT),
    };
    const { bodies, trails, rings } = simRef.current;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const background = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
    background.addColorStop(0, '#060914');
    background.addColorStop(0.52, '#0c1320');
    background.addColorStop(1, '#05070d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = '#ffffff';
    for (let index = 0; index < 140; index += 1) {
      const x = (index * 73) % cssWidth;
      const y = (index * 151) % cssHeight;
      const radius = index % 9 === 0 ? 1.4 : 0.75;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(214, 226, 255, 0.08)';
    ctx.lineWidth = 1;
    const grid = 64 * view.scale;
    for (let x = (cssWidth / 2) % grid; x < cssWidth; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssHeight);
      ctx.stroke();
    }
    for (let y = (cssHeight / 2) % grid; y < cssHeight; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssWidth, y);
      ctx.stroke();
    }
    ctx.restore();

    const center = worldToScreen({ x: 0, y: 0 }, view);

    rings.forEach((ring) => {
      ctx.save();
      ctx.strokeStyle = ring.radius > 250 ? 'rgba(120, 224, 177, 0.22)' : 'rgba(98, 216, 255, 0.22)';
      ctx.setLineDash([8, 10]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(center.x, center.y, ring.radius * view.scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(243, 247, 255, 0.55)';
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.fillText(ring.label, center.x + ring.radius * view.scale + 8, center.y - 8);
      ctx.restore();
    });

    if (paramsRef.current.showTrails) {
      trails.forEach((trail, id) => {
        const body = bodies.find((item) => item.id === id);
        if (!body || trail.length < 2) {
          return;
        }

        ctx.save();
        ctx.strokeStyle = body.color;
        ctx.lineWidth = body.radius > 10 ? 1.2 : 1;
        ctx.globalAlpha = body.radius > 10 ? 0.32 : 0.48;
        ctx.beginPath();
        trail.forEach((point, index) => {
          const screen = worldToScreen(point, view);
          if (index === 0) {
            ctx.moveTo(screen.x, screen.y);
          } else {
            ctx.lineTo(screen.x, screen.y);
          }
        });
        ctx.stroke();
        ctx.restore();
      });
    }

    bodies.forEach((body) => {
      const screen = worldToScreen(body, view);
      const radius = Math.max(4, body.radius * view.scale);
      const glow = (body.glow ?? 12) * view.scale;
      const selected = selectedIdRef.current === body.id;

      ctx.save();
      const halo = ctx.createRadialGradient(screen.x, screen.y, radius * 0.2, screen.x, screen.y, radius + glow);
      halo.addColorStop(0, `${body.color}aa`);
      halo.addColorStop(1, `${body.color}00`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + glow, 0, Math.PI * 2);
      ctx.fill();

      const bodyGradient = ctx.createRadialGradient(
        screen.x - radius * 0.32,
        screen.y - radius * 0.38,
        radius * 0.2,
        screen.x,
        screen.y,
        radius,
      );
      bodyGradient.addColorStop(0, '#ffffff');
      bodyGradient.addColorStop(0.2, body.color);
      bodyGradient.addColorStop(1, '#101827');
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = selected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = selected ? 2.2 : 1;
      ctx.stroke();

      if (paramsRef.current.showVectors && !body.fixed) {
        const velocityEnd = {
          x: screen.x + body.vx * 34 * view.scale,
          y: screen.y + body.vy * 34 * view.scale,
        };
        drawArrow(ctx, screen, velocityEnd, body.color, 1.7);
      }

      ctx.fillStyle = selected ? '#ffffff' : 'rgba(243, 247, 255, 0.72)';
      ctx.font = selected ? '800 12px Inter, system-ui, sans-serif' : '700 11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(body.name, screen.x, screen.y - radius - 10);
      ctx.restore();
    });

    const draft = launchDraftRef.current;
    if (draft) {
      const start = worldToScreen(draft.origin, view);
      const end = worldToScreen(draft.current, view);
      ctx.save();
      ctx.fillStyle = 'rgba(98, 216, 255, 0.24)';
      ctx.strokeStyle = 'rgba(98, 216, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(start.x, start.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      drawArrow(ctx, start, end, '#62d8ff', 2.4);
      ctx.restore();
    }
  }, [drawArrow, resizeCanvas, worldToScreen]);

  const resetPreset = useCallback(
    (presetId = activePreset) => {
      const nextPreset = presets.find((item) => item.id === presetId) ?? presets[0];
      const bodies = cloneBodies(nextPreset.bodies);

      simRef.current = {
        presetId,
        bodies,
        trails: buildTrailMap(bodies),
        rings: nextPreset.rings,
      };
      launchDraftRef.current = null;
      selectedIdRef.current = nextPreset.focusId;
      setSelectedId(nextPreset.focusId);
      setTelemetry(getBodyTelemetry(bodies.find((body) => body.id === nextPreset.focusId), bodies, paramsRef.current.gravityScale));
      drawScene();
    },
    [activePreset, drawScene],
  );

  const loadPreset = useCallback(
    (presetId) => {
      const nextPreset = presets.find((item) => item.id === presetId) ?? presets[0];
      setActivePreset(presetId);
      setIsRunning(false);
      setGravityScale(nextPreset.gravityScale);
      setTimeScale(nextPreset.timeScale);

      const bodies = cloneBodies(nextPreset.bodies);
      simRef.current = {
        presetId,
        bodies,
        trails: buildTrailMap(bodies),
        rings: nextPreset.rings,
      };
      launchDraftRef.current = null;
      selectedIdRef.current = nextPreset.focusId;
      setSelectedId(nextPreset.focusId);
      setTelemetry(getBodyTelemetry(bodies.find((body) => body.id === nextPreset.focusId), bodies, nextPreset.gravityScale));
      requestAnimationFrame(drawScene);
    },
    [drawScene],
  );

  const clearProbes = useCallback(() => {
    const sim = simRef.current;
    sim.bodies = sim.bodies.filter((body) => !body.id.startsWith('probe-custom'));
    sim.trails = buildTrailMap(sim.bodies);

    if (!sim.bodies.some((body) => body.id === selectedIdRef.current)) {
      const fallback = presets.find((item) => item.id === sim.presetId)?.focusId ?? sim.bodies[0]?.id;
      selectedIdRef.current = fallback;
      setSelectedId(fallback);
    }

    drawScene();
  }, [drawScene]);

  const recordTrails = useCallback(() => {
    const { bodies, trails } = simRef.current;

    bodies.forEach((body) => {
      if (!body.trail) {
        return;
      }

      if (!trails.has(body.id)) {
        trails.set(body.id, []);
      }

      const trail = trails.get(body.id);
      trail.push({ x: body.x, y: body.y });

      if (trail.length > MAX_TRAIL_POINTS) {
        trail.splice(0, trail.length - MAX_TRAIL_POINTS);
      }
    });
  }, []);

  useEffect(() => {
    drawScene();

    const observer = new ResizeObserver(() => drawScene());
    if (wrapRef.current) {
      observer.observe(wrapRef.current);
    }

    return () => observer.disconnect();
  }, [drawScene]);

  useEffect(() => {
    function tick(timestamp) {
      const delta = Math.min(32, timestamp - (lastFrameRef.current || timestamp));
      lastFrameRef.current = timestamp;
      const params = paramsRef.current;

      if (params.isRunning) {
        const steps = Math.max(1, Math.ceil(params.timeScale * 3));
        const dt = (0.78 * params.timeScale * (delta / 16.67)) / steps;

        for (let index = 0; index < steps; index += 1) {
          advanceBodies(simRef.current.bodies, params.gravityScale, dt);
          recordTrails();
        }
      }

      drawScene();

      if (timestamp - lastTelemetryRef.current > 140) {
        lastTelemetryRef.current = timestamp;
        const body = simRef.current.bodies.find((item) => item.id === selectedIdRef.current) ?? simRef.current.bodies[0];
        setTelemetry(getBodyTelemetry(body, simRef.current.bodies, params.gravityScale));
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [drawScene, recordTrails]);

  const handlePointerDown = useCallback(
    (event) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const point = screenToWorld(event);

      if (paramsRef.current.activeTool === 'launch') {
        launchDraftRef.current = { origin: point, current: point };
        canvas.setPointerCapture(event.pointerId);
        drawScene();
        return;
      }

      const view = getView();
      const bodies = simRef.current.bodies;
      const hit = bodies
        .map((body) => {
          const screen = worldToScreen(body, view);
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const distance = Math.hypot(screen.x - x, screen.y - y);
          return { body, distance };
        })
        .filter(({ body, distance }) => distance <= Math.max(16, body.radius * view.scale + 8))
        .sort((a, b) => a.distance - b.distance)[0];

      if (hit) {
        selectedIdRef.current = hit.body.id;
        setSelectedId(hit.body.id);
        setTelemetry(getBodyTelemetry(hit.body, bodies, paramsRef.current.gravityScale));
      }
    },
    [drawScene, getView, screenToWorld, worldToScreen],
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!launchDraftRef.current) {
        return;
      }

      launchDraftRef.current.current = screenToWorld(event);
      drawScene();
    },
    [drawScene, screenToWorld],
  );

  const handlePointerUp = useCallback(
    (event) => {
      const draft = launchDraftRef.current;
      if (!draft) {
        return;
      }

      const current = screenToWorld(event);
      const dx = current.x - draft.origin.x;
      const dy = current.y - draft.origin.y;
      const distance = Math.hypot(dx, dy);

      launchDraftRef.current = null;

      if (distance > 10) {
        const color = PROBE_COLORS[probeCountRef.current % PROBE_COLORS.length];
        const id = `probe-custom-${probeCountRef.current}`;
        probeCountRef.current += 1;

        const probe = {
          id,
          name: `Probe ${probeCountRef.current}`,
          role: 'Custom spacecraft',
          x: draft.origin.x,
          y: draft.origin.y,
          vx: dx * 0.018,
          vy: dy * 0.018,
          mass: 1,
          radius: 5,
          color,
          trail: true,
        };

        simRef.current.bodies.push(probe);
        simRef.current.trails.set(id, [{ x: probe.x, y: probe.y }]);
        selectedIdRef.current = id;
        setSelectedId(id);
        setTelemetry(getBodyTelemetry(probe, simRef.current.bodies, paramsRef.current.gravityScale));
      }

      drawScene();
    },
    [drawScene, screenToWorld],
  );

  const customProbeCount = simRef.current.bodies.filter((body) => body.id.startsWith('probe-custom')).length;

  return (
    <div className="space-y-6">
      <motion.div
        className="space-panel overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="grid gap-0 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="border-b border-white/10 p-4 xl:border-b-0 xl:border-r">
            <div className="eyebrow flex items-center gap-2">
              <Orbit size={15} />
              Orbital mechanics
            </div>
            <h2 className="mt-3 text-2xl font-black leading-tight text-white">Mission Simulation Lab</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--space-muted)]">
              Launch probes, compare orbital presets, and watch velocity, distance, and energy update in real time.
            </p>

            <div className="mt-5 grid gap-2">
              {presets.map((item) => {
                const active = item.id === activePreset;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => loadPreset(item.id)}
                    className={[
                      'rounded-lg border p-3 text-left transition',
                      active
                        ? 'border-cyan-300/45 bg-cyan-300/10 text-white'
                        : 'border-white/10 bg-white/[0.035] text-[var(--space-muted)] hover:border-white/20 hover:bg-white/[0.06]',
                    ].join(' ')}
                  >
                    <span className="block text-sm font-black text-white">{item.title}</span>
                    <span className="mt-1 block text-xs leading-5">{item.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0 p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-white">{preset.title}</p>
                <p className="text-xs leading-5 text-[var(--space-muted)]">{preset.lesson}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTool('inspect')}
                  className={[
                    'grid h-10 w-10 place-items-center rounded-lg border transition',
                    activeTool === 'inspect'
                      ? 'border-cyan-300/50 bg-cyan-300/12 text-cyan-100'
                      : 'border-white/10 bg-white/[0.04] text-[var(--space-muted)] hover:text-white',
                  ].join(' ')}
                  title="Inspect bodies"
                  aria-label="Inspect bodies"
                >
                  <MousePointer2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('launch')}
                  className={[
                    'grid h-10 w-10 place-items-center rounded-lg border transition',
                    activeTool === 'launch'
                      ? 'border-amber-300/50 bg-amber-300/12 text-amber-100'
                      : 'border-white/10 bg-white/[0.04] text-[var(--space-muted)] hover:text-white',
                  ].join(' ')}
                  title="Launch a probe"
                  aria-label="Launch a probe"
                >
                  <Rocket size={18} />
                </button>
              </div>
            </div>

            <div
              ref={wrapRef}
              className="relative overflow-hidden rounded-lg border border-white/10 bg-black"
            >
              <canvas
                ref={canvasRef}
                className="block cursor-crosshair touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  launchDraftRef.current = null;
                  drawScene();
                }}
              />
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-emerald-300' : 'bg-rose-300'}`} />
                {isRunning ? 'Running' : 'Paused'}
              </div>
              <div className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg border border-white/10 bg-black/42 px-3 py-2 text-xs leading-5 text-[var(--space-muted)] backdrop-blur">
                {activeTool === 'launch'
                  ? 'Drag on the canvas to set a probe position and launch vector.'
                  : 'Click any body to inspect velocity, energy, and orbit state.'}
              </div>
            </div>
          </section>

          <aside className="border-t border-white/10 p-4 xl:col-span-2 xl:grid xl:grid-cols-[16rem_minmax(0,1fr)_18rem] xl:items-start xl:gap-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsRunning((value) => !value)}
                className="space-button col-span-2"
              >
                {isRunning ? <Pause size={17} /> : <Play size={17} />}
                {isRunning ? 'Pause' : 'Run'} lab
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  resetPreset();
                }}
                className="space-button-secondary"
              >
                <RotateCcw size={17} />
                Reset
              </button>
              <button
                type="button"
                onClick={clearProbes}
                className="space-button-secondary"
                disabled={customProbeCount === 0}
              >
                <Trash2 size={17} />
                Probes
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-[var(--space-muted)]">
                  <span className="flex items-center gap-2">
                    <Gauge size={14} />
                    Time scale
                  </span>
                  {formatNumber(timeScale, 2)}x
                </span>
                <input
                  className="range-control w-full"
                  type="range"
                  min="0.25"
                  max="2.5"
                  step="0.05"
                  value={timeScale}
                  onChange={(event) => setTimeScale(Number(event.target.value))}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-[var(--space-muted)]">
                  <span className="flex items-center gap-2">
                    <Activity size={14} />
                    Gravity
                  </span>
                  {formatNumber(gravityScale, 2)}x
                </span>
                <input
                  className="range-control w-full"
                  type="range"
                  min="0.45"
                  max="1.75"
                  step="0.05"
                  value={gravityScale}
                  onChange={(event) => setGravityScale(Number(event.target.value))}
                />
              </label>

              <div className="grid gap-2">
                <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white">
                  Trails
                  <input
                    type="checkbox"
                    checked={showTrails}
                    onChange={(event) => setShowTrails(event.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white">
                  Velocity vectors
                  <input
                    type="checkbox"
                    checked={showVectors}
                    onChange={(event) => setShowVectors(event.target.checked)}
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/8 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                <Target size={16} />
                Telemetry
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--space-dim)]">Selected</p>
                  <p className="font-black text-white">{telemetry?.name ?? 'None'}</p>
                  <p className="text-xs text-[var(--space-muted)]">{telemetry?.role ?? 'Click a body'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Metric label="Speed" value={formatNumber(telemetry?.speed ?? 0)} />
                  <Metric label="Distance" value={formatNumber(telemetry?.distance ?? 0, 0)} />
                  <Metric label="Energy" value={formatNumber(telemetry?.energy ?? 0, 3)} />
                  <Metric label="State" value={telemetry?.state ?? 'Idle'} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-2">
      <p className="text-[0.66rem] font-bold uppercase tracking-[0.11em] text-[var(--space-dim)]">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}
