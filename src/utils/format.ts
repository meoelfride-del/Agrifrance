export const formatPrice = (value: number, locale = "fr") => new Intl.NumberFormat(locale, {
  style: "currency", currency: "EUR", maximumFractionDigits: 0,
}).format(value);

export const whatsappUrl = (message: string) => `https://wa.me/2290197000000?text=${encodeURIComponent(message)}`;
