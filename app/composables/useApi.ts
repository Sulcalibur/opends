/**
 * API Composable
 * Provides authenticated API calls with automatic token injection
 */

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
}

export function useApi() {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const apiBase = config.public.apiBase || "/api";

  /**
   * Make authenticated API request
   */
  async function request<T = any>(
    url: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    try {
      const response = await $fetch<T>(`${apiBase}${url}`, {
        method: options.method || "GET",
        headers,
        body: options.body,
      });

      return response;
    } catch (error: any) {
      // Handle 401 - token expired
      if (error.statusCode === 401) {
        authStore.logout();
        navigateTo("/login");
      }

      throw error;
    }
  }

  return {
    // Generic request
    request,

    // Convenience methods
    get: <T = any>(
      url: string,
      options?: Omit<RequestOptions, "method" | "body">,
    ) => request<T>(url, { ...options, method: "GET" }),

    post: <T = any>(
      url: string,
      data?: any,
      options?: Omit<RequestOptions, "method" | "body">,
    ) => request<T>(url, { ...options, method: "POST", body: data }),

    put: <T = any>(
      url: string,
      data?: any,
      options?: Omit<RequestOptions, "method" | "body">,
    ) => request<T>(url, { ...options, method: "PUT", body: data }),

    patch: <T = any>(
      url: string,
      data?: any,
      options?: Omit<RequestOptions, "method" | "body">,
    ) => request<T>(url, { ...options, method: "PATCH", body: data }),

    delete: <T = any>(
      url: string,
      options?: Omit<RequestOptions, "method" | "body">,
    ) => request<T>(url, { ...options, method: "DELETE" }),
  };
}
