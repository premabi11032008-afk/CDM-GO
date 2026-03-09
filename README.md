# DataNexus - Unified Data Retrieval System

A cohesive, modern frontend web application designed for browsing, querying, and visualizing data seamlessly across multiple databases like MySQL, MongoDB, Redis, and APIs.

## Features

- **Cozy Minimalistic UI**: Soft colors, light backgrounds, glassmorphism, and minimal cognitive load matching a sophisticated production dashboard.
- **Global Search**: Natural language query integration.
- **Query Editor**: Multi-tab SQL/NoSQL interface with mock AI assistance flow.
- **Smart Result Viewer**: Toggle seamlessly between tabular data, JSON raw formats, and React-Recharts visual bar-charts.
- **Production-ready layout**: Responsive Sidebar and Top Navbar setup.
- **State management**: Handled with Zustand.

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS v4 with custom `index.css` theme variables
- Zustand (State management)
- Recharts (Data visualization)
- Lucide React (Icons)
- clsx & tailwind-merge (Utility classes)

## Quick Start (Local Setup)

1. **Clone/Download** the repository.
2. Ensure you have Node.js installed (v18+ recommended).
3. Open your terminal in the project directory.

```bash
# Install all dependencies
npm install

# Start the Vite development server
npm run dev
```

4. The application will be running at `http://localhost:5173`. Open this URL in your browser.

## Customization

- To change the theme colors (e.g. the beige, muted greens, or chart metrics), modify the CSS variables in `src/index.css`.
- New UI components are built with a combination of standard Tailwind classes and modular `cn()` utility methods from `src/lib/utils.ts`.

## Folder Structure

```
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images/SVGs
│   ├── components/         # Reusable UI Parts
│   │   ├── GlobalSearch.tsx # Neural search bar area
│   │   ├── QueryEditor.tsx  # Code editor section
│   │   ├── ResultViewer.tsx # Table, json, chart views
│   │   └── Sidebar.tsx      # DB connectors & history
│   ├── lib/
│   │   └── utils.ts         # Utility methods (Tailwind cn)
│   ├── store/
│   │   └── useAppStore.ts   # Zustand app state hub
│   ├── App.tsx             # Main Layout Assembler
│   ├── index.css           # Global Tailwind & Custom Variable Theme
│   └── main.tsx            # React Entry
├── package.json
├── tailwind.config.ts      # (or handled entirely via vite v4 plugin)
├── tsconfig.json           # TS definitions
└── vite.config.ts          # Vite builders/aliases
```
