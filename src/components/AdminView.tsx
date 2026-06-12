import React, { useState } from 'react';
import { 
  NewsItem, 
  ContactPerson, 
  WoodProduct, 
  SiteSettings,
  WebTexts,
  GalleryItem
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
  galleryItems: GalleryItem[];
  settings: SiteSettings;
  webTexts: WebTexts;
  onSaveContacts: (updated: ContactPerson[]) => Promise<void>;
  onSaveNews: (updated: NewsItem[]) => Promise<void>;
  onSaveWoodProducts: (updated: WoodProduct[]) => Promise<void>;
  onSaveGalleryItems: (updated: GalleryItem[]) => Promise<void>;
  onSaveSettings: (updated: SiteSettings) => Promise<void>;
  onSaveWebTexts: (updated: WebTexts) => Promise<void>;
}

export default function AdminView({
  contacts,
  news,
  woodProducts,
  galleryItems,
  settings,
  webTexts,
  onSaveContacts,
  onSaveNews,
  onSaveWoodProducts,
  onSaveGalleryItems,
  onSaveSettings,
  onSaveWebTexts,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'contacts' | 'wood' | 'gallery' | 'settings'>('news');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Custom Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; type: 'news' | 'contacts' | 'wood' | 'gallery' } | null>(null);

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
      } else if (type === 'gallery') {
        const updated = galleryItems.filter((item) => item.id !== id);
        await onSaveGalleryItems(updated);
        triggerToast(`Fotografie "${name}" byla smazána.`);
      }
    } catch (err: any) {
      triggerToast('Chyba při mazání: ' + err.message, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Forms state
  const [editingSettings, setEditingSettings] = useState<SiteSettings>({
    aboutTitle: settings?.aboutTitle || '',
    aboutText: settings?.aboutText || '',
    contactIntro: settings?.contactIntro || '',
    officeHours: settings?.officeHours || '',
    companyAddress: settings?.companyAddress || '',
    companyICO: settings?.companyICO || '',
    companyDIC: settings?.companyDIC || '',
    companyBank: settings?.companyBank || '',
  });
  const [editingWebTexts, setEditingWebTexts] = useState<WebTexts>({
    heroTitle: webTexts?.heroTitle || '',
    heroSubtitle: webTexts?.heroSubtitle || '',
    aboutViewTitle: webTexts?.aboutViewTitle || '',
    aboutViewSubtitle: webTexts?.aboutViewSubtitle || '',
    aboutQuoteText: webTexts?.aboutQuoteText || '',
    aboutQuoteAuthor: webTexts?.aboutQuoteAuthor || '',
    contactsTitle: webTexts?.contactsTitle || '',
    contactsHQTitle: webTexts?.contactsHQTitle || '',
    contactsHQSubtitle: webTexts?.contactsHQSubtitle || '',
    contactsHoursTitle: webTexts?.contactsHoursTitle || '',
    contactsHoursSubtitle: webTexts?.contactsHoursSubtitle || '',
    contactsBankTitle: webTexts?.contactsBankTitle || '',
    contactsBankSubtitle: webTexts?.contactsBankSubtitle || '',
    contactsSectionTitle: webTexts?.contactsSectionTitle || '',
    contactsSectionSubtitle: webTexts?.contactsSectionSubtitle || '',
  });

  // Contacts editing state
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactDept, setContactDept] = useState('Vedení společnosti');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactAddressURL, setContactAddressURL] = useState('');
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
  const [woodCategory, setWoodCategory] = useState<'tvrde' | 'mekke'>('tvrde');
  const [woodTypeClass, setWoodTypeClass] = useState<'listnate' | 'jehlicnate'>('listnate');
  const [woodType, setWoodType] = useState('');
  const [woodPrice, setWoodPrice] = useState<number>(0);
  const [woodUnit, setWoodUnit] = useState('prms');
  const [woodDescription, setWoodDescription] = useState('');
  const [woodMoisture, setWoodMoisture] = useState<'čerstvé' | 'suché' | 'dle výběru'>('suché');
  const [woodAvailable, setWoodAvailable] = useState(true);

  // Gallery editing state
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<'reviry' | 'pracoviste' | 'technika' | 'akce'>('reviry');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryDate, setGalleryDate] = useState('');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryBase64, setGalleryBase64] = useState('');
  const [galleryFilename, setGalleryFilename] = useState('');

  // Trigger brief alert feedback
  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Uložení stránky - nastavneí
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveSettings(editingSettings);
      await onSaveWebTexts(editingWebTexts);
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
    setContactName(c.name || '');
    setContactRole(c.role || '');
    setContactDept(c.department || '');
    setContactPhone(c.phone || '');
    setContactEmail(c.email || '');
    setContactAddress(c.address || '');
    setContactAddressURL(c.addressURL || '');
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
    setContactAddressURL('');
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
            ? { ...c, name: contactName, role: contactRole, department: contactDept, phone: contactPhone, email: contactEmail, address: contactAddress || undefined, addressURL: contactAddressURL || undefined, photoUrl: contactPhoto || undefined }
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
          addressURL: contactAddressURL || undefined,
          photoUrl: contactPhoto || undefined,
        };
        updated = [...contacts, newContact];
        triggerToast('Nový lesní odborník byl úspěšně přidán.');
      }

      await onSaveContacts(updated);
      // Keep user in admin view and keep the contact form open for further edits.
      if (selectedContactId) {
        // Edited existing contact — keep editing the same record (no-op)
      } else {
        // New contact: select the newly created contact so the user can continue editing if desired
        const created = updated[updated.length - 1];
        if (created) {
          setSelectedContactId(created.id);
          setIsAddingContact(true);
        }
      }
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
    setNewsTitle(item.title || '');
    setNewsDate(item.date || '');
    setNewsSummary(item.pithySummary || '');
    setNewsContent(item.content || '');
    setNewsCategory(item.category || 'lesnictvi');
    setNewsAuthor(item.author || '');
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
      // Keep user in admin view and keep the news form open for further edits.
      if (selectedNewsId) {
        // Edited existing article — keep editing the same record (no-op)
      } else {
        // New article: select the newly created item so the user can continue editing if desired
        const created = updated[0];
        if (created) {
          setSelectedNewsId(created.id);
          setIsAddingNews(true);
        }
      }
    } catch (err: any) {
      triggerToast('Chyba při zápisu aktuality: ' + err.message, 'error');
    }
  };

  const handleDeleteNews = (id: string, title: string) => {
    setDeleteConfirm({ id, name: title, type: 'news' });
  };
  const handleOpenEditWood = (w: WoodProduct) => {
    setSelectedWoodId(w.id);
    setIsAddingWood(true);
    setWoodName(w.name || '');
    setWoodCategory(w.category || 'tvrde');
    setWoodTypeClass(w.woodTypeClass || 'listnate');
    setWoodType(w.woodType || '');
    setWoodPrice(w.price || 0);
    setWoodUnit(w.unit || 'prms');
    setWoodDescription(w.description || '');
    setWoodMoisture(w.moisture || 'suché');
    setWoodAvailable(w.available !== undefined ? w.available : true);
  };

  const handleOpenAddWood = () => {
    setSelectedWoodId(null);
    setIsAddingWood(true);
    setWoodName('');
    setWoodCategory('tvrde');
    setWoodTypeClass('listnate');
    setWoodType('Buk, Dub');
    setWoodPrice(1800);
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
            ? { ...w, name: woodName, category: woodCategory, woodTypeClass: woodTypeClass, woodType, price: Number(woodPrice), unit: woodUnit, description: woodDescription, moisture: woodMoisture, available: woodAvailable }
            : w
        );
        triggerToast('Položka ceníku byla uložena.');
      } else {
        const newProduct: WoodProduct = {
          id: 'w_' + Date.now(),
          name: woodName,
          category: woodCategory,
          woodTypeClass: woodTypeClass,
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
      // Keep user in admin view and keep the wood form open for further edits.
      if (selectedWoodId) {
        // Edited existing item — keep editing the same record
      } else {
        const created = updated[updated.length - 1];
        if (created) {
          setSelectedWoodId(created.id);
          setIsAddingWood(true);
        }
      }
    } catch (err: any) {
      triggerToast('Chyba při zápisu ceníku: ' + err.message, 'error');
    }
  };

  const handleDeleteWood = (id: string, name: string) => {
    setDeleteConfirm({ id, name, type: 'wood' });
  };

  // 6. GALLERY ACTIONS
  const handleOpenEditGallery = (item: GalleryItem) => {
    setSelectedGalleryId(item.id);
    setIsAddingGallery(true);
    setGalleryTitle(item.title || '');
    setGalleryCategory(item.category || 'reviry');
    setGalleryDescription(item.description || '');
    setGalleryDate(item.date || '');
    setGalleryImageUrl(item.imageUrl || '');
    setGalleryBase64('');
    setGalleryFilename('');
  };

  const handleOpenAddGallery = () => {
    setSelectedGalleryId(null);
    setIsAddingGallery(true);
    setGalleryTitle('');
    setGalleryCategory('reviry');
    setGalleryDescription('');
    setGalleryDate(new Date().toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long' }));
    setGalleryImageUrl('');
    setGalleryBase64('');
    setGalleryFilename('');
  };

  const handleGalleryPhotoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryFilename(`${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setGalleryBase64(reader.result);
        setGalleryImageUrl(reader.result); // preview locally
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryTitle || !galleryImageUrl) {
      triggerToast('Vyplňte prosím název a nahrajte nebo zadejte obrázek.', 'error');
      return;
    }

    try {
      let finalUrl = galleryImageUrl;

      // If user uploaded a custom file (which populated base64 state)
      if (galleryBase64 && galleryFilename) {
        const uploadRes = await fetch('/api/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: galleryFilename, base64: galleryBase64 }),
        });
        if (!uploadRes.ok) {
          throw new Error('Nepodařilo se nahrát obrázek: ' + uploadRes.statusText);
        }
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.imageUrl) {
          finalUrl = uploadData.imageUrl;
        }
      }

      let updated: GalleryItem[];
      if (selectedGalleryId) {
        updated = galleryItems.map((item) =>
          item.id === selectedGalleryId
            ? { ...item, title: galleryTitle, category: galleryCategory, description: galleryDescription, date: galleryDate || undefined, imageUrl: finalUrl }
            : item
        );
        triggerToast('Fotografie byla v galerii upravena.');
      } else {
        const newItem: GalleryItem = {
          id: 'g_' + Date.now(),
          title: galleryTitle,
          category: galleryCategory,
          description: galleryDescription,
          date: galleryDate || undefined,
          imageUrl: finalUrl
        };
        updated = [newItem, ...galleryItems];
        triggerToast('Fotografie byla zařazena do fotogalerie.');
      }

      await onSaveGalleryItems(updated);
      // Keep user in admin view and keep the gallery form open for further edits.
      if (selectedGalleryId) {
        // Edited existing photo — keep editing
        setGalleryBase64('');
        setGalleryFilename('');
      } else {
        // New photo: select it so user can continue editing or add more info
        const created = updated[0];
        if (created) {
          setSelectedGalleryId(created.id);
          setIsAddingGallery(true);
        }
        setGalleryBase64('');
        setGalleryFilename('');
      }
    } catch (err: any) {
      triggerToast('Chyba při zápisu fotogalerie: ' + err.message, 'error');
    }
  };

  const handleDeleteGallery = (id: string, title: string) => {
    setDeleteConfirm({ id, name: title, type: 'gallery' });
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
            { id: 'wood', label: 'Ceník dříví', icon: Trees },
            { id: 'gallery', label: 'Fotogalerie', icon: Image },
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
                  setIsAddingGallery(false);
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

      {/* KONTAKTY ADMIN VIEW */}
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
            /* Úprava kontaktů ------------------- */
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
                      <option value="Prodej">Prodej</option>
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
                  {/* Mobil */}
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


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Adresa URL anebo odkaz na mapu revíru ------------------------------ */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700 font-mono">Odkaz na mapu revíru nebo adresu:</label>
                    <input
                      type="text"
                      placeholder="např. www.mapa.cz/XX nebo Google Maps odkaz"
                      value={contactAddressURL}
                      onChange={(e) => setContactAddressURL(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>
                </div>

                {/* PORTRÉT obrazek */}
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

      {/* Ceník dřeva admin view*/}
      {activeTab === 'wood' && (
        <section className="space-y-6" id="wood-admin-sect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-950">Správa položek a ceníku dříví</h2>
              <p className="text-xs text-forest-500">Měňte jednotkovou cenu nebo přidávejte nové typy dříví pro interní přehled sortimentu.</p>
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
            /* Přidávání nebo úprava */
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

                  {/* Typy dřeva */}
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

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Kategorie dřeva */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Tvrdost dříví:</label>
                    <select
                      value={woodCategory}
                      onChange={(e) => setWoodCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    >
                      <option value="tvrde">Tvrdé dříví</option>
                      <option value="mekke">Měkké dříví</option>
                    </select>
                  </div>

                  {/* Nastavneí třídy danému dřevnímu typu */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Třída dřeviny:</label>
                    <select
                      value={woodTypeClass}
                      onChange={(e) => setWoodTypeClass(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    >
                      <option value="listnate">Listnaté</option>
                      <option value="jehlicnate">Jehličnaté</option>
                    </select>
                  </div>

                  {/* CENY */}
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

                  {/* Jednotky -- navíc */}
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
                  {/* vlhkost - navííííc */}
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

                  {/* Dostuipnost x nedostupný  */}
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

                {/* Popisek */}
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

                {/* Uložit */}
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
            /* Vlastní nastavování cen */
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
                      <p className="text-xs text-forest-500 font-semibold">{w.woodType} • {w.category === 'tvrde' ? 'tvrdé' : 'měkké'} dříví ({w.woodTypeClass === 'listnate' ? 'listnaté' : 'jehličnaté'}) • Vlhkost: {w.moisture}</p>
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

      {/* Galerie admin view */}
      {activeTab === 'gallery' && (
        <section className="space-y-6" id="gallery-admin-sect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-forest-950 font-serif">Správa fotogalerie</h2>
              <p className="text-xs text-forest-500">Přidávejte nové snímky revírů, pracovníků nebo techniky přímo do složky images/fotogalerie.</p>
            </div>
            
            {!isAddingGallery && (
              <button
                onClick={handleOpenAddGallery}
                className="px-4 py-2.5 bg-forest-900 hover:bg-forest-850 text-white font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer shadow border border-forest-950"
                id="btn-admin-add-gallery"
              >
                <Plus className="h-4 w-4" /> Přidat fotografii
              </button>
            )}
          </div>

          {isAddingGallery ? (
            <div className="bg-white rounded-xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-xs" id="gallery-form-card">
              <div className="flex items-center justify-between border-b border-forest-50 pb-3">
                <h3 className="font-serif font-bold text-lg text-forest-950">
                  {selectedGalleryId ? 'Upravit fotografii' : 'Nahrát novou fotografii'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingGallery(false);
                    setSelectedGalleryId(null);
                  }}
                  className="p-1 text-forest-400 hover:text-forest-600 rounded bg-forest-50"
                  id="btn-gallery-form-close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveGallerySubmit} className="space-y-4" id="gallery-form-element">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Titulek / Název fotky:</label>
                    <input
                      type="text"
                      required
                      placeholder="např. Výsadba buků v revíru Šumava"
                      value={galleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Kategorie:</label>
                    <select
                      value={galleryCategory}
                      onChange={(e) => setGalleryCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    >
                      <option value="reviry">Naše revíry a porosty</option>
                      <option value="pracoviste">Práce v lese a školky</option>
                      <option value="technika">Lesní technika</option>
                      <option value="akce">Společenské akce a edukace</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Datum pořízení:</label>
                    <input
                      type="text"
                      placeholder="např. říjen 2026 nebo 15. 5. 2026"
                      value={galleryDate}
                      onChange={(e) => setGalleryDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-forest-700">Vyberte soubor fotografie (uloží se do images/fotogalerie):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryPhotoUploadChange}
                      className="w-full text-xs text-forest-600 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-forest-50 file:text-forest-700 file:cursor-pointer hover:file:bg-forest-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Nebo zadejte přímou URL adresu obrázku:</label>
                  <input
                    type="text"
                    placeholder="images/fotogalerie/sumava.jpg nebo https://..."
                    value={galleryImageUrl}
                    onChange={(e) => setGalleryImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Popis k fotografii:</label>
                  <textarea
                    rows={2}
                    placeholder="Krátký popis situace nebo zachycených detailů..."
                    value={galleryDescription}
                    onChange={(e) => setGalleryDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                {galleryImageUrl && (
                  <div className="p-3 bg-forest-50 rounded-lg border border-forest-100">
                    <span className="text-[10px] uppercase font-bold text-forest-600 block mb-2">Náhled obrázku</span>
                    <img 
                      src={galleryImageUrl} 
                      alt="Preview" 
                      className="max-h-48 rounded object-cover border border-forest-200"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-forest-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingGallery(false);
                      setSelectedGalleryId(null);
                    }}
                    className="px-4 py-2 border border-forest-200 hover:bg-forest-50 rounded-lg text-xs font-semibold text-forest-700 cursor-pointer"
                  >
                    Storno
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-forest-900 border border-forest-950 text-white font-semibold text-xs rounded-lg uppercase tracking-wider hover:bg-forest-850"
                  >
                    Uložit fotografii
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-forest-100 overflow-hidden shadow-xs" id="gallery-admin-table">
              <div className="p-4 bg-forest-50 border-b border-forest-100 font-serif font-bold text-sm text-forest-900">
                Fotografie v galerii ({galleryItems.length})
              </div>

              <div className="divide-y divide-forest-50">
                {galleryItems.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id={`gallery-row-${item.id}`}>
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-16 h-12 object-cover rounded border border-forest-150 animate-fade-in"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-forest-950">{item.title}</h4>
                        <p className="text-xs text-forest-500 font-semibold">
                          Kategorie: <span className="text-forest-750 font-bold capitalize">{item.category}</span> {item.date && `• Datum: ${item.date}`}
                        </p>
                        {item.description && <p className="text-xs text-forest-600 line-clamp-1">{item.description}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditGallery(item)}
                        className="p-1.5 text-forest-600 hover:bg-forest-50 border border-forest-100 rounded-lg transition"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id, item.title)}
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

      {/* 4. Texty stránek - admin view  */}
      {activeTab === 'settings' && (
        <section className="bg-white rounded-xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-xs" id="settings-admin-sect">
          <div>
            <h2 className="font-serif text-xl font-bold text-forest-950">Název a obecné texty prezentace</h2>
            <p className="text-xs text-forest-500">Tyto texty vidí návštěvníci na úvodní straně, v sekci o nás a na podstránce kontaktů.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 font-sans" id="settings-form-element">
            
            {/* Titulek "O nás" hero stránky */}
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

            {/* Titulek 2 hero stranka */}
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

            {/* Kontakt na uvod strance */}
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
              {/* Oteviraci doba */}
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

              {/* Adresa spolecnosti */}
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

              {/* Banka -- možná smazat -----------------------------*/}
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

            {/* HERO  */}
            <div className="pt-6 border-t border-forest-100 space-y-4">
              <h3 className="font-serif font-bold text-base text-forest-900">Customizace textů Úvodní strany a O nás</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700">Hlavní titulek úvodní strany (Hero banner):</label>
                <input
                  type="text"
                  required
                  value={editingWebTexts.heroTitle}
                  onChange={(e) => setEditingWebTexts({ ...editingWebTexts, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700">Popisný podtitulek úvodní strany (Hero banner):</label>
                <textarea
                  rows={2}
                  required
                  value={editingWebTexts.heroSubtitle}
                  onChange={(e) => setEditingWebTexts({ ...editingWebTexts, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Hlavní nadpis sekce "O nás":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.aboutViewTitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, aboutViewTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Vedlejší titulek sekce "O nás":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.aboutViewSubtitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, aboutViewSubtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700">Slavnostní citát biskupa (O nás):</label>
                <textarea
                  rows={2}
                  required
                  value={editingWebTexts.aboutQuoteText}
                  onChange={(e) => setEditingWebTexts({ ...editingWebTexts, aboutQuoteText: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700">Autor slavnostního citátu biskupa:</label>
                <input
                  type="text"
                  required
                  value={editingWebTexts.aboutQuoteAuthor}
                  onChange={(e) => setEditingWebTexts({ ...editingWebTexts, aboutQuoteAuthor: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                />
              </div>
            </div>

            {/* KOntaktní stranka */}
            <div className="pt-6 border-t border-forest-100 space-y-4">
              <h3 className="font-serif font-bold text-base text-forest-900">Customizace nadpisů kontaktní stránky</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Hlavní nadpis stránky kontaktů:</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsTitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Název sekce odborných pracovníků:</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsSectionTitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsSectionTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700">Podnadpis sekce odborných pracovníků:</label>
                <textarea
                  rows={2}
                  required
                  value={editingWebTexts.contactsSectionSubtitle}
                  onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsSectionSubtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Titulek karty "Sídlo společnosti":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsHQTitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsHQTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Podtitulek karty "Sídlo společnosti":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsHQSubtitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsHQSubtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Titulek karty "Úřední hodiny":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsHoursTitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsHoursTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Podtitulek karty "Úřední hodiny":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsHoursSubtitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsHoursSubtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Titulek karty "Bankovní spojení":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsBankTitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsBankTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-forest-700">Podtitulek karty "Bankovní spojení":</label>
                  <input
                    type="text"
                    required
                    value={editingWebTexts.contactsBankSubtitle}
                    onChange={(e) => setEditingWebTexts({ ...editingWebTexts, contactsBankSubtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-forest-200"
                  />
                </div>
              </div>
            </div>

            {/* Uložení */}
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

      {/* Vlastní mazání věcí */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-forest-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-forest-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Hlavicka */}
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

            {/* Telo */}
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-forest-900 leading-relaxed font-sans">
                Opravdu si přejete nevratně smazat{' '}
                {deleteConfirm.type === 'news' && 'aktualitu'}
                {deleteConfirm.type === 'contacts' && 'pracovníka'}
                {deleteConfirm.type === 'wood' && 'položku z ceníku'}
                <strong className="block mt-1.5 text-red-800 font-semibold underline decoration-red-200 decoration-2 font-serif">
                  {deleteConfirm.name}?
                </strong>
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
                  className="flex-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 font-sans"
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
