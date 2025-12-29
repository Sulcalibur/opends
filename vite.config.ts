/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@docs': resolve(__dirname, './src/docs'),
      '@design-system': resolve(__dirname, './src/design-system'),
      '@api': resolve(__dirname, './src/api'),
      '@storybook': resolve(__dirname, './.storybook')
    }
  },
  server: {
    port: 3002,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium'
              }
            ]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  }
})
