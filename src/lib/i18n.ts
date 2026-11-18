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
  address: "Mpakani A, Kijitonyama, Dar es Salaam",
  breadcrumb: "Breadcrumb",
  language: "Language",
  nav: { home: "Home", products: "Products", contact: "Contact" },
  siteDescription:
    "Health supplements, personal care, baby and household products in Dar es Salaam. Browse our products and order on WhatsApp.",
  logoLabel: "MTG General Store and Logistics, home",
  callForPrice: "Call for price",
  whatsappFloat: "Chat with us on WhatsApp",
  search: { label: "Search products", placeholder: "Search products, e.g. vitamin C", button: "Search" },
  header: {
    topMessage: "Order on WhatsApp: we confirm the price, stock and delivery with you.",
    callUs: "Call us",
    shopByCategories: "Shop by categories",
    allProducts: "All products",
    logistics: "MTG Logistics",
    callToOrder: "Call to order:",
    orderOn: "Order on WhatsApp",
    menu: "Menu",
    preview: "Preview: these are sample products. The shop’s real products appear once the database is connected.",
  },
  sale: "Sale!",
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
    sourceTitle: "Can’t find what you need?",
    sourceText: "Tell us the product and we’ll tell you if we can bring it in for you.",
    askUs: "Ask us",
    shopNow: "Shop now",
    tiles: {
      immunity: { kicker: "Health & wellness", title: "Boost your immunity" },
      baby: { kicker: "For mother & baby", title: "Baby and nursery essentials" },
      cargo: {
        kicker: "MTG Logistics",
        title: "We bring it to you",
        text: "Can’t find a product in Tanzania? We order it for you by air cargo.",
        cta: "Ask on WhatsApp",
      },
    },
    features: [
      ["Order on WhatsApp", "Tap the button on any product and we reply quickly."],
      ["Delivery available", "Ask us about delivery to your area."],
      ["Air cargo orders", "We bring products from abroad for you."],
      ["Visit our shop", "Mpakani A, Kijitonyama, Dar es Salaam."],
    ],
    featuredTitle: "Our best sellers",
    featuredText: "Customer favourites, picked by our team. Tap any product to see the details and order on WhatsApp.",
    newTitle: "Newest products just in",
    newText: "Fresh arrivals in our store. Check back often, we add new products regularly.",
    categoryText: (name: string) => `Explore our ${name} range. Ask us on WhatsApp if you need help choosing.`,
    visitKicker: "Visit us",
    visitTitle: "Our shop in Kijitonyama",
    visitCta: "Get directions",
  },
  list: {
    title: "Products",
    metaDescription: "Browse MTG's health supplements, personal care, baby and household products. Order on WhatsApp.",
    all: "All",
    categoriesLabel: "Categories",
    count: (n: number) => `${n} ${n === 1 ? "product" : "products"}`,
    inCategory: "in",
    matching: "matching",
    similar: (q: string) => `No exact match for “${q}”. Here are similar products:`,
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
  address: "Mtaa wa Mpakani A, Kijitonyama, Dar es Salaam",
  breadcrumb: "Ulipo",
  language: "Lugha",
  nav: { home: "Mwanzo", products: "Bidhaa", contact: "Wasiliana" },
  siteDescription:
    "Virutubisho vya afya, bidhaa za usafi binafsi, za watoto na za nyumbani jijini Dar es Salaam. Angalia bidhaa zetu na uagize kwa WhatsApp.",
  logoLabel: "MTG General Store and Logistics, mwanzo",
  callForPrice: "Uliza bei",
  whatsappFloat: "Ongea nasi kwa WhatsApp",
  search: { label: "Tafuta bidhaa", placeholder: "Tafuta bidhaa, mf. vitamini C", button: "Tafuta" },
  header: {
    topMessage: "Agiza kwa WhatsApp: tunathibitisha bei, upatikanaji na usafirishaji pamoja nawe.",
    callUs: "Tupigie",
    shopByCategories: "Bidhaa kwa aina",
    allProducts: "Bidhaa zote",
    logistics: "MTG Logistics",
    callToOrder: "Piga kuagiza:",
    orderOn: "Agiza kwa WhatsApp",
    menu: "Menyu",
    preview: "Onyesho: hizi ni bidhaa za mfano. Bidhaa halisi za duka zitaonekana hifadhidata ikishaunganishwa.",
  },
  sale: "Punguzo!",
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
    sourceTitle: "Hujapata unachohitaji?",
    sourceText: "Tuambie bidhaa unayotaka na tutakujulisha kama tunaweza kukuletea.",
    askUs: "Tuulize",
    shopNow: "Nunua sasa",
    tiles: {
      immunity: { kicker: "Afya na ustawi", title: "Imarisha kinga ya mwili" },
      baby: { kicker: "Kwa mama na mtoto", title: "Mahitaji ya mtoto mchanga" },
      cargo: {
        kicker: "MTG Logistics",
        title: "Tunakuletea",
        text: "Hupati bidhaa hapa Tanzania? Tunakuagizia na kukuletea kwa ndege.",
        cta: "Uliza kwa WhatsApp",
      },
    },
    features: [
      ["Agiza kwa WhatsApp", "Bonyeza kitufe kwenye bidhaa yoyote, tunajibu haraka."],
      ["Usafirishaji upo", "Tuulize kuhusu kufikishiwa bidhaa eneo lako."],
      ["Kuagiza kwa ndege", "Tunakuletea bidhaa kutoka nje ya nchi."],
      ["Tembelea duka letu", "Mtaa wa Mpakani A, Kijitonyama, Dar es Salaam."],
    ],
    featuredTitle: "Bidhaa zinazopendwa",
    featuredText: "Bidhaa wanazopenda wateja wetu. Bonyeza bidhaa yoyote kuona maelezo na kuagiza kwa WhatsApp.",
    newTitle: "Bidhaa mpya zilizowasili",
    newText: "Bidhaa mpya dukani kwetu. Tembelea mara kwa mara, tunaongeza bidhaa mpya kila wakati.",
    categoryText: (name: string) => `Angalia bidhaa zetu za ${name}. Tuulize kwa WhatsApp ukihitaji msaada wa kuchagua.`,
    visitKicker: "Tutembelee",
    visitTitle: "Duka letu Kijitonyama",
    visitCta: "Pata maelekezo",
  },
  list: {
    title: "Bidhaa",
    metaDescription: "Angalia virutubisho vya afya, bidhaa za usafi binafsi, za watoto na za nyumbani za MTG. Agiza kwa WhatsApp.",
    all: "Zote",
    categoriesLabel: "Aina za bidhaa",
    count: (n: number) => `Bidhaa ${n}`,
    inCategory: "katika",
    matching: "zinazolingana na",
    similar: (q: string) => `Hakuna bidhaa inayolingana kabisa na “${q}”. Hizi ni bidhaa zinazofanana:`,
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
