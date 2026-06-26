/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, SectionHeader, Crumbs */
const { useState, useMemo } = React;

// ─── SELLER DASHBOARD ───
function SellerDashboard() {
  const { parts } = useRoute();
  const sub = parts[1] || 'pregled';
  const { sellerOrders, products, sellerVideos, shops } = useWStore();
  const myShop = shops[0]; // s1, Mila
  const myProducts = products.filter(p => p.shopId === myShop.id);

  const tabs = [
    ['pregled', 'Pregled', 'home'],
    ['proizvodi', `Proizvodi (${myProducts.length})`, 'package'],
    ['porudzbine', `Porudžbine (${sellerOrders.length})`, 'cart'],
    ['video', `Video (${sellerVideos.length})`, 'video'],
    ['poruke', 'Poruke', 'chat'],
    ['analiza', 'Statistika', 'star'],
    ['radnja', 'Profil radnje', 'settings'],
  ];

  return (
    <Page footer={false}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 200px)' }}>
        {/* Sidebar */}
        <aside style={{ background: 'var(--zr-surface)', borderRight: '1px solid var(--zr-border-soft)', padding: '32px 18px' }}>
          <div style={{ marginBottom: 24, padding: '0 14px' }}>
            <div className="zw-eyebrow">Prodavac</div>
            <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 18, marginTop: 4 }}>{myShop.name}</div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tabs.map(([k, l, ic]) => {
              const active = sub === k || (k === 'pregled' && !parts[1]);
              return (
                <button key={k} onClick={() => navigate('/prodavac/' + (k === 'pregled' ? '' : k))}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, background: active ? 'var(--zr-pink-light)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: active ? 'var(--zr-pink-dark)' : 'var(--zr-gray)', fontWeight: active ? 700 : 500, textAlign: 'left' }}>
                  <Icon name={ic} size={16} /> {l}
                </button>
              );
            })}
          </nav>
          <div className="zw-divider" style={{ margin: '20px 0' }} />
          <button className="zw-btn zw-btn-primary" style={{ width: '100%' }} onClick={() => navigate('/prodavac/dodaj')}>
            <Icon name="plus" size={14} /> Novi proizvod
          </button>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: 'var(--zr-gray)', width: '100%', textAlign: 'left' }}>
            <Icon name="arrow-left" size={14} /> Nazad u prodavnicu
          </button>
        </aside>

        <main style={{ padding: '40px 48px', background: 'var(--zr-cream)' }}>
          {(sub === 'pregled' || !parts[1]) && <DashOverview />}
          {sub === 'proizvodi' && <ProductsTab />}
          {sub === 'porudzbine' && <SellerOrdersTab />}
          {sub === 'video' && <VideoTab />}
          {sub === 'poruke' && <SellerMsgTab />}
          {sub === 'analiza' && <AnalyticsTab />}
          {sub === 'radnja' && <ShopProfileTab />}
          {sub === 'dodaj' && <AddProductPage />}
        </main>
      </div>
    </Page>
  );
}

