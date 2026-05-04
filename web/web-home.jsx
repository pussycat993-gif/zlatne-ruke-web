/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, ProductCardW, SectionHeader, Crumbs */
const { useState, useMemo, useEffect } = React;

// ─── HOMEPAGE ───
function Homepage() {
  const { products, shops, categories, stories } = useWStore();
  return (
    <Page>
      {/* Editorial Hero */}
      <section style={{ background: 'linear-gradient(180deg, #FDF6F0 0%, #F8EBDD 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="zw-container" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 64, padding: '80px 32px 100px', alignItems: 'center' }}>
          <div>
            <div className="zw-eyebrow" style={{ marginBottom: 18 }}>
              🌸 Priča #12 · Maj 2026
            </div>
            <h1 style={{ fontSize: 80, lineHeight: 0.95, letterSpacing: '-0.025em', textWrap: 'balance' }}>
              Šal koji Mila plete<br/>
              <span className="zw-script" style={{ fontSize: 96, fontWeight: 600, color: 'var(--zr-pink)' }}>počinje pre zore.</span>
            </h1>
            <p style={{ marginTop: 28, fontSize: 18, lineHeight: 1.55, maxWidth: 480, color: 'var(--zr-gray)' }}>
              U ateljeu u Novom Sadu, Mila Petrović plete od 5 ujutru, dok grad još spava. Iza svakog komada — sat, tri, ponekad tri dana rada. Iza svakog komada — žena.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
              <button className="zw-btn zw-btn-primary zw-btn-lg" onClick={() => navigate('/katalog')}>Istraži rukotvorine</button>
              <button className="zw-btn zw-btn-ghost zw-btn-lg" onClick={() => navigate('/magazin/st1')}>Pročitaj priču</button>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--zr-border-soft)' }}>
              <Stat n="200+" l="majstorica" />
              <Stat n="38" l="gradova" />
              <Stat n="6.4k" l="zadovoljnih kupaca" />
            </div>
          </div>

          {/* Editorial image with overlay caption */}
          <div style={{ position: 'relative' }}>
            <div className="zw-img v2" style={{ height: 620, borderRadius: 28, boxShadow: 'var(--zr-shadow-lg)', fontSize: 0 }}>
              <span style={{ fontSize: 11 }}>foto · mila u ateljeu, 6:14 ujutru</span>
            </div>
            <div style={{ position: 'absolute', top: -16, right: -24, width: 120, height: 120, borderRadius: 999, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: 'var(--zr-shadow)', transform: 'rotate(8deg)' }}>
              <span className="zw-script" style={{ fontSize: 28, color: 'var(--zr-pink-dark)', lineHeight: 1 }}>ručno</span>
              <span className="zw-script" style={{ fontSize: 28, color: 'var(--zr-pink)', lineHeight: 1 }}>rađeno</span>
            </div>
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 18, padding: '18px 22px', boxShadow: 'var(--zr-shadow-sm)' }}>
              <div className="zw-eyebrow" style={{ fontSize: 10 }}>U fokusu — radnja</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
                <div className="zw-img v3" style={{ width: 44, height: 44, borderRadius: 12, fontSize: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 15 }}>Mila & Konac</div>
                  <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>Novi Sad · ⭐ 4.9 · 187 recenzija</div>
                </div>
                <button className="zw-btn zw-btn-soft zw-btn-sm" onClick={() => navigate('/radnja/s1')}>Poseti</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories ribbon */}
      <section style={{ padding: '64px 0', background: 'white', borderTop: '1px solid var(--zr-border-soft)', borderBottom: '1px solid var(--zr-border-soft)' }}>
        <div className="zw-container">
          <SectionHeader eyebrow="Šta tražiš" title="Pretraži po vrsti" sub="Šest kategorija, na stotine majstorica." right={<a onClick={() => navigate('/katalog')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--zr-pink)', cursor: 'pointer' }}>Sve kategorije →</a>} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {categories.map((c, i) => (
              <a key={c.id} onClick={() => navigate('/katalog?cat=' + c.id)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 22, borderRadius: 18, background: 'var(--zr-cream)', border: '1.5px solid transparent', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--zr-pink)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 64, height: 64, borderRadius: 999, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 12, boxShadow: 'var(--zr-shadow-sm)' }}>{c.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)', marginTop: 4 }}>{c.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="zw-section">
        <div className="zw-container">
          <SectionHeader eyebrow="Novo & istaknuto" title="Predmeti koji nas dirnu" sub="Birano ručno, svake nedelje. Nema plaćenog promovisanja." right={<a onClick={() => navigate('/katalog')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--zr-pink)', cursor: 'pointer' }}>Pogledaj sve →</a>} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {products.slice(0, 8).map(p => <ProductCardW key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Story / manifesto strip */}
      <section style={{ background: 'var(--zr-pink-tint)', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="zw-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
          <div className="zw-img v3" style={{ height: 480, borderRadius: 24, fontSize: 0 }}>
            <span>foto · ana, kuća kandila</span>
          </div>
          <div>
            <div className="zw-eyebrow" style={{ marginBottom: 16 }}>Naš manifest</div>
            <h2 style={{ fontSize: 56, lineHeight: 1.05, textWrap: 'balance' }}>
              Svaki predmet ima<br/>
              <span className="zw-script" style={{ fontSize: 70, color: 'var(--zr-pink)' }}>ime, mesto i priču.</span>
            </h2>
            <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.65, color: 'var(--zr-gray)', maxWidth: 540 }}>
              Ne pravimo ih mi, prave ih one — Mila iz Novog Sada, Ana iz Beograda, Jelena iz Niša. Sofija, Tijana, Vesna. Mi samo otvaramo vrata između njihovih ruku i tvog doma.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 36 }}>
              <ManifestPoint icon="🌸" t="0% provizije za prodavce" d="Prvih godinu dana." />
              <ManifestPoint icon="💕" t="Direktan kontakt" d="Pričaš sa majstoricom, ne sa botom." />
              <ManifestPoint icon="✨" t="Na srpskom, za Srbiju" d="Lokalna dostava, lokalna podrška." />
              <ManifestPoint icon="🌿" t="Bez fast fashion-a" d="Mali serije, prava kvaliteta." />
            </div>
          </div>
        </div>
      </section>

      {/* Stories editorial strip */}
      <section className="zw-section">
        <div className="zw-container">
          <SectionHeader eyebrow="Magazin" title="Priče iza ruku" sub="Posete radionicama, intervjui, recepti. Sve što ne stane na karticu proizvoda." right={<a onClick={() => navigate('/magazin')} style={{ fontSize: 14, fontWeight: 600, color: 'var(--zr-pink)', cursor: 'pointer' }}>Sve priče →</a>} />
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 24 }}>
            <StoryCard story={stories[0]} large />
            <StoryCard story={stories[1]} />
            <StoryCard story={stories[2]} />
          </div>
        </div>
      </section>

      {/* Become seller CTA */}
      <section style={{ background: 'var(--zr-pink-dark)', color: 'white', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: 999, background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -120, width: 400, height: 400, borderRadius: 999, background: 'rgba(255,255,255,0.04)' }} />
        <div className="zw-container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'var(--zr-font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>Postani prodavac</div>
            <h2 style={{ fontSize: 56, lineHeight: 1.05, color: 'white', textWrap: 'balance' }}>
              Ti praviš.<br/>
              <span className="zw-script" style={{ fontSize: 76, color: '#F4D5DC' }}>Mi se brinemo za ostalo.</span>
            </h2>
            <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,0.8)', maxWidth: 520 }}>
              Otvori radnju za 5 minuta. Bez provizije prve godine. Snimaj video predstavljanja, povezuj se sa kupcima, prodaj direktno — bez posrednika.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
              <button className="zw-btn zw-btn-lg" style={{ background: 'white', color: 'var(--zr-pink-dark)' }} onClick={() => navigate('/postani-prodavac')}>Otvori radnju ✨</button>
              <button className="zw-btn zw-btn-ghost zw-btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }} onClick={() => navigate('/magazin')}>Saznaj više</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SellerStat n="0%" l="provizije prve godine" />
            <SellerStat n="∞" l="video predstavljanja" />
            <SellerStat n="48h" l="prosečan odgovor podrške" />
          </div>
        </div>
      </section>
    </Page>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--zr-pink-dark)', lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 12, color: 'var(--zr-gray)', marginTop: 6, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.08em' }}>{l}</div>
    </div>
  );
}

