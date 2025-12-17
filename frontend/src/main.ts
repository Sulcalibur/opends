import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Tooltip from 'primevue/tooltip'
import 'primeicons/primeicons.css'
import { setupPrimeButtonLabels } from './utils/labelPrimeButtons'

import App from './App.vue'
import router from './router'

// PrimeVue handles CSS internally with the theme preset
// Import OpenDS design token overrides
import './assets/css/primevue-overrides.css'

// Import PrimeFlex CSS for utility classes
import 'primeflex/primeflex.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
      cssLayer: false
    }
  },
  ripple: true
})
app.directive('tooltip', Tooltip)

app.mount('#app')
setupPrimeButtonLabels()
