/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, ProductCardW, SectionHeader, Crumbs, DetailRow */
const { useState, useEffect, useRef, useMemo } = React;

// ─── PROFILE ───
function ProfilePage() {
  const { parts } = useRoute();
  const sub = parts[1] || 'pregled';
  const { orders, favorites, products, follows, shops, notifs } = useWStore();

  const tabs = [
    ['pregled', 'Pregled', 'home'],
    ['porudzbine', `Porudžbine (${orders.length})`, 'package'],
    ['omiljeno', `Omiljeno (${favorites.size})`, 'heart'],
    ['radnje', `Praćene radnje (${follows.size})`, 'follow'],
    ['poruke', 'Poruke', 'chat'],
    ['obavestenja', `Obaveštenja`, 'bell'],
    ['podesavanja', 'Podešavanja', 'settings'],
  ];

  return (
    <Page>
      <div className="zw-container" style={{ paddingTop: 12 }}>
        <Crumbs items={[{ label: 'Početna', href: '/' }, { label: 'Profil' }]} />
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, padding: '8px 0 80px' }}>
          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 130, alignSelf: 'start' }}>
            <div className="zw-card" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="zw-avatar" style={{ width: 56, height: 56, fontSize: 18 }}>M</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>Marija K.</div>
                  <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>marija@gmail.com</div>
                </div>
              </div>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {tabs.map(([k, l, ic]) => (
                <button key={k} onClick={() => navigate('/profil/' + (k === 'pregled' ? '' : k))}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: sub === k ? 'var(--zr-pink-light)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: sub === k ? 'var(--zr-pink-dark)' : 'var(--zr-gray)', fontWeight: sub === k ? 700 : 500, textAlign: 'left' }}>
                  <Icon name={ic} size={16} />
                  {l}
                </button>
              ))}
              <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: 'var(--zr-gray)', fontWeight: 500, textAlign: 'left', marginTop: 8 }}>
                <Icon name="logout" size={16} /> Odjavi se
              </button>
            </nav>
          </aside>

          <div>
            {sub === 'pregled' && <ProfileOverview />}
            {sub === 'porudzbine' && <OrdersTab />}
            {sub === 'omiljeno' && <FavTab />}
            {sub === 'radnje' && <FollowedTab />}
            {sub === 'poruke' && <MessagesTab />}
            {sub === 'obavestenja' && <NotifsTab />}
            {sub === 'podesavanja' && <SettingsTab />}
          </div>
        </div>
      </div>
    </Page>
  );
}

function ProfileOverview() {
  const { orders, favorites, follows, products } = useWStore();
  return (
    <div>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Dobrodošla, <span className="zw-script" style={{ fontSize: 48, color: 'var(--zr-pink)' }}>Marija</span> 💕</h1>
      <p style={{ color: 'var(--zr-gray)', marginBottom: 32 }}>Tvoj kutak za porudžbine, omiljene predmete i poruke.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard n={orders.length} l="porudžbina" />
        <StatCard n={favorites.size} l="omiljenih" />
        <StatCard n={follows.size} l="praćenih radnji" />
      </div>

      <SectionHeader eyebrow="Aktivnost" title="Tvoje porudžbine" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.slice(0, 3).map(o => <OrderRow key={o.id} order={o} />)}
      </div>
    </div>
  );
}

function StatCard({ n, l }) {
  return <div className="zw-card" style={{ padding: 20 }}>
    <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{n}</div>
    <div style={{ fontSize: 12, color: 'var(--zr-gray)', fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</div>
  </div>;
}

function OrderRow({ order }) {
  const { shops, products } = useWStore();
  const shop = shops.find(s => s.id === order.shopId);
  const statusMap = {
    pending: { l: 'U pripremi', c: '#D4A547' },
    shipped: { l: 'U dostavi', c: '#5B8DB8' },
    delivered: { l: 'Dostavljeno', c: '#67c693' },
  };
  const st = statusMap[order.status];
  return (
    <div className="zw-card" style={{ padding: 18, display: 'grid', gridTemplateColumns: '60px 1fr auto auto', gap: 20, alignItems: 'center' }}>
      <div className={`zw-img ${shop?.color || 'v2'}`} style={{ width: 60, height: 60, borderRadius: 10, fontSize: 0 }} />
      <div>
        <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{order.id} · {shop?.name}</div>
        <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>{order.date} · {order.items.length} {order.items.length === 1 ? 'predmet' : 'predmeta'}</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: st.c + '22', color: st.c }}>{st.l}</span>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(order.total)}</div>
    </div>
  );
}

