import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// Helper function to read component YAML files
async function readComponentFromYAML(componentName) {
  try {
    const yamlPath = path.join(
      process.cwd(),
      'design-system-data',
      'components',
      `${componentName.toLowerCase()}.yaml`
    )

    if (!fs.existsSync(yamlPath)) {
      return null
    }

    const content = fs.readFileSync(yamlPath, 'utf-8')
    return yaml.load(content)
  } catch (error) {
    console.error(`Error reading component YAML for ${componentName}:`, error)
    return null
  }
}

// Helper function to read all component YAML files
async function readAllComponents() {
  try {
    const componentsDir = path.join(process.cwd(), 'design-system-data', 'components')

    if (!fs.existsSync(componentsDir)) {
      return []
    }

    const files = fs.readdirSync(componentsDir)
    const yamlFiles = files.filter(f => f.endsWith('.yaml'))

    const components = []

    for (const file of yamlFiles) {
      const componentName = file.replace('.yaml', '')
      const componentData = await readComponentFromYAML(componentName)

      if (componentData) {
        components.push({
          id: componentName,
          name: componentData.name,
          displayName: componentData.name,
          description: componentData.description,
          category: componentData.category,
          status: componentData.status,
          spec: {
            type: componentData.category,
            props: componentData.props || [],
            slots: componentData.slots || [],
            events: componentData.events || []
          },
          examples: componentData.examples || [],
          usage: componentData.usage,
          notes: componentData.notes || '',
          design: componentData.design || {
            tool: null,
            fileId: null,
            frameId: null,
            nodeId: null,
            timestamp: null
          }
        })
      }
    }

    return components
  } catch (error) {
    console.error('Error reading components:', error)
    return []
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  try {
    const { name } = req.params

    if (req.method === 'GET') {
      if (name) {
        // Get single component
        const component = await readComponentFromYAML(name)

        if (!component) {
          return res.status(404).json({
            success: false,
            error: 'Component not found'
          })
        }

        res.json({
          success: true,
          data: component
        })
      } else {
        // Get all components
        const components = await readAllComponents()

        res.json({
          success: true,
          data: components,
          pagination: {
            total: components.length,
            count: components.length
          }
        })
      }
    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
    }
  } catch (error) {
    console.error('Components API error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
