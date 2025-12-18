# OpenDS Simplified

A simple, self-hosted design system documentation tool built with Vue 3.

## Features

- **Single Vue Application**: Combines admin functionality and documentation
- **File-based Storage**: Design tokens and components stored as YAML/JSON files
- **SQLite Database**: Metadata and sync history in a single SQLite file
- **Basic Authentication**: Simple password-based admin authentication
- **Design Tool Integration**: Connect to Penpot or Figma
- **Static Deployment**: Deploy as a static site to any hosting platform

## Quick Start

### Development

1. **Clone and install dependencies:**
   ```bash
   cd simplified
    pnpm install
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Start development server:**
   ```bash
    pnpm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Production Build

1. **Build the application:**
   ```bash
    pnpm run build
   ```

2. **Preview the build:**
   ```bash
    pnpm run preview
   ```

3. **Deploy the `dist/` folder** to your preferred static hosting:
   - Vercel
   - Netlify  
   - Cloudflare Pages
   - GitHub Pages
   - Any static file server

## Project Structure

```
simplified/
├── src/
│   ├── app/                    # Main Vue application
│   │   ├── components/         # Reusable UI components
│   │   ├── layouts/            # App layouts
│   │   ├── pages/              # Route pages
│   │   │   ├── public/         # Public documentation pages
│   │   │   └── admin/          # Admin/protected pages
│   │   ├── router/             # Vue Router configuration
│   │   └── stores/             # Pinia stores (state management)
│   ├── docs/                   # Documentation system
│   ├── design-system/          # Design system core
│   └── api/                    # API and database services
├── public/                     # Static assets
├── design-system-data/         # Design system data (YAML/JSON)
├── data/                       # SQLite database (auto-created)
└── scripts/                    # Utility scripts
```

## Data Storage

### Design System Data (YAML/JSON files)
- **Tokens**: `design-system-data/tokens.yaml`
- **Components**: `design-system-data/components/*.yaml`
- **Config**: `design-system-data/config.yaml`

### Metadata (SQLite database)
- **Design files**: Connected Penpot/Figma files
- **Sync history**: Sync operations and status
- **API keys**: Plugin authentication keys

## Authentication

Admin authentication uses a simple password system:

1. Set `VITE_ADMIN_PASSWORD` in your environment variables
2. Default password in development: `"admin"`
3. In production, use a strong, unique password

## Environment Variables

See `.env.example` for all available variables. Key variables:

- `VITE_ADMIN_PASSWORD`: Admin password (required)
- `VITE_DATABASE_PATH`: Path to SQLite database file
- `VITE_PENPOT_API_URL`: Penpot API URL
- `VITE_FIGMA_API_TOKEN`: Figma personal access token

## Development

### Commands
- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run preview`: Preview production build
- `pnpm run typecheck`: TypeScript type checking
- `pnpm run lint`: ESLint code linting
- `pnpm run format`: Prettier code formatting

### Adding New Pages
1. Create Vue component in `src/app/pages/`
2. Add route in `src/app/router/index.ts`
3. Import component with lazy loading

### Adding New Components
1. Create Vue component in `src/app/components/`
2. Export from `src/app/components/index.ts`
3. Import where needed

## Deployment

### Static Hosting (Recommended)
1. Build the app: `pnpm run build`
2. Deploy the `dist/` folder to your static host
3. Set environment variables in your hosting platform

### Docker (Optional)
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Serverless/Edge Functions
For API functionality (sync operations, webhooks), deploy the `src/api/` functions to:
- Vercel Functions
- Cloudflare Workers
- AWS Lambda
- Netlify Functions

## Migration from Original OpenDS

Migration tools will be provided to convert:
- PostgreSQL data to SQLite + YAML files
- OAuth configurations to API tokens
- Complex deployment to simple static hosting

## License

MIT - See LICENSE file for details.