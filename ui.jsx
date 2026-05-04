/* global React, Icon, useStore, fmtPrice */
// Zlatne Ruke — shared UI primitives

const PriceTag = ({ price, oldPrice, size = 'md' }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
    <span style={{ color: 'var(--zr-pink-dark)', fontWeight: 700, fontSize: size === 'lg' ? 22 : 15 }}>{fmtPrice(price)}</span>
    {oldPrice && <span style={{ color: 'var(--zr-gray-soft)', fontSize: 12, textDecoration: 'line-through' }}>{fmtPrice(oldPrice)}</span>}
  </div>
);

const Stars = ({ rating, size = 12, showNum = false, count }) => (
  <span className="zr-stars" style={{ color: '#E8B547' }}>
    {[1,2,3,4,5].map(i => (
      <Icon key={i} name={i <= Math.round(rating) ? 'star-fill' : 'star'} size={size} />
    ))}
    {showNum && <span style={{ marginLeft: 4, color: 'var(--zr-pink-dark)', fontWeight: 600, fontSize: size }}>{rating.toFixed(1)}</span>}
    {count != null && <span style={{ marginLeft: 4, color: 'var(--zr-gray-soft)', fontSize: 11 }}>({count})</span>}
  </span>
);

const ProductImage = ({ product, height = 140, color }) => (
  <div className={`zr-img ${color || product.color || ''}`} style={{ height, width: '100%' }}>
    <span>{product.img}</span>
  </div>
);

const Button = ({ children, variant = 'primary', icon, iconRight, full, onClick, style, ...rest }) => (
  <button onClick={onClick} className={`zr-btn zr-btn-${variant}`} style={{ width: full ? '100%' : undefined, ...style }} {...rest}>
    {icon && <Icon name={icon} size={16} />}
    {children}
    {iconRight && <Icon name={iconRight} size={16} />}
  </button>
);

const IconBtn = ({ icon, onClick, badge, size = 38, style }) => (
  <button className="zr-iconbtn" onClick={onClick} style={{ width: size, height: size, ...style, position: 'relative' }}>
    <Icon name={icon} size={18} />
    {badge ? <span className="zr-badge" style={{ position: 'absolute', top: -2, right: -2 }}>{badge}</span> : null}
  </button>
);

