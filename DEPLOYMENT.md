# Swiss FabLabs - Static Site Migration

## Deployment Instructions

### Quick Setup for GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository: https://github.com/fablabs-ch/fablabsch
   - Navigate to Settings → Pages
   - Under "Build and deployment", set Source to **"GitHub Actions"**
   - Save the settings

2. **Custom Domain (Optional)**
   - If using a custom domain (e.g., fablabs.ch):
     - Add your domain in the "Custom domain" field
     - Create a CNAME file in `frontend/public/` with your domain
     - Configure DNS settings at your domain provider

3. **Deploy**
   - The site will automatically deploy when you push to the `main` branch
   - Check the "Actions" tab to monitor deployment progress
   - Site will be available at:
     - With custom domain: https://fablabs.ch
     - Without custom domain: https://fablabs-ch.github.io/fablabsch/

### Base Path Configuration

If deploying to a subpath (e.g., https://fablabs-ch.github.io/fablabsch/):

```bash
cd frontend
BASE_PATH=/fablabsch/ npm run build
```

Or set it in the GitHub Actions workflow by adding an environment variable.

## What's Deployed

The static site includes:
- **Map page** - Interactive map of all Swiss FabLabs
- **Labs page** - Grid view of all labs with logos
- **Machines page** - Capabilities matrix and detailed machine listings
- **Space pages** - Individual lab pages with details and machines
- **About page** - Information about the project

## Content Updates

To update content:

1. Edit YAML files in the `content/` directory
2. Commit and push changes to the `main` branch
3. GitHub Actions will automatically rebuild and redeploy

## Local Development

```bash
cd frontend
npm install
npm run dev  # Start development server
```

## Manual Build

```bash
cd frontend
npm run build  # Build for production
npm run serve  # Preview production build
```

## Site Statistics

- **26 FabLabs** in Switzerland
- **108 Machines** across all labs
- **62 Vendors** represented
- **100% Static** - No backend required
- **Zero API calls** - All data bundled at build time

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vuetify 3** - Material Design component library
- **Leaflet** - Interactive maps
- **Sharp** - Image optimization
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static hosting

## File Structure

```
frontend/
├── public/          # Static assets (images, data)
│   ├── data/        # Generated JSON files
│   └── img/         # Generated WebP images
├── src/
│   ├── pages/       # Vue page components
│   ├── components/  # Reusable components
│   ├── utils/       # Helper functions
│   └── main.js      # App entry point
├── scripts/
│   └── build-data.js  # YAML to JSON converter
└── vite.config.js   # Vite configuration

content/             # Source content (YAML)
├── spaces/          # FabLab definitions
└── machines/        # Machine definitions
```

## Support

For issues or questions:
- Open an issue on GitHub
- Check the MIGRATION.md file for technical details
- Review the README.md for contribution guidelines
