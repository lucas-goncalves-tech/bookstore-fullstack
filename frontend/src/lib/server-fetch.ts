import { cookies } from "next/headers";

/**
 * Options for server-side fetch requests
 */
interface ServerFetchOptions {
  /** HTTP method (default: GET) */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** Request body (will be JSON stringified) */
  body?: unknown;
  /** Next.js cache option (default: no-store) */
  cache?: RequestCache;
  /** Next.js revalidation time in seconds */
  revalidate?: number;
  /** Additional headers to include */
  headers?: HeadersInit;
  /** Include refresh token cookie (default: false) */
  includeRefreshToken?: boolean;
  /** Public endpoint — skips auth requirement (default: false) */
  public?: boolean;
  /** Fetch timeout in milliseconds (default: 8000) */
  timeout?: number;
}

/**
 * Generic server-side fetch wrapper for authenticated API requests.
 *
 * Features:
 * - Automatically includes authentication cookies
 * - Returns null on 401 (allows client-side fallback with refresh)
 * - Type-safe with generics
 * - Supports all HTTP methods
 * - Handles errors gracefully
 *
 * @example
 * ```typescript
 * // Simple GET request
 * const data = await serverFetch<DashboardMetrics>('/admin/dashboard');
 *
 * // POST request with body
 * const result = await serverFetch<Book>('/books', {
 *   method: 'POST',
 *   body: { title: 'New Book', author: 'John Doe' }
 * });
 *
 * // With custom cache
 * const data = await serverFetch<Category[]>('/categories', {
 *   revalidate: 3600 // 1 hour
 * });
 * ```
 *
 * @param endpoint - API endpoint (e.g., '/admin/dashboard')
 * @param options - Fetch options
 * @returns Parsed JSON response or null if request fails or returns 401
 */
export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  const {
    method = "GET",
    body,
    cache = "no-store",
    revalidate,
    headers: customHeaders = {},
    includeRefreshToken = false,
    public: isPublic = false,
    timeout = 8000,
  } = options;

  try {
    // Get cookies (Next.js 15: cookies() returns a Promise)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Build cookie header
    const cookieHeader: string[] = [];
    if (accessToken) {
      cookieHeader.push(`accessToken=${accessToken}`);
    }
    if (includeRefreshToken && refreshToken) {
      cookieHeader.push(`refreshToken=${refreshToken}`);
    }

    // If no access token and endpoint requires auth, return null (client will handle)
    if (!accessToken && !isPublic) {
      return null;
    }

    // Build request headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(customHeaders).entries()),
    };

    // Only include cookie header if there are cookies
    if (cookieHeader.length > 0) {
      requestHeaders.Cookie = cookieHeader.join("; ");
    }

    // Build request options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      signal: AbortSignal.timeout(timeout),
      ...(revalidate !== undefined && { next: { revalidate } }),
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    // Make request
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    const url = `${apiUrl}${endpoint}`;

    const response = await fetch(url, fetchOptions);

    // Handle 401 - token expired, return null for client fallback
    if (response.status === 401) {
      return null;
    }

    // Handle other errors
    if (!response.ok) {
      console.error(`[serverFetch] Error ${response.status} for ${endpoint}`);
      return null;
    }

    // Parse and return JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`[serverFetch] Exception for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Convenience wrapper for GET requests
 *
 * @example
 * ```typescript
 * const books = await serverGet<Book[]>('/books');
 * ```
 */
export async function serverGet<T>(
  endpoint: string,
  options?: Omit<ServerFetchOptions, "method" | "body">,
): Promise<T | null> {
  return serverFetch<T>(endpoint, { ...options, method: "GET" });
}

/**
 * Convenience wrapper for POST requests
 *
 * @example
 * ```typescript
 * const newBook = await serverPost<Book>('/books', {
 *   title: 'New Book',
 *   author: 'John Doe'
 * });
 * ```
 */
export async function serverPost<T>(
  endpoint: string,
  body: unknown,
  options?: Omit<ServerFetchOptions, "method" | "body">,
): Promise<T | null> {
  return serverFetch<T>(endpoint, { ...options, method: "POST", body });
}

/**
 * Convenience wrapper for PUT requests
 */
export async function serverPut<T>(
  endpoint: string,
  body: unknown,
  options?: Omit<ServerFetchOptions, "method" | "body">,
): Promise<T | null> {
  return serverFetch<T>(endpoint, { ...options, method: "PUT", body });
}

/**
 * Convenience wrapper for DELETE requests
 */
export async function serverDelete<T>(
  endpoint: string,
  options?: Omit<ServerFetchOptions, "method" | "body">,
): Promise<T | null> {
  return serverFetch<T>(endpoint, { ...options, method: "DELETE" });
}
