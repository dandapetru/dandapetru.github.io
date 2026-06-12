import React from 'react';
import { ContactPerson, SiteSettings, WebTexts } from '../types.js';
import { Phone, Mail, MapPin, Clock, Building, CreditCard, TreePine, Map } from 'lucide-react';

interface ContactsViewProps {
  contacts: ContactPerson[];
  settings: SiteSettings;
  webTexts: WebTexts;
}

export default function ContactsView({ contacts, settings, webTexts }: ContactsViewProps) {
  // Group contacts by department
  const groupedContacts: Record<string, ContactPerson[]> = {};
  const departmentOrder = ['Vedení společnosti', 'Lesní správa', 'Prodej', 'Terénní správa'];
  
  departmentOrder.forEach(dept => {
    groupedContacts[dept] = [];
  });
  
  contacts.forEach(c => {
    const dept = c.department || 'Ostatní';
    if (!groupedContacts[dept]) {
      groupedContacts[dept] = [];
    }
    groupedContacts[dept].push(c);
  });

  return (
    <div className="space-y-12" id="contacts-root-container">
      
      {/* Nadpis */}
      <hgroup className="text-center py-6 border-b border-forest-100" id="contacts-heading-group">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-500">
          Kontaktní informace & Revíry
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-forest-950 font-semibold mt-2 tracking-wide" id="contacts-title">
          {webTexts.contactsTitle}
        </h1>
        <p className="text-xs text-forest-700 mt-2 italic max-w-2xl mx-auto [text-shadow:_0_1px_2px_rgba(0,0,0,0.15)]" id="contacts-description">
          {settings.contactIntro}
        </p>
      </hgroup>

      {/* 2. Three Column Contact Info Layout */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="contacts-summary-grid">
        
        {/* HQ address card */}
        <div className="bg-white p-6 rounded-xl border border-forest-100 shadow-xs space-y-3.5" id="card-hq">
          <div className="bg-forest-50 p-3 rounded-lg w-fit border border-forest-100" id="icon-hq">
            <Building className="h-5 w-5 text-forest-600" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-base text-forest-950">{webTexts.contactsHQTitle}</h3>
            <p className="text-xs text-forest-500 mt-1 uppercase font-mono tracking-wider">{webTexts.contactsHQSubtitle}</p>
          </div>
          <p className="text-sm text-forest-800 leading-relaxed font-semibold">
            {settings.companyAddress}
          </p>
          <div className="pt-3 border-t border-forest-50 text-xs font-mono text-forest-600 space-y-1" id="hq-tax-details">
            <div>IČO: {settings.companyICO}</div>
            <div>DIČ: {settings.companyDIC}</div>
          </div>
        </div>

        {/* Office Hours Card */}
        <div className="bg-white p-6 rounded-xl border border-forest-100 shadow-xs space-y-3.5" id="card-hours">
          <div className="bg-forest-50 p-3 rounded-lg w-fit border border-forest-100" id="icon-hours">
            <Clock className="h-5 w-5 text-forest-600" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-base text-forest-950">{webTexts.contactsHoursTitle}</h3>
            <p className="text-xs text-forest-500 mt-1 uppercase font-mono tracking-wider">{webTexts.contactsHoursSubtitle}</p>
          </div>
          <p className="text-sm text-forest-800 leading-relaxed font-semibold">
            {settings.officeHours}
          </p>
          <p className="text-xs text-forest-500 leading-relaxed italic pt-3 border-t border-forest-50">
            Doporučujeme si schůzku předem sjednat telefonicky s vybraným pracovníkem.
          </p>
        </div>

        {/* Bank Connection Card */}
        <div className="bg-white p-6 rounded-xl border border-forest-100 shadow-xs space-y-3.5" id="card-bank">
          <div className="bg-forest-50 p-3 rounded-lg w-fit border border-forest-100" id="icon-bank">
            <CreditCard className="h-5 w-5 text-forest-600" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-base text-forest-950">{webTexts.contactsBankTitle}</h3>
            <p className="text-xs text-forest-500 mt-1 uppercase font-mono tracking-wider">{webTexts.contactsBankSubtitle}</p>
          </div>
          <p className="text-sm text-forest-800 leading-relaxed font-semibold font-mono">
            {settings.companyBank}
          </p>
          <p className="text-xs text-forest-500 leading-relaxed pt-3 border-t border-forest-50">
            Při úhradě dříví uvádějte jako variabilní symbol číslo skládkového lístku nebo číslo vygenerované faktury.
          </p>
        </div>

      </section>

      {/* 3. Dynamic Staff Directory Card Grid */}
      <section className="space-y-6" id="personnel-section">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-forest-950 text-center sm:text-left" id="personnel-title">
            {webTexts.contactsSectionTitle}
          </h2>
          <p className="text-xs text-forest-500 mt-1 text-center sm:text-left">
            {webTexts.contactsSectionSubtitle}
          </p>
        </div>

        <div className="space-y-12 animate-fade-in" id="personnel-grouped-containers">
          {Object.entries(groupedContacts)
            .filter(([_, groupContacts]) => groupContacts.length > 0)
            .map(([deptName, groupContacts]) => (
              <div key={deptName} className="space-y-6" id={`dept-group-${deptName.replace(/\s+/g, '-')}`}>
                <div className="border-b border-forest-100 pb-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-900 border-l-4 border-forest-750 pl-3">
                    {deptName}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id={`personnel-grid-${deptName.replace(/\s+/g, '-')}`}>
                  {groupContacts.map((c) => (
                    <div 
                      key={c.id} 
                      id={`contact-card-${c.id}`}
                      className="bg-white rounded-xl border border-forest-100 overflow-hidden shadow-xs hover:shadow-sm hover:border-forest-200 transition duration-200 flex flex-col justify-between"
                    >
                      <div className="p-5 flex gap-4 items-start" id={`contact-body-${c.id}`}>
                        
                        {/* Staff Portrait Photo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-forest-50 border border-forest-100" id={`contact-avatar-box-${c.id}`}>
                          {c.photoUrl ? (
                            <img 
                              src={c.photoUrl} 
                              alt={c.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                              id={`contact-avatar-img-${c.id}`}
                            />
                          ) : (
                            <div className="w-full h-full bg-forest-800 text-forest-300 flex items-center justify-center font-bold" id={`contact-avatar-fallback-${c.id}`}>
                              {c.name.split(' ').filter(p => !p.includes('.')).map(p => p[0]).join('').slice(0, 2)}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0" id={`contact-meta-box-${c.id}`}>
                          <span className="text-[9px] uppercase font-bold tracking-wider font-mono text-forest-500 bg-forest-50 border border-forest-100 px-2 py-0.5 rounded" id={`contact-dept-${c.id}`}>
                            {c.department}
                          </span>
                          
                          <h3 className="font-serif font-bold text-sm sm:text-base text-forest-950 truncate leading-tight group-hover:text-forest-600 transition pt-1.5" id={`contact-name-${c.id}`}>
                            {c.name}
                          </h3>
                          
                          <p className="text-xs text-forest-600 font-medium leading-tight" id={`contact-role-${c.id}`}>
                            {c.role}
                          </p>
                        </div>
                      </div>

                      {/* Action details footer */}
                      <div className="bg-forest-50 px-5 py-4 border-t border-forest-100 space-y-2 mt-auto" id={`contact-actions-${c.id}`}>
                        <a 
                          href={`tel:${c.phone}`} 
                          className="flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-forest-900 transition"
                          id={`contact-phone-link-${c.id}`}
                        >
                          <Phone className="h-3.5 w-3.5 text-forest-300 shrink-0" />
                          <span className="font-mono">{c.phone}</span>
                        </a>
                        
                        <a 
                          href={`mailto:${c.email}`} 
                          className="flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-forest-900 truncate transition"
                          id={`contact-email-link-${c.id}`}
                        >
                          <Mail className="h-3.5 w-3.5 text-forest-300 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </a>

                        {c.address && (
                          <div className="flex items-center gap-2 text-[11px] text-forest-600 break-words line-clamp-2 border-t border-forest-100/50 pt-2 mt-1" id={`contact-address-${c.id}`}>
                            <MapPin className="h-3.5 w-3.5 text-forest-300 shrink-0" />
                            <a 
                              href={(c.addressURL)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <span className="break-words">{c.address}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 4. Lokace na mapě */}
      <section className="bg-white rounded-2xl border border-forest-100 p-6 sm:p-8 grid md:grid-cols-12 gap-6 items-center" id="contacts-map-mock">
        <div className="md:col-span-4 space-y-3" id="map-mock-left">
          <div className="bg-forest-50 p-2.5 rounded-lg w-fit border border-forest-100">
            <Map className="h-5 w-5 text-forest-600" />
          </div>
          <h3 className="font-serif text-lg font-bold text-forest-950">Jak nás najdete</h3>
          <p className="text-xs text-forest-600 leading-relaxed">
            Centrála společnosti sídlí v XXXXXX.
          </p>
          <p className="text-xs text-forest-500 italic mt-1 leading-relaxed">
            Parkování je XXXXXX.
          </p>
          <a
            href="https://mapy.cz/zakladni?q=Rudolfovsk%C3%A1+t%C5%99.+10/24,+370+01+%C4%8Cesk%C3%A9+Bud%C4%9Bjovice"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-forest-500 hover:text-forest-600 cursor-pointer pt-2"
            id="link-mapy-cz"
          >
            Otevřít navigaci (Mapy.cz) &rarr;
          </a>
        </div>
        
        <div className="md:col-span-8 rounded-xl border border-forest-150 overflow-hidden relative h-56 w-full" id="map-mock-image-container">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
            alt="Jižní Čechy krajina"
            className="w-full h-full object-cover"
            id="map-landscape-image"
          />
          <div className="absolute inset-0 bg-forest-950/40 flex items-center justify-center p-4 text-center">
            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-lg shadow-md max-w-sm border border-forest-100 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-forest-500 block">Kancelář lesního úřadu</span>
              <p className="font-serif text-sm font-semibold text-forest-950 mt-1">České Budějovice, xxxx</p>
              <p className="text-[10px] text-forest-500 mt-0.5">Adresa, České Budějovice (fakturační sídlo)</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
