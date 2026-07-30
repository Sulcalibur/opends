/**
 * API Composable — PocketBase-backed
 *
 * Auth is handled by the pb_auth httpOnly cookie, which the browser
 * sends automatically on same-origin requests. No manual token injection needed.
 */

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
}

export function useApi() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || "/api";

  async function request<T = any>(
    url: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // pb_auth cookie is sent automatically — no manual Authorization header

    try {
      const response = await $fetch<T>(`${apiBase}${url}`, {
        method: options.method || "GET",
        headers,
        body: options.body,
        credentials: 'include', // Ensure cookies are sent
      });

      return response;
    } catch (error: any) {
      if (error.statusCode === 401) {
        const authStore = useAuthStore();
        await authStore.logout();
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
