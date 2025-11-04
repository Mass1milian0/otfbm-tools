# OTFBM Tools

A modern web application for creating and managing [OTFBM](https://otfbm.io) (Online Tabletop Battle Map) links. Built with Nuxt 3, this tool provides an intuitive interface for configuring grid-based battle maps for tabletop RPGs like D&D, Pathfinder, and more.

## About OTFBM

OTFBM (otfbm.io) is a service that generates battle map images from simple URL parameters. This tool makes it easy to create and customize those URLs without manual encoding, and provides a visual preview of your maps.

## Features

- **🗺️ Map Configuration Tool:** Create OTFBM map URLs with an intuitive visual interface
- **⚙️ Customizable Grid Options:**
  - Adjustable grid size (width × height)
  - Custom background images via URL
  - Dark mode support
  - Grid transparency control (0-100%)
  - Adjustable zoom levels (0.1x - 3x)
  - Configurable cell size (20-100px)
  - Border opacity toggle
- **🎯 Pan & Zoom Controls:** Select specific map areas with visual pan selection
- **📤 Export Functionality:** Generate map commands ready for use in Discord bots or other integrations
- **📋 One-Click Copy:** Copy generated map links and commands to clipboard instantly
- **👁️ Live Preview:** Real-time preview of your map as you adjust settings

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/) (Vue 3)
- **UI Library:** [Nuxt UI](https://ui.nuxt.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Styling:** Tailwind CSS
- **Icons:** Iconify (Lucide & MDI)
- **Build Tool:** Vite
- **Runtime:** Node.js

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone https://github.com/Mass1milian0/otfbm-tools.git
cd otfbm-tools
```

2. Install dependencies:
```sh
npm install
```

3. Run the development server:
```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating a New Map

1. Click the **"Generate New"** button on the home page
2. Configure your map settings:
   - Set grid dimensions (width × height)
   - Add a background image URL (optional)
   - Toggle dark mode
   - Adjust advanced options (transparency, zoom, cell size)
3. Click **"Generate Map"** to view your map
4. Use the map viewer to fine-tune settings and preview changes

### Map Viewer Features

- **Zoom Level:** Adjust the preview zoom (visual only, doesn't affect exported map)
- **Cell Size:** Change the size of each grid cell in pixels
- **Grid Transparency:** Control how visible the grid lines are (0% = invisible)
- **Grid Size:** Dynamically adjust the number of rows and columns
- **Pan Selection:** Click "Start Pan" and drag to select a specific area of the map
- **Export:** Click "Export" to generate a command string for use with bots or integrations

### Exporting Maps

The export feature generates a command in this format:
```
!map -attach map -mapsize {width}x{height} -options {options} -mapbg {background_url}
```

This command format is compatible with Discord bots and other OTFBM integrations.

## Project Structure

```
otfbm-tools/
├── app/
│   ├── pages/
│   │   ├── index.vue      # Home page with map generator
│   │   └── map.vue        # Map viewer and editor
│   └── app.vue            # Root component
├── stores/
│   └── mapData.ts         # Pinia store for map state management
├── public/
│   └── styles/
│       └── main.css       # Global styles
├── nuxt.config.ts         # Nuxt configuration
└── package.json           # Project dependencies
```

## Building for Production

Build the application:
```sh
npm run build
```

Preview the production build:
```sh
npm run preview
```

Generate static site:
```sh
npm run generate
```

## Deployment

This application is configured to deploy to GitHub Pages with the base URL `/otfbm-tools/`. The base URL is automatically set based on the `NODE_ENV` environment variable.

For other deployment platforms, you may need to adjust the `baseURL` in `nuxt.config.ts`.

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Resources

- [OTFBM Official Site](https://otfbm.io) - The battle map service this tool is built for
- [Nuxt Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Nuxt UI Documentation](https://ui.nuxt.com/)

## Author

Created by M1S0 ([Mass1milian0](https://github.com/Mass1milian0))

## Acknowledgments

- [OTFBM](https://otfbm.io) for providing the excellent battle map service
- The Nuxt and Vue communities for their amazing frameworks and tools