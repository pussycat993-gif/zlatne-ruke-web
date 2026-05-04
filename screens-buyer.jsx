/* global React, Icon, useStore, fmtPrice, Logo, Button, AppBar, Floral, ProductImage, ProductCard, SearchBar, CategoryPill, Stars, Avatar, BottomNav, IconBtn, EmptyState, PriceTag */

const { useState: uS1, useMemo: uM1, useEffect: uE1, useRef: uR1 } = React;

// ───────────────────── 5. HOME BUYER ─────────────────────
function HomeBuyerScreen({ navigate, variant = 'default' }) {
  const { categories, products, shops, follows } = useStore();
  const [activeCat, setActiveCat] = uS1('all');

  const featured = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  if (variant === 'editorial') return <HomeEditorial navigate={navigate} />;
  if (variant === 'discovery') return <HomeDiscovery navigate={navigate} />;

  return (
    <div className="zr-screen">
      {/* Header */}
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>Dobro jutro,</div>
          <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 17 }}>Marija 🌸</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn icon="bell" badge="2" onClick={() => navigate('notifications')} />
          <IconBtn icon="heart" onClick={() => navigate('profile-buyer')} />
        </div>
      </div>

      <div className="zr-scroll">
        <div style={{ padding: '4px 16px 0' }}>
          <SearchBar onFilter={() => navigate('search')} />
        </div>

        {/* Hero banner */}
        <div style={{ margin: '16px', borderRadius: 22, overflow: 'hidden', position: 'relative', background: 'linear-gradient(120deg, #F4D5DC 0%, #E8C9D2 70%)', padding: '20px 18px', minHeight: 140 }}>
          <div style={{ position: 'absolute', right: -10, bottom: -10, fontSize: 90, opacity: 0.4 }}>🌸</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--zr-font-mono)', fontSize: 10, color: 'var(--zr-pink-dark)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>NEDELJA RUKOTVORINA</div>
            <h2 style={{ fontSize: 22, lineHeight: 1.15, maxWidth: 220 }}>Prolećna kolekcija</h2>
            <p style={{ marginTop: 6, fontSize: 12, maxWidth: 220, color: 'var(--zr-pink-dark)' }}>Novih 47 predmeta od 12 majstorica.</p>
            <button className="zr-btn zr-btn-primary" style={{ marginTop: 12, padding: '8px 16px', fontSize: 13 }}>Istraži</button>
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: '0 0 0 16px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button className={`zr-chip ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')} style={{ flexDirection: 'column', height: 'auto', padding: '10px 4px', minWidth: 72, gap: 4 }}>
            <span style={{ fontSize: 22 }}>✨</span><span style={{ fontSize: 11 }}>Sve</span>
          </button>
          {categories.map(c => (
            <CategoryPill key={c.id} category={c} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} />
          ))}
          <div style={{ minWidth: 16 }} />
        </div>

        {/* Featured shops */}
        <div className="zr-section-h">
          <h3>Istaknute majstorice</h3>
          <span className="zr-link">Sve →</span>
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {shops.slice(0, 4).map(s => (
            <div key={s.id} className="zr-card" onClick={() => navigate('shop', { id: s.id })} style={{ minWidth: 180, cursor: 'pointer' }}>
              <div className={`zr-img ${s.color}`} style={{ height: 100 }}><span>{s.cover}</span></div>
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{s.name}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>{s.city} · {s.followers} ❤</div>
                <Stars rating={s.rating} size={10} count={s.reviews} />
              </div>
            </div>
          ))}
          <div style={{ minWidth: 16 }} />
        </div>

        {/* Featured products */}
        <div className="zr-section-h">
          <h3>Izdvajamo</h3>
          <span className="zr-link" onClick={() => navigate('search')}>Sve →</span>
        </div>
        <div className="zr-grid-2">
          {featured.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate('product', { id: p.id })} />)}
        </div>

        {/* Inspirational quote / decorative */}
        <div style={{ margin: '24px 16px', padding: '18px 20px', borderRadius: 20, background: 'white', border: '1px dashed var(--zr-border)', textAlign: 'center' }}>
          <div style={{ fontSize: 26 }}>💕</div>
          <p style={{ fontFamily: 'var(--zr-font-script)', fontSize: 22, color: 'var(--zr-pink-dark)', marginTop: 6, lineHeight: 1.2 }}>
            "Iza svake rukotvorine stoji žena sa pričom."
          </p>
        </div>

        {/* New arrivals */}
        <div className="zr-section-h">
          <h3>Novo ovog meseca</h3>
          <span className="zr-link">Sve →</span>
        </div>
        <div className="zr-grid-2">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate('product', { id: p.id })} />)}
        </div>
        <div style={{ height: 24 }} />
      </div>

      <BottomNav active="home" onChange={(t) => navigate(t === 'home' ? 'home-buyer' : t === 'cart' ? 'cart' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-buyer' : t === 'search' ? 'search' : 'home-buyer')} />
    </div>
  );
}

