import type { IconName } from "@/components/icon";

// Seed catalog data, adapted from the design prototype
// (design-reference/components/02-store-provider-data.jsx).
// Static for v1 (catalog only — no cart/checkout, no backend yet).

export type Category = {
  id: string;
  name: string;
  icon: IconName;
  desc: string;
};

export type Shop = {
  id: string;
  name: string;
  owner: string;
  city: string;
  rating: number;
  reviews: number;
  followers: number;
  category: string;
  tone: Tone;
  bio: string;
  coverPublicId?: string | null;
};

export type Product = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  tone: Tone;
  rating: number;
  reviewCount: number;
  inStock: number;
  desc: string;
  imagePublicId?: string | null;
  imagePublicIds?: string[];
};

export type Story = {
  id: string;
  shopId: string;
  title: string;
  excerpt: string;
  tone: Tone;
  readTime: string;
  date: string;
};

// Warm placeholder gradient tones (no real photography yet).
export type Tone = "v2" | "v3" | "v4" | "v5";

export const categories: Category[] = [
  { id: "tekstil", name: "Tekstil", icon: "tag", desc: "pleteno, vez, šalovi" },
  { id: "dekor", name: "Dekor", icon: "flower", desc: "sveće, vaze, ramovi" },
  { id: "nakit", name: "Nakit", icon: "sparkle", desc: "minđuše, ogrlice" },
  { id: "kozmetika", name: "Kozmetika", icon: "paint", desc: "sapuni, kreme, ulja" },
  { id: "hrana", name: "Hrana", icon: "package", desc: "džem, med, slatko" },
  { id: "keramika", name: "Keramika", icon: "image", desc: "šolje, tanjiri, vaze" },
];

export const shops: Shop[] = [
  { id: "s1", name: "Mila & Konac", owner: "Milena Petrović", city: "Novi Sad", rating: 4.9, reviews: 187, followers: 412, category: "tekstil", tone: "v2", bio: "Pletem od kad znam za sebe. Svaki šal je priča iz moje radionice u Novom Sadu." },
  { id: "s2", name: "Kuća Kandila", owner: "Ana Jovanović", city: "Beograd", rating: 4.8, reviews: 96, followers: 289, category: "dekor", tone: "v3", bio: "Sojine sveće sa esencijalnim uljima. Svaka miriše na uspomenu." },
  { id: "s3", name: "Zrno Srebra", owner: "Jelena Đorđević", city: "Niš", rating: 5.0, reviews: 213, followers: 654, category: "nakit", tone: "v4", bio: "Ručno kovani srebrni nakit, male serije, velike priče." },
  { id: "s4", name: "Bosiljkov Vrt", owner: "Sofija Marković", city: "Subotica", rating: 4.7, reviews: 142, followers: 318, category: "kozmetika", tone: "v5", bio: "Sapuni od domaćih biljaka, bez parabena, sa ljubavlju." },
  { id: "s5", name: "Dva Slatka", owner: "Tijana Ilić", city: "Užice", rating: 4.9, reviews: 78, followers: 201, category: "hrana", tone: "v2", bio: "Domaće slatko, recepti moje bake." },
  { id: "s6", name: "Glina i Ja", owner: "Vesna Stojković", city: "Kragujevac", rating: 4.8, reviews: 54, followers: 167, category: "keramika", tone: "v4", bio: "Ručno rađena keramika za svakodnevnu lepotu." },
];

