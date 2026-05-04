/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, ProductCardW, SectionHeader, Crumbs */
const { useState, useMemo, useEffect } = React;

// ─── CATALOG (default — sidebar filters + grid) ───
function Catalog() {
  const { products, categories, shops } = useWStore();
  const { route } = useRoute();
  const params = new URLSearchParams(route.split('?')[1] || '');
  const initialCat = params.get('cat') || 'sve';
  const initialQ = params.get('q') || '';

  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState('preporuceno');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [view, setView] = useState('grid');
  const [shopFilter, setShopFilter] = useState('sve');

  const filtered = useMemo(() => {
    let r = products;
    if (cat !== 'sve') r = r.filter(p => p.category === cat);
    if (shopFilter !== 'sve') r = r.filter(p => p.shopId === shopFilter);
    if (q) r = r.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    r = r.filter(p => p.price <= maxPrice);
    if (sort === 'cena-rast') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'cena-opad') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'ocena') r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [products, cat, shopFilter, q, maxPrice, sort]);

  return (
    <Page>
      <div className="zw-container" style={{ paddingTop: 8 }}>
        <Crumbs items={[{ label: 'Početna', href: '/' }, { label: 'Katalog' }, ...(cat !== 'sve' ? [{ label: categories.find(c => c.id === cat)?.name }] : [])]} />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, marginBottom: 32, gap: 24 }}>
          <div>
            <div className="zw-eyebrow" style={{ marginBottom: 8 }}>{filtered.length} proizvoda</div>
            <h1 style={{ fontSize: 48 }}>{cat === 'sve' ? 'Sve rukotvorine' : categories.find(c => c.id === cat)?.name}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '11px 16px', borderRadius: 999, border: '1.5px solid var(--zr-border)', background: 'white', fontSize: 13, fontFamily: 'inherit', color: 'var(--zr-pink-dark)', fontWeight: 600, cursor: 'pointer' }}>
              <option value="preporuceno">Preporučeno</option>
              <option value="ocena">Najbolje ocenjeno</option>
              <option value="cena-rast">Cena: rastuća</option>
              <option value="cena-opad">Cena: opadajuća</option>
            </select>
            <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} style={{ width: 40, height: 40, borderRadius: 999, border: '1.5px solid var(--zr-border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink-dark)' }}>
              <Icon name={view === 'grid' ? 'list' : 'grid'} size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, alignItems: 'start' }}>
          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 130, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <FilterBlock title="Pretraga">
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Pretraži…" className="zw-input" />
            </FilterBlock>

            <FilterBlock title="Kategorija">
              <FilterRadio name="cat" value="sve" current={cat} onChange={setCat} label="Sve kategorije" count={products.length} />
              {categories.map(c => (
                <FilterRadio key={c.id} name="cat" value={c.id} current={cat} onChange={setCat} label={`${c.emoji} ${c.name}`} count={products.filter(p => p.category === c.id).length} />
              ))}
            </FilterBlock>

            <FilterBlock title="Cena">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--zr-gray)', marginBottom: 8 }}>
                <span>0 RSD</span>
                <span style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(maxPrice)}</span>
              </div>
              <input type="range" min="500" max="10000" step="100" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: 'var(--zr-pink)' }} />
            </FilterBlock>

            <FilterBlock title="Radnja">
              <FilterRadio name="shop" value="sve" current={shopFilter} onChange={setShopFilter} label="Sve radnje" />
              {shops.slice(0, 5).map(s => (
                <FilterRadio key={s.id} name="shop" value={s.id} current={shopFilter} onChange={setShopFilter} label={s.name} count={products.filter(p => p.shopId === s.id).length} />
              ))}
            </FilterBlock>

            <button onClick={() => { setCat('sve'); setQ(''); setMaxPrice(10000); setShopFilter('sve'); }}
              className="zw-btn zw-btn-ghost" style={{ width: '100%' }}>Resetuj filtere</button>
          </aside>

          {/* Results */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--zr-gray)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
                <h3 style={{ fontSize: 22 }}>Nema rezultata</h3>
                <p style={{ marginTop: 8 }}>Probaj sa drugim filterima.</p>
              </div>
            ) : view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 80 }}>
                {filtered.map(p => <ProductCardW key={p.id} product={p} size="s" />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 80 }}>
                {filtered.map(p => <ListProduct key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

function FilterBlock({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--zr-pink-dark)', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function FilterRadio({ value, current, onChange, label, count, name }) {
  const active = value === current;
  return (
    <button onClick={() => onChange(value)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: active ? 'var(--zr-pink-light)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: active ? 'var(--zr-pink-dark)' : 'var(--zr-gray)', fontWeight: active ? 700 : 500, textAlign: 'left', transition: 'all 0.15s' }}>
      <span>{label}</span>
      {count !== undefined && <span style={{ fontSize: 11, color: active ? 'var(--zr-pink)' : 'var(--zr-gray-soft)' }}>{count}</span>}
    </button>
  );
}

function ListProduct({ product }) {
  const { shops, addToCart, toggleFav, favorites } = useWStore();
  const shop = shops.find(s => s.id === product.shopId);
  const fav = favorites.has(product.id);
  return (
    <div style={{ background: 'white', borderRadius: 18, padding: 16, display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 24, alignItems: 'center', boxShadow: 'var(--zr-shadow-sm)' }}>
      <div className={`zw-img ${product.color}`} style={{ width: 180, height: 140, borderRadius: 12, fontSize: 0, cursor: 'pointer' }} onClick={() => navigate('/proizvod/' + product.id)}>
        <span>{product.img}</span>
      </div>
      <div style={{ cursor: 'pointer' }} onClick={() => navigate('/proizvod/' + product.id)}>
        <div style={{ fontSize: 12, color: 'var(--zr-gray)', fontWeight: 600 }}>{shop?.name} · {shop?.city}</div>
        <h3 style={{ fontSize: 20, marginTop: 4 }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: 'var(--zr-gray)', marginTop: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.desc}</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--zr-gray)' }}>
          <span>⭐ {product.rating} ({product.reviewCount} recenzija)</span>
          <span>📦 Na stanju: {product.inStock}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {product.oldPrice && <div style={{ fontSize: 13, color: 'var(--zr-gray-soft)', textDecoration: 'line-through' }}>{wFmtPrice(product.oldPrice)}</div>}
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(product.price)}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => toggleFav(product.id)} style={{ width: 40, height: 40, borderRadius: 999, border: '1.5px solid var(--zr-border)', background: 'white', cursor: 'pointer', color: fav ? 'var(--zr-pink)' : 'var(--zr-gray)' }}>
            <Icon name="heart" size={16} fill={fav ? 'var(--zr-pink)' : 'none'} />
          </button>
          <button onClick={() => addToCart(product.id)} className="zw-btn zw-btn-primary">+ U korpu</button>
        </div>
      </div>
    </div>
  );
}

