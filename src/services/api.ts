import type { Product, ProductImage } from "@/src/types/product";
import { products as fallbackProducts } from "@/src/data/products";

const DEFAULT_API_URL = "https://agrifrance-api.onrender.com";
export const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price_cents: string | number | null;
  currency: string;
  tax_included: boolean | null;
  price_source: string | null;
  price_checked_at: string | null;
  engine_power_hp: number;
  transmission_type: string;
  condition: "new" | "used";
  stock_status: string;
  category_slug?: string | null;
  technical_specs?: Record<string, unknown>;
  images?: Array<{ url: string; alt_text: string; is_illustration: boolean }>;
  specifications?: Array<{ name: string; value: string }>;
  stock_quantity?: number | null;
};

type ProductListResponse = { items: ApiProduct[]; pagination: { total: number } };
export type SparePart = { reference:string; name:string; compatibility:string; price_cents:number; currency:string; stock_status:string; stock_quantity:number; category:string };

const categoryFor = (row: ApiProduct) => {
  if (row.category_slug) return row.category_slug;
  const value = row.slug.toLowerCase();
  if (value.startsWith("terra-")) return "tracteurs";
  if (value.startsWith("harvest-")) return "moissonneuses-batteuses";
  if (value.startsWith("forage")) return "ensileuses";
  if (value.startsWith("field") || value.startsWith("cropguard")) return "pulverisateurs";
  if (value.includes("seed") || value.includes("planter")) return "semoirs";
  if (value.startsWith("cargo")) return "remorques";
  return "equipements-recolte";
};

const fallbackImage: Record<string, string> = {
  tracteurs: "/tractor-field.webp", "moissonneuses-batteuses": "/combine-harvester.webp",
  ensileuses: "/harvester-machine.webp", pulverisateurs: "/tractor-field.webp",
  semoirs: "/soil-work.webp", remorques: "/tractor-trailer.webp",
  "equipements-recolte": "/combine-harvester.webp",
};

export function toProduct(row: ApiProduct): Product {
  const categorySlug = categoryFor(row);
  const specs = row.technical_specs ?? {};
  const apiImages = row.images ?? [];
  const images: ProductImage[] = apiImages.length ? apiImages.map((image, index) => ({
    src: image.url, alt: image.alt_text, view: index === 0 ? "principale" : "laterale", illustration: image.is_illustration,
  })) : [{ src:fallbackImage[categorySlug] ?? "/tractor-field.webp", alt:`${row.name}, illustration de machine agricole`, view:"principale", illustration:true }];
  const cents = row.price_cents === null ? null : Number(row.price_cents);
  const price = cents === null || !Number.isFinite(cents) ? null : cents / 100;
  const year = typeof specs.year === "number" ? specs.year : 2026;
  const model = typeof specs.model === "string" ? specs.model : row.name.replace(new RegExp(`^${row.brand}\\s*`, "i"), "");
  const categoryNames: Record<string,string> = { tracteurs:"Tracteurs agricoles", "moissonneuses-batteuses":"Moissonneuses-batteuses", ensileuses:"Ensileuses", pulverisateurs:"Pulvérisateurs", semoirs:"Semoirs", remorques:"Remorques", "equipements-recolte":"Équipements de récolte" };
  return {
    id:row.id, slug:row.slug, nom:row.name, marque:row.brand, modele:model,
    categorie:categoryNames[categorySlug] ?? "Machines agricoles", categorySlug,
    prix:price, ancienPrix:null, devise:"EUR", taxIncluded:row.tax_included,
    priceSource:row.price_source, priceCheckedAt:row.price_checked_at,
    priceLabel:row.price_source ? "prix_verifie" : price === null ? "sur_devis" : "prix_catalogue",
    puissance:row.engine_power_hp ? `${row.engine_power_hp} ch` : "Selon application", powerValue:row.engine_power_hp,
    annee:year, transmission:row.transmission_type, heuresUtilisation:row.condition === "new" ? "0 h" : "Sur demande",
    etat:row.condition === "new" ? "Neuf" : "Occasion", stock:row.stock_quantity ?? (row.stock_status === "available" ? 1 : 0),
    descriptionCourte:typeof specs.description === "string" ? specs.description : "Machine agricole professionnelle disponible avec accompagnement, livraison et service après-vente.",
    descriptionComplete:typeof specs.description === "string" ? specs.description : `${row.name} est proposé avec une configuration adaptée à votre exploitation. Contactez AgriFrance pour confirmer les équipements, le délai et la livraison.`,
    caracteristiques:(row.specifications ?? []).map((item) => `${item.name} : ${item.value}`), images,
    vedette:true, promotion:false, disponible:row.stock_status === "available", popularite:50,
  };
}

async function apiFetch<T>(path: string, revalidate = 300): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { next:{ revalidate }, headers:{ accept:"application/json" } });
  if (!response.ok) throw new Error(`API AgriFrance indisponible (${response.status})`);
  return response.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const payload = await apiFetch<ProductListResponse>("/api/products?limit=50");
    return payload.items.length ? payload.items.map(toProduct) : fallbackProducts;
  } catch (error) {
    console.error("Impossible de charger le catalogue depuis l'API", error);
    return fallbackProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try { return toProduct(await apiFetch<ApiProduct>(`/api/products/${encodeURIComponent(slug)}`)); }
  catch { return fallbackProducts.find((product) => product.slug === slug) ?? null; }
}

export async function getSpareParts(): Promise<SparePart[]> {
  try { return (await apiFetch<{items:SparePart[]}>("/api/parts")).items; }
  catch (error) { console.error("Impossible de charger les pièces depuis l'API", error); return []; }
}
