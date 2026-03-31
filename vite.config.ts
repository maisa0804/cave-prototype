import { defineConfig } from 'vite'

// Use repository name as base path when building on GitHub Actions.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  base: repoName ? `/${repoName}/` : '/',
})