// ─── CATALOG B — Editorial / pinterest-y masonry ───
function CatalogB() {
  const { products, categories } = useWStore();
  const [cat, setCat] = useState('sve');
  const filtered = cat === 'sve' ? products : products.filter(p => p.category === cat);

  return (
    <Page>
      <section style={{ background: 'var(--zr-cream)', padding: '40px 0' }}>
        <div className="zw-container" style={{ textAlign: 'center' }}>
          <div className="zw-eyebrow" style={{ marginBottom: 12 }}>Katalog</div>
          <h1 style={{ fontSize: 64, lineHeight: 1, textWrap: 'balance' }}>
            Pregled <span className="zw-script" style={{ fontSize: 80, color: 'var(--zr-pink)' }}>radionica.</span>
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: 'var(--zr-gray)', maxWidth: 600, margin: '18px auto 0' }}>
            Listaj kao kroz magazin. Klikni što ti zapadne za oko.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <button className={`zw-chip ${cat === 'sve' ? 'active' : ''}`} onClick={() => setCat('sve')}>Sve</button>
            {categories.map(c => (
              <button key={c.id} className={`zw-chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>{c.emoji} {c.name}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div className="zw-container">
          {/* Masonry-ish — varied heights */}
          <div style={{ columnCount: 4, columnGap: 24 }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ breakInside: 'avoid', marginBottom: 24 }}>
                <MasonryCard product={p} h={[260, 340, 300, 380, 280, 360][i % 6]} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}

function MasonryCard({ product, h }) {
  const { shops, toggleFav, favorites } = useWStore();
  const shop = shops.find(s => s.id === product.shopId);
  const fav = favorites.has(product.id);
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => navigate('/proizvod/' + product.id)} style={{ cursor: 'pointer', position: 'relative', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s', transform: hover ? 'translateY(-3px)' : 'none' }}>
      <div className={`zw-img ${product.color}`} style={{ width: '100%', height: h, fontSize: 0 }}><span>{product.img}</span></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, background: 'linear-gradient(180deg, transparent, rgba(160,68,90,0.85))', color: 'white', opacity: hover ? 1 : 0.92, transition: 'opacity 0.2s' }}>
        <div style={{ fontSize: 11, opacity: 0.85, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em' }}>{shop?.name}</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{wFmtPrice(product.price)}</span>
          <button onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }} style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.2)', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={14} fill={fav ? 'white' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Catalog, CatalogB });