// Bottom navigation
function BottomNav({ active, onChange, role = 'buyer' }) {
  const buyer = [
    { id: 'home', icon: 'home', label: 'Početna' },
    { id: 'search', icon: 'search', label: 'Pretraga' },
    { id: 'cart', icon: 'bag', label: 'Korpa' },
    { id: 'chat', icon: 'chat', label: 'Poruke' },
    { id: 'profile', icon: 'user', label: 'Profil' },
  ];
  const seller = [
    { id: 'home', icon: 'home', label: 'Radnja' },
    { id: 'add', icon: 'plus', label: 'Dodaj' },
    { id: 'orders', icon: 'package', label: 'Porudžbine' },
    { id: 'chat', icon: 'chat', label: 'Poruke' },
    { id: 'profile', icon: 'user', label: 'Profil' },
  ];
  const items = role === 'seller' ? seller : buyer;
  const { cart, convos } = useStore() || { cart: [], convos: [] };
  const cartCount = cart?.reduce((s, c) => s + c.qty, 0) || 0;
  const unread = convos?.reduce((s, c) => s + (c.unread || 0), 0) || 0;
  return (
    <nav className="zr-bottomnav">
      {items.map(it => (
        <button key={it.id} className={`zr-bottomnav-item ${active === it.id ? 'active' : ''}`} onClick={() => onChange?.(it.id)}>
          <span className="zr-nav-icon-wrap" style={{ position: 'relative' }}>
            <Icon name={it.icon} size={20} />
            {it.id === 'cart' && cartCount > 0 && <span className="zr-badge" style={{ position: 'absolute', top: -2, right: -2 }}>{cartCount}</span>}
            {it.id === 'chat' && unread > 0 && <span className="zr-badge" style={{ position: 'absolute', top: -2, right: -2 }}>{unread}</span>}
          </span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

// AppBar
function AppBar({ title, back, onBack, right, transparent, subtitle }) {
  return (
    <div className="zr-appbar" style={{ background: transparent ? 'transparent' : 'var(--zr-cream)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        {back && <button className="zr-iconbtn" onClick={onBack}><Icon name="back" size={18} /></button>}
        <div style={{ minWidth: 0 }}>
          {title && <h2 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h2>}
          {subtitle && <div style={{ fontSize: 11, color: 'var(--zr-gray-soft)', marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>{right}</div>
    </div>
  );
}

// Toast (auto-shown from store)
function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return <div className="zr-toast" key={toast}>{toast}</div>;
}

// Decorative scallop
const Scallop = ({ color = 'var(--zr-cream)' }) => (
  <svg width="100%" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" style={{ display: 'block' }}>
    <path d="M0,14 L0,7 Q5,0 10,7 T20,7 T30,7 T40,7 T50,7 T60,7 T70,7 T80,7 T90,7 T100,7 T110,7 T120,7 T130,7 T140,7 T150,7 T160,7 T170,7 T180,7 T190,7 T200,7 L200,14 Z" fill={color}/>
  </svg>
);

// Floral SVG accent
const Floral = ({ size = 24, color = 'var(--zr-pink)', opacity = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }}>
    <g fill={color}>
      <circle cx="12" cy="12" r="2.5"/>
      <ellipse cx="12" cy="6" rx="2.2" ry="3.2"/>
      <ellipse cx="12" cy="18" rx="2.2" ry="3.2"/>
      <ellipse cx="6" cy="12" rx="3.2" ry="2.2"/>
      <ellipse cx="18" cy="12" rx="3.2" ry="2.2"/>
    </g>
  </svg>
);

// Brand logo — script word
const Logo = ({ size = 28, color = 'var(--zr-pink-dark)' }) => (
  <span style={{ fontFamily: 'var(--zr-font-script)', fontSize: size, fontWeight: 700, color, letterSpacing: '-0.01em', lineHeight: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    <span style={{ display: 'inline-block', transform: 'translateY(-2px)' }}>🌸</span>
    Zlatne Ruke
  </span>
);

// Avatar
const Avatar = ({ name, size = 40, online, color }) => {
  const initials = (name || '??').split(' ').map(s => s[0]).slice(0, 2).join('');
  return (
    <div className={`zr-avatar ${online ? 'online' : ''}`} style={{ width: size, height: size, fontSize: size * 0.36, background: color || undefined }}>
      {initials}
    </div>
  );
};

// ProductCard
function ProductCard({ product, onClick, compact, hideShop }) {
  const { favorites, toggleFav, shops } = useStore();
  const isFav = favorites.has(product.id);
  const shop = shops.find(s => s.id === product.shopId);
  return (
    <div className="zr-card" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <ProductImage product={product} height={compact ? 120 : 150} />
        <button onClick={e => { e.stopPropagation(); toggleFav(product.id); }} style={{
          position: 'absolute', top: 8, right: 8,
          width: 32, height: 32, borderRadius: 999,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isFav ? 'var(--zr-pink)' : 'var(--zr-gray-soft)',
        }}>
          <Icon name={isFav ? 'heart-fill' : 'heart'} size={16} />
        </button>
        {product.oldPrice && <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--zr-pink)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)', lineHeight: 1.3, marginBottom: 4, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
          {product.name}
        </div>
        {!hideShop && shop && (
          <div style={{ fontSize: 11, color: 'var(--zr-gray-soft)', marginBottom: 6, fontStyle: 'italic' }}>od {shop.name}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <PriceTag price={product.price} oldPrice={product.oldPrice} />
          <Stars rating={product.rating} size={10} />
        </div>
      </div>
    </div>
  );
}

// Search bar
function SearchBar({ value, onChange, onSubmit, placeholder = 'Pretraži rukotvorine...', onFilter }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Icon name="search" size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--zr-gray-soft)' }} />
        <input
          className="zr-input"
          style={{ paddingLeft: 38 }}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit?.()}
          placeholder={placeholder}
        />
      </div>
      {onFilter && (
        <button className="zr-iconbtn" onClick={onFilter} style={{ width: 46, height: 46 }}>
          <Icon name="sliders" size={18} />
        </button>
      )}
    </div>
  );
}

// Empty state
const EmptyState = ({ icon = 'flower', title, sub, action }) => (
  <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--zr-gray)' }}>
    <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--zr-pink-light)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink)' }}>
      <Icon name={icon} size={28} />
    </div>
    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--zr-pink-dark)', marginBottom: 6 }}>{title}</div>
    {sub && <div style={{ fontSize: 13, marginBottom: 18 }}>{sub}</div>}
    {action}
  </div>
);

const CategoryPill = ({ category, active, onClick }) => (
  <button className={`zr-chip ${active ? 'active' : ''}`} onClick={onClick} style={{ flexDirection: 'column', height: 'auto', padding: '10px 4px', minWidth: 72, gap: 4 }}>
    <span style={{ fontSize: 22 }}>{category.emoji}</span>
    <span style={{ fontSize: 11 }}>{category.name}</span>
  </button>
);

Object.assign(window, {
  PriceTag, Stars, ProductImage, Button, IconBtn, BottomNav, AppBar, Toast,
  Scallop, Floral, Logo, Avatar, ProductCard, SearchBar, EmptyState, CategoryPill,
});
