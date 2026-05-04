/* global React, Icon */
// Zlatne Ruke — App Store: global state for the entire prototype.
// One context: auth (which role), navigation, cart, favorites, follows,
// orders, messages, notifications, products, shops, reviews, toast.

const { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } = React;

// ──────────────── seed data ────────────────
const CATEGORIES = [
  { id: 'tekstil', name: 'Tekstil', emoji: '🧶', desc: 'pleteno, vez, šalovi' },
  { id: 'dekor', name: 'Dekor', emoji: '🕯️', desc: 'svece, vaze, ramovi' },
  { id: 'nakit', name: 'Nakit', emoji: '💍', desc: 'minđuše, ogrlice' },
  { id: 'kozmetika', name: 'Kozmetika', emoji: '🌿', desc: 'sapuni, kreme, ulja' },
  { id: 'hrana', name: 'Hrana', emoji: '🍯', desc: 'džem, med, slatko' },
];

const SHOPS = [
  { id: 's1', name: 'Mila & Konac', owner: 'Milena Petrović', city: 'Novi Sad', rating: 4.9, reviews: 187, followers: 412, cover: 'tekstil • atelje', color: 'v2', category: 'tekstil', bio: 'Pletem od kad znam za sebe. Svaki šal je priča.', joined: 'Mart 2024' },
  { id: 's2', name: 'Kuća Kandila', owner: 'Ana Jovanović', city: 'Beograd', rating: 4.8, reviews: 96, followers: 289, cover: 'soja sveće', color: 'v3', category: 'dekor', bio: 'Sojine sveće sa esencijalnim uljima.', joined: 'Jun 2023' },
  { id: 's3', name: 'Zrno Srebra', owner: 'Jelena Đorđević', city: 'Niš', rating: 5.0, reviews: 213, followers: 654, cover: 'srebrni nakit', color: 'v4', category: 'nakit', bio: 'Ručno kovani srebrni nakit, mali serije.', joined: 'Sep 2022' },
  { id: 's4', name: 'Bosiljkov Vrt', owner: 'Sofija Marković', city: 'Subotica', rating: 4.7, reviews: 142, followers: 318, cover: 'prirodna kozmetika', color: 'v5', category: 'kozmetika', bio: 'Sapuni od domaćih biljaka, bez parabena.', joined: 'Apr 2024' },
  { id: 's5', name: 'Dva Slatka', owner: 'Tijana Ilić', city: 'Užice', rating: 4.9, reviews: 78, followers: 201, cover: 'džemovi & slatko', color: 'v2', category: 'hrana', bio: 'Domaće slatko, recepti moje bake.', joined: 'Feb 2024' },
];

const PRODUCTS = [
  { id: 'p1', shopId: 's1', name: 'Šal od merino vune — boja zalaska', price: 4800, oldPrice: 5500, category: 'tekstil', img: 'pleteni šal', color: 'v2', rating: 4.9, reviewCount: 42, inStock: 3, desc: 'Ručno pleteno od 100% merino vune. Mekano, toplo, idealno za jesen i zimu. Svaki komad je jedinstven — boja se može blago razlikovati zbog ručnog farbanja.' },
  { id: 'p2', shopId: 's1', name: 'Vezena tabla za jastuk — divlje cveće', price: 3200, category: 'tekstil', img: 'vezeni jastuk', color: 'v3', rating: 4.8, reviewCount: 18, inStock: 5, desc: 'Ručni vez na lanenom platnu. 40×40cm, navlaka.' },
  { id: 'p3', shopId: 's2', name: 'Sojina sveća — ruža & vanila', price: 1800, category: 'dekor', img: 'sveca u tegli', color: 'v4', rating: 4.9, reviewCount: 64, inStock: 12, desc: 'Sojina sveća sa esencijalnim uljem ruže. Gori 35h.' },
  { id: 'p4', shopId: 's2', name: 'Sveća u keramičkoj posudi', price: 2400, category: 'dekor', img: 'keramička sveća', color: 'v5', rating: 4.7, reviewCount: 22, inStock: 7, desc: 'Sveća u ručno pravljenoj keramičkoj posudi.' },
  { id: 'p5', shopId: 's3', name: 'Srebrne minđuše — list', price: 5400, category: 'nakit', img: 'srebrne minđuše', color: 'v2', rating: 5.0, reviewCount: 31, inStock: 4, desc: '925 srebro, ručno kovano. Hipoalergeno.' },
  { id: 'p6', shopId: 's3', name: 'Ogrlica sa polumesecom', price: 6800, category: 'nakit', img: 'ogrlica srebro', color: 'v4', rating: 4.9, reviewCount: 47, inStock: 2, desc: 'Lančić 45cm, srebro 925.' },
  { id: 'p7', shopId: 's4', name: 'Sapun sa lavandom & medom', price: 650, category: 'kozmetika', img: 'lavanda sapun', color: 'v3', rating: 4.8, reviewCount: 89, inStock: 24, desc: 'Hladnim postupkom pravljen sapun, lavanda iz vlastite bašte.' },
  { id: 'p8', shopId: 's4', name: 'Ulje za telo — ruža', price: 1900, category: 'kozmetika', img: 'ulje za telo', color: 'v5', rating: 4.9, reviewCount: 36, inStock: 8, desc: 'Bademovo ulje sa ekstraktom ruže. 100ml.' },
  { id: 'p9', shopId: 's5', name: 'Slatko od dunja', price: 850, category: 'hrana', img: 'slatko dunja', color: 'v2', rating: 5.0, reviewCount: 28, inStock: 15, desc: 'Tegla 380g, bez aditiva. Recepti moje bake.' },
  { id: 'p10', shopId: 's5', name: 'Med od bagrema sa orahom', price: 1400, category: 'hrana', img: 'med bagrem', color: 'v4', rating: 4.9, reviewCount: 19, inStock: 9, desc: 'Domaći med iz pčelinjaka u Zlatiboru.' },
  { id: 'p11', shopId: 's1', name: 'Pletena kapa — kosa pletenica', price: 2400, category: 'tekstil', img: 'pletena kapa', color: 'v4', rating: 4.7, reviewCount: 15, inStock: 6, desc: 'Topla kapa, akrilna vuna.' },
  { id: 'p12', shopId: 's2', name: 'Mirisni votivi (set 3)', price: 1500, category: 'dekor', img: 'votiv set', color: 'v3', rating: 4.8, reviewCount: 11, inStock: 10, desc: 'Set od 3 mirisna votiva.' },
];

