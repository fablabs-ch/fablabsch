# fablabsch
Community website for swiss fablabs: https://fablabs.ch

## Features
- Display a map of FabLabs
- List of machines available in FabLabs
- Individual pages for each FabLab with detailed information

## Contribution
Create issue or pull request for updates.

- To add a lab copy the content/spaces/_template.yml file
- To edit a lab update the content/spaces/fablab_[name].yml file (name must be lowercase without spaces)
- A lab logo must be a png, jpg or jpeg file at the same location with minimum size of 160x160px

- Machines are defined in the content/machines/[type]/[vendor]/[model].yml file
- Type used must be listed in the frontend/src/data/machine_types.yml file.

## Development

### Frontend
  Vue 3 + Vite application creating lab pages from [content](./content) folder

  Thumbnail generation and image conversion are handled during the build process

#### Quick Start

```bash
cd frontend
npm install
npm run build  # Build data from YAML and build the site
npm run dev    # Start development server
```

#### Build Process

The build process involves two steps:

1. **Data Building** (`node scripts/build-data.js`):
   - Reads YAML files from the `content` folder
   - Generates optimized WebP images for spaces and machines
   - Creates JSON data files in `public/data/`

2. **Site Building** (`vite build`):
   - Bundles the Vue 3 application
   - Outputs static files to `dist/`

### Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

To enable GitHub Pages:
1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. The workflow will automatically deploy on push to main


