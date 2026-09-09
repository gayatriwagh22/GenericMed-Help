interface ViteImportMeta extends ImportMeta {
  env?: { VITE_API_BASE_URL?: string };
}

const API_BASE_URL = (import.meta as ViteImportMeta).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

export class ApiClientError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (response.status === 204) return undefined as T;
  const body = await response.json();
  if (!response.ok) throw new ApiClientError(response.status, body.code || 'REQUEST_FAILED', body.error || 'Request failed');
  return body as T;
}

export const withAuth = (token: string): HeadersInit => ({ Authorization: `Bearer ${token}` });
