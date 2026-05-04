/* global React, Icon, useStore, fmtPrice, Logo, Button, AppBar, Floral, ProductImage, ProductCard, SearchBar, CategoryPill, Stars, Avatar, BottomNav, IconBtn, EmptyState, PriceTag */

const { useState, useEffect, useRef, useMemo } = React;

// ───────────────────── 1. LANDING ─────────────────────
function LandingScreen({ navigate }) {
  return (
    <div className="zr-screen" style={{ background: 'linear-gradient(180deg, #FDF6F0 0%, #FBE7EC 70%, #F5DDD2 100%)' }}>
      <div style={{ position: 'absolute', top: 200, left: 14, opacity: 0.35 }}><Floral size={24} /></div>
      <div style={{ position: 'absolute', top: 240, right: 14, opacity: 0.45 }}><Floral size={36} color="var(--zr-pink-dark)" /></div>
      <div style={{ position: 'absolute', bottom: 220, left: 8, opacity: 0.3 }}><Floral size={22} /></div>
      <div style={{ position: 'absolute', bottom: 160, right: 16, opacity: 0.28 }}><Floral size={28} /></div>

      <div className="zr-scroll" style={{ display: 'flex', flexDirection: 'column', padding: '60px 24px 24px' }}>
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Logo size={42} />
        </div>

        {/* Hero image */}
        <div style={{
          marginTop: 32, height: 280, borderRadius: 24, overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(135deg, #F4D5DC 0%, #E8C9D2 60%, #D8A8B6 100%)',
          boxShadow: 'var(--zr-shadow-lg)',
        }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 64 }}>🌸</div>
            <div style={{ fontFamily: 'var(--zr-font-mono)', fontSize: 11, color: 'rgba(160,68,90,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', background: 'rgba(255,255,255,0.6)', padding: '4px 10px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>žene · zanati · srbija</div>
          </div>
          <div style={{ position: 'absolute', top: 16, left: 16, background: 'white', borderRadius: 999, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--zr-pink-dark)', boxShadow: 'var(--zr-shadow-sm)' }}>
            <Icon name="sparkle" size={12} /> 200+ majstorica
          </div>
        </div>

        <h1 style={{ fontSize: 28, lineHeight: 1.15, marginTop: 32, textAlign: 'center', textWrap: 'balance' }}>
          Kad žena stvara srcem,<br/>
          <span style={{ fontFamily: 'var(--zr-font-script)', fontSize: 38, fontWeight: 600 }}>nastaje magija</span>
        </h1>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14, padding: '0 8px' }}>
          Pronađi jedinstvene ručno rađene predmete direktno od lokalnih majstorica.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 32 }}>
          <Button full onClick={() => navigate('register-buyer')}>Kupuj rukotvorine 🛍️</Button>
          <Button variant="ghost" full onClick={() => navigate('register-seller')}>Otvori radnju ✨</Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13 }}>
          Već imaš nalog? <span onClick={() => navigate('login')} style={{ color: 'var(--zr-pink)', fontWeight: 600, cursor: 'pointer' }}>Prijavi se</span>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 22, fontSize: 10.5, color: 'var(--zr-gray)', whiteSpace: 'nowrap' }}>
          <span style={{ whiteSpace: 'nowrap' }}>🌸 besplatno</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ whiteSpace: 'nowrap' }}>💕 sigurno</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ whiteSpace: 'nowrap' }}>✨ srpski</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────── 2. LOGIN ─────────────────────
