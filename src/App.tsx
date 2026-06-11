import React, { useState, useEffect } from 'react';
import siteData from '../../data/site-data.json';
import { 
  NewsItem, 
  ContactPerson, 
  WoodProduct, 
  SiteSettings,
  WebTexts,
  GalleryItem
} from './types';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AboutView from './components/AboutView';
import PriceListView from './components/PriceListView';
import CertificationsView from './components/CertificationsView';
import GalleryView from './components/GalleryView';
import NewsView from './components/NewsView';
import ContactsView from './components/ContactsView';
import AdminView from './components/AdminView';
import OrgLogo from './components/OrgLogo';
import { 
  Trees, 
  Settings, 
  Loader2, 
  AlertTriangle, 
  ExternalLink,
  ShieldAlert,
  MapPin,
  Phone,
  Bookmark,
  Lock,
  X
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Responsive mobile background tracking
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Secure admin code state
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Core hydrated dynamic state
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [woodProducts, setWoodProducts] = useState<WoodProduct[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [webTexts, setWebTexts] = useState<WebTexts | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Fetch full state from server
  const fetchAllSiteData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/site-data');
      if (!response.ok) {
        throw new Error(`Chyba serveru při inicializaci dat: ${response.status}`);
      }
      const data = await response.json();
      setContacts(data.contacts || []);
      setNews(data.news || []);
      setWoodProducts(data.woodProducts || []);
      setGalleryItems(data.galleryItems || []);
      setSettings(data.settings || null);
      setWebTexts(data.webTexts || null);
      setErrorStatus(null);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setErrorStatus(err.message || 'Nepodařilo se navázat spojení se serverem JCKL.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSiteData();
  }, []);

  // Resetování scroll pozice
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, selectedNewsId]);

  // Odesílání info na server
  const handleSaveContacts = async (updatedContacts: ContactPerson[]) => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContacts),
    });
    if (!res.ok) {
      throw new Error('Chyba při komunikaci se serverem: ' + res.statusText);
    }
    setContacts(updatedContacts);
  };

  const handleSaveNews = async (updatedNews: NewsItem[]) => {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedNews),
    });
    if (!res.ok) {
      throw new Error('Chyba při nahrávání aktuality: ' + res.statusText);
    }
    setNews(updatedNews);
  };

  const handleSaveWoodProducts = async (updatedProducts: WoodProduct[]) => {
    const res = await fetch('/api/wood-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProducts),
    });
    if (!res.ok) {
      throw new Error('Chyba ukládání ceníku dřeva: ' + res.statusText);
    }
    setWoodProducts(updatedProducts);
  };

  const handleSaveGalleryItems = async (updatedItems: GalleryItem[]) => {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItems),
    });
    if (!res.ok) {
      throw new Error('Chyba ukládání fotogalerie: ' + res.statusText);
    }
    setGalleryItems(updatedItems);
  };

  const handleSaveSettings = async (updatedSettings: SiteSettings) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings),
    });
    if (!res.ok) {
      throw new Error('Chyba při zápisu systémových nastavení: ' + res.statusText);
    }
    setSettings(updatedSettings);
  };

  const handleSaveWebTexts = async (updatedWebTexts: WebTexts) => {
    const res = await fetch('/api/web-texts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWebTexts),
    });
    if (!res.ok) {
      throw new Error('Chyba při zápisu systémových textů: ' + res.statusText);
    }
    setWebTexts(updatedWebTexts);
  };

  // Výběr aktualit
  const handleSelectNews = (item: NewsItem | null) => {
    if (item) {
      setSelectedNewsId(item.id);
      setActivePage('news');
    } else {
      setSelectedNewsId(null);
    }
  };

  // Změna stránky
  const handlePageChange = (page: string) => {
    setActivePage(page);
    setSelectedNewsId(null);
  };

  // Kontrola hesla ----------------------------------------------------------------------------------------
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '6725') {
      setIsAdminMode(true);
      handlePageChange('admin');
      setShowPasswordPrompt(false);
      setPasswordInput('');
      setPasswordError(null);
    } else {
      setPasswordError('Nesprávné heslo. Zkuste to znovu.');
    }
  };

  if (isLoading && !settings) {
    return (
      <div className="min-h-screen bg-forest-50 flex flex-col items-center justify-center p-4" id="app-loading-screen">
        <div className="bg-white p-8 rounded-2xl border border-forest-150 shadow-sm flex flex-col items-center space-y-4 max-w-sm text-center">
          <Loader2 className="h-10 w-10 text-forest-500 animate-spin" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-forest-950">Načítání prezentace JCKL</h3>
            <p className="text-xs text-forest-600">Připojujeme se k lesní databázi pro nejnovější kontakty a ceníky dřeva...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorStatus && !settings) {
    return (
      <div className="min-h-screen bg-forest-50 flex flex-col items-center justify-center p-4 animate-fade-in" id="app-error-screen">
        <div className="bg-white p-8 rounded-2xl border border-red-150 shadow-sm flex flex-col items-center space-y-4 max-w-md text-center">
          <div className="bg-red-50 p-3 rounded-full text-red-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-red-950">Spojení se nepodařilo</h3>
            <p className="text-xs text-forest-750">
              Webové rozhraní nemohlo komunikovat s lokální databází na serveru.
            </p>
            <p className="p-2.5 bg-red-50 text-[11px] font-mono rounded text-red-800 break-all text-left">
              Chyba: {errorStatus}
            </p>
          </div>
          <button
            onClick={fetchAllSiteData}
            className="w-full py-2 bg-forest-900 hover:bg-forest-850 text-white font-bold rounded text-xs uppercase"
          >
            Zkusit znovu spojit
          </button>
        </div>
      </div>
    );
  }

  // Záloha
  const activeSettings = settings || {
    aboutTitle: 'Motivační věta XXXX',
    aboutText: 'Jihočeské katolické lesy s.r.o. je společnost XXXXX...',
    contactIntro: 'Máte dotazy k XXXX nebo potřebujete pomoci s XXXX? Kontaktujte prosím příslušného odborného pracovníka.',
    officeHours: 'Otevírací doba',
    companyAddress: 'Adresa',
    companyICO: '02635828',
    companyDIC: 'CZ02635828',
    companyBank: 'XXXXXXXXX/XXXX'
  };

  const activeWebTexts = webTexts || {
    heroTitle: 'Text text nadpis o nás',
    heroSubtitle: 'Text text',
    aboutViewTitle: 'Text text',
    aboutViewSubtitle: 'Text text',
    aboutQuoteText: 'Text text motivační citát',
    aboutQuoteAuthor: 'Text text autor citátu',
    contactsTitle: 'Kontaktujte nás',
    contactsHQTitle: 'Sídlo společnosti',
    contactsHQSubtitle: 'Fakturační a doručovací údaje',
    contactsHoursTitle: 'Úřední hodiny',
    contactsHoursSubtitle: 'Kdy nás můžete navštívit',
    contactsBankTitle: 'Bankovní spojení',
    contactsBankSubtitle: 'Pro platby za dříví a poplatky obcí',
    contactsSectionTitle: 'Odborní lesní pracovníci',
    contactsSectionSubtitle: 'Dohlížejí na bezpečný chod jednotlivých revírů, správu majetku a sjednávání zakázek.'
  };

  return (
    <div className="min-h-screen bg-forest-50 flex flex-col justify-between" id="app-main-root">
      
      {/* 1. Bar a navigace */}
      <Navigation 
        activePage={activePage} 
        setActivePage={handlePageChange} 
        isAdmin={isAdminMode} 
        setIsAdminMode={setIsAdminMode}
      />

      {/* 2. Hlavní část */}
      <main 
        className="flex-1 w-full" 
        id="app-content-body"
        style={{
          backgroundImage: isMobile
            ? (activePage === 'home'
              ? `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 95vw, rgba(255, 255, 255, 1) 130vw, #ffffff 100%), url('images/bg_m.jpeg')`
              : `linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.65) 95vw, rgba(255, 255, 255, 1) 130vw, #ffffff 100%), url('images/bg_m.jpeg')`)
            : (activePage === 'home'
              ? `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 20vw, rgba(255, 255, 255, 0.75) 45vw, rgba(255, 255, 255, 1) 56vw, #ffffff 100%), url('images/bg.jpg')`
              : `linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.9) 25vw, rgba(255, 255, 255, 1) 50vw, #ffffff 100%), url('images/bg.jpg')`),
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
          backgroundColor: '#ffffff'
        }}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in" id="active-view-anim-window">
          {activePage === 'home' && (
            <Hero 
              aboutTitle={activeSettings.aboutTitle}
              aboutText={activeSettings.aboutText}
              latestNews={news}
              setActivePage={handlePageChange}
              onSelectNews={handleSelectNews}
              webTexts={activeWebTexts}
            />
          )}

          {activePage === 'about' && (
            <AboutView 
              settings={activeSettings} 
              webTexts={activeWebTexts}
            />
          )}

          {activePage === 'pricing' && (
            <PriceListView 
              woodProducts={woodProducts} 
              setActivePage={handlePageChange}
              companyEmail="lesy@bcb.cz"
            />
          )}

          {activePage === 'certifications' && (
            <CertificationsView />
          )}

          {activePage === 'gallery' && (
            <GalleryView galleryItems={galleryItems} />
          )}

          {activePage === 'news' && (
            <NewsView 
              news={news}
              selectedNewsId={selectedNewsId}
              onSelectNews={handleSelectNews}
            />
          )}

          {activePage === 'contacts' && (
            <ContactsView 
              contacts={contacts} 
              settings={activeSettings} 
              webTexts={activeWebTexts}
            />
          )}

          {activePage === 'admin' && (
            <AdminView 
              contacts={contacts}
              news={news}
              woodProducts={woodProducts}
              galleryItems={galleryItems}
              settings={activeSettings}
              webTexts={activeWebTexts}
              onSaveContacts={handleSaveContacts}
              onSaveNews={handleSaveNews}
              onSaveWoodProducts={handleSaveWoodProducts}
              onSaveGalleryItems={handleSaveGalleryItems}
              onSaveSettings={handleSaveSettings}
              onSaveWebTexts={handleSaveWebTexts}
            />
          )}
        </div>
      </main>

      {/* 3. Patička */}
      <footer className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] py-8 leading-relaxed text-xs text-forest-600" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            
            {/* Podpis společnosti */}
            <div className="flex items-center space-x-3">
              <div className="p-0.5 bg-white rounded-full border border-forest-500/20 shadow-sm relative flex items-center justify-center overflow-hidden h-11 w-11" id="footer-logo-icon">
                <img 
                  src="images/logo.png" 
                  alt="Logo" 
                  className="h-10 w-10 object-contain rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
                <OrgLogo className="h-10 w-10" />
              </div>
              <div>
                <span className="font-serif font-bold text-forest-950 text-sm block">Jihočeské katolické lesy s.r.o.</span>
                <span className="text-[10px] text-forest-400 font-mono">Biskupství českobudějovické</span>
              </div>
            </div>

            {/* Spodní navigace */}
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs font-semibold uppercase tracking-wider">
              <button onClick={() => { handlePageChange('home'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Úvod</button>
              <button onClick={() => { handlePageChange('about'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">O nás</button>
              <button onClick={() => { handlePageChange('pricing'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Ceník</button>
              <button onClick={() => { handlePageChange('certifications'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Certifikace</button>
              <button onClick={() => { handlePageChange('gallery'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Fotogalerie</button>
              <button onClick={() => { handlePageChange('news'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Aktuality</button>
              <button onClick={() => { handlePageChange('contacts'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Kontakty</button>
            </nav>

          </div>

          <div className="border-t border-forest-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-forest-400 text-center">
            <div>
              Pro &copy; Jihočeské katolické lesy s.r.o. Daniel Petrů {new Date().getFullYear()}. Všechna práva vyhrazena.
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 font-bold uppercase tracking-widest text-[9px]">
              <a href="https://www.bcb.cz" target="_blank" rel="noopener noreferrer" className="hover:text-forest-650 flex items-center gap-0.5">
                Biskupství Č. Budějovice
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-forest-900">|</span>
              {isAdminMode ? (
                <button 
                  onClick={() => {
                    setIsAdminMode(false);
                    handlePageChange('home');
                  }} 
                  className="text-forest-600 hover:text-forest-800 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  Odhlásit se &larr;
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setShowPasswordPrompt(true);
                    setPasswordError(null);
                    setPasswordInput('');
                  }} 
                  className="text-forest-600 hover:text-forest-800 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  Administrační vstup &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Zadávání hesla */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-forest-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Hlavička */}
            <div className="bg-forest-900 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-forest-300" />
                <span className="font-serif font-bold text-sm tracking-wide">Přihlášení do administrace</span>
              </div>
              <button 
                onClick={() => setShowPasswordPrompt(false)}
                className="text-forest-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Hlavní stať */}
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-600 mb-1.5">
                  Zadejte přístupový kód:
                </label>
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(null);
                  }}
                  placeholder="••••"
                  autoFocus
                  className="w-full px-3 py-2 border border-forest-200 rounded-lg text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 text-forest-950"
                />
              </div>

              {passwordError && (
                <p className="text-red-600 text-xs text-center font-semibold bg-red-50 py-1.5 px-3 rounded border border-red-100">
                  {passwordError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-forest-200 text-forest-700 rounded-lg hover:bg-forest-50 transition cursor-pointer"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-forest-800 text-white rounded-lg hover:bg-forest-900 transition cursor-pointer"
                >
                  Potvrdit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
