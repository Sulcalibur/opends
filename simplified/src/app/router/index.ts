import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/app/stores/auth'

// Public routes
const HomeView = () => import('@/app/pages/public/HomeView.vue')
const DocsView = () => import('@/app/pages/public/DocsView.vue')
const ComponentsView = () => import('@/app/pages/public/ComponentsView.vue')
const TokensView = () => import('@/app/pages/public/TokensView.vue')

// Admin routes
const LoginView = () => import('@/app/pages/admin/LoginView.vue')
const DashboardView = () => import('@/app/pages/admin/DashboardView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true }
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsView,
      meta: { public: true }
    },
    {
      path: '/components',
      name: 'components',
      component: ComponentsView,
      meta: { public: true }
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: TokensView,
      meta: { public: true }
    },
    
    // Admin routes
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true }
    },
    
    // Admin dashboard
    {
      path: '/admin',
      name: 'admin',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    
    // Catch-all redirect
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.public && authStore.isAuthenticated && to.name === 'login') {
    next('/admin')
  } else {
    next()
  }
})

export default router