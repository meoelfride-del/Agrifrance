export type ProductImage = {
  src: string;
  alt: string;
  view: "principale" | "avant" | "laterale" | "cabine";
};

export type Product = {
  id: string;
  slug: string;
  nom: string;
  marque: string;
  modele: string;
  categorie: string;
  categorySlug: string;
  prix: number;
  ancienPrix: number;
  devise: "EUR";
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
