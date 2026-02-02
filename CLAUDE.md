# Project Overview

Academic portfolio website for James G. McHugh (theoretical physicist, University of Manchester / National Graphene Institute). Built on the al-folio Jekyll theme, deployed to GitHub Pages.

Research focus: 2D materials, twistronics, ferroelectricity, ML potentials, DFT/MD simulations.

Live site: https://jgmcm.github.io

## Tech Stack

- Jekyll 4.x (Ruby static site generator)
- Liquid templating
- SCSS/Bootstrap for styling (MDB 4.20)
- Google Fonts: Fraunces, Space Grotesk
- MathJax 3.2 for equations
- GitHub Actions for CI/CD
- Docker available for local dev

## Project Structure

```
_pages/        # Site pages (about, cv, publications, recruiting, teaching, books, blog, projects, etc.)
_posts/        # Blog posts (currently empty)
_projects/     # Research project descriptions (currently empty)
_books/        # Book reviews (book-review layout)
_news/         # Homepage news/announcements (4 current items)
_bibliography/ # Publications in BibTeX format (papers.bib)
_data/         # YAML data files (cv.yml, socials.yml, repositories.yml, coauthors.yml, venues.yml)
_layouts/      # Page templates (12 layouts including about, cv, bib, book-review, profiles, etc.)
_includes/     # Reusable Liquid components
_sass/         # SCSS stylesheets
assets/        # Static files (img/, css/, js/, fonts/, pdf/, json/, audio/, video/, jupyter/)
_config.yml    # Main Jekyll configuration
```

## Pages

- `about.md` - Homepage with profile, research focus cards, announcements, selected papers
- `publications.md` - Full bibliography with search
- `recruiting.md` - Dame Kathleen Ollerenshaw Fellowship and funded PhD positions
- `teaching.md` - Teaching page (placeholder, not yet populated)
- `books.md` - Bookshelf page
- `blog.md` - Blog with pagination (no posts yet)
- `projects.md` - Projects with category support (no projects yet)
- `repositories.md` - GitHub repositories page
- `profiles.md` - Lab members/people page (empty profiles list)
- `news.md` - News archive
- `dropdown.md` - Navigation dropdown (bookshelf + blog)
- `404.md` - Error page with auto-redirect to homepage

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

- `_config.yml` - Site settings, metadata, plugin config (27 plugins)
- `_pages/about.md` - Homepage content
- `_data/socials.yml` - Social links (email, Google Scholar active; others commented out)
- `_data/coauthors.yml` - Coauthor name mappings for bibliography
- `_bibliography/papers.bib` - Publications (9+ real entries, 2024-2026)

## Deployment

Automatic via GitHub Actions on push to main. Builds to `gh-pages` branch.

## Notes

- Jekyll Scholar plugin for bibliography (APA style, grouped by year descending)
- Publication badges: Altmetric, Dimensions, Google Scholar, Inspire HEP
- Supports light/dark theme toggle
- Masonry layout for projects
- Medium zoom for images
- Responsive WebP image generation via ImageMagick
- Images go in `assets/img/`
- Site icon: atom emoji
- Scholar config in `_config.yml` still references Einstein name (should be McHugh)
