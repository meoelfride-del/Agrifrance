import type { Product } from "@/src/types/product";

export const INDICATIVE_PRICE_NOTICE =
  "Prix indicatif pouvant varier selon la configuration, les options, le transport et le pays de livraison.";

type CategorySeed = {
  name: string;
  slug: string;
  prefix: string;
  image: string;
  basePrice: number;
  priceStep: number;
  powerBase: number;
  powerStep: number;
  transmission: string[];
  summary: string;
  specs: string[];
};

const brands = ["AgriFrance", "TerraNova", "FieldPro", "AgroMax", "Cultivance", "Horizon Farm"];
const series = ["100", "220", "360", "480", "600"];

export const categorySeeds: CategorySeed[] = [
  { name:"Tracteurs agricoles",slug:"tracteurs",prefix:"Terra",image:"/tractor-hero.webp",basePrice:68000,priceStep:9300,powerBase:95,powerStep:13,transmission:["Mécanique 24×24","Powershift","CVT"],summary:"Tracteur polyvalent conçu pour les exploitations exigeantes.",specs:["Relevage électronique","Hydraulique load-sensing","Cabine suspendue","Pré-équipement GPS"] },
  { name:"Moissonneuses-batteuses",slug:"moissonneuses-batteuses",prefix:"Harvest",image:"/harvester-machine.webp",basePrice:245000,priceStep:14500,powerBase:260,powerStep:12,transmission:["Hydrostatique","HydroDrive","4 roues motrices"],summary:"Récolte à haut débit avec préservation de la qualité du grain.",specs:["Réglage automatique","Cartographie de rendement","Trémie grand volume","Caméra arrière"] },
  { name:"Ensileuses",slug:"ensileuses",prefix:"Forage",image:"/harvester-machine.webp",basePrice:315000,priceStep:16800,powerBase:420,powerStep:18,transmission:["Hydrostatique","4RM hydrostatique","ProDrive"],summary:"Ensileuse performante pour un débit régulier et une coupe homogène.",specs:["Détecteur de métaux","Éclateur réglable","Guidage de rang","Dosage inoculant"] },
  { name:"Pulvérisateurs",slug:"pulverisateurs",prefix:"FieldSpray",image:"/harvester-machine.webp",basePrice:29500,priceStep:3200,powerBase:24,powerStep:1,transmission:["DPAE","ISOBUS","GPS RTK"],summary:"Application précise avec maîtrise des intrants et coupure de sections.",specs:["Coupure automatique","Rinçage embarqué","Buses anti-dérive","Contrôle de hauteur"] },
  { name:"Semoirs",slug:"semoirs",prefix:"SeedMaster",image:"/trailer-machine.webp",basePrice:24500,priceStep:3600,powerBase:3,powerStep:1,transmission:["Mécanique","Dosage électrique","ISOBUS"],summary:"Implantation régulière pour une levée homogène dans toutes les conditions.",specs:["Dosage précis","Contrôle de descente","Jalonnage automatique","Trémie pressurisée"] },
  { name:"Presses à balles",slug:"presses-balles",prefix:"BalePro",image:"/trailer-machine.webp",basePrice:34000,priceStep:4100,powerBase:90,powerStep:4,transmission:["Prise de force 540","PTO 1000","ISOBUS"],summary:"Pressage dense et fiable pour optimiser le stockage des fourrages.",specs:["Liage filet","Contrôle de densité","Ramasseur renforcé","Graissage automatique"] },
  { name:"Chargeurs",slug:"chargeurs",prefix:"LoadMax",image:"/tractor-hero.webp",basePrice:52000,priceStep:5600,powerBase:75,powerStep:6,transmission:["Hydrostatique","Powershift","CVT compacte"],summary:"Manutention agile, visibilité panoramique et forte capacité de levage.",specs:["Attache rapide","Joystick proportionnel","Caméra outil","Stabilisation de charge"] },
  { name:"Travail du sol",slug:"travail-sol",prefix:"SoilPro",image:"/trailer-machine.webp",basePrice:12500,priceStep:2100,powerBase:120,powerStep:7,transmission:["Porté","Semi-porté","Traîné"],summary:"Préparation du sol efficace avec profondeur constante et faible traction.",specs:["Sécurité non-stop","Réglage hydraulique","Rouleau packer","Éclairage routier"] },
  { name:"Équipements de récolte",slug:"equipements-recolte",prefix:"CropFlow",image:"/harvester-machine.webp",basePrice:18500,priceStep:2800,powerBase:6,powerStep:1,transmission:["Entraînement mécanique","Hydraulique","ISOBUS"],summary:"Équipement robuste pour préserver le produit et accélérer les chantiers.",specs:["Hauteur automatique","Protection surcharge","Attelage rapide","Kit transport"] },
  { name:"Pièces et accessoires",slug:"pieces-accessoires",prefix:"AgriParts",image:"/trailer-machine.webp",basePrice:180,priceStep:95,powerBase:0,powerStep:0,transmission:["Universel","OEM compatible","Renforcé"],summary:"Pièce sélectionnée pour maintenir disponibilité et performance du parc.",specs:["Compatibilité vérifiée","Garantie 12 mois","Traçabilité lot","Support technique"] },
];

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const makeImages = (seed: CategorySeed, name: string) => ([
  { src: seed.image, alt: `${name}, vue principale — visuel de démonstration`, view: "principale" as const },
  { src: seed.image, alt: `${name}, vue avant — visuel de démonstration`, view: "avant" as const },
  { src: seed.image, alt: `${name}, vue latérale — visuel de démonstration`, view: "laterale" as const },
  { src: seed.image, alt: `${name}, cabine ou équipement — visuel de démonstration`, view: "cabine" as const },
]);

