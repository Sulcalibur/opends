#!/usr/bin/env node

/**
 * OpenDS Migration Tool
 * 
 * This script helps migrate from the original OpenDS architecture
 * to the new simplified version.
 * 
 * Usage:
 *   node migrate.js --help
 *   node migrate.js --source /path/to/old/opends --target /path/to/simplified
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Command line arguments
const args = process.argv.slice(2)
const sourceDir = args.includes('--source') ? args[args.indexOf('--source') + 1] : null
const targetDir = args.includes('--target') ? args[args.indexOf('--target') + 1] : __dirname
const help = args.includes('--help') || args.includes('-h')

if (help) {
  console.log(`
OpenDS Migration Tool
=====================

Migrates data from the original OpenDS architecture to the new simplified version.

Usage:
  node migrate.js [options]

Options:
  --source <path>    Source directory of original OpenDS (optional)
  --target <path>    Target directory for simplified OpenDS (default: current directory)
  --help, -h         Show this help message

What this tool does:
  1. Creates the simplified directory structure
  2. Migrates design tokens from old format to YAML
  3. Migrates component definitions
  4. Creates basic configuration files
  5. Sets up initial admin user

If --source is not provided, the tool will create a fresh installation
with sample data.

Examples:
  node migrate.js --source ../opends --target ./my-opends
  node migrate.js (creates fresh installation in current directory)
  `)
  process.exit(0)
}

async function main() {
  console.log('🚀 OpenDS Migration Tool')
  console.log('=======================\n')

  try {
    // Create target directory structure
    await createDirectoryStructure(targetDir)
    
    if (sourceDir) {
      console.log(`📁 Source: ${sourceDir}`)
      console.log(`📁 Target: ${targetDir}\n`)
      
      // Check if source directory exists
      try {
        await fs.access(sourceDir)
        console.log('✅ Source directory found')
        
        // Migrate data from source
        await migrateDesignTokens(sourceDir, targetDir)
        await migrateComponents(sourceDir, targetDir)
        await migrateConfiguration(sourceDir, targetDir)
        
        console.log('\n✅ Migration completed successfully!')
        console.log('\nNext steps:')
        console.log('1. cd ' + targetDir)
        console.log('2. npm install')
        console.log('3. pnpm run dev')
        console.log('4. Visit http://localhost:3000')
        console.log('5. Login with admin/admin (change this immediately!)')
        
      } catch (error) {
        console.log('⚠️  Source directory not found or inaccessible')
        console.log('Creating fresh installation with sample data...\n')
        await createSampleData(targetDir)
      }
    } else {
      console.log('📁 Target: ' + targetDir)
      console.log('\nNo source directory provided.')
      console.log('Creating fresh installation with sample data...\n')
      await createSampleData(targetDir)
      
      console.log('\n✅ Fresh installation created successfully!')
      console.log('\nNext steps:')
      console.log('1. cd ' + targetDir)
      console.log('2. npm install')
      console.log('3. pnpm run dev')
      console.log('4. Visit http://localhost:3000')
      console.log('5. Login with admin/admin (change this immediately!)')
    }
    
    console.log('\n📚 Documentation:')
    console.log('- Check README.md for detailed setup instructions')
    console.log('- Review design-system-data/ for your design tokens and components')
    console.log('- Customize the application in src/app/')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  }
}

async function createDirectoryStructure(targetDir) {
  const directories = [
    'design-system-data',
    'design-system-data/components',
    'src',
    'src/app',
    'src/app/pages',
    'src/app/pages/admin',
    'src/app/pages/public',
    'src/app/stores',
    'src/app/router',
    'src/design-system',
    'src/api',
    'src/assets',
    'src/assets/css',
    'data',
    'backups'
  ]
  
  for (const dir of directories) {
    const fullPath = path.join(targetDir, dir)
    try {
      await fs.mkdir(fullPath, { recursive: true })
      console.log(`📁 Created: ${dir}`)
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error
      }
    }
  }
}

async function migrateDesignTokens(sourceDir, targetDir) {
  console.log('\n🎨 Migrating design tokens...')
  
  // Try to find tokens in source directory
  const possibleTokenPaths = [
    path.join(sourceDir, 'design-tokens.json'),
    path.join(sourceDir, 'tokens.json'),
    path.join(sourceDir, 'src', 'design-tokens.json'),
    path.join(sourceDir, 'frontend', 'src', 'design-tokens.json')
  ]
  
  let tokens = []
  
  for (const tokenPath of possibleTokenPaths) {
    try {
      const content = await fs.readFile(tokenPath, 'utf8')
      const parsed = JSON.parse(content)
      
      if (Array.isArray(parsed)) {
        tokens = parsed
      } else if (parsed.tokens) {
        tokens = parsed.tokens
      } else if (parsed.colors || parsed.typography || parsed.spacing) {
        // Convert object format to array
        tokens = []
        if (parsed.colors) {
          Object.entries(parsed.colors).forEach(([name, value]) => {
            tokens.push({
              name,
              value,
              type: 'color',
              category: 'colors'
            })
          })
        }
        if (parsed.typography) {
          Object.entries(parsed.typography).forEach(([name, value]) => {
            tokens.push({
              name,
              value,
              type: 'typography',
              category: 'typography'
            })
          })
        }
        if (parsed.spacing) {
          Object.entries(parsed.spacing).forEach(([name, value]) => {
            tokens.push({
              name,
              value,
              type: 'spacing',
              category: 'spacing'
            })
          })
        }
      }
      
      console.log(`✅ Found tokens in: ${tokenPath}`)
      break
    } catch (error) {
      // File not found or invalid JSON, continue to next path
    }
  }
  
  if (tokens.length === 0) {
    console.log('⚠️  No tokens found in source, creating sample tokens')
    tokens = getSampleTokens()
  }
  
  // Convert to YAML format
  const yamlContent = yaml.dump({
    version: '1.0',
    tokens: tokens.map(token => ({
      name: token.name,
      value: token.value,
      type: token.type || 'color',
      category: token.category || 'general',
      description: token.description || ''
    }))
  })
  
  const targetPath = path.join(targetDir, 'design-system-data', 'tokens.yaml')
  await fs.writeFile(targetPath, yamlContent)
  console.log(`✅ Tokens saved to: design-system-data/tokens.yaml (${tokens.length} tokens)`)
}

async function migrateComponents(sourceDir, targetDir) {
  console.log('\n🧩 Migrating components...')
  
  // Try to find components in source directory
  const possibleComponentPaths = [
    path.join(sourceDir, 'components.json'),
    path.join(sourceDir, 'src', 'components.json'),
    path.join(sourceDir, 'frontend', 'src', 'components.json')
  ]
  
  let components = []
  
  for (const componentPath of possibleComponentPaths) {
    try {
      const content = await fs.readFile(componentPath, 'utf8')
      const parsed = JSON.parse(content)
      
      if (Array.isArray(parsed)) {
        components = parsed
      } else if (parsed.components) {
        components = parsed.components
      }
      
      console.log(`✅ Found components in: ${componentPath}`)
      break
    } catch (error) {
      // File not found or invalid JSON, continue to next path
    }
  }
  
  if (components.length === 0) {
    console.log('⚠️  No components found in source, creating sample components')
    components = getSampleComponents()
  }
  
  // Save each component as separate YAML file
  const componentsDir = path.join(targetDir, 'design-system-data', 'components')
  let savedCount = 0
  
  for (const component of components) {
    const componentName = component.name || component.id || `component-${savedCount + 1}`
    const safeName = componentName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const componentPath = path.join(componentsDir, `${safeName}.yaml`)
    
    const yamlContent = yaml.dump({
      name: component.name || componentName,
      description: component.description || '',
      category: component.category || 'general',
      status: component.status || 'stable',
      props: component.props || [],
      examples: component.examples || [],
      usage: component.usage || '',
      notes: component.notes || ''
    })
    
    await fs.writeFile(componentPath, yamlContent)
    savedCount++
  }
  
  console.log(`✅ Components saved to: design-system-data/components/ (${savedCount} components)`)
}

async function migrateConfiguration(sourceDir, targetDir) {
  console.log('\n⚙️  Migrating configuration...')
  
  // Try to find .env file
  const envPath = path.join(sourceDir, '.env')
  try {
    const envContent = await fs.readFile(envPath, 'utf8')
    const targetEnvPath = path.join(targetDir, '.env.example')
    
    // Filter and adapt environment variables
    const lines = envContent.split('\n')
    const filteredLines = lines.filter(line => {
      // Keep only relevant variables for simplified version
      return line.includes('DATABASE_URL') || 
             line.includes('SECRET_KEY') ||
             line.includes('ADMIN_') ||
             line.startsWith('#')
    }).map(line => {
      // Remove values for example file
      if (line.includes('=') && !line.startsWith('#')) {
        const [key] = line.split('=')
        return `${key}=`
      }
      return line
    })
    
    await fs.writeFile(targetEnvPath, filteredLines.join('\n'))
    console.log(`✅ Configuration saved to: .env.example`)
  } catch (error) {
    console.log('⚠️  No .env file found, creating default .env.example')
    await createDefaultEnv(targetDir)
  }
}

async function createSampleData(targetDir) {
  console.log('📝 Creating sample data...')
  
  // Create sample tokens
  const tokens = getSampleTokens()
  const tokensYaml = yaml.dump({
    version: '1.0',
    tokens: tokens
  })
  await fs.writeFile(
    path.join(targetDir, 'design-system-data', 'tokens.yaml'),
    tokensYaml
  )
  console.log(`✅ Created sample tokens (${tokens.length} tokens)`)
  
  // Create sample components
  const components = getSampleComponents()
  const componentsDir = path.join(targetDir, 'design-system-data', 'components')
  
  for (const component of components) {
    const safeName = component.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const componentYaml = yaml.dump(component)
    await fs.writeFile(
      path.join(componentsDir, `${safeName}.yaml`),
      componentYaml
    )
  }
  console.log(`✅ Created sample components (${components.length} components)`)
  
  // Create default environment file
  await createDefaultEnv(targetDir)
  console.log('✅ Created default configuration')
}

function getSampleTokens() {
  return [
    {
      name: 'primary-500',
      value: '#3b82f6',
      type: 'color',
      category: 'colors',
      description: 'Primary brand color'
    },
    {
      name: 'secondary-500',
      value: '#8b5cf6',
      type: 'color',
      category: 'colors',
      description: 'Secondary brand color'
    },
    {
      name: 'success-500',
      value: '#10b981',
      type: 'color',
      category: 'colors',
      description: 'Success state color'
    },
    {
      name: 'font-family-base',
      value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      type: 'typography',
      category: 'typography',
      description: 'Base font family'
    },
    {
      name: 'font-size-base',
      value: '16px',
      type: 'typography',
      category: 'typography',
      description: 'Base font size'
    },
    {
      name: 'spacing-4',
      value: '1rem',
      type: 'spacing',
      category: 'spacing',
      description: 'Standard spacing unit'
    },
    {
      name: 'spacing-8',
      value: '2rem',
      type: 'spacing',
      category: 'spacing',
      description: 'Double spacing unit'
    },
    {
      name: 'radius-md',
      value: '0.375rem',
      type: 'radius',
      category: 'radius',
      description: 'Medium border radius'
    }
  ]
}

function getSampleComponents() {
  return [
    {
      name: 'Button',
      description: 'A versatile button component for actions and links',
      category: 'inputs',
      status: 'stable',
      props: [
        { name: 'label', type: 'string', required: true, description: 'Button text' },
        { name: 'severity', type: 'string', default: 'primary', description: 'Button style (primary, secondary, etc.)' },
        { name: 'size', type: 'string', default: 'medium', description: 'Button size (small, medium, large)' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether button is disabled' }
      ],
      examples: [
        {
          name: 'Primary Button',
          code: '<Button label="Click me" severity="primary" />'
        },
        {
          name: 'Disabled Button',
          code: '<Button label="Disabled" severity="secondary" disabled />'
        }
      ],
      usage: 'Use for primary actions, form submissions, and navigation.',
      notes: 'Supports icons and loading states.'
    },
    {
      name: 'Card',
      description: 'Container for grouping related content',
      category: 'layout',
      status: 'stable',
      props: [
        { name: 'title', type: 'string', required: false, description: 'Card title' },
        { name: 'subtitle', type: 'string', required: false, description: 'Card subtitle' },
        { name: 'elevation', type: 'number', default: '1', description: 'Shadow depth (0-5)' }
      ],
      examples: [
        {
          name: 'Basic Card',
          code: '<Card title="Card Title">\n  <p>Card content goes here</p>\n</Card>'
        }
      ],
      usage: 'Use for grouping related information, product cards, or content sections.',
      notes: 'Supports header and footer slots.'
    }
  ]
}

async function createDefaultEnv(targetDir) {
  const envContent = `# OpenDS Environment Variables
# Copy this file to .env and fill in the values

# Database
DATABASE_URL=file:./data/opends.db

# Security
SECRET_KEY=change-this-to-a-random-string-in-production

# Admin User (change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin

# Server
PORT=3000
HOST=0.0.0.0

# Optional: External services
# PENPLUGIN_API_URL=http://localhost:3002
# FIGMA_API_URL=https://api.figma.com
`
  
  await fs.writeFile(path.join(targetDir, '.env.example'), envContent)
}

// Run the migration
main().catch(console.error)