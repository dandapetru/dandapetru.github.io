/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NewsItem, 
  ContactPerson, 
  WoodProduct, 
  SiteSettings 
} from './types.js';
import Navigation from './components/Navigation.js';
import Hero from './components/Hero.js';
import AboutView from './components/AboutView.js';
import NewsView from './components/NewsView.js';
import WoodView from './components/WoodView.js';
import ContactsView from './components/ContactsView.js';
import AdminView from './components/AdminView.js';
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

  // Secure admin code state
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Core hydrated dynamic state
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [woodProducts, setWoodProducts] = useState<WoodProduct[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

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
      setSettings(data.settings || null);
      setErrorStatus(null);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setErrorStatus(err.message || 'Nepodařilo se navázat spojení se serverem JKL.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSiteData();
  }, []);

  // Reset scroll position when page or active article changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, selectedNewsId]);

  // Post Actions to Server with instantly hydrated callbacks
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

  // Quick navigation helper to focus into selected news article
  const handleSelectNews = (item: NewsItem | null) => {
    if (item) {
      setSelectedNewsId(item.id);
      setActivePage('news');
    } else {
      setSelectedNewsId(null);
    }
  };

  // General page changer that clears news details when shifting views
  const handlePageChange = (page: string) => {
    setActivePage(page);
    setSelectedNewsId(null);
  };

  // Check admin password
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
            <h3 className="font-serif text-lg font-bold text-forest-950">Načítání prezentace JKL</h3>
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

  // Backup placeholder in case loading failed but passed silently
  const activeSettings = settings || {
    aboutTitle: 'Trvale udržitelné hospodaření s respektem k tradicím a stvoření',
    aboutText: 'Jihočeské katolické lesy s.r.o. byly založeny k profesionálnímu, šetrnému a transparentnímu hospodaření...',
    contactIntro: 'Máte dotazy k prodeji dřeva, pronájmu pozemků nebo potřebujete pomoci s vytýčením hranic? Kontaktujte prosím příslušného odborného pracovníka.',
    officeHours: 'Pondělí – Pátek: 7:00 – 15:30',
    companyAddress: 'Rudolfovská tř. 10/24, 370 01 České Budějovice',
    companyICO: '28145963',
    companyDIC: 'CZ28145963',
    companyBank: '210452933/0300'
  };

  return (
    <div className="min-h-screen bg-forest-50 flex flex-col justify-between" id="app-main-root">
      
      {/* 1. STICKY BRAND NAVIGATION DESKTOP & MOBILE */}
      <Navigation 
        activePage={activePage} 
        setActivePage={handlePageChange} 
        isAdmin={isAdminMode} 
        setIsAdminMode={setIsAdminMode}
      />

      {/* 2. MAIN CORE LAYOUT CONTENT CONTAINER */}
      <main 
        className="flex-1 w-full" 
        id="app-content-body"
        style={{
          backgroundImage: activePage === 'home'
            ? `linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.45) 300px, rgba(255, 255, 255, 0.9) 650px, rgba(255, 255, 255, 1) 1000px, #ffffff 100%), url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1920')`
            : `linear-gradient(to bottom, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.9) 300px, rgba(255, 255, 255, 0.98) 650px, rgba(255, 255, 255, 1) 1000px, #ffffff 100%), url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1920')`,
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
              woodProducts={woodProducts}
              setActivePage={handlePageChange}
              onSelectNews={handleSelectNews}
            />
          )}

          {activePage === 'about' && (
            <AboutView settings={activeSettings} />
          )}

          {activePage === 'news' && (
            <NewsView 
              news={news}
              selectedNewsId={selectedNewsId}
              onSelectNews={handleSelectNews}
            />
          )}

          {activePage === 'wood' && (
            <WoodView woodProducts={woodProducts} />
          )}

          {activePage === 'contacts' && (
            <ContactsView 
              contacts={contacts} 
              settings={activeSettings} 
            />
          )}

          {activePage === 'admin' && (
            <AdminView 
              contacts={contacts}
              news={news}
              woodProducts={woodProducts}
              settings={activeSettings}
              onSaveContacts={handleSaveContacts}
              onSaveNews={handleSaveNews}
              onSaveWoodProducts={handleSaveWoodProducts}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </div>
      </main>

      {/* 3. SOPHISTICATED EDITORIAL FOOTER */}
      <footer className="bg-white border-t border-forest-100 py-8 leading-relaxed text-xs text-forest-600" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            
            {/* Left brand label */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-forest-300 rounded-full flex items-center justify-center font-serif font-bold text-forest-950 text-sm">
                J
              </div>
              <div>
                <span className="font-serif font-bold text-forest-950 text-sm block">Jihočeské katolické lesy s.r.o.</span>
                <span className="text-[10px] text-forest-400 font-mono">Biskupství českobudějovické</span>
              </div>
            </div>

            {/* Middle Quick Links */}
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs font-semibold uppercase tracking-wider">
              <button onClick={() => { handlePageChange('home'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Úvod</button>
              <button onClick={() => { handlePageChange('about'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">O nás</button>
              <button onClick={() => { handlePageChange('news'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Aktuality</button>
              <button onClick={() => { handlePageChange('wood'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Prodej dřeva</button>
              <button onClick={() => { handlePageChange('contacts'); setIsAdminMode(false); }} className="hover:text-forest-950 cursor-pointer">Kontakty</button>
            </nav>

          </div>

          <div className="border-t border-forest-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-forest-400 text-center">
            <div>
              &copy; {new Date().getFullYear()} Jihočeské katolické lesy s.r.o. Všechna práva vyhrazena.
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 font-bold uppercase tracking-widest text-[9px]">
              <a href="https://www.bcb.cz" target="_blank" rel="noopener noreferrer" className="hover:text-forest-650 flex items-center gap-0.5">
                Biskupství Č. Budějovice
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-forest-200">|</span>
              {isAdminMode ? (
                <button 
                  onClick={() => {
                    setIsAdminMode(false);
                    handlePageChange('home');
                  }} 
                  className="text-amber-700 hover:text-amber-900 font-bold transition flex items-center gap-1 cursor-pointer"
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
                  Administrační rozhraní &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-forest-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
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

            {/* Form Body */}
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
