// Default to localhost for local development; prod should set PERSONA_BASE_URL
const API_BASE =
  process.env.PERSONA_BASE_URL || "http://localhost:3000/api/v1";

// In-memory key storage for zero-config registration.
// Agents can call register() first, and the key is auto-stored for the session.
let apiKey: string | null = process.env.PERSONA_API_KEY || null;

export function setApiKey(key: string): void {
  apiKey = key;
}

export function getApiKey(): string | null {
  return apiKey;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
  skipAuth: boolean = false
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(!skipAuth && apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        ...(options.headers as Record<string, string>),
      },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      let errorMessage: string;
      if (contentType.includes("application/json")) {
        try {
          const errorBody = await res.json();
          errorMessage = errorBody.error || errorBody.message || `HTTP ${res.status}`;
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
      } else {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      return { data: null, error: errorMessage, status: res.status };
    }

    if (!contentType.includes("application/json")) {
      return { data: null, error: "Response is not JSON", status: res.status };
    }

    const data = await res.json();
    return { data, error: null, status: res.status };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
      status: 0,
    };
  }
}

export function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function textResult(text: string) {
  return {
    content: [{ type: "text" as const, text }],
  };
}

/**
 * Helper to handle API responses in tool handlers.
 * Returns jsonResult on success, textResult with error on failure.
 */
export function handleApiResponse<T>(response: ApiResponse<T>) {
  if (response.error) {
    return textResult(`Error: ${response.error}`);
  }
  return jsonResult(response.data);
}

export function buildQuery(
  params: Record<string, string | boolean | number | undefined | null>
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join("&")
  );
}
