import React from 'react';
import { Trees, ShieldAlert, BookOpen, Newspaper, TreePine, PhoneCall, Settings } from 'lucide-react';

interface NavigationProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isAdmin: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

export default function Navigation({ activePage, setActivePage, isAdmin, setIsAdminMode }: NavigationProps) {
  return (
    <header className="sticky top-0 z-40 bg-forest-900 text-white shadow-md border-b border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div 
            onClick={() => { setActivePage('home'); setIsAdminMode(false); }} 
            className="flex items-center space-x-3 cursor-pointer group"
            id="nav-logo-container"
          >
            <div className="bg-forest-800 p-2.5 rounded-lg border border-forest-700 group-hover:bg-forest-700 transition" id="nav-logo-icon">
              <Trees className="h-6 w-6 text-forest-300" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-semibold tracking-wide flex items-center gap-1.5" id="nav-company-name">
                Jihočeské katolické lesy
              </span>
              <span className="text-xs text-forest-300 block -mt-1 font-mono tracking-wider uppercase">
                Biskupství Českobudějovické
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex space-x-1" id="desktop-nav">
            {[
              { id: 'home', label: 'Úvod', icon: TreePine },
              { id: 'about', label: 'O nás', icon: BookOpen },
              { id: 'news', label: 'Aktuality', icon: Newspaper },
              { id: 'wood', label: 'Prodej dřeva', icon: Trees },
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
                  className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition duration-150 gap-2 cursor-pointer
                    ${isActive 
                      ? 'bg-forest-700 text-white shadow-inner border-b-2 border-forest-300' 
                      : 'text-forest-100 hover:bg-forest-800 hover:text-white'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2" id="nav-actions" />

        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden bg-forest-950 border-t border-forest-900" id="mobile-nav-bar">
        <div className="grid grid-cols-5 px-1 py-1">
          {[
            { id: 'home', label: 'Úvod', icon: TreePine },
            { id: 'about', label: 'O nás', icon: BookOpen },
            { id: 'news', label: 'Aktuality', icon: Newspaper },
            { id: 'wood', label: 'Dřevo', icon: Trees },
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
                className={`flex flex-col items-center justify-center py-2 text-[10px] font-medium transition rounded-md cursor-pointer
                  ${isActive 
                    ? 'bg-forest-800 text-white' 
                    : 'text-forest-300 hover:text-white'
                  }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
