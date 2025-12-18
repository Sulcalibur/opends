#!/usr/bin/env node

/**
 * OpenDS Application Test
 * 
 * Tests basic functionality of the simplified OpenDS application.
 * 
 * Usage:
 *   node test-app.js
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testApplication() {
  console.log('🧪 OpenDS Application Test')
  console.log('=========================\n')
  
  let allTestsPassed = true
  
  try {
    // Test 1: Check directory structure
    console.log('1. Checking directory structure...')
    const requiredDirs = [
      'design-system-data',
      'design-system-data/components',
      'src/app',
      'src/design-system',
      'src/api',
      'data'
    ]
    
    for (const dir of requiredDirs) {
      try {
        await fs.access(path.join(__dirname, dir))
        console.log(`   ✅ ${dir}`)
      } catch (error) {
        console.log(`   ❌ ${dir} - Missing`)
        allTestsPassed = false
      }
    }
    
    // Test 2: Check required files
    console.log('\n2. Checking required files...')
    const requiredFiles = [
      'package.json',
      'design-system-data/tokens.yaml',
      'design-system-data/components/button.yaml',
      'src/app/App.vue',
      'src/app/router/index.ts',
      'src/main.ts',
      'index.html',
      'vite.config.ts',
      '.env.example'
    ]
    
    for (const file of requiredFiles) {
      try {
        await fs.access(path.join(__dirname, file))
        console.log(`   ✅ ${file}`)
      } catch (error) {
        console.log(`   ❌ ${file} - Missing`)
        allTestsPassed = false
      }
    }
    
    // Test 3: Check package.json dependencies
    console.log('\n3. Checking package.json...')
    try {
      const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, 'package.json'), 'utf8'))
      
      const requiredDeps = ['vue', 'vue-router', 'pinia', 'primevue', 'vite']
      const missingDeps = []
      
      for (const dep of requiredDeps) {
        if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
          missingDeps.push(dep)
        }
      }
      
      if (missingDeps.length === 0) {
        console.log('   ✅ All required dependencies found')
      } else {
        console.log(`   ❌ Missing dependencies: ${missingDeps.join(', ')}`)
        allTestsPassed = false
      }
      
      if (packageJson.scripts?.dev) {
        console.log('   ✅ Development script found')
      } else {
        console.log('   ❌ Missing dev script in package.json')
        allTestsPassed = false
      }
      
    } catch (error) {
      console.log(`   ❌ Error reading package.json: ${error.message}`)
      allTestsPassed = false
    }
    
    // Test 4: Check design system data
    console.log('\n4. Checking design system data...')
    try {
      // Check tokens.yaml
      const tokensYaml = await fs.readFile(path.join(__dirname, 'design-system-data', 'tokens.yaml'), 'utf8')
      const tokensData = yaml.load(tokensYaml)
      
      // Check for categorized format (colors, typography, spacing, radius)
      const tokenCategories = ['colors', 'typography', 'spacing', 'radius']
      const hasCategories = tokenCategories.some(category => tokensData[category])
      
      if (hasCategories) {
        const tokenCount = tokenCategories.reduce((count, category) => {
          return count + (tokensData[category] ? Object.keys(tokensData[category]).length : 0)
        }, 0)
        console.log(`   ✅ tokens.yaml - ${tokenCount} tokens found (categorized format)`)
      } else if (tokensData?.tokens && Array.isArray(tokensData.tokens)) {
        console.log(`   ✅ tokens.yaml - ${tokensData.tokens.length} tokens found (flat format)`)
      } else {
        console.log('   ❌ tokens.yaml - Invalid format or no tokens found')
        allTestsPassed = false
      }
      
      // Check at least one component
      const componentFiles = await fs.readdir(path.join(__dirname, 'design-system-data', 'components'))
      const yamlComponents = componentFiles.filter(f => f.endsWith('.yaml'))
      
      if (yamlComponents.length > 0) {
        console.log(`   ✅ components/ - ${yamlComponents.length} component files found`)
        
        // Check first component
        const firstComponent = yamlComponents[0]
        const componentYaml = await fs.readFile(
          path.join(__dirname, 'design-system-data', 'components', firstComponent),
          'utf8'
        )
        const componentData = yaml.load(componentYaml)
        
        if (componentData?.name) {
          console.log(`   ✅ ${firstComponent} - Valid component: ${componentData.name}`)
        } else {
          console.log(`   ❌ ${firstComponent} - Invalid component format`)
          allTestsPassed = false
        }
      } else {
        console.log('   ❌ No component files found in components/ directory')
        allTestsPassed = false
      }
      
    } catch (error) {
      console.log(`   ❌ Error reading design system data: ${error.message}`)
      allTestsPassed = false
    }
    
    // Test 5: Check Vue application structure
    console.log('\n5. Checking Vue application structure...')
    try {
      const mainTs = await fs.readFile(path.join(__dirname, 'src', 'main.ts'), 'utf8')
      
      const requiredImports = ['createApp', 'createPinia', 'PrimeVue', 'App', 'router']
      const missingImports = []
      
      for (const importName of requiredImports) {
        if (!mainTs.includes(importName)) {
          missingImports.push(importName)
        }
      }
      
      if (missingImports.length === 0) {
        console.log('   ✅ main.ts has all required imports')
      } else {
        console.log(`   ❌ main.ts missing imports: ${missingImports.join(', ')}`)
        allTestsPassed = false
      }
      
      // Check App.vue
      const appVue = await fs.readFile(path.join(__dirname, 'src', 'app', 'App.vue'), 'utf8')
      if (appVue.includes('<router-view')) {
        console.log('   ✅ App.vue contains router-view')
      } else {
        console.log('   ❌ App.vue missing router-view')
        allTestsPassed = false
      }
      
    } catch (error) {
      console.log(`   ❌ Error checking Vue structure: ${error.message}`)
      allTestsPassed = false
    }
    
    // Summary
    console.log('\n' + '='.repeat(40))
    if (allTestsPassed) {
      console.log('✅ All tests passed!')
      console.log('\nThe OpenDS application is properly configured.')
      console.log('\nTo start the application:')
      console.log('1. Install dependencies: npm install')
      console.log('2. Start dev server: pnpm run dev')
      console.log('3. Open browser: http://localhost:3000')
      console.log('\nDefault admin credentials: admin/admin')
    } else {
      console.log('❌ Some tests failed.')
      console.log('\nPlease check the errors above and fix them.')
      console.log('Run the migration tool if needed: node migrate.js')
    }
    console.log('='.repeat(40))
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message)
    process.exit(1)
  }
}

// Run tests
testApplication().catch(console.error)