import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const simplifiedDist = join(root, 'simplified', 'dist')
const rootDist = join(root, 'dist')
const simplifiedFunctions = join(root, 'simplified', 'functions')
const rootFunctions = join(root, 'functions')

if (!existsSync(simplifiedDist)) {
  console.error('simplified/dist not found. Did the build succeed?')
  process.exit(1)
}

rmSync(rootDist, { recursive: true, force: true })
mkdirSync(rootDist, { recursive: true })
cpSync(simplifiedDist, rootDist, { recursive: true })

if (existsSync(simplifiedFunctions)) {
  rmSync(rootFunctions, { recursive: true, force: true })
  mkdirSync(rootFunctions, { recursive: true })
  cpSync(simplifiedFunctions, rootFunctions, { recursive: true })
}

console.log('Synced build output to ./dist and functions to ./functions')

