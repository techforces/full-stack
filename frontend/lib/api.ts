export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
  });
}
