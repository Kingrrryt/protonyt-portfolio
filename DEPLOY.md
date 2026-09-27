# Deploy Guide

## Option 1: GitHub Pages (already pushed)
I already pushed your production build to `gh-pages` branch.

1. Go to https://github.com/Kingrrryt/protonyt-portfolio/settings/pages
2. Under **Build and deployment** -> **Source** select **Deploy from a branch**
3. Select Branch: `gh-pages` / `/ (root)` -> Save
4. Wait 1-2 min, your site will be live at:
   **https://kingrrryt.github.io/protonyt-portfolio/**

## Option 2: Vercel One-Click (Recommended, fastest)
Click this link and hit Deploy (uses your Vercel account, no CLI needed):

https://vercel.com/new/clone?repository-url=https://github.com/Kingrrryt/protonyt-portfolio&project-name=proton-portfolio&repository-name=protonyt-portfolio&branch=arena/01a0e30d-protonyt-portfolio

Or:

https://vercel.com/new/clone?repository-url=https://github.com/Kingrrryt/protonyt-portfolio/tree/arena/01a0e30d-protonyt-portfolio

## Option 3: Netlify Drop
1. Run `npm run build` locally
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder -> instant link

## Local
```
git checkout arena/01a0e30d-protonyt-portfolio
npm install
npm run dev
# open http://localhost:5173
```
