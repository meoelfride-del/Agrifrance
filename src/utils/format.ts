export const formatPrice = (value: number | null, locale = "fr") => value === null ? "Prix sur devis" : new Intl.NumberFormat(locale, {
  style: "currency", currency: "EUR", maximumFractionDigits: 0,
}).format(value);

export const discountPercentage = (current: number | null, old: number | null) =>
  current !== null && old !== null && old > current
    ? Math.round(((old - current) / old) * 100)
    : null;

export const whatsappUrl = (message: string) => `https://wa.me/2290197000000?text=${encodeURIComponent(message)}`;
