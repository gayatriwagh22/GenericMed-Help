import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, X, FileText, AlertCircle } from 'lucide-react';
import { ParsedPrescriptionMedicine } from '../types';
import { parsePrescription } from '../api/ai';
import { ApiClientError } from '../api/client';

interface PrescriptionOCRScreenProps {
  onBack: () => void;
  onMedicinesParsed?: (medicines: ParsedPrescriptionMedicine[]) => void;
}

export const PrescriptionOCRScreen: React.FC<PrescriptionOCRScreenProps> = ({ onBack, onMedicinesParsed }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parsedMedicines, setParsedMedicines] = useState<ParsedPrescriptionMedicine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }
    setImageFile(file);
    setError(null);
    setParsedMedicines([]);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setParsedMedicines([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleParse = async () => {
    if (!imageFile || !imagePreview) return;
    setIsProcessing(true);
    setError(null);
    try {
      // Extract base64 from data URL
      const base64 = imagePreview.split(',')[1];
      const result = await parsePrescription(base64);
      setParsedMedicines(result.data.medicines);
      if (onMedicinesParsed) onMedicinesParsed(result.data.medicines);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Unable to parse prescription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] p-4 pb-24 text-[#131b2e]">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-teal-700">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </button>

      <main className="mx-auto mt-6 max-w-xl space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <FileText className="h-7 w-7 shrink-0 text-teal-700" />
            <div>
              <h1 className="text-lg font-bold">Prescription Upload</h1>
              <p className="mt-1 text-sm text-slate-600">
                Upload a photo of your prescription and we'll extract the medicine names using AI.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {!imagePreview ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 text-sm font-medium text-slate-700 transition-colors hover:border-teal-600 hover:bg-teal-50 hover:text-teal-900"
                >
                  <Upload className="h-5 w-5" />
                  Choose an image file
                </button>

                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.setAttribute('capture', 'environment');
                    fileInputRef.current?.click();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Camera className="h-5 w-5" />
                  Take a photo
                </button>
              </>
            ) : (
              <div className="relative">
                <img src={imagePreview} alt="Prescription preview" className="w-full rounded-xl border border-slate-200" />
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1.5 text-white transition-colors hover:bg-slate-900"
                  aria-label="Clear image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {imagePreview && parsedMedicines.length === 0 && (
              <button
                type="button"
                onClick={handleParse}
                disabled={isProcessing}
                className="w-full rounded-xl bg-teal-700 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-800 disabled:bg-slate-300"
              >
                {isProcessing ? 'Parsing prescription...' : 'Extract medicines'}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {parsedMedicines.length > 0 && (
            <div className="mt-5 space-y-3">
              <h2 className="font-bold text-slate-900">Extracted Medicines</h2>
              {parsedMedicines.map((med, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                  <div className="font-bold text-slate-900">{med.name}</div>
                  {med.dosage && <div className="mt-0.5 text-xs text-slate-600">Dosage: {med.dosage}</div>}
                  {med.quantity && <div className="mt-0.5 text-xs text-slate-600">Quantity: {med.quantity}</div>}
                  {med.notes && <div className="mt-0.5 text-xs text-slate-500">Note: {med.notes}</div>}
                </div>
              ))}
              <p className="text-xs text-slate-600">
                Results are AI-generated and may contain errors. Please review and edit before searching or adding to cart.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
