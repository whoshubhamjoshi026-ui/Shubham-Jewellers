/**
 * Helper to construct full API URL based on VITE_API_BASE_URL environment variable.
 * If path is relative (starts with /), prepends VITE_API_BASE_URL if configured.
 */
export function getApiUrl(path: string): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL || '';
  const baseUrl = envBase.trim().replace(/\/+$/, '');
  if (baseUrl && path.startsWith('/')) {
    return `${baseUrl}${path}`;
  }
  return path;
}

/**
 * Safe fetch wrapper that handles offline backend, non-JSON or HTML responses (e.g. 404/Vite fallback)
 * without throwing "Unexpected token '<', <!doctype..." syntax errors.
 */
export async function safeFetchJson<T = any>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const fullUrl = getApiUrl(path);
    const method = options?.method?.toUpperCase() || 'GET';
    // Append timestamp for GET requests to bypass browser cache
    const finalUrl = method === 'GET' 
      ? (fullUrl.includes('?') ? `${fullUrl}&_t=${Date.now()}` : `${fullUrl}?_t=${Date.now()}`)
      : fullUrl;

    const res = await fetch(finalUrl, {
      cache: 'no-store',
      ...options,
      headers: {
        'Cache-Control': 'no-cache',
        ...options?.headers,
      },
    });
    const contentType = res.headers.get('content-type') || '';
    
    // If response is not OK or is HTML (e.g. <!DOCTYPE html> from Vite fallback), return null
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }
    
    const text = await res.text();
    if (!text || text.trim().startsWith('<')) {
      return null;
    }
    
    return JSON.parse(text) as T;
  } catch (err) {
    // Network error or fetch failure
    return null;
  }
}