// VARIANT B — editorial / magazine
function HomeEditorial({ navigate }) {
  const { products, shops, categories } = useStore();
  return (
    <div className="zr-screen">
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'white' }}>
        <Logo size={20} />
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn icon="search" onClick={() => navigate('search')} />
          <IconBtn icon="bell" badge="2" onClick={() => navigate('notifications')} />
        </div>
      </div>

      <div className="zr-scroll" style={{ background: 'white' }}>
        {/* Editorial cover */}
        <div style={{ position: 'relative', height: 360, background: 'linear-gradient(180deg, #F4D5DC 0%, #E8C9D2 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--zr-font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--zr-pink-dark)' }}>BROJ 04 · PROLEĆE</div>
              <h1 style={{ fontFamily: 'var(--zr-font-script)', fontSize: 56, lineHeight: 0.95, color: 'var(--zr-pink-dark)', marginTop: 8, fontWeight: 600 }}>Žene<br/>koje<br/>tkaju</h1>
            </div>
            <div style={{ alignSelf: 'flex-end', maxWidth: 200, textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--zr-pink-dark)' }}>Šest majstorica iz pet gradova Srbije.</div>
              <button className="zr-btn zr-btn-primary" style={{ marginTop: 10, padding: '8px 16px', fontSize: 12 }}>Pročitaj priču →</button>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 100, right: 30, fontSize: 80, opacity: 0.3 }}>🌸</div>
        </div>

        {/* Editorial grid */}
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily: 'var(--zr-font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--zr-gray)', marginBottom: 14 }}>OVE NEDELJE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div className="zr-card" onClick={() => navigate('product', { id: 'p1' })} style={{ cursor: 'pointer' }}>
              <ProductImage product={products[0]} height={220} />
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--zr-pink)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tekstil</div>
                <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', marginTop: 4 }}>{products[0].name}</div>
                <PriceTag price={products[0].price} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2].map(i => (
                <div key={i} className="zr-card" onClick={() => navigate('product', { id: products[i].id })} style={{ cursor: 'pointer', flex: 1 }}>
                  <ProductImage product={products[i]} height={88} />
                  <div style={{ padding: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{products[i].name.slice(0, 24)}…</div>
                    <PriceTag price={products[i].price} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: 16, paddingTop: 0 }}>
          <div style={{ fontFamily: 'var(--zr-font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--zr-gray)', marginBottom: 14 }}>POSETI</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shops.slice(0, 3).map(s => (
              <div key={s.id} onClick={() => navigate('shop', { id: s.id })} className="zr-card" style={{ display: 'flex', cursor: 'pointer' }}>
                <div className={`zr-img ${s.color}`} style={{ width: 90, height: 90, flexShrink: 0 }}><span style={{ fontSize: 9 }}>{s.cover}</span></div>
                <div style={{ padding: 12, flex: 1 }}>
                  <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 22, color: 'var(--zr-pink-dark)', lineHeight: 1 }}>{s.name}</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>{s.city} · od {s.joined}</div>
                  <Stars rating={s.rating} size={10} count={s.reviews} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 24 }} />
      </div>
      <BottomNav active="home" onChange={(t) => navigate(t === 'home' ? 'home-buyer' : t === 'cart' ? 'cart' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-buyer' : t === 'search' ? 'search' : 'home-buyer')} />
    </div>
  );
}

