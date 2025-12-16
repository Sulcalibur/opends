import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

// Import PrimeVue CSS (PrimeVue handles this internally with the config)
// Import OpenDS design token overrides
import './assets/css/primevue-overrides.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: 'aura',
    options: {
      darkModeSelector: '.dark',
      cssLayer: false
    }
  },
  ripple: true
})

app.mount('#app')