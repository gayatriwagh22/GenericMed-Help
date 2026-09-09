import { Order } from '../types';
import { apiFetch, withAuth } from './client';

export const placeOrder = (token: string, idempotencyKey: string, payload: { deliveryAddress: Order['deliveryAddress']; paymentMethod: string }) => apiFetch<{ data: Order }>('/orders', { method: 'POST', headers: { ...withAuth(token), 'Idempotency-Key': idempotencyKey }, body: JSON.stringify(payload) });
export const getOrder = (token: string, orderId: string) => apiFetch<{ data: Order }>(`/orders/${orderId}`, { headers: withAuth(token) });
export const getOrderTracking = (token: string, orderId: string) => apiFetch<{ data: { orderId: string; status: Order['status']; estimatedDelivery: string; updatedAt: string } }>(`/orders/${orderId}/tracking`, { headers: withAuth(token) });
