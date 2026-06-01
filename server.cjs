var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var CONTACTS_FILE = import_path.default.join(DATA_DIR, "contacts.json");
var NEWS_FILE = import_path.default.join(DATA_DIR, "news.json");
var WOOD_FILE = import_path.default.join(DATA_DIR, "wood.json");
var SETTINGS_FILE = import_path.default.join(DATA_DIR, "settings.json");
function initDatabase() {
  if (!import_fs.default.existsSync(DATA_DIR)) {
    import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    console.log("Created database directory:", DATA_DIR);
  }
  const writeDefaultIfMissing = (filePath, defaultData) => {
    if (!import_fs.default.existsSync(filePath)) {
      import_fs.default.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
      console.log(`Initialized starter data in ${import_path.default.basename(filePath)}`);
    } else {
      try {
        const content = import_fs.default.readFileSync(filePath, "utf-8");
        JSON.parse(content);
      } catch (err) {
        import_fs.default.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
        console.warn(`Repaired corrupt database file: ${import_path.default.basename(filePath)}`);
      }
    }
  };
  const defaultContacts = [
    {
      id: "c1",
      name: "Ing. V\xE1clav Jel\xEDnek, MBA",
      role: "\u0158editel spole\u010Dnosti",
      department: "Veden\xED spole\u010Dnosti",
      phone: "+420 380 120 451",
      email: "jelinek@jkl-lesy.cz",
      address: "Rudolfovsk\xE1 t\u0159. 10/24, 370 01 \u010Cesk\xE9 Bud\u011Bjovice",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256"
    },
    {
      id: "c2",
      name: "Ing. Josef Barto\u0161",
      role: "Hlavn\xED lesn\xEDk (P\u011Bstebn\xED \u010Dinnost)",
      department: "Lesn\xED spr\xE1va",
      phone: "+420 380 120 452",
      email: "bartos@jkl-lesy.cz",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256"
    },
    {
      id: "c3",
      name: "Mgr. Marie Dvo\u0159\xE1kov\xE1",
      role: "Spr\xE1va obchodu a prodeje d\u0159eva",
      department: "Prodej a styk s ve\u0159ejnost\xED",
      phone: "+420 380 120 453",
      email: "prodej@jkl-lesy.cz",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
    },
    {
      id: "c4",
      name: "Franti\u0161ek S\xFDkora",
      role: "Rev\xEDrn\xEDk (Rev\xEDr Hlubok\xE1 nad Vltavou)",
      department: "Ter\xE9nn\xED spr\xE1va",
      phone: "+420 724 991 301",
      email: "sykora@jkl-lesy.cz",
      address: "H\xE1jovna Ohrada, 373 41 Hlubok\xE1 n. Vlt.",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
    },
    {
      id: "c5",
      name: "Jan Mare\u0161",
      role: "Rev\xEDrn\xEDk (Rev\xEDr Ro\u017Emberk)",
      department: "Ter\xE9nn\xED spr\xE1va",
      phone: "+420 724 991 302",
      email: "mares@jkl-lesy.cz",
      address: "Lesn\xED \xFA\u0159ad Ro\u017Emberk, 382 73 Ro\u017Emberk nad Vltavou",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256"
    }
  ];
  const defaultNews = [
    {
      id: "n1",
      title: "Zah\xE1jen\xED jarn\xEDho zales\u0148ov\xE1n\xED v jiho\u010Desk\xFDch rev\xEDrech",
      date: "2026-05-12",
      pithySummary: "V leto\u0161n\xEDm roce m\xE1me v pl\xE1nu vysadit v\xEDce ne\u017E 120 000 sazenic se zv\xFD\u0161en\xFDm pod\xEDlem jedl\xED a buk\u016F pro v\u011Bt\u0161\xED biodiverzitu a odolnost.",
      content: "Jiho\u010Desk\xE9 katolick\xE9 lesy \xFAsp\u011B\u0161n\u011B zah\xE1jily rozs\xE1hlou jarn\xED v\xFDsadbu. Na\u0161\xEDm dlouhodob\xFDm c\xEDlem je obnova lesn\xEDch porost\u016F a ekologick\xE1 stabilizace. S\xE1z\xEDme zejm\xE9na buk lesn\xED, dub letn\xED, jedli b\u011Blokorou a mod\u0159\xEDn opadav\xFD, kter\xE9 dopl\u0148ujeme o tradi\u010Dn\xED smrk v lokalit\xE1ch, kde m\xE1 p\u0159irozen\xE9 podm\xEDnky. Db\xE1me na pestrou druhovou skladbu, kter\xE1 zv\xFD\u0161\xED odolnost na\u0161ich lesn\xEDch celk\u016F v\u016F\u010Di prob\xEDhaj\xEDc\xED zm\u011Bn\u011B klimatu a such\u016Fm. D\u011Bkujeme v\u0161em lesn\xEDm pracovn\xEDk\u016Fm za nasazen\xED v n\xE1ro\u010Dn\xFDch ter\xE9nn\xEDch podm\xEDnk\xE1ch.",
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
      category: "lesnictvi",
      author: "Ing. Josef Barto\u0161"
    },
    {
      id: "n2",
      title: "Prodej kvalitn\xEDho palivov\xE9ho d\u0159\xEDv\xED na zimn\xED sez\xF3nu zah\xE1jen",
      date: "2026-05-20",
      pithySummary: "Otev\u0159eli jsme objedn\xE1vky na tvrd\xE9 i m\u011Bkk\xE9 palivov\xE9 d\u0159\xEDv\xED. Nab\xEDz\xEDme \u0161t\xEDpan\xE1 polena 33 cm i samov\xFDrobu s mo\u017Enost\xED odvozu.",
      content: "P\u0159ipravte se na topnou sez\xF3nu s p\u0159edstihem. Jiho\u010Desk\xE9 katolick\xE9 lesy zah\xE1jily p\u0159\xEDjem objedn\xE1vek na palivov\xE9 d\u0159\xEDv\xED z vlastn\xEDch prob\xEDrek. V nab\xEDdce m\xE1me tvrd\xE9 palivov\xE9 d\u0159\xEDv\xED (buk, dub, habr) s mimo\u0159\xE1dnou v\xFDh\u0159evnost\xED, a tak\xE9 cenov\u011B dostupn\xE9 m\u011Bkk\xE9 jehli\u010Dnat\xE9 d\u0159\xEDv\xED (smrk, borovice) ide\xE1ln\xED do kotl\u016F i pro rychl\xFD podpal. D\u0159\xEDv\xED dod\xE1v\xE1me \u0161t\xEDpan\xE9 na standardn\xED d\xE9lky 33 cm (p\u0159\xEDp. 25 a 50 cm), nebo v cel\xFDch metrech rovnan\xFDch. Objednat si m\u016F\u017Eete snadno p\u0159es nov\xFD interaktivn\xED kalkul\xE1tor na na\u0161em webu.",
      imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800",
      category: "prodej",
      author: "Mgr. Marie Dvo\u0159\xE1kov\xE1"
    },
    {
      id: "n3",
      title: "Pozv\xE1nka na Svatohubertskou m\u0161i a Lesn\xED den pro rodiny",
      date: "2026-05-24",
      pithySummary: "Srde\u010Dn\u011B zveme rodiny i farn\xEDky na tradi\u010Dn\xED pod\u011Bkov\xE1n\xED za dary lesa. \u010Cek\xE1 v\xE1s m\u0161e pod \u0161ir\xFDm nebem a uk\xE1zky lesn\xED pedagogiky.",
      content: "Srde\u010Dn\u011B zveme farn\xEDky, milovn\xEDky p\u0159\xEDrody a ve\u0159ejnost na tradi\u010Dn\xED Svatohubertskou m\u0161i spojenou s d\u011Bkovn\xFDm odpolednem, kter\xE1 se uskute\u010Dn\xED v kapli svat\xE9ho Huberta na rev\xEDru Hlubok\xE1 (u obory Ohrada). Hlavn\xEDm celebrantem m\u0161e pod \u0161ir\xFDm nebem bude pomocn\xFD biskup \u010Deskobud\u011Bjovick\xFD. Po skon\u010Den\xED m\u0161e (cca od 11:30) bude n\xE1sledovat program pro d\u011Bti i dosp\u011Bl\xE9: pozn\xE1v\xE1n\xED lesn\xED fauny a fl\xF3ry s lesn\xEDky, uk\xE1zky v\xFDcviku loveck\xFDch ps\u016F, p\u0159ibli\u017Eov\xE1n\xED d\u0159\xEDv\xED ko\u0148mi v choulostiv\xE9m ter\xE9nu a ochutn\xE1vka tradi\u010Dn\xEDch zv\u011B\u0159inov\xFDch specialit z vlastn\xEDho rev\xEDru.",
      imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800",
      category: "verejnost",
      author: "Ing. V\xE1clav Jel\xEDnek, MBA"
    }
  ];
  const defaultWood = [
    {
      id: "w1",
      name: "Palivov\xE9 d\u0159\xEDv\xED tvrd\xE9 (buk, dub)",
      category: "palivove",
      woodType: "Buk, Dub, Javor",
      price: 2150,
      unit: "prms",
      description: "Prvot\u0159\xEDdn\xED palivo pro krby a krbov\xE1 kamna. Velmi pomal\xE9 ho\u0159en\xED s vysok\xFDm pod\xEDlem \u0159e\u0159av\xE9ho uhl\xED a stabiln\xEDm \u017E\xE1rem.",
      moisture: "dle v\xFDb\u011Bru",
      available: true
    },
    {
      id: "w2",
      name: "Palivov\xE9 d\u0159\xEDv\xED m\u011Bkk\xE9 (smrk, borovice)",
      category: "palivove",
      woodType: "Smrk, Borovice",
      price: 1390,
      unit: "prms",
      description: "Vhodn\xE9 do zplynovac\xEDch kotl\u016F, akumula\u010Dn\xEDch n\xE1dr\u017E\xED, ud\xEDren i na rychl\xFD podpal. Dod\xE1v\xE1no \u0161t\xEDpan\xE9 s d\xE9lkou pol\xEDnek 33 cm.",
      moisture: "such\xE9",
      available: true
    },
    {
      id: "w3",
      name: "Pila\u0159sk\xE1 kulatina jehli\u010Dnat\xE1 standardn\xED",
      category: "kulatina",
      woodType: "Smrk, Jedle",
      price: 2450,
      unit: "m\xB3",
      description: "Kvalitn\xED stavebn\xED a pila\u0159sk\xFD sortiment t\u0159. III A/B, \u010Depov\xFD pr\u016Fm\u011Br 20 cm+, standardn\xED dod\xE1van\xE9 d\xE9lky 4 m, 5 m a d\xE1l.",
      moisture: "\u010Derstv\xE9",
      available: true
    },
    {
      id: "w4",
      name: "Listnat\xE1 vl\xE1knina pro pr\u016Fmysl a vyt\xE1p\u011Bn\xED",
      category: "vzdustandard",
      woodType: "B\u0159\xEDza, Ol\u0161e, Osika",
      price: 1150,
      unit: "m\xB3",
      description: "Vl\xE1kninov\xE9 d\u0159evo v cel\xFDch d\xE9lk\xE1ch (nap\u0159. 2 m nebo 4 m), vhodn\xE9 jak k pr\u016Fmyslov\xE9 samov\xFDrob\u011B celul\xF3zy, tak pro ekonomick\xE9 vyt\xE1p\u011Bn\xED.",
      moisture: "\u010Derstv\xE9",
      available: true
    }
  ];
  const defaultSettings = {
    aboutTitle: "Trvale udr\u017Eiteln\xE9 hospoda\u0159en\xED s respektem k tradic\xEDm a stvo\u0159en\xED",
    aboutText: "Jiho\u010Desk\xE9 katolick\xE9 lesy s.r.o. byly zalo\u017Eeny k profesion\xE1ln\xEDmu, \u0161etrn\xE9mu a transparentn\xEDmu hospoda\u0159en\xED na lesn\xEDch a zem\u011Bd\u011Blsk\xFDch pozemc\xEDch ve vlastnictv\xED Biskupstv\xED \u010Deskobud\u011Bjovick\xE9ho, farnost\xED a kl\xE1\u0161ter\u016F v jiho\u010Desk\xE9m regionu.\n\nSvoji \u010Dinnost ch\xE1peme jako slu\u017Ebu krajin\u011B i spole\u010Dnosti. Navazujeme na staletou tradici c\xEDrkevn\xED p\xE9\u010De o zemi a usilujeme o ekologicky stabiln\xED, druhov\u011B i v\u011Bkov\u011B bohat\xE9 lesy, kter\xE9 dok\xE1\u017E\xED l\xE9pe vzdorovat suchu i kalamit\xE1m. Db\xE1me o udr\u017Een\xED p\u0159irozen\xE9ho kolob\u011Bhu vody, ochranu p\u016Fdy, biologickou rozmanitost a z\xE1rove\u0148 pln\xEDme hospod\xE1\u0159sk\xE9 c\xEDle, kter\xE9 finan\u010Dn\u011B podporuj\xED pastora\u010Dn\xED, charitativn\xED, soci\xE1ln\xED a vzd\u011Bl\xE1vac\xED projekty diec\xE9ze.\n\nAktu\xE1ln\u011B spravujeme lesn\xED rev\xEDry rozprost\xEDraj\xEDc\xED se od \u0161umavsk\xFDch podh\u016F\u0159\xED p\u0159es malebn\xE9 T\u0159ebo\u0148sko a\u017E k Novohradsk\xFDm hor\xE1m.",
    contactIntro: "M\xE1te dotazy k prodeji d\u0159eva, pron\xE1jmu pozemk\u016F nebo pot\u0159ebujete pomoci s vyt\xFD\u010Den\xEDm hranic? Kontaktujte pros\xEDm p\u0159\xEDslu\u0161n\xE9ho odborn\xE9ho pracovn\xEDka, p\u0159\xEDpadn\u011B nav\u0161tivte na\u0161i centr\xE1lu v \u010Cesk\xFDch Bud\u011Bjovic\xEDch.",
    officeHours: "Pond\u011Bl\xED \u2013 P\xE1tek: 7:00 \u2013 15:30 (osobn\xED sch\u016Fzku doporu\u010Dujeme domluvit p\u0159edem telefonicky)",
    companyAddress: "Jiho\u010Desk\xE9 katolick\xE9 lesy s.r.o., Rudolfovsk\xE1 t\u0159. 10/24, 370 01 \u010Cesk\xE9 Bud\u011Bjovice",
    companyICO: "28145963",
    companyDIC: "CZ28145963",
    companyBank: "210452933/0300 (\u010Ceskoslovensk\xE1 obchodn\xED banka, a.s.)"
  };
  writeDefaultIfMissing(CONTACTS_FILE, defaultContacts);
  writeDefaultIfMissing(NEWS_FILE, defaultNews);
  writeDefaultIfMissing(WOOD_FILE, defaultWood);
  writeDefaultIfMissing(SETTINGS_FILE, defaultSettings);
}
initDatabase();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/site-data", (req, res) => {
    try {
      const contacts = JSON.parse(import_fs.default.readFileSync(CONTACTS_FILE, "utf-8"));
      const news = JSON.parse(import_fs.default.readFileSync(NEWS_FILE, "utf-8"));
      const woodProducts = JSON.parse(import_fs.default.readFileSync(WOOD_FILE, "utf-8"));
      const settings = JSON.parse(import_fs.default.readFileSync(SETTINGS_FILE, "utf-8"));
      res.json({
        contacts,
        news,
        woodProducts,
        settings
      });
    } catch (error) {
      console.error("Error fetching site data:", error);
      res.status(500).json({ error: "Chyba p\u0159i na\u010D\xEDt\xE1n\xED dat ze serveru: " + error.message });
    }
  });
  app.post("/api/contacts", (req, res) => {
    try {
      const newContacts = req.body;
      if (!Array.isArray(newContacts)) {
        return res.status(400).json({ error: "Neplatn\xFD form\xE1t kontakt\u016F. O\u010Dek\xE1v\xE1no pole." });
      }
      import_fs.default.writeFileSync(CONTACTS_FILE, JSON.stringify(newContacts, null, 2), "utf-8");
      res.json({ success: true, message: "Kontakty byly \xFAsp\u011B\u0161n\u011B ulo\u017Eeny." });
    } catch (error) {
      console.error("Error saving contacts:", error);
      res.status(500).json({ error: "Chyba p\u0159i ukl\xE1d\xE1n\xED kontakt\u016F: " + error.message });
    }
  });
  app.post("/api/news", (req, res) => {
    try {
      const newNews = req.body;
      if (!Array.isArray(newNews)) {
        return res.status(400).json({ error: "Neplatn\xFD form\xE1t aktualit. O\u010Dek\xE1v\xE1no pole." });
      }
      import_fs.default.writeFileSync(NEWS_FILE, JSON.stringify(newNews, null, 2), "utf-8");
      res.json({ success: true, message: "Aktuality byly \xFAsp\u011B\u0161n\u011B ulo\u017Eeny." });
    } catch (error) {
      console.error("Error saving news:", error);
      res.status(500).json({ error: "Chyba p\u0159i ukl\xE1d\xE1n\xED aktualit: " + error.message });
    }
  });
  app.post("/api/wood-products", (req, res) => {
    try {
      const products = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "Neplatn\xFD form\xE1t sortimentu d\u0159eva. O\u010Dek\xE1v\xE1no pole." });
      }
      import_fs.default.writeFileSync(WOOD_FILE, JSON.stringify(products, null, 2), "utf-8");
      res.json({ success: true, message: "Cen\xEDk d\u0159eva \xFAsp\u011B\u0161n\u011B ulo\u017Een." });
    } catch (error) {
      console.error("Error saving wood products:", error);
      res.status(500).json({ error: "Chyba p\u0159i ukl\xE1d\xE1n\xED cen\xEDku d\u0159eva: " + error.message });
    }
  });
  app.post("/api/settings", (req, res) => {
    try {
      const newSettings = req.body;
      if (typeof newSettings !== "object" || newSettings === null) {
        return res.status(400).json({ error: "Neplatn\xE1 konfigurace nastaven\xED." });
      }
      import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), "utf-8");
      res.json({ success: true, message: "Obecn\xE9 nastaven\xED webu \xFAsp\u011B\u0161n\u011B ulo\u017Eeno." });
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({ error: "Chyba p\u0159i ukl\xE1d\xE1n\xED nastaven\xED: " + error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted for development.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("Serving static files from:", distPath);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jiho\u010Desk\xE9 katolick\xE9 lesy server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