const REVIEWS = [
  { id: 'r1', productId: 'p1', shopId: 's1', author: 'Marija K.', rating: 5, text: 'Predivan šal, boja kao na slici. Mila je odgovorila istog dana, brza isporuka 💕', date: 'pre 2 dana', avatar: '#F4D5DC' },
  { id: 'r2', productId: 'p1', shopId: 's1', author: 'Tamara R.', rating: 5, text: 'Mekano, toplo, lepo upakovano. Preporučujem!', date: 'pre nedelju dana', avatar: '#F8D8D8' },
  { id: 'r3', productId: 'p3', shopId: 's2', author: 'Jovana S.', rating: 5, text: 'Miriše božanstveno, gori dugo. Već naručujem drugu.', date: 'pre 3 dana', avatar: '#E8C9D2' },
  { id: 'r4', productId: 'p7', shopId: 's4', author: 'Ivana M.', rating: 4, text: 'Lep sapun, prijatan miris. Malo se brzo troši.', date: 'pre 5 dana', avatar: '#F5DDD2' },
];

const INITIAL_CONVOS = [
  { id: 'c1', shopId: 's1', userName: 'Mila & Konac', online: true, lastTime: '14:32', unread: 2, productId: 'p1', messages: [
    { id: 'm1', from: 'them', text: 'Zdravo! Hvala na interesovanju 🌸', time: '14:30' },
    { id: 'm2', from: 'them', text: 'Šal je dostupan, mogu da pošaljem do petka.', time: '14:30', productCard: 'p1' },
    { id: 'm3', from: 'me', text: 'Super! Mogu li da dobijem u roze tonu?', time: '14:31' },
    { id: 'm4', from: 'them', text: 'Naravno! Imam tri nijanse — šaljem ti slike sad.', time: '14:32', reactions: ['❤️'] },
    { id: 'm5', from: 'them', text: '', time: '14:32', image: 'roze toneri uzorak' },
  ]},
  { id: 'c2', shopId: 's3', userName: 'Zrno Srebra', online: false, lastTime: 'juče', unread: 0, productId: 'p5', messages: [
    { id: 'm1', from: 'me', text: 'Koliko traje isporuka za Beograd?', time: 'juče 18:12' },
    { id: 'm2', from: 'them', text: 'Obično 2-3 radna dana 💕', time: 'juče 19:04', read: true },
  ]},
  { id: 'c3', shopId: 's4', userName: 'Bosiljkov Vrt', online: true, lastTime: 'pon', unread: 0, productId: null, messages: [
    { id: 'm1', from: 'them', text: 'Imamo nove sapune sa kalendulom — pogledaj radnju! ✨', time: 'pon 10:00', read: true },
  ]},
];

const NOTIFICATIONS = [
  { id: 'n1', type: 'order', icon: 'package', title: 'Porudžbina poslata', text: 'Tvoja porudžbina #2401 je krenula iz Niša.', time: 'pre 1h', unread: true, color: '#F5DDD2' },
  { id: 'n2', type: 'msg', icon: 'chat', title: 'Mila ti je poslala poruku', text: '"Naravno! Imam tri nijanse..."', time: 'pre 2h', unread: true, color: '#F4D5DC' },
  { id: 'n3', type: 'review', icon: 'star', title: 'Nova recenzija', text: 'Marija K. je ocenila Šal od merino vune sa 5 ⭐', time: 'pre 1 dan', unread: false, color: '#F8D8D8' },
  { id: 'n4', type: 'follow', icon: 'heart', title: 'Nova prodavnica te prati', text: 'Bosiljkov Vrt prati tvoj profil 💕', time: 'pre 2 dana', unread: false, color: '#E8C9D2' },
  { id: 'n5', type: 'promo', icon: 'sparkle', title: 'Nove rukotvorine ove nedelje', text: 'Pogledaj 12 novih predmeta od tvojih omiljenih radnji.', time: 'pre 3 dana', unread: false, color: '#F5DDD2' },
];

