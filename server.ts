import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { NewsItem, ContactPerson, WoodProduct, SiteSettings } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const WOOD_FILE = path.join(DATA_DIR, 'wood.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

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
      name: 'Ing. Václav Jelínek, MBA',
      role: 'Ředitel společnosti',
      department: 'Vedení společnosti',
      phone: '+420 380 120 451',
      email: 'jelinek@jkl-lesy.cz',
      address: 'Rudolfovská tř. 10/24, 370 01 České Budějovice',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'c2',
      name: 'Ing. Josef Bartoš',
      role: 'Hlavní lesník (Pěstební činnost)',
      department: 'Lesní správa',
      phone: '+420 380 120 452',
      email: 'bartos@jkl-lesy.cz',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'c3',
      name: 'Mgr. Marie Dvořáková',
      role: 'Správa obchodu a prodeje dřeva',
      department: 'Prodej a styk s veřejností',
      phone: '+420 380 120 453',
      email: 'prodej@jkl-lesy.cz',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'c4',
      name: 'František Sýkora',
      role: 'Revírník (Revír Hluboká nad Vltavou)',
      department: 'Terénní správa',
      phone: '+420 724 991 301',
      email: 'sykora@jkl-lesy.cz',
      address: 'Hájovna Ohrada, 373 41 Hluboká n. Vlt.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
    },
    {
      id: 'c5',
      name: 'Jan Mareš',
      role: 'Revírník (Revír Rožmberk)',
      department: 'Terénní správa',
      phone: '+420 724 991 302',
      email: 'mares@jkl-lesy.cz',
      address: 'Lesní úřad Rožmberk, 382 73 Rožmberk nad Vltavou',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
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
      content: 'Připravte se na topnou sezónu s předstihem. Jihočeské katolické lesy zahájily příjem objednávek na palivové dříví z vlastních probírek. V nabídce máme tvrdé palivové dříví (buk, dub, habr) s mimořádnou výhřevností, a také cenově dostupné měkké jehličnaté dříví (smrk, borovice) ideální do kotlů i pro rychlý podpal. Dříví dodáváme štípané na standardní délky 33 cm (příp. 25 a 50 cm), nebo v celých metrech rovnaných. Objednat si můžete snadno přes nový interaktivní kalkulátor na našem webu.',
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
      name: 'Palivové dříví tvrdé (buk, dub)',
      category: 'palivove',
      woodType: 'Buk, Dub, Javor',
      price: 2150,
      unit: 'prms',
      description: 'Prvotřídní palivo pro krby a krbová kamna. Velmi pomalé hoření s vysokým podílem řeřavého uhlí a stabilním žárem.',
      moisture: 'dle výběru',
      available: true
    },
    {
      id: 'w2',
      name: 'Palivové dříví měkké (smrk, borovice)',
      category: 'palivove',
      woodType: 'Smrk, Borovice',
      price: 1390,
      unit: 'prms',
      description: 'Vhodné do zplynovacích kotlů, akumulačních nádrží, udíren i na rychlý podpal. Dodáváno štípané s délkou polínek 33 cm.',
      moisture: 'suché',
      available: true
    },
    {
      id: 'w3',
      name: 'Pilařská kulatina jehličnatá standardní',
      category: 'kulatina',
      woodType: 'Smrk, Jedle',
      price: 2450,
      unit: 'm³',
      description: 'Kvalitní stavební a pilařský sortiment tř. III A/B, čepový průměr 20 cm+, standardní dodávané délky 4 m, 5 m a dál.',
      moisture: 'čerstvé',
      available: true
    },
    {
      id: 'w4',
      name: 'Listnatá vláknina pro průmysl a vytápění',
      category: 'vzdustandard',
      woodType: 'Bříza, Olše, Osika',
      price: 1150,
      unit: 'm³',
      description: 'Vlákninové dřevo v celých délkách (např. 2 m nebo 4 m), vhodné jak k průmyslové samovýrobě celulózy, tak pro ekonomické vytápění.',
      moisture: 'čerstvé',
      available: true
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

  writeDefaultIfMissing(CONTACTS_FILE, defaultContacts);
  writeDefaultIfMissing(NEWS_FILE, defaultNews);
  writeDefaultIfMissing(WOOD_FILE, defaultWood);
  writeDefaultIfMissing(SETTINGS_FILE, defaultSettings);
}

initDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

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

      res.json({
        contacts,
        news,
        woodProducts,
        settings
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
