/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, ProductCardW, SectionHeader, Crumbs */
const { useState, useMemo, useEffect } = React;

// ─── PRODUCT PAGE ───
function ProductPage() {
  const { parts } = useRoute();
  const id = parts[1];
  const { products, shops, reviews, addToCart, toggleFav, favorites } = useWStore();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('opis');
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) return <Page><div className="zw-container" style={{ padding: 80, textAlign: 'center' }}><h2>Proizvod nije pronađen</h2></div></Page>;

  const shop = shops.find(s => s.id === product.shopId);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const fav = favorites.has(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const variants = ['v2', 'v3', 'v4', 'v5'];

  return (
    <Page>
      <div className="zw-container">
        <Crumbs items={[{ label: 'Početna', href: '/' }, { label: 'Katalog', href: '/katalog' }, { label: product.name }]} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, marginTop: 12, marginBottom: 64 }}>
          {/* Gallery */}
          <div>
            <div className={`zw-img ${variants[imgIdx]}`} style={{ width: '100%', height: 580, borderRadius: 22, fontSize: 0, marginBottom: 16 }}>
              <span style={{ fontSize: 11 }}>{product.img}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {variants.map((v, i) => (
                <div key={v} onClick={() => setImgIdx(i)} className={`zw-img ${v}`} style={{ height: 100, borderRadius: 14, fontSize: 0, cursor: 'pointer', border: imgIdx === i ? '2px solid var(--zr-pink)' : '2px solid transparent' }} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div onClick={() => navigate('/radnja/' + shop.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--zr-cream)', borderRadius: 14, cursor: 'pointer', marginBottom: 18 }}>
              <div className={`zw-img ${shop.color}`} style={{ width: 40, height: 40, borderRadius: 10, fontSize: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{shop.name}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{shop.city} · ⭐ {shop.rating} · {shop.followers} prati</div>
              </div>
              <span style={{ fontSize: 14, color: 'var(--zr-pink)', fontWeight: 600 }}>Poseti →</span>
            </div>

            <h1 style={{ fontSize: 40, lineHeight: 1.1, textWrap: 'balance' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, fontSize: 13, color: 'var(--zr-gray)' }}>
              <span>⭐ {product.rating} ({product.reviewCount} recenzija)</span>
              <span>·</span>
              <span>{product.inStock <= 3 ? `Još samo ${product.inStock} na stanju` : `Na stanju: ${product.inStock}`}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 24 }}>
              <span style={{ fontSize: 42, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(product.price)}</span>
              {product.oldPrice && <>
                <span style={{ fontSize: 18, color: 'var(--zr-gray-soft)', textDecoration: 'line-through' }}>{wFmtPrice(product.oldPrice)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: 'var(--zr-pink-light)', color: 'var(--zr-pink-dark)' }}>−{Math.round((1 - product.price/product.oldPrice)*100)}%</span>
              </>}
            </div>

            <p style={{ fontSize: 15, color: 'var(--zr-gray)', lineHeight: 1.7, marginTop: 24 }}>{product.desc}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--zr-border)', borderRadius: 999 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--zr-pink-dark)' }}><Icon name="minus" size={14} /></button>
                <div style={{ width: 40, textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{qty}</div>
                <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--zr-pink-dark)' }}><Icon name="plus" size={14} /></button>
              </div>
              <button onClick={() => addToCart(product.id, qty)} className="zw-btn zw-btn-primary zw-btn-lg" style={{ flex: 1 }}>
                Dodaj u korpu — {wFmtPrice(product.price * qty)}
              </button>
              <button onClick={() => toggleFav(product.id)} style={{ width: 56, height: 56, borderRadius: 999, border: '1.5px solid var(--zr-border)', background: 'white', cursor: 'pointer', color: fav ? 'var(--zr-pink)' : 'var(--zr-gray)' }}>
                <Icon name="heart" size={20} fill={fav ? 'var(--zr-pink)' : 'none'} />
              </button>
            </div>

            <button onClick={() => navigate('/chat?shop=' + shop.id)} className="zw-btn zw-btn-soft" style={{ width: '100%', marginTop: 12 }}>
              <Icon name="chat" size={16} /> Pošalji poruku majstorici
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 28 }}>
              <BadgeRow icon="🚚" t="Dostava" d="2–4 dana" />
              <BadgeRow icon="↩️" t="Povraćaj" d="14 dana" />
              <BadgeRow icon="✋" t="Ručno" d="rađeno" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--zr-border-soft)', display: 'flex', gap: 32 }}>
          {['opis','recenzije','dostava'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: 14, fontWeight: 700, color: tab === t ? 'var(--zr-pink-dark)' : 'var(--zr-gray)', cursor: 'pointer', borderBottom: tab === t ? '2px solid var(--zr-pink)' : '2px solid transparent', marginBottom: -1, fontFamily: 'inherit', textTransform: 'capitalize' }}>
              {t === 'opis' ? 'Opis & detalji' : t === 'recenzije' ? `Recenzije (${product.reviewCount})` : 'Dostava & povraćaj'}
            </button>
          ))}
        </div>

        <div style={{ padding: '32px 0 64px', minHeight: 200 }}>
          {tab === 'opis' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 64 }}>
              <div>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--zr-gray)' }}>{product.desc}</p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--zr-gray)', marginTop: 16 }}>
                  Svaki komad nastaje u ateljeu majstorice. Mali serije, ručno rađeno, ne ponavlja se.
                  Materijali su lokalnog porekla, gde je god to moguće.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 16, marginBottom: 16 }}>Detalji</h4>
                <DetailRow l="Materijal" v="100% merino vuna" />
                <DetailRow l="Dimenzije" v="180 × 35 cm" />
                <DetailRow l="Težina" v="280g" />
                <DetailRow l="Pranje" v="Ručno, 30°C" />
                <DetailRow l="Poreklo" v="Novi Sad, Srbija" />
              </div>
            </div>
          )}

          {tab === 'recenzije' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
              <div>
                <div style={{ fontSize: 64, fontWeight: 700, color: 'var(--zr-pink-dark)', lineHeight: 1 }}>{product.rating}</div>
                <div style={{ display: 'flex', gap: 2, marginTop: 8, fontSize: 18 }}>{'⭐'.repeat(Math.round(product.rating))}</div>
                <div style={{ fontSize: 13, color: 'var(--zr-gray)', marginTop: 8 }}>{product.reviewCount} recenzija</div>
                <button className="zw-btn zw-btn-soft" style={{ marginTop: 24 }}>Napiši recenziju</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {productReviews.map(r => (
                  <div key={r.id} style={{ padding: 20, background: 'var(--zr-cream)', borderRadius: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="zw-avatar">{r.author[0]}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{r.author}</div>
                        <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{r.date}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontSize: 14 }}>{'⭐'.repeat(r.rating)}</div>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--zr-gray)', marginTop: 12, lineHeight: 1.6 }}>{r.text}</p>
                  </div>
                ))}
                {productReviews.length === 0 && <p style={{ color: 'var(--zr-gray)' }}>Još uvek nema recenzija za ovaj proizvod.</p>}
              </div>
            </div>
          )}

          {tab === 'dostava' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              <DostavaCard icon="🚚" t="Standardna" d="2–4 radna dana · 350 RSD" />
              <DostavaCard icon="⚡" t="Ekspres" d="24h · 600 RSD · Samo Beograd, NS" />
              <DostavaCard icon="↩️" t="Povraćaj" d="14 dana, bez objašnjenja" />
            </div>
          )}
        </div>

        {/* Related */}
        <div style={{ paddingBottom: 80 }}>
          <SectionHeader eyebrow="Iz iste kategorije" title="Možda ti se svidi i" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {related.map(p => <ProductCardW key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </Page>
  );
}

