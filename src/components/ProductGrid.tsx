import type { Product } from "@/src/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return <div className="product-grid">{products.map((product, index) => <ProductCard product={product} priority={index < priorityCount} key={product.id}/>)}</div>;
}
