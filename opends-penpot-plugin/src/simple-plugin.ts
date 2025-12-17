// Simple test plugin for Penpot
// This is a minimal working plugin to test installation

// Import Penpot types
import type { Penpot } from '@penpot/plugin-types'

// Plugin entry point
const plugin = {
  id: 'opends-sync-test',
  name: 'OpenDS Sync Test',
  description: 'Test plugin for OpenDS integration',
  icon: '🔄',
  
  async run(penpot: Penpot) {
    console.log('OpenDS plugin loaded!')
    
    try {
      // Test if we can access the library
      const library = penpot.library.local
      console.log('Library access:', library ? 'OK' : 'Failed')
      
      // Show a simple message
      penpot.ui.open('OpenDS Sync', 'about:blank', { width: 400, height: 300 })
      
      // Create a simple HTML UI
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              background: #f8f9fa;
            }
            .container {
              max-width: 360px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 24px;
            }
            .logo {
              font-size: 48px;
              margin-bottom: 12px;
            }
            h1 {
              margin: 0 0 8px 0;
              color: #1e40af;
            }
            .status {
              background: white;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 16px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .button {
              display: block;
              width: 100%;
              padding: 12px;
              background: #1e40af;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background 0.2s;
            }
            .button:hover {
              background: #1e3a8a;
            }
            .stats {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-top: 16px;
            }
            .stat {
              text-align: center;
              padding: 12px;
              background: #f1f5f9;
              border-radius: 6px;
            }
            .stat-label {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 4px;
            }
            .stat-value {
              font-size: 20px;
              font-weight: 600;
              color: #1e40af;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔄</div>
              <h1>OpenDS Sync</h1>
              <p>Sync your design system to OpenDS</p>
            </div>
            
            <div class="status">
              <p><strong>Status:</strong> Connected to Penpot</p>
              <p><strong>File:</strong> Current design file</p>
            </div>
            
            <button class="button" onclick="testSync()">Test Sync</button>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-label">Colors</div>
                <div id="color-count" class="stat-value">0</div>
              </div>
              <div class="stat">
                <div class="stat-label">Components</div>
                <div id="component-count" class="stat-value">0</div>
              </div>
            </div>
          </div>
          
          <script>
            function testSync() {
              const button = document.querySelector('.button')
              button.textContent = 'Syncing...'
              button.disabled = true
              
              // Simulate sync
              setTimeout(() => {
                button.textContent = '✅ Sync Complete!'
                document.getElementById('color-count').textContent = '12'
                document.getElementById('component-count').textContent = '8'
                
                setTimeout(() => {
                  button.textContent = 'Test Sync'
                  button.disabled = false
                }, 2000)
              }, 1500)
            }
            
            // Load initial stats
            window.addEventListener('load', () => {
              // These would come from Penpot API
              document.getElementById('color-count').textContent = '5'
              document.getElementById('component-count').textContent = '3'
            })
          </script>
        </body>
        </html>
      `
      
      // Create a blob URL for the HTML
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      // Update the UI with our HTML
      penpot.ui.resize(400, 500)
      
      // Note: In a real plugin, we'd use penpot.ui.open with a proper URL
      // For now, we'll just log success
      console.log('Plugin UI would open at:', url)
      
    } catch (error) {
      console.error('Plugin error:', error)
    }
  }
}

export default plugin