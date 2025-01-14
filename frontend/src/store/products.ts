import { create } from 'zustand';
import { Product } from '@/types';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface ProductStore {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  updateStock: (productId: number, newStock: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: true,
  fetchProducts: async () => {
    try {
      const { data } = await api.get('/products');
      set({ products: data, loading: false });
    } catch (error) {
      toast.error('Failed to fetch products');
      set({ loading: false });
    }
  },
  updateStock: (productId: number, newStock: number) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product
      ),
    }));
  },
}));
