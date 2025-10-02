# Migration from Gridsome to Vite + Vue 3

## Overview
This document describes the migration from the old Gridsome-based frontend to a modern Vite + Vue 3 static site generator.

## What Changed

### Removed
- ❌ Gridsome and all related dependencies
- ❌ Backend API dependencies (Events and News pages)
- ❌ GraphQL data layer
- ❌ Twitter/Facebook feed integration
- ❌ Search functionality
- ❌ Space filter component (can be re-added if needed)

### Added
- ✅ Vite for fast builds and development
- ✅ Vue 3 with Composition API
- ✅ Vuetify 3 for UI components
- ✅ Direct YAML file processing during build
- ✅ GitHub Actions workflow for automated deployment
- ✅ GitHub Pages configuration

### Kept
- ✅ Map page - displaying all FabLabs on a map
- ✅ Labs page - grid of all FabLabs
- ✅ Machines page - capabilities table and machine listings
- ✅ Space detail pages - individual lab information
- ✅ YAML-based content management
- ✅ Image optimization (WebP format)

## Technical Details

### Build Process
The new build process is a two-step process:

1. **Data Generation** (`node scripts/build-data.js`)
   - Reads YAML files from `../content/`
   - Generates WebP images for spaces and machines
   - Creates JSON data files in `public/data/`
   
2. **Site Building** (`vite build`)
   - Bundles Vue 3 application
   - Outputs to `dist/` directory

### Data Flow
```
YAML files (content/) 
  → Build script (scripts/build-data.js)
  → JSON data (public/data/)
  → Vue components fetch at runtime
  → Static site (dist/)
```

### Key Files
- `vite.config.js` - Vite configuration
- `scripts/build-data.js` - YAML to JSON conversion
- `src/main.js` - App initialization with Vue Router
- `src/App.vue` - Main layout component
- `src/utils/dataLoader.js` - Data fetching utility

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Runs on http://localhost:5173 (or next available port)

### Build
```bash
npm run build
```
Outputs to `frontend/dist/`

### Preview Built Site
```bash
npm run preview
```

## Deployment

### GitHub Pages
The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Setup:**
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow in `.github/workflows/deploy-pages.yml` will handle deployment

### Manual Deployment
You can deploy the `dist/` folder to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Any web server

## Content Management

Content is managed through YAML files in the `content/` directory:

- **Spaces**: `content/spaces/[name].yml`
- **Machines**: `content/machines/[type]/[vendor]/[model].yml`

No changes to the content structure were made during migration.

## Future Enhancements

Potential additions that could be implemented:

1. **Events Page** - Could be re-added by reading from local YAML files instead of backend API
2. **Search** - Client-side search using the JSON data
3. **Filters** - Space filtering on map and machines pages
4. **RSS Feeds** - Generate static RSS feeds during build
5. **Markdown Pages** - Support for content pages from markdown files

## Breaking Changes

- Events and News pages are no longer available
- No real-time updates (site must be rebuilt to show new content)
- No backend integration

## Performance Improvements

- Faster build times with Vite (vs Gridsome)
- Smaller bundle size (only necessary dependencies)
- Better development experience with HMR
- Optimized images (WebP format)
