/* global React, ReactDOM, Babel,
   StoreProvider, useStore, Toast,
   IOSDevice, AndroidDevice,
   DesignCanvas, DCSection, DCArtboard,
   TweaksPanel, useTweaks, TweakSection, TweakColor, TweakRadio, TweakToggle,
   LandingScreen, LoginScreen, RegisterBuyerScreen, RegisterSellerScreen,
   HomeBuyerScreen, ShopScreen, ProductScreen,
   SearchScreen, CartScreen, OrdersScreen, NotificationsScreen, ProfileBuyerScreen,
   ChatListScreen, ChatScreen, HomeSellerScreen, AddProductScreen, ProfileSellerScreen, AdminScreen
*/

const { useState: uSm, useCallback: uCm, useMemo: uMm } = React;

// Router — owns navigation for one phone surface
function PhoneRouter({ initial = 'home-buyer', initialParams = {} }) {
  const [stack, setStack] = uSm([{ name: initial, params: initialParams }]);
  const current = stack[stack.length - 1];
  const navigate = uCm((name, params = {}) => {
    setStack(s => [...s, { name, params }]);
  }, []);

  const screen = renderScreen(current.name, current.params, navigate);
  return (
    <>
      {screen}
      <Toast />
    </>
  );
}

function renderScreen(name, params, navigate) {
  const map = {
    'landing': LandingScreen,
    'login': LoginScreen,
    'register-buyer': RegisterBuyerScreen,
    'register-seller': RegisterSellerScreen,
    'home-buyer': HomeBuyerScreen,
    'home-buyer-editorial': (p) => <HomeBuyerScreen {...p} variant="editorial" />,
    'home-buyer-discovery': (p) => <HomeBuyerScreen {...p} variant="discovery" />,
    'home-seller': HomeSellerScreen,
    'shop': ShopScreen,
    'product': ProductScreen,
    'search': SearchScreen,
    'cart': CartScreen,
    'orders': OrdersScreen,
    'add-product': AddProductScreen,
    'chat-list': ChatListScreen,
    'chat': ChatScreen,
    'notifications': NotificationsScreen,
    'profile-buyer': ProfileBuyerScreen,
    'profile-seller': ProfileSellerScreen,
    'admin': AdminScreen,
  };
  const Comp = map[name] || HomeBuyerScreen;
  return <Comp navigate={navigate} params={params} />;
}

// Phone shell — wraps a screen in a device frame
function Phone({ device = 'ios', children, width = 320, scale = 1 }) {
  const screenW = device === 'ios' ? 320 : 320;
  const screenH = device === 'ios' ? 690 : 690;
  if (device === 'ios') {
    return (
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <IOSDevice width={screenW} height={screenH}>
          {children}
        </IOSDevice>
      </div>
    );
  }
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <AndroidDevice width={screenW} height={screenH}>{children}</AndroidDevice>
    </div>
  );
}

// Each artboard renders an independent PhoneRouter with its own initial screen
function ArtboardPhone({ device = 'ios', initial, params }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
      <Phone device={device}>
        <StoreProvider>
          <PhoneRouter initial={initial} initialParams={params} />
        </StoreProvider>
      </Phone>
    </div>
  );
}

// Tweaks defaults
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#C0637A",
  "primaryDark": "#A0445A",
  "pinkLight": "#F5ECEE",
  "cream": "#FDF6F0"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  document.documentElement.style.setProperty('--zr-pink', t.primaryColor);
  document.documentElement.style.setProperty('--zr-pink-dark', t.primaryDark);
  document.documentElement.style.setProperty('--zr-pink-light', t.pinkLight);
  document.documentElement.style.setProperty('--zr-cream', t.cream);
}

function ZRTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  const presets = [
    { name: 'Roza klasika', primaryColor: '#C0637A', primaryDark: '#A0445A', pinkLight: '#F5ECEE', cream: '#FDF6F0' },
    { name: 'Pudrasta', primaryColor: '#D58B9C', primaryDark: '#B5687A', pinkLight: '#FAEEF1', cream: '#FFFAF5' },
    { name: 'Boja zalaska', primaryColor: '#CF7567', primaryDark: '#A85042', pinkLight: '#F8E8E1', cream: '#FFF6EE' },
    { name: 'Lavanda', primaryColor: '#A57AA8', primaryDark: '#7E5A82', pinkLight: '#EDE3F0', cream: '#FAF6FC' },
  ];
  return (
    <TweaksPanel title="🌸 Tweaks">
      <TweakSection title="Paleta">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
          {presets.map(p => (
            <button key={p.name} onClick={() => setTweak({
              primaryColor: p.primaryColor, primaryDark: p.primaryDark, pinkLight: p.pinkLight, cream: p.cream
            })} style={{
              padding: 8, borderRadius: 10, border: '1px solid #e5e5e5', background: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'inherit',
            }}>
              <span style={{ width: 14, height: 14, borderRadius: 999, background: p.primaryColor, flexShrink: 0 }}/>
              {p.name}
            </button>
          ))}
        </div>
        <TweakColor label="Primarna roze" value={t.primaryColor} onChange={v => setTweak('primaryColor', v)} />
        <TweakColor label="Tamno roze" value={t.primaryDark} onChange={v => setTweak('primaryDark', v)} />
        <TweakColor label="Roze light" value={t.pinkLight} onChange={v => setTweak('pinkLight', v)} />
        <TweakColor label="Krem" value={t.cream} onChange={v => setTweak('cream', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// Build the canvas
function App() {
  React.useEffect(() => { applyTweaks(TWEAK_DEFAULTS); }, []);

  // helper to make artboard
  const ab = (id, label, initial, params = {}, device = 'ios') => (
    <DCArtboard id={id} label={label} width={372} height={760}>
      <div data-screen-label={label}>
        <ArtboardPhone device={device} initial={initial} params={params} />
      </div>
    </DCArtboard>
  );

  return (
    <>
      <DesignCanvas>
        <DCSection id="auth" title="Autentifikacija" subtitle="Landing • Login • Register">
          {ab('auth-landing', '01 Landing', 'landing')}
          {ab('auth-login', '02 Login', 'login')}
          {ab('auth-buyer', '03 Register Kupac', 'register-buyer')}
          {ab('auth-seller', '04 Register Prodavac', 'register-seller')}
        </DCSection>

        <DCSection id="buyer-home" title="Početna kupca — varijacije" subtitle="3 različita pristupa Home ekranu">
          {ab('home-default', 'A · Default — toplo & strukturisano', 'home-buyer')}
          {ab('home-editorial', 'B · Editorial — magazin tipa', 'home-buyer-editorial')}
          {ab('home-discovery', 'C · Discovery — po raspoloženju', 'home-buyer-discovery')}
        </DCSection>

        <DCSection id="buyer-flow" title="Kupovina" subtitle="Pretraga → Radnja → Proizvod → Korpa → Porudžbine">
          {ab('search', '05 Pretraga', 'search')}
          {ab('shop', '06 Radnja (Shop)', 'shop', { id: 's1' })}
          {ab('product', '07 Detalji proizvoda', 'product', { id: 'p1' })}
          {ab('cart', '08 Korpa', 'cart')}
          {ab('orders', '09 Porudžbine', 'orders')}
        </DCSection>

        <DCSection id="chat" title="Chat sistem" subtitle="Inbox → Chat sa reakcijama, typing, mini-karticom proizvoda">
          {ab('chat-list', '10 Inbox', 'chat-list')}
          {ab('chat-room', '11 Chat sa Milom', 'chat', { id: 'c1' })}
          {ab('notifications', '12 Obaveštenja', 'notifications')}
        </DCSection>

        <DCSection id="seller" title="Prodavac" subtitle="Dashboard, dodavanje proizvoda, profil">
          {ab('home-seller', '13 Home Prodavac', 'home-seller')}
          {ab('add-product', '14 Dodaj proizvod', 'add-product')}
          {ab('profile-seller', '15 Profil prodavca', 'profile-seller')}
        </DCSection>

        <DCSection id="other" title="Profil & Admin" subtitle="">
          {ab('profile-buyer', '16 Profil kupca', 'profile-buyer')}
          {ab('admin', '17 Admin Panel', 'admin')}
        </DCSection>

        <DCSection id="android" title="Android frame" subtitle="Isti dizajn — Material kontekst za poređenje">
          {ab('android-home', 'Home Buyer · Android', 'home-buyer', {}, 'android')}
          {ab('android-product', 'Product · Android', 'product', { id: 'p1' }, 'android')}
          {ab('android-chat', 'Chat · Android', 'chat', { id: 'c1' }, 'android')}
        </DCSection>
      </DesignCanvas>
      <ZRTweaks />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
