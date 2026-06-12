// Nastaveni databaze

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
  addressURL?: string;
  photoUrl?: string;
}

export interface WoodProduct {
  id: string;
  name: string;
  category: 'tvrde' | 'mekke';
  woodTypeClass: 'listnate' | 'jehlicnate';
  woodType: string;
  price: number; 
  unit: string; 
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

export interface WebTexts {
  heroTitle: string;
  heroSubtitle: string;
  aboutViewTitle: string;
  aboutViewSubtitle: string;
  aboutQuoteText: string;
  aboutQuoteAuthor: string;
  contactsTitle: string;
  contactsHQTitle: string;
  contactsHQSubtitle: string;
  contactsHoursTitle: string;
  contactsHoursSubtitle: string;
  contactsBankTitle: string;
  contactsBankSubtitle: string;
  contactsSectionTitle: string;
  contactsSectionSubtitle: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'reviry' | 'pracoviste' | 'technika' | 'akce';
  description: string;
  date?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  certNumber: string;
  validUntil: string;
  description: string;
  type: 'pefc' | 'fsc' | 'kodex' | 'dalsi';
}