// VARIANT C — discovery / playful
function HomeDiscovery({ navigate }) {
  const { products, categories, shops } = useStore();
  const groups = [
    { title: 'Za tihe večeri', emoji: '🕯️', filter: 'dekor', tone: '#F5DDD2' },
    { title: 'Za tebe i tvoju kožu', emoji: '🌿', filter: 'kozmetika', tone: '#F4D5DC' },
    { title: 'Za doručak nedeljom', emoji: '🍯', filter: 'hrana', tone: '#F8D8D8' },
    { title: 'Za toplu jesen', emoji: '🧶', filter: 'tekstil', tone: '#E8C9D2' },
  ];
  return (
    <div className="zr-screen">
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 30, color: 'var(--zr-pink-dark)', lineHeight: 0.9 }}>Zdravo, Marija</div>
          <div style={{ fontSize: 12 }}>Šta tražimo danas?</div>
        </div>
        <IconBtn icon="bell" badge="2" onClick={() => navigate('notifications')} />
      </div>

      <div className="zr-scroll">
        <div style={{ padding: '8px 16px 0' }}>
          <SearchBar onFilter={() => navigate('search')} placeholder="Pretraži po raspoloženju, boji…" />
        </div>

        {/* Mood pills */}
        <div style={{ display: 'flex', gap: 8, padding: '14px 16px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['🌸 romantično', '✨ za poklon', '🤍 minimalno', '🌿 prirodno', '💕 vintage'].map(m => (
            <button key={m} className="zr-chip" style={{ whiteSpace: 'nowrap' }}>{m}</button>
          ))}
          <div style={{ minWidth: 16 }} />
        </div>

        {/* Mood-based groups */}
        {groups.map((g, i) => {
          const items = products.filter(p => p.category === g.filter).slice(0, 3);
          return (
            <div key={g.title} style={{ marginTop: 22 }}>
              <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: g.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{g.emoji}</div>
                <div>
                  <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 22, color: 'var(--zr-pink-dark)', lineHeight: 1 }}>{g.title}</div>
                  <div style={{ fontSize: 11 }}>{items.length} predmeta</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {items.map(p => (
                  <div key={p.id} style={{ minWidth: 160, cursor: 'pointer' }} onClick={() => navigate('product', { id: p.id })}>
                    <ProductCard product={p} compact />
                  </div>
                ))}
                <div style={{ minWidth: 16 }} />
              </div>
            </div>
          );
        })}

        <div style={{ height: 24 }} />
      </div>
      <BottomNav active="home" onChange={(t) => navigate(t === 'home' ? 'home-buyer' : t === 'cart' ? 'cart' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-buyer' : t === 'search' ? 'search' : 'home-buyer')} />
    </div>
  );
}

