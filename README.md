# Luna.ai

Luna.ai is an interactive space and science learning platform built with Next.js. The app combines a focused science-only AI guide with learning modules, simulations, games, and an interactive globe.

## Product Direction

- Science-first AI guide for space, astronomy, physics, and related STEM topics
- Gamified exploration across chat, learning, games, and globe sections
- Mobile-first UX for quick learning and interactive play
- Cleaner visual system built around Tailwind/custom components over time
- Low-cost OpenAI model defaults with environment-based overrides

## Current Sections

- `/` - cinematic landing page
- `/chat` - LUNA chat assistant for space and science questions
- `/learn` - topic-based space science academy
- `/learn/mathphysics` - math and physics learning modules
- `/games` - space facts, gravity simulator, and NASA visualization links
- `/globe` - interactive 3D Earth globe

## Setup

```bash
npm install
npm run dev
```

Create a local environment file with:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_CHAT_MODEL=gpt-5.4-nano
```

`OPENAI_CHAT_MODEL` is optional. The app defaults to `gpt-5.4-nano` for low-cost science chat responses.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
