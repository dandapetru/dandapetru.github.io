import React from 'react';
import { BookOpen, TreePine, Heart, Shield, Award, Sparkles } from 'lucide-react';
import { SiteSettings, WebTexts } from '../types.js';

interface AboutViewProps {
  settings: SiteSettings;
  webTexts: WebTexts;
}

export default function AboutView({ settings, webTexts }: AboutViewProps) {
  return (
    <article className="space-y-12 max-w-5xl mx-auto" id="about-view-root">
      
      {/* Nadpis */}
      <hgroup className="text-center py-6 border-b border-forest-100" id="about-heading-group">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-500">Jihočeské katolické lesy s.r.o.</span>
        <h1 className="font-serif text-3xl sm:text-5xl text-forest-950 font-semibold mt-2 tracking-wide" id="about-main-title">
          {webTexts.aboutViewTitle}
        </h1>
        <p className="text-xs text-forest-700 mt-2 italic [text-shadow:_0_1px_2px_rgba(0,0,0,0.15)]">{webTexts.aboutViewSubtitle}</p>
      </hgroup>

      {/* Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start" id="about-grid-content">
        
        {/* Hlavní text */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-forest-100 p-6 sm:p-8 shadow-xs space-y-6" id="about-story-col">
          <h2 className="font-serif text-xl sm:text-2xl text-forest-950 font-semibold tracking-tight border-l-4 border-forest-500 pl-3">
            {settings.aboutTitle}
          </h2>
          <div className="text-forest-800 text-sm sm:text-base space-y-4 leading-relaxed whitespace-pre-line" id="about-story-text">
            {settings.aboutText}
          </div>
        </section>

        {/* Štítky po stranách + info */}
        <section className="lg:col-span-5 space-y-4" id="about-pillars-col">
          <h3 className="text-xs uppercase font-mono tracking-widest text-forest-400 font-bold ml-1">Naše hlavní hodnoty</h3>
          
          {[
            {
              icon: TreePine,
              title: 'ABC',
              desc: 'Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. ',
            },
            {
              icon: Shield,
              title: 'DEF',
              desc: 'Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. ',
            },
            {
              icon: Heart,
              title: 'GHI',
              desc: 'Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. ',
            },
            {
              icon: Award,
              title: 'JKL',
              desc: 'Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. Text. ',
            },
          ].map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={index} 
                id={`pillar-card-${index}`}
                className="bg-white p-5 rounded-xl border border-forest-100 shadow-xs hover:border-forest-200 transition"
              >
                <div className="flex gap-4">
                  <div className="bg-forest-50 p-2.5 rounded-lg h-fit border border-forest-100" id={`pillar-icon-box-${index}`}>
                    <Icon className="h-5 w-5 text-forest-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-semibold text-sm sm:text-base text-forest-950" id={`pillar-title-${index}`}>
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-forest-600 leading-relaxed" id={`pillar-desc-${index}`}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Citát*/}
      <blockquote className="bg-forest-900 text-white rounded-xl p-8 text-center relative overflow-hidden border-forest-950" id="about-quote-block">
        <div className="absolute inset-x-0 -top-10 opacity-10 font-serif text-[180px] text-forest-100 pointer-events-none select-none text-center">“</div>
        <q className="relative z-10 font-serif text-lg sm:text-xl md:text-2xl italic font-medium leading-relaxed block max-w-2xl mx-auto" id="about-quote-text">
          {webTexts.aboutQuoteText}
        </q>
        <cite className="relative z-10 block text-xs tracking-wider uppercase font-mono text-forest-250 mt-4 font-semibold" id="about-quote-author">
          {webTexts.aboutQuoteAuthor}
        </cite>
      </blockquote>

    </article>
  );
}
