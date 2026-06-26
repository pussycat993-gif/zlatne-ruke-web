/* global React */
// Web store — adapted from mobile store. Adds web router, web cart/fav state.
const { createContext, useContext, useState, useCallback, useMemo, useEffect } = React;

// ─── Seed data ───
const W_CATEGORIES = [
  { id: 'tekstil', name: 'Tekstil', emoji: '🧶', desc: 'pleteno, vez, šalovi' },
  { id: 'dekor', name: 'Dekor', emoji: '🕯️', desc: 'svece, vaze, ramovi' },
  { id: 'nakit', name: 'Nakit', emoji: '💍', desc: 'minđuše, ogrlice' },
  { id: 'kozmetika', name: 'Kozmetika', emoji: '🌿', desc: 'sapuni, kreme, ulja' },
  { id: 'hrana', name: 'Hrana', emoji: '🍯', desc: 'džem, med, slatko' },
  { id: 'keramika', name: 'Keramika', emoji: '🏺', desc: 'šolje, tanjiri, vaze' },
];

const W_SHOPS = [
  { id: 's1', name: 'Mila & Konac', owner: 'Milena Petrović', city: 'Novi Sad', rating: 4.9, reviews: 187, followers: 412, cover: 'tekstil • atelje', color: 'v2', category: 'tekstil', bio: 'Pletem od kad znam za sebe. Svaki šal je priča iz moje radionice u Novom Sadu.', joined: 'Mart 2024', videos: 3 },
  { id: 's2', name: 'Kuća Kandila', owner: 'Ana Jovanović', city: 'Beograd', rating: 4.8, reviews: 96, followers: 289, cover: 'soja sveće', color: 'v3', category: 'dekor', bio: 'Sojine sveće sa esencijalnim uljima. Svaka miriše na uspomenu.', joined: 'Jun 2023', videos: 2 },
  { id: 's3', name: 'Zrno Srebra', owner: 'Jelena Đorđević', city: 'Niš', rating: 5.0, reviews: 213, followers: 654, cover: 'srebrni nakit', color: 'v4', category: 'nakit', bio: 'Ručno kovani srebrni nakit, mali serije, velike priče.', joined: 'Sep 2022', videos: 4 },
  { id: 's4', name: 'Bosiljkov Vrt', owner: 'Sofija Marković', city: 'Subotica', rating: 4.7, reviews: 142, followers: 318, cover: 'prirodna kozmetika', color: 'v5', category: 'kozmetika', bio: 'Sapuni od domaćih biljaka, bez parabena, sa ljubavlju.', joined: 'Apr 2024', videos: 1 },
  { id: 's5', name: 'Dva Slatka', owner: 'Tijana Ilić', city: 'Užice', rating: 4.9, reviews: 78, followers: 201, cover: 'džemovi & slatko', color: 'v2', category: 'hrana', bio: 'Domaće slatko, recepti moje bake.', joined: 'Feb 2024', videos: 2 },
  { id: 's6', name: 'Glina i Ja', owner: 'Vesna Stojković', city: 'Kragujevac', rating: 4.8, reviews: 54, followers: 167, cover: 'keramika', color: 'v4', category: 'keramika', bio: 'Ručno rađena keramika za svakodnevnu lepotu.', joined: 'Jul 2024', videos: 2 },
];

