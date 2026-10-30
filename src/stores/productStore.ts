import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
}

interface ProductStore {
  products: Product[];
  updateStock: (id: string, newStock: number) => void;
  reduceStock: (id: string, quantity: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const initialProducts: Product[] = [
  { id: "1", name: "Espresso", price: 3.50, category: "Coffee", stock: 100 },
  { id: "2", name: "Cappuccino", price: 4.50, category: "Coffee", stock: 85 },
  { id: "3", name: "Latte", price: 5.00, category: "Coffee", stock: 72 },
  { id: "4", name: "Americano", price: 3.75, category: "Coffee", stock: 90 },
  { id: "5", name: "Croissant", price: 3.25, category: "Pastry", stock: 24 },
  { id: "6", name: "Blueberry Muffin", price: 3.50, category: "Pastry", stock: 18 },
  { id: "7", name: "Chocolate Cake", price: 5.50, category: "Pastry", stock: 12 },
  { id: "8", name: "Bagel", price: 2.75, category: "Pastry", stock: 30 },
  { id: "9", name: "Orange Juice", price: 4.00, category: "Beverages", stock: 45 },
  { id: "10", name: "Iced Tea", price: 3.50, category: "Beverages", stock: 60 },
  { id: "11", name: "Smoothie", price: 6.00, category: "Beverages", stock: 35 },
  { id: "12", name: "Sandwich", price: 7.50, category: "Food", stock: 20 },
  { id: "13", name: "Spoon", price: 0, category: "Utensils", stock: 100 },
  { id: "14", name: "Fork", price: 0, category: "Utensils", stock: 100 },
  { id: "15", name: "Cup", price: 0, category: "Utensils", stock: 80 },
  { id: "16", name: "Straw", price: 0, category: "Utensils", stock: 150 },
  { id: "17", name: "Plate", price: 0, category: "Utensils", stock: 50 },
  { id: "18", name: "Tissue", price: 0, category: "Utensils", stock: 200 },
  { id: "19", name: "Takeaway Container", price: 0, category: "Utensils", stock: 75 },
];

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: initialProducts,
      updateStock: (id, newStock) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, newStock) } : p
          ),
        })),
      reduceStock: (id, quantity) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
          ),
        })),
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'product-storage',
    }
  )
);
