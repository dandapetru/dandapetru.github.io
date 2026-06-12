// POZNÁMKA UPRAVIT -----------------------
// POZNÁMKA UPRAVIT -----------------------
// POZNÁMKA UPRAVIT -----------------------
// POZNÁMKA UPRAVIT -----------------------
// POZNÁMKA UPRAVIT -----------------------
// POZNÁMKA UPRAVIT -----------------------
// POZNÁMKA UPRAVIT -----------------------

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { NewsItem, ContactPerson, WoodProduct, SiteSettings, WebTexts, GalleryItem } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const WOOD_FILE = path.join(DATA_DIR, 'wood.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const WEB_TEXTS_FILE = path.join(DATA_DIR, 'web_texts.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

// Ensure data folder and starter files exist
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created database directory:', DATA_DIR);
  }

  // Helper to safely write default file if not exists
  const writeDefaultIfMissing = (filePath: string, defaultData: any) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      console.log(`Initialized starter data in ${path.basename(filePath)}`);
    } else {
      // Validate structure just in case of empty or corrupt file
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
      } catch (err) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
        console.warn(`Repaired corrupt database file: ${path.basename(filePath)}`);
      }
    }
  };

  const defaultContacts: ContactPerson[] = [
    {
      id: 'c1',
      name: 'Kontakt 1',
      role: 'Role 1',
      department: 'Vedení společnosti',
      phone: '+420 111 222 333',
      email: 'kontakt1@jkl-lesy.cz',
      address: 'Hlavní 1, 370 01 České Budějovice',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'c2',
      name: 'Kontakt 2',
      role: 'Role 2',
      department: 'Lesní správa',
      phone: '+420 444 555 666',
      email: 'kontakt2@jkl-lesy.cz',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'c3',
      name: 'Kontakt 3',
      role: 'Role 3',
      department: 'Terénní správa',
      phone: '+420 777 888 999',
      email: 'kontakt3@jkl-lesy.cz',
      address: 'Hájenka 5, 373 41 Hluboká n. Vlt.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
    }
  ];

  const defaultNews: NewsItem[] = [
    {
      id: 'n1',
      title: 'Zahájení jarního zalesňování v jihočeských revírech',
      date: '2026-05-12',
      pithySummary: 'V letošním roce máme v plánu vysadit více než 120 000 sazenic se zvýšeným podílem jedlí a buků pro větší biodiverzitu a odolnost.',
      content: 'Jihočeské katolické lesy úspěšně zahájily rozsáhlou jarní výsadbu. Naším dlouhodobým cílem je obnova lesních porostů a ekologická stabilizace. Sázíme zejména buk lesní, dub letní, jedli bělokorou a modřín opadavý, které doplňujeme o tradiční smrk v lokalitách, kde má přirozené podmínky. Dbáme na pestrou druhovou skladbu, která zvýší odolnost našich lesních celků vůči probíhající změně klimatu a suchům. Děkujeme všem lesním pracovníkům za nasazení v náročných terénních podmínkách.',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
      category: 'lesnictvi',
      author: 'Ing. Josef Bartoš'
    },
    {
      id: 'n2',
      title: 'Prodej kvalitního palivového dříví na zimní sezónu zahájen',
      date: '2026-05-20',
      pithySummary: 'Otevřeli jsme objednávky na tvrdé i měkké palivové dříví. Nabízíme štípaná polena 33 cm i samovýrobu s možností odvozu.',
      content: 'Připravte se na topnou sezónu s předstihem. Jihočeské katolické lesy zahájily příjem objednávek na palivové dříví z vlastních probírek. V nabídce máme tvrdé palivové dříví (buk, dub, habr) s mimořádnou výhřevností, a také cenově dostupné měkké jehličnaté dříví (smrk, borovice) ideální do kotlů i pro rychlý podpal. Dříví dodáváme štípané na standardní délky 33 cm (příp. 25 a 50 cm), nebo v celých metrech rovnaných. Pro objednávky a zjištění aktuální dostupnosti nás prosím přímo kontaktujte na telefonním čísle nebo e-mailu uvedeném v sekci Kontakty.',
      imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
      category: 'prodej',
      author: 'Mgr. Marie Dvořáková'
    },
    {
      id: 'n3',
      title: 'Pozvánka na Svatohubertskou mši a Lesní den pro rodiny',
      date: '2026-05-24',
      pithySummary: 'Srdečně zveme rodiny i farníky na tradiční poděkování za dary lesa. Čeká vás mše pod širým nebem a ukázky lesní pedagogiky.',
      content: 'Srdečně zveme farníky, milovníky přírody a veřejnost na tradiční Svatohubertskou mši spojenou s děkovným odpolednem, která se uskuteční v kapli svatého Huberta na revíru Hluboká (u obory Ohrada). Hlavním celebrantem mše pod širým nebem bude pomocný biskup českobudějovický. Po skončení mše (cca od 11:30) bude následovat program pro děti i dospělé: poznávání lesní fauny a flóry s lesníky, ukázky výcviku loveckých psů, přibližování dříví koňmi v choulostivém terénu a ochutnávka tradičních zvěřinových specialit z vlastního revíru.',
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800',
      category: 'verejnost',
      author: 'Ing. Václav Jelínek, MBA'
    }
  ];

  const defaultWood: WoodProduct[] = [
    {
      id: 'w1',
      name: 'Palivové dříví tvrdé listnaté (Buk, Dub)',
      category: 'tvrde',
      woodTypeClass: 'listnate',
      woodType: 'Buk, Dub, Javor',
      price: 2250,
      unit: 'prms',
      description: 'Špičkové listnaté dříví s nejvyšším žárem a stabilním plamenem. Vhodné pro krby, krbová kamna a kachlové pece.',
      moisture: 'suché',
      available: true
    },
    {
      id: 'w2',
      name: 'Palivové dříví měkké jehličnaté (Smrk, Borovice)',
      category: 'mekke',
      woodTypeClass: 'jehlicnate',
      woodType: 'Smrk, Borovice',
      price: 1350,
      unit: 'prms',
      description: 'Jehličnaté palivo s velmi rychlým zátopem. Ideální k rozhoření, do zplynovacích kotlů, nebo pro celosezónní vytápění chat a domů.',
      moisture: 'suché',
      available: true
    },
    {
      id: 'w3',
      name: 'Palivové dříví tvrdé jehličnaté (Modřín)',
      category: 'tvrde',
      woodTypeClass: 'jehlicnate',
      woodType: 'Modřín',
      price: 1690,
      unit: 'prms',
      description: 'Jehličnaté dříví s vyšším obsahem pryskyřice zajišťující silný plamen a příjemné praskání. Má delší trvanlivost hoření než běžný smrk.',
      moisture: 'dle výběru',
      available: true
    },
    {
      id: 'w4',
      name: 'Palivové dříví měkké listnaté (Bříza, Olše)',
      category: 'mekke',
      woodTypeClass: 'listnate',
      woodType: 'Bříza, Olše',
      price: 1550,
      unit: 'prms',
      description: 'Listnaté dříví s velmi jasným bílým plamenem. Nezanáší komín sazemi a skvěle se uplatní v krbech i otevřených ohništích.',
      moisture: 'suché',
      available: true
    }
  ];

  const defaultGallery: GalleryItem[] = [
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

  const defaultSettings: SiteSettings = {
    aboutTitle: 'Trvale udržitelné hospodaření s respektem k tradicím a stvoření',
    aboutText: 'Jihočeské katolické lesy s.r.o. byly založeny k profesionálnímu, šetrnému a transparentnímu hospodaření na lesních a zemědělských pozemcích ve vlastnictví Biskupství českobudějovického, farností a klášterů v jihočeském regionu.\n\nSvoji činnost chápeme jako službu krajině i společnosti. Navazujeme na staletou tradici církevní péče o zemi a usilujeme o ekologicky stabilní, druhově i věkově bohaté lesy, které dokáží lépe vzdorovat suchu i kalamitám. Dbáme o udržení přirozeného koloběhu vody, ochranu půdy, biologickou rozmanitost a zároveň plníme hospodářské cíle, které finančně podporují pastorační, charitativní, sociální a vzdělávací projekty diecéze.\n\nAktuálně spravujeme lesní revíry rozprostírající se od šumavských podhůří přes malebné Třeboňsko až k Novohradským horám.',
    contactIntro: 'Máte dotazy k prodeji dřeva, pronájmu pozemků nebo potřebujete pomoci s vytýčením hranic? Kontaktujte prosím příslušného odborného pracovníka, případně navštivte naši centrálu v Českých Budějovicích.',
    officeHours: 'Pondělí – Pátek: 7:00 – 15:30 (osobní schůzku doporučujeme domluvit předem telefonicky)',
    companyAddress: 'Jihočeské katolické lesy s.r.o., Rudolfovská tř. 10/24, 370 01 České Budějovice',
    companyICO: '28145963',
    companyDIC: 'CZ28145963',
    companyBank: '210452933/0300 (Československá obchodní banka, a.s.)'
  };

  const defaultWebTexts: WebTexts = {
    heroTitle: 'Hospodaříme v Jižních Čechách s respektem k tradici a stvoření',
    heroSubtitle: 'Odpovědná správa církevního lesního majetku, šetrná těžba, rozsáhlé zalesňování a přímé dodávky palivového dřeva pro obyvatele i firmy.',
    aboutViewTitle: 'Kdo jsme a jak hospodaříme',
    aboutViewSubtitle: 'Založeno pro spojení tradice, víry, odpovědnosti a odborné lesnické péče.',
    aboutQuoteText: '„Člověk je správcem stvoření, nikoliv jeho bezohledným majitelem. V lese pracujeme s vědomím, že co zasadíme dnes, sklidí naši vnuci.“',
    aboutQuoteAuthor: 'Mons. Vlastimil Kročil, Diecézní biskup českobudějovický',
    contactsTitle: 'Kontaktujte nás',
    contactsHQTitle: 'Sídlo společnosti',
    contactsHQSubtitle: 'Fakturační a doručovací údaje',
    contactsHoursTitle: 'Úřední hodiny',
    contactsHoursSubtitle: 'Kdy nás můžete navštívit',
    contactsBankTitle: 'Bankovní spojení',
    contactsBankSubtitle: 'Pro platby za dříví a poplatky obcí',
    contactsSectionTitle: 'Odborní lesní pracovníci',
    contactsSectionSubtitle: 'Dohlížejí na bezpečný chod jednotlivých revírů, správu majetku a sjednávání zakázek.'
  };

  writeDefaultIfMissing(CONTACTS_FILE, defaultContacts);
  writeDefaultIfMissing(NEWS_FILE, defaultNews);
  writeDefaultIfMissing(WOOD_FILE, defaultWood);
  writeDefaultIfMissing(SETTINGS_FILE, defaultSettings);
  writeDefaultIfMissing(WEB_TEXTS_FILE, defaultWebTexts);
  writeDefaultIfMissing(GALLERY_FILE, defaultGallery);
}

initDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure images/fotogalerie folder exists on disk
  const fotogalerieFolder = path.join(process.cwd(), 'images', 'fotogalerie');
  if (!fs.existsSync(fotogalerieFolder)) {
    fs.mkdirSync(fotogalerieFolder, { recursive: true });
    console.log('Created local photogallery directory:', fotogalerieFolder);
  }

  // Handle static images directory BEFORE other path setups
  app.use('/images', express.static(path.join(process.cwd(), 'images')));

  // JSON size limit increased to 50MB to support base64 embedded photos safely
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API endpoints: GET full site configuration
  app.get('/api/site-data', (req, res) => {
    try {
      const contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
      const news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf-8'));
      const woodProducts = JSON.parse(fs.readFileSync(WOOD_FILE, 'utf-8'));
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      const webTexts = JSON.parse(fs.readFileSync(WEB_TEXTS_FILE, 'utf-8'));
      const galleryItems = JSON.parse(fs.readFileSync(GALLERY_FILE, 'utf-8'));

      res.json({
        contacts,
        news,
        woodProducts,
        settings,
        webTexts,
        galleryItems
      });
    } catch (error: any) {
      console.error('Error fetching site data:', error);
      res.status(500).json({ error: 'Chyba při načítání dat ze serveru: ' + error.message });
    }
  });

  // API endpoint: UPDATE contacts
  app.post('/api/contacts', (req, res) => {
    try {
      const newContacts = req.body;
      if (!Array.isArray(newContacts)) {
        return res.status(400).json({ error: 'Neplatný formát kontaktů. Očekáváno pole.' });
      }
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(newContacts, null, 2), 'utf-8');
      res.json({ success: true, message: 'Kontakty byly úspěšně uloženy.' });
    } catch (error: any) {
      console.error('Error saving contacts:', error);
      res.status(500).json({ error: 'Chyba při ukládání kontaktů: ' + error.message });
    }
  });

  // API endpoint: UPDATE news
  app.post('/api/news', (req, res) => {
    try {
      const newNews = req.body;
      if (!Array.isArray(newNews)) {
        return res.status(400).json({ error: 'Neplatný formát aktualit. Očekáváno pole.' });
      }
      fs.writeFileSync(NEWS_FILE, JSON.stringify(newNews, null, 2), 'utf-8');
      res.json({ success: true, message: 'Aktuality byly úspěšně uloženy.' });
    } catch (error: any) {
      console.error('Error saving news:', error);
      res.status(500).json({ error: 'Chyba při ukládání aktualit: ' + error.message });
    }
  });

  // API endpoint: UPDATE wood products
  app.post('/api/wood-products', (req, res) => {
    try {
      const products = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Neplatný formát sortimentu dřeva. Očekáváno pole.' });
      }
      fs.writeFileSync(WOOD_FILE, JSON.stringify(products, null, 2), 'utf-8');
      res.json({ success: true, message: 'Ceník dřeva úspěšně uložen.' });
    } catch (error: any) {
      console.error('Error saving wood products:', error);
      res.status(500).json({ error: 'Chyba při ukládání ceníku dřeva: ' + error.message });
    }
  });

  // API endpoint: UPDATE gallery items metadata
  app.post('/api/gallery', (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Neplatný formát fotogalerie. Očekáváno pole.' });
      }
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(items, null, 2), 'utf-8');
      res.json({ success: true, message: 'Metadata fotogalerie uložena.' });
    } catch (error: any) {
      console.error('Error saving gallery:', error);
      res.status(500).json({ error: 'Chyba při ukládání fotogalerie: ' + error.message });
    }
  });

  // API endpoint: UPLOAD photo binary file on disk (stores inside images/fotogalerie/)
  app.post('/api/upload-photo', (req, res) => {
    try {
      const { filename, base64 } = req.body;
      if (!filename || !base64) {
        return res.status(400).json({ error: 'Chybí název souboru nebo obrazová data.' });
      }
      // Extract clean base64 data if it has data url scheme header
      let cleanBase64 = base64;
      if (base64.includes(';base64,')) {
        cleanBase64 = base64.split(';base64,')[1];
      }
      const buffer = Buffer.from(cleanBase64, 'base64');
      const targetPath = path.join(process.cwd(), 'images', 'fotogalerie', filename);
      fs.writeFileSync(targetPath, buffer);
      console.log('Saved custom gallery photo on server disk:', targetPath);
      res.json({ success: true, imageUrl: `images/fotogalerie/${filename}` });
    } catch (error: any) {
      console.error('Error saving custom image upload:', error);
      res.status(500).json({ error: 'Chyba při ukládání fotky do adresáře images/fotogalerie: ' + error.message });
    }
  });

  // API endpoint: UPDATE site settings
  app.post('/api/settings', (req, res) => {
    try {
      const newSettings = req.body;
      if (typeof newSettings !== 'object' || newSettings === null) {
        return res.status(400).json({ error: 'Neplatná konfigurace nastavení.' });
      }
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), 'utf-8');
      res.json({ success: true, message: 'Obecné nastavení webu úspěšně uloženo.' });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      res.status(500).json({ error: 'Chyba při ukládání nastavení: ' + error.message });
    }
  });

  // API endpoint: UPDATE web texts
  app.post('/api/web-texts', (req, res) => {
    try {
      const newWebTexts = req.body;
      if (typeof newWebTexts !== 'object' || newWebTexts === null) {
        return res.status(400).json({ error: 'Neplatná konfigurace textů.' });
      }
      fs.writeFileSync(WEB_TEXTS_FILE, JSON.stringify(newWebTexts, null, 2), 'utf-8');
      res.json({ success: true, message: 'Texty webu úspěšně uloženy.' });
    } catch (error: any) {
      console.error('Error saving web texts:', error);
      res.status(500).json({ error: 'Chyba při ukládání textů: ' + error.message });
    }
  });

  // Integrate Vite for dev, or static asset delivery for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving static files from:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jihočeské katolické lesy server running on http://localhost:${PORT}`);
  });
}

startServer();
