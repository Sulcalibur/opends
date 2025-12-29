import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

import App from './app/App.vue'
import router from './app/router'
import './assets/css/main.css'
import './utils/mockTokenAPI'

// PrimeVue 4.x with Aura theme
import 'primeicons/primeicons.css'

// @ts-ignore - TypeScript has issues with @primevue/themes import
import Aura from '@primevue/themes/aura'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  ripple: true
})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.mount('#app')