import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import views
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import DesignFilesView from '../views/DesignFilesView.vue'
import ComponentsView from '../views/ComponentsView.vue'
import TokensView from '../views/TokensView.vue'
import CodegenView from '../views/CodegenView.vue'
import SettingsView from '../views/SettingsView.vue'
import ConnectionsPage from '../pages/ConnectionsPage.vue'

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
    path: '/connections',
    name: 'connections',
    component: ConnectionsPage,
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
  // Check if route requires authentication
  const requiresAuth = to.meta && (to.meta as any).requiresAuth
  
  // For now, use mock authentication
  // TODO: Replace with actual auth store check
  const isAuthenticated = localStorage.getItem('auth_token') !== null
  
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
