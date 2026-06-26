/* global React, ReactDOM, useRoute, navigate, WStoreProvider, useWStore,
   Homepage, HomepageB, HomepageC, Catalog, CatalogB, ProductPage, ShopPage,
   CartPage, CheckoutPage, ProfilePage, Magazin, StoryPage,
   SellerDashboard, AdminPanel, BecomeSeller, AuthPage,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakSlider, TweakSelect */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "homeVariant": "A",
  "catalogVariant": "A",
  "primaryColor": "#C0637A",
  "primaryDarkColor": "#A0445A",
  "creamColor": "#FDF6F0",
  "fontFamily": "DM Sans",
  "scriptFont": "Caveat",
  "density": "cozy",
  "scale": 100
}/*EDITMODE-END*/;

// Per-theme palette presets — applied automatically when theme changes,
// unless the user has actively edited the color tweaks.
const THEME_PALETTES = {
  light: { primaryColor: '#C0637A', primaryDarkColor: '#A0445A', creamColor: '#FDF6F0' },
  dark:  { primaryColor: '#D4A155', primaryDarkColor: '#E8BB6D', creamColor: '#14100F' },
};

function App() {
  const { path, parts } = useRoute();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Expose setTweak globally so in-page chrome (header theme toggle, etc.)
  // can update tweaks without needing context plumbing.
  React.useEffect(() => { window.__zrSetTweak = setTweak; }, [setTweak]);
  React.useEffect(() => { window.__zrTweaks = tweaks; }, [tweaks]);

  // Apply theme attribute (drives data-theme="dark" CSS overrides)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme || 'light');
  }, [tweaks.theme]);

  // apply CSS vars from tweaks. In dark mode we LET the CSS theme block own the
  // palette — only fonts + density are still tweakable, so we clear any prior
  // inline color overrides.
  useEffect(() => {
    const r = document.documentElement;
    if (tweaks.theme === 'dark') {
      r.style.removeProperty('--zr-pink');
      r.style.removeProperty('--zr-pink-dark');
      r.style.removeProperty('--zr-cream');
    } else {
      r.style.setProperty('--zr-pink', tweaks.primaryColor);
      r.style.setProperty('--zr-pink-dark', tweaks.primaryDarkColor);
      r.style.setProperty('--zr-cream', tweaks.creamColor);
    }
    r.style.setProperty('--zr-font', `'${tweaks.fontFamily}', system-ui, sans-serif`);
    r.style.setProperty('--zr-font-display', `'${tweaks.fontFamily}', system-ui, sans-serif`);
    r.style.setProperty('--zr-font-script', `'${tweaks.scriptFont}', cursive`);
    const densityMap = { compact: 0.85, cozy: 1.0, comfy: 1.18 };
    r.style.setProperty('--zr-density', densityMap[tweaks.density] || 1);
    r.style.fontSize = (tweaks.scale * 0.15) + 'px';
  }, [tweaks]);

  let page;
  const root = parts[0] || '';
  if (root === '' || root === 'home') {
    page = tweaks.homeVariant === 'B' ? <HomepageB /> : tweaks.homeVariant === 'C' ? <HomepageC /> : <Homepage />;
  } else if (root === 'katalog') {
    page = tweaks.catalogVariant === 'B' ? <CatalogB /> : <Catalog />;
  } else if (root === 'proizvod') {
    page = <ProductPage />;
  } else if (root === 'radnja') {
    page = <ShopPage />;
  } else if (root === 'korpa') {
    page = <CartPage />;
  } else if (root === 'checkout') {
    page = <CheckoutPage />;
  } else if (root === 'profil') {
    page = <ProfilePage />;
  } else if (root === 'magazin') {
    page = parts[1] ? <StoryPage /> : <Magazin />;
  } else if (root === 'prodavac') {
    page = <SellerDashboard />;
  } else if (root === 'admin') {
    page = <AdminPanel />;
  } else if (root === 'postani-prodavac') {
    page = <BecomeSeller />;
  } else if (root === 'login') {
    page = <AuthPage mode="login" />;
  } else if (root === 'register') {
    page = <AuthPage mode="register" />;
  } else {
    page = <Homepage />;
  }

  return (
    <>
      {page}

      <TweaksPanel title="Zlatne Ruke — Tweaks">
        <TweakSection label="Tema">
          <TweakRadio label="Mod" value={tweaks.theme}
            options={[{ label: '☀️ Svetla', value: 'light' }, { label: '🌙 Tamna · zlatna', value: 'dark' }]}
            onChange={(v) => setTweak('theme', v)} />
          <div style={{
            marginTop: 8, padding: '8px 10px', borderRadius: 8,
            background: tweaks.theme === 'dark' ? '#1B1614' : '#FDF6F0',
            color: tweaks.theme === 'dark' ? '#E8BB6D' : '#A0445A',
            border: '1px solid ' + (tweaks.theme === 'dark' ? '#3A2D2E' : '#E8C8D0'),
            fontSize: 10.5, lineHeight: 1.5,
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
          }}>
            {tweaks.theme === 'dark'
              ? 'Plemenita noć · zlatni detalji'
              : 'Topla krema · roze akcenti'}
          </div>
        </TweakSection>

        <TweakSection label="Stranice (varijante)">
          <TweakRadio label="Početna" value={tweaks.homeVariant}
            options={[{ label: 'Editorial', value: 'A' }, { label: 'Marketplace', value: 'B' }, { label: 'Magazin', value: 'C' }]}
            onChange={(v) => setTweak('homeVariant', v)} />
          <TweakRadio label="Katalog" value={tweaks.catalogVariant}
            options={[{ label: 'Sidebar', value: 'A' }, { label: 'Masonry', value: 'B' }]}
            onChange={(v) => setTweak('catalogVariant', v)} />
        </TweakSection>

        <TweakSection label="Paleta">
          {tweaks.theme === 'dark' ? (
            <div style={{
              padding: 12, borderRadius: 8,
              background: 'rgba(212, 161, 85, 0.08)',
              color: '#A07A2E',
              fontSize: 11, lineHeight: 1.5,
              border: '1px dashed rgba(212, 161, 85, 0.3)',
            }}>
              Tamna tema koristi fiksnu paletu sa zlatnim akcentima. Prebaci na svetlu temu da podešavaš boje.
            </div>
          ) : (
            <>
              <TweakColor label="Glavna boja" value={tweaks.primaryColor} onChange={(v) => setTweak('primaryColor', v)} />
              <TweakColor label="Tamna boja" value={tweaks.primaryDarkColor} onChange={(v) => setTweak('primaryDarkColor', v)} />
              <TweakColor label="Pozadina" value={tweaks.creamColor} onChange={(v) => setTweak('creamColor', v)} />
            </>
          )}
        </TweakSection>

        <TweakSection label="Tipografija">
          <TweakSelect label="Glavni font" value={tweaks.fontFamily}
            options={[
              { label: 'DM Sans', value: 'DM Sans' },
              { label: 'Inter', value: 'Inter' },
              { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
              { label: 'Manrope', value: 'Manrope' },
              { label: 'Lora (serif)', value: 'Lora' },
              { label: 'Playfair (serif)', value: 'Playfair Display' },
            ]}
            onChange={(v) => setTweak('fontFamily', v)} />
          <TweakSelect label="Skriptni font" value={tweaks.scriptFont}
            options={[
              { label: 'Caveat', value: 'Caveat' },
              { label: 'Dancing Script', value: 'Dancing Script' },
              { label: 'Kalam', value: 'Kalam' },
              { label: 'Allura', value: 'Allura' },
            ]}
            onChange={(v) => setTweak('scriptFont', v)} />
        </TweakSection>

        <TweakSection label="Gustina">
          <TweakRadio label="Razmak" value={tweaks.density}
            options={[{ label: 'Kompakt', value: 'compact' }, { label: 'Toplo', value: 'cozy' }, { label: 'Prozračno', value: 'comfy' }]}
            onChange={(v) => setTweak('density', v)} />
          <TweakSlider label="Veličina teksta" value={tweaks.scale} min={85} max={120} step={5} unit="%"
            onChange={(v) => setTweak('scale', v)} />
        </TweakSection>

        <TweakSection label="Brze rute">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              ['/', 'Početna'], ['/katalog', 'Katalog'],
              ['/proizvod/p1', 'Proizvod'], ['/radnja/s1', 'Radnja'],
              ['/korpa', 'Korpa'], ['/checkout', 'Checkout'],
              ['/profil', 'Profil'], ['/magazin', 'Magazin'],
              ['/prodavac', 'Prodavac'], ['/admin', 'Admin'],
              ['/postani-prodavac', 'Landing'], ['/login', 'Login'],
            ].map(([h, l]) => (
              <button key={h} onClick={() => navigate(h)}
                style={{ background: path === h ? 'var(--zr-pink)' : 'var(--zr-pink-light)', color: path === h ? 'white' : 'var(--zr-pink-dark)', border: 'none', padding: '7px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function Root() {
  return (
    <WStoreProvider>
      <App />
    </WStoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
