import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft, Plus, ShieldCheck, X } from 'lucide-react';
import { checkInteractions } from '../api/ai';
import { ApiClientError } from '../api/client';

interface InteractionCheckerProps { onBack: () => void; }

export const InteractionChecker: React.FC<InteractionCheckerProps> = ({ onBack }) => {
  const [entry, setEntry] = useState('');
  const [medicines, setMedicines] = useState<string[]>([]);
  const [result, setResult] = useState<{ severity: 'unknown' | 'review'; summary: string; cautions: string[]; disclaimer: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addMedicine = () => {
    const name = entry.trim();
    if (!name || medicines.includes(name) || medicines.length === 10) return;
    setMedicines([...medicines, name]); setEntry(''); setResult(null);
  };
  const runCheck = async () => {
    if (medicines.length < 2) { setError('Add at least two medicines to check.'); return; }
    try { setLoading(true); setError(null); setResult((await checkInteractions(medicines)).data); }
    catch (cause) { setError(cause instanceof ApiClientError ? cause.message : 'The interaction checker is unavailable.'); }
    finally { setLoading(false); }
  };
  return <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] p-4 pb-24">
    <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-teal-700"><ArrowLeft className="w-4 h-4" /> Back to catalog</button>
    <div className="mt-6 max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start gap-3"><div className="p-2 rounded-xl bg-amber-50 text-amber-700"><ShieldCheck className="w-6 h-6" /></div><div><h1 className="text-lg font-bold">Medicine interaction checker</h1><p className="text-sm text-slate-600 mt-1">Add medicines to generate questions and cautions for a pharmacist or clinician.</p></div></div>
      <div className="mt-5 flex gap-2"><input value={entry} onChange={event => setEntry(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addMedicine(); } }} placeholder="e.g. Paracetamol" className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" /><button type="button" onClick={addMedicine} className="rounded-xl bg-teal-700 text-white px-3" aria-label="Add medicine"><Plus className="w-5 h-5" /></button></div>
      <div className="mt-3 flex flex-wrap gap-2">{medicines.map(medicine => <span key={medicine} className="inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-800 px-3 py-1 text-sm font-medium">{medicine}<button type="button" onClick={() => { setMedicines(medicines.filter(item => item !== medicine)); setResult(null); }} aria-label={`Remove ${medicine}`}><X className="w-3.5 h-3.5" /></button></span>)}</div>
      <button type="button" disabled={loading || medicines.length < 2} onClick={runCheck} className="mt-5 w-full rounded-xl bg-teal-700 disabled:bg-slate-300 text-white py-3 text-sm font-bold">{loading ? 'Checking…' : 'Check interactions'}</button>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {result && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex gap-2 text-amber-900"><AlertTriangle className="w-5 h-5 shrink-0" /><div><p className="font-bold">Professional review recommended</p><p className="mt-1 text-sm">{result.summary}</p></div></div><ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">{result.cautions.map(caution => <li key={caution}>{caution}</li>)}</ul><p className="mt-3 text-xs text-slate-600">{result.disclaimer}</p></div>}
    </div>
  </div>;
};