const ORDERS_INITIAL = [
  { id: '#2401', date: '02. maj', status: 'shipped', shopId: 's3', total: 6800, items: [{ productId: 'p6', qty: 1 }] },
  { id: '#2389', date: '24. apr', status: 'delivered', shopId: 's2', total: 3600, items: [{ productId: 'p3', qty: 2 }] },
  { id: '#2354', date: '12. apr', status: 'delivered', shopId: 's1', total: 4800, items: [{ productId: 'p1', qty: 1 }] },
];

// ──────────────── store ────────────────
const StoreCtx = createContext(null);

function StoreProvider({ children }) {
  const [role, setRole] = useState('buyer'); // 'buyer' | 'seller' | 'admin' | null
  const [authed, setAuthed] = useState(true);

  const [cart, setCart] = useState([{ productId: 'p1', qty: 1 }, { productId: 'p7', qty: 2 }]);
  const [favorites, setFavorites] = useState(new Set(['p3', 'p6']));
  const [favShops, setFavShops] = useState(new Set(['s1']));
  const [follows, setFollows] = useState(new Set(['s1', 's4']));
  const [orders, setOrders] = useState(ORDERS_INITIAL);
  const [convos, setConvos] = useState(INITIAL_CONVOS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [reactions, setReactions] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback((productId, qty = 1) => {
    setCart(c => {
      const ex = c.find(x => x.productId === productId);
      if (ex) return c.map(x => x.productId === productId ? { ...x, qty: x.qty + qty } : x);
      return [...c, { productId, qty }];
    });
    showToast('Dodato u korpu ❤');
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

  const toggleFavShop = useCallback((shopId) => {
    setFavShops(f => {
      const n = new Set(f);
      n.has(shopId) ? n.delete(shopId) : n.add(shopId);
      return n;
    });
  }, []);

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
      ...c,
      lastTime: 'sad',
      messages: [...c.messages, { id: 'm' + Date.now(), from: 'me', text: text.trim(), time: 'sad' }]
    } : c));
  }, []);

  const addReaction = useCallback((convoId, msgId, emoji) => {
    setConvos(cs => cs.map(c => c.id === convoId ? {
      ...c,
      messages: c.messages.map(m => m.id === msgId ? {
        ...m,
        reactions: m.reactions?.includes(emoji)
          ? m.reactions.filter(e => e !== emoji)
          : [...(m.reactions || []), emoji]
      } : m)
    } : c));
  }, []);

  const placeOrder = useCallback(() => {
    const id = '#' + (2402 + orders.length);
    const itemsByShop = {};
    cart.forEach(item => {
      const p = PRODUCTS.find(p => p.id === item.productId);
      if (!p) return;
      if (!itemsByShop[p.shopId]) itemsByShop[p.shopId] = [];
      itemsByShop[p.shopId].push(item);
    });
    const newOrders = Object.entries(itemsByShop).map(([shopId, items], i) => {
      const total = items.reduce((s, it) => s + (PRODUCTS.find(p => p.id === it.productId)?.price || 0) * it.qty, 0);
      return { id: '#' + (2402 + orders.length + i), date: 'danas', status: 'pending', shopId, total, items };
    });
    setOrders(o => [...newOrders, ...o]);
    setCart([]);
    showToast('Porudžbina poslata 🌸');
    return id;
  }, [cart, orders, showToast]);

  const value = useMemo(() => ({
    role, setRole, authed, setAuthed,
    categories: CATEGORIES, products: PRODUCTS, shops: SHOPS, reviews: REVIEWS,
    cart, favorites, favShops, follows, orders, convos, notifications,
    addToCart, updateCartQty, removeFromCart, toggleFav, toggleFavShop, toggleFollow,
    sendMessage, addReaction, placeOrder, showToast,
    toast,
  }), [role, authed, cart, favorites, favShops, follows, orders, convos, notifications, toast,
       addToCart, updateCartQty, removeFromCart, toggleFav, toggleFavShop, toggleFollow,
       sendMessage, addReaction, placeOrder, showToast]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

const useStore = () => useContext(StoreCtx);
const fmtPrice = (n) => new Intl.NumberFormat('sr-RS').format(n) + ' RSD';

Object.assign(window, { StoreProvider, useStore, fmtPrice, StoreCtx, CATEGORIES, PRODUCTS, SHOPS, REVIEWS });