const W_PRODUCTS = [
  { id: 'p1', shopId: 's1', name: 'Šal od merino vune — boja zalaska', price: 4800, oldPrice: 5500, category: 'tekstil', img: 'pleteni šal', color: 'v2', rating: 4.9, reviewCount: 42, inStock: 3, desc: 'Ručno pleteno od 100% merino vune. Mekano, toplo, idealno za jesen i zimu. Svaki komad je jedinstven — boja se može blago razlikovati zbog ručnog farbanja.' },
  { id: 'p2', shopId: 's1', name: 'Vezena navlaka za jastuk — divlje cveće', price: 3200, category: 'tekstil', img: 'vezeni jastuk', color: 'v3', rating: 4.8, reviewCount: 18, inStock: 5, desc: 'Ručni vez na lanenom platnu. 40×40cm.' },
  { id: 'p3', shopId: 's2', name: 'Sojina sveća — ruža & vanila', price: 1800, category: 'dekor', img: 'sveca u tegli', color: 'v4', rating: 4.9, reviewCount: 64, inStock: 12, desc: 'Sojina sveća sa esencijalnim uljem ruže. Gori 35h.' },
  { id: 'p4', shopId: 's2', name: 'Sveća u keramičkoj posudi', price: 2400, category: 'dekor', img: 'keramička sveća', color: 'v5', rating: 4.7, reviewCount: 22, inStock: 7, desc: 'Sveća u ručno pravljenoj keramičkoj posudi.' },
  { id: 'p5', shopId: 's3', name: 'Srebrne minđuše — list', price: 5400, category: 'nakit', img: 'srebrne minđuše', color: 'v2', rating: 5.0, reviewCount: 31, inStock: 4, desc: '925 srebro, ručno kovano. Hipoalergeno.' },
  { id: 'p6', shopId: 's3', name: 'Ogrlica sa polumesecom', price: 6800, category: 'nakit', img: 'ogrlica srebro', color: 'v4', rating: 4.9, reviewCount: 47, inStock: 2, desc: 'Lančić 45cm, srebro 925.' },
  { id: 'p7', shopId: 's4', name: 'Sapun sa lavandom & medom', price: 650, category: 'kozmetika', img: 'lavanda sapun', color: 'v3', rating: 4.8, reviewCount: 89, inStock: 24, desc: 'Hladnim postupkom pravljen sapun.' },
  { id: 'p8', shopId: 's4', name: 'Ulje za telo — ruža', price: 1900, category: 'kozmetika', img: 'ulje za telo', color: 'v5', rating: 4.9, reviewCount: 36, inStock: 8, desc: 'Bademovo ulje sa ekstraktom ruže. 100ml.' },
  { id: 'p9', shopId: 's5', name: 'Slatko od dunja', price: 850, category: 'hrana', img: 'slatko dunja', color: 'v2', rating: 5.0, reviewCount: 28, inStock: 15, desc: 'Tegla 380g, bez aditiva.' },
  { id: 'p10', shopId: 's5', name: 'Med od bagrema sa orahom', price: 1400, category: 'hrana', img: 'med bagrem', color: 'v4', rating: 4.9, reviewCount: 19, inStock: 9, desc: 'Domaći med iz pčelinjaka u Zlatiboru.' },
  { id: 'p11', shopId: 's1', name: 'Pletena kapa — pletenica', price: 2400, category: 'tekstil', img: 'pletena kapa', color: 'v4', rating: 4.7, reviewCount: 15, inStock: 6, desc: 'Topla kapa, akrilna vuna.' },
  { id: 'p12', shopId: 's2', name: 'Mirisni votivi (set 3)', price: 1500, category: 'dekor', img: 'votiv set', color: 'v3', rating: 4.8, reviewCount: 11, inStock: 10, desc: 'Set od 3 mirisna votiva.' },
  { id: 'p13', shopId: 's6', name: 'Šolja za jutarnju kafu — bademova', price: 1200, category: 'keramika', img: 'keramička šolja', color: 'v5', rating: 4.9, reviewCount: 24, inStock: 11, desc: 'Ručno bačena, glazirana mat. 250ml.' },
  { id: 'p14', shopId: 's6', name: 'Tanjir za serviranje — boja peska', price: 2800, category: 'keramika', img: 'serviranje', color: 'v3', rating: 4.8, reviewCount: 9, inStock: 5, desc: 'Veliki tanjir, prečnik 28cm.' },
  { id: 'p15', shopId: 's3', name: 'Prsten sa biserom', price: 4200, category: 'nakit', img: 'srebrni prsten', color: 'v5', rating: 4.9, reviewCount: 22, inStock: 6, desc: 'Slatkovodni biser, 925 srebro.' },
  { id: 'p16', shopId: 's4', name: 'Hidratantna krema — kalendula', price: 1600, category: 'kozmetika', img: 'krema', color: 'v2', rating: 4.7, reviewCount: 18, inStock: 14, desc: 'Sa ekstraktom kalendule iz vlastite bašte.' },
];

const W_STORIES = [
  { id: 'st1', shopId: 's1', title: 'Kako su moji prvi šalovi stigli do Beča', excerpt: 'Mila iz Novog Sada o tome kako je počela da plete za bakine prijateljice — i kako se to pretvorilo u atelje.', cover: 'mila — atelje', color: 'v2', readTime: '4 min', date: '12. apr 2026' },
  { id: 'st2', shopId: 's2', title: 'Miris doma: priča iza naših sveća', excerpt: 'Ana o tome zašto svaka sveća nosi ime jedne uspomene, i zašto su soja i ruža uvek prvi izbor.', cover: 'kuća kandila — radionica', color: 'v3', readTime: '6 min', date: '04. apr 2026' },
  { id: 'st3', shopId: 's3', title: 'Srebro koje pamti ruke', excerpt: 'Jelena radi po starom — bez modernih mašina. Posetili smo radionicu u Nišu da vidimo kako nastaje minđuša.', cover: 'jelena — kovanje', color: 'v4', readTime: '8 min', date: '28. mar 2026' },
  { id: 'st4', shopId: 's4', title: 'Bašta umesto fabrike', excerpt: 'Sofija u Subotici uzgaja svaku biljku koju koristi u sapunima. Kako izgleda dan u njenoj bašti?', cover: 'bosiljkov vrt', color: 'v5', readTime: '5 min', date: '15. mar 2026' },
];

