/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  pithySummary: string;
  content: string;
  imageUrl?: string;
  category: 'lesnictvi' | 'zpravy' | 'prodej' | 'verejnost';
  author: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  address?: string;
  photoUrl?: string; // Base64 or standard asset url
}

export interface WoodProduct {
  id: string;
  name: string;
  category: 'palivove' | 'kulatina' | 'vzdustandard';
  woodType: string; // e.g. "Smrk, Borovice", "Dub, Buk"
  price: number; // in CZK
  unit: string; // "prms" (prostorový metr sypaný), "prmr" (prostorový metr rovnaný), "m³"
  description: string;
  moisture: 'čerstvé' | 'suché' | 'dle výběru';
  available: boolean;
}

export interface SiteSettings {
  aboutTitle: string;
  aboutText: string;
  contactIntro: string;
  officeHours: string;
  companyAddress: string;
  companyICO: string;
  companyDIC: string;
  companyBank: string;
}
