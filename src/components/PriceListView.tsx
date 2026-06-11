import React, { useState } from 'react';
import { WoodProduct } from '../types.js';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  FileSpreadsheet, 
  Trees, 
  HelpCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Mail, 
  Sparkles,
  Layers,
  ThermometerSun
} from 'lucide-react';

interface PriceListViewProps {
  woodProducts: WoodProduct[];
  setActivePage: (page: string) => void;
  companyEmail?: string;
}

export default function PriceListView({ woodProducts, setActivePage, companyEmail = 'info@jkl-lesy.cz' }: PriceListViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Calculator state
  const [calcProduct, setCalcProduct] = useState<string>(woodProducts[0]?.id || '');
  const [calcAmount, setCalcAmount] = useState<number>(5);
  
  // Inquiry state
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inquirySent, setInquirySent] = useState<boolean>(false);

  const selectedProduct = woodProducts.find(p => p.id === calcProduct);
  const totalPrice = selectedProduct ? selectedProduct.price * calcAmount : 0;

  const categories = [
    { id: 'all', label: 'Kompletní nabídka' },
    { id: 'tvrde', label: 'Tvrdé dříví' },
    { id: 'mekke', label: 'Měkké dříví' },
    { id: 'listnate', label: 'Listnaté' },
    { id: 'jehlicnate', label: 'Jehličnaté' }
  ];

  const filteredProducts = woodProducts.filter(p => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'tvrde') return p.category === 'tvrde';
    if (selectedCategory === 'mekke') return p.category === 'mekke';
    if (selectedCategory === 'listnate') return p.woodTypeClass === 'listnate';
    if (selectedCategory === 'jehlicnate') return p.woodTypeClass === 'jehlicnate';
    return true;
  });

  const getCategoryLabel = (cat: string, woodTypeClass?: string) => {
    const catText = cat === 'tvrde' ? 'Tvrdé' : 'Měkké';
    const typeText = woodTypeClass === 'listnate' ? 'listnaté' : 'jehličnaté';
    return `${catText} ${typeText} dříví`;
  };

  const generateInquiryText = () => {
    if (!selectedProduct) return '';
    return `Poptávka dříví - Jihočeské katolické lesy s.r.o.
--------------------------------------------------
Odběratel: ${customerName || 'Nezadáno'}
Telefon: ${customerPhone || 'Nezadáno'}
E-mail: ${customerEmail || 'Nezadáno'}
Adresa doručení: ${customerAddress || 'Nezadáno'}

Poptávaný sortiment: ${selectedProduct.name}
Množství: ${calcAmount} ${selectedProduct.unit}
Cena za jednotku: ${selectedProduct.price} Kč / ${selectedProduct.unit}
Předběžná cena celkem: ${totalPrice.toLocaleString('cs-CZ')} Kč (bez dopravy)

Poznámka / doplňující informace:
${customerNotes || 'Žádná poznámka'}
--------------------------------------------------
Vytvořeno přes poptávkovou kalkulačku JCKL.`;
  };

  const handleCopyToClipboard = () => {
    const text = generateInquiryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    // Open mailto client with prefilled details
    const subject = encodeURIComponent(`Nezávazná poptávka dříví: ${selectedProduct.name}`);
    const body = encodeURIComponent(generateInquiryText());
    window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
    setInquirySent(true);
  };

  return (
    <article className="space-y-12 max-w-5xl mx-auto animate-fade-in" id="pricelist-view-root">
      
      {/* Nadpis */}
      <hgroup className="text-center py-6 border-b border-forest-100" id="pricelist-heading-group">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-500">
          Ceník & Prodej dříví
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-forest-950 font-semibold mt-2 tracking-wide" id="pricelist-title">
          Sortiment dříví a paliva
        </h1>
        <p className="text-xs text-forest-700 mt-2 italic max-w-2xl mx-auto [text-shadow:_0_1px_2px_rgba(0,0,0,0.15)]">
          Jihočeské katolické lesy přímo dodávají palivové i průmyslové dříví z udržitelných církevních porostů obyvatelům, pilařským provozům i zpracovatelským závodům.
        </p>
      </hgroup>

      {/* Filter tabů */}
      <section className="flex flex-wrap justify-center gap-1.5 sm:gap-2" id="pricelist-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg uppercase tracking-wider transition ${
              selectedCategory === cat.id
                ? 'bg-forest-800 text-white shadow-md'
                : 'bg-white border border-forest-150 text-forest-750 hover:bg-forest-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* Seznam dříví */}
      <section className="grid md:grid-cols-2 gap-6" id="pricelist-products-grid">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-xl text-center border border-forest-100 text-forest-500">
            <Trees className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p className="font-serif text-lg font-bold">V této kategorii není aktuálně dříví skladem</p>
            <p className="text-xs mt-1">Zvolte prosím jinou kategorii nebo nás přímo kontaktujte.</p>
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div 
              key={p.id}
              className={`bg-white rounded-xl border border-forest-100 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-forest-205 transition ${
                !p.available ? 'opacity-70 bg-gray-50' : ''
              }`}
              id={`product-card-${p.id}`}
            >
              <div>
                <header className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-2 bg-forest-50 text-forest-700 rounded-full border border-forest-100 mb-1 inline-block">
                      {getCategoryLabel(p.category, p.woodTypeClass)}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-950 leading-snug">
                      {p.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-bold text-forest-800 block">
                      {p.price.toLocaleString('cs-CZ')} Kč
                    </span>
                    <span className="text-[10px] text-forest-500 font-mono block">
                      za 1 {p.unit}
                    </span>
                  </div>
                </header>

                <p className="text-xs sm:text-sm text-forest-650 mb-4 leading-relaxed whitespace-pre-line">
                  {p.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pb-4 border-b border-forest-50 text-xs text-forest-600 mb-4 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-forest-450" />
                    <span>Druh: <strong className="text-forest-900">{p.woodType}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThermometerSun className="h-3.5 w-3.5 text-forest-450" />
                    <span>Třída: <strong className="text-forest-900">{p.category === 'tvrde' ? 'tvrdé' : 'měkké'} ({p.woodTypeClass === 'listnate' ? 'listnaté' : 'jehličnaté'}), {p.moisture}</strong></span>
                  </div>
                </div>
              </div>

              <footer className="flex items-center justify-between">
                {p.available ? (
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 py-1 px-2.5 rounded-full border border-emerald-150">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Skladem / k odběru</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-amber-700 font-bold bg-amber-50 py-1 px-2.5 rounded-full border border-amber-150">
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Aktuálně vyprodáno</span>
                  </div>
                )}

                {p.available && (
                  <button
                    onClick={() => {
                      setCalcProduct(p.id);
                      const target = document.getElementById('ordering-calculator');
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-xs font-semibold text-forest-900 hover:text-forest-700 flex items-center gap-1 uppercase tracking-wider group cursor-pointer"
                  >
                    Spočítat cenu
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
                  </button>
                )}
              </footer>
            </div>
          ))
        )}
      </section>

      {/* Vysvětlika jednotek */}
      <section className="bg-forest-50 rounded-xl p-5 border border-forest-120 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center text-xs text-forest-700 leading-relaxed" id="pricelist-units-legend">
        <div className="space-y-1 max-w-md">
          <h4 className="font-serif font-bold text-sm text-forest-900 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-forest-650" />
            Vysvětlivky k prodejním jednotkám:
          </h4>
          <p>
            V lesním hospodářství se používají rozdílné jednotky měření dříví v závislosti na formě zpracování.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 w-full md:w-auto font-medium" id="legend-grid">
          <div className="bg-white p-3 rounded-lg border border-forest-150/40">
            <strong className="text-forest-900 block font-mono text-sm">prms</strong>
            <p className="text-[11px] text-forest-500 mt-0.5">Prostorový metr sypaný. Volně sypaná štípaná polena do krychle 1×1×1 m.</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-forest-150/40">
            <strong className="text-forest-900 block font-mono text-sm">prmr</strong>
            <p className="text-[11px] text-forest-500 mt-0.5">Prostorový metr rovnaný. Ručně skládaná polena těsně vedle sebe do krychle 1×1×1 m.</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-forest-150/40">
            <strong className="text-forest-900 block font-mono text-sm">m³ (plnmetr)</strong>
            <p className="text-[11px] text-forest-500 mt-0.5">Plný metr krychlový dříví. Představuje celistvou čistou masu dřevní hmoty bez mezer vzduch.</p>
          </div>
        </div>
      </section>

      {/* Poptávková kalkulačka */}
      <section 
        className="bg-white rounded-xl border border-forest-150 shadow-sm overflow-hidden" 
        id="ordering-calculator"
      >
        <header className="bg-forest-900 text-white p-6 sm:p-8 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-forest-300" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Nezávazná poptávková kalkulačka
              </h2>
            </div>
            <p className="text-xs text-forest-200">
              Spočítejte si cenu požadovaného dříví a odešlete nezávaznou poptávku přímo našemu lesnímu správci.
            </p>
          </div>
          <Sparkles className="h-6 w-6 text-yellow-300 hidden sm:block animate-pulse" />
        </header>

        <form 
          onSubmit={handleInquirySubmit} 
          className="grid lg:grid-cols-12 gap-8 p-6 sm:p-8" 
          id="calculator-inner-grid"
        >
          
          {/* 1. Volba sortimentu a množství */}
          <div className="lg:col-span-7 order-1 space-y-5" id="calculator-selection-section">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-650 mb-1.5">
                  Vyberte sortiment dříví:
                </label>
                <select
                  value={calcProduct}
                  onChange={(e) => setCalcProduct(e.target.value)}
                  className="w-full px-2 py-1.5 border border-forest-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 text-forest-950"
                  required
                >
                  {woodProducts.filter(p => p.available).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price} Kč/{p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest-650 mb-1.5">
                  Požadované množství ({selectedProduct?.unit || 'ks'}):
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-forest-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 text-forest-950"
                    required
                  />
                  <span className="text-sm font-semibold text-forest-800 bg-forest-50 border border-forest-200 px-3 py-2 rounded-lg min-w-[50px] text-center">
                    {selectedProduct?.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Sumář ceny */}
          <div className="lg:col-span-5 lg:row-span-2 order-2 lg:order-3 flex flex-col justify-between bg-forest-200 text-white rounded-xl p-6 sm:p-8 space-y-6" id="calculator-summary-card">
            <h3 className="font-serif text-lg font-bold text-forest-1000 border-b border-forest-800 pb-3">
              Přehled Vaší kalkulace
            </h3>

            {selectedProduct ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-forest-1000 font-mono block">
                    Vybraný sortiment:
                  </span>
                  <span className="text-forest-1000 text-sm font-bold block leading-snug">
                    {selectedProduct.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-forest-900">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-forest-1000 font-mono block">
                      Množství:
                    </span>
                    <span className="text-base font-bold text-forest-1000">
                      {calcAmount} {selectedProduct.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-forest-1000 font-mono block">
                      Cena za jednotku:
                    </span>
                    <span className="text-base font-bold text-forest-1000">
                      {selectedProduct.price} Kč / {selectedProduct.unit}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center py-2">
                  <span className="text-[10px] uppercase tracking-wider text-forest-1000 font-mono block">
                    Odhadovaná cena dříví:
                  </span>
                  <p className="text-3xl sm:text-4xl font-serif font-black text-gold-700">
                    {totalPrice.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-4">
                <p className="text-xs text-forest-400 italic">Položky ceníku dříví se nepodařilo inicializovat.</p>
              </div>
            )}

            {inquirySent && (
              <div className="bg-forest-900 border border-emerald-900/40 p-4 rounded-lg flex items-center gap-3 animate-fade-in text-xs leading-normal">
                <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-forest-100">
                  Formulář připravil e-mail! Pokud se neotevřel Váš klient, zkopírujte sumář tlačítkem a pošlete jej na <strong>{companyEmail}</strong>.
                </span>
              </div>
            )}
           
          </div>

          {/* 3. Kontaktní údaje pro doručení nabídky */}
          <div className="lg:col-span-7 order-3 lg:order-2 space-y-5 border-t lg:border-t-0 border-forest-100 pt-5 lg:pt-0" id="calculator-contact-section">
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-forest-450 font-bold">
                Vaše kontaktní údaje pro doručení nabídky
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-600 mb-1">
                    Jméno a příjmení: *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Např. Jan Novák"
                    className="w-full px-3 py-1.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 text-forest-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest-600 mb-1">
                    Telefonní číslo: *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Např. +420 777 123 456"
                    className="w-full px-3 py-1.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 text-forest-950"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-600 mb-1">
                    E-mailová adresa: *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Např. jan.novak@email.cz"
                    className="w-full px-3 py-1.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 text-forest-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest-600 mb-1">
                    Adresa dodání (obec, ulice, čp):
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Např. Křemže, Česká 1, 382 03"
                    className="w-full px-3 py-1.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 text-forest-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-600 mb-1">
                  Doplňující specifikace požadavku (volitelná délka polen, samovýroba, apod.):
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Např. preferuji polínka o délce 25 cm, vyzvednutí ideálně v odpoledních hodinách..."
                  className="w-full px-3 py-1.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 text-forest-950 cursor-text"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-forest-800 hover:bg-forest-900 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                Odeslat poptávku e-mailem
              </button>
              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="bg-forest-50 hover:bg-forest-100 border border-forest-250 text-forest-800 font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    Zkopírováno!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Kopírovat text
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </section>

    </article>
  );
}
