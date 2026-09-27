# PROTON — Studio Portfolio

Production-ready dark portfolio landing page built with React + Vite + Tailwind CSS + TypeScript + GSAP + Framer Motion + hls.js

**Live sections:** Loading Screen (000→100 RAF counter), Floating Pill Navbar, HLS Hero Video, Bento Works Grid, Journal Pills, 300vh Parallax Playground, Stats, Contact with flipped video + GSAP marquee.

## How to view it

### 1. In Arena.ai (this sandbox)
The dev server is already running on `0.0.0.0:5173`. **Do NOT use `localhost:5173` on your own PC** — that's your local machine, not this cloud sandbox.

Look for the **LIVE PREVIEW** panel in Arena UI (usually top-right or under "Website" process). It will be a URL like:
```
https://5173-xxxxx.e2b.app
```
Click that. That's your site.

If you don't see it, restart:
```bash
npm run dev
```

### 2. On your own PC / laptop (Windows as in screenshot)
You tried `localhost:5173` and got `ERR_CONNECTION_REFUSED` because the code is in the cloud, not on your Windows machine. To run locally:

```bash
# 1. Clone
git clone https://github.com/Kingrrryt/protonyt-portfolio.git
cd protonyt-portfolio

# 2. Switch to this branch
git checkout arena/01a0e30d-protonyt-portfolio

# 3. Install
npm install

# 4. Run dev
npm run dev
# then open http://localhost:5173 in your browser (this WILL work locally)
```

Production build:
```bash
npm run build
npm run preview
# opens http://localhost:5173 with optimized files
```

### 3. Deploy anywhere (Vercel / Netlify / GitHub Pages)
This is a static Vite app. `dist/` folder after `npm run build` can be deployed.

Vercel one-click:
```bash
npm i -g vercel
vercel --prod
```

## Tech
- Vite 5, React 18, Tailwind 3
- GSAP ScrollTrigger for parallax pinning
- Framer Motion for loading words & role cycling
- hls.js for Mux HLS video with native fallback
- Forced dark mode, accent gradient #89AACC → #4E85BF

PR: https://github.com/Kingrrryt/protonyt-portfolio/pull/1
