import { type App } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

export const setupPrimeVue = (app: App) => {
  app.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined',
    theme: {
      preset: Aura,
      options: {
        darkMode: 'class',
        cssLayer: false
      }
    }
  })
}