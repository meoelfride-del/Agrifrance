"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productById } from "@/src/data/products";

const FAVORITES_KEY = "agrifrance-favorites-v1";
const COMPARE_KEY = "agrifrance-compare-v1";

type PreferenceContextValue = {
  favorites: string[];
  compared: string[];
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
};

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

export function PreferenceProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compared, setCompared] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const parse = (key: string) => {
        try {
          const value = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown;
          return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string" && Boolean(productById(id))) : [];
        } catch { return []; }
      };
      setFavorites(parse(FAVORITES_KEY));
      setCompared(parse(COMPARE_KEY).slice(0, 3));
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites, ready]);
  useEffect(() => { if (ready) localStorage.setItem(COMPARE_KEY, JSON.stringify(compared)); }, [compared, ready]);

  const toggleFavorite = useCallback((id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]), []);
  const toggleCompare = useCallback((id: string) => setCompared((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current.slice(-2), id]), []);
  const value = useMemo(() => ({ favorites, compared, toggleFavorite, toggleCompare }), [compared, favorites, toggleCompare, toggleFavorite]);
  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferenceContext);
  if (!value) throw new Error("usePreferences must be used within PreferenceProvider");
  return value;
}
