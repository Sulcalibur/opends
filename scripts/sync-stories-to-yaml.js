/**
 * Sync component props from Storybook stories to YAML definitions
 * This keeps documentation YAML files in sync with story definitions
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Simple parser to extract props from story files
function extractPropsFromStory(storyFilePath) {
  try {
    const content = fs.readFileSync(storyFilePath, 'utf-8')

    // Extract argTypes configuration
    const argTypesMatch = content.match(/argTypes:\s*{([^}]+)}/s)
    if (!argTypesMatch) {
      return {}
    }

    const argTypesBlock = argTypesMatch[1]
    const props = {}

    // Extract prop definitions using regex
    const propPattern = /(\w+):\s*{([^}]+)}/g
    let match

    while ((match = propPattern.exec(argTypesBlock)) !== null) {
      const propName = match[1]
      const propBlock = match[2]

      // Extract control type
      const typeMatch = propBlock.match(/control:\s*['"]?([^'",]+)/)
      const controlType = typeMatch ? typeMatch[1] : 'text'

      // Extract options if available
      const optionsMatch = propBlock.match(/options:\s*\[([^\]]+)\]/)
      const options = optionsMatch
        ? optionsMatch[1].split(',').map(o => o.trim().replace(/['"]/g, ''))
        : undefined

      props[propName] = {
        type: inferTypeFromControl(controlType),
        control: controlType,
        options,
        description: ''
      }
    }

    return props
  } catch (error) {
    console.error(`Error reading story file ${storyFilePath}:`, error)
    return {}
  }
}

function inferTypeFromControl(controlType) {
  const typeMap = {
    text: 'string',
    number: 'number',
    select: 'string',
    boolean: 'boolean',
    color: 'string',
    date: 'string'
  }
  return typeMap[controlType] || 'string'
}

function updateYamlWithProps(yamlFilePath, props) {
  try {
    const content = fs.readFileSync(yamlFilePath, 'utf-8')
    const lines = content.split('\n')

    // Find props section
    let propsIndex = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === 'props:') {
        propsIndex = i
        break
      }
    }

    if (propsIndex === -1) {
      console.log(`No props section found in ${yamlFilePath}`)
      return
    }

    // Generate new props entries
    const newPropsEntries = Object.entries(props).map(([name, prop]) => {
      let entry = `  - name: ${name}\n`
      entry += `    type: ${prop.type}\n`

      if (prop.options) {
        entry += `    options: [${prop.options.map(o => `'${o}'`).join(', ')}]\n`
      }

      entry += `    description: ${prop.description}\n`
      return entry
    })

    // Insert new props after 'props:' line
    const newContent = [
      ...lines.slice(0, propsIndex + 1),
      ...newPropsEntries,
      ...lines.slice(propsIndex + 1)
    ].join('\n')

    fs.writeFileSync(yamlFilePath, newContent, 'utf-8')
    console.log(`✅ Updated ${yamlFilePath}`)
  } catch (error) {
    console.error(`Error updating ${yamlFilePath}:`, error)
  }
}

async function syncComponents() {
  const componentsDir = path.join(process.cwd(), 'src/design-system/components')
  const yamlDir = path.join(process.cwd(), 'design-system-data/components')

  // Get all story files
  const storyFiles = fs
    .readdirSync(componentsDir)
    .filter(file => file.endsWith('.stories.ts'))
    .map(file => file.replace('.stories.ts', ''))

  console.log(`Found ${storyFiles.length} components to sync`)

  for (const component of storyFiles) {
    const storyPath = path.join(componentsDir, `${component}.stories.ts`)
    const yamlPath = path.join(yamlDir, `${component.toLowerCase()}.yaml`)

    if (!fs.existsSync(yamlPath)) {
      console.log(`⏭ Skipping ${component}: no YAML file found`)
      continue
    }

    console.log(`\nSyncing ${component}...`)
    const props = extractPropsFromStory(storyPath)

    if (Object.keys(props).length > 0) {
      updateYamlWithProps(yamlPath, props)
    } else {
      console.log(`No props found in story file`)
    }
  }
}

syncComponents().catch(console.error)
