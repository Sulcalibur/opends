# OpenDS Penpot Plugin - Testing Guide

## **Complete Testing Setup**

### **1. Prerequisites**

#### **Software Required:**
- Node.js 18+ and npm/pnpm
- Penpot account (free at https://penpot.app)
- Modern web browser (Chrome, Firefox, Safari)

#### **Files Required:**
```
opends-penpot-plugin/
├── public/
│   ├── manifest.json      # Plugin configuration
│   ├── plugin.js         # Plugin code
│   └── icon.png          # 56x56 icon (optional)
├── serve-plugin.js       # Local server
└── README.md            # Documentation
```

### **2. Start OpenDS Backend**

```bash
# Terminal 1 - Backend
cd /Users/sul/Dev/opends/backend
pnpm dev

# Wait for: "Server listening on 0.0.0.0:3001"
# API docs: http://localhost:3001/docs
```

### **3. Start Plugin Server**

```bash
# Terminal 2 - Plugin Server
cd /Users/sul/Dev/opends/opends-penpot-plugin
node serve-plugin.js

# Wait for: "Plugin server running at http://localhost:3002"
# Manifest: http://localhost:3002/manifest.json
```

### **4. Generate API Key**

```bash
# Terminal 3 - Generate API key
curl -X POST http://localhost:3001/api/plugin/api-keys

# Save the API key from response:
# {
#   "apiKey": "opends_xxxxxxxxxxxx",
#   "expiresAt": "...",
#   "message": "..."
# }
```

### **5. Install Plugin in Penpot**

#### **Method A: Keyboard Shortcut (Recommended)**
1. **Open Penpot** (https://penpot.app)
2. **Press `Ctrl+Alt+P`** (Windows/Linux) or `Cmd+Alt+P` (Mac)
3. **Enter URL**: `http://localhost:3002/manifest.json`
4. **Click "Install"**

#### **Method B: Plugin Manager**
1. **Open Penpot**
2. **Menu → Plugins → Plugin Manager**
3. **Enter URL**: `http://localhost:3002/manifest.json`
4. **Click "Install"**

#### **Method C: Toolbar**
1. **Open Penpot**
2. **Click Plugins icon** in toolbar (puzzle piece)
3. **Click "Plugin Manager"**
4. **Enter URL and install**

### **6. Test the Plugin**

#### **Step 1: Open a Design File**
1. Create new file or open existing in Penpot
2. Add some colors and components to library
3. Save the file

#### **Step 2: Launch Plugin**
1. **Click Plugins icon** in toolbar
2. **Find "OpenDS Sync"** in plugin list
3. **Click to launch**

#### **Step 3: Configure Connection**
1. **URL**: `http://localhost:3001`
2. **API Key**: (from step 4)
3. **Click "Connect to OpenDS"**

#### **Step 4: Sync Design System**
1. **View stats** (colors/components count)
2. **Click "Sync to OpenDS"**
3. **Wait for success message**

#### **Step 5: Verify in OpenDS**
1. **Open OpenDS frontend**: http://localhost:3000
2. **Check Design Files** section
3. **Verify synced data** appears

### **7. Troubleshooting**

#### **Plugin doesn't install:**
```
Error: "The plugin doesn't exist or the URL is not correct"
```
**Solutions:**
1. Check server is running: `curl http://localhost:3002/manifest.json`
2. Verify CORS headers in server response
3. Try different browser
4. Clear browser cache

#### **Connection fails:**
```
Error: "Connection failed: 401"
```
**Solutions:**
1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check API key is correct
3. Regenerate API key if needed

#### **Sync fails:**
```
Error: "Network error" or "CORS error"
```
**Solutions:**
1. Check both servers are running
2. Verify network connectivity
3. Check browser console for errors

#### **Plugin UI doesn't load:**
```
Blank screen or loading error
```
**Solutions:**
1. Check browser console (F12 → Console)
2. Verify `plugin.js` loads: `curl http://localhost:3002/plugin.js`
3. Check for JavaScript errors

### **8. Development Workflow**

#### **Make changes to plugin:**
```bash
# 1. Edit plugin code
vim public/plugin.js

# 2. Restart server (if needed)
pkill -f "node serve-plugin" && node serve-plugin.js

# 3. Reload in Penpot
# - Close plugin window
# - Re-open plugin
# - Or: Ctrl+R in plugin window
```

#### **Test API endpoints:**
```bash
# Health check
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3001/api/plugin/health

# Generate API key
curl -X POST http://localhost:3001/api/plugin/api-keys

# Test sync with mock data
curl -X POST -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fileId":"test-123","fileName":"Test","colors":[],"components":[],"syncedAt":"2024-01-01T00:00:00Z"}' \
  http://localhost:3001/api/plugin/sync
```

### **9. Quick Test Script**

```bash
#!/bin/bash
# quick-test.sh

echo "🔍 Testing OpenDS Plugin Setup..."

echo "1. Checking backend..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend running"
else
    echo "❌ Backend not running"
    echo "   Run: cd backend && pnpm dev"
    exit 1
fi

echo "2. Checking plugin server..."
if curl -s http://localhost:3002/manifest.json > /dev/null; then
    echo "✅ Plugin server running"
else
    echo "❌ Plugin server not running"
    echo "   Run: cd opends-penpot-plugin && node serve-plugin.js"
    exit 1
fi

echo "3. Testing API..."
API_KEY=$(curl -s -X POST http://localhost:3001/api/plugin/api-keys | grep -o '"apiKey":"[^"]*"' | cut -d'"' -f4)
if [ -n "$API_KEY" ]; then
    echo "✅ API key generated: ${API_KEY:0:20}..."
else
    echo "❌ Failed to generate API key"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To install plugin in Penpot:"
echo "1. Open https://penpot.app"
echo "2. Press Ctrl+Alt+P"
echo "3. Enter: http://localhost:3002/manifest.json"
echo "4. Use API key: $API_KEY"
```

### **10. Common Issues & Solutions**

#### **CORS Issues:**
```javascript
// In serve-plugin.js, ensure these headers:
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
```

#### **Port Already in Use:**
```bash
# Find and kill process
lsof -ti:3002 | xargs kill -9
```

#### **Browser Security:**
- Use `localhost` not `127.0.0.1`
- Try incognito/private mode
- Disable strict CORS extensions

#### **Network Issues:**
- Check firewall settings
- Ensure no VPN blocking localhost
- Try different browser

### **11. Success Checklist**

- [ ] Backend running on port 3001
- [ ] Plugin server running on port 3002
- [ ] API key generated
- [ ] Plugin installed in Penpot
- [ ] Connection successful
- [ ] Design system stats visible
- [ ] Sync completes successfully
- [ ] Data appears in OpenDS

### **12. Next Steps After Testing**

1. **Create separate GitHub repo** for plugin
2. **Add CI/CD** for automatic builds
3. **Submit to Penpot Marketplace**
4. **Add OAuth authentication**
5. **Create user documentation**

---

**Need help?** Check browser console (F12) for errors or contact OpenDS team.