const W_REVIEWS = [
  { id: 'r1', productId: 'p1', shopId: 's1', author: 'Marija K.', rating: 5, text: 'Predivan šal, boja kao na slici. Mila je odgovorila istog dana, brza isporuka 💕', date: 'pre 2 dana' },
  { id: 'r2', productId: 'p1', shopId: 's1', author: 'Tamara R.', rating: 5, text: 'Mekano, toplo, lepo upakovano. Preporučujem!', date: 'pre nedelju dana' },
  { id: 'r3', productId: 'p3', shopId: 's2', author: 'Jovana S.', rating: 5, text: 'Miriše božanstveno, gori dugo. Već naručujem drugu.', date: 'pre 3 dana' },
  { id: 'r4', productId: 'p7', shopId: 's4', author: 'Ivana M.', rating: 4, text: 'Lep sapun, prijatan miris. Malo se brzo troši.', date: 'pre 5 dana' },
  { id: 'r5', productId: 'p13', shopId: 's6', author: 'Dragana P.', rating: 5, text: 'Šolja je savršena. Drži toplotu dugo, kafu pijem polako.', date: 'pre 4 dana' },
];

const W_NOTIFS = [
  { id: 'n1', type: 'order', title: 'Porudžbina poslata', text: 'Tvoja porudžbina #2401 je krenula iz Niša.', time: 'pre 1h', unread: true },
  { id: 'n2', type: 'msg', title: 'Mila ti je poslala poruku', text: '"Naravno! Imam tri nijanse..."', time: 'pre 2h', unread: true },
  { id: 'n3', type: 'review', title: 'Nova recenzija', text: 'Marija K. je ocenila Šal od merino vune sa 5 ⭐', time: 'pre 1 dan', unread: false },
];

const W_ORDERS = [
  { id: '#2401', date: '02. maj', status: 'shipped', shopId: 's3', total: 6800, items: [{ productId: 'p6', qty: 1 }] },
  { id: '#2389', date: '24. apr', status: 'delivered', shopId: 's2', total: 3600, items: [{ productId: 'p3', qty: 2 }] },
  { id: '#2354', date: '12. apr', status: 'delivered', shopId: 's1', total: 4800, items: [{ productId: 'p1', qty: 1 }] },
];

const W_CONVOS = [
  { id: 'c1', shopId: 's1', userName: 'Mila & Konac', online: true, lastTime: '14:32', unread: 2, productId: 'p1', messages: [
    { id: 'm1', from: 'them', text: 'Zdravo! Hvala na interesovanju 🌸', time: '14:30' },
    { id: 'm2', from: 'them', text: 'Šal je dostupan, mogu da pošaljem do petka.', time: '14:30', productCard: 'p1' },
    { id: 'm3', from: 'me', text: 'Super! Mogu li da dobijem u roze tonu?', time: '14:31' },
    { id: 'm4', from: 'them', text: 'Naravno! Imam tri nijanse — šaljem ti slike sad.', time: '14:32' },
  ]},
  { id: 'c2', shopId: 's3', userName: 'Zrno Srebra', online: false, lastTime: 'juče', unread: 0, productId: 'p5', messages: [
    { id: 'm1', from: 'me', text: 'Koliko traje isporuka za Beograd?', time: 'juče 18:12' },
    { id: 'm2', from: 'them', text: 'Obično 2-3 radna dana 💕', time: 'juče 19:04' },
  ]},
];

// Seller's own product/order data
const W_SELLER_VIDEOS = [
  { id: 'v1', title: 'Dobrodošli u moj atelje', duration: '1:24', date: 'Mart 2024', cover: 'mila — uvod', color: 'v2', views: 1240, isMain: true },
  { id: 'v2', title: 'Kako pletem šal — od konca do gotovog', duration: '4:32', date: 'Apr 2024', cover: 'pletenje proces', color: 'v3', views: 892 },
  { id: 'v3', title: 'Nova kolekcija: zima 2025', duration: '2:18', date: 'Okt 2024', cover: 'nova kolekcija', color: 'v4', views: 564 },
];

const W_SELLER_ORDERS = [
  { id: '#2401', buyer: 'Marija K.', city: 'Beograd', date: '02. maj', status: 'pending', total: 6800, items: 1 },
  { id: '#2398', buyer: 'Ivana P.', city: 'Novi Sad', date: '01. maj', status: 'shipped', total: 4800, items: 1 },
  { id: '#2392', buyer: 'Tamara M.', city: 'Niš', date: '28. apr', status: 'shipped', total: 9600, items: 2 },
  { id: '#2380', buyer: 'Jelena S.', city: 'Subotica', date: '22. apr', status: 'delivered', total: 3200, items: 1 },
  { id: '#2371', buyer: 'Ana K.', city: 'Beograd', date: '15. apr', status: 'delivered', total: 7200, items: 3 },
];

