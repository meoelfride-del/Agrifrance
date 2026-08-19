export type ProductImage = {
  src: string;
  alt: string;
  view: "principale" | "avant" | "laterale" | "cabine";
  illustration: boolean;
};

export type Product = {
  id: string;
  slug: string;
  nom: string;
  marque: string;
  modele: string;
  categorie: string;
  categorySlug: string;
  prix: number | null;
  ancienPrix: number | null;
  devise: "EUR";
  taxIncluded: boolean | null;
  priceSource: string | null;
  priceCheckedAt: string | null;
  priceLabel: "sur_devis" | "prix_catalogue" | "prix_verifie";
  puissance: string;
  powerValue: number;
  annee: number;
  transmission: string;
  heuresUtilisation: string;
  etat: "Neuf" | "Occasion" | "Reconditionné";
  stock: number;
  descriptionCourte: string;
  descriptionComplete: string;
  caracteristiques: string[];
  images: ProductImage[];
  vedette: boolean;
  promotion: boolean;
  disponible: boolean;
  popularite: number;
};

export type CartItem = { productId: string; quantity: number };
