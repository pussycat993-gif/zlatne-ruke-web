/* global React, Icon, useStore, fmtPrice, Logo, Button, AppBar, Floral, ProductImage, ProductCard, SearchBar, CategoryPill, Stars, Avatar, BottomNav, IconBtn, EmptyState, PriceTag */

const { useState: uS2, useMemo: uM2 } = React;

// ───────────────────── 9. SEARCH ─────────────────────
function SearchScreen({ navigate }) {
  const { products, categories } = useStore();
  const [q, setQ] = uS2('');
  const [cat, setCat] = uS2('all');
  const [priceMax, setPriceMax] = uS2(7000);
  const [filtersOpen, setFiltersOpen] = uS2(false);
  const [view, setView] = uS2('grid');
  const [sort, setSort] = uS2('relevance');

  const filtered = uM2(() => {
    let r = products.filter(p => (cat === 'all' || p.category === cat));
    if (q.trim()) r = r.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    r = r.filter(p => p.price <= priceMax);
    if (sort === 'price-asc') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [q, cat, priceMax, sort, products]);

  const recents = ['pleteni šal', 'sojina sveća', 'srebro', 'lavanda sapun'];

  return (
    <div className="zr-screen">
      <AppBar back onBack={() => navigate('home-buyer')} title="Pretraga" />
      <div style={{ padding: '0 0 12px' }}>
        <SearchBar value={q} onChange={setQ} onFilter={() => setFiltersOpen(true)} />
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <button className={`zr-chip ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>Sve</button>
        {categories.map(c => (
          <button key={c.id} className={`zr-chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
            {c.emoji} {c.name}
          </button>
        ))}
        <div style={{ minWidth: 16 }} />
      </div>
      <div className="zr-scroll">
        {!q.trim() && cat === 'all' && (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skorije pretrage</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {recents.map(r => (
                <button key={r} className="zr-chip" onClick={() => setQ(r)}><Icon name="search" size={12}/> {r}</button>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Popularne kategorije</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {categories.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  padding: 14, borderRadius: 16, background: 'white', border: '1.5px solid var(--zr-border)',
                  display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left'
                }}>
                  <span style={{ fontSize: 26 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--zr-gray-soft)' }}>{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {(q.trim() || cat !== 'all') && (
          <>
            <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12 }}><b style={{ color: 'var(--zr-pink-dark)' }}>{filtered.length}</b> rezultata</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <select value={sort} onChange={e => setSort(e.target.value)} style={{
                  background: 'white', border: '1.5px solid var(--zr-border)', borderRadius: 999, padding: '6px 12px',
                  fontSize: 12, color: 'var(--zr-pink-dark)', fontFamily: 'inherit', fontWeight: 600,
                }}>
                  <option value="relevance">Relevantnost</option>
                  <option value="price-asc">Cena rastuće</option>
                  <option value="price-desc">Cena opadajuće</option>
                  <option value="rating">Najbolje ocenjeno</option>
                </select>
                <button className="zr-iconbtn" onClick={() => setView(view === 'grid' ? 'list' : 'grid')} style={{ width: 32, height: 32 }}>
                  <Icon name={view === 'grid' ? 'list' : 'grid'} size={14}/>
                </button>
              </div>
            </div>
            {view === 'grid' ? (
              <div className="zr-grid-2">
                {filtered.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate('product', { id: p.id })} />)}
              </div>
            ) : (
              <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(p => (
                  <div key={p.id} className="zr-card" style={{ display: 'flex', cursor: 'pointer' }} onClick={() => navigate('product', { id: p.id })}>
                    <ProductImage product={p} />
                    <div style={{ width: 110, height: 110, flexShrink: 0 }}>
                      <ProductImage product={p} height={110} />
                    </div>
                    <div style={{ padding: 12, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{p.name}</div>
                      <Stars rating={p.rating} size={11} count={p.reviewCount} />
                      <div style={{ marginTop: 6 }}><PriceTag price={p.price} oldPrice={p.oldPrice} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filtered.length === 0 && <EmptyState icon="search" title="Nema rezultata" sub="Probaj sa drugačijim pojmom 🌸" />}
          </>
        )}
        <div style={{ height: 24 }} />
      </div>

      {filtersOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(160,68,90,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setFiltersOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="zr-fadein" style={{ background: 'var(--zr-cream)', borderRadius: '24px 24px 0 0', padding: '20px 20px 32px', width: '100%' }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--zr-border)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18 }}>Filteri</h3>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', marginBottom: 8 }}>Maksimalna cena: {fmtPrice(priceMax)}</div>
              <input type="range" min="500" max="10000" step="100" value={priceMax} onChange={e => setPriceMax(+e.target.value)} style={{ width: '100%', accentColor: 'var(--zr-pink)' }}/>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', marginBottom: 8 }}>Kategorija</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[{id:'all',emoji:'✨',name:'Sve'}, ...categories].map(c => (
                  <button key={c.id} className={`zr-chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>{c.emoji} {c.name}</button>
                ))}
              </div>
            </div>
            <Button full style={{ marginTop: 24 }} onClick={() => setFiltersOpen(false)}>Primeni filtere</Button>
          </div>
        </div>
      )}
      <BottomNav active="search" onChange={(t) => navigate(t === 'home' ? 'home-buyer' : t === 'cart' ? 'cart' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-buyer' : 'search')} />
    </div>
  );
}

// ───────────────────── 10. CART ─────────────────────
function CartScreen({ navigate }) {
  const { cart, products, shops, updateCartQty, removeFromCart, placeOrder } = useStore();
  const itemsByShop = uM2(() => {
    const groups = {};
    cart.forEach(item => {
      const p = products.find(p => p.id === item.productId);
      if (!p) return;
      groups[p.shopId] ??= [];
      groups[p.shopId].push({ ...item, product: p });
    });
    return groups;
  }, [cart, products]);
  const subtotal = cart.reduce((s, it) => s + (products.find(p => p.id === it.productId)?.price || 0) * it.qty, 0);
  const delivery = cart.length ? 350 * Object.keys(itemsByShop).length : 0;
  const total = subtotal + delivery;

  return (
    <div className="zr-screen">
      <AppBar back onBack={() => navigate('home-buyer')} title="Korpa" subtitle={`${cart.length} ${cart.length === 1 ? 'predmet' : 'predmeta'}`} />
      <div className="zr-scroll" style={{ paddingBottom: cart.length ? 200 : 24 }}>
        {!cart.length ? (
          <EmptyState icon="bag" title="Tvoja korpa je prazna" sub="Pronađi prelepe rukotvorine i napuni je 🌸"
            action={<Button onClick={() => navigate('home-buyer')}>Istraži</Button>} />
        ) : (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(itemsByShop).map(([shopId, items]) => {
              const shop = shops.find(s => s.id === shopId);
              return (
                <div key={shopId} className="zr-card" style={{ padding: 0 }}>
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--zr-border-soft)' }} onClick={() => navigate('shop', { id: shopId })}>
                    <div className={`zr-img ${shop.color}`} style={{ width: 32, height: 32, borderRadius: 999 }}><span style={{ fontSize: 7 }}> </span></div>
                    <div style={{ flex: 1, fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{shop.name}</div>
                    <Icon name="chevron" size={14} stroke="var(--zr-gray-soft)" />
                  </div>
                  {items.map(it => (
                    <div key={it.productId} style={{ padding: 12, display: 'flex', gap: 12, borderBottom: '1px solid var(--zr-border-soft)' }}>
                      <div style={{ width: 78, height: 78, flexShrink: 0, borderRadius: 12, overflow: 'hidden' }}>
                        <ProductImage product={it.product} height={78}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{it.product.name}</div>
                        <PriceTag price={it.product.price} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--zr-pink-light)', borderRadius: 999, padding: 3 }}>
                            <button onClick={() => updateCartQty(it.productId, it.qty - 1)} style={{ width: 24, height: 24, borderRadius: 999, border: 'none', background: 'white', color: 'var(--zr-pink-dark)', cursor: 'pointer', fontSize: 14 }}>−</button>
                            <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{it.qty}</span>
                            <button onClick={() => updateCartQty(it.productId, it.qty + 1)} style={{ width: 24, height: 24, borderRadius: 999, border: 'none', background: 'var(--zr-pink)', color: 'white', cursor: 'pointer', fontSize: 14 }}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(it.productId)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--zr-gray-soft)' }}><Icon name="trash" size={16}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {/* Promo code */}
            <div className="zr-card" style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name="tag" size={18} stroke="var(--zr-pink)"/>
              <input className="zr-input" placeholder="Promo kod" style={{ flex: 1, padding: '8px 12px', border: 'none' }} />
              <button className="zr-btn zr-btn-soft" style={{ padding: '8px 16px', fontSize: 12 }}>Primeni</button>
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, background: 'white', borderTop: '1px solid var(--zr-border-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>Subtotal</span><span style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{fmtPrice(subtotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}><span>Dostava ({Object.keys(itemsByShop).length} radnji)</span><span>{fmtPrice(delivery)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, paddingTop: 8, borderTop: '1px dashed var(--zr-border)' }}>
            <span style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>Ukupno</span>
            <span style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{fmtPrice(total)}</span>
          </div>
          <Button full style={{ marginTop: 12 }} onClick={() => { placeOrder(); setTimeout(() => navigate('orders'), 600); }} icon="heart">Naruči</Button>
        </div>
      )}
    </div>
  );
}

// ───────────────────── 11. ORDERS ─────────────────────
function OrdersScreen({ navigate }) {
  const { orders, products, shops } = useStore();
  const [tab, setTab] = uS2('all');
  const statusInfo = {
    pending: { label: 'Na čekanju', color: '#E8B547', icon: 'refresh' },
    shipped: { label: 'U transportu', color: '#67c693', icon: 'truck' },
    delivered: { label: 'Isporučeno', color: '#7AAB89', icon: 'check' },
  };
  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  return (
    <div className="zr-screen">
      <AppBar back onBack={() => navigate('profile-buyer')} title="Moje porudžbine" />
      <div style={{ display: 'flex', gap: 4, padding: '0 16px 12px', borderBottom: '1px solid var(--zr-border-soft)' }}>
        {[['all', 'Sve'], ['pending', 'Aktivne'], ['shipped', 'U putu'], ['delivered', 'Isporučene']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            color: tab === id ? 'var(--zr-pink)' : 'var(--zr-gray)',
            borderBottom: tab === id ? '2px solid var(--zr-pink)' : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>
      <div className="zr-scroll" style={{ padding: 16 }}>
        {filtered.length ? filtered.map(o => {
          const shop = shops.find(s => s.id === o.shopId);
          const info = statusInfo[o.status];
          const firstProduct = products.find(p => p.id === o.items[0]?.productId);
          return (
            <div key={o.id} className="zr-card" style={{ padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--zr-font-mono)', color: 'var(--zr-gray)' }}>{o.id} · {o.date}</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: info.color, background: info.color + '20', padding: '3px 10px', borderRadius: 999 }}>
                  <Icon name={info.icon} size={11}/> {info.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                {firstProduct && <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}><ProductImage product={firstProduct} height={60}/></div>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{shop?.name}</div>
                  <div style={{ fontSize: 12 }}>{o.items.length} {o.items.length === 1 ? 'predmet' : 'predmeta'}</div>
                  <div style={{ marginTop: 4 }}><PriceTag price={o.total}/></div>
                </div>
              </div>
              {o.status === 'shipped' && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: 'var(--zr-cream-deep)', borderRadius: 12 }}>
                  <Icon name="truck" size={16} stroke="#67c693"/>
                  <div style={{ flex: 1, fontSize: 12 }}>Stiže za 2 dana · paket #ZR2401</div>
                  <span style={{ fontSize: 11, color: 'var(--zr-pink)', fontWeight: 600 }}>Prati →</span>
                </div>
              )}
              {o.status === 'delivered' && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <Button variant="ghost" style={{ flex: 1, padding: '10px 12px', fontSize: 12 }} icon="star">Oceni</Button>
                  <Button variant="soft" style={{ flex: 1, padding: '10px 12px', fontSize: 12 }} icon="refresh">Naruči ponovo</Button>
                </div>
              )}
            </div>
          );
        }) : <EmptyState icon="package" title="Nema porudžbina" sub="Tvoje porudžbine će se pojaviti ovde."/>}
      </div>
    </div>
  );
}

// ───────────────────── 15. NOTIFICATIONS ─────────────────────
function NotificationsScreen({ navigate }) {
  const { notifications } = useStore();
  return (
    <div className="zr-screen">
      <AppBar back onBack={() => navigate('home-buyer')} title="Obaveštenja" right={<button className="zr-iconbtn"><Icon name="check-double" size={18}/></button>} />
      <div className="zr-scroll" style={{ padding: '0 16px' }}>
        {notifications.map(n => (
          <div key={n.id} className="zr-card" style={{ padding: 14, marginBottom: 10, display: 'flex', gap: 12, position: 'relative', background: n.unread ? 'white' : 'transparent', boxShadow: n.unread ? 'var(--zr-shadow-sm)' : 'none', border: n.unread ? 'none' : '1px solid var(--zr-border-soft)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 999, background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink-dark)', flexShrink: 0 }}>
              <Icon name={n.icon} size={18}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{n.title}</div>
              <div style={{ fontSize: 12, marginTop: 2 }}>{n.text}</div>
              <div style={{ fontSize: 11, color: 'var(--zr-gray-soft)', marginTop: 4 }}>{n.time}</div>
            </div>
            {n.unread && <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--zr-pink)', position: 'absolute', top: 16, right: 12 }}/>}
          </div>
        ))}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ───────────────────── 16. PROFILE BUYER ─────────────────────
function ProfileBuyerScreen({ navigate }) {
  const { favorites, follows, orders } = useStore();
  const items = [
    { icon: 'package', label: 'Moje porudžbine', sub: `${orders.length} porudžbina`, action: () => navigate('orders') },
    { icon: 'heart-fill', label: 'Omiljeno', sub: `${favorites.size} predmeta · ${follows.size} radnji`, action: () => {} },
    { icon: 'location', label: 'Adrese za dostavu', sub: '2 sačuvane adrese', action: () => {} },
    { icon: 'tag', label: 'Promo kodovi', sub: '3 dostupna', action: () => {} },
    { icon: 'bell', label: 'Obaveštenja', sub: 'Email, push, SMS', action: () => navigate('notifications') },
    { icon: 'shield', label: 'Privatnost & sigurnost', sub: 'Lozinka, blokirani', action: () => {} },
    { icon: 'info', label: 'Pomoć & podrška', sub: 'FAQ, kontakt', action: () => {} },
  ];
  return (
    <div className="zr-screen">
      <AppBar title="Moj profil" right={<button className="zr-iconbtn"><Icon name="settings" size={18}/></button>} />
      <div className="zr-scroll">
        <div style={{ padding: '0 16px' }}>
          <div className="zr-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(120deg, white, var(--zr-pink-light))' }}>
            <Avatar name="Marija Petrović" size={56} color="#F4D5DC"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>Marija Petrović</div>
              <div style={{ fontSize: 12 }}>marija@email.com</div>
              <div style={{ marginTop: 4, fontSize: 11, color: 'var(--zr-pink)', fontWeight: 600 }}>🌸 Članica od marta 2024</div>
            </div>
            <button className="zr-iconbtn"><Icon name="edit" size={16}/></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
            {[['12', 'porudžbina'], [favorites.size, 'omiljeno'], [follows.size, 'pratim']].map(([n, l]) => (
              <div key={l} className="zr-card" style={{ padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--zr-pink-dark)', fontFamily: 'var(--zr-font-script)' }}>{n}</div>
                <div style={{ fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map(it => (
              <button key={it.label} onClick={it.action} className="zr-card" style={{
                padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', boxShadow: 'none', background: 'transparent',
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--zr-pink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink-dark)', flexShrink: 0 }}>
                  <Icon name={it.icon} size={16}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{it.label}</div>
                  <div style={{ fontSize: 11 }}>{it.sub}</div>
                </div>
                <Icon name="chevron" size={16} stroke="var(--zr-gray-soft)"/>
              </button>
            ))}
          </div>

          <button className="zr-btn zr-btn-ghost" style={{ width: '100%', marginTop: 16, color: 'var(--zr-pink)', borderColor: 'var(--zr-border)' }} onClick={() => navigate('landing')}>
            <Icon name="logout" size={16}/> Odjavi se
          </button>
          <div style={{ height: 24 }} />
        </div>
      </div>
      <BottomNav active="profile" onChange={(t) => navigate(t === 'home' ? 'home-buyer' : t === 'cart' ? 'cart' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-buyer' : t === 'search' ? 'search' : 'profile-buyer')} />
    </div>
  );
}

Object.assign(window, { SearchScreen, CartScreen, OrdersScreen, NotificationsScreen, ProfileBuyerScreen });