export const products: Product[] = categorySeeds.flatMap((seed, categoryIndex) =>
  Array.from({ length: 30 }, (_, index) => {
    const brand = brands[index % brands.length]!;
    const model = `${seed.prefix} ${series[index % series.length]}${String.fromCharCode(65 + Math.floor(index / 5))}`;
    const nom = `${brand} ${model}`;
    const promotion = index % 7 === 0;
    const prix = seed.basePrice + seed.priceStep * index + categoryIndex * 750;
    const power = seed.powerBase + seed.powerStep * index;
    const state = index % 9 === 0 ? "Occasion" : index % 13 === 0 ? "Reconditionné" : "Neuf";
    return {
      id: `${seed.slug}-${String(index + 1).padStart(2, "0")}`,
      slug: slugify(nom), nom, marque: brand, modele: model,
      categorie: seed.name, categorySlug: seed.slug,
      prix, ancienPrix: promotion ? Math.round(prix * 1.12) : 0, devise: "EUR" as const,
      puissance: power ? `${power} ch` : "Selon application", powerValue: power,
      annee: 2026 - (index % 5), transmission: seed.transmission[index % seed.transmission.length]!,
      heuresUtilisation: state === "Neuf" ? "0 h" : `${420 + index * 73} h`,
      etat: state as Product["etat"], stock: index % 11 === 0 ? 0 : 1 + (index % 6),
      descriptionCourte: seed.summary,
      descriptionComplete: `${seed.summary} Le modèle ${model} associe robustesse, simplicité d’entretien et technologies utiles pour réduire le coût par hectare.`,
      caracteristiques: [...seed.specs, `Année ${2026 - (index % 5)}`, seed.transmission[index % seed.transmission.length]!],
      images: makeImages(seed, nom), vedette: index < 3, promotion,
      disponible: index % 11 !== 0, popularite: 100 - index + categoryIndex * 2,
    };
  }),
);

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const productById = (id: string) => products.find((product) => product.id === id);
export const featuredProducts = products.filter((product) => product.vedette).slice(0, 8);
export const promotionalProducts = products.filter((product) => product.promotion).slice(0, 8);
