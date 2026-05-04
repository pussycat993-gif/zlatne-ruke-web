/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon */
const { useState, useEffect, useRef } = React;

// ─── Logo ───
function Logo({ size = 28, onClick }) {
  return (
    <div onClick={onClick || (() => navigate('/'))} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <div style={{
        width: size, height: size, borderRadius: 999,
        background: 'linear-gradient(135deg, #C0637A, #A0445A)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px -2px rgba(160,68,90,0.4)', flexShrink: 0,
      }}>
        <span style={{ fontSize: size * 0.55, lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>🌸</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span style={{ fontFamily: 'var(--zr-font-display)', fontSize: size * 0.62, fontWeight: 700, color: 'var(--zr-pink-dark)', letterSpacing: '-0.02em' }}>Zlatne Ruke</span>
        <span style={{ fontFamily: 'var(--zr-font-mono)', fontSize: size * 0.3, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--zr-pink)', marginTop: 5, fontWeight: 500 }}>handmade · srbija</span>
      </div>
    </div>
  );
}

// ─── TopNav ───
function TopNav() {
  const { cart, favorites, role } = useWStore();
  const { path } = useRoute();
  const [megaOpen, setMegaOpen] = useState(false);
  const [search, setSearch] = useState('');
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const isActive = (p) => path === p || path.startsWith(p + '/');

  const linkStyle = (active) => ({
    fontSize: 14, fontWeight: 600,
    color: active ? 'var(--zr-pink-dark)' : 'var(--zr-gray)',
    cursor: 'pointer', padding: '6px 0', position: 'relative',
    transition: 'color 0.15s',
  });

  return (
    <header style={{ background: 'white', borderBottom: '1px solid var(--zr-border-soft)', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* announcement bar */}
      <div style={{ background: 'var(--zr-pink-dark)', color: 'white', textAlign: 'center', fontSize: 12, padding: '8px 16px', fontWeight: 500, letterSpacing: '0.02em' }}>
        🌸 Besplatna dostava za porudžbine preko 5.000 RSD · 200+ majstorica iz cele Srbije
      </div>

      <div className="zw-container-wide" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '18px 48px' }}>
        <Logo size={32} />

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
          <div
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
            style={{ position: 'relative' }}
          >
            <a onClick={() => navigate('/katalog')} style={linkStyle(isActive('/katalog'))}>
              Kategorije <span style={{ fontSize: 10, marginLeft: 4 }}>▾</span>
            </a>
            {megaOpen && <MegaMenu close={() => setMegaOpen(false)} />}
          </div>
          <a onClick={() => navigate('/magazin')} style={linkStyle(isActive('/magazin'))}>Priče</a>
          <a onClick={() => navigate('/postani-prodavac')} style={linkStyle(isActive('/postani-prodavac'))}>Postani prodavac</a>
          <a onClick={() => navigate('/o-nama')} style={linkStyle(isActive('/o-nama'))}>O nama</a>
        </nav>

        {/* Search */}
        <div style={{ position: 'relative', width: 320 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { navigate('/katalog?q=' + encodeURIComponent(search)); }}}
            placeholder="Pretraži šal, sveće, sapune…"
            style={{
              width: '100%', padding: '11px 16px 11px 42px',
              borderRadius: 999, border: '1.5px solid var(--zr-border)',
              background: 'var(--zr-cream)', fontSize: 13, fontFamily: 'inherit',
              color: 'var(--zr-pink-dark)', outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--zr-gray-soft)' }}>
            <Icon name="search" size={16} />
          </span>
        </div>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconLink onClick={() => navigate('/profil')} icon="user" label="Profil" />
          <IconLink onClick={() => navigate('/profil/omiljeno')} icon="heart" label="Omiljeno" badge={favorites.size} />
          <IconLink onClick={() => navigate('/korpa')} icon="bag" label="Korpa" badge={cartCount} highlight />
        </div>
      </div>
    </header>
  );
}

function IconLink({ icon, label, badge, onClick, highlight }) {
  return (
    <button onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        padding: '8px 14px', borderRadius: 14, background: highlight ? 'var(--zr-pink-light)' : 'transparent',
        border: 'none', cursor: 'pointer', position: 'relative',
        color: 'var(--zr-pink-dark)',
        transition: 'background 0.15s',
      }}
      onMouseOver={e => e.currentTarget.style.background = highlight ? 'var(--zr-pink-tint)' : 'var(--zr-cream)'}
      onMouseOut={e => e.currentTarget.style.background = highlight ? 'var(--zr-pink-light)' : 'transparent'}
    >
      <div style={{ position: 'relative' }}>
        <Icon name={icon} size={20} />
        {badge > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -10,
            background: 'var(--zr-pink)', color: 'white',
            fontSize: 10, fontWeight: 700, padding: '2px 6px',
            borderRadius: 999, minWidth: 18, textAlign: 'center', lineHeight: 1.2,
          }}>{badge}</span>
        )}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
    </button>
  );
}

