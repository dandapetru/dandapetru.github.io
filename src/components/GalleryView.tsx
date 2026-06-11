import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Calendar, 
  MapPin, 
  Filter,
  Sparkles,
  TreePine,
  Axe
} from 'lucide-react';
import { GalleryItem } from '../types.js';

export default function GalleryView({ galleryItems }: { galleryItems: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const initialGalleryItems: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Svit slunce v bukovém porostu',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200',
      category: 'reviry',
      description: 'Přirozené zmlazení pod zápojem mateřských buků a jedlí na revíru Hluboká.',
      date: 'Květen 2026'
    },
    {
      id: 'g2',
      title: 'Příprava bukových polen',
      imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200',
      category: 'pracoviste',
      description: 'Řezání a štípání palivového dřeva na skládkovém expedičním revíru pro Jižní Čechy.',
      date: 'Duben 2026'
    },
    {
      id: 'g3',
      title: 'Mlžné ráno v Novohradských horách',
      imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=1200',
      category: 'reviry',
      description: 'Smíšené lesy s vysokým zastoupením ohrožené jedle bělokoré v okolí Dobré Vody.',
      date: 'Květen 2026'
    },
    {
      id: 'g4',
      title: 'Zásoby na zimu',
      imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8c5c8?auto=format&fit=crop&q=80&w=1200',
      category: 'technika',
      description: 'Kvalitní vysušená polena rovnaná v zastřešených dřevnících připravená k odběru.',
      date: 'Březen 2026'
    },
    {
      id: 'g5',
      title: 'Podzimní cesta revírem Třeboň',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
      category: 'reviry',
      description: 'Malebná lesní komunikace udržovaná s ohledem na cykloturisty a šetrné lesní vyvážení dříví.',
      date: 'Listopad 2025'
    },
    {
      id: 'g6',
      title: 'Zasazení mladé sazenice',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
      category: 'pracoviste',
      description: 'Udržitelné zalesňování: pečlivá manuální výsadba melioračních buků do přirozeně kypré lesní půdy.',
      date: 'Květen 2026'
    },
    {
      id: 'g7',
      title: 'Svatohubertský rodinný den',
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1200',
      category: 'akce',
      description: 'Ukázky lesní pedagogiky pro děti a povídání s revírníky na vyhlídkovém lesním palouku.',
      date: 'Červen 2026'
    },
    {
      id: 'g8',
      title: 'Zimní pokrývka šumavských podhůří',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
      category: 'reviry',
      description: 'Zasněžené jehličnaté porosty v mrazivém tichu farního revíru Prachatice.',
      date: 'Leden 2026'
    }
  ];

  const categories = [
    { id: 'all', label: 'Všechny fotky' },
    { id: 'reviry', label: 'Naše revíry', icon: TreePine },
    { id: 'pracoviste', label: 'Lesní práce', icon: Axe },
    { id: 'technika', label: 'Dříví & Logistika', icon: ImageIcon },
    { id: 'akce', label: 'Akce s lidmi', icon: Sparkles }
  ];

  const itemsToUse = galleryItems && galleryItems.length > 0 ? galleryItems : initialGalleryItems;

  const filteredItems = selectedCategory === 'all'
    ? itemsToUse
    : itemsToUse.filter(item => item.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <article className="space-y-12 max-w-5xl mx-auto animate-fade-in" id="gallery-view-root">
      
      {/* Nadpis */}
      <hgroup className="text-center py-6 border-b border-forest-100" id="gallery-heading-group">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-500">
          Zajímavosti & život v lese
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-forest-950 font-semibold mt-2 tracking-wide" id="gallery-title">
          Fotogalerie JCKL
        </h1>
        <p className="text-xs text-forest-700 mt-2 italic max-w-2xl mx-auto [text-shadow:_0_1px_2px_rgba(0,0,0,0.15)]">
          Nahlédněte do nitra jihočeské přírody, prohlédněte si techniku při práci a podívejte se, jak pěstujeme zdravé, biologicky rozmanité církevní lesy.
        </p>
      </hgroup>

      {/* Filter tabů */}
      <section className="flex flex-wrap justify-center gap-1.5 sm:gap-2" id="gallery-filters">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setLightboxIndex(null); // Reset lightbox on category swap to prevent errors
              }}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg uppercase tracking-wider transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-forest-800 text-white shadow-md'
                  : 'bg-white border border-forest-150 text-forest-750 hover:bg-forest-50'
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5 hidden sm:inline" />}
              {cat.label}
            </button>
          );
        })}
      </section>

      {/* Bento grid fotogalerie */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-grid_elements">
        {filteredItems.map((item, index) => (
          <div 
            key={item.id}
            onClick={() => setLightboxIndex(index)}
            className="group bg-white rounded-xl overflow-hidden border border-forest-120 shadow-xs hover:border-forest-250 hover:shadow-md transition cursor-pointer relative"
            id={`gallery-item-${item.id}`}
          >
            {/* Image Container with Hover zoom and overlay */}
            <div className="aspect-video w-full overflow-hidden relative bg-forest-950">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 pointer-events-none"
              />
              {/* Overlay with magnifying glass icon */}
              <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-full shadow-lg text-forest-900 flex items-center justify-center">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>

              {/* Tag s kategorií */}
              <span className="absolute left-3 bottom-3 text-[10px] font-mono font-bold uppercase py-0.5 px-2 bg-forest-900/80 backdrop-blur-xs text-white rounded-md border border-forest-800">
                {categories.find(c => c.id === item.category)?.label || 'Les'}
              </span>
            </div>

            {/* Název a popis */}
            <div className="p-4 sm:p-5 space-y-1.5 bg-white">
              <header className="flex justify-between items-start gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-forest-950 line-clamp-1">
                  {item.title}
                </h3>
              </header>
              <p className="text-xs text-forest-600 leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <footer className="pt-2 border-t border-forest-50 flex justify-between items-center text-[10px] text-forest-450 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {item.date || 'Léto 2026'}
                </span>
                <span className="flex items-center gap-0.5 font-bold uppercase tracking-widest text-[#ceaf70]">
                  JCKL FOTO
                </span>
              </footer>
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200" 
          id="gallery-lightbox"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Panel */}
          <header className="flex justify-between items-center text-white p-2">
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <span className="bg-forest-800 text-white font-mono font-bold py-1 px-2.5 rounded-lg border border-forest-700">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
              <span className="hidden sm:inline font-mono">
                Kategorie: {categories.find(c => c.id === filteredItems[lightboxIndex].category)?.label}
              </span>
            </div>
            
            <button 
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              title="Zavřít galerii (Esc)"
            >
              <X className="h-6 w-6" />
            </button>
          </header>

          {/* Central Image Panel */}
          <div className="relative flex-1 flex items-center justify-center max-h-[75vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* Left Button */}
            <button 
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white hover:scale-105 transition active:scale-95 cursor-pointer border border-white/10"
              title="Předchozí fotka (Šipka vlevo)"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            {/* Active Image */}
            <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
              <img 
                src={filteredItems[lightboxIndex].imageUrl} 
                alt={filteredItems[lightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg shadow-2xl animate-fade-in border border-white/5 pointer-events-none"
              />
            </div>

            {/* Right Button */}
            <button 
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white hover:scale-105 transition active:scale-95 cursor-pointer border border-white/10"
              title="Další fotka (Šipka vpravo)"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

          </div>

          {/* Bottom Panel Description */}
          <footer className="bg-black/50 backdrop-blur-xs border border-white/10 text-white rounded-xl p-4 max-w-2xl mx-auto w-full text-center space-y-1.5" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-serif font-bold text-base sm:text-lg text-yellow-300 leading-tight">
              {filteredItems[lightboxIndex].title}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {filteredItems[lightboxIndex].description}
            </p>
            <div className="flex justify-center items-center gap-3 text-[10px] text-gray-400 font-mono">
              <span>{filteredItems[lightboxIndex].date}</span>
              <span>•</span>
              <span>Jihočeské katolické lesy s.r.o.</span>
            </div>
          </footer>

        </div>
      )}

    </article>
  );
}
