/* global React, useWStore, useRoute, navigate, wFmtPrice, Icon, Page, ProductCardW, SectionHeader, Crumbs */
const { useState, useEffect, useRef } = React;

// ─── CART ───
function CartPage() {
  const { cart, products, shops, updateCartQty, removeFromCart } = useWStore();

  const items = cart.map(c => ({ ...c, product: products.find(p => p.id === c.productId) })).filter(x => x.product);
  const grouped = {};
  items.forEach(i => {
    const sid = i.product.shopId;
    if (!grouped[sid]) grouped[sid] = [];
    grouped[sid].push(i);
  });
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return <Page><div className="zw-container" style={{ padding: '80px 32px', textAlign: 'center' }}>
      <div style={{ fontSize: 64 }}>🌸</div>
      <h1 style={{ fontSize: 36, marginTop: 16 }}>Korpa je prazna</h1>
      <p style={{ marginTop: 12, color: 'var(--zr-gray)' }}>Pronađi nešto lepo i vrati se ovde.</p>
      <button className="zw-btn zw-btn-primary zw-btn-lg" style={{ marginTop: 28 }} onClick={() => navigate('/katalog')}>Istraži katalog →</button>
    </div></Page>;
  }

  return (
    <Page>
      <div className="zw-container">
        <Crumbs items={[{ label: 'Početna', href: '/' }, { label: 'Korpa' }]} />
        <h1 style={{ fontSize: 48, marginTop: 8, marginBottom: 32 }}>Tvoja korpa <span style={{ fontSize: 20, color: 'var(--zr-gray)', fontWeight: 500 }}>({items.length})</span></h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, paddingBottom: 80 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {Object.entries(grouped).map(([sid, gItems]) => {
              const shop = shops.find(s => s.id === sid);
              return (
                <div key={sid} className="zw-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--zr-border-soft)' }}>
                    <div className={`zw-img ${shop.color}`} style={{ width: 36, height: 36, borderRadius: 10, fontSize: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{shop.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>{shop.city} · stiže za 2–4 dana</div>
                    </div>
                  </div>
                  {gItems.map(i => (
                    <div key={i.productId} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--zr-border-soft)' }}>
                      <div className={`zw-img ${i.product.color}`} style={{ width: 120, height: 100, borderRadius: 12, fontSize: 0, cursor: 'pointer' }} onClick={() => navigate('/proizvod/' + i.productId)}>
                        <span>{i.product.img}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--zr-pink-dark)', cursor: 'pointer' }} onClick={() => navigate('/proizvod/' + i.productId)}>{i.product.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--zr-gray)', marginTop: 4 }}>{wFmtPrice(i.product.price)} po komadu</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--zr-border)', borderRadius: 999 }}>
                            <button onClick={() => updateCartQty(i.productId, i.qty - 1)} style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--zr-pink-dark)' }}><Icon name="minus" size={12} /></button>
                            <div style={{ width: 32, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{i.qty}</div>
                            <button onClick={() => updateCartQty(i.productId, i.qty + 1)} style={{ width: 32, height: 32, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--zr-pink-dark)' }}><Icon name="plus" size={12} /></button>
                          </div>
                          <button onClick={() => removeFromCart(i.productId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--zr-gray)', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>Ukloni</button>
                        </div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--zr-pink-dark)', textAlign: 'right' }}>{wFmtPrice(i.product.price * i.qty)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside style={{ position: 'sticky', top: 130, alignSelf: 'start' }}>
            <div className="zw-card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 22, marginBottom: 20 }}>Pregled</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Row l="Međuzbir" v={wFmtPrice(subtotal)} />
                <Row l="Dostava" v={shipping === 0 ? <span style={{ color: 'var(--zr-pink)' }}>Besplatna 🌸</span> : wFmtPrice(shipping)} />
                {shipping > 0 && <div style={{ padding: 12, background: 'var(--zr-pink-light)', borderRadius: 10, fontSize: 12, color: 'var(--zr-pink-dark)' }}>Dodaj još {wFmtPrice(5000 - subtotal)} za besplatnu dostavu</div>}
                <hr className="zw-divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--zr-pink-dark)' }}>Ukupno</span>
                  <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(total)}</span>
                </div>
              </div>
              <button className="zw-btn zw-btn-primary zw-btn-lg" style={{ width: '100%', marginTop: 24 }} onClick={() => navigate('/checkout')}>Idi na plaćanje →</button>
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--zr-gray)', textAlign: 'center' }}>🔒 Sigurno plaćanje · Visa, Mastercard, Pouzeće</div>
            </div>
          </aside>
        </div>
      </div>
    </Page>
  );
}

function Row({ l, v }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ color: 'var(--zr-gray)' }}>{l}</span><span style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{v}</span></div>;
}

// ─── CHECKOUT ───
function CheckoutPage() {
  const { cart, products, placeOrder } = useWStore();
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState('card');
  const subtotal = cart.reduce((s, c) => s + (products.find(p => p.id === c.productId)?.price || 0) * c.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  const submit = () => {
    placeOrder();
    navigate('/profil/porudzbine');
  };

  return (
    <Page footer={false}>
      <div className="zw-container" style={{ padding: '32px 32px 80px' }}>
        <Crumbs items={[{ label: 'Korpa', href: '/korpa' }, { label: 'Plaćanje' }]} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48 }}>
          <div>
            <h1 style={{ fontSize: 40, marginBottom: 32 }}>Plaćanje</h1>

            {/* Stepper */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
              {['Adresa', 'Dostava', 'Plaćanje'].map((s, i) => (
                <div key={s} style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: step >= i+1 ? 'var(--zr-pink-light)' : 'var(--zr-cream)', border: step === i+1 ? '1.5px solid var(--zr-pink)' : '1.5px solid transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 999, background: step >= i+1 ? 'var(--zr-pink)' : 'white', color: step >= i+1 ? 'white' : 'var(--zr-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i+1}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)' }}>{s}</span>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="zw-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 18, marginBottom: 20 }}>Adresa za dostavu</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Ime" defaultValue="Marija" />
                  <Field label="Prezime" defaultValue="Kovačević" />
                  <Field label="Email" defaultValue="marija@gmail.com" full />
                  <Field label="Telefon" defaultValue="+381 64 123 4567" full />
                  <Field label="Adresa" defaultValue="Kralja Petra 12" full />
                  <Field label="Grad" defaultValue="Beograd" />
                  <Field label="Poštanski broj" defaultValue="11000" />
                </div>
                <button className="zw-btn zw-btn-primary zw-btn-lg" style={{ marginTop: 24 }} onClick={() => setStep(2)}>Dalje →</button>
              </div>
            )}

            {step === 2 && (
              <div className="zw-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 18, marginBottom: 20 }}>Način dostave</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Choice icon="🚚" t="Standardna" d="2–4 dana" price={shipping === 0 ? 'Besplatno' : '350 RSD'} active />
                  <Choice icon="⚡" t="Ekspres" d="24h, samo BG i NS" price="600 RSD" />
                  <Choice icon="🏪" t="Preuzmi u radnji" d="Lokalno" price="Besplatno" />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button className="zw-btn zw-btn-ghost" onClick={() => setStep(1)}>← Nazad</button>
                  <button className="zw-btn zw-btn-primary zw-btn-lg" style={{ flex: 1 }} onClick={() => setStep(3)}>Dalje →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="zw-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 18, marginBottom: 20 }}>Način plaćanja</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Choice icon="💳" t="Kartica" d="Visa, Mastercard" price="" active={pay === 'card'} onClick={() => setPay('card')} />
                  <Choice icon="📦" t="Pouzeće" d="Plati pri dostavi (+50 RSD)" price="" active={pay === 'cod'} onClick={() => setPay('cod')} />
                  <Choice icon="🏦" t="Uplatnica" d="Pošalji na email" price="" active={pay === 'bank'} onClick={() => setPay('bank')} />
                </div>
                {pay === 'card' && (
                  <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Broj kartice" defaultValue="•••• •••• •••• 4242" full />
                    <Field label="Datum" defaultValue="12/27" />
                    <Field label="CVV" defaultValue="•••" />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <button className="zw-btn zw-btn-ghost" onClick={() => setStep(2)}>← Nazad</button>
                  <button className="zw-btn zw-btn-primary zw-btn-lg" style={{ flex: 1 }} onClick={submit}>Naruči — {wFmtPrice(total)} 🌸</button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside style={{ position: 'sticky', top: 130, alignSelf: 'start' }}>
            <div className="zw-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>Tvoja porudžbina</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {cart.map(c => {
                  const p = products.find(p => p.id === c.productId);
                  if (!p) return null;
                  return (
                    <div key={c.productId} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className={`zw-img ${p.color}`} style={{ width: 56, height: 56, borderRadius: 10, fontSize: 0, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--zr-pink-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--zr-gray)' }}>×{c.qty}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(p.price * c.qty)}</div>
                    </div>
                  );
                })}
              </div>
              <hr className="zw-divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
                <Row l="Međuzbir" v={wFmtPrice(subtotal)} />
                <Row l="Dostava" v={shipping === 0 ? 'Besplatna' : wFmtPrice(shipping)} />
              </div>
              <hr className="zw-divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
                <span style={{ fontWeight: 600, color: 'var(--zr-pink-dark)' }}>Ukupno</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{wFmtPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Page>
  );
}

function Field({ label, defaultValue, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-gray)', display: 'block', marginBottom: 6 }}>{label}</label>
      <input className="zw-input" defaultValue={defaultValue} />
    </div>
  );
}

function Choice({ icon, t, d, price, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, background: active ? 'var(--zr-pink-light)' : 'white', border: `1.5px solid ${active ? 'var(--zr-pink)' : 'var(--zr-border)'}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{t}</div>
        <div style={{ fontSize: 12, color: 'var(--zr-gray)' }}>{d}</div>
      </div>
      {price && <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{price}</div>}
      {active && <div style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--zr-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icon name="check" size={14} /></div>}
    </button>
  );
}

Object.assign(window, { CartPage, CheckoutPage, Field, Choice, Row });
