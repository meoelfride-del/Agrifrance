"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Product } from "@/src/types/product";

const ProductCatalogContext = createContext<Product[]>([]);
export function ProductCatalogProvider({ products, children }: { products:Product[]; children:ReactNode }) {
  return <ProductCatalogContext.Provider value={products}>{children}</ProductCatalogContext.Provider>;
}
export const useProductCatalog = () => useContext(ProductCatalogContext);
