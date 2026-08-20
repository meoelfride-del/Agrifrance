"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useProductCatalog } from "@/src/context/ProductCatalogContext";
import type { CartItem, Product } from "@/src/types/product";

const STORAGE_KEY = "agrifrance-cart-v1";

type DetailedCartItem = CartItem & { product: Product };
type CartContextValue = {
  items: DetailedCartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const products = useProductCatalog();
  const productById = useCallback((id:string) => products.find((product) => product.id === id), [products]);
  const [storedItems, setStoredItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartItem[];
        setStoredItems(Array.isArray(parsed) ? parsed.filter((item) => productById(item.productId) && item.quantity > 0) : []);
      } catch { setStoredItems([]); }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [productById]);

  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems)); }, [hydrated, storedItems]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setStoredItems((current) => {
      const found = current.find((item) => item.productId === productId);
      return found
        ? current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item)
        : [...current, { productId, quantity: Math.max(1, quantity) }];
    });
    setOpen(true);
  }, []);
  const removeItem = useCallback((productId: string) => setStoredItems((current) => current.filter((item) => item.productId !== productId)), []);
  const updateQuantity = useCallback((productId: string, quantity: number) => setStoredItems((current) => current.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) } : item)), []);
  const clear = useCallback(() => setStoredItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = storedItems.flatMap((item) => { const product = productById(item.productId); return product ? [{ ...item, product }] : []; });
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.product.prix ?? 0) * item.quantity, 0);
    const shipping = subtotal ? Math.max(450, Math.round(subtotal * 0.025)) : 0;
    return { items, count, subtotal, shipping, total: subtotal + shipping, isOpen, setOpen, addItem, removeItem, updateQuantity, clear };
  }, [addItem, clear, isOpen, productById, removeItem, storedItems, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
