import React, { useState } from 'react';
import { Calendar, User, Tag, ArrowLeft, Trees, Newspaper, ArrowRight } from 'lucide-react';
import { NewsItem } from '../types.js';

interface NewsViewProps {
  news: NewsItem[];
  selectedNewsId: string | null;
  onSelectNews: (news: NewsItem | null) => void;
}

export default function NewsView({ news, selectedNewsId, onSelectNews }: NewsViewProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = news
    .filter((item) => {
      if (activeTab === 'all') return true;
      return item.category === activeTab;
    })
    .filter((item) => {
      const matchText = `${item.title} ${item.pithySummary} ${item.content}`.toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentArticle = news.find((item) => item.id === selectedNewsId);

  // Detail View of a single News Article
  if (currentArticle) {
    return (
      <article className="max-w-4xl mx-auto bg-white rounded-xl border border-forest-100 overflow-hidden shadow-sm" id="news-detail-container">
        
        {/* Banner Image */}
        {currentArticle.imageUrl ? (
          <div className="h-64 sm:h-96 w-full relative" id="news-detail-image-box">
            <img
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              id="news-detail-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="bg-forest-300 text-forest-950 text-xs font-mono font-bold tracking-widest px-3 py-1 rounded inline-block uppercase mb-3">
                {currentArticle.category === 'lesnictvi' && 'Lesnictví'}
                {currentArticle.category === 'prodej' && 'Prodej dřeva'}
                {currentArticle.category === 'verejnost' && 'Pro veřejnost'}
                {currentArticle.category === 'zpravy' && 'Zprávy a oznámení'}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-forest-800 to-forest-950 p-6 flex flex-col justify-end text-white" id="news-detail-fallback">
            <Trees className="h-12 w-12 text-forest-300 opacity-60 mb-4" />
            <span className="bg-forest-300 text-forest-950 text-xs font-mono font-bold tracking-widest px-3 py-1 rounded inline-block uppercase mb-2">
              {currentArticle.category === 'lesnictvi' && 'Lesnictví'}
              {currentArticle.category === 'prodej' && 'Prodej dřeva'}
              {currentArticle.category === 'verejnost' && 'Pro veřejnost'}
              {currentArticle.category === 'zpravy' && 'Zprávy a oznámení'}
            </span>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-forest-500 font-mono border-b border-forest-100 pb-4" id="news-detail-meta">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-forest-300" />
              Publikováno: {new Date(currentArticle.date).toLocaleDateString('cs-CZ')}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-forest-300" />
              Autor: {currentArticle.author}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-2xl sm:text-4xl text-forest-950 font-bold leading-tight" id="news-detail-title">
            {currentArticle.title}
          </h1>

          {/* Lead paragraph */}
          <p className="text-base sm:text-lg text-forest-800 font-medium italic border-l-2 border-forest-300 pl-4 leading-relaxed" id="news-detail-lead">
            {currentArticle.pithySummary}
          </p>

          {/* Core Content */}
          <div className="text-forest-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap space-y-4" id="news-detail-body">
            {currentArticle.content}
          </div>

          {/* Footer Back CTA */}
          <div className="pt-6 border-t border-forest-100 flex justify-between items-center" id="news-detail-footer">
            <button
              onClick={() => onSelectNews(null)}
              className="px-5 py-2.5 bg-forest-50 hover:bg-forest-100 border border-forest-200 hover:border-forest-300 rounded-lg text-xs sm:text-sm font-semibold text-forest-700 transition flex items-center gap-2 cursor-pointer"
              id="news-btn-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Zpět na přehled aktualit
            </button>
            <span className="text-xs text-forest-400 italic">Jihočeské katolické lesy s.r.o.</span>
          </div>
        </div>

      </article>
    );
  }

  // Grid/List of all news articles
  return (
    <div className="space-y-8" id="news-main-container">
      
      {/* Editorial Title Header */}
      <div className="text-center md:text-left space-y-2 border-b border-forest-100 pb-6" id="news-header">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-bold" id="news-title">
          Aktuality a zprávy z lesů
        </h1>
        <p className="text-sm text-forest-600 max-w-xl" id="news-description">
          Sledujte nejaktuálnější dění na našich polesích, plánované akce pro veřejnost a informace o lesním hospodaření.
        </p>
      </div>

      {/* Control Tools bar */}
      <div className="bg-white p-4 rounded-xl border border-forest-100 flex flex-col md:flex-row gap-4 items-center justify-between" id="news-filter-bar">
        
        {/* Category switcher */}
        <div className="flex flex-wrap gap-1.5 justify-center w-full md:w-auto" id="news-category-switch-container">
          {[
            { id: 'all', label: 'Všechny příspěvky' },
            { id: 'lesnictvi', label: 'Lesnictví' },
            { id: 'prodej', label: 'Prodej dřeva' },
            { id: 'verejnost', label: 'Akce pro veřejnost' },
            { id: 'zpravy', label: 'Zprávy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer border
                ${activeTab === tab.id
                  ? 'bg-forest-900 border-forest-900 text-white shadow-sm'
                  : 'bg-forest-50 hover:bg-forest-100 border-forest-100 text-forest-700'
                }`}
              id={`tab-filter-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input field */}
        <div className="relative w-full md:w-64" id="news-search-container">
          <input
            type="text"
            placeholder="Hledat v aktualitách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-forest-200 focus:outline-none focus:ring-1 focus:ring-forest-300 bg-forest-50/50"
            id="input-news-search"
          />
        </div>

      </div>

      {/* Grid of Results */}
      {filteredNews.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="news-cards-grid">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="bg-white rounded-xl border border-forest-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full cursor-pointer group"
              id={`news-card-${item.id}`}
            >
              {item.imageUrl ? (
                <div className="h-48 overflow-hidden relative" id={`news-card-img-box-${item.id}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    id={`news-card-img-${item.id}`}
                  />
                  <div className="absolute top-3 left-3 bg-forest-900/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold font-mono tracking-wider px-2 py-1 rounded" id={`news-card-tag-${item.id}`}>
                    {item.category === 'lesnictvi' && 'Lesnictví'}
                    {item.category === 'prodej' && 'Prodej'}
                    {item.category === 'verejnost' && 'Akce'}
                    {item.category === 'zpravy' && 'Zpráva'}
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-forest-800 to-forest-950 p-5 flex flex-col justify-between text-white" id={`news-card-fallback-${item.id}`}>
                  <Newspaper className="h-8 w-8 text-forest-300 opacity-60" />
                  <span className="bg-forest-900/60 w-fit text-[10px] uppercase font-bold font-mono tracking-wider px-2 py-0.5 rounded text-forest-200">
                    {item.category === 'lesnictvi' && 'Lesnictví'}
                    {item.category === 'prodej' && 'Prodej'}
                    {item.category === 'verejnost' && 'Akce'}
                    {item.category === 'zpravy' && 'Zpráva'}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4" id={`news-card-text-${item.id}`}>
                <div className="space-y-2">
                  <span className="text-[11px] text-forest-400 font-mono" id={`news-card-date-${item.id}`}>
                    {new Date(item.date).toLocaleDateString('cs-CZ')}
                  </span>
                  <h3 className="font-serif font-bold text-base text-forest-950 line-clamp-2 leading-snug group-hover:text-forest-600 transition" id={`news-card-title-${item.id}`}>
                    {item.title}
                  </h3>
                  <p className="text-forest-600 text-xs line-clamp-3 leading-relaxed" id={`news-card-summary-${item.id}`}>
                    {item.pithySummary}
                  </p>
                </div>
                
                <div className="pt-2 border-t border-forest-50 flex items-center justify-between text-xs text-forest-500" id={`news-card-footer-${item.id}`}>
                  <span className="font-medium" id={`news-card-author-${item.id}`}>{item.author}</span>
                  <span className="text-forest-600 group-hover:translate-x-1 transition flex items-center gap-0.5 font-bold text-[10px] uppercase" id={`news-card-more-label-${item.id}`}>
                    Číst článek <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl border border-forest-100 max-w-md mx-auto" id="news-no-results">
          <Newspaper className="h-10 w-10 text-forest-300 mx-auto mb-3" />
          <p className="text-forest-800 font-medium">Nebyly nalezeny žádné aktuality.</p>
          <p className="text-xs text-forest-400 mt-1">Zkuste změnit vyhledávaný výraz nebo vybranou kategorii.</p>
        </div>
      )}

    </div>
  );
}
