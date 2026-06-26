/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, SectionHeader, Crumbs */
const { useState } = React;

// ─── ADMIN PANEL ───
function AdminPanel() {
  const { parts } = useRoute();
  const sub = parts[1] || 'pregled';
  const tabs = [
    ['pregled', 'Pregled', 'home'],
    ['radnje', 'Radnje', 'package'],
    ['proizvodi', 'Proizvodi', 'cart'],
    ['kupci', 'Kupci', 'follow'],
    ['recenzije', 'Recenzije & moderacija', 'star'],
    ['placanja', 'Plaćanja', 'wallet'],
  ];

  return (
    <Page footer={false}>
      <div style={{ background: 'var(--zr-hero-bg)', color: 'white', padding: '14px 0', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--zr-font-mono)' }}>
        <div className="zw-container-wide">⚙ Admin panel · Zlatne Ruke</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 200px)' }}>
        <aside style={{ background: '#1f1318', color: 'rgba(255,255,255,0.85)', padding: '32px 14px' }}>
          {tabs.map(([k, l, ic]) => {
            const active = sub === k || (k === 'pregled' && !parts[1]);
            return (
              <button key={k} onClick={() => navigate('/admin/' + (k === 'pregled' ? '' : k))}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, background: active ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: active ? 'white' : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 500, textAlign: 'left', width: '100%', marginBottom: 4 }}>
                <Icon name={ic} size={15} stroke="currentColor" /> {l}
              </button>
            );
          })}
        </aside>
        <main style={{ padding: '32px 40px', background: 'var(--zr-cream)' }}>
          {(sub === 'pregled' || !parts[1]) && <AdminOverview />}
          {sub === 'radnje' && <AdminShops />}
          {sub === 'proizvodi' && <AdminProducts />}
          {sub === 'kupci' && <AdminBuyers />}
          {sub === 'recenzije' && <AdminReviews />}
          {sub === 'placanja' && <AdminPayments />}
        </main>
      </div>
    </Page>
  );
}

