// All customer-facing text, in English and Swahili. Edit wording here.
// The admin panel stays in English.

export const locales = ["en", "sw"] as const;
export type Locale = (typeof locales)[number];

/** Language for first-time visitors. Returning visitors get the one they last chose. */
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

const en = {
  langName: "English",
  nav: { home: "Home", products: "Products", contact: "Contact" },
  siteDescription:
    "Health supplements, personal care, baby and household products in Dar es Salaam. Browse our products and order on WhatsApp.",
  logoLabel: "MTG General Store and Logistics, home",
  callForPrice: "Call for price",
  whatsappFloat: "Chat with us on WhatsApp",
  search: { label: "Search products", placeholder: "Search products, e.g. vitamin C", button: "Search" },
  msg: {
    question: "Hello MTG, I have a question.",
    order: "Hello MTG, I would like to order.",
    interested: "Hello MTG, I'm interested in:",
    notListed: "Hello MTG, I'm looking for a product that isn't on your website: ",
    doYouHave: (what: string) => `Hello MTG, do you have ${what}?`,
    hello: "Hello MTG",
  },
  home: {
    title: "Health, personal care and home essentials in one store.",
    intro: "Browse our products, then order straight on WhatsApp. We confirm the price, stock and delivery with you.",
    browseAll: "Browse all products",
    orderWhatsapp: "Order on WhatsApp",
    categories: "Shop by category",
    seeAll: "See all",
    featured: "Featured products",
    newArrivals: "New arrivals",
    viewAll: (n: number) => `View all ${n}`,
    empty: "New products are coming soon. Ask us on WhatsApp for anything you need.",
    howTitle: "How to order",
    steps: [
      ["Find your product", "Browse by category or search by name."],
      ["Tap “Order on WhatsApp”", "The message already names the product and price."],
      ["We confirm and deliver", "We confirm stock, the total and delivery, or you pick up in Kijitonyama."],
    ],
    sourceTitle: "Can’t find what you need?",
    sourceText: "Tell us the product and we’ll tell you if we can bring it in for you.",
    askUs: "Ask us",
  },
  list: {
    title: "Products",
    metaDescription: "Browse MTG's health supplements, personal care, baby and household products. Order on WhatsApp.",
    all: "All",
    categoriesLabel: "Categories",
    count: (n: number) => `${n} ${n === 1 ? "product" : "products"}`,
    inCategory: "in",
    matching: "matching",
    clear: "Clear",
    noneTitle: "No products found.",
    noneText: "We may still have it or be able to get it.",
    askWhatsapp: "Ask on WhatsApp",
    thisProduct: "this product",
  },
  product: {
    inStock: "In stock",
    outOfStock: "Out of stock",
    outOfStockLong: "Out of stock, ask us when it’s back",
    order: "Order on WhatsApp",
    call: "Call",
    about: "About this product",
    moreIn: (cat: string) => `More in ${cat}`,
    thisCategory: "this category",
    showPhoto: "Show photo",
    goneTitle: "This product is no longer available",
    goneText: "It may have sold out or been removed. Have a look at what we have now.",
    seeAll: "See all products",
    unavailable: "Product not available",
  },
  contact: {
    title: "Contact us",
    metaDescription: "Call, WhatsApp or visit MTG General Store and Logistics in Kijitonyama, Dar es Salaam.",
    intro:
      "The quickest way to reach us is WhatsApp. Send the product name or a photo and we’ll reply with the price and delivery options.",
    whatsapp: "WhatsApp",
    call: "Call",
    email: "Email",
    location: "Location",
    mapTitle: "Map showing our location",
  },
  footer: {
    visit: "Visit or call",
    whatsappUs: "WhatsApp us",
    shop: "Shop",
    allProducts: "All products",
    contact: "Contact & location",
    note: "Prices are in Tanzanian shillings and can change; confirm on WhatsApp before paying.",
  },
  error: {
    title: "Something went wrong loading this page",
    text: "Please try again. You can always reach us on WhatsApp.",
    retry: "Try again",
  },
  notFound: { kicker: "Page not found", title: "We couldn’t find that page", home: "Go to the home page" },
};

export type Dictionary = typeof en;

