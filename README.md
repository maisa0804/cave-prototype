# cave-prototype

Vite + TypeScript project managed with pnpm, ready for GitHub Pages deployment.

## Requirements

- Node.js `20.19+` (or `22.12+`)
- pnpm `10.x` (pinned via `packageManager`)

## Setup

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Deploy (GitHub Pages)

- Push to `main` branch.
- Enable **Settings > Pages > Source: GitHub Actions** in your repository.
- Workflow at `.github/workflows/deploy.yml` builds and deploys `dist/`.

`vite.config.ts` automatically sets the base path from `GITHUB_REPOSITORY` in CI.