function AdminOverview() {
  return (
    <div>
      <div className="zw-eyebrow">Admin · maj 2026</div>
      <h1 style={{ fontSize: 32, marginTop: 6, marginBottom: 24 }}>Platforma — pregled</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { l: 'Aktivnih radnji', v: '247', d: '+12 ovaj mesec' },
          { l: 'Proizvoda', v: '3.812', d: '+184' },
          { l: 'Porudžbine (maj)', v: '1.094', d: '+22%' },
          { l: 'GMV (maj)', v: '4.2M RSD', d: '+34%' },
        ].map(k => (
          <div key={k.l} className="zw-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 11, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{k.l}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--zr-pink-dark)', marginTop: 6 }}>{k.v}</div>
            <div style={{ fontSize: 11, color: '#67c693', marginTop: 4, fontWeight: 600 }}>{k.d}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="zw-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Čeka odobrenje</h3>
          {[
            { n: 'Svilena traka', s: 'Marina Tekstil', d: 'pre 2h' },
            { n: 'Kožna torba', s: 'Koža & Konac', d: 'pre 5h' },
            { n: 'Mirisne sapune', s: 'Bosiljkov Vrt', d: 'pre 1d' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? '1px solid var(--zr-border-soft)' : 'none' }}>
              <div className="zw-img v3" style={{ width: 40, height: 40, borderRadius: 8, fontSize: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{r.n}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{r.s} · {r.d}</div>
              </div>
              <button className="zw-btn zw-btn-soft zw-btn-sm">Pregled</button>
            </div>
          ))}
        </div>

        <div className="zw-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Top 5 radnji (maj)</h3>
          {[
            { n: 'Zrno Srebra', c: 'Niš', t: '247.800 RSD' },
            { n: 'Mila & Konac', c: 'Novi Sad', t: '188.400 RSD' },
            { n: 'Kuća Kandila', c: 'Beograd', t: '142.200 RSD' },
            { n: 'Glina i Ja', c: 'Kragujevac', t: '98.600 RSD' },
            { n: 'Bosiljkov Vrt', c: 'Subotica', t: '87.300 RSD' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? '1px solid var(--zr-border-soft)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--zr-pink-light)', color: 'var(--zr-pink-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{s.c}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zr-pink)' }}>{s.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminShops() {
  const { shops } = useWStore();
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 18 }}>Radnje</h1>
      <div className="zw-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--zr-cream)' }}>
            <tr>{['Radnja', 'Vlasnica', 'Grad', 'Proizvodi', 'Ocena', 'Status', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--zr-gray)', fontWeight: 600 }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {shops.map(s => (
              <tr key={s.id} style={{ borderTop: '1px solid var(--zr-border-soft)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{s.name}</td>
                <td style={{ padding: '12px 16px' }}>{s.owner}</td>
                <td style={{ padding: '12px 16px' }}>{s.city}</td>
                <td style={{ padding: '12px 16px' }}>{Math.floor(Math.random() * 30 + 5)}</td>
                <td style={{ padding: '12px 16px' }}>⭐ {s.rating}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: '#67c69322', color: '#67c693' }}>Aktivna</span></td>
                <td style={{ padding: '12px 16px' }}><button className="zw-btn zw-btn-ghost zw-btn-sm">Detalji</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminProducts() {
  const { products } = useWStore();
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 18 }}>Proizvodi</h1>
      <p style={{ color: 'var(--zr-gray)', marginBottom: 18 }}>Ukupno {products.length} aktivnih proizvoda. Klikni na proizvod za moderaciju ili izvoz CSV.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {products.slice(0, 12).map(p => (
          <div key={p.id} className="zw-card" style={{ padding: 12 }}>
            <div className={`zw-img ${p.color}`} style={{ height: 100, borderRadius: 8, fontSize: 0 }} />
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, color: 'var(--zr-pink-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
            <div style={{ fontSize: 11, color: 'var(--zr-gray)', marginTop: 2 }}>{wFmtPrice(p.price)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBuyers() {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 18 }}>Kupci</h1>
      <div className="zw-card" style={{ padding: 24 }}>
        <p style={{ color: 'var(--zr-gray)' }}>14.230 registrovanih kupaca · 3.420 aktivnih u poslednjih 30 dana</p>
      </div>
    </div>
  );
}

function AdminReviews() {
  const { reviews } = useWStore();
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 18 }}>Recenzije & moderacija</h1>
      <div className="zw-card" style={{ padding: 0 }}>
        {reviews.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', gap: 14, padding: 18, borderTop: i ? '1px solid var(--zr-border-soft)' : 'none' }}>
            <div className="zw-avatar">{r.author[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{r.author}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{r.date}</div>
              </div>
              <div style={{ color: 'var(--zr-pink)', marginTop: 2 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <p style={{ fontSize: 14, marginTop: 6, color: 'var(--zr-gray)' }}>{r.text}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="zw-btn zw-btn-soft zw-btn-sm">Odobri</button>
              <button className="zw-btn zw-btn-ghost zw-btn-sm">Sakrij</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPayments() {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 18 }}>Isplate radnjama</h1>
      <div className="zw-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--zr-cream)' }}>
            <tr>{['Radnja', 'Period', 'GMV', 'Provizija', 'Za isplatu', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--zr-gray)', fontWeight: 600 }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              { n: 'Mila & Konac', g: '188.400', p: '15.072', i: '173.328', s: 'Isplaćeno' },
              { n: 'Zrno Srebra', g: '247.800', p: '19.824', i: '227.976', s: 'Isplaćeno' },
              { n: 'Kuća Kandila', g: '142.200', p: '11.376', i: '130.824', s: 'Čeka' },
              { n: 'Bosiljkov Vrt', g: '87.300', p: '6.984', i: '80.316', s: 'Čeka' },
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--zr-border-soft)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{r.n}</td>
                <td style={{ padding: '12px 16px' }}>Apr 2026</td>
                <td style={{ padding: '12px 16px' }}>{r.g} RSD</td>
                <td style={{ padding: '12px 16px', color: 'var(--zr-gray)' }}>−{r.p}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>{r.i} RSD</td>
                <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: r.s === 'Isplaćeno' ? '#67c69322' : '#D4A54722', color: r.s === 'Isplaćeno' ? '#67c693' : '#D4A547' }}>{r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── BECOME SELLER LANDING ───
function BecomeSeller() {
  return (
    <Page>
      {/* Hero */}
      <section style={{ background: 'var(--zr-cream)', padding: '80px 0 100px', position: 'relative', overflow: 'hidden' }}>
        <div className="zw-container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="zw-eyebrow">Za majstorice & kreatorke</div>
            <h1 style={{ fontSize: 72, lineHeight: 1, marginTop: 14, textWrap: 'balance' }}>
              Tvoje ruke<br /><span className="zw-script" style={{ fontSize: 88, color: 'var(--zr-pink)' }}>zaslužuju</span><br />tržište.
            </h1>
            <p style={{ marginTop: 24, fontSize: 17, color: 'var(--zr-gray)', maxWidth: 460, lineHeight: 1.6 }}>
              Otvori radnju za 10 minuta. Prodaj na celu Srbiju. Mi se brinemo o sajtu, plaćanjima, dostavi i marketingu — ti pleti, mesi, kuj. Bez provizije, bez mesečne pretplate.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button className="zw-btn zw-btn-primary zw-btn-lg" onClick={() => navigate('/register?as=seller')}>Otvori radnju →</button>
              <button className="zw-btn zw-btn-ghost zw-btn-lg" onClick={() => navigate('/magazin')}>Pročitaj priče naših prodavačica</button>
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 32 }}>
              <div><div style={{ fontSize: 28, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>247</div><div style={{ fontSize: 12, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>aktivnih radnji</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>4.2M</div><div style={{ fontSize: 12, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>RSD prodato (maj)</div></div>
              <div><div style={{ fontSize: 28, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>0 RSD</div><div style={{ fontSize: 12, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>provizija po prodaji</div></div>
            </div>
          </div>
          <div style={{ position: 'relative', height: 540 }}>
            <div className="zw-img v3" style={{ position: 'absolute', top: 0, left: 0, width: 280, height: 360, borderRadius: 22, transform: 'rotate(-3deg)' }}><span>radionica · pletenje</span></div>
            <div className="zw-img v4" style={{ position: 'absolute', top: 60, right: 20, width: 240, height: 320, borderRadius: 22, transform: 'rotate(4deg)' }}><span>radionica · srebro</span></div>
            <div className="zw-img v2" style={{ position: 'absolute', bottom: 0, left: 60, width: 220, height: 240, borderRadius: 22, transform: 'rotate(-1deg)' }}><span>tvoji proizvodi</span></div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="zw-section">
        <div className="zw-container">
          <SectionHeader eyebrow="Kako počinje" title="Tri koraka do prve prodaje" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { n: '01', t: 'Otvori radnju', d: 'Naziv, lokacija, kratak opis. Bez papirologije, bez startnih troškova. Imamo gotove šablone za sve.', ic: 'package' },
              { n: '02', t: 'Dodaj proizvode', d: 'Slike, opis, cena, dostava. Naši šabloni pomažu da napišeš lepe opise. Snimi i kratak video — radnje sa video sadržajem prodaju 2.4× više.', ic: 'video' },
              { n: '03', t: 'Mi šaljemo kupce', d: 'Tvoja radnja se odmah pojavljuje u katalogu i pretragama. Plaćamo Google, Instagram, TikTok da bi tvoji proizvodi stigli do prave publike.', ic: 'star' },
            ].map(s => (
              <div key={s.n} className="zw-card" style={{ padding: 32 }}>
                <div className="zw-eyebrow">{s.n}</div>
                <div style={{ marginTop: 14, color: 'var(--zr-pink)' }}><Icon name={s.ic} size={28} /></div>
                <h3 style={{ fontSize: 20, marginTop: 18 }}>{s.t}</h3>
                <p style={{ color: 'var(--zr-gray)', marginTop: 10, fontSize: 14, lineHeight: 1.6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="zw-section-tight" style={{ background: 'var(--zr-surface)' }}>
        <div className="zw-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="zw-eyebrow">Cena</div>
            <h2 style={{ fontSize: 48, marginTop: 14, lineHeight: 1.1 }}>Trenutno <span className="zw-script" style={{ fontSize: 60, color: 'var(--zr-pink)' }}>besplatno.</span></h2>
            <p style={{ color: 'var(--zr-gray)', marginTop: 18, fontSize: 16, lineHeight: 1.7 }}>Dok gradimo zajednicu, ne naplaćujemo proviziju — ni startne troškove, ni mesečnu pretplatu. Kad uvedemo cenovnik, javljamo se mesec dana unapred i prvih 100 prodavaca dobija doživotni popust.</p>
            <ul style={{ marginTop: 24, padding: 0, listStyle: 'none' }}>
              {['Bez provizije — zarađuješ 100% od svake prodaje', 'Bez startnih troškova', 'Bez mesečne pretplate', 'Plaćanje karticom & gotovinom uključeno', 'Tehnička podrška na srpskom', 'Marketing uključen (Google, Instagram)'].map(l => (
                <li key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 14 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--zr-pink-light)', color: 'var(--zr-pink-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={12} /></span>
                  {l}
                </li>
              ))}
            </ul>
          </div>

          <div className="zw-card" style={{ padding: 40, background: 'linear-gradient(135deg, var(--zr-pink-light), var(--zr-cream))' }}>
            <div className="zw-eyebrow">Primer prodaje</div>
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 15 }}><span>Cena proizvoda</span><span style={{ fontWeight: 700 }}>4.800 RSD</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 15, color: 'var(--zr-gray)' }}><span>Zlatne Ruke</span><span>−0 RSD</span></div>
              <div className="zw-divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontSize: 18, fontWeight: 700, color: 'var(--zr-pink-dark)' }}><span>Tvoj prihod</span><span>4.800 RSD</span></div>
            </div>
            <div style={{ marginTop: 18, padding: 14, background: 'var(--zr-surface)', borderRadius: 12, fontSize: 12, color: 'var(--zr-gray)' }}>💡 Mila & Konac: prosečno 12 šalova mesečno × 4.800 = <strong style={{ color: 'var(--zr-pink-dark)' }}>57.600 RSD/mesec</strong></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="zw-section">
        <div className="zw-container">
          <SectionHeader eyebrow="Glasovi prodavačica" title="Šta kažu majstorice koje već prodaju kod nas" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { n: 'Mila Petrović', s: 'Mila & Konac · Novi Sad', q: 'Pre Zlatnih Ruku sam pletila samo za bakine prijateljice. Sad mi šalovi stižu do Beča. I sve to dok mi deca spavaju.' },
              { n: 'Jelena Đorđević', s: 'Zrno Srebra · Niš', q: 'Najbolje je što ne moram da brinem o plaćanjima i dostavi. Samo kujem srebro i pišem kupcima kad pitaju o porudžbinama.' },
              { n: 'Sofija Marković', s: 'Bosiljkov Vrt · Subotica', q: 'Imala sam 4 prodaje mesečno preko Instagrama. Sa Zlatnim Rukama imam 30. Razlika je u tome što ovde ljudi tačno znaju šta traže.' },
            ].map((t, i) => (
              <div key={i} className="zw-card" style={{ padding: 28 }}>
                <div style={{ fontSize: 36, color: 'var(--zr-pink)', lineHeight: 0.5, marginBottom: 6 }}>"</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--zr-gray)', textWrap: 'pretty' }}>{t.q}</p>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="zw-avatar">{t.n[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{t.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.s}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--zr-hero-bg)', color: 'white', padding: '80px 0', textAlign: 'center' }}>
        <div className="zw-container">
          <h2 style={{ fontSize: 56, color: 'white', textWrap: 'balance' }}>Spremna da otvoriš<br /><span className="zw-script" style={{ fontSize: 72, color: '#FBE7EC' }}>svoju radnju?</span></h2>
          <button className="zw-btn zw-btn-lg" style={{ marginTop: 32, background: 'var(--zr-surface)', color: 'var(--zr-pink-dark)' }} onClick={() => navigate('/register?as=seller')}>Krenimo — besplatno je →</button>
        </div>
      </section>
    </Page>
  );
}

// ─── LOGIN / REGISTER ───
function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login';
  return (
    <Page footer={false}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 130px)' }}>
        {/* Left: form */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 80px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div className="zw-eyebrow">{isLogin ? 'Dobrodošla nazad' : 'Pridruži se'}</div>
            <h1 style={{ fontSize: 44, marginTop: 10, lineHeight: 1.1 }}>{isLogin ? <>Uđi u svoj <span className="zw-script" style={{ fontSize: 56, color: 'var(--zr-pink)' }}>kutak</span></> : <>Otvori <span className="zw-script" style={{ fontSize: 56, color: 'var(--zr-pink)' }}>nalog</span></>}</h1>
            <p style={{ color: 'var(--zr-gray)', marginTop: 12 }}>{isLogin ? 'Drago nam je što te vidimo opet.' : 'Brzo i besplatno. Bez kartica, bez papira.'}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
              {!isLogin && <Field label="Ime i prezime" defaultValue="Marija Kovačević" />}
              <Field label="Email" defaultValue="marija@gmail.com" />
              <Field label="Lozinka" type="password" defaultValue="••••••••" />
              {isLogin && <a style={{ fontSize: 12, color: 'var(--zr-pink)', textAlign: 'right', cursor: 'pointer' }}>Zaboravljena lozinka?</a>}

              <button className="zw-btn zw-btn-primary zw-btn-lg" style={{ marginTop: 8 }} onClick={() => { useWStore().showToast(isLogin ? 'Dobrodošla 💕' : 'Nalog otvoren 🌸'); navigate('/'); }}>{isLogin ? 'Uđi' : 'Otvori nalog'}</button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--zr-border-soft)' }} />
                <span style={{ fontSize: 11, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ili</span>
                <div style={{ flex: 1, height: 1, background: 'var(--zr-border-soft)' }} />
              </div>

              <button className="zw-btn zw-btn-ghost"><span style={{ fontSize: 14 }}>🌐</span> Nastavi sa Google</button>
              <button className="zw-btn zw-btn-ghost"><span style={{ fontSize: 14 }}>📧</span> Magic link na email</button>
            </div>

            <div style={{ marginTop: 32, fontSize: 13, color: 'var(--zr-gray)', textAlign: 'center' }}>
              {isLogin ? <>Nemaš nalog? <a onClick={() => navigate('/register')} style={{ color: 'var(--zr-pink)', fontWeight: 700, cursor: 'pointer' }}>Otvori jedan</a></> : <>Već imaš nalog? <a onClick={() => navigate('/login')} style={{ color: 'var(--zr-pink)', fontWeight: 700, cursor: 'pointer' }}>Uđi</a></>}
            </div>
          </div>
        </div>

        {/* Right: image side */}
        <div className="zw-img v3" style={{ position: 'relative', borderRadius: 0, fontSize: 0 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 60 }}>
            <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', padding: 32, borderRadius: 22, maxWidth: 380 }}>
              <div className="zw-eyebrow">Pretplata · besplatna</div>
              <h3 style={{ fontSize: 24, marginTop: 8, lineHeight: 1.2 }}>247 majstorica iz cele Srbije te čeka.</h3>
              <p style={{ fontSize: 13, color: 'var(--zr-gray)', marginTop: 10 }}>Sa nalogom dobiješ omiljeno, praćene radnje, brži checkout i prvi pristup novim kolekcijama.</p>
              <div style={{ display: 'flex', gap: -8, marginTop: 16 }}>
                {['M', 'A', 'J', 'S', 'V'].map((c, i) => (
                  <div key={i} className="zw-avatar" style={{ width: 32, height: 32, fontSize: 11, marginLeft: i ? -8 : 0, border: '2px solid white' }}>{c}</div>
                ))}
                <div className="zw-avatar" style={{ width: 32, height: 32, fontSize: 10, marginLeft: -8, border: '2px solid white', background: 'var(--zr-pink)', color: 'white' }}>+242</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Field({ label, defaultValue, type = 'text', ...rest }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--zr-pink-dark)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      <input className="zw-input" type={type} defaultValue={defaultValue} {...rest} />
    </div>
  );
}

Object.assign(window, { AdminPanel, BecomeSeller, AuthPage });