const sw: Dictionary = {
  langName: "Kiswahili",
  nav: { home: "Mwanzo", products: "Bidhaa", contact: "Wasiliana" },
  siteDescription:
    "Virutubisho vya afya, bidhaa za usafi binafsi, za watoto na za nyumbani jijini Dar es Salaam. Angalia bidhaa zetu na uagize kwa WhatsApp.",
  logoLabel: "MTG General Store and Logistics, mwanzo",
  callForPrice: "Uliza bei",
  whatsappFloat: "Ongea nasi kwa WhatsApp",
  search: { label: "Tafuta bidhaa", placeholder: "Tafuta bidhaa, mf. vitamin C", button: "Tafuta" },
  msg: {
    question: "Habari MTG, nina swali.",
    order: "Habari MTG, ningependa kuagiza.",
    interested: "Habari MTG, ninahitaji:",
    notListed: "Habari MTG, natafuta bidhaa ambayo haipo kwenye tovuti yenu: ",
    doYouHave: (what: string) => `Habari MTG, mna ${what}?`,
    hello: "Habari MTG",
  },
  home: {
    title: "Afya, usafi binafsi na mahitaji ya nyumbani, yote sehemu moja.",
    intro: "Angalia bidhaa zetu, kisha agiza moja kwa moja kupitia WhatsApp. Tutathibitisha bei, upatikanaji na usafirishaji pamoja nawe.",
    browseAll: "Tazama bidhaa zote",
    orderWhatsapp: "Agiza kwa WhatsApp",
    categories: "Bidhaa kwa aina",
    seeAll: "Ona zote",
    featured: "Bidhaa maalum",
    newArrivals: "Bidhaa mpya",
    viewAll: (n: number) => `Ona zote (${n})`,
    empty: "Bidhaa mpya zinakuja hivi karibuni. Tuulize kwa WhatsApp chochote unachohitaji.",
    howTitle: "Jinsi ya kuagiza",
    steps: [
      ["Tafuta bidhaa yako", "Angalia kwa aina au tafuta kwa jina."],
      ["Bonyeza “Agiza kwa WhatsApp”", "Ujumbe tayari una jina la bidhaa na bei yake."],
      ["Tunathibitisha na kukuletea", "Tunathibitisha upatikanaji, jumla ya gharama na usafirishaji, au unachukua mwenyewe Kijitonyama."],
    ],
    sourceTitle: "Hujapata unachohitaji?",
    sourceText: "Tuambie bidhaa unayotaka na tutakujulisha kama tunaweza kukuletea.",
    askUs: "Tuulize",
  },
  list: {
    title: "Bidhaa",
    metaDescription: "Angalia virutubisho vya afya, bidhaa za usafi binafsi, za watoto na za nyumbani za MTG. Agiza kwa WhatsApp.",
    all: "Zote",
    categoriesLabel: "Aina za bidhaa",
    count: (n: number) => `Bidhaa ${n}`,
    inCategory: "katika",
    matching: "zinazolingana na",
    clear: "Futa",
    noneTitle: "Hakuna bidhaa zilizopatikana.",
    noneText: "Huenda tunayo au tunaweza kuipata.",
    askWhatsapp: "Uliza kwa WhatsApp",
    thisProduct: "bidhaa hii",
  },
  product: {
    inStock: "Inapatikana",
    outOfStock: "Imeisha",
    outOfStockLong: "Imeisha, tuulize itakaporudi",
    order: "Agiza kwa WhatsApp",
    call: "Piga",
    about: "Kuhusu bidhaa hii",
    moreIn: (cat: string) => `Zaidi katika ${cat}`,
    thisCategory: "aina hii",
    showPhoto: "Onyesha picha",
    goneTitle: "Bidhaa hii haipatikani tena",
    goneText: "Huenda imeisha au imeondolewa. Angalia bidhaa tulizonazo sasa.",
    seeAll: "Tazama bidhaa zote",
    unavailable: "Bidhaa haipatikani",
  },
  contact: {
    title: "Wasiliana nasi",
    metaDescription: "Piga simu, tuandikie WhatsApp au tutembelee MTG General Store and Logistics, Kijitonyama, Dar es Salaam.",
    intro:
      "Njia ya haraka zaidi ya kutufikia ni WhatsApp. Tuma jina la bidhaa au picha, nasi tutakujibu na bei pamoja na njia za usafirishaji.",
    whatsapp: "WhatsApp",
    call: "Piga simu",
    email: "Barua pepe",
    location: "Mahali",
    mapTitle: "Ramani inayoonyesha mahali tulipo",
  },
  footer: {
    visit: "Tutembelee au piga simu",
    whatsappUs: "Tuandikie WhatsApp",
    shop: "Duka",
    allProducts: "Bidhaa zote",
    contact: "Mawasiliano na mahali",
    note: "Bei ziko kwa shilingi za Kitanzania na zinaweza kubadilika; thibitisha kwa WhatsApp kabla ya kulipa.",
  },
  error: {
    title: "Kuna tatizo katika kufungua ukurasa huu",
    text: "Tafadhali jaribu tena. Unaweza pia kutufikia kwa WhatsApp.",
    retry: "Jaribu tena",
  },
  notFound: { kicker: "Ukurasa haupatikani", title: "Hatukuweza kupata ukurasa huo", home: "Rudi mwanzo" },
};

export const dictionaries: Record<Locale, Dictionary> = { sw, en };

/** Category name in the visitor's language (falls back to the English name). */
export function categoryName(category: { name: string; name_sw?: string | null }, locale: Locale) {
  return locale === "sw" && category.name_sw ? category.name_sw : category.name;
}

/** Product description in the visitor's language (falls back to the English one). */
export function productDescription(product: { description: string; description_sw?: string | null }, locale: Locale) {
  return locale === "sw" && product.description_sw ? product.description_sw : product.description;
}
