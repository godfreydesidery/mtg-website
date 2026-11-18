import { slugify } from "./slug";
import type { Category, Product } from "./types";

// SAMPLE DATA, shown only while Supabase is not connected, so the design can be
// previewed. Not real MTG products. It disappears as soon as the database is connected.

const categoryList: [string, string][] = [
  ["Baby and Nursery", "Watoto Wachanga na Malezi"],
  ["Brain & Memory", "Ubongo na Kumbukumbu"],
  ["Children Health", "Afya ya Watoto"],
  ["Dental", "Afya ya Kinywa na Meno"],
  ["Diet and Weight Management", "Lishe na Udhibiti wa Uzito"],
  ["Digestive Health", "Afya ya Mmeng'enyo wa Chakula"],
  ["Energy", "Nguvu na Nishati"],
  ["Eye Health", "Afya ya Macho"],
  ["Fragrance", "Manukato"],
  ["Hair Care", "Utunzaji wa Nywele"],
  ["Heart & Circulation", "Moyo na Mzunguko wa Damu"],
  ["Immune Support", "Kinga ya Mwili"],
  ["Joint Health", "Afya ya Viungo"],
];

const logisticsList: [string, string][] = [
  ["Air Cargo Freight", "Usafirishaji wa Mizigo kwa Ndege"],
  ["Air Cargo Order", "Oda za Air Cargo"],
];

export const previewCategories: Category[] = [
  ...categoryList.map(([name, name_sw]) => ({ name, name_sw, section: "shop" as const })),
  ...logisticsList.map(([name, name_sw]) => ({ name, name_sw, section: "logistics" as const })),
].map((c, i) => ({ ...c, id: -(i + 1), slug: slugify(c.name) }));

const cat = (name: string) => previewCategories.find((c) => c.name === name)!.id;

type Sample = [name: string, category: string, price: number | null, oldPrice: number | null, image: string, featured: boolean, en: string, sw: string];

const samples: Sample[] = [
  ["Vitamin C 1000mg, 60 tablets", "Immune Support", 25000, 30000, "jar-green-c", true,
    "High-strength vitamin C to support your immune system. One tablet a day with food.",
    "Vitamini C yenye nguvu kusaidia kinga ya mwili. Kidonge kimoja kwa siku pamoja na chakula."],
  ["Zinc + Vitamin D3 capsules", "Immune Support", 32000, null, "jar-navy-zinc", true,
    "Zinc and vitamin D3 together for everyday immune support.",
    "Zinki na vitamini D3 kwa pamoja kusaidia kinga ya mwili kila siku."],
  ["Omega-3 Fish Oil 1000mg", "Heart & Circulation", 45000, 52000, "jar-amber-omega", true,
    "Omega-3 fatty acids for heart health. 90 soft gels.",
    "Asidi za mafuta za Omega-3 kwa afya ya moyo. Vidonge laini 90."],
  ["Glucosamine & Chondroitin", "Joint Health", 58000, null, "jar-teal-joint", true,
    "Supports healthy, flexible joints. 120 tablets.",
    "Husaidia viungo kuwa na afya na kunyumbulika. Vidonge 120."],
  ["Kids Multivitamin Gummies", "Children Health", 29000, 34000, "jar-orange-kids", true,
    "Fruit-flavoured gummies with the vitamins growing children need.",
    "Pipi laini zenye ladha ya matunda na vitamini muhimu kwa watoto wanaokua."],
  ["Probiotic Digestive Support", "Digestive Health", 48000, null, "jar-green-probiotic", true,
    "Friendly bacteria to support healthy digestion. 30 capsules.",
    "Bakteria rafiki kusaidia mmeng'enyo mzuri wa chakula. Vidonge 30."],
  ["Lutein Eye Support capsules", "Eye Health", 39000, null, "jar-purple-eye", false,
    "Lutein and zeaxanthin to support healthy eyes.",
    "Lutein na zeaxanthin kusaidia afya ya macho."],
  ["Biotin Hair, Skin & Nails", "Hair Care", 36000, 42000, "jar-pink-biotin", false,
    "Biotin with vitamins for stronger hair and nails.",
    "Biotin pamoja na vitamini kwa nywele na kucha zenye nguvu."],
  ["Baby Moisturising Lotion 200ml", "Baby and Nursery", 18500, null, "tube-pink-baby", false,
    "Gentle lotion for a baby's delicate skin.",
    "Losheni laini kwa ngozi nyororo ya mtoto."],
  ["Rose Water Facial Mist 100ml", "Fragrance", 15000, null, "dropper-pink-rose", false,
    "Refreshing rose water for face and body.",
    "Maji ya waridi yanayoburudisha uso na mwili."],
  ["Peppermint Essential Oil 30ml", "Fragrance", 22000, 26000, "dropper-green-mint", false,
    "Pure peppermint oil for aromatherapy.",
    "Mafuta safi ya mnanaa kwa harufu nzuri."],
  ["Whitening Fluoride Toothpaste", "Dental", 7500, null, "tube-blue-tooth", false,
    "Fluoride toothpaste for strong, white teeth.",
    "Dawa ya meno yenye floraidi kwa meno imara na meupe."],
  ["Magnesium Glycinate, 120 capsules", "Energy", 42000, null, "jar-navy-mag", false,
    "Gentle magnesium for energy, muscles and sleep.",
    "Magnesiamu laini kwa nguvu, misuli na usingizi."],
  ["Green Detox Herbal Tea", "Diet and Weight Management", null, null, "box-teal-tea", false,
    "Herbal tea blend. Ask us for the current price.",
    "Mchanganyiko wa chai ya mitishamba. Tuulize bei ya sasa."],
];

export const previewProducts: Product[] = samples.map(([name, category, price, old_price, image, is_featured, description, description_sw], i) => ({
  id: `preview-${i}`,
  slug: slugify(name),
  name,
  category_id: cat(category),
  price,
  old_price,
  description,
  description_sw,
  images: [`/demo/${image}.svg`],
  in_stock: i !== 6,
  is_featured,
  is_visible: true,
  created_at: new Date(Date.UTC(2026, 10, 15) - i * 86_400_000).toISOString(),
}));
