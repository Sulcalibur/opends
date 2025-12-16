import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { setupPrimeVue } from './plugins/primevue'
import App from './App.vue'

// PrimeVue CSS
import 'primeicons/primeicons.css'
import '@/assets/css/primevue-overrides.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/HomePage.vue')
    }
  ]
})

setupPrimeVue(app)
app.use(createPinia())
app.use(router)
app.mount('#app')