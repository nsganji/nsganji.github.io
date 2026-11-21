# Naga Sai Nagendra Ganji | SDET Portfolio

Personal portfolio built with Hugo and selectively bundled PatternFly v6 CSS.

Repository name: `nsganji.github.io`

Production URL after deployment: <https://nsganji.github.io/>

## Local Development

Install Node.js 24 and Hugo 0.167.0, then run:

```bash
cd site
npm ci
hugo server --disableFastRender
```

Open <http://localhost:1313/>. Build with `hugo build --gc --minify`.
On Windows, the portable Hugo binary must be on PATH or invoked by its full path.

## Structure

- `site/`: Hugo templates, assets, data, and page layouts.
- `scripts/verify-pipeline.sh`: CSS, JavaScript, and font pipeline checks (requires Bash, rsync, Python 3, and Hugo).
- `.github/workflows/deploy.yml`: production build and GitHub Pages deployment.

## Deployment

1. Initialize Git in this directory and create the GitHub repository `nsganji/nsganji.github.io` with a `main` branch.
2. Push this directory's contents, including the npm lockfile, but not installed dependencies or generated output.
3. In repository Settings > Pages, select GitHub Actions as the publishing source.
4. The deployment workflow publishes on pushes to `main` affecting the site, scripts, or workflow; it can also be started manually.

The root URL requires the exact repository name `nsganji.github.io`. A different repository name normally adds a project-path suffix to the URL.

## Content Status

The portfolio includes profile, employment, awards, and peer recommendations.
