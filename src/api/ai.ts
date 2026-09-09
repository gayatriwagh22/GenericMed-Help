import { apiFetch } from './client';

const aiDisclaimer = 'AI-generated information is for medicine-catalog discovery and education only; it is not medical advice.';

export type AiSearchResult = { data: { suggestions: Array<{ medicineId: string; confidence: number; rationale: string }>; source: 'catalog_fallback' | 'gemini'; disclaimer: string } };
export const aiSearchMedicines = (query: string) => apiFetch<AiSearchResult>('/ai/search', { method: 'POST', body: JSON.stringify({ query }) });

export const checkInteractions = (medicines: string[]) => apiFetch<{ data: { severity: 'unknown' | 'review'; summary: string; cautions: string[]; disclaimer: string } }>('/ai/interactions', { method: 'POST', body: JSON.stringify({ medicines }) });

export const getDosageSafetyGuidance = (input: { medicine: string; age?: number; weight?: number; condition?: string }) => apiFetch<{ data: { safetyGuidance: string[]; disclaimer: string } }>('/ai/dosage', { method: 'POST', body: JSON.stringify(input) });
export { aiDisclaimer };

export const parsePrescription = (base64Image: string) => 
  apiFetch<{ data: { medicines: Array<{ name: string; dosage?: string; quantity?: string; notes?: string }> } }>('/ai/ocr', { 
    method: 'POST', 
    body: JSON.stringify({ image: base64Image }) 
  });
