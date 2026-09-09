import { CanonicalMedicine, PharmacyOffer } from '../types';
import { apiFetch } from './client';

export const getMedicines = (page = 1, limit = 20) => apiFetch<{ data: CanonicalMedicine[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/medicines?page=${page}&limit=${limit}`);
export const getMedicine = (id: string) => apiFetch<{ data: CanonicalMedicine }>(`/medicines/${id}`);
export const searchMedicines = (query: string) => apiFetch<{ data: CanonicalMedicine[] }>(`/medicines/search?q=${encodeURIComponent(query)}`);
export const getMedicineOffers = (id: string) => apiFetch<{ data: PharmacyOffer[] }>(`/medicines/${id}/offers`);
