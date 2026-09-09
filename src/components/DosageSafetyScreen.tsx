import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

import { getDosageSafetyGuidance } from '../api/ai';
import { ApiClientError } from '../api/client';

interface DosageSafetyScreenProps {
  medicine: string;
  onBack: () => void;
}

const MAX_AGE = 120;
const MAX_WEIGHT_KG = 500;

export const DosageSafetyScreen: React.FC<DosageSafetyScreenProps> = ({ medicine, onBack }) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [condition, setCondition] = useState('');
  const [guidance, setGuidance] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestGuidance = async () => {
    const ageValue = age ? Number(age) : undefined;
    const weightValue = weight ? Number(weight) : undefined;
    if (age && (!Number.isInteger(ageValue) || ageValue < 0 || ageValue > MAX_AGE)) {
      setError(`Enter an age from 0 to ${MAX_AGE} years.`);
      return;
    }
    if (weight && (!Number.isFinite(weightValue) || weightValue <= 0 || weightValue > MAX_WEIGHT_KG)) {
      setError(`Enter a weight between 0 and ${MAX_WEIGHT_KG} kg.`);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await getDosageSafetyGuidance({ medicine, age: ageValue, weight: weightValue, condition: condition.trim() || undefined });
      setGuidance(response.data.safetyGuidance);
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : 'Safety guidance is currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-[#faf8ff] p-4 pb-24 text-[#131b2e]"><button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-teal-700"><ArrowLeft className="w-4 h-4" /> Back to medicine</button><main className="mx-auto mt-6 max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex gap-3"><ShieldAlert className="w-7 h-7 shrink-0 text-amber-700" /><div><h1 className="text-lg font-bold">Medicine safety guidance</h1><p className="mt-1 text-sm text-slate-600">For {medicine}. This tool does not provide a dose or replace a clinician.</p></div></div><div className="mt-5 grid grid-cols-2 gap-3"><label className="text-sm font-medium">Age (optional)<input value={age} onChange={(event) => setAge(event.target.value)} inputMode="numeric" max={MAX_AGE} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="text-sm font-medium">Weight in kg (optional)<input value={weight} onChange={(event) => setWeight(event.target.value)} inputMode="decimal" max={MAX_WEIGHT_KG} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label></div><label className="mt-3 block text-sm font-medium">Condition or concern (optional)<input value={condition} onChange={(event) => setCondition(event.target.value)} maxLength={200} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label><button type="button" onClick={requestGuidance} disabled={loading} className="mt-5 w-full rounded-xl bg-teal-700 py-3 text-sm font-bold text-white disabled:bg-slate-300">{loading ? 'Reviewing safety considerations…' : 'Get safety questions'}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{guidance && <section className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><h2 className="font-bold text-amber-900">Discuss these with a clinician or pharmacist</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{guidance.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-3 text-xs text-slate-600">AI-generated information is for education only, not medical advice.</p></section>}</main></div>;
};
