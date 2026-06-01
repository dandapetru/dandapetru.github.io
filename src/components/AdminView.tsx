/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  NewsItem, 
  ContactPerson, 
  WoodProduct, 
  SiteSettings 
} from '../types.js';
import { 
  Settings, 
  Users, 
  Newspaper, 
  Trees, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Image, 
  Check, 
  AlertCircle, 
  X, 
  FileText 
} from 'lucide-react';

interface AdminViewProps {
  contacts: ContactPerson[];
  news: NewsItem[];
  woodProducts: WoodProduct[];
  settings: SiteSettings;
  onSaveContacts: (updated: ContactPerson[]) => Promise<void>;
  onSaveNews: (updated: NewsItem[]) => Promise<void>;
  onSaveWoodProducts: (updated: WoodProduct[]) => Promise<void>;
  onSaveSettings: (updated: SiteSettings) => Promise<void>;
}

export default function AdminView({
  contacts,
  news,
  woodProducts,
  settings,
  onSaveContacts,
  onSaveNews,
  onSaveWoodProducts,
  onSaveSettings,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'contacts' | 'wood' | 'settings'>('news');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Custom Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; type: 'news' | 'contacts' | 'wood' } | null>(null);

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { id, name, type } = deleteConfirm;
    try {
      if (type === 'news') {
        const updated = news.filter((item) => item.id !== id);
        await onSaveNews(updated);
        triggerToast(`Článek "${name}" byl smazán.`);
      } else if (type === 'contacts') {
        const updated = contacts.filter((c) => c.id !== id);
        await onSaveContacts(updated);
        triggerToast(`Kontakt "${name}" byl smazán.`);
      } else if (type === 'wood') {
        const updated = woodProducts.filter((w) => w.id !== id);
        await onSaveWoodProducts(updated);
        triggerToast(`Položka "${name}" byla úspěšně odstraněna.`);
      }
    } catch (err: any) {
      triggerToast('Chyba při mazání: ' + err.message, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Forms state
  const [editingSettings, setEditingSettings] = useState<SiteSettings>({ ...settings });

  // Contacts editing state
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactDept, setContactDept] = useState('Vedení společnosti');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactPhoto, setContactPhoto] = useState('');

  // News editing state
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDate, setNewsDate] = useState(new Date().toISOString().split('T')[0]);
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'lesnictvi' | 'zpravy' | 'prodej' | 'verejnost'>('lesnictvi');
  const [newsAuthor, setNewsAuthor] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [isConvertingImage, setIsConvertingImage] = useState(false);

  // Wood editing state
  const [selectedWoodId, setSelectedWoodId] = useState<string | null>(null);
  const [isAddingWood, setIsAddingWood] = useState(false);
  const [woodName, setWoodName] = useState('');
  const [woodCategory, setWoodCategory] = useState<'palivove' | 'kulatina' | 'vzdustandard'>('palivove');
  const [woodType, setWoodType] = useState('');
  const [woodPrice, setWoodPrice] = useState<number>(0);
  const [woodUnit, setWoodUnit] = useState('prms');
  const [woodDescription, setWoodDescription] = useState('');
  const [woodMoisture, setWoodMoisture] = useState<'čerstvé' | 'suché' | 'dle výběru'>('suché');
  const [woodAvailable, setWoodAvailable] = useState(true);

  // Trigger brief alert feedback
  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. SAVE SITE SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveSettings(editingSettings);
      triggerToast('Obecné informace a texty byly úspěšně uloženy.');
    } catch (err: any) {
      triggerToast('Chyba při ukládání: ' + err.message, 'error');
    }
  };

  // 2. FILE UPLOADER TO BASE64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      triggerToast('Vyberte prosím obrázek menší než 2MB.', 'error');
      return;
    }

    setIsConvertingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setNewsImage(reader.result as string);
      setIsConvertingImage(false);
      triggerToast('Fotografie byla úspěšně nahrána a zkomprimována.');
    };
    reader.onerror = () => {
      setIsConvertingImage(false);
      triggerToast('Nepodařilo se zpracovat soubor obrazu.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Alternate quick photo selector for debug demo convenience
  const handleUseDemoPhoto = (url: string) => {
    setNewsImage(url);
    triggerToast('Použit demo obrázek z lesů.');
  };

  const handleUseDemoContactPhoto = (url: string) => {
    setContactPhoto(url);
    triggerToast('Použit demo portrét.');
  };

  // 3. CONTACT ACTIONS
  const handleOpenEditContact = (c: ContactPerson) => {
    setSelectedContactId(c.id);
    setIsAddingContact(true);
    setContactName(c.name);
    setContactRole(c.role);
    setContactDept(c.department);
    setContactPhone(c.phone);
    setContactEmail(c.email);
    setContactAddress(c.address || '');
    setContactPhoto(c.photoUrl || '');
  };

  const handleOpenAddContact = () => {
    setSelectedContactId(null);
    setIsAddingContact(true);
    setContactName('');
    setContactRole('');
    setContactDept('Vedení společnosti');
    setContactPhone('+420 ');
    setContactEmail('');
    setContactAddress('');
    setContactPhoto('');
  };

  const handleSaveContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactEmail) {
      triggerToast('Prosím doplňte jméno, telefon a email pracovníka.', 'error');
      return;
    }

    try {
      let updated: ContactPerson[];
      if (selectedContactId) {
        // Edit
        updated = contacts.map((c) => 
          c.id === selectedContactId 
            ? { ...c, name: contactName, role: contactRole, department: contactDept, phone: contactPhone, email: contactEmail, address: contactAddress || undefined, photoUrl: contactPhoto || undefined }
            : c
        );
        triggerToast('Kontakt byl úspěšně upraven.');
      } else {
        // Create new
        const newContact: ContactPerson = {
          id: 'c_' + Date.now(),
          name: contactName,
          role: contactRole,
          department: contactDept,
          phone: contactPhone,
          email: contactEmail,
          address: contactAddress || undefined,
          photoUrl: contactPhoto || undefined,
        };
        updated = [...contacts, newContact];
        triggerToast('Nový lesní odborník byl úspěšně přidán.');
      }

      await onSaveContacts(updated);
      setIsAddingContact(false);
      setSelectedContactId(null);
    } catch (err: any) {
      triggerToast('Nepodařilo se uložit kontakt: ' + err.message, 'error');
    }
  };

  const handleDeleteContact = (id: string, name: string) => {
    setDeleteConfirm({ id, name, type: 'contacts' });
  };


  // 4. NEWS ACTIONS
  const handleOpenEditNews = (item: NewsItem) => {
    setSelectedNewsId(item.id);
    setIsAddingNews(true);
    setNewsTitle(item.title);
    setNewsDate(item.date);
    setNewsSummary(item.pithySummary);
    setNewsContent(item.content);
    setNewsCategory(item.category);
    setNewsAuthor(item.author);
    setNewsImage(item.imageUrl || '');
  };

  const handleOpenAddNews = () => {
    setSelectedNewsId(null);
    setIsAddingNews(true);
    setNewsTitle('');
    setNewsDate(new Date().toISOString().split('T')[0]);
    setNewsSummary('');
    setNewsContent('');
    setNewsCategory('lesnictvi');
    setNewsAuthor('Administrátor JKL');
    setNewsImage('');
  };

  const handleSaveNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary || !newsContent) {
      triggerToast('Prosím doplňte správně titulek, shrnutí i hlavní text aktuality.', 'error');
      return;
    }

    try {
      let updated: NewsItem[];
      if (selectedNewsId) {
        // Edit 
        updated = news.map((item) => 
          item.id === selectedNewsId
            ? { ...item, title: newsTitle, date: newsDate, pithySummary: newsSummary, content: newsContent, category: newsCategory, author: newsAuthor, imageUrl: newsImage || undefined }
            : item
        );
        triggerToast('Článek byl úspěšně aktualizován.');
      } else {
        // Create
        const newItem: NewsItem = {
          id: 'n_' + Date.now(),
          title: newsTitle,
          date: newsDate,
          pithySummary: newsSummary,
          content: newsContent,
          category: newsCategory,
          author: newsAuthor,
          imageUrl: newsImage || undefined
        };
        updated = [newItem, ...news];
        triggerToast('Nová aktualita byla úspěšně publikována na webu.');
      }

      await onSaveNews(updated);
      setIsAddingNews(false);
      setSelectedNewsId(null);
    } catch (err: any) {
      triggerToast('Chyba při zápisu aktuality: ' + err.message, 'error');
    }
  };

  const handleDeleteNews = (id: string, title: string) => {
    setDeleteConfirm({ id, name: title, type: 'news' });
  };


  // 5. WOOD PRICE ACTIONS
  const handleOpenEditWood = (w: WoodProduct) => {
    setSelectedWoodId(w.id);
    setIsAddingWood(true);
    setWoodName(w.name);
    setWoodCategory(w.category);
    setWoodType(w.woodType);
    setWoodPrice(w.price);
    setWoodUnit(w.unit);
    setWoodDescription(w.description);
    setWoodMoisture(w.moisture);
    setWoodAvailable(w.available);
  };

  const handleOpenAddWood = () => {
    setSelectedWoodId(null);
    setIsAddingWood(true);
    setWoodName('');
    setWoodCategory('palivove');
    setWoodType('Měkké jehličnaté');
    setWoodPrice(1200);
    setWoodUnit('prms');
    setWoodDescription('');
    setWoodMoisture('suché');
    setWoodAvailable(true);
  };

  const handleSaveWoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!woodName || woodPrice <= 0) {
      triggerToast('Prosím doplňte platný název a cenu vyšší než 0 Kč.', 'error');
      return;
    }

    try {
      let updated: WoodProduct[];
      if (selectedWoodId) {
        updated = woodProducts.map((w) => 
          w.id === selectedWoodId
            ? { ...w, name: woodName, category: woodCategory, woodType, price: Number(woodPrice), unit: woodUnit, description: woodDescription, moisture: woodMoisture, available: woodAvailable }
            : w
        );
        triggerToast('Položka ceníku byla uložena.');
      } else {
        const newProduct: WoodProduct = {
          id: 'w_' + Date.now(),
          name: woodName,
          category: woodCategory,
          woodType,
          price: Number(woodPrice),
          unit: woodUnit,
          description: woodDescription,
          moisture: woodMoisture,
          available: woodAvailable
        };
        updated = [...woodProducts, newProduct];
        triggerToast('Nová položka dříví byla zařazena do ceníku.');
      }

      await onSaveWoodProducts(updated);
      setIsAddingWood(false);
      setSelectedWoodId(null);
    } catch (err: any) {
      triggerToast('Chyba při zápisu ceníku: ' + err.message, 'error');
    }
  };

  const handleDeleteWood = (id: string, name: string) => {
    setDeleteConfirm({ id, name, type: 'wood' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="admin-view-root">
      
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div 
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-xs sm:text-sm flex items-center space-x-2 animate-fade-in
            ${toastType === 'success' 
              ? 'bg-emerald-950 border-emerald-800 text-emerald-200' 
              : 'bg-red-950 border-red-800 text-red-200'
            }`}
          id="admin-alert-toast"
        >
          {toastType === 'success' ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <AlertCircle className="h-4.5 w-4.5 text-red-400" />}
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Panel Header */}
      <div className="bg-forest-900 text-white rounded-2xl p-6 sm:p-8 border border-forest-950 flex flex-col md:flex-row gap-4 items-center justify-between shadow" id="admin-header-row">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-forest-300 font-mono">Zabezpečené rozhraní</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
            <Settings className="h-6 w-6 text-forest-300" />
            Správa obsahu webu JKL
          </h1>
          <p className="text-xs text-forest-200">
            Editujte kontakty, publikujte nové aktuality s fotografiemi nebo spravujte ceníky dřeva veškerého majetku.
          </p>
        </div>
        
        {/* Navigation Admin Options */}
        <div className="flex flex-wrap gap-1 bg-forest-950 p-1 rounded-xl border border-forest-800" id="admin-tab-bar">
          {[
            { id: 'news', label: 'Aktuality', icon: Newspaper },
            { id: 'contacts', label: 'Odborníci', icon: Users },
            { id: 'wood', label: 'Ceník dřeva', icon: Trees },
            { id: 'settings', label: 'Texty webu', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsAddingContact(false);
                  setIsAddingNews(false);
                  setIsAddingWood(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition
                  ${activeTab === tab.id
                    ? 'bg-forest-600 text-white shadow'
                    : 'text-forest-300 hover:text-white'
                  }`}
                id={`admin-tab-btn-${tab.id}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT 1: NEWS ADMIN */}
      {activeTab === 'news' && (
        <section className="space-y-6" id="news-admin-sect">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-950">Seznam aktualit s fotografiemi</h2>
              <p className="text-xs text-forest-500">Přidávejte, upravujte nebo mazejte tiskové zprávy JKL.</p>
            </div>
            
            {!isAddingNews && (
              <button
                onClick={handleOpenAddNews}
                className="px-4 py-2.5 bg-forest-900 hover:bg-forest-850 text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer shadow border border-forest-950"
                id="btn-admin-add-news"
              >
                <Plus className="h-4 w-4" /> Napsat aktualitu
              </button>
            )}
          </div>

          {isAddingNews ? (
            /* Add or Edit News Form card */
            <div className="bg-white rounded-xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-xs" id="news-form-card">
              <div className="flex items-center justify-between border-b border-forest-50 pb-3">
                <h3 className="font-serif font-bold text-lg text-forest-950">
                  {selectedNewsId ? 'Upravit existující aktualitu' : 'Publikovat novou aktualitu'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNews(false);
                    setSelectedNewsId(null);
                  }}
                  className="p-1 text-forest-400 hover:text-forest-600 rounded bg-forest-50"
                  id="btn-news-form-close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveNewsSubmit} className="space-y-4" id="news-form-element">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Title of News */}
                  <div className="md:col-span-8 space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Titulek aktuality (silný nadpis):</label>
                    <input
                      type="text"
                      required
                      placeholder="např. Úspěšné ukončení jarního prořezu v polesí Lipno"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 focus:ring-1 focus:ring-forest-300"
                      id="in-news-title"
                    />
                  </div>

                  {/* Date of News */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-forest-700 font-mono">Datum publikace:</label>
                    <input
                      type="date"
                      required
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 focus:ring-1 focus:ring-forest-300"
                      id="in-news-date"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Kategorie:</label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 focus:ring-1 focus:ring-forest-300"
                      id="in-news-category"
                    >
                      <option value="lesnictvi">Péče o lesnictví</option>
                      <option value="prodej">Prodej dříví / Ceníky</option>
                      <option value="verejnost">Akce a mše pro veřejnost</option>
                      <option value="zpravy">Oznámení a zprávy</option>
                    </select>
                  </div>

                  {/* Author Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Podepsaný autor (jméno, funkce):</label>
                    <input
                      type="text"
                      required
                      placeholder="např. Ing. Václav Jelínek, MBA"
                      value={newsAuthor}
                      onChange={(e) => setNewsAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 focus:ring-1 focus:ring-forest-300"
                      id="in-news-author"
                    />
                  </div>
                </div>

                {/* Photo uploader with conversion */}
                <div className="bg-forest-50 p-4 rounded-xl border border-forest-100 grid md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-forest-700 flex items-center gap-1">
                      <Image className="h-4 w-4 text-forest-300" />
                      Nahrát fotografii:
                    </label>
                    
                    <input
                      type="file"
                      id="news-avatar-uploader"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs cursor-pointer block file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-forest-900 file:text-white file:cursor-pointer"
                    />
                    
                    <p className="text-[10px] text-forest-500 leading-relaxed">
                      Zvolte kvalitní fotografii z polesí. Velikost souboru max 2MB. Bude automaticky převedena a zkomprimována přímo do databáze v JSON.
                    </p>

                    <div className="pt-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-forest-400 block mb-1">... nebo zvolit demo pozadí:</span>
                      <div className="flex flex-wrap gap-1">
                        <button 
                          type="button" 
                          onClick={() => handleUseDemoPhoto('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800')} 
                          className="px-2 py-1 bg-white hover:bg-forest-100 rounded text-[9px] font-mono border border-forest-150 cursor-pointer"
                        >
                          Zelený les 🌲
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleUseDemoPhoto('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800')} 
                          className="px-2 py-1 bg-white hover:bg-forest-100 rounded text-[9px] font-mono border border-forest-150 cursor-pointer"
                        >
                          Podzim 🍁
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleUseDemoPhoto('https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800')} 
                          className="px-2 py-1 bg-white hover:bg-forest-100 rounded text-[9px] font-mono border border-forest-150 cursor-pointer"
                        >
                          Slunečno ☀️
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Image Frame */}
                  <div className="h-36 rounded-lg border border-forest-150 overflow-hidden bg-forest-100 flex items-center justify-center relative">
                    {newsImage ? (
                      <>
                        <img src={newsImage} alt="Náhled" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewsImage('')}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                         </button>
                      </>
                    ) : (
                      <div className="text-center text-forest-400 p-4 space-y-1">
                        <Image className="h-6 w-6 text-forest-300 mx-auto" />
                        <span className="text-[10px] block">Bez ilustrační fotografie</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary / Pithy short */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Krátké shrnutí (zobrazuje se v přehledu, max 2-3 věty):</label>
                  <input
                    type="text"
                    required
                    maxLength={280}
                    placeholder="např. Od 15. května upravujeme otevírací dobu lesní skládky v Hluboké pro styk s veřejností..."
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 focus:ring-1 focus:ring-forest-300"
                    id="in-news-pithy"
                  />
                </div>

                {/* Rich primary content */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Hlavní článek aktuality (podrobné informace):</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Sem napište úplný text zprávy. Můžete používat normální odstavce pro přehlednost."
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 focus:ring-1 focus:ring-forest-300 font-sans"
                    id="in-news-content"
                  />
                </div>

                {/* Submitting CTAs */}
                <div className="flex justify-end gap-3 pt-3 border-t border-forest-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNews(false);
                      setSelectedNewsId(null);
                    }}
                    className="px-4 py-2 border border-forest-200 hover:bg-forest-50 rounded-lg text-xs font-semibold text-forest-700 cursor-pointer"
                    id="btn-news-cancel"
                  >
                    Storno
                  </button>
                  <button
                    type="submit"
                    disabled={isConvertingImage}
                    className="px-5 py-2 bg-forest-900 border border-forest-950 text-white font-semibold text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow hover:bg-forest-850"
                    id="btn-news-submit"
                  >
                    <Save className="h-4 w-4 text-forest-300" />
                    Uložit aktualitu
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* News Grid with action tools */
            <div className="bg-white rounded-xl border border-forest-100 overflow-hidden shadow-xs" id="news-admin-table-box">
              <div className="p-4 bg-forest-50 border-b border-forest-100 font-serif font-bold text-sm text-forest-900">
                Publikované články na webu ({news.length})
              </div>
              
              <div className="divide-y divide-forest-50" id="news-admin-list">
                {news.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id={`news-row-${item.id}`}>
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-forest-100 border border-forest-150">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full text-forest-300 flex items-center justify-center font-bold">🌲</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-forest-400 font-bold block">{item.date}</span>
                        <h4 className="font-serif font-bold text-sm text-forest-950 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-forest-500 line-clamp-1 italic">Autor: {item.author} | Kategorie: {item.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenEditNews(item)}
                        className="p-2 text-forest-600 hover:text-white hover:bg-forest-900 border border-forest-100 rounded-lg transition"
                        title="Upravit článek"
                        id={`btn-news-row-edit-${item.id}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id, item.title)}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-800 border border-forest-100 rounded-lg transition"
                        title="Smazat článek"
                        id={`btn-news-row-del-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* TAB CONTENT 2: CONTACTS ADMIN */}
      {activeTab === 'contacts' && (
        <section className="space-y-6" id="contacts-admin-sect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-950">Správa lesního personálu</h2>
              <p className="text-xs text-forest-500">Upravujte kontaktní údaje pro veřejnost (telefony, maily, fotky).</p>
            </div>
            
            {!isAddingContact && (
              <button
                onClick={handleOpenAddContact}
                className="px-4 py-2.5 bg-forest-950 hover:bg-forest-900 border border-forest-950 text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                id="btn-admin-add-contact"
              >
                <Plus className="h-4 w-4" /> Přidat odborníka
              </button>
            )}
          </div>

          {isAddingContact ? (
            /* Add/Modify contact Form */
            <div className="bg-white rounded-xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-xs" id="contact-form-card">
              <div className="flex items-center justify-between border-b border-forest-50 pb-3">
                <h3 className="font-serif font-bold text-lg text-forest-950">
                  {selectedContactId ? 'Upravit kartu pracovníka' : 'Vytvořit nového pracovníka'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingContact(false);
                    setSelectedContactId(null);
                  }}
                  className="p-1 text-forest-400 hover:text-forest-600 rounded bg-forest-50"
                  id="btn-contact-form-close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveContactSubmit} className="space-y-4" id="contact-form-element">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Jméno a tituly:</label>
                    <input
                      type="text"
                      required
                      placeholder="např. Ing. Václav Jelínek, MBA"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Pracovní pozice (role):</label>
                    <input
                      type="text"
                      required
                      placeholder="např. Revírník (Revír Rožmberk) nebo Ředitel"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Zařazení (Oddělení):</label>
                    <select
                      value={contactDept}
                      onChange={(e) => setContactDept(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    >
                      <option value="Vedení společnosti">Vedení společnosti</option>
                      <option value="Lesní správa">Lesní správa</option>
                      <option value="Prodej a styk s veřejností">Prodej a styk s veřejností</option>
                      <option value="Terénní správa">Terénní správa / Revírníci</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Kancelář / Hájovna (adresa, nepovinné):</label>
                    <input
                      type="text"
                      placeholder="např. Hájovna Ohrada, Hluboká n. Vlt."
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700 font-mono">Telefonní číslo (s předvolbou):</label>
                    <input
                      type="tel"
                      required
                      placeholder="+420 724 991 101"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700 font-mono">Pracovní email:</label>
                    <input
                      type="email"
                      required
                      placeholder="jelinek@jkl-lesy.cz"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>
                </div>

                {/* Portrait Picture Selection */}
                <div className="bg-forest-50 p-4 rounded-xl border border-forest-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-forest-700 block">Fotka / Portrét (Url nebo Base64):</label>
                    <input
                      type="text"
                      placeholder="Vložte URL obrázku nebo ponechte demo..."
                      value={contactPhoto}
                      onChange={(e) => setContactPhoto(e.target.value)}
                      className="w-64 px-2 py-1.5 text-xs rounded border border-forest-200 bg-white"
                    />
                    
                    <div className="pt-1.5 flex gap-1">
                      <button 
                        type="button" 
                        onClick={() => handleUseDemoContactPhoto('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256')}
                        className="px-2 py-0.5 bg-white text-[9px] rounded border border-forest-150 cursor-pointer hover:bg-forest-100"
                      >
                        Ředitel (Muž)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleUseDemoContactPhoto('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256')}
                        className="px-2 py-0.5 bg-white text-[9px] rounded border border-forest-150 cursor-pointer hover:bg-forest-100"
                      >
                        Prodej (Žena)
                      </button>
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-full overflow-hidden bg-forest-200 border-2 border-white flex items-center justify-center">
                    {contactPhoto ? (
                      <img src={contactPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-forest-500 font-bold">Foto</span>
                    )}
                  </div>
                </div>

                {/* Form CTAs */}
                <div className="flex justify-end gap-3 pt-3 border-t border-forest-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingContact(false);
                      setSelectedContactId(null);
                    }}
                    className="px-4 py-2 border border-forest-200 hover:bg-forest-50 rounded-lg text-xs font-semibold text-forest-700 cursor-pointer"
                  >
                    Storno
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-forest-900 border border-forest-950 text-white font-semibold text-xs rounded-lg uppercase tracking-wider hover:bg-forest-850"
                  >
                    Save Contact
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Staff list representation */
            <div className="bg-white rounded-xl border border-forest-100 overflow-hidden shadow-xs" id="contacts-admin-table">
              <div className="p-4 bg-forest-50 border-b border-forest-100 font-serif font-bold text-sm text-forest-900">
                Evidovaní pracovníci v databázi ({contacts.length})
              </div>

              <div className="divide-y divide-forest-50">
                {contacts.map((c) => (
                  <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id={`contact-row-${c.id}`}>
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-forest-100 border border-forest-150">
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full text-forest-400 flex items-center justify-center font-bold text-xs uppercase">
                            {c.name.split(' ').filter(p => !p.includes('.'))[0]?.[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-forest-950">{c.name}</h4>
                        <p className="text-xs text-forest-500 font-medium">{c.role} | {c.department}</p>
                        <p className="text-[11px] text-forest-400 font-mono mt-0.5">{c.phone} • {c.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditContact(c)}
                        className="p-1.5 text-forest-600 hover:bg-forest-50 border border-forest-100 rounded-lg transition"
                        title="Upravit osobu"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(c.id, c.name)}
                        className="p-1.5 text-red-650 hover:bg-red-50 border border-forest-100 rounded-lg transition"
                        title="Smazat osobu"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* TAB CONTENT 3: WOOD PRICING ADMIN */}
      {activeTab === 'wood' && (
        <section className="space-y-6" id="wood-admin-sect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-950">Správa položek a ceníku dříví</h2>
              <p className="text-xs text-forest-500">Měňte jednotkovou cenu nebo přidávejte nové typy dříví do kalkulátoru.</p>
            </div>
            
            {!isAddingWood && (
              <button
                onClick={handleOpenAddWood}
                className="px-4 py-2.5 bg-forest-950 hover:bg-forest-900 border border-forest-950 text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                id="btn-admin-add-wood"
              >
                <Plus className="h-4 w-4" /> Přidat sortiment
              </button>
            )}
          </div>

          {isAddingWood ? (
            /* Add/Modify wood form */
            <div className="bg-white rounded-xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-xs" id="wood-form-card">
              <div className="flex items-center justify-between border-b border-forest-50 pb-3">
                <h3 className="font-serif font-bold text-lg text-forest-950">
                  {selectedWoodId ? 'Upravit dříví ceníku' : 'Nový typ dříví'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingWood(false);
                    setSelectedWoodId(null);
                  }}
                  className="p-1 text-forest-400 hover:text-forest-600 rounded bg-forest-50"
                  id="btn-wood-form-close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveWoodSubmit} className="space-y-4" id="wood-form-element">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Název sortimentu dřeva:</label>
                    <input
                      type="text"
                      required
                      placeholder="např. Palivové dřevo Bříza (krásně dýmá)"
                      value={woodName}
                      onChange={(e) => setWoodName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>

                  {/* Wood types */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Hlavní dřeviny:</label>
                    <input
                      type="text"
                      required
                      placeholder="např. Bříza, Olše nebo Jen Smrk"
                      value={woodType}
                      onChange={(e) => setWoodType(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category of wood */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Kategorie dříví:</label>
                    <select
                      value={woodCategory}
                      onChange={(e) => setWoodCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    >
                      <option value="palivove">Palivové dříví štípané</option>
                      <option value="kulatina">Pilařská kulatina stab.</option>
                      <option value="vzdustandard">Ostatní sortiment (vláknina, klest)</option>
                    </select>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700 font-mono">Cena v CZK (Kč):</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={woodPrice}
                      onChange={(e) => setWoodPrice(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 font-semibold"
                    />
                  </div>

                  {/* Unit metric */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Měřící jednotka:</label>
                    <select
                      value={woodUnit}
                      onChange={(e) => setWoodUnit(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    >
                      <option value="prms">prms (Prostorový sypaný)</option>
                      <option value="prmr">prmr (Prostorový srovnaný)</option>
                      <option value="m³">m³ (Plnometrový metr)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Moisture default */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Standardní stav vlhkosti:</label>
                    <select
                      value={woodMoisture}
                      onChange={(e) => setWoodMoisture(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    >
                      <option value="suché">Suché dřevo (vysušené do 20% vlhkosti)</option>
                      <option value="čerstvé">Čerstvě vytěžené dřevo</option>
                      <option value="dle výběru">Dle výběru na skládce</option>
                    </select>
                  </div>

                  {/* Available indicator */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Dostupnost skladem:</label>
                    <select
                      value={woodAvailable ? 'true' : 'false'}
                      onChange={(e) => setWoodAvailable(e.target.value === 'true')}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 font-medium"
                    >
                      <option value="true">Skladem (ihned k expedici)</option>
                      <option value="false">Vyprodáno (čeká se na těžbu / jaro)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Detailní popis vlastností dříví:</label>
                  <textarea
                    rows={3}
                    placeholder="Popište optimální určení (např. do krbů, uhelných kotlů), délku polínek nebo výhřevnost dříví..."
                    value={woodDescription}
                    onChange={(e) => setWoodDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                {/* Wood Form Submit */}
                <div className="flex justify-end gap-3 pt-3 border-t border-forest-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingWood(false);
                      setSelectedWoodId(null);
                    }}
                    className="px-4 py-2 border border-forest-200 hover:bg-forest-50 rounded-lg text-xs font-semibold text-forest-700 cursor-pointer"
                  >
                    Storno
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-forest-900 border border-forest-950 text-white font-semibold text-xs rounded-lg uppercase tracking-wider hover:bg-forest-850"
                  >
                    Uložit položku
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Custom list of Wood pricing */
            <div className="bg-white rounded-xl border border-forest-100 overflow-hidden shadow-xs" id="wood-admin-table">
              <div className="p-4 bg-forest-50 border-b border-forest-100 font-serif font-bold text-sm text-forest-900">
                Položky v ceníku dříví ({woodProducts.length})
              </div>

              <div className="divide-y divide-forest-50">
                {woodProducts.map((w) => (
                  <div key={w.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id={`wood-row-${w.id}`}>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-forest-950">{w.name}</h4>
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded
                          ${w.available ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                          {w.available ? 'skladem' : 'vyprodáno'}
                        </span>
                      </div>
                      <p className="text-xs text-forest-500 font-semibold">{w.woodType} • {w.category} • Vlhkost: {w.moisture}</p>
                      <p className="text-xs font-semibold text-forest-900 font-mono">
                        Cena: {w.price.toLocaleString('cs-CZ')} Kč / {w.unit}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditWood(w)}
                        className="p-1.5 text-forest-600 hover:bg-forest-50 border border-forest-100 rounded-lg transition"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWood(w.id, w.name)}
                        className="p-1.5 text-red-650 hover:bg-red-50 border border-forest-100 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* TAB CONTENT 4: GENERAL SITE TEXTS ADMIN */}
      {activeTab === 'settings' && (
        <section className="bg-white rounded-xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-xs" id="settings-admin-sect">
          <div>
            <h2 className="font-serif text-xl font-bold text-forest-950">Název a obecné texty prezentace</h2>
            <p className="text-xs text-forest-500">Tyto texty vidí návštěvníci na úvodní straně, v sekci o nás a na podstránce kontaktů.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 font-sans" id="settings-form-element">
            
            {/* About Headline of Home */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-700">Hlavní titulek textu "O nás":</label>
              <input
                type="text"
                required
                value={editingSettings.aboutTitle}
                onChange={(e) => setEditingSettings({ ...editingSettings, aboutTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 font-medium"
              />
            </div>

            {/* About Text Area of Home */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-700">Podrobný stručný příběh společnosti "O nás":</label>
              <textarea
                rows={10}
                required
                value={editingSettings.aboutText}
                onChange={(e) => setEditingSettings({ ...editingSettings, aboutText: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 leading-relaxed font-sans"
              />
            </div>

            {/* Contact introduction header */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-700">Úvodní slovo na podstránce kontaktů:</label>
              <textarea
                rows={2}
                required
                value={editingSettings.contactIntro}
                onChange={(e) => setEditingSettings({ ...editingSettings, contactIntro: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Office hours */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700">Provozní hodiny společnosti:</label>
                <input
                  type="text"
                  required
                  value={editingSettings.officeHours}
                  onChange={(e) => setEditingSettings({ ...editingSettings, officeHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                />
              </div>

              {/* Company HQ Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700">Oficiální fakturační adresa:</label>
                <input
                  type="text"
                  required
                  value={editingSettings.companyAddress}
                  onChange={(e) => setEditingSettings({ ...editingSettings, companyAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* ICO */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700 font-mono">IČO:</label>
                <input
                  type="text"
                  required
                  value={editingSettings.companyICO}
                  onChange={(e) => setEditingSettings({ ...editingSettings, companyICO: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 font-mono"
                />
              </div>

              {/* DIC */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700 font-mono">DIČ:</label>
                <input
                  type="text"
                  required
                  value={editingSettings.companyDIC}
                  onChange={(e) => setEditingSettings({ ...editingSettings, companyDIC: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 font-mono"
                />
              </div>

              {/* Bank Acc */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700 font-mono">Číslo bankovního účtu:</label>
                <input
                  type="text"
                  required
                  value={editingSettings.companyBank}
                  onChange={(e) => setEditingSettings({ ...editingSettings, companyBank: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200 font-mono"
                />
              </div>
            </div>

            {/* Settings Submit Button */}
            <div className="flex justify-end pt-3 border-t border-forest-50">
              <button
                type="submit"
                className="px-6 py-2.5 bg-forest-900 border border-forest-950 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-forest-850 cursor-pointer shadow flex items-center gap-1.5"
                id="btn-save-settings"
              >
                <Save className="h-4 w-4 text-forest-300" />
                Uložit nastavení a texty
              </button>
            </div>

          </form>
        </section>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-forest-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-forest-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-red-900 px-6 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-red-200" />
                <span className="font-serif font-bold text-sm tracking-wide">Potvrzení smazání</span>
              </div>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-red-200 hover:text-white transition cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-forest-900 leading-relaxed font-sans">
                Opravdu si přejete nevratně smazat{' '}
                {deleteConfirm.type === 'news' && 'aktualitu'}
                {deleteConfirm.type === 'contacts' && 'pracovníka'}
                {deleteConfirm.type === 'wood' && 'položku z ceníku'}
                <strong className="block mt-1.5 text-red-800 font-semibold underline decoration-red-200 decoration-2 font-serif">
                  „{deleteConfirm.name}“
                </strong>?
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-forest-200 text-forest-700 rounded-lg hover:bg-forest-50 transition cursor-pointer"
                >
                  Zrušit
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-red-650 hover:bg-red-700 text-white rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                >
                  <Trash2 className="h-3.5 w-3.5 animate-pulse" />
                  Smazat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