function MegaMenu({ close }) {
  const { categories, shops } = useWStore();
  return (
    <div
      style={{
        position: 'absolute', top: '100%', left: -32, marginTop: 8,
        width: 720, background: 'white',
        borderRadius: 18, boxShadow: 'var(--zr-shadow-lg)',
        border: '1px solid var(--zr-border-soft)',
        padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 32, zIndex: 100,
      }}
    >
      <div>
        <div className="zw-eyebrow" style={{ marginBottom: 14 }}>Kategorije</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {categories.map(c => (
            <a key={c.id} onClick={() => { navigate('/katalog?cat=' + c.id); close(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--zr-pink-light)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 22 }}>{c.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{c.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div>
        <div className="zw-eyebrow" style={{ marginBottom: 14 }}>U fokusu — radnje</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shops.slice(0, 4).map(s => (
            <a key={s.id} onClick={() => { navigate('/radnja/' + s.id); close(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--zr-cream)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <div className={`zw-img ${s.color}`} style={{ width: 44, height: 44, borderRadius: 12, fontSize: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>{s.city} · ⭐ {s.rating} · {s.followers} prati</div>
              </div>
            </a>
          ))}
        </div>
        <a onClick={() => { navigate('/radnje'); close(); }} style={{ display: 'inline-block', marginTop: 14, fontSize: 12, fontWeight: 600, color: 'var(--zr-pink)', cursor: 'pointer' }}>
          Sve radnje →
        </a>
      </div>
    </div>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer style={{ background: 'var(--zr-pink-dark)', color: 'rgba(255,255,255,0.85)', marginTop: 80 }}>
      <div className="zw-container" style={{ padding: '64px 32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18 }}>🌸</span>
              </div>
              <span style={{ fontFamily: 'var(--zr-font-script)', fontSize: 28, fontWeight: 700, color: 'white' }}>Zlatne Ruke</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 320, color: 'rgba(255,255,255,0.7)' }}>
              Marketplace za rukotvorine žena iz Srbije. Svaki predmet ima ime, mesto i priču.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['IG','FB','TT','YT'].map(s => (
                <div key={s} style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{s}</div>
              ))}
            </div>
          </div>
          <FooterCol title="Kupovina" links={[['Kategorije','/katalog'],['Nove radnje','/radnje'],['Priče','/magazin'],['Pokloni','/katalog?cat=dekor']]} />
          <FooterCol title="Prodavci" links={[['Postani prodavac','/postani-prodavac'],['Saveti','/magazin'],['Cenovnik','/postani-prodavac'],['Login','/login']]} />
          <FooterCol title="Pomoć" links={[['Dostava','/pomoc'],['Povraćaj','/pomoc'],['Kontakt','/kontakt'],['ČPP','/pomoc']]} />
          <FooterCol title="Pravno" links={[['Uslovi','/uslovi'],['Privatnost','/privatnost'],['Kolačići','/privatnost']]} />
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 48, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
          <div>© 2026 Zlatne Ruke d.o.o. · Beograd, Srbija</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Plaćanje: Visa · Mastercard · Pouzeće</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {links.map(([label, href]) => (
          <a key={label} onClick={() => navigate(href)} style={{ fontSize: 13, cursor: 'pointer', color: 'rgba(255,255,255,0.75)', transition: 'color 0.15s' }}
            onMouseOver={e => e.currentTarget.style.color = 'white'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Toast ───
function ToastHost() {
  const { toast } = useWStore();
  if (!toast) return null;
  return <div className="zw-toast">{toast}</div>;
}

// ─── Product card (web) ───
function ProductCardW({ product, size = 'm' }) {
  const { toggleFav, favorites, addToCart, shops } = useWStore();
  const shop = shops.find(s => s.id === product.shopId);
  const fav = favorites.has(product.id);
  const [hover, setHover] = useState(false);

  const w = size === 's' ? 220 : size === 'l' ? 320 : 270;
  const h = size === 's' ? 240 : size === 'l' ? 360 : 300;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: 'pointer', position: 'relative', transition: 'transform 0.18s', transform: hover ? 'translateY(-4px)' : 'none' }}
    >
      <div onClick={() => navigate('/proizvod/' + product.id)} style={{ position: 'relative' }}>
        <div className={`zw-img ${product.color}`} style={{ width: '100%', height: h, borderRadius: 14 }}>
          <span>{product.img}</span>
        </div>
        {product.oldPrice && <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--zr-pink-dark)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 999 }}>−{Math.round((1 - product.price/product.oldPrice)*100)}%</div>}
        {product.inStock <= 3 && <div style={{ position: 'absolute', top: 12, right: 12, background: 'white', color: 'var(--zr-pink-dark)', fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 999, letterSpacing: '0.05em' }}>jos {product.inStock}</div>}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }}
        style={{
          position: 'absolute', top: 12, right: 12,
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--zr-shadow-sm)',
          color: fav ? 'var(--zr-pink)' : 'var(--zr-gray-soft)',
          opacity: hover || fav ? 1 : 0,
          transition: 'opacity 0.18s, color 0.15s',
        }}
      >
        <Icon name="heart" size={16} fill={fav ? 'var(--zr-pink)' : 'none'} />
      </button>

      {hover && (
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
          className="zw-btn zw-btn-primary zw-btn-sm zw-fadein"
          style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', boxShadow: 'var(--zr-shadow)' }}
        >
          + U korpu
        </button>
      )}

      <div onClick={() => navigate('/proizvod/' + product.id)} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--zr-gray)', fontWeight: 600 }}>{shop?.name}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--zr-pink-dark)', marginTop: 2, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(product.price)}</span>
          {product.oldPrice && <span style={{ fontSize: 12, color: 'var(--zr-gray-soft)', textDecoration: 'line-through' }}>{wFmtPrice(product.oldPrice)}</span>}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--zr-gray)' }}>⭐ {product.rating} ({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

// ─── Section header ───
function SectionHeader({ eyebrow, title, sub, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, gap: 24 }}>
      <div>
        {eyebrow && <div className="zw-eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>}
        <h2 style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.1 }}>{title}</h2>
        {sub && <p style={{ marginTop: 10, fontSize: 15, color: 'var(--zr-gray)', maxWidth: 580 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ─── Page wrapper ───
function Page({ children, footer = true, nav = true }) {
  return (
    <div className="zw-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {nav && <TopNav />}
      <main style={{ flex: 1 }}>{children}</main>
      {footer && <Footer />}
      <ToastHost />
    </div>
  );
}

// ─── Breadcrumbs ───
function Crumbs({ items }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--zr-gray)', padding: '20px 0' }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--zr-gray-soft)' }}>›</span>}
          {it.href ? <a onClick={() => navigate(it.href)} style={{ cursor: 'pointer', fontWeight: 500 }} onMouseOver={e=>e.currentTarget.style.color='var(--zr-pink-dark)'} onMouseOut={e=>e.currentTarget.style.color='var(--zr-gray)'}>{it.label}</a> : <span style={{ color: 'var(--zr-pink-dark)', fontWeight: 600 }}>{it.label}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { Logo, TopNav, Footer, ToastHost, ProductCardW, SectionHeader, Page, Crumbs, IconLink });