function BadgeRow({ icon, t, d }) {
  return (
    <div style={{ background: 'var(--zr-cream)', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{t}</div>
        <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{d}</div>
      </div>
    </div>
  );
}

function DetailRow({ l, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--zr-border-soft)', fontSize: 14 }}>
      <span style={{ color: 'var(--zr-gray)' }}>{l}</span>
      <span style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{v}</span>
    </div>
  );
}

function DostavaCard({ icon, t, d }) {
  return (
    <div style={{ background: 'var(--zr-cream)', borderRadius: 16, padding: 24 }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <h4 style={{ fontSize: 18, marginTop: 12 }}>{t}</h4>
      <p style={{ fontSize: 14, color: 'var(--zr-gray)', marginTop: 6 }}>{d}</p>
    </div>
  );
}

// ─── SHOP PAGE (with VIDEO INTRO section — multiple videos) ───
function ShopPage() {
  const { parts } = useRoute();
  const id = parts[1];
  const { shops, products, follows, toggleFollow, sellerVideos } = useWStore();
  const shop = shops.find(s => s.id === id);
  const [tab, setTab] = useState('proizvodi');
  const [videoIdx, setVideoIdx] = useState(0);

  if (!shop) return <Page><div className="zw-container" style={{ padding: 80 }}><h2>Radnja nije pronađena</h2></div></Page>;

  const shopProducts = products.filter(p => p.shopId === shop.id);
  const isFollowing = follows.has(shop.id);

  // For demo, all shops have videos; we use seller's video set for s1 and synthesize for others
  const videos = shop.id === 's1' ? sellerVideos : [
    { id: 'v1', title: `Dobrodošli u ${shop.name}`, duration: '1:42', date: shop.joined, cover: `${shop.name} — uvod`, color: shop.color, views: shop.followers + 80, isMain: true },
    { id: 'v2', title: 'Kako radim', duration: '3:15', date: shop.joined, cover: `${shop.name} — proces`, color: 'v3', views: 420 },
  ].slice(0, shop.videos || 1);

  return (
    <Page>
      {/* Hero cover */}
      <section style={{ position: 'relative', height: 360 }}>
        <div className={`zw-img ${shop.color}`} style={{ position: 'absolute', inset: 0, fontSize: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.3))' }} />
      </section>

      <div className="zw-container" style={{ position: 'relative', marginTop: -100 }}>
        {/* Shop header card */}
        <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: 'var(--zr-shadow)', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 32, alignItems: 'center' }}>
          <div className={`zw-img ${shop.color}`} style={{ width: 120, height: 120, borderRadius: 20, fontSize: 0, border: '4px solid white', boxShadow: 'var(--zr-shadow-sm)' }} />
          <div>
            <div className="zw-eyebrow">{shop.city} · od {shop.joined}</div>
            <h1 style={{ fontSize: 42, marginTop: 8, lineHeight: 1.05 }}>{shop.name}</h1>
            <div style={{ fontSize: 15, color: 'var(--zr-gray)', marginTop: 8 }}>{shop.bio}</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 16, fontSize: 13, color: 'var(--zr-gray)' }}>
              <span><strong style={{ color: 'var(--zr-pink-dark)' }}>⭐ {shop.rating}</strong> ({shop.reviews} recenzija)</span>
              <span><strong style={{ color: 'var(--zr-pink-dark)' }}>{shop.followers}</strong> prati</span>
              <span><strong style={{ color: 'var(--zr-pink-dark)' }}>{shopProducts.length}</strong> proizvoda</span>
              <span><strong style={{ color: 'var(--zr-pink-dark)' }}>{videos.length}</strong> videa</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => toggleFollow(shop.id)} className={`zw-btn ${isFollowing ? 'zw-btn-ghost' : 'zw-btn-primary'}`}>
              {isFollowing ? '✓ Pratiš' : '+ Prati radnju'}
            </button>
            <button onClick={() => navigate('/chat?shop=' + shop.id)} className="zw-btn zw-btn-soft">
              <Icon name="chat" size={14} /> Poruka
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--zr-border-soft)', marginTop: 40 }}>
          {[['proizvodi', `Proizvodi (${shopProducts.length})`], ['video', `Video predstavljanja (${videos.length})`], ['o-radnji', 'O radnji'], ['recenzije', `Recenzije (${shop.reviews})`]].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', padding: '16px 0', fontSize: 14, fontWeight: 700, color: tab === t ? 'var(--zr-pink-dark)' : 'var(--zr-gray)', cursor: 'pointer', borderBottom: tab === t ? '2px solid var(--zr-pink)' : '2px solid transparent', marginBottom: -1, fontFamily: 'inherit' }}>{l}</button>
          ))}
        </div>

        <div style={{ padding: '40px 0 80px' }}>
          {tab === 'proizvodi' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {shopProducts.map(p => <ProductCardW key={p.id} product={p} />)}
            </div>
          )}

          {tab === 'video' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                {/* Featured video player */}
                <div>
                  <div className={`zw-img ${videos[videoIdx].color}`} style={{ aspectRatio: '16/9', borderRadius: 22, fontSize: 0, position: 'relative', cursor: 'pointer' }}>
                    <span style={{ fontSize: 11 }}>{videos[videoIdx].cover}</span>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 84, height: 84, borderRadius: 999, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ width: 0, height: 0, borderLeft: '22px solid var(--zr-pink-dark)', borderTop: '14px solid transparent', borderBottom: '14px solid transparent', marginLeft: 6 }} />
                      </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: 16, right: 16, padding: '5px 10px', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'var(--zr-font-mono)' }}>{videos[videoIdx].duration}</div>
                  </div>
                  <h2 style={{ fontSize: 28, marginTop: 20 }}>{videos[videoIdx].title}</h2>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13, color: 'var(--zr-gray)' }}>
                    <span>{videos[videoIdx].views} pregleda</span>
                    <span>·</span>
                    <span>{videos[videoIdx].date}</span>
                  </div>
                </div>
                {/* Playlist */}
                <div>
                  <div className="zw-eyebrow" style={{ marginBottom: 16 }}>Sva videa · {videos.length}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {videos.map((v, i) => (
                      <div key={v.id} onClick={() => setVideoIdx(i)} style={{ display: 'flex', gap: 12, padding: 10, borderRadius: 12, cursor: 'pointer', background: i === videoIdx ? 'var(--zr-pink-light)' : 'transparent', border: '1.5px solid', borderColor: i === videoIdx ? 'var(--zr-pink)' : 'transparent' }}>
                        <div className={`zw-img ${v.color}`} style={{ width: 100, height: 70, borderRadius: 8, fontSize: 0, flexShrink: 0, position: 'relative' }}>
                          <div style={{ position: 'absolute', bottom: 4, right: 4, padding: '1px 5px', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: 3, fontSize: 9, fontFamily: 'var(--zr-font-mono)' }}>{v.duration}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zr-pink-dark)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--zr-gray)', marginTop: 4 }}>{v.views} pregleda · {v.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 18, padding: 14, background: 'var(--zr-cream)', borderRadius: 12, fontSize: 12, color: 'var(--zr-gray)' }}>
                    🌸 <strong style={{ color: 'var(--zr-pink-dark)' }}>{shop.name}</strong> može da postavi koliko god videa želi — bez ograničenja, bez dodatnih troškova.
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'o-radnji' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64 }}>
              <div>
                <h2 style={{ fontSize: 28, marginBottom: 16 }}>O <span className="zw-script" style={{ fontSize: 36, color: 'var(--zr-pink)' }}>{shop.owner}</span></h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--zr-gray)' }}>
                  {shop.bio} Radim u {shop.city}u, gde sam i odrasla. Svaki predmet je rezultat sati pažnje — biraj ga znaj da iza njega stoji ime, a ne fabrika.
                </p>
              </div>
              <div className="zw-card" style={{ padding: 24 }}>
                <h4 style={{ fontSize: 16, marginBottom: 16 }}>Brzi info</h4>
                <DetailRow l="Vlasnica" v={shop.owner} />
                <DetailRow l="Lokacija" v={shop.city} />
                <DetailRow l="Pridružila se" v={shop.joined} />
                <DetailRow l="Kategorija" v={shop.category} />
              </div>
            </div>
          )}

          {tab === 'recenzije' && (
            <div style={{ color: 'var(--zr-gray)' }}>Recenzije se prikazuju ovde — ukupno {shop.reviews}.</div>
          )}
        </div>
      </div>
    </Page>
  );
}

Object.assign(window, { ProductPage, ShopPage, BadgeRow, DetailRow, DostavaCard });
