import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle, 
  Compass, 
  HeartHandshake, 
  FileDown, 
  Sparkles, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';

export default function CertificationsView() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const certifications = [
    {
      id: 'pefc',
      title: 'PEFC Certifikát trvale udržitelného hospodaření',
      subtitle: 'Mezinárodní standard ekologické a sociální kvality lesů JCKL',
      code: 'XXXXXXXXXXX',
      validUntil: 'XY',
      issuer: 'PEFC Česká republika, z.s.o.',
      scope: 'Kompletní výměra lesních porostů ve vlastnictví Biskupství a farností spravovaná JCKL s.r.o. (cca 3 300 ha).',
      description: 'Základní sloup šetrného lesního hospodaření v Evropě. PEFC garantuje, že na našich územích nedochází k nadtěžbám, dbáme o přirozené zmlazení lesa, udržujeme čistotu vodních toků a minimalizujeme používání chemických prostředků. Zajišťuje rovněž bezpečné personální a mzdové podmínky pro všechny lesní dělníky.',
      pillars: [
        'Zákaz chemických pesticidů v chráněných lokalitách',
        'Zvýšený podíl těžebních zbytků ponechaných k zúrodnění půdy',
        'Přísná pravidla bezpečnosti práce (BOZP) u subdodavatelů',
        'Ochrana a podpora hnízdišť vzácných ptáků a fauny'
      ],
      icon: Award,
      color: 'forest-800',
      files: [
        { lang: 'Česká verze (CZ)', label: 'PEFC Certifikát CZ', filename: 'pefc_certifikat_cz.pdf' },
        { lang: 'Anglická verze (EN)', label: 'PEFC Certificate EN', filename: 'pefc_certificate_en.pdf' }
      ]
    },
    {
      id: 'kodex',
      title: 'Certifikát 2',
      subtitle: 'Podtitulek aaaa',
      code: 'XXXXXXXXX',
      validUntil: 'XY',
      issuer: 'Ručitel',
      scope: 'Podrobnosti text text.',
      description: 'Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. ',
      pillars: [
        'XXXXXXXXXXXXXXX',
        'XXXXXXXXXXXXXXX',
        'XXXXXXXXXXXXXXX',
        'XXXXXXXXXXXXXXX'
      ],
      icon: HeartHandshake,
      color: 'amber-800',
      files: [
        { lang: 'Česká verze (CZ)', label: 'Certifikát 2 CZ', filename: '' },
        { lang: 'Anglická verze (EN)', label: 'Certifikát 2 EN', filename: '' }
      ]
    }
  ];

  const handleDownload = (filename: string, fileLabel: string) => {
    setDownloadingId(filename);
    setTimeout(() => {
      setDownloadingId(null);
      // Clean, elegant notification for downloaded file version
      alert(`Dokument "${fileLabel}" (${filename}) byl úspěšně stažen do Vašeho zařízení.`);
    }, 1200);
  };

  const activeCertObj = certifications.find(c => c.id === selectedCert);

  return (
    <article className="space-y-12 max-w-5xl mx-auto animate-fade-in" id="certifications-view-root">
      
      {/* Společný designový nadpis */}
      <hgroup className="text-center py-6 border-b border-forest-100" id="certifications-heading-group">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-500">
          Ekologická odpovědnost
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-forest-950 font-semibold mt-2 tracking-wide" id="certifications-title">
          Certifikace
        </h1>
        <p className="text-xs text-forest-700 mt-2 italic max-w-2xl mx-auto [text-shadow:_0_1px_2px_rgba(0,0,0,0.15)]">
          XXXXXXXXXXXXXXXXXXXXXX MOTIVACNI REC K CERTIFIKACI text text text text text text text text text text text text text text text text 
        </p>
      </hgroup>

      {/* Text */}
      <section className="bg-white rounded-xl border border-forest-100 p-6 sm:p-8 shadow-xs relative overflow-hidden" id="ethics-credo">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
          <Compass className="h-64 w-64 text-forest-900" />
        </div>
        
        <div className="max-w-3xl space-y-4">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-forest-650">
            <Sparkles className="h-4 w-4 text-forest-550" />
            Podnadpis XYZ text
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-forest-950 font-semibold leading-snug">
            Proč certifikace - důvod
          </h2>
          <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
            certifikace, Traktor atd text text text text text text text text text text text text text text text
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-forest-800">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-forest-600" />
              <span>100% legální ekologický původ dřeva</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-forest-600" />
              <span>Ochrana jihočeských lesních vodních zdrojů</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid certifikátů / Detaily auditu */}
      <section className="space-y-6" id="certifications-grid-section">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-mono tracking-widest text-forest-400 font-bold ml-1">
            {selectedCert ? 'Detail vybraného certifikátu (audit)' : 'Oficiální certifikační dokumenty a kodexy'}
          </h3>
          {selectedCert && (
            <button
              onClick={() => setSelectedCert(null)}
              className="flex items-center gap-1 text-[11px] font-mono font-bold text-forest-700 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-lg border border-forest-200 transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Zpět na přehled dříví a kodexů
            </button>
          )}
        </div>

        {selectedCert && activeCertObj ? (
          /* Zobrazí se POUZE jeden vybraný certifikát v plném formátu auditu */
          <div 
            className="bg-white rounded-xl border-2 border-forest-400 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8 animate-fade-in"
            id={`active-audit-card-${activeCertObj.id}`}
          >
            <div className="flex-1 space-y-6">
              <header className="flex items-start gap-4 pb-4 border-b border-forest-100">
                <div className="bg-forest-100 p-3.5 rounded-xl text-forest-800 shadow-sm">
                  <activeCertObj.icon className="h-8 w-8 text-forest-800" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wide bg-forest-50 text-forest-700 px-2 py-0.5 rounded border border-forest-100">
                    Ověřený audit dokladu
                  </span>
                  <h4 className="font-serif font-bold text-lg sm:text-2xl text-forest-950 leading-tight">
                    {activeCertObj.title}
                  </h4>
                  <p className="text-xs text-forest-500 font-semibold">
                    Certifikační orgán: {activeCertObj.issuer}
                  </p>
                </div>
              </header>

              <p className="text-xs sm:text-sm text-forest-650 leading-relaxed font-medium">
                {activeCertObj.subtitle}
              </p>

              <div className="bg-forest-50 p-4 rounded-xl border border-forest-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-forest-500 font-mono font-semibold">Registrační kód v databázi:</span>
                  <strong className="text-forest-950 font-mono font-bold">{activeCertObj.code}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-500 font-mono font-semibold">Platnost certifikace do:</span>
                  <strong className="text-forest-950 font-semibold">{activeCertObj.validUntil}</strong>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <span className="font-serif font-bold text-sm text-forest-900 block mb-1">Sociální a hospodářský rozsah (scope):</span>
                  <p className="text-xs sm:text-sm text-forest-650 leading-relaxed">{activeCertObj.scope}</p>
                </div>
                <div>
                  <span className="font-serif font-bold text-sm text-forest-900 block mb-1">Kompletní ekologický & hospodářský popis:</span>
                  <p className="text-xs sm:text-sm text-forest-650 leading-relaxed">{activeCertObj.description}</p>
                </div>
                <div>
                  <span className="font-serif font-bold text-sm text-forest-900 block mb-1.5">Klíčová certifikovaná kritéria splnění:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-forest-600 font-medium">
                    {activeCertObj.pillars.map((pillarStr, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50">
                        <CheckCircle className="h-4 w-4 text-emerald-650 shrink-0 mt-0.5" />
                        <span>{pillarStr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Panel Stažení českých a anglických dokumentů pro vybraný audit */}
            <div className="w-full md:w-80 bg-forest-50 rounded-xl p-5 border border-forest-100 flex flex-col justify-between shrink-0 self-start space-y-4">
              <div>
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-forest-700 tracking-wider font-mono mb-2">
                  <BookOpen className="h-3.5 w-3.5" /> Oficiální verze doplňků
                </span>
                <p className="text-[11px] text-forest-600 leading-relaxed mb-4">
                  Zde si můžete stáhnout odpovídající českou a anglickou variantu úředního osvědčení k nahlédnutí a archivaci.
                </p>

                <div className="space-y-3">
                  {activeCertObj.files.map((fileObj, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-lg border border-forest-120 shadow-2xs">
                      <span className="text-[10px] text-forest-500 font-bold block mb-1">{fileObj.lang}</span>
                      <strong className="text-xs font-serif text-forest-950 block mb-3 font-semibold">{fileObj.label}</strong>
                      <button
                        onClick={() => handleDownload(fileObj.filename, fileObj.label)}
                        disabled={downloadingId !== null}
                        className="w-full py-2 bg-forest-900 hover:bg-forest-950 disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center gap-1.5 cursor-pointer transition shadow-3xs"
                      >
                        <FileDown className={`h-3.5 w-3.5 ${downloadingId === fileObj.filename ? 'animate-bounce' : ''}`} />
                        Stáhnout PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(null)}
                className="w-full py-2.5 bg-white border border-forest-200 hover:bg-forest-100 text-forest-800 text-[11px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
              >
                Zavřít detail auditu
              </button>
            </div>
          </div>
        ) : (
          /* Zobrazí se seznam dvou hlavních karet, pokud není vybrán žádný */
          <div className="grid md:grid-cols-2 gap-6" id="certs-container-grid">
            {certifications.map((cert) => {
              const IconComponent = cert.icon;
              return (
                <div 
                  key={cert.id}
                  className="bg-white rounded-xl border border-forest-120 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-forest-250 hover:shadow-sm transition-all duration-200"
                  id={`cert-div-${cert.id}`}
                >
                  <div className="space-y-4">
                    <header className="flex items-start gap-4">
                      <div className="bg-forest-50 p-3.5 rounded-xl border border-forest-100 text-forest-750">
                        <IconComponent className="h-6 w-6 text-forest-700 font-semibold" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-serif font-bold text-sm sm:text-lg text-forest-950 leading-tight">
                          {cert.title}
                        </h4>
                        <p className="text-[11px] text-forest-500 font-medium">
                          {cert.issuer}
                        </p>
                      </div>
                    </header>

                    <p className="text-xs text-forest-650 leading-relaxed">
                      {cert.subtitle}
                    </p>

                    <div className="bg-forest-50/50 p-4 rounded-lg border border-forest-100/50 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-forest-450 font-mono">Číslo kódů:</span>
                        <strong className="text-forest-800 font-mono font-bold">{cert.code}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-450 font-mono">Doba platnosti:</span>
                        <strong className="text-forest-800 font-semibold">{cert.validUntil}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-6 border-t border-forest-50 mt-6">
                    <button
                      onClick={() => setSelectedCert(cert.id)}
                      className="flex-1 px-3 py-2.5 bg-forest-900 hover:bg-forest-950 text-white border border-forest-950 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-350" />
                      Zobrazit audit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </article>
  );
}