// ─── Router (hash-based) ───
function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const parts = route.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { route, path: '/' + parts.join('/'), parts };
}

function navigate(path) {
  if (!path.startsWith('#')) path = '#' + (path.startsWith('/') ? path : '/' + path);
  window.location.hash = path.slice(1);
}

// ─── Store ───
const WStoreCtx = createContext(null);

function WStoreProvider({ children }) {
  const [role, setRole] = useState('buyer');
  const [authed, setAuthed] = useState(true);
  const [cart, setCart] = useState([{ productId: 'p1', qty: 1 }, { productId: 'p7', qty: 2 }]);
  const [favorites, setFavorites] = useState(new Set(['p3', 'p6', 'p13']));
  const [follows, setFollows] = useState(new Set(['s1', 's4']));
  const [orders, setOrders] = useState(W_ORDERS);
  const [convos, setConvos] = useState(W_CONVOS);
  const [notifs, setNotifs] = useState(W_NOTIFS);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const addToCart = useCallback((productId, qty = 1) => {
    setCart(c => {
      const ex = c.find(x => x.productId === productId);
      if (ex) return c.map(x => x.productId === productId ? { ...x, qty: x.qty + qty } : x);
      return [...c, { productId, qty }];
    });
    showToast('Dodato u korpu 💕');
  }, [showToast]);

  const updateCartQty = useCallback((productId, qty) => {
    setCart(c => qty <= 0 ? c.filter(x => x.productId !== productId) : c.map(x => x.productId === productId ? { ...x, qty } : x));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(c => c.filter(x => x.productId !== productId));
  }, []);

  const toggleFav = useCallback((productId) => {
    setFavorites(f => {
      const n = new Set(f);
      if (n.has(productId)) { n.delete(productId); showToast('Uklonjeno iz omiljenih'); }
      else { n.add(productId); showToast('Dodato u omiljene 💕'); }
      return n;
    });
  }, [showToast]);

  const toggleFollow = useCallback((shopId) => {
    setFollows(f => {
      const n = new Set(f);
      if (n.has(shopId)) { n.delete(shopId); showToast('Više ne pratiš radnju'); }
      else { n.add(shopId); showToast('Sada pratiš radnju 🌸'); }
      return n;
    });
  }, [showToast]);

  const sendMessage = useCallback((convoId, text) => {
    if (!text || !text.trim()) return;
    setConvos(cs => cs.map(c => c.id === convoId ? {
      ...c, lastTime: 'sad',
      messages: [...c.messages, { id: 'm' + Date.now(), from: 'me', text: text.trim(), time: 'sad' }]
    } : c));
  }, []);

  const placeOrder = useCallback(() => {
    const id = '#' + (2402 + orders.length);
    const itemsByShop = {};
    cart.forEach(item => {
      const p = W_PRODUCTS.find(p => p.id === item.productId);
      if (!p) return;
      if (!itemsByShop[p.shopId]) itemsByShop[p.shopId] = [];
      itemsByShop[p.shopId].push(item);
    });
    const newOrders = Object.entries(itemsByShop).map(([shopId, items], i) => {
      const total = items.reduce((s, it) => s + (W_PRODUCTS.find(p => p.id === it.productId)?.price || 0) * it.qty, 0);
      return { id: '#' + (2402 + orders.length + i), date: 'danas', status: 'pending', shopId, total, items };
    });
    setOrders(o => [...newOrders, ...o]);
    setCart([]);
    showToast('Porudžbina poslata 🌸');
    return id;
  }, [cart, orders, showToast]);

  const value = useMemo(() => ({
    role, setRole, authed, setAuthed,
    categories: W_CATEGORIES, products: W_PRODUCTS, shops: W_SHOPS,
    reviews: W_REVIEWS, stories: W_STORIES,
    sellerVideos: W_SELLER_VIDEOS, sellerOrders: W_SELLER_ORDERS,
    cart, favorites, follows, orders, convos, notifs,
    addToCart, updateCartQty, removeFromCart, toggleFav, toggleFollow, sendMessage, placeOrder, showToast,
    toast,
  }), [role, authed, cart, favorites, follows, orders, convos, notifs, toast,
       addToCart, updateCartQty, removeFromCart, toggleFav, toggleFollow, sendMessage, placeOrder, showToast]);

  return <WStoreCtx.Provider value={value}>{children}</WStoreCtx.Provider>;
}

const useWStore = () => useContext(WStoreCtx);
const wFmtPrice = (n) => new Intl.NumberFormat('sr-RS').format(n) + ' RSD';

Object.assign(window, { WStoreProvider, useWStore, wFmtPrice, useRoute, navigate, W_PRODUCTS, W_SHOPS, W_CATEGORIES, W_STORIES, W_REVIEWS });
