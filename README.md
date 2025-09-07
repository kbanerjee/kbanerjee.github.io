# Kalyan Banerjee — Resume-Driven Portfolio

A fast, accessible, animated single-page portfolio powered by Jekyll on GitHub Pages. Content is sourced from a single YAML file for easy maintenance.

Live URL: https://kbanerjee.github.io

## Overview

- Static site generator: Jekyll (built-in GitHub Pages support)
- One source of truth: `_data/resume.yml`
- Modern UI: light-blue palette, responsive, accessible, tasteful animations
- Client-side search filters content across sections and highlights matches
- SEO-optimized with `jekyll-seo-tag` and `jekyll-sitemap`

## Tech Stack

- HTML5, CSS3 (custom, CSS variables)
- JavaScript (vanilla, IntersectionObserver, keyboard a11y)
- Jekyll (Liquid templates, data files)
- Icons: Feather Icons
- Fonts: Montserrat (headings), Open Sans (body) via Google Fonts

## Repository Structure

- `_config.yml` — Jekyll configuration and site metadata
- `_layouts/`
  - `default.html` — Base document shell, header/nav/footer
  - `home.html` — Home (single-page) layout, renders sections from YAML
- `_data/`
  - `resume.yml` — All resume content (profile, skills, experience, education, certifications, publications, achievements)
- `assets/`
  - `css/style.css` — Design tokens, components, animations
  - `js/main.js` — UI interactions (nav, scroll-reveal, scroll spy, keyboard shortcuts)
  - `js/search.js` — Client-side search and highlighting
  - `img/` — Place headshot or logos here (optional)
- `index.html` — Front matter pointing to `layout: home`

## How to Update Content

1. Edit `_data/resume.yml`:
   - Update profile info, skills, experience achievements, education, certifications, publications, achievements.
   - The site will automatically render your changes when GitHub Pages rebuilds.
2. Optional:
   - Add `resume.pdf` to the repo root and enable the download button (see comment in `_layouts/home.html`).
   - Add images to `assets/img`.

Note: You may see an editor warning about JSON Resume schema for `_data/resume.yml`. This site uses a custom YAML shape, so those warnings can be ignored.

## Colors and Typography

- Primary: `#2B66B1`
- Accent: `#5FB0FF`
- Background: `#F5F9FF`
- Surface: `#FFFFFF`
- Text: `#1E2732`
- Headings: Montserrat; Body: Open Sans

Adjust tokens in `:root` inside `assets/css/style.css`.

## Animations and Accessibility

- Prefers reduced motion respected (animations minimized)
- Semantic landmarks and heading hierarchy
- Keyboard accessible navigation and search
- Visible focus styles and skip link
- Scroll-triggered reveal animations enhance UX without being distracting

## Search

- Search input in the top-right nav
- Filters cards and list items based on your query
- Highlights matches in text across sections
- Hotkeys:
  - `/` or `Cmd/Ctrl + K` to focus search
  - `Esc` to clear and blur

## Deployment (GitHub Pages)

- This repository is already structured for GitHub Pages.
- Ensure GitHub Pages is enabled for the `main` branch (Repository Settings → Pages).
- GitHub will build the site automatically using Jekyll.
- Plugins used (allowed by GitHub Pages):
  - `jekyll-seo-tag`
  - `jekyll-sitemap`

If using a custom domain:
- Add `CNAME` at repo root with your domain.
- Update DNS to point to GitHub Pages and verify TLS.

## Local Preview (optional)

If you want to run locally:
1. Install Ruby and Bundler.
2. `bundle init` and add `gem "github-pages", group: :jekyll_plugins` (or install `jekyll` + plugins individually).
3. `bundle install`
4. `bundle exec jekyll serve`
5. Open http://localhost:4000

Note: Local preview is optional since GitHub Pages builds automatically.

## Maintenance Tips

- Keep `_data/resume.yml` as your single source of truth.
- Use concise, achievement-focused bullets with measurable impact.
- Add links/DOIs for publications when available.
- Optimize any images you add (compress and size appropriately).

## License

Personal content © Kalyan Banerjee. Code portions can be reused with attribution.