function LoginScreen({ navigate }) {
  const { setRole, setAuthed } = useStore();
  const [email, setEmail] = useState('mila@zlatneruke.rs');
  const [pw, setPw] = useState('••••••••');
  const [showPw, setShowPw] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const submit = () => {
    setAuthed(true);
    setRole('buyer');
    navigate('home-buyer');
  };

  return (
    <div className="zr-screen">
      <AppBar back onBack={() => navigate('landing')} title="" transparent />
      <div className="zr-scroll" style={{ padding: '8px 24px 24px' }}>
        <Logo size={32} />
        <h1 style={{ fontSize: 26, marginTop: 18 }}>Dobrodošla nazad 💕</h1>
        <p style={{ marginTop: 6 }}>Prijavi se na svoj nalog.</p>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Email</label>
            <input className="zr-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="ime@email.com" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Lozinka</label>
            <div style={{ position: 'relative' }}>
              <input className="zr-input" type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} style={{ paddingRight: 44 }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--zr-gray-soft)' }}>
                <Icon name={showPw ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span onClick={() => setForgot(true)} style={{ fontSize: 12, color: 'var(--zr-pink)', fontWeight: 600, cursor: 'pointer' }}>Zaboravljena lozinka?</span>
          </div>

          <Button full onClick={submit} icon="heart">Prijavi se</Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0 6px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--zr-border-soft)' }} />
            <span style={{ fontSize: 11, color: 'var(--zr-gray-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ili</span>
            <div style={{ flex: 1, height: 1, background: 'var(--zr-border-soft)' }} />
          </div>

          <button className="zr-btn zr-btn-ghost" style={{ width: '100%', background: 'white' }}>
            <span style={{ fontSize: 18 }}>🌐</span> Nastavi sa Google
          </button>

          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13 }}>
            Nemaš nalog? <span onClick={() => navigate('register-buyer')} style={{ color: 'var(--zr-pink)', fontWeight: 600, cursor: 'pointer' }}>Registruj se</span>
          </div>
        </div>
      </div>

      {forgot && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(160,68,90,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => { setForgot(false); setForgotSent(false); }}>
          <div onClick={e => e.stopPropagation()} className="zr-fadein" style={{ background: 'var(--zr-cream)', borderRadius: '24px 24px 0 0', padding: '24px 24px 32px', width: '100%' }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--zr-border)', margin: '0 auto 18px' }} />
            {forgotSent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 38 }}>💌</div>
                <h3 style={{ fontSize: 20, marginTop: 8 }}>Pogledaj email</h3>
                <p style={{ marginTop: 8, padding: '0 12px' }}>Poslali smo ti link za reset lozinke.</p>
                <Button full style={{ marginTop: 18 }} onClick={() => { setForgot(false); setForgotSent(false); }}>U redu</Button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 20 }}>Zaboravljena lozinka</h3>
                <p style={{ marginTop: 6, fontSize: 13 }}>Unesi email — poslaćemo ti link za reset.</p>
                <input className="zr-input" placeholder="ime@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} style={{ marginTop: 14 }} />
                <Button full style={{ marginTop: 14 }} onClick={() => setForgotSent(true)}>Pošalji link</Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────── 3. REGISTER BUYER ─────────────────────
function RegisterBuyerScreen({ navigate }) {
  const { setRole, setAuthed } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pref, setPref] = useState(new Set());
  const cats = ['Tekstil', 'Dekor', 'Nakit', 'Kozmetika', 'Hrana'];
  const togglePref = (c) => {
    const n = new Set(pref);
    n.has(c) ? n.delete(c) : n.add(c);
    setPref(n);
  };
  const finish = () => { setRole('buyer'); setAuthed(true); navigate('home-buyer'); };

  return (
    <div className="zr-screen">
      <AppBar back onBack={() => step === 1 ? navigate('landing') : setStep(s => s - 1)} title="" transparent right={<span style={{ fontSize: 12, color: 'var(--zr-gray-soft)', alignSelf: 'center', paddingRight: 8 }}>{step}/2</span>} />
      <div className="zr-scroll" style={{ padding: '8px 24px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {[1,2].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: s <= step ? 'var(--zr-pink)' : 'var(--zr-border)' }} />)}
        </div>

        {step === 1 ? (
          <>
            <h1 style={{ fontSize: 26 }}>Stvori nalog kupca 🛍️</h1>
            <p style={{ marginTop: 6 }}>Pronađi rukotvorine koje voliš.</p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Ime i prezime</label>
                <input className="zr-input" value={name} onChange={e => setName(e.target.value)} placeholder="Marija Petrović" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Email</label>
                <input className="zr-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="ime@email.com" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Lozinka</label>
                <input className="zr-input" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="min. 8 karaktera" />
              </div>
              <Button full style={{ marginTop: 8 }} onClick={() => setStep(2)}>Dalje <Icon name="forward" size={14}/></Button>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 26 }}>Šta te zanima? ✨</h1>
            <p style={{ marginTop: 6 }}>Izaberi kategorije za personalizovanu početnu stranu.</p>
            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {cats.map(c => (
                <button key={c} className={`zr-chip ${pref.has(c) ? 'active' : ''}`} onClick={() => togglePref(c)} style={{ padding: '12px 18px', fontSize: 14 }}>
                  {pref.has(c) && <Icon name="check" size={14} />} {c}
                </button>
              ))}
            </div>
            <Button full style={{ marginTop: 32 }} onClick={finish}>Završi 🌸</Button>
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--zr-gray-soft)', cursor: 'pointer' }} onClick={finish}>Preskoči za sada</div>
          </>
        )}
      </div>
    </div>
  );
}

