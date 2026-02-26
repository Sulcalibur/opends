/**
 * Authentication Store (Pinia)
 * Manages user authentication state with JWT tokens
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isEditor = computed(
    () => user.value?.role === "admin" || user.value?.role === "editor",
  );
  const currentUser = computed(() => user.value);

  /**
   * Initialize from localStorage
   */
  function initialize() {
    if (import.meta.client) {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const userJson = localStorage.getItem("user");

      if (storedAccessToken && userJson) {
        accessToken.value = storedAccessToken;
        refreshToken.value = storedRefreshToken;
        user.value = JSON.parse(userJson);
      }
    }
  }

  /**
   * Save auth data
   */
  function saveAuth(
    newAccessToken: string,
    newRefreshToken: string,
    newUser: User,
  ) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    user.value = newUser;

    if (import.meta.client) {
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  }

  /**
   * Clear auth data
   */
  function clearAuth() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    error.value = null;

    if (import.meta.client) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  /**
   * Register new user
   */
  async function register(email: string, password: string, name: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{
        success: boolean
        data: {
          tokens: { accessToken: string; refreshToken: string }
          user: User
        }
      }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, name }
      })

      if (response.success && response.data) {
        saveAuth(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken,
          response.data.user
        )
        return true
      }

      throw new Error('Registration failed')
      throw new Error("Registration failed");
    } catch (err: any) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Login user
   */
  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{
        success: boolean
        data: {
          tokens: { accessToken: string; refreshToken: string }
          user: User
        }
      }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success && response.data) {
        saveAuth(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken,
          response.data.user
        )
        return true
      }

      throw new Error('Login failed')
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout user
   */
  function logout() {
    clearAuth();
    navigateTo("/login");
  }

  /**
   * Check authentication on app load
   */
  function checkAuth() {
    initialize();
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isEditor,
    currentUser,
    initialize,
    saveAuth,
    clearAuth,
    register,
    login,
    logout,
    checkAuth,
  };
});