function OrdersTab() {
  const { orders } = useWStore();
  return (
    <div>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Porudžbine</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{orders.map(o => <OrderRow key={o.id} order={o} />)}</div>
    </div>
  );
}

function FavTab() {
  const { favorites, products } = useWStore();
  const items = products.filter(p => favorites.has(p.id));
  return (
    <div>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Omiljeno</h1>
      {items.length === 0 ? <p style={{ color: 'var(--zr-gray)' }}>Još nisi sačuvala ništa.</p> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>{items.map(p => <ProductCardW key={p.id} product={p} size="s" />)}</div>}
    </div>
  );
}

function FollowedTab() {
  const { follows, shops } = useWStore();
  const list = shops.filter(s => follows.has(s.id));
  return (
    <div>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Praćene radnje</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {list.map(s => (
          <div key={s.id} className="zw-card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => navigate('/radnja/' + s.id)}>
            <div className={`zw-img ${s.color}`} style={{ height: 140, borderRadius: 12, fontSize: 0 }} />
            <h3 style={{ fontSize: 16, marginTop: 12 }}>{s.name}</h3>
            <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>{s.city} · ⭐ {s.rating}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab() {
  const { convos, shops, sendMessage } = useWStore();
  const [activeId, setActiveId] = useState(convos[0]?.id);
  const [draft, setDraft] = useState('');
  const active = convos.find(c => c.id === activeId);
  const shop = shops.find(s => s.id === active?.shopId);

  return (
    <div>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Poruke</h1>
      <div className="zw-card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 600, overflow: 'hidden' }}>
        <div style={{ borderRight: '1px solid var(--zr-border-soft)', overflow: 'auto' }}>
          {convos.map(c => {
            const s = shops.find(sh => sh.id === c.shopId);
            const last = c.messages[c.messages.length - 1];
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)} style={{ width: '100%', display: 'flex', gap: 12, padding: 14, border: 'none', background: activeId === c.id ? 'var(--zr-pink-light)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', borderBottom: '1px solid var(--zr-border-soft)' }}>
                <div className={`zw-img ${s?.color}`} style={{ width: 44, height: 44, borderRadius: 999, fontSize: 0, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{c.userName}</span>
                    <span style={{ fontSize: 10, color: 'var(--zr-gray)' }}>{c.lastTime}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--zr-gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last?.text || '[slika]'}</div>
                </div>
                {c.unread > 0 && <div style={{ background: 'var(--zr-pink)', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 999, alignSelf: 'center' }}>{c.unread}</div>}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--zr-border-soft)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className={`zw-img ${shop?.color}`} style={{ width: 36, height: 36, borderRadius: 999, fontSize: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 14 }}>{active?.userName}</div>
              <div style={{ fontSize: 11, color: active?.online ? '#67c693' : 'var(--zr-gray)' }}>{active?.online ? '● Online' : 'Offline'}</div>
            </div>
          </div>
          <div style={{ flex: 1, padding: 20, overflow: 'auto', background: 'var(--zr-cream)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {active?.messages.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: 16, background: m.from === 'me' ? 'var(--zr-pink)' : 'white', color: m.from === 'me' ? 'white' : 'var(--zr-pink-dark)', fontSize: 14 }}>
                  {m.text}
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: '1px solid var(--zr-border-soft)', display: 'flex', gap: 10 }}>
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && draft.trim()) { sendMessage(active.id, draft); setDraft(''); }}} placeholder="Napiši poruku…" className="zw-input" />
            <button className="zw-btn zw-btn-primary" onClick={() => { if (draft.trim()) { sendMessage(active.id, draft); setDraft(''); }}}><Icon name="send" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotifsTab() {
  const { notifs } = useWStore();
  return (
    <div>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Obaveštenja</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map(n => (
          <div key={n.id} className="zw-card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start', borderLeft: n.unread ? '3px solid var(--zr-pink)' : '3px solid transparent' }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--zr-pink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink-dark)', flexShrink: 0 }}><Icon name={n.type === 'order' ? 'package' : n.type === 'msg' ? 'chat' : 'star'} size={18} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--zr-gray)', marginTop: 2 }}>{n.text}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Podešavanja</h1>
      <div className="zw-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Lični podaci</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Ime" defaultValue="Marija" />
          <Field label="Prezime" defaultValue="Kovačević" />
          <Field label="Email" defaultValue="marija@gmail.com" full />
          <Field label="Telefon" defaultValue="+381 64 123 4567" full />
        </div>
        <button className="zw-btn zw-btn-primary" style={{ marginTop: 20 }}>Sačuvaj</button>
      </div>
    </div>
  );
}

// ─── MAGAZIN ───
function Magazin() {
  const { stories } = useWStore();
  return (
    <Page>
      <section style={{ background: 'var(--zr-cream)', padding: '60px 0 32px', textAlign: 'center' }}>
        <div className="zw-container">
          <div className="zw-eyebrow" style={{ marginBottom: 14 }}>Magazin</div>
          <h1 style={{ fontSize: 64, lineHeight: 1, textWrap: 'balance' }}>Priče iza <span className="zw-script" style={{ fontSize: 80, color: 'var(--zr-pink)' }}>ruku.</span></h1>
          <p style={{ marginTop: 18, fontSize: 16, color: 'var(--zr-gray)', maxWidth: 600, margin: '18px auto 0' }}>Posete radionicama, intervjui sa majstoricama, recepti i tradicije. Sve što ne stane na karticu proizvoda.</p>
        </div>
      </section>
      <section style={{ padding: '48px 0 80px' }}>
        <div className="zw-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            {stories.map(s => (
              <article key={s.id} onClick={() => navigate('/magazin/' + s.id)} style={{ cursor: 'pointer' }}>
                <div className={`zw-img ${s.color}`} style={{ height: 380, borderRadius: 22 }}><span>{s.cover}</span></div>
                <div style={{ marginTop: 18 }}>
                  <div className="zw-eyebrow">Priča · {s.readTime} · {s.date}</div>
                  <h2 style={{ fontSize: 30, marginTop: 10, lineHeight: 1.2 }}>{s.title}</h2>
                  <p style={{ marginTop: 12, fontSize: 15, color: 'var(--zr-gray)', lineHeight: 1.6 }}>{s.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}

function StoryPage() {
  const { parts } = useRoute();
  const { stories, shops } = useWStore();
  const story = stories.find(s => s.id === parts[1]) || stories[0];
  const shop = shops.find(s => s.id === story.shopId);
  return (
    <Page>
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 32px 80px' }}>
        <Crumbs items={[{ label: 'Magazin', href: '/magazin' }, { label: story.title }]} />
        <div className="zw-eyebrow" style={{ marginTop: 16, marginBottom: 16 }}>Priča · {story.readTime} · {story.date}</div>
        <h1 style={{ fontSize: 56, lineHeight: 1.05, textWrap: 'balance' }}>{story.title}</h1>
        <p style={{ fontSize: 20, color: 'var(--zr-gray)', marginTop: 20, lineHeight: 1.6 }}>{story.excerpt}</p>
        <div className={`zw-img ${story.color}`} style={{ height: 480, borderRadius: 22, marginTop: 32 }}><span>{story.cover}</span></div>
        <div style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--zr-gray)', marginTop: 32 }}>
          <p>U {shop?.city}u, na trećem spratu zgrade pored centralnog parka, čućeš pre nego što vidiš. Igle pletu ritam — tap-tap, tap-tap — pre 6 ujutru. Mila je već budna sat vremena.</p>
          <p style={{ marginTop: 18 }}>"Najbolje pletem dok grad još spava," kaže ona, smejući se. "Bez telefona, bez poruka. Samo konac i ja."</p>
          <p style={{ marginTop: 18 }}>Pre tri godine, Mila je pravila šalove samo za bakine prijateljice. Danas, njeni šalovi su stigli do Beča, Zagreba, čak i Stokholma. Ali ona i dalje plete sama, u ateljeu od 12 kvadrata, sa pogledom na crkvu.</p>
        </div>
        <div className="zw-card" style={{ padding: 24, marginTop: 40, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className={`zw-img ${shop?.color}`} style={{ width: 80, height: 80, borderRadius: 16, fontSize: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="zw-eyebrow">Radnja iz priče</div>
            <h3 style={{ fontSize: 20, marginTop: 4 }}>{shop?.name}</h3>
            <div style={{ fontSize: 13, color: 'var(--zr-gray)' }}>{shop?.city} · ⭐ {shop?.rating}</div>
          </div>
          <button className="zw-btn zw-btn-primary" onClick={() => navigate('/radnja/' + shop?.id)}>Poseti radnju →</button>
        </div>
      </article>
    </Page>
  );
}

Object.assign(window, { ProfilePage, Magazin, StoryPage });
