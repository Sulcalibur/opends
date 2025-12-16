# OpenDS Penpot Plugin

Sync your Penpot design system to the OpenDS platform.

## Features

- **Design Token Sync**: Automatically extract colors, typographies, and components
- **Real-time Updates**: Sync changes as you design
- **API Integration**: Connect to your OpenDS instance
- **Secure Storage**: API keys stored locally in Penpot

## Installation

### Method 1: Direct Installation (Development)

1. **Build the plugin:**
   ```bash
   npm install
   npm run build
   ```

2. **Install in Penpot:**
   - Open Penpot
   - Go to Settings → Plugins
   - Click "Load unpacked plugin"
   - Select the `dist` folder
   - The plugin will appear in your plugins list

### Method 2: From GitHub (Production)

1. **Download the plugin:**
   ```bash
   git clone https://github.com/yourusername/opends-penpot-plugin
   cd opends-penpot-plugin
   ```

2. **Install as above**

## Configuration

1. **Start OpenDS backend:**
   ```bash
   cd ../backend
   pnpm dev
   ```

2. **Generate API key:**
   ```bash
   curl -X POST http://localhost:3001/api/plugin/api-keys
   ```

3. **Configure plugin in Penpot:**
   - Open the OpenDS plugin
   - Enter:
     - **OpenDS URL**: `http://localhost:3001`
     - **API Key**: (from step 2)
   - Click "Connect"

## Usage

1. **Open a design file** in Penpot
2. **Click the OpenDS plugin icon** in the plugins panel
3. **View design system stats** (colors, components count)
4. **Click "Sync to OpenDS"** to sync your design system
5. **Check OpenDS dashboard** at `http://localhost:3000`

## Development

### Project Structure
```
src/
  index.ts          # Main plugin logic
  types.ts          # Type definitions
dist/
  opends-plugin.js  # Built plugin
plugin.json         # Plugin manifest
package.json        # Dependencies
```

### Building
```bash
npm run build      # Build plugin
npm run dev        # Watch mode
```

### Testing
1. Start OpenDS backend
2. Load plugin in Penpot
3. Test connection and sync

## API Endpoints

The plugin communicates with OpenDS backend:

- `GET /api/plugin/health` - Health check
- `POST /api/plugin/sync` - Sync design system data
- `POST /api/plugin/api-keys` - Generate API keys

## Permissions

The plugin requires:
- `storage` - Save configuration
- `library.local` - Access design tokens
- `file.current` - Access current file

## Troubleshooting

**Plugin doesn't appear:**
- Check browser console for errors
- Verify `plugin.json` is valid
- Ensure Penpot version supports plugins

**Connection fails:**
- Check OpenDS backend is running
- Verify API key is correct
- Check CORS configuration

**Sync fails:**
- Check network connectivity
- Verify design file has tokens/components
- Check OpenDS backend logs

## License

MIT