/* global React, Icon, useStore, fmtPrice, Logo, Button, AppBar, Floral, ProductImage, ProductCard, SearchBar, CategoryPill, Stars, Avatar, BottomNav, IconBtn, EmptyState, PriceTag */

const { useState: uS3, useMemo: uM3, useRef: uR3, useEffect: uE3 } = React;

// ───────────────────── 13. CHAT LIST ─────────────────────
function ChatListScreen({ navigate }) {
  const { convos, shops } = useStore();
  const [q, setQ] = uS3('');
  const filtered = convos.filter(c => !q.trim() || c.userName.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="zr-screen">
      <AppBar title="Poruke" right={<button className="zr-iconbtn"><Icon name="edit" size={18}/></button>} />
      <div style={{ padding: '0 0 8px' }}>
        <SearchBar value={q} onChange={setQ} placeholder="Pretraži razgovore..." />
      </div>
      <div className="zr-scroll">
        {filtered.map(c => {
          const shop = shops.find(s => s.id === c.shopId);
          const last = c.messages[c.messages.length - 1];
          const lastText = last?.image ? '📷 Slika' : last?.text;
          return (
            <button key={c.id} onClick={() => navigate('chat', { id: c.id })} style={{
              width: '100%', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              borderBottom: '1px solid var(--zr-border-soft)',
            }}>
              <div style={{ position: 'relative' }}>
                <div className={`zr-img ${shop?.color || 'v2'}`} style={{ width: 50, height: 50, borderRadius: 999 }}><span style={{ fontSize: 7 }}> </span></div>
                {c.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 999, background: '#67c693', border: '2px solid var(--zr-cream)' }}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 14 }}>{c.userName}</span>
                  <span style={{ fontSize: 10, color: c.unread ? 'var(--zr-pink)' : 'var(--zr-gray-soft)', fontWeight: c.unread ? 700 : 400, flexShrink: 0 }}>{c.lastTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <div style={{ fontSize: 12, color: c.unread ? 'var(--zr-pink-dark)' : 'var(--zr-gray)', fontWeight: c.unread ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {last?.from === 'me' && <span style={{ color: 'var(--zr-gray-soft)' }}>Ti: </span>}{lastText}
                  </div>
                  {c.unread > 0 && <span className="zr-badge">{c.unread}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <BottomNav active="chat" onChange={(t) => navigate(t === 'home' ? 'home-buyer' : t === 'cart' ? 'cart' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-buyer' : t === 'search' ? 'search' : 'chat-list')} />
    </div>
  );
}

// ───────────────────── 14. CHAT ─────────────────────
function ChatScreen({ navigate, params }) {
  const { convos, shops, products, sendMessage, addReaction } = useStore();
  const convo = convos.find(c => c.id === params?.id) || convos[0];
  const shop = shops.find(s => s.id === convo.shopId);
  const [text, setText] = uS3('');
  const [typing, setTyping] = uS3(true);
  const [reactionFor, setReactionFor] = uS3(null);
  const [showQuick, setShowQuick] = uS3(false);
  const scrollRef = uR3(null);
  uE3(() => { scrollRef.current?.scrollTo(0, 99999); }, [convo.messages.length]);
  uE3(() => { const t = setTimeout(() => setTyping(false), 3000); return () => clearTimeout(t); }, []);

  const send = () => {
    sendMessage(convo.id, text);
    setText('');
  };

  const quickReplies = ['Hvala! 💕', 'Mogu li drugu boju?', 'Kada može isporuka?', 'Imate li još? 🌸'];

  return (
    <div className="zr-screen">
      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderBottom: '1px solid var(--zr-border-soft)', flexShrink: 0 }}>
        <button className="zr-iconbtn" onClick={() => navigate('chat-list')}><Icon name="back" size={18}/></button>
        <div className={`zr-img ${shop?.color || 'v2'}`} style={{ width: 38, height: 38, borderRadius: 999 }}><span style={{ fontSize: 7 }}> </span></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 14 }}>{convo.userName}</div>
          <div style={{ fontSize: 11, color: convo.online ? '#67c693' : 'var(--zr-gray-soft)' }}>{convo.online ? '● online' : 'pre 2h'}</div>
        </div>
        <button className="zr-iconbtn"><Icon name="phone" size={16}/></button>
        <button className="zr-iconbtn"><Icon name="info" size={16}/></button>
      </div>

      <div ref={scrollRef} className="zr-scroll" style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--zr-gray-soft)', margin: '4px 0 8px' }}>Danas</div>
        {convo.messages.map((m, i) => {
          const mine = m.from === 'me';
          const product = m.productCard ? products.find(p => p.id === m.productCard) : null;
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '76%', position: 'relative' }} onContextMenu={e => { e.preventDefault(); setReactionFor(m.id); }} onClick={() => setReactionFor(reactionFor === m.id ? null : m.id)}>
                {product && (
                  <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', marginBottom: 4, border: '1px solid var(--zr-border-soft)', maxWidth: 200, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigate('product', { id: product.id }); }}>
                    <ProductImage product={product} height={100}/>
                    <div style={{ padding: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--zr-pink-dark)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>{product.name}</div>
                      <PriceTag price={product.price}/>
                    </div>
                  </div>
                )}
                {m.image && (
                  <div className="zr-img v3" style={{ width: 180, height: 140, borderRadius: 16, marginBottom: 4 }}><span>{m.image}</span></div>
                )}
                {m.text && (
                  <div style={{
                    background: mine ? 'var(--zr-pink)' : 'white',
                    color: mine ? 'white' : 'var(--zr-pink-dark)',
                    padding: '10px 14px',
                    borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: 13, lineHeight: 1.4,
                    boxShadow: mine ? 'none' : '0 1px 4px rgba(160,68,90,0.08)',
                    border: mine ? 'none' : '1px solid var(--zr-border-soft)',
                    cursor: 'pointer',
                  }}>{m.text}</div>
                )}
                {m.reactions?.length > 0 && (
                  <div style={{ position: 'absolute', bottom: -10, [mine ? 'left' : 'right']: 4, background: 'white', borderRadius: 999, padding: '2px 8px', fontSize: 12, boxShadow: '0 2px 6px rgba(160,68,90,0.15)' }}>
                    {m.reactions.join('')}
                  </div>
                )}
                {mine && (
                  <div style={{ fontSize: 9, color: 'var(--zr-gray-soft)', textAlign: 'right', marginTop: 2 }}>
                    {m.time} <Icon name={m.read === false ? 'check' : 'check-double'} size={10} stroke="var(--zr-pink)"/>
                  </div>
                )}
                {!mine && <div style={{ fontSize: 9, color: 'var(--zr-gray-soft)', marginTop: 2 }}>{m.time}</div>}

                {reactionFor === m.id && (
                  <div onClick={e => e.stopPropagation()} style={{
                    position: 'absolute', top: -36, [mine ? 'right' : 'left']: 0,
                    background: 'white', borderRadius: 999, padding: '6px 8px',
                    boxShadow: '0 4px 14px rgba(160,68,90,0.18)',
                    display: 'flex', gap: 6, zIndex: 10,
                  }}>
                    {['❤️', '😍', '👍', '😂', '😮', '😢'].map(e => (
                      <button key={e} onClick={() => { addReaction(convo.id, m.id, e); setReactionFor(null); }} style={{
                        background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18, padding: 2,
                      }}>{e}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'white', padding: '10px 14px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4, alignItems: 'center', border: '1px solid var(--zr-border-soft)' }}>
              <span className="zr-typingdot"/><span className="zr-typingdot"/><span className="zr-typingdot"/>
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      {showQuick && (
        <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
          {quickReplies.map(q => (
            <button key={q} className="zr-chip" style={{ whiteSpace: 'nowrap' }} onClick={() => { sendMessage(convo.id, q); setShowQuick(false); }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: 10, background: 'white', display: 'flex', gap: 8, alignItems: 'flex-end', borderTop: '1px solid var(--zr-border-soft)', flexShrink: 0 }}>
        <button className="zr-iconbtn" onClick={() => setShowQuick(!showQuick)}><Icon name="sparkle" size={18}/></button>
        <button className="zr-iconbtn"><Icon name="image" size={18}/></button>
        <div style={{ flex: 1, position: 'relative' }}>
          <input className="zr-input" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Napiši poruku…" style={{ paddingRight: 44 }}/>
          <button onClick={() => {}} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--zr-gray-soft)' }}>
            <Icon name="smile" size={18}/>
          </button>
        </div>
        <button className="zr-iconbtn" onClick={send} style={{ background: text.trim() ? 'var(--zr-pink)' : 'var(--zr-pink-light)', color: text.trim() ? 'white' : 'var(--zr-pink-dark)', borderColor: 'transparent' }}>
          <Icon name="send" size={18}/>
        </button>
      </div>
    </div>
  );
}

// ───────────────────── 6. HOME SELLER ─────────────────────
function HomeSellerScreen({ navigate }) {
  const { products, orders } = useStore();
  const myProducts = products.filter(p => p.shopId === 's1');
  return (
    <div className="zr-screen">
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 26, color: 'var(--zr-pink-dark)', lineHeight: 0.9 }}>Zdravo, Mila</div>
          <div style={{ fontSize: 12 }}>Mila & Konac · 412 prati 🌸</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn icon="bell" badge="3"/>
          <IconBtn icon="settings"/>
        </div>
      </div>
      <div className="zr-scroll" style={{ padding: '8px 16px 24px' }}>
        {/* Stats */}
        <div style={{ background: 'linear-gradient(120deg, var(--zr-pink) 0%, var(--zr-pink-dark) 100%)', borderRadius: 22, padding: 18, color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -10, fontSize: 90, opacity: 0.15 }}>💕</div>
          <div style={{ fontSize: 11, opacity: 0.8, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.1em' }}>OVE NEDELJE</div>
          <div style={{ fontSize: 36, fontWeight: 700, marginTop: 4, fontFamily: 'var(--zr-font-script)' }}>24 800 RSD</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>↑ 18% u odnosu na prošlu</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            <div><div style={{ fontSize: 18, fontWeight: 700 }}>7</div><div style={{ fontSize: 10, opacity: 0.8 }}>porudžbina</div></div>
            <div><div style={{ fontSize: 18, fontWeight: 700 }}>34</div><div style={{ fontSize: 10, opacity: 0.8 }}>poseta</div></div>
            <div><div style={{ fontSize: 18, fontWeight: 700 }}>4.9</div><div style={{ fontSize: 10, opacity: 0.8 }}>prosek</div></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {[
            { icon: 'plus', label: 'Dodaj proizvod', color: '#F4D5DC', action: () => navigate('add-product') },
            { icon: 'package', label: '3 nove porudžbine', color: '#F5DDD2' },
            { icon: 'chat', label: '2 nove poruke', color: '#E8C9D2', action: () => navigate('chat-list') },
            { icon: 'chart', label: 'Statistika', color: '#F8D8D8' },
          ].map(c => (
            <button key={c.label} onClick={c.action} className="zr-card" style={{ padding: 14, border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink-dark)' }}><Icon name={c.icon} size={16}/></div>
              <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{c.label}</div>
            </button>
          ))}
        </div>

        <div className="zr-section-h" style={{ padding: '0', margin: '20px 0 10px' }}><h3>Najnovije porudžbine</h3><span className="zr-link">Sve →</span></div>
        {orders.slice(0, 2).map(o => (
          <div key={o.id} className="zr-card" style={{ padding: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name="Marija K." size={38} color="#F4D5DC"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{o.id} · Marija K.</div>
              <div style={{ fontSize: 11 }}>{o.items.length} predmeta · {fmtPrice(o.total)}</div>
            </div>
            <Button variant="soft" style={{ padding: '8px 12px', fontSize: 11 }}>Pogledaj</Button>
          </div>
        ))}

        <div className="zr-section-h" style={{ padding: '0', margin: '20px 0 10px' }}><h3>Moji proizvodi</h3><span className="zr-link">Upravljaj →</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {myProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} hideShop onClick={() => navigate('product', { id: p.id })}/>)}
        </div>
      </div>
      <BottomNav role="seller" active="home" onChange={(t) => navigate(t === 'home' ? 'home-seller' : t === 'add' ? 'add-product' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-seller' : t === 'orders' ? 'orders' : 'home-seller')} />
    </div>
  );
}

// ───────────────────── 12. ADD PRODUCT ─────────────────────
function AddProductScreen({ navigate }) {
  const { categories, showToast } = useStore();
  const [name, setName] = uS3('');
  const [price, setPrice] = uS3('');
  const [cat, setCat] = uS3(null);
  const [desc, setDesc] = uS3('');
  const [imgs, setImgs] = uS3([true, false, false, false]);
  return (
    <div className="zr-screen">
      <AppBar back onBack={() => navigate('home-seller')} title="Novi proizvod" right={<button className="zr-iconbtn"><Icon name="check" size={18} stroke="var(--zr-pink)"/></button>} />
      <div className="zr-scroll" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--zr-pink-dark)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Slike (max 6)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {imgs.map((has, i) => (
            <button key={i} onClick={() => { const n = [...imgs]; n[i] = !n[i]; setImgs(n); }} style={{
              aspectRatio: 1, borderRadius: 12, border: 'none', cursor: 'pointer', padding: 0, position: 'relative',
              background: has ? undefined : 'var(--zr-pink-light)',
              fontFamily: 'inherit',
            }}>
              {has ? (
                <div className="zr-img v2" style={{ width: '100%', height: '100%', borderRadius: 12 }}><span style={{ fontSize: 8 }}>slika {i+1}</span></div>
              ) : (
                <Icon name="plus" size={20} stroke="var(--zr-pink)"/>
              )}
              {i === 0 && has && <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'var(--zr-pink-dark)', color: 'white', fontSize: 9, padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>Glavna</span>}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Naziv proizvoda</label>
            <input className="zr-input" value={name} onChange={e => setName(e.target.value)} placeholder="npr. Pleteni šal — boja zalaska"/>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Cena (RSD)</label>
              <input className="zr-input" value={price} onChange={e => setPrice(e.target.value)} placeholder="3 200"/>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Količina</label>
              <input className="zr-input" placeholder="5"/>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Kategorija</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => (
                <button key={c.id} className={`zr-chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>{c.emoji} {c.name}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Opis</label>
            <textarea className="zr-input" rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Materijal, dimenzije, način održavanja..." style={{ resize: 'none', fontFamily: 'inherit' }}/>
          </div>
          <Button full style={{ marginTop: 8 }} onClick={() => { showToast('Proizvod sačuvan 🌸'); setTimeout(() => navigate('home-seller'), 600); }}>Objavi proizvod</Button>
          <button className="zr-btn zr-btn-ghost" style={{ width: '100%' }}>Sačuvaj kao nacrt</button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────── 17. PROFILE SELLER ─────────────────────
function ProfileSellerScreen({ navigate }) {
  const items = [
    { icon: 'paint', label: 'Uredi radnju', sub: 'Cover, opis, lokacija' },
    { icon: 'package', label: 'Proizvodi', sub: '12 aktivnih · 2 nacrta' },
    { icon: 'chart', label: 'Statistika', sub: 'Prodaja, posete, prati' },
    { icon: 'tag', label: 'Promocije', sub: 'Akcije, kuponi' },
    { icon: 'truck', label: 'Dostava', sub: 'Adrese, načini' },
    { icon: 'shield', label: 'Privatnost', sub: 'Lozinka, blokirani' },
  ];
  return (
    <div className="zr-screen">
      <AppBar title="Moj profil" right={<button className="zr-iconbtn"><Icon name="settings" size={18}/></button>} />
      <div className="zr-scroll" style={{ padding: '0 16px' }}>
        <div className="zr-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(120deg, white, var(--zr-pink-light))' }}>
          <Avatar name="Mila Petrović" size={56} color="#F8D8D8"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--zr-font-script)', fontSize: 22, color: 'var(--zr-pink-dark)', lineHeight: 1 }}>Mila & Konac</div>
            <div style={{ fontSize: 12 }}>Novi Sad · vlasnica Mila</div>
            <div style={{ marginTop: 4, fontSize: 11, color: 'var(--zr-pink)', fontWeight: 600 }}>✨ Verifikovana majstorica</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 12 }}>
          {[['412', 'prati'], ['187', 'recenzija'], ['4.9', 'prosek'], ['76', 'prodato']].map(([n, l]) => (
            <div key={l} className="zr-card" style={{ padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--zr-pink-dark)' }}>{n}</div>
              <div style={{ fontSize: 10 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          {items.map(it => (
            <button key={it.label} className="zr-card" style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2,
              border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', boxShadow: 'none', background: 'transparent', width: '100%',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--zr-pink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink-dark)', flexShrink: 0 }}><Icon name={it.icon} size={16}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{it.label}</div>
                <div style={{ fontSize: 11 }}>{it.sub}</div>
              </div>
              <Icon name="chevron" size={16} stroke="var(--zr-gray-soft)"/>
            </button>
          ))}
        </div>

        <button className="zr-btn zr-btn-ghost" style={{ width: '100%', marginTop: 16, color: 'var(--zr-pink)' }} onClick={() => navigate('landing')}><Icon name="logout" size={16}/> Odjavi se</button>
        <div style={{ height: 24 }} />
      </div>
      <BottomNav role="seller" active="profile" onChange={(t) => navigate(t === 'home' ? 'home-seller' : t === 'add' ? 'add-product' : t === 'chat' ? 'chat-list' : t === 'profile' ? 'profile-seller' : t === 'orders' ? 'orders' : 'profile-seller')} />
    </div>
  );
}

// ───────────────────── 18. ADMIN ─────────────────────
function AdminScreen({ navigate }) {
  const stats = [
    { label: 'Korisnice', n: '1 247', delta: '+24', color: '#F4D5DC' },
    { label: 'Radnje', n: '186', delta: '+8', color: '#F5DDD2' },
    { label: 'Proizvodi', n: '3 412', delta: '+89', color: '#E8C9D2' },
    { label: 'Porudžbine', n: '527', delta: '+47', color: '#F8D8D8' },
  ];
  const reports = [
    { type: 'product', title: 'Sumnjiv proizvod prijavljen', sub: 'Korisnica @ana_b prijavila p4823', time: 'pre 1h', urgent: true },
    { type: 'user', title: 'Zahtev za verifikaciju', sub: 'Mila Petrović — Mila & Konac', time: 'pre 3h' },
    { type: 'review', title: 'Recenzija za pregled', sub: 'Mogući govor mržnje', time: 'pre 6h', urgent: true },
    { type: 'shop', title: 'Nova radnja čeka odobrenje', sub: 'Ana Jovanović — Anin Vez', time: 'juče' },
  ];
  return (
    <div className="zr-screen">
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid var(--zr-border-soft)' }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--zr-font-mono)', letterSpacing: '0.15em', color: 'var(--zr-pink)' }}>ADMIN PANEL</div>
          <h1 style={{ fontSize: 18 }}>Zlatne Ruke</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn icon="bell" badge="2"/>
          <IconBtn icon="settings"/>
        </div>
      </div>

      <div className="zr-scroll" style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--zr-gray)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pregled platforme</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map(s => (
            <div key={s.label} className="zr-card" style={{ padding: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: s.color }}/>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--zr-pink-dark)', marginTop: 8 }}>{s.n}</div>
              <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.label}</span>
                <span style={{ color: '#67c693', fontWeight: 700 }}>{s.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--zr-gray)', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prijave & zahtevi</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reports.map((r, i) => (
            <div key={i} className="zr-card" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', borderLeft: r.urgent ? '3px solid var(--zr-pink)' : '3px solid transparent' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--zr-pink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zr-pink-dark)' }}>
                <Icon name={r.type === 'product' ? 'package' : r.type === 'user' ? 'user' : r.type === 'review' ? 'star' : 'shield'} size={16}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--zr-pink-dark)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.urgent && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--zr-pink)' }}/>}
                  {r.title}
                </div>
                <div style={{ fontSize: 11 }}>{r.sub}</div>
              </div>
              <span style={{ fontSize: 10, color: 'var(--zr-gray-soft)', flexShrink: 0 }}>{r.time}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--zr-gray)', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Brze akcije</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[['user', 'Korisnice'], ['package', 'Proizvodi'], ['shield', 'Moderacija'], ['chart', 'Izveštaji']].map(([icon, l]) => (
            <button key={l} className="zr-card" style={{ padding: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', textAlign: 'left' }}>
              <Icon name={icon} size={18} stroke="var(--zr-pink)"/>
              <span style={{ fontWeight: 600, color: 'var(--zr-pink-dark)', fontSize: 13 }}>{l}</span>
            </button>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

Object.assign(window, { ChatListScreen, ChatScreen, HomeSellerScreen, AddProductScreen, ProfileSellerScreen, AdminScreen });
