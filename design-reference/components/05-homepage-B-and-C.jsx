/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, ProductCardW, SectionHeader, Crumbs */
const { useState, useMemo, useEffect } = React;

// ─── HOMEPAGE B — Marketplace grid focus (no editorial hero) ───
function HomepageB() {
  const { products, shops, categories, stories } = useWStore();
  const [tab, setTab] = useState('sve');
  const filtered = tab === 'sve' ? products : products.filter(p => p.category === tab);

  return (
    <Page>
      {/* Compact hero — search + key stats */}
      <section style={{ background: 'var(--zr-cream)', padding: '48px 0 32px', borderBottom: '1px solid var(--zr-border-soft)' }}>
        <div className="zw-container" style={{ textAlign: 'center' }}>
          <div className="zw-eyebrow" style={{ marginBottom: 14 }}>🌸 Marketplace rukotvorina</div>
          <h1 style={{ fontSize: 56, lineHeight: 1, textWrap: 'balance', maxWidth: 900, margin: '0 auto' }}>
            Pronađi <span className="zw-script" style={{ fontSize: 70, color: 'var(--zr-pink)' }}>jedinstvene</span> predmete od 200+ majstorica.
          </h1>
          <div style={{ position: 'relative', maxWidth: 620, margin: '32px auto 0' }}>
            <input placeholder="Šta tražiš? Šal, sveće, sapuni…" style={{ width: '100%', padding: '18px 24px 18px 54px', borderRadius: 999, border: '1.5px solid var(--zr-border)', background: 'var(--zr-surface)', fontSize: 15, fontFamily: 'inherit', color: 'var(--zr-pink-dark)', outline: 'none', boxShadow: 'var(--zr-shadow-sm)' }} />
            <span style={{ position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', color: 'var(--zr-gray-soft)' }}><Icon name="search" size={20} /></span>
            <button className="zw-btn zw-btn-primary" style={{ position: 'absolute', right: 6, top: 6, padding: '12px 22px' }} onClick={() => navigate('/katalog')}>Pretraži</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {['Šal od merino vune','Sojine sveće','Lavanda sapun','Srebrne minđuše','Domaći med'].map(t => (
              <span key={t} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 999, background: 'var(--zr-surface)', color: 'var(--zr-gray)', border: '1px solid var(--zr-border-soft)', cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Category tabs + grid */}
      <section style={{ padding: '48px 0' }}>
        <div className="zw-container">
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
            <button className={`zw-chip ${tab === 'sve' ? 'active' : ''}`} onClick={() => setTab('sve')}>Sve · {products.length}</button>
            {categories.map(c => (
              <button key={c.id} className={`zw-chip ${tab === c.id ? 'active' : ''}`} onClick={() => setTab(c.id)}>{c.emoji} {c.name}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {filtered.slice(0, 12).map(p => <ProductCardW key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="zw-btn zw-btn-ghost zw-btn-lg" onClick={() => navigate('/katalog')}>Vidi sve proizvode →</button>
          </div>
        </div>
      </section>

      {/* Featured shops row */}
      <section style={{ padding: '48px 0', background: 'var(--zr-surface)', borderTop: '1px solid var(--zr-border-soft)' }}>
        <div className="zw-container">
          <SectionHeader eyebrow="Naše majstorice" title="U fokusu ove nedelje" right={<a onClick={() => navigate('/radnje')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--zr-pink)', cursor: 'pointer' }}>Sve radnje →</a>} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {shops.map(s => (
              <a key={s.id} onClick={() => navigate('/radnja/' + s.id)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div className={`zw-img ${s.color}`} style={{ aspectRatio: '1', borderRadius: 18, fontSize: 0 }} />
                <div style={{ marginTop: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)', marginTop: 2 }}>{s.city} · ⭐ {s.rating}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Become seller compact */}
      <section style={{ padding: '64px 0', background: 'var(--zr-pink-tint)' }}>
        <div className="zw-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <h3 style={{ fontSize: 32 }}>Ti praviš? <span className="zw-script" style={{ fontSize: 42, color: 'var(--zr-pink)' }}>Dođi kod nas.</span></h3>
            <p style={{ fontSize: 15, color: 'var(--zr-gray)', marginTop: 8 }}>0% provizije prve godine. Bez ugovora. Otvori radnju za 5 minuta.</p>
          </div>
          <button className="zw-btn zw-btn-dark zw-btn-lg" onClick={() => navigate('/postani-prodavac')}>Otvori radnju ✨</button>
        </div>
      </section>
    </Page>
  );
}

// ─── HOMEPAGE C — Magazin/Editorial first ───
function HomepageC() {
  const { products, stories, shops } = useWStore();
  return (
    <Page>
      <section style={{ background: 'var(--zr-cream)', padding: '48px 0 32px' }}>
        <div className="zw-container" style={{ textAlign: 'center', maxWidth: 880, margin: '0 auto' }}>
          <div className="zw-eyebrow" style={{ marginBottom: 16 }}>Maj 2026 · Broj 12</div>
          <h1 style={{ fontSize: 86, lineHeight: 0.95, textWrap: 'balance', letterSpacing: '-0.025em' }}>
            Žene koje<br/>
            <span className="zw-script" style={{ fontSize: 110, color: 'var(--zr-pink)', fontWeight: 600 }}>stvaraju Srbiju.</span>
          </h1>
          <p style={{ marginTop: 24, fontSize: 17, color: 'var(--zr-gray)', lineHeight: 1.6, maxWidth: 620, margin: '24px auto 0' }}>
            Marketplace, magazin i kuća zajedno. Čitaj priče, upoznaj majstorice, kupuj direktno.
          </p>
        </div>
      </section>

      {/* Big editorial cover */}
      <section style={{ padding: '32px 0 64px' }}>
        <div className="zw-container">
          <article onClick={() => navigate('/magazin/st1')} style={{ cursor: 'pointer', position: 'relative', borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--zr-shadow-lg)' }}>
            <div className="zw-img v2" style={{ height: 540, fontSize: 0 }}>
              <span style={{ fontSize: 11 }}>foto · mila u atelje, 6:14 ujutru</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 48, background: 'linear-gradient(180deg, transparent, rgba(160,68,90,0.85))', color: 'white' }}>
              <div style={{ fontFamily: 'var(--zr-font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85 }}>Glavna priča · 4 min čitanja</div>
              <h2 style={{ fontSize: 56, color: 'white', marginTop: 14, maxWidth: 720, textWrap: 'balance' }}>Kako su Milini prvi šalovi <span className="zw-script" style={{ fontSize: 72 }}>stigli do Beča.</span></h2>
            </div>
          </article>
        </div>
      </section>

      {/* Three stories */}
      <section style={{ padding: '32px 0 64px' }}>
        <div className="zw-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {stories.slice(1, 4).map(s => (
              <article key={s.id} onClick={() => navigate('/magazin/' + s.id)} style={{ cursor: 'pointer' }}>
                <div className={`zw-img ${s.color}`} style={{ height: 280, borderRadius: 18 }}><span>{s.cover}</span></div>
                <div className="zw-eyebrow" style={{ marginTop: 16 }}>Priča · {s.readTime}</div>
                <h3 style={{ fontSize: 22, marginTop: 8, lineHeight: 1.25 }}>{s.title}</h3>
                <p style={{ marginTop: 10, fontSize: 14, color: 'var(--zr-gray)' }}>{s.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Shop the story */}
      <section style={{ padding: '64px 0', background: 'var(--zr-pink-tint)' }}>
        <div className="zw-container">
          <SectionHeader eyebrow="Kupi iz priče" title="Predmeti iz Mila & Konac" sub="Sve što nosi ovonedeljna priča." right={<a onClick={() => navigate('/radnja/s1')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--zr-pink)', cursor: 'pointer' }}>Cela radnja →</a>} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {products.filter(p => p.shopId === 's1').concat(products.slice(0, 4)).slice(0, 4).map(p => <ProductCardW key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="zw-section">
        <div className="zw-container">
          <SectionHeader eyebrow="Birano za tebe" title="Novo ove nedelje" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {products.slice(4, 12).map(p => <ProductCardW key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </Page>
  );
}

Object.assign(window, { HomepageB, HomepageC });