export const products: Product[] = [
  { id: "p1", shopId: "s1", name: "Šal od merino vune — boja zalaska", price: 4800, oldPrice: 5500, category: "tekstil", tone: "v2", rating: 4.9, reviewCount: 42, inStock: 3, desc: "Ručno pleteno od 100% merino vune. Mekano, toplo, idealno za jesen i zimu." },
  { id: "p2", shopId: "s1", name: "Vezena navlaka za jastuk — divlje cveće", price: 3200, category: "tekstil", tone: "v3", rating: 4.8, reviewCount: 18, inStock: 5, desc: "Ručni vez na lanenom platnu. 40×40 cm." },
  { id: "p3", shopId: "s2", name: "Sojina sveća — ruža & vanila", price: 1800, category: "dekor", tone: "v4", rating: 4.9, reviewCount: 64, inStock: 12, desc: "Sojina sveća sa esencijalnim uljem ruže. Gori 35h." },
  { id: "p4", shopId: "s2", name: "Sveća u keramičkoj posudi", price: 2400, category: "dekor", tone: "v5", rating: 4.7, reviewCount: 22, inStock: 7, desc: "Sveća u ručno pravljenoj keramičkoj posudi." },
  { id: "p5", shopId: "s3", name: "Srebrne minđuše — list", price: 5400, category: "nakit", tone: "v2", rating: 5.0, reviewCount: 31, inStock: 4, desc: "925 srebro, ručno kovano. Hipoalergeno." },
  { id: "p6", shopId: "s3", name: "Ogrlica sa polumesecom", price: 6800, category: "nakit", tone: "v4", rating: 4.9, reviewCount: 47, inStock: 2, desc: "Lančić 45 cm, srebro 925." },
  { id: "p7", shopId: "s4", name: "Sapun sa lavandom & medom", price: 650, category: "kozmetika", tone: "v3", rating: 4.8, reviewCount: 89, inStock: 24, desc: "Hladnim postupkom pravljen sapun." },
  { id: "p8", shopId: "s4", name: "Ulje za telo — ruža", price: 1900, category: "kozmetika", tone: "v5", rating: 4.9, reviewCount: 36, inStock: 8, desc: "Bademovo ulje sa ekstraktom ruže. 100 ml." },
  { id: "p9", shopId: "s5", name: "Slatko od dunja", price: 850, category: "hrana", tone: "v2", rating: 5.0, reviewCount: 28, inStock: 15, desc: "Tegla 380 g, bez aditiva." },
  { id: "p10", shopId: "s5", name: "Med od bagrema sa orahom", price: 1400, category: "hrana", tone: "v4", rating: 4.9, reviewCount: 19, inStock: 9, desc: "Domaći med iz pčelinjaka u Zlatiboru." },
  { id: "p11", shopId: "s1", name: "Pletena kapa — pletenica", price: 2400, category: "tekstil", tone: "v4", rating: 4.7, reviewCount: 15, inStock: 6, desc: "Topla kapa, akrilna vuna." },
  { id: "p12", shopId: "s2", name: "Mirisni votivi (set 3)", price: 1500, category: "dekor", tone: "v3", rating: 4.8, reviewCount: 11, inStock: 10, desc: "Set od 3 mirisna votiva." },
  { id: "p13", shopId: "s6", name: "Šolja za jutarnju kafu — bademova", price: 1200, category: "keramika", tone: "v5", rating: 4.9, reviewCount: 24, inStock: 11, desc: "Ručno bačena, glazirana mat. 250 ml." },
  { id: "p14", shopId: "s6", name: "Tanjir za serviranje — boja peska", price: 2800, category: "keramika", tone: "v3", rating: 4.8, reviewCount: 9, inStock: 5, desc: "Veliki tanjir, prečnik 28 cm." },
  { id: "p15", shopId: "s3", name: "Prsten sa biserom", price: 4200, category: "nakit", tone: "v5", rating: 4.9, reviewCount: 22, inStock: 6, desc: "Slatkovodni biser, 925 srebro." },
  { id: "p16", shopId: "s4", name: "Hidratantna krema — kalendula", price: 1600, category: "kozmetika", tone: "v2", rating: 4.7, reviewCount: 18, inStock: 14, desc: "Sa ekstraktom kalendule iz vlastite bašte." },
];

export const stories: Story[] = [
  { id: "st1", shopId: "s1", title: "Kako su moji prvi šalovi stigli do Beča", excerpt: "Mila iz Novog Sada o tome kako je počela da plete za bakine prijateljice — i kako se to pretvorilo u atelje.", tone: "v2", readTime: "4 min", date: "12. apr 2026" },
  { id: "st2", shopId: "s2", title: "Miris doma: priča iza naših sveća", excerpt: "Ana o tome zašto svaka sveća nosi ime jedne uspomene, i zašto su soja i ruža uvek prvi izbor.", tone: "v3", readTime: "6 min", date: "04. apr 2026" },
  { id: "st3", shopId: "s3", title: "Srebro koje pamti ruke", excerpt: "Jelena radi po starom — bez modernih mašina. Posetili smo radionicu u Nišu da vidimo kako nastaje minđuša.", tone: "v4", readTime: "8 min", date: "28. mar 2026" },
];

export type Review = {
  id: string;
  productId: string;
  shopId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export const reviews: Review[] = [
  { id: "r1", productId: "p1", shopId: "s1", author: "Marija K.", rating: 5, text: "Predivan šal, boja kao na slici. Mila je odgovorila istog dana, brza isporuka.", date: "pre 2 dana" },
  { id: "r2", productId: "p1", shopId: "s1", author: "Tamara R.", rating: 5, text: "Mekano, toplo, lepo upakovano. Preporučujem!", date: "pre nedelju dana" },
  { id: "r3", productId: "p3", shopId: "s2", author: "Jovana S.", rating: 5, text: "Miriše božanstveno, gori dugo. Već naručujem drugu.", date: "pre 3 dana" },
  { id: "r4", productId: "p7", shopId: "s4", author: "Ivana M.", rating: 4, text: "Lep sapun, prijatan miris. Malo se brzo troši.", date: "pre 5 dana" },
  { id: "r5", productId: "p13", shopId: "s6", author: "Dragana P.", rating: 5, text: "Šolja je savršena. Drži toplotu dugo, kafu pijem polako.", date: "pre 4 dana" },
];

export function getShop(shopId: string): Shop | undefined {
  return shops.find((s) => s.id === shopId);
}

export function getProduct(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}

export function getShopProducts(shopId: string): Product[] {
  return products.filter((p) => p.shopId === shopId);
}

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getStory(storyId: string): Story | undefined {
  return stories.find((s) => s.id === storyId);
}

export function formatPrice(rsd: number): string {
  return new Intl.NumberFormat("sr-RS").format(rsd) + " RSD";
}

// Brand-token gradient classes for image placeholders (no hardcoded colors).
export const toneClass: Record<Tone, string> = {
  v2: "bg-gradient-to-br from-pink-tint to-cream-deep",
  v3: "bg-gradient-to-br from-cream-deep to-pink-light",
  v4: "bg-gradient-to-br from-pink-light to-pink-tint",
  v5: "bg-gradient-to-br from-cream to-pink-tint",
};
