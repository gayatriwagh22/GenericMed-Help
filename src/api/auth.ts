import { UserProfile } from '../types';
import { apiFetch } from './client';

type AuthResponse = { data: { user: UserProfile; accessToken: string; refreshToken: string } };
export const register = (payload: { fullName: string; email: string; phone: string; password: string; role?: UserProfile['role'] }) => apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const login = (email: string, password: string) => apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
