import { useState, useEffect, useCallback } from 'react';
import { CanonicalMedicine, PharmacyOffer } from '../types';
import { getMedicines, searchMedicines, getMedicineOffers } from '../api/medicines';

interface UseMedicinesReturn {
  medicines: CanonicalMedicine[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMedicines(): UseMedicinesReturn {
  const [medicines, setMedicines] = useState<CanonicalMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMedicines(1, 100);
      setMedicines(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return { medicines, loading, error, refetch: fetchMedicines };
}

interface UseOffersReturn {
  offers: PharmacyOffer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOffers(medicineId: string | undefined): UseOffersReturn {
  const [offers, setOffers] = useState<PharmacyOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!medicineId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getMedicineOffers(medicineId);
      setOffers(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  }, [medicineId]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return { offers, loading, error, refetch: fetchOffers };
}
