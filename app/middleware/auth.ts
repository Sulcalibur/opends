export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if (to.meta.public && authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/admin')
  }
})
