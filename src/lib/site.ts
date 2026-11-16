// Business details shown across the website. Change them here.
export const site = {
  name: "MTG General Store and Logistics",
  shortName: "MTG",
  tagline: "General Store and Logistics",
  phoneDisplay: "+255 688 523 141",
  phone: "+255688523141",
  whatsapp: "255688523141", // international format, digits only
  email: "info@mtgsuppliers.com",
  area: "Kijitonyama",
  address: "Mtaa wa Mpakani A, Kijitonyama, Dar es Salaam",
  mapQuery: "Mpakani A, Kijitonyama, Dar es Salaam, Tanzania",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mtgsuppliers.com").replace(/\/$/, ""),
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

const tsh = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** "TSh 380,000", or the "Call for price" text (passed in, in the visitor's language) when empty. */
export function formatPrice(price: number | null, callForPrice = "Call for price") {
  return price == null ? callForPrice : `TSh ${tsh.format(price)}`;
}
