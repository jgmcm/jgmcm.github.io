# Project Overview

Academic portfolio website for James G. McHugh (theoretical physicist, University of Manchester). Built on the al-folio Jekyll theme, deployed to GitHub Pages.

Live site: https://jgmcm.github.io

## Tech Stack

- Jekyll 4.x (Ruby static site generator)
- Liquid templating
- SCSS/Bootstrap for styling
- GitHub Actions for CI/CD
- Docker available for local dev

## Project Structure

```
_pages/        # Main site pages (about, cv, blog, projects, publications, etc.)
_posts/        # Blog posts in markdown
_projects/     # Research project descriptions
_news/         # Homepage news items
_bibliography/ # Publications in BibTeX format
_data/         # YAML data files (cv.yml, socials.yml, repositories.yml)
_layouts/      # Page templates
_includes/     # Reusable components
_sass/         # SCSS stylesheets
assets/        # Static files (images, PDFs, JS, CSS)
_config.yml    # Main Jekyll configuration
```

## Local Development

Option 1 - Docker (recommended):
```
docker compose up
```
Site runs at http://localhost:8080

Option 2 - Native Ruby:
```
bundle install
bundle exec jekyll serve
```

## Key Files

- `_config.yml` - Site settings, metadata, plugin config
- `_pages/about.md` - Homepage content
- `_data/cv.yml` - CV data
- `_bibliography/papers.bib` - Publications

## Deployment

Automatic via GitHub Actions on push to main. Builds to `gh-pages` branch.

## Notes

- Uses MathJax for equations
- Jekyll Scholar plugin for bibliography management
- Supports light/dark theme
- Images go in `assets/img/`