// ───────────────────── 4. REGISTER SELLER ─────────────────────
function RegisterSellerScreen({ navigate }) {
  const { setRole, setAuthed } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');
  const [cat, setCat] = useState(null);
  const cats = [
    { id: 'tekstil', label: 'Tekstil & pletivo', emoji: '🧶' },
    { id: 'dekor', label: 'Dekor & sveće', emoji: '🕯️' },
    { id: 'nakit', label: 'Nakit', emoji: '💍' },
    { id: 'kozmetika', label: 'Prirodna kozmetika', emoji: '🌿' },
    { id: 'hrana', label: 'Domaća hrana', emoji: '🍯' },
  ];
  const finish = () => { setRole('seller'); setAuthed(true); navigate('home-seller'); };

  return (
    <div className="zr-screen">
      <AppBar back onBack={() => step === 1 ? navigate('landing') : setStep(s => s - 1)} title="" transparent right={<span style={{ fontSize: 12, color: 'var(--zr-gray-soft)', alignSelf: 'center', paddingRight: 8 }}>{step}/3</span>} />
      <div className="zr-scroll" style={{ padding: '8px 24px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {[1,2,3].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: s <= step ? 'var(--zr-pink)' : 'var(--zr-border)' }} />)}
        </div>

        {step === 1 && (
          <>
            <h1 style={{ fontSize: 26 }}>Otvori radnju ✨</h1>
            <p style={{ marginTop: 6 }}>Postani prodavac na Zlatne Ruke. Besplatno, zauvek.</p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Tvoje ime</label>
                <input className="zr-input" value={name} onChange={e => setName(e.target.value)} placeholder="Mila Petrović" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Email</label>
                <input className="zr-input" placeholder="ime@email.com" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Lozinka</label>
                <input className="zr-input" type="password" placeholder="min. 8 karaktera" />
              </div>
              <Button full style={{ marginTop: 8 }} onClick={() => setStep(2)}>Dalje</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontSize: 26 }}>Tvoja radnja 🌸</h1>
            <p style={{ marginTop: 6 }}>Daj joj ime koje opisuje tvoj zanat.</p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Naziv radnje</label>
                <input className="zr-input" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="npr. Mila & Konac" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--zr-pink-dark)', marginBottom: 6, display: 'block' }}>Grad</label>
                <input className="zr-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Beograd, Novi Sad..." />
              </div>
              <Button full style={{ marginTop: 8 }} onClick={() => setStep(3)}>Dalje</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ fontSize: 26 }}>Šta praviš? 💕</h1>
            <p style={{ marginTop: 6 }}>Izaberi glavnu kategoriju.</p>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cats.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 16, border: cat === c.id ? '2px solid var(--zr-pink)' : '1.5px solid var(--zr-border)',
                  background: cat === c.id ? 'var(--zr-pink-light)' : 'white',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}>
                  <span style={{ fontSize: 24 }}>{c.emoji}</span>
                  <span style={{ fontWeight: 600, color: 'var(--zr-pink-dark)', flex: 1 }}>{c.label}</span>
                  {cat === c.id && <Icon name="check" size={18} stroke="var(--zr-pink)" />}
                </button>
              ))}
            </div>
            <Button full style={{ marginTop: 24 }} onClick={finish}>Otvori radnju 🌸</Button>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LandingScreen, LoginScreen, RegisterBuyerScreen, RegisterSellerScreen });
