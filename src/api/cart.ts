import { apiFetch, withAuth } from './client';

export type ApiCartItem = { id: string; medicine: unknown; offer: unknown; strengthId: string; formId: string; packSizeId: string; quantity: number };
export const getCart = (token: string) => apiFetch<{ data: ApiCartItem[] }>('/cart', { headers: withAuth(token) });
export const addToCart = (token: string, item: { medicineId: string; strengthId: string; formId: string; packSizeId: string; offerId: string }) => apiFetch<{ data: ApiCartItem[] }>('/cart', { method: 'POST', headers: withAuth(token), body: JSON.stringify(item) });
export const updateCartItem = (token: string, itemId: string, quantity: number) => apiFetch<{ data: ApiCartItem[] }>(`/cart/${itemId}`, { method: 'PUT', headers: withAuth(token), body: JSON.stringify({ quantity }) });
export const removeCartItem = (token: string, itemId: string) => apiFetch<void>(`/cart/${itemId}`, { method: 'DELETE', headers: withAuth(token) });
