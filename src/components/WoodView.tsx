/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WoodProduct } from '../types.js';
import { Trees, Calculator, Check, ShoppingBag, Send, AlertCircle, FileText } from 'lucide-react';

interface WoodViewProps {
  woodProducts: WoodProduct[];
}

export default function WoodView({ woodProducts }: WoodViewProps) {
  // Calculator state
  const [selectedProductId, setSelectedProductId] = useState<string>(woodProducts[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(5);
  const [moisturePreference, setMoisturePreference] = useState<'čerstvé' | 'suché'>('suché');
  
  // Form contact state
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  
  // Status check
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('');

  const selectedProduct = woodProducts.find((p) => p.id === selectedProductId);

  // Quick calculations
  const priceWithTax = selectedProduct ? selectedProduct.price : 0;
  const totalPrice = priceWithTax * quantity;
  
  // Estimate weight/volume indicators for the user
  const estimatedWeight = selectedProduct
    ? selectedProduct.category === 'palivove'
      ? selectedProduct.woodType.toLowerCase().includes('buk') || selectedProduct.woodType.toLowerCase().includes('dub')
        ? quantity * 450 // approx kg per prms of dry hardwood
        : quantity * 320 // approx kg per prms of dry softwood
      : quantity * 750 // m3 raw hardwood/softwood approx
    : 0;

  const handleCalculateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname || !email || !phone) {
      setErrorText('Prosím vyplňte jméno, email a telefon pro kontakt.');
      return;
    }
    setErrorText('');
    setIsSubmitted(true);
    
    // Auto reset after 8 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFullname('');
      setEmail('');
      setPhone('');
      setAddress('');
      setMessage('');
    }, 8000);
  };

  return (
    <div className="space-y-12" id="wood-root-container">
      
      {/* 1. Header Banner */}
      <div className="text-center md:text-left space-y-2 border-b border-forest-100 pb-6" id="wood-header">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-bold" id="wood-title">
          Prodej dřeva stabilní kvality
        </h1>
        <p className="text-sm text-forest-600 max-w-xl" id="wood-description">
          Nabízíme certifikované jehličnaté i listnaté dřevo přímo z našich jihočeských polesí. Garantovaný původ, transparentní měření a férové ceny.
        </p>
      </div>

      {/* 2. Interactive Calculator and Inquiry Form Section */}
      <section className="bg-white rounded-2xl border border-forest-100 overflow-hidden shadow-sm grid lg:grid-cols-12" id="wood-calculator-section">
        
        {/* Left Side: Parameters and Calculation */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6" id="wood-calc-left-col">
          <div className="flex items-center gap-2.5 text-forest-900 border-b border-forest-50 pb-3" id="wood-calc-title-box">
            <Calculator className="h-5.5 w-5.5 text-forest-300" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold">Kalkulátor objednávek dříví</h2>
          </div>

          <div className="space-y-4" id="wood-calc-inputs">
            
            {/* Product selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-700 uppercase tracking-wider block">Vyberte sortiment dříví:</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const selected = woodProducts.find((p) => p.id === e.target.value);
                  if (selected && selected.category === 'kulatina') {
                    setQuantity(10); // Standard m3 is larger
                  } else {
                    setQuantity(5);
                  }
                }}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-forest-50/50 font-medium"
                id="select-calc-product"
              >
                {woodProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.price.toLocaleString('cs-CZ')} Kč / {p.unit} ({p.woodType})
                  </option>
                ))}
              </select>
            </div>

            {/* Range quantity selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700 uppercase tracking-wider block">
                  Množství ({selectedProduct?.unit || 'metrů'}):
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-3 py-2 text-sm rounded-lg border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-forest-50/50 font-semibold"
                    id="input-calc-quantity"
                  />
                  <span className="text-sm font-medium text-forest-600">{selectedProduct?.unit}</span>
                </div>
              </div>

              {/* Moisture selectors for logs/firewood */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-700 uppercase tracking-wider block">Preference vlhkosti dříví:</label>
                <div className="flex space-x-2">
                  {['čerstvé', 'suché'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMoisturePreference(opt as any)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition duration-150 cursor-pointer text-center
                        ${moisturePreference === opt
                          ? 'bg-forest-900 border-forest-900 text-white'
                          : 'bg-forest-50 border-forest-200 hover:bg-forest-100 text-forest-700'
                        }`}
                      id={`btn-moisture-${opt}`}
                    >
                      {opt === 'suché' ? 'Suché (vysušené)' : 'Vzduchovyschlé/čerstvé'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider bar for quick changes */}
            <div className="space-y-1 pt-1">
              <input
                type="range"
                min="1"
                max={selectedProduct?.category === 'kulatina' ? '50' : '30'}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-forest-100 rounded-lg appearance-none cursor-pointer accent-forest-300"
                id="slider-calc-range"
              />
              <div className="flex justify-between text-[11px] text-forest-400 font-mono">
                <span>Min: 1 {selectedProduct?.unit}</span>
                <span>Max: {selectedProduct?.category === 'kulatina' ? '50' : '30'} {selectedProduct?.unit}</span>
              </div>
            </div>

          </div>

          {/* Pricing Highlight Output Panel */}
          <div className="bg-forest-50/80 rounded-xl p-5 border border-forest-100 grid sm:grid-cols-2 gap-4 items-center" id="wood-calc-summary-panel">
            <div className="space-y-1">
              <span className="text-xs text-forest-500 font-medium tracking-tight">Celková kalkulovaná cena:</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-forest-950" id="calc-total-czk">
                {totalPrice.toLocaleString('cs-CZ')} <span className="text-lg">Kč</span>
              </div>
              <p className="text-[10px] text-forest-400 italic">Cena je konečná, bez dopravy (stanovuje se dle km).</p>
            </div>

            <div className="text-xs text-forest-600 space-y-1.5 border-t sm:border-t-0 sm:border-l border-forest-100 pt-3 sm:pt-0 sm:pl-4 font-mono">
              <div className="flex justify-between">
                <span>Jednotková cena:</span>
                <span className="font-semibold text-forest-950">{priceWithTax} Kč/{selectedProduct?.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Orientační hmotnost:</span>
                <span className="font-semibold text-forest-950">~ {estimatedWeight.toLocaleString('cs-CZ')} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Doporučený dovoz:</span>
                <span className="font-semibold text-forest-950">
                  {estimatedWeight > 4000 ? 'Nákladní auto (kontejner)' : 'Multicar / Vlek'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-forest-500 flex gap-2 items-start" id="calc-eco-notice">
            <AlertCircle className="h-4 w-4 text-forest-300 shrink-0 mt-0.5" />
            <p>Odběr probíhá z našich skládek u Hluboké nad Vltavou nebo Nových Hradů. Možnost zajištění dopravy hydraulickou rukou na vaši adresu. Konečnou cenu dopravy vám propočítáme v reakci na tuto poptávku.</p>
          </div>
        </div>

        {/* Right Side: Inquiry Contact Form */}
        <div className="lg:col-span-5 bg-forest-50 border-t lg:border-t-0 lg:border-l border-forest-100 p-6 sm:p-8" id="wood-calc-right-form">
          {isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8" id="wood-success-card">
              <div className="bg-forest-900 text-white p-3.5 rounded-full border border-forest-300 animate-bounce" id="success-done-icon">
                <Check className="h-6 w-6 text-forest-300" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-forest-950">Poptávka byla odeslána!</h3>
                <p className="text-xs text-forest-600 leading-relaxed max-w-xs">
                  Děkujeme! Vaše nezávazná poptávka na <strong>{quantity} {selectedProduct?.unit} {selectedProduct?.name}</strong> byla zaregistrována.
                </p>
                <p className="text-xs text-forest-500 italic">
                  Marie Dvořáková ze správy prodeje dříví vás kontaktuje na email <strong>{email}</strong> nebo telefonicky k odsouhlasení termínu závozu a dopravy.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCalculateInquiry} className="space-y-3.5" id="form-wood-inquiry">
              <div>
                <span className="text-[10px] tracking-wider font-semibold text-forest-500 uppercase block mb-1">Nezávazná rezervace</span>
                <h3 className="font-serif text-lg font-bold text-forest-950 leading-tight">Odeslat poptávku</h3>
              </div>

              {errorText && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex gap-1.5 items-center" id="form-inquiry-err">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-forest-600 uppercase tracking-wide block">Celé jméno / Firma:</label>
                <input
                  type="text"
                  required
                  placeholder="např. Jan Novák"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-white"
                  id="inpt-fullname"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-forest-600 uppercase tracking-wide block">E-mailová adresa:</label>
                  <input
                    type="email"
                    required
                    placeholder="novak@email.cz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-white"
                    id="inpt-email"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-forest-600 uppercase tracking-wide block">Telefonní číslo:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+420 777 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-white"
                    id="inpt-phone"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-forest-600 uppercase tracking-wide block">Požadovaná adresa dodání dříví:</label>
                <input
                  type="text"
                  placeholder="např. Lipno nad Vltavou 105"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-white"
                  id="inpt-delivery-address"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-forest-600 uppercase tracking-wide block">Poznámka k objednávce (např. požadovaná délka polen):</label>
                <textarea
                  rows={2}
                  placeholder="např. prosím polena délky 50cm, příjezdová cesta úzká"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-white"
                  id="inpt-message"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-forest-900 border border-forest-950 text-white font-semibold rounded text-xs uppercase tracking-wider hover:bg-forest-850 cursor-pointer shadow flex items-center justify-center gap-1.5"
                id="btn-submit-inquiry"
              >
                <Send className="h-3.5 w-3.5 text-forest-300" />
                Odeslat nezávaznou poptávku
              </button>
            </form>
          )}
        </div>

      </section>

      {/* 3. Static Products Grid Display */}
      <section className="space-y-6" id="wood-list-catalog">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-forest-950 text-center" id="catalog-title">
          Kompletní ceník sortimentu dříví
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" id="catalog-grid">
          {woodProducts.map((p) => (
            <div 
              key={p.id} 
              id={`wood-product-card-${p.id}`}
              onClick={() => {
                setSelectedProductId(p.id);
                // Scroll smoothly to calculator
                document.getElementById('wood-calculator-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white rounded-xl border border-forest-100 p-5 shadow-xs flex flex-col justify-between hover:border-forest-300 transition cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start" id={`wood-card-hdr-${p.id}`}>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-mono
                    ${p.category === 'palivove' 
                      ? 'bg-orange-50 text-orange-850 border border-orange-100' 
                      : p.category === 'kulatina' 
                      ? 'bg-teal-50 text-teal-850 border border-teal-100'
                      : 'bg-emerald-50 text-emerald-850 border border-emerald-100'
                    }`}
                    id={`wood-card-category-tag-${p.id}`}
                  >
                    {p.category === 'palivove' && 'Palivové dříví'}
                    {p.category === 'kulatina' && 'Kulatina'}
                    {p.category === 'vzdustandard' && 'Ostatní sortiment'}
                  </span>
                  
                  {p.available ? (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1" id={`wood-card-avail-${p.id}`}>
                      <Check className="h-3.5 w-3.5" /> Skladem
                    </span>
                  ) : (
                    <span className="text-[10px] text-red-600 font-bold" id={`wood-card-unavail-${p.id}`}>Dočasně vyprodáno</span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-forest-950 group-hover:text-forest-600 transition leading-tight" id={`wood-card-name-${p.id}`}>
                    {p.name}
                  </h3>
                  <p className="text-[11px] font-mono text-forest-400 mt-0.5" id={`wood-card-type-${p.id}`}>{p.woodType}</p>
                </div>

                <p className="text-xs text-forest-600 line-clamp-3 leading-relaxed" id={`wood-card-desc-${p.id}`}>
                  {p.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-forest-50 flex items-center justify-between" id={`wood-card-pricing-row-${p.id}`}>
                <div>
                  <span className="text-[10px] text-forest-400 block -mb-0.5">Cena:</span>
                  <span className="text-xl font-serif font-bold text-forest-950" id={`wood-card-price-txt-${p.id}`}>
                    {p.price.toLocaleString('cs-CZ')} Kč
                  </span>
                  <span className="text-xs font-semibold text-forest-500 font-mono"> / {p.unit}</span>
                </div>
                <button
                  type="button"
                  className="p-2 bg-forest-50 hover:bg-forest-100 text-forest-600 rounded-lg border border-forest-100 shadow-xs cursor-pointer"
                  id={`wood-card-btn-opt-${p.id}`}
                >
                  <Calculator className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. Definition of volume labels */}
      <section className="bg-forest-100/50 rounded-xl p-6 border border-forest-150 grid md:grid-cols-3 gap-6" id="wood-definitions">
        <div className="space-y-1.5" id="def-prms">
          <h4 className="font-serif font-bold text-sm text-forest-950">Co je prms? (Prostorový metr sypaný)</h4>
          <p className="text-xs text-forest-600 leading-relaxed">Představuje volně sypaná štípaná polena nasypaná do krychle o rozměrech 1x1x1 metr. Je to standardní a nejčastější prodejní míra u palivového dřeva.</p>
        </div>
        <div className="space-y-1.5" id="def-prmr">
          <h4 className="font-serif font-bold text-sm text-forest-950">Co je prmr? (Prostorový metr srovnaný)</h4>
          <p className="text-xs text-forest-600 leading-relaxed">Představuje čistě poskládaná, vyrovnaná kulatá nebo štípaná polena pečlivě srovnaná do krychle o objemu 1 m³. Obsahuje až o 40% více dřevní hmoty než sypaný metr.</p>
        </div>
        <div className="space-y-1.5" id="def-m3">
          <h4 className="font-serif font-bold text-sm text-forest-950">Co je m³ (Plnoměrný metr / Plm)?</h4>
          <p className="text-xs text-forest-600 leading-relaxed">Jedná se o čistý kubík dřeva bez mezer. Tato nejvyšší jednotka dříví se používá primárně pro prodej a měření pilařské kulatiny nebo celých kmenů.</p>
        </div>
      </section>

    </div>
  );
}
