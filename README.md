# USTP CI/CD Tetris

Live demo: https://OGNylux.github.io/ustp-cicd-final/

Badges

- Build (push only):
  [![Build - push](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/build.yml/badge.svg?event=push)](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/build.yml)
- Test (push & PR):
  [![Test](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/test.yml/badge.svg)](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/test.yml)
- Publish (Pages):
  [![Publish](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/publish.yml/badge.svg)](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/publish.yml)
- Release:
  [![Release](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/release.yml/badge.svg)](https://github.com/OGNylux/ustp-cicd-final/actions/workflows/release.yml)
- Coverage:
[![Coverage](https://codecov.io/gh/OGNylux/ustp-cicd-final/branch/main/graph/badge.svg)](https://codecov.io/gh/OGNylux/ustp-cicd-final)


Developer guide

Prerequisites

- Node.js 20.x (the workflows use Node 20)
- npm (bundled with Node)

Install

```bash
npm ci
```

Local development

```bash
# start dev server
npm run dev

# open the app at the address Vite prints (usually http://localhost:5173)
```

Build and preview

```bash
# build for production
npm run build

# preview the production build locally
npm run preview
```

Tests and coverage

```bash
# run tests once
npm test

# run tests with coverage
npm run test:coverage
```

Create a GitHub Pages release (via tags)

- Create a tag and push it to trigger the `release` workflow which will build and publish a release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Notes

- The `build` badge is intentionally scoped to `push` events only (not pull requests).
- Workflow changes trigger code owner review if `.github/CODEOWNERS` is configured for your username/team.
- If you want the coverage badge enabled, enable Codecov (or another coverage service) and add the badge URL above.