function ManifestPoint({ icon, t, d }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 999, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{t}</div>
        <div style={{ fontSize: 12, color: 'var(--zr-gray)', marginTop: 2 }}>{d}</div>
      </div>
    </div>
  );
}

function SellerStat({ n, l }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '24px 28px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontSize: 48, fontWeight: 700, color: 'white', lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>{l}</div>
    </div>
  );
}

function StoryCard({ story, large }) {
  return (
    <article onClick={() => navigate('/magazin/' + story.id)} style={{ cursor: 'pointer' }}>
      <div className={`zw-img ${story.color}`} style={{ height: large ? 360 : 220, borderRadius: 18 }}>
        <span>{story.cover}</span>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="zw-eyebrow">Priča · {story.readTime}</div>
        <h3 style={{ fontSize: large ? 26 : 18, marginTop: 8, lineHeight: 1.25, textWrap: 'balance' }}>{story.title}</h3>
        {large && <p style={{ marginTop: 10, fontSize: 14, color: 'var(--zr-gray)', lineHeight: 1.6 }}>{story.excerpt}</p>}
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--zr-gray-soft)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em' }}>{story.date}</div>
      </div>
    </article>
  );
}

Object.assign(window, { Homepage, Stat, ManifestPoint, SellerStat, StoryCard });
