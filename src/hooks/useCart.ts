import { useState, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, ApiCartItem } from '../api/cart';

interface UseCartReturn {
  items: ApiCartItem[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (item: { medicineId: string; strengthId: string; formId: string; packSizeId: string; offerId: string }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearLocal: () => void;
}

export function useCart(accessToken: string | null): UseCartReturn {
  const [items, setItems] = useState<ApiCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getCart(accessToken);
      setItems(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const addItem = useCallback(async (item: { medicineId: string; strengthId: string; formId: string; packSizeId: string; offerId: string }) => {
    if (!accessToken) return;
    try {
      setLoading(true);
      setError(null);
      const result = await addToCart(accessToken, item);
      setItems(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const result = await updateCartItem(accessToken, itemId, quantity);
      setItems(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!accessToken) return;
    try {
      setLoading(true);
      await removeCartItem(accessToken, itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const clearLocal = useCallback(() => {
    setItems([]);
  }, []);

  return { items, loading, error, fetchCart, addItem, updateItem, removeItem, clearLocal };
}
