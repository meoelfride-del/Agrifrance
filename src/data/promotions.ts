export type FinancingOffer = {
  id: string;
  duration: number;
  saving?: string;
  products: string;
  startsAt: string;
  endsAt: string;
  catalogUrl: string;
};

export const financingOffers: FinancingOffer[] = [
  { id:"agrifrance-tracteurs-60", duration:60, saving:"2 500 $ US de remise commerciale", products:"tracteurs agricoles compacts et robustes neufs distribués par AgriFrance", startsAt:"2026-06-22", endsAt:"2026-11-01", catalogUrl:"/catalog?category=tracteurs" },
  { id:"agrifrance-tracteurs-48", duration:48, products:"tracteurs agricoles neufs disponibles au catalogue AgriFrance", startsAt:"2026-06-16", endsAt:"2026-09-01", catalogUrl:"/catalog?category=tracteurs" },
];
