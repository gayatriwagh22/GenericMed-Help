import { GoogleGenAI } from '@google/genai';
import { createHash } from 'node:crypto';
import { ApiError } from '../lib/http';

const cache = new Map<string, { expiresAt: number; value: unknown }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

const systemInstruction = `You are a medicine catalog assistant for GenericMed Help. You are not a doctor. Return only valid JSON. Never diagnose, prescribe, recommend a dose, or claim a medicine is safe for a person. Use cautious language, direct users to a licensed clinician or pharmacist for treatment decisions, and recommend urgent medical care for severe or emergency symptoms.`;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') throw new ApiError(503, 'AI_NOT_CONFIGURED', 'AI service is not configured');
  return new GoogleGenAI({ apiKey });
}

function cacheKey(operation: string, input: unknown) {
  return `${operation}:${createHash('sha256').update(JSON.stringify(input)).digest('hex')}`;
}

export async function generateJson<T>(operation: string, input: unknown, prompt: string, imageBase64?: string): Promise<T> {
  const key = cacheKey(operation, input);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value as T;
  
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [{ text: prompt }];
  if (imageBase64) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
  }
  
  const response = await getClient().models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: parts,
    config: { systemInstruction, responseMimeType: 'application/json', temperature: 0.1 },
  });
  if (!response.text) throw new ApiError(502, 'AI_EMPTY_RESPONSE', 'AI service returned an empty response');
  try {
    const value = JSON.parse(response.text) as T;
    cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch {
    throw new ApiError(502, 'AI_INVALID_RESPONSE', 'AI service returned an invalid response');
  }
}
