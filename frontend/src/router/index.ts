import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import views (to be created)
const LoginView = { template: '<div class="p-6">Login Page (TODO)</div>' }
const DashboardView = { template: '<div class="p-6">Dashboard (TODO)</div>' }
const DesignFilesView = { template: '<div class="p-6">Design Files (TODO)</div>' }
const ComponentsView = { template: '<div class="p-6">Components (TODO)</div>' }
const TokensView = { template: '<div class="p-6">Design Tokens (TODO)</div>' }
const CodegenView = { template: '<div class="p-6">Code Generation (TODO)</div>' }
const SettingsView = { template: '<div class="p-6">Settings (TODO)</div>' }

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/design-files',
    name: 'design-files',
    component: DesignFilesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/components',
    name: 'components',
    component: ComponentsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tokens',
    name: 'tokens',
    component: TokensView,
    meta: { requiresAuth: true }
  },
  {
    path: '/codegen',
    name: 'codegen',
    component: CodegenView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  // TODO: Replace with actual auth check
  const isAuthenticated = true
  
  if (to.meta && (to.meta as any).requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router