function DashOverview() {
  const { sellerOrders } = useWStore();
  const todayRevenue = sellerOrders.filter(o => o.status === 'pending').reduce((s, o) => s + o.total, 0);
  const monthRevenue = sellerOrders.reduce((s, o) => s + o.total, 0);
  const pending = sellerOrders.filter(o => o.status === 'pending').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <div className="zw-eyebrow">Pregled · maj 2026</div>
          <h1 style={{ fontSize: 36, marginTop: 6 }}>Dobro došla, <span className="zw-script" style={{ fontSize: 48, color: 'var(--zr-pink)' }}>Mila</span></h1>
        </div>
        <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>Poslednja sinhronizacija: pre 2 minuta</div>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <Kpi label="Nove porudžbine" value={pending} delta="+2" pos />
        <Kpi label="Prihod (danas)" value={wFmtPrice(todayRevenue)} delta="+18%" pos />
        <Kpi label="Prihod (maj)" value={wFmtPrice(monthRevenue)} delta="+34%" pos />
        <Kpi label="Posetilaca radnje" value="1.247" delta="+128" pos />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
        {/* Recent orders */}
        <div className="zw-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 18 }}>Nedavne porudžbine</h3>
            <button className="zw-btn zw-btn-soft zw-btn-sm" onClick={() => navigate('/prodavac/porudzbine')}>Sve →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--zr-border-soft)' }}>
                {['Br.', 'Kupac', 'Datum', 'Status', 'Iznos'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 0', fontSize: 11, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--zr-gray)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {useWStore().sellerOrders.slice(0, 5).map(o => <SellerOrderRow key={o.id} order={o} />)}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="zw-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>Najprodavanije</h3>
            {[
              { n: 'Šal — boja zalaska', s: 12, t: 57600 },
              { n: 'Pletena kapa', s: 8, t: 19200 },
              { n: 'Vezeni jastuk', s: 5, t: 16000 },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: i ? '1px solid var(--zr-border-soft)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{p.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)' }}>{p.s} prodato</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zr-pink)' }}>{wFmtPrice(p.t)}</div>
              </div>
            ))}
          </div>
          <div className="zw-card" style={{ padding: 24, background: 'linear-gradient(135deg, var(--zr-pink-light), var(--zr-cream))' }}>
            <Icon name="video" size={22} />
            <h3 style={{ fontSize: 16, marginTop: 12 }}>Dodaj video radionice</h3>
            <p style={{ fontSize: 12, color: 'var(--zr-gray)', marginTop: 8, marginBottom: 14 }}>Radnje sa video sadržajem prodaju 2.4× više. Dodaj kratak snimak procesa.</p>
            <button className="zw-btn zw-btn-primary zw-btn-sm" onClick={() => navigate('/prodavac/video')}>Pošalji snimak →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, pos }) {
  return (
    <div className="zw-card" style={{ padding: 22 }}>
      <div style={{ fontSize: 11, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--zr-pink-dark)', marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 11, color: pos ? '#67c693' : '#d97a7a', marginTop: 4, fontWeight: 600 }}>{delta} vs prošla nedelja</div>
    </div>
  );
}

function SellerOrderRow({ order }) {
  const statusMap = {
    pending: { l: 'Pripremam', c: '#D4A547' },
    shipped: { l: 'Poslato', c: '#5B8DB8' },
    delivered: { l: 'Dostavljeno', c: '#67c693' },
  };
  const st = statusMap[order.status];
  return (
    <tr style={{ borderBottom: '1px solid var(--zr-border-soft)' }}>
      <td style={{ padding: '14px 0', fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{order.id}</td>
      <td style={{ padding: '14px 0', fontSize: 13 }}>{order.buyer}<br /><span style={{ color: 'var(--zr-gray)', fontSize: 11 }}>{order.city}</span></td>
      <td style={{ padding: '14px 0', fontSize: 13, color: 'var(--zr-gray)' }}>{order.date}</td>
      <td style={{ padding: '14px 0' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: st.c + '22', color: st.c }}>{st.l}</span></td>
      <td style={{ padding: '14px 0', fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(order.total)}</td>
    </tr>
  );
}

function ProductsTab() {
  const { products, shops } = useWStore();
  const myShop = shops[0];
  const myProducts = products.filter(p => p.shopId === myShop.id);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 32 }}>Proizvodi</h1>
        <button className="zw-btn zw-btn-primary" onClick={() => navigate('/prodavac/dodaj')}><Icon name="plus" size={14} /> Novi proizvod</button>
      </div>
      <div className="zw-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--zr-cream)' }}>
            <tr>
              {['', 'Naziv', 'Cena', 'Zalihe', 'Prodato', 'Status', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 18px', fontSize: 11, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--zr-gray)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myProducts.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--zr-border-soft)' }}>
                <td style={{ padding: '14px 18px' }}><div className={`zw-img ${p.color}`} style={{ width: 50, height: 50, borderRadius: 8, fontSize: 0 }} /></td>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{p.name}</td>
                <td style={{ padding: '14px 18px', fontWeight: 700 }}>{wFmtPrice(p.price)}</td>
                <td style={{ padding: '14px 18px' }}>{p.inStock} kom</td>
                <td style={{ padding: '14px 18px' }}>{p.reviewCount * 2}</td>
                <td style={{ padding: '14px 18px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: '#67c69322', color: '#67c693' }}>Aktivan</span></td>
                <td style={{ padding: '14px 18px' }}><button className="zw-btn zw-btn-ghost zw-btn-sm">Uredi</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SellerOrdersTab() {
  const { sellerOrders } = useWStore();
  const [filter, setFilter] = useState('sve');
  const list = filter === 'sve' ? sellerOrders : sellerOrders.filter(o => o.status === filter);
  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>Porudžbine</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['sve','Sve'],['pending','Pripremam'],['shipped','Poslato'],['delivered','Dostavljeno']].map(([k, l]) => (
          <button key={k} className={`zw-chip ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <div className="zw-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--zr-cream)' }}>
            <tr>
              {['Br.', 'Kupac', 'Datum', 'Predmeti', 'Iznos', 'Status', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 18px', fontSize: 11, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--zr-gray)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(o => {
              const st = { pending: { l: 'Pripremam', c: '#D4A547' }, shipped: { l: 'Poslato', c: '#5B8DB8' }, delivered: { l: 'Dostavljeno', c: '#67c693' }}[o.status];
              return (
                <tr key={o.id} style={{ borderTop: '1px solid var(--zr-border-soft)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{o.id}</td>
                  <td style={{ padding: '14px 18px' }}>{o.buyer}<br /><span style={{ color: 'var(--zr-gray)', fontSize: 11 }}>{o.city}</span></td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--zr-gray)' }}>{o.date}</td>
                  <td style={{ padding: '14px 18px' }}>{o.items}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>{wFmtPrice(o.total)}</td>
                  <td style={{ padding: '14px 18px' }}><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: st.c + '22', color: st.c }}>{st.l}</span></td>
                  <td style={{ padding: '14px 18px' }}>{o.status === 'pending' ? <button className="zw-btn zw-btn-primary zw-btn-sm">Pošalji</button> : <button className="zw-btn zw-btn-ghost zw-btn-sm">Detalji</button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VideoTab() {
  const { sellerVideos } = useWStore();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 32 }}>Video sadržaj</h1>
        <button className="zw-btn zw-btn-primary"><Icon name="plus" size={14} /> Novi snimak</button>
      </div>
      <p style={{ color: 'var(--zr-gray)', maxWidth: 600, marginBottom: 24 }}>Dodaj uvodni snimak (max 2 min) koji se prikazuje na vrhu profila tvoje radnje. Drugi snimci se prikazuju u sekciji "Iz radionice".</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {sellerVideos.map(v => (
          <div key={v.id} className="zw-card" style={{ overflow: 'hidden' }}>
            <div className={`zw-img ${v.color}`} style={{ height: 200, position: 'relative', fontSize: 0 }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="play" size={22} stroke="var(--zr-pink-dark)" />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--zr-font-mono)' }}>{v.duration}</div>
              {v.isMain && <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--zr-pink)', color: 'white', padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Glavni snimak</div>}
            </div>
            <div style={{ padding: 16 }}>
              <h4 style={{ fontSize: 14, color: 'var(--zr-pink-dark)', marginBottom: 4 }}>{v.title}</h4>
              <div style={{ fontSize: 11, color: 'var(--zr-gray)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{v.date}</span>
                <span>{v.views} pregleda</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="zw-btn zw-btn-ghost zw-btn-sm" style={{ flex: 1 }}>Uredi</button>
                <button className="zw-btn zw-btn-soft zw-btn-sm" style={{ flex: 1 }}>{v.isMain ? 'Glavni' : 'Postavi glavni'}</button>
              </div>
            </div>
          </div>
        ))}
        {/* Upload card */}
        <div style={{ borderRadius: 'var(--zr-radius)', border: '2px dashed var(--zr-border)', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 200, cursor: 'pointer' }}>
          <Icon name="plus" size={28} stroke="var(--zr-pink)" />
          <div style={{ marginTop: 10, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>Otpremi snimak</div>
          <div style={{ fontSize: 12, color: 'var(--zr-gray)', marginTop: 4 }}>MP4 do 200MB · max 2 minuta</div>
        </div>
      </div>
    </div>
  );
}

function SellerMsgTab() {
  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Poruke od kupaca</h1>
      <div className="zw-card" style={{ padding: 40, textAlign: 'center' }}>
        <Icon name="chat" size={32} stroke="var(--zr-pink)" />
        <h3 style={{ marginTop: 12 }}>3 nove poruke</h3>
        <p style={{ color: 'var(--zr-gray)', marginTop: 8 }}>Otvori centar za poruke za detalje (vidi profil kupca).</p>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Statistika</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <Kpi label="Pregledi (7d)" value="1.247" delta="+128" pos />
        <Kpi label="Konverzija" value="3.8%" delta="+0.4pp" pos />
        <Kpi label="Recenzije" value="4.9 ⭐" delta="+12" pos />
      </div>
      <div className="zw-card" style={{ padding: 32, height: 280, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        {[40, 65, 50, 78, 60, 92, 88, 70, 95, 110, 98, 130].map((h, i) => (
          <div key={i} style={{ flex: 1, height: h * 1.6, background: i === 11 ? 'var(--zr-pink)' : 'var(--zr-pink-light)', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
            <span style={{ fontSize: 9, color: i === 11 ? 'white' : 'var(--zr-pink-dark)', fontFamily: 'var(--zr-font-mono)', writingMode: 'vertical-rl' }}>{h}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', marginTop: 8, padding: '0 32px' }}>
        {['Apr 22', '', '', 'Apr 26', '', '', 'Apr 30', '', '', 'Maj 4'].map((d, i) => <span key={i}>{d}</span>)}
      </div>
    </div>
  );
}

function ShopProfileTab() {
  const { shops } = useWStore();
  const my = shops[0];
  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Profil radnje</h1>
      <div className="zw-card" style={{ padding: 32 }}>
        <div className={`zw-img ${my.color}`} style={{ height: 180, borderRadius: 14, marginBottom: 20 }}><span>{my.cover}</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Naziv radnje" defaultValue={my.name} full />
          <Field label="Lokacija" defaultValue={my.city} />
          <Field label="Kategorija" defaultValue={my.category} />
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--zr-pink-dark)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>O radnji</label>
          <textarea className="zw-input" style={{ minHeight: 100, resize: 'vertical' }} defaultValue={my.bio} />
        </div>
        <button className="zw-btn zw-btn-primary" style={{ marginTop: 20 }}>Sačuvaj izmene</button>
      </div>
    </div>
  );
}

// ─── ADD PRODUCT ───
function AddProductPage() {
  const [step, setStep] = useState(1);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="zw-btn zw-btn-ghost zw-btn-sm" onClick={() => navigate('/prodavac/proizvodi')}><Icon name="arrow-left" size={14} /> Nazad</button>
        <h1 style={{ fontSize: 28 }}>Novi proizvod</h1>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} style={{ flex: 1, height: 4, borderRadius: 999, background: n <= step ? 'var(--zr-pink)' : 'var(--zr-border-soft)' }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        <div className="zw-card" style={{ padding: 32 }}>
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            <button className="zw-btn zw-btn-ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>← Nazad</button>
            {step < 4
              ? <button className="zw-btn zw-btn-primary" onClick={() => setStep(s => s + 1)}>Nastavi →</button>
              : <button className="zw-btn zw-btn-primary" onClick={() => { useWStore().showToast('Proizvod objavljen 🌸'); navigate('/prodavac/proizvodi'); }}>Objavi proizvod</button>}
          </div>
        </div>

        {/* Live preview */}
        <aside style={{ position: 'sticky', top: 130, alignSelf: 'start' }}>
          <div className="zw-eyebrow" style={{ marginBottom: 10 }}>Pregled kartice</div>
          <div className="zw-card" style={{ overflow: 'hidden' }}>
            <div className="zw-img v3" style={{ height: 220 }}><span>tvoja slika</span></div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mila & Konac · Novi Sad</div>
              <h4 style={{ fontSize: 14, marginTop: 4, color: 'var(--zr-pink-dark)' }}>Šal — boja zalaska</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>4.800 RSD</span>
                <span style={{ fontSize: 11, color: 'var(--zr-gray)' }}>3 dostupna</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--zr-gray)', marginTop: 12 }}>Ovako će izgledati u katalogu i pretrazi.</p>
        </aside>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div>
      <div className="zw-eyebrow">Korak 1 / 4</div>
      <h2 style={{ fontSize: 22, marginTop: 6, marginBottom: 18 }}>Osnovne informacije</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        <Field label="Naziv proizvoda" defaultValue="Šal od merino vune — boja zalaska" full />
        <Field label="Kategorija" defaultValue="Tekstil · Pleteno" full />
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--zr-pink-dark)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Opis</label>
          <textarea className="zw-input" style={{ minHeight: 120, resize: 'vertical' }} placeholder="Opiši proizvod, materijale, dimenzije, priču iza njega..." defaultValue="Ručno pleteno od 100% merino vune. Mekano, toplo, idealno za jesen i zimu. Svaki komad je jedinstven — boja se može blago razlikovati zbog ručnog farbanja." />
        </div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div>
      <div className="zw-eyebrow">Korak 2 / 4</div>
      <h2 style={{ fontSize: 22, marginTop: 6, marginBottom: 18 }}>Slike (max 6)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="zw-img v2" style={{ height: 160, borderRadius: 12 }}><span>slika {i}</span></div>
        ))}
        {[4, 5, 6].map(i => (
          <div key={i} style={{ height: 160, borderRadius: 12, border: '2px dashed var(--zr-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer', color: 'var(--zr-gray)' }}>
            <Icon name="plus" size={20} stroke="var(--zr-pink)" />
            <div style={{ fontSize: 11, marginTop: 6 }}>Dodaj sliku</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, padding: 16, background: 'var(--zr-pink-light)', borderRadius: 12, fontSize: 12, color: 'var(--zr-pink-dark)' }}>
        💡 Prirodna svetlost daje najbolje rezultate. Slikaj proizvod sa više uglova i pokaži detalje.
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div>
      <div className="zw-eyebrow">Korak 3 / 4</div>
      <h2 style={{ fontSize: 22, marginTop: 6, marginBottom: 18 }}>Cena i zalihe</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Cena (RSD)" defaultValue="4800" />
        <Field label="Stara cena (opciono)" defaultValue="5500" />
        <Field label="Količina dostupna" defaultValue="3" />
        <Field label="Vreme izrade" defaultValue="1-2 nedelje" />
      </div>
      <div style={{ marginTop: 20, padding: 16, background: 'var(--zr-cream)', borderRadius: 12, border: '1px dashed var(--zr-border)' }}>
        <h4 style={{ fontSize: 13, marginBottom: 10 }}>Tvoja zarada</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>Cena proizvoda</span><span>4.800 RSD</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, color: 'var(--zr-gray)' }}><span>Provizija</span><span style={{ color: 'var(--zr-pink-dark)', fontWeight: 600 }}>0 RSD · trenutno besplatno</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: 'var(--zr-pink-dark)', borderTop: '1px solid var(--zr-border-soft)', paddingTop: 8, marginTop: 8 }}><span>Tvoj prihod po prodaji</span><span>4.800 RSD</span></div>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div>
      <div className="zw-eyebrow">Korak 4 / 4</div>
      <h2 style={{ fontSize: 22, marginTop: 6, marginBottom: 18 }}>Dostava</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {[
          { id: 'post', t: 'Pošta Srbije', d: '2-4 dana · 380 RSD', def: true },
          { id: 'paketa', t: 'Paketa', d: '1-2 dana · 480 RSD' },
          { id: 'dexpress', t: 'D Express', d: '1-3 dana · 420 RSD' },
        ].map(o => (
          <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, background: 'var(--zr-surface)', border: '1.5px solid var(--zr-border)', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked={o.def} style={{ accentColor: 'var(--zr-pink)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{o.t}</div>
              <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>{o.d}</div>
            </div>
          </label>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" defaultChecked style={{ accentColor: 'var(--zr-pink)' }} />
          Besplatna dostava za porudžbine preko 5.000 RSD
        </label>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, full, ...rest }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--zr-pink-dark)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      <input className="zw-input" defaultValue={defaultValue} {...rest} />
    </div>
  );
}

Object.assign(window, { SellerDashboard, AddProductPage });
