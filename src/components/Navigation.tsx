import React from 'react';
import { Trees, ShieldAlert, BookOpen, Newspaper, TreePine, PhoneCall, Settings, Calculator, Award, Image } from 'lucide-react';
import OrgLogo from './OrgLogo.js';

interface NavigationProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isAdmin: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

export default function Navigation({ activePage, setActivePage, isAdmin, setIsAdminMode }: NavigationProps) {
  return (
    <header className="sticky top-0 z-40 bg-forest-900 text-white shadow-md border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { setActivePage('home'); setIsAdminMode(false); }} 
            className="flex items-center space-x-3 cursor-pointer group"
            id="nav-logo-container"
          >
            <div className="relative flex items-center justify-center overflow-hidden h-16 w-16 rounded-full border border-forest-500/30 group-hover:bg-forest-50 bg-white transition shadow-sm" id="nav-logo-icon">
              <img 
                src="images/logo.png" 
                alt="Logo" 
                className="h-15 w-15 object-contain rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
              />
              <OrgLogo className="h-15 w-15" />
            </div>
            <div>
              <span className="font-serif text-base sm:text-xl font-semibold tracking-wide flex items-center gap-1.5" id="nav-company-name">
                Jihočeské katolické lesy
              </span>
              <span className="text-[10px] sm:text-xs text-forest-100 block mt-0.5 font-mono tracking-wider uppercase">
                Biskupství Českobudějovické
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex space-x-1" id="desktop-nav">
            {[
              { id: 'home', label: 'Úvod', icon: TreePine },
              { id: 'about', label: 'O nás', icon: BookOpen },
              { id: 'pricing', label: 'Ceník', icon: Calculator },
              { id: 'certifications', label: 'Certifikace', icon: Award },
              { id: 'gallery', label: 'Fotogalerie', icon: Image },
              { id: 'news', label: 'Aktuality', icon: Newspaper },
              { id: 'contacts', label: 'Kontakty', icon: PhoneCall },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsAdminMode(false);
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition duration-150 gap-1.5 cursor-pointer
                    ${isActive 
                      ? 'bg-forest-700 text-white shadow-inner border-b-2 border-forest-300' 
                      : 'text-forest-100 hover:bg-forest-800 hover:text-white'
                    }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2" id="nav-actions" />

        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden bg-forest-950 border-t border-forest-900 overflow-x-auto scrollbar-none" id="mobile-nav-bar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex items-center space-x-1.5 p-1.5 min-w-max">
          {[
            { id: 'home', label: 'Úvod', icon: TreePine },
            { id: 'about', label: 'O nás', icon: BookOpen },
            { id: 'pricing', label: 'Ceník', icon: Calculator },
            { id: 'certifications', label: 'Certifikace', icon: Award },
            { id: 'gallery', label: 'Galerie', icon: Image },
            { id: 'news', label: 'Aktuality', icon: Newspaper },
            { id: 'contacts', label: 'Kontakty', icon: PhoneCall },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => {
                  setActivePage(item.id);
                  setIsAdminMode(false);
                }}
                className={`flex items-center px-3.5 py-1.5 text-[11px] font-semibold transition rounded-md gap-1.5 cursor-pointer whitespace-nowrap
                  ${isActive 
                    ? 'bg-forest-800 text-white' 
                    : 'text-forest-300 hover:text-white'
                  }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