// ───────────────────── 7. SHOP DETAIL ─────────────────────
function ShopScreen({ navigate, params }) {
  const { shops, products, follows, toggleFollow, reviews } = useStore();
  const shop = shops.find(s => s.id === params?.id) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const shopReviews = reviews.filter(r => r.shopId === shop.id);
  const [tab, setTab] = uS1('products');
  const isFollowing = follows.has(shop.id);

  return (
    <div className="zr-screen">
      {/* Cover */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div className={`zr-img ${shop.color}`} style={{ height: 180, borderRadius: 0 }}><span style={{ fontSize: 11 }}>{shop.cover}</span></div>
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button className="zr-iconbtn" onClick={() => navigate('home-buyer')} style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}><Icon name="back" size={18}/></button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="zr-iconbtn" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}><Icon name="share" size={18}/></button>
            <button className="zr-iconbtn" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}><Icon name="heart" size={18}/></button>
          </div>
        </div>
        {/* Logo bubble */}
        <div style={{ position: 'absolute', bottom: -34, left: 16, width: 78, height: 78, borderRadius: 999, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--zr-shadow)', border: '4px solid white' }}>
          <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 18, color: 'var(--zr-pink-dark)', textAlign: 'center', lineHeight: 1, padding: 4 }}>{shop.name.split(' ')[0]}</div>
        </div>
      </div>

      <div className="zr-scroll" style={{ paddingTop: 44 }}>
        <div style={{ padding: '0 16px' }}>
          <h1 style={{ fontSize: 22 }}>{shop.name}</h1>
          <div style={{ marginTop: 4, fontSize: 13 }}><Icon name="location" size={12}/> {shop.city} · od {shop.joined}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 14, alignItems: 'center' }}>
            <Stars rating={shop.rating} size={14} showNum count={shop.reviews} />
            <span style={{ fontSize: 12, color: 'var(--zr-gray-soft)' }}>·</span>
            <span style={{ fontSize: 12 }}><b style={{ color: 'var(--zr-pink-dark)' }}>{shop.followers}</b> prati</span>
          </div>
          <p style={{ marginTop: 12, fontSize: 13 }}>{shop.bio}</p>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button full variant={isFollowing ? 'soft' : 'primary'} onClick={() => toggleFollow(shop.id)} icon={isFollowing ? 'check' : 'plus'}>
              {isFollowing ? 'Pratiš' : 'Prati'}
            </Button>
            <Button variant="ghost" onClick={() => navigate('chat', { id: 'c1' })} icon="chat">Poruka</Button>
            <button className="zr-iconbtn" style={{ width: 46, height: 46 }}><Icon name="phone" size={18}/></button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '20px 16px 0', borderBottom: '1px solid var(--zr-border-soft)', marginTop: 12 }}>
          {[['products', `Proizvodi (${shopProducts.length})`], ['reviews', `Recenzije (${shopReviews.length})`], ['about', 'O nama']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              color: tab === id ? 'var(--zr-pink)' : 'var(--zr-gray)',
              borderBottom: tab === id ? '2px solid var(--zr-pink)' : '2px solid transparent',
              marginBottom: -1,
            }}>{label}</button>
          ))}
        </div>

        {tab === 'products' && (
          <div className="zr-grid-2" style={{ paddingTop: 16 }}>
            {shopProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate('product', { id: p.id })} hideShop />)}
          </div>
        )}

        {tab === 'reviews' && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shopReviews.length ? shopReviews.map(r => (
              <div key={r.id} className="zr-card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={r.author} color={r.avatar} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{r.author}</div>
                    <Stars rating={r.rating} size={11} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--zr-gray-soft)' }}>{r.date}</span>
                </div>
                <p style={{ marginTop: 10, fontSize: 13 }}>{r.text}</p>
              </div>
            )) : <EmptyState icon="quote" title="Još nema recenzija" sub="Budi prva 💕" />}
          </div>
        )}

        {tab === 'about' && (
          <div style={{ padding: 16 }}>
            <div className="zr-card" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 20, color: 'var(--zr-pink-dark)' }}>O majstorici</div>
              <p style={{ marginTop: 8, fontSize: 13 }}>{shop.bio}</p>
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div><div style={{ fontSize: 11, color: 'var(--zr-gray-soft)' }}>Lokacija</div><div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{shop.city}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--zr-gray-soft)' }}>Pridružila se</div><div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{shop.joined}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--zr-gray-soft)' }}>Vlasnica</div><div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{shop.owner}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--zr-gray-soft)' }}>Kategorija</div><div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)', textTransform: 'capitalize' }}>{shop.category}</div></div>
              </div>
            </div>
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ───────────────────── 8. PRODUCT DETAIL ─────────────────────
function ProductScreen({ navigate, params }) {
  const { products, shops, reviews, addToCart, favorites, toggleFav } = useStore();
  const product = products.find(p => p.id === params?.id) || products[0];
  const shop = shops.find(s => s.id === product.shopId);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const [imgIdx, setImgIdx] = uS1(0);
  const [qty, setQty] = uS1(1);
  const isFav = favorites.has(product.id);

  const colorVariants = ['v2', 'v3', 'v4'];

  return (
    <div className="zr-screen">
      <div className="zr-scroll" style={{ paddingBottom: 90 }}>
        {/* Image carousel */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ProductImage product={product} height={340} color={colorVariants[imgIdx]} />
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
            <button className="zr-iconbtn" onClick={() => navigate('home-buyer')} style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}><Icon name="back" size={18}/></button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="zr-iconbtn" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}><Icon name="share" size={18}/></button>
              <button className="zr-iconbtn" onClick={() => toggleFav(product.id)} style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', color: isFav ? 'var(--zr-pink)' : undefined }}>
                <Icon name={isFav ? 'heart-fill' : 'heart'} size={18}/>
              </button>
            </div>
          </div>
          {/* Dots */}
          <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {colorVariants.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{
                width: i === imgIdx ? 22 : 6, height: 6, borderRadius: 999,
                background: i === imgIdx ? 'var(--zr-pink-dark)' : 'rgba(255,255,255,0.7)',
                border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.2s',
              }}/>
            ))}
          </div>
        </div>

        <div style={{ padding: 16, background: 'var(--zr-cream)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--zr-pink)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.category}</div>
              <h1 style={{ fontSize: 22, marginTop: 4, lineHeight: 1.2 }}>{product.name}</h1>
              <div style={{ marginTop: 8 }}>
                <Stars rating={product.rating} size={13} showNum count={product.reviewCount} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <PriceTag price={product.price} oldPrice={product.oldPrice} size="lg" />
            <span style={{ fontSize: 12, color: 'var(--zr-gray-soft)' }}>· dostava 350 RSD</span>
          </div>

          {/* Shop card */}
          <div className="zr-card" style={{ marginTop: 16, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('shop', { id: shop.id })}>
            <div className={`zr-img ${shop.color}`} style={{ width: 48, height: 48, borderRadius: 999 }}><span style={{ fontSize: 8 }}> </span></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 18, color: 'var(--zr-pink-dark)', lineHeight: 1 }}>{shop.name}</div>
              <div style={{ fontSize: 11 }}>{shop.city} · {shop.followers} prate</div>
            </div>
            <Icon name="chevron" size={16} stroke="var(--zr-gray-soft)" />
          </div>

          {/* Color */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', marginBottom: 8 }}>Boja: <span style={{ fontWeight: 400 }}>varijanta {imgIdx + 1}</span></div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['#D8A8B6', '#E8B5A0', '#C49AAA'].map((c, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: 36, height: 36, borderRadius: 999, background: c,
                  border: imgIdx === i ? '2.5px solid var(--zr-pink-dark)' : '2px solid white',
                  outline: imgIdx === i ? '2px solid var(--zr-pink)' : 'none',
                  outlineOffset: 1, cursor: 'pointer',
                }}/>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', marginBottom: 6 }}>Opis</div>
            <p style={{ fontSize: 13 }}>{product.desc}</p>
          </div>

          {/* Quantity */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>Količina · <span style={{ fontWeight: 400 }}>{product.inStock} dostupno</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 999, border: '1.5px solid var(--zr-border)', padding: 4 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 28, height: 28, borderRadius: 999, border: 'none', background: 'var(--zr-pink-light)', color: 'var(--zr-pink-dark)', cursor: 'pointer' }}>−</button>
              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.inStock, qty + 1))} style={{ width: 28, height: 28, borderRadius: 999, border: 'none', background: 'var(--zr-pink)', color: 'white', cursor: 'pointer' }}>+</button>
            </div>
          </div>

          {/* Reviews */}
          {productReviews.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15 }}>Recenzije</h3>
                <span style={{ fontSize: 12, color: 'var(--zr-pink)', fontWeight: 600 }}>Sve →</span>
              </div>
              {productReviews.slice(0, 2).map(r => (
                <div key={r.id} className="zr-card" style={{ padding: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={r.author} size={32} color={r.avatar}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{r.author}</div>
                      <Stars rating={r.rating} size={10}/>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--zr-gray-soft)' }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 12, marginTop: 8 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'white', borderTop: '1px solid var(--zr-border-soft)', display: 'flex', gap: 8 }}>
        <button className="zr-iconbtn" style={{ width: 48, height: 48 }} onClick={() => navigate('chat', { id: 'c1' })}><Icon name="chat" size={20}/></button>
        <Button full variant="ghost" onClick={() => addToCart(product.id, qty)} icon="bag">U korpu</Button>
        <Button full onClick={() => { addToCart(product.id, qty); setTimeout(() => navigate('cart'), 400); }}>Kupi sad</Button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeBuyerScreen, ShopScreen, ProductScreen });
