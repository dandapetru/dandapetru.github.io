/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TreePine, Calendar, Landmark, Trees, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import { NewsItem, WoodProduct } from '../types.js';

interface HeroProps {
  aboutTitle: string;
  aboutText: string;
  latestNews: NewsItem[];
  woodProducts: WoodProduct[];
  setActivePage: (page: string) => void;
  onSelectNews: (news: NewsItem) => void;
}

export default function Hero({ aboutTitle, aboutText, latestNews, woodProducts, setActivePage, onSelectNews }: HeroProps) {
  return (
    <div className="space-y-12" id="hero-root-container">
      
      {/* 1. Brand Hero Panel */}
      <section className="relative bg-forest-950/65 backdrop-blur-md rounded-2xl overflow-hidden border border-forest-800/80 shadow-xl" id="hero-banner-section">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/75 via-forest-950/45 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-24 md:px-12 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-xs font-mono font-medium text-forest-300">
            <Landmark className="h-3 w-3 text-forest-400" />
            Biskupství českobudějovické
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight max-w-2xl tracking-wide" id="hero-main-title">
            Hospodaříme v Jižních Čechách s respektem k tradici a stvoření
          </h1>
          
          <p className="text-forest-200 text-base sm:text-lg max-w-xl leading-relaxed font-light" id="hero-main-subtitle">
            Odpovědná správa církevního lesního majetku, šetrná těžba, rozsáhlé zalesňování a přímé dodávky palivového dřeva pro obyvatele i firmy.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-3" id="hero-banner-ctas">
            <button
              onClick={() => setActivePage('wood')}
              className="px-6 py-3 bg-forest-500 hover:bg-forest-600 text-white font-semibold rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer text-sm"
              id="hero-cta-wood"
            >
              Ceník a kalkulačka dřeva
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActivePage('contacts')}
              className="px-6 py-3 bg-forest-900 border border-forest-700 hover:bg-forest-800 text-white font-medium rounded-lg transition flex items-center gap-2 cursor-pointer text-sm"
              id="hero-cta-contact"
            >
              <Phone className="h-4 w-4 text-forest-300" />
              Kontaktní údaje
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Forestry Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-section">
        {[
          { icon: Trees, value: '5 400+ ha', label: 'Spravovaná plocha', subtitle: 'Lesní půda diecéze' },
          { icon: TreePine, value: '120 000+', label: 'Vysázených stromků', subtitle: 'Jarní kampaň 2026' },
          { icon: ShieldCheck, value: 'PEFC / FSC', label: 'Eko-certifikace', subtitle: 'Trvale udržitelné lesy' },
          { icon: Calendar, value: 'Staletá', label: 'Péče a tradice', subtitle: 'Předávaná generacemi' },
        ].map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div 
              key={i} 
              id={`stat-card-${i}`}
              className="bg-white p-5 rounded-xl border border-forest-100 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="bg-forest-50 p-2.5 rounded-lg w-fit border border-forest-100 mb-3" id={`stat-icon-bg-${i}`}>
                <StatIcon className="h-5 w-5 text-forest-600" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-serif font-semibold text-forest-900 tracking-tight" id={`stat-value-${i}`}>{stat.value}</div>
                <div className="text-xs sm:text-sm font-medium text-forest-800 mt-1" id={`stat-label-${i}`}>{stat.label}</div>
                <div className="text-[11px] text-forest-400 mt-0.5" id={`stat-sub-${i}`}>{stat.subtitle}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Welcome Split Section */}
      <section className="grid lg:grid-cols-12 gap-8 items-stretch" id="welcome-intro-section">
        {/* Left pitch description */}
        <div className="lg:col-span-12 bg-white rounded-xl border border-forest-100 p-6 sm:p-8 flex flex-col justify-between" id="intro-card">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-forest-900 font-semibold tracking-tight" id="intro-title">
              {aboutTitle}
            </h2>
            <p className="text-forest-800 text-sm sm:text-base leading-relaxed whitespace-pre-line" id="intro-body">
              {aboutText.slice(0, 360)}...
            </p>
          </div>
          <div className="pt-6 border-t border-forest-100 flex items-center justify-between" id="intro-footer">
            <span className="text-xs text-forest-400 italic">Jihočeské katolické lesy s.r.o.</span>
            <button
              onClick={() => setActivePage('about')}
              className="text-forest-600 hover:text-forest-700 font-semibold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
              id="intro-read-more"
            >
              Číst více o naší historii a poslání
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Latest News Strip */}
      <section className="space-y-6" id="latest-news-section">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-forest-900 font-semibold tracking-tight" id="news-section-title">
              Nové aktuality z lesů
            </h3>
            <p className="text-xs text-forest-500 mt-1">Co se právě děje na našich polesích a revírech.</p>
          </div>
          <button
            onClick={() => setActivePage('news')}
            className="text-xs sm:text-sm font-semibold text-forest-600 hover:text-forest-700 flex items-center gap-1 cursor-pointer"
            id="news-section-all-link"
          >
            Všechny aktuality
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="news-section-grid">
          {latestNews.slice(0, 3).map((item) => (
            <div 
              key={item.id} 
              id={`latest-news-card-${item.id}`}
              className="bg-white rounded-xl border border-forest-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full cursor-pointer group"
              onClick={() => onSelectNews(item)}
            >
              {item.imageUrl ? (
                <div className="h-48 overflow-hidden relative" id={`latest-news-img-box-${item.id}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    id={`latest-news-img-${item.id}`}
                  />
                  <div className="absolute top-3 left-3 bg-forest-900/90 backdrop-blur-xs text-white text-[10px] uppercase font-semibold font-mono tracking-wider px-2 py-1 rounded" id={`latest-news-cat-${item.id}`}>
                    {item.category === 'lesnictvi' && 'Lesnictví'}
                    {item.category === 'prodej' && 'Prodej'}
                    {item.category === 'verejnost' && 'Pro veřejnost'}
                    {item.category === 'zpravy' && 'Zpráva'}
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-forest-800 to-forest-950 p-6 flex flex-col justify-between text-white" id={`latest-news-img-fallback-${item.id}`}>
                  <Trees className="h-8 w-8 text-forest-300 opacity-60" />
                  <span className="text-[10px] uppercase font-semibold font-mono tracking-wider text-forest-200 bg-forest-900/60 w-fit px-2 py-0.5 rounded">
                    {item.category === 'lesnictvi' && 'Lesnictví'}
                    {item.category === 'prodej' && 'Prodej'}
                    {item.category === 'verejnost' && 'Pro veřejnost'}
                    {item.category === 'zpravy' && 'Zpráva'}
                  </span>
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4" id={`latest-news-text-box-${item.id}`}>
                <div className="space-y-2">
                  <span className="text-[11px] text-forest-400 font-mono" id={`latest-news-date-${item.id}`}>{item.date}</span>
                  <h4 className="font-serif font-semibold text-forest-950 line-clamp-2 leading-snug group-hover:text-forest-600 transition" id={`latest-news-headline-${item.id}`}>
                    {item.title}
                  </h4>
                  <p className="text-forest-600 text-xs line-clamp-3 leading-relaxed" id={`latest-news-summary-${item.id}`}>
                    {item.pithySummary}
                  </p>
                </div>
                <div className="text-xs text-forest-600 font-semibold flex items-center gap-1 pt-2 border-t border-forest-50" id={`latest-news-author-${item.id}`}>
                  <span id={`news-author-name-${item.id}`}>{item.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
