/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_PENPOT_API_URL: string
  readonly VITE_FIGMA_API_TOKEN: string
  readonly VITE_DATABASE_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}