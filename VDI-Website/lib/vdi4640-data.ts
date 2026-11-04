export interface SoilProfile {
  id: string;
  name: string;
  kategorie: 'Lockergesteine' | 'Sedimentäre Festgesteine' | 'Magmatische Festgesteine' | 'Metamorphe Festgesteine' | 'Andere Stoffe';
  unterkategorie?: string;
  feuchtezustand?: 'trocken' | 'feucht' | 'wassergesättigt' | 'fest' | 'organisch' | 'sonstig';
  waermeleitfaehigkeit_min: number;
  waermeleitfaehigkeit_max: number;
  waermeleitfaehigkeit_typisch: number;
  spezifische_waermekapazitaet: string; // in MJ/(m³·K)
  dichte: string; // in 10³ kg/m³
  vdi_referenz_tabelle: string;
  hinweise?: string;
}

export const GRAPH_PALETTE = [
  'rgba(254, 160, 0, 1)',  // Amber Gold
  'rgba(255, 78, 0, 1)',   // Flame Red-Orange
  'rgba(241, 40, 32, 1)',  // Coral Vermilion Red
  'rgba(108, 56, 157, 1)', // Royal Violet
  'rgba(1, 81, 180, 1)',   // Cobalt Blue
  'rgba(1, 127, 142, 1)',  // Ocean Teal Cyan
  'rgba(83, 142, 2, 1)',   // Olive Green
  'rgba(141, 130, 2, 1)',  // Mustard Ochre
  'rgba(141, 130, 2, 0.8)' // Warm Ochre Accent
];

// Vollständige Datenmatrix aus VDI 4640 Blatt 1 (Ausgabe Juni 2010), Tabelle 1 (Seiten 10–11)
export const VDI_4640_TABELLE_1_DATA: SoilProfile[] = [
  // 1. Lockergesteine
  {
    id: 'ton_schluff_trocken',
    name: 'Ton/Schluff (trocken)',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'trocken',
    waermeleitfaehigkeit_min: 0.4,
    waermeleitfaehigkeit_max: 1.0,
    waermeleitfaehigkeit_typisch: 0.5,
    spezifische_waermekapazitaet: '1,5–1,6',
    dichte: '1,8–2,0',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Dichte variiert mit Lagerungsdichte und Feuchtegehalt'
  },
  {
    id: 'ton_schluff_wassergesaettigt',
    name: 'Ton/Schluff (wassergesättigt)',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'wassergesättigt',
    waermeleitfaehigkeit_min: 1.1,
    waermeleitfaehigkeit_max: 3.1,
    waermeleitfaehigkeit_typisch: 1.8,
    spezifische_waermekapazitaet: '2,0–2,8',
    dichte: '2,0–2,2',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Wassergehalt steigert die effektive Leitfähigkeit signifikant'
  },
  {
    id: 'sand_trocken',
    name: 'Sand (trocken)',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'trocken',
    waermeleitfaehigkeit_min: 0.3,
    waermeleitfaehigkeit_max: 0.9,
    waermeleitfaehigkeit_typisch: 0.4,
    spezifische_waermekapazitaet: '1,3–1,6',
    dichte: '1,8–2,2',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Porenraum überwiegend mit Luft (λ ≈ 0,02 W/m·K) gefüllt'
  },
  {
    id: 'sand_feucht',
    name: 'Sand (feucht)',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'feucht',
    waermeleitfaehigkeit_min: 1.0,
    waermeleitfaehigkeit_max: 1.9,
    waermeleitfaehigkeit_typisch: 1.4,
    spezifische_waermekapazitaet: '1,6–2,2',
    dichte: '1,9–2,2',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Kapillarfeuchte bildet Menisken zwischen Quarzkörnern'
  },
  {
    id: 'sand_wassergesaettigt',
    name: 'Sand (wassergesättigt)',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'wassergesättigt',
    waermeleitfaehigkeit_min: 2.0,
    waermeleitfaehigkeit_max: 3.0,
    waermeleitfaehigkeit_typisch: 2.4,
    spezifische_waermekapazitaet: '2,2–2,8',
    dichte: '1,9–2,3',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Vollständige Sättigung des Porenraums mit Wasser'
  },
  {
    id: 'kies_steine_trocken',
    name: 'Kies/Steine (trocken)',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'trocken',
    waermeleitfaehigkeit_min: 0.4,
    waermeleitfaehigkeit_max: 0.9,
    waermeleitfaehigkeit_typisch: 0.4,
    spezifische_waermekapazitaet: '1,3–1,6',
    dichte: '1,8–2,2',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Grobkörniges Matrixgefüge ohne Feuchtigkeitsfilm'
  },
  {
    id: 'kies_steine_wassergesaettigt',
    name: 'Kies/Steine (wassergesättigt)',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'wassergesättigt',
    waermeleitfaehigkeit_min: 1.6,
    waermeleitfaehigkeit_max: 2.5,
    waermeleitfaehigkeit_typisch: 1.8,
    spezifische_waermekapazitaet: '2,2–2,6',
    dichte: '1,9–2,3',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Starke Durchlässigkeit, wasserführender Grundwasserleiter'
  },
  {
    id: 'geschiebemergel_lehm',
    name: 'Geschiebemergel/-lehm',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'feucht',
    waermeleitfaehigkeit_min: 1.1,
    waermeleitfaehigkeit_max: 2.9,
    waermeleitfaehigkeit_typisch: 2.4,
    spezifische_waermekapazitaet: '1,5–2,5',
    dichte: '1,8–2,3',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Glazigener Geschiebemergel mit variablem Ton- und Sandanteil'
  },
  {
    id: 'torf_weichbraunkohle',
    name: 'Torf, Weichbraunkohle',
    kategorie: 'Lockergesteine',
    feuchtezustand: 'organisch',
    waermeleitfaehigkeit_min: 0.2,
    waermeleitfaehigkeit_max: 0.7,
    waermeleitfaehigkeit_typisch: 0.4,
    spezifische_waermekapazitaet: '0,5–3,8',
    dichte: '0,5–1,1',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Organischer Bodenkomplex, sehr geringe Feststoffdichte'
  },

  // 2. Sedimentäre Festgesteine
  {
    id: 'ton_schluffstein',
    name: 'Ton-/Schluffstein',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.1,
    waermeleitfaehigkeit_max: 3.4,
    waermeleitfaehigkeit_typisch: 2.2,
    spezifische_waermekapazitaet: '2,1–2,4',
    dichte: '2,4–2,6',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Konsolidiertes feinklastisches Sedimentgestein'
  },
  {
    id: 'sandstein',
    name: 'Sandstein',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.9,
    waermeleitfaehigkeit_max: 4.6,
    waermeleitfaehigkeit_typisch: 2.8,
    spezifische_waermekapazitaet: '1,8–2,6',
    dichte: '2,2–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Große Bandbreite; abhängig von Kornmaterial, Matrix & Bindemittel'
  },
  {
    id: 'konglomerat_brekzie',
    name: 'Konglomerat/Brekzie',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.3,
    waermeleitfaehigkeit_max: 5.1,
    waermeleitfaehigkeit_typisch: 2.3,
    spezifische_waermekapazitaet: '1,8–2,6',
    dichte: '2,2–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Grobe Klasten mit Matrixbindung, hohe Varianz je nach Geröllkomponenten'
  },
  {
    id: 'mergelstein',
    name: 'Mergelstein',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.8,
    waermeleitfaehigkeit_max: 2.9,
    waermeleitfaehigkeit_typisch: 2.3,
    spezifische_waermekapazitaet: '2,2–2,3',
    dichte: '2,3–2,6',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Kalk-Ton-Mischsedimentgestein'
  },
  {
    id: 'kalkstein',
    name: 'Kalkstein',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 2.0,
    waermeleitfaehigkeit_max: 3.9,
    waermeleitfaehigkeit_typisch: 2.7,
    spezifische_waermekapazitaet: '2,1–2,4',
    dichte: '2,4–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Karbonatgestein, Verkarstungsrisiko bei Planung beachten'
  },
  {
    id: 'dolomitstein',
    name: 'Dolomitstein',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 3.0,
    waermeleitfaehigkeit_max: 5.0,
    waermeleitfaehigkeit_typisch: 3.5,
    spezifische_waermekapazitaet: '2,1–2,4',
    dichte: '2,4–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Magnesiumhaltiges Karbonatgestein mit erhöhter Leitfähigkeit'
  },
  {
    id: 'sulfatgestein_anhydrit',
    name: 'Sulfatgestein (Anhydrit)',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.5,
    waermeleitfaehigkeit_max: 7.7,
    waermeleitfaehigkeit_typisch: 4.1,
    spezifische_waermekapazitaet: '2,0',
    dichte: '2,8–3,0',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Quellfähig bei Wasserzutritt (Umwandlung zu Gips); sehr hoher Maximalwert'
  },
  {
    id: 'sulfatgestein_gips',
    name: 'Sulfatgestein (Gips)',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.3,
    waermeleitfaehigkeit_max: 2.8,
    waermeleitfaehigkeit_typisch: 1.6,
    spezifische_waermekapazitaet: '2,0',
    dichte: '2,2–2,4',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Wasserhaltiges Calciumsulfat, deutlich geringere Leitfähigkeit als Anhydrit'
  },
  {
    id: 'chloridgestein_steinsalz',
    name: 'Chloridgestein (Stein-/Kalisalz)',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 3.6,
    waermeleitfaehigkeit_max: 6.1,
    waermeleitfaehigkeit_typisch: 5.4,
    spezifische_waermekapazitaet: '1,2',
    dichte: '2,1–2,2',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Sehr hohe thermische Leitfähigkeit, wasserlöslich'
  },
  {
    id: 'steinkohle',
    name: 'Steinkohle',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 0.3,
    waermeleitfaehigkeit_max: 0.6,
    waermeleitfaehigkeit_typisch: 0.4,
    spezifische_waermekapazitaet: '1,3–1,8',
    dichte: '1,3–1,6',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Kohlenstoffreiches biogenes Sediment mit isolierender Wirkung'
  },
  {
    id: 'tuff',
    name: 'Tuff',
    kategorie: 'Sedimentäre Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.1,
    waermeleitfaehigkeit_max: 1.1,
    waermeleitfaehigkeit_typisch: 1.1,
    spezifische_waermekapazitaet: '-',
    dichte: '-',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Pyroklastisches Gestein mit poröser Struktur'
  },

  // 3. Magmatische Festgesteine
  {
    id: 'vulkanit_sauer_rhyolit_trachyt',
    name: 'Vulkanit, sauer bis intermediär (Rhyolit, Trachyt)',
    kategorie: 'Magmatische Festgesteine',
    unterkategorie: 'Vulkanite',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 3.1,
    waermeleitfaehigkeit_max: 3.4,
    waermeleitfaehigkeit_typisch: 3.3,
    spezifische_waermekapazitaet: '2,1',
    dichte: '2,6',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Quarzreiches Ergussgestein'
  },
  {
    id: 'vulkanit_sauer_latit_dacit',
    name: 'Vulkanit, sauer bis intermediär (Latit, Dacit)',
    kategorie: 'Magmatische Festgesteine',
    unterkategorie: 'Vulkanite',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 2.0,
    waermeleitfaehigkeit_max: 2.9,
    waermeleitfaehigkeit_typisch: 2.6,
    spezifische_waermekapazitaet: '2,9',
    dichte: '2,9–3,0',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Intermediäre Vulkanite'
  },
  {
    id: 'vulkanit_basisch_andesit_basalt',
    name: 'Vulkanit, basisch bis ultrabasisch (Andesit, Basalt)',
    kategorie: 'Magmatische Festgesteine',
    unterkategorie: 'Vulkanite',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.3,
    waermeleitfaehigkeit_max: 2.3,
    waermeleitfaehigkeit_typisch: 1.7,
    spezifische_waermekapazitaet: '2,3–2,6',
    dichte: '2,6–3,2',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Dunkle mafische Ergussgesteine mit hoher Dichte'
  },
  {
    id: 'plutonit_granit',
    name: 'Plutonit, sauer bis intermediär (Granit)',
    kategorie: 'Magmatische Festgesteine',
    unterkategorie: 'Plutonite',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 2.1,
    waermeleitfaehigkeit_max: 4.1,
    waermeleitfaehigkeit_typisch: 3.2,
    spezifische_waermekapazitaet: '2,1–3,0',
    dichte: '2,4–3,0',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Feldspat, Quarz und Glimmer; weit verbreitetes Tiefengestein'
  },
  {
    id: 'plutonit_syenit',
    name: 'Plutonit, sauer bis intermediär (Syenit)',
    kategorie: 'Magmatische Festgesteine',
    unterkategorie: 'Plutonite',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.7,
    waermeleitfaehigkeit_max: 3.5,
    waermeleitfaehigkeit_typisch: 2.6,
    spezifische_waermekapazitaet: '2,4',
    dichte: '2,5–3,0',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Quarzarmes alkalisches Tiefengestein'
  },
  {
    id: 'plutonit_diorit',
    name: 'Plutonit, basisch bis ultrabasisch (Diorit)',
    kategorie: 'Magmatische Festgesteine',
    unterkategorie: 'Plutonite',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 2.0,
    waermeleitfaehigkeit_max: 2.9,
    waermeleitfaehigkeit_typisch: 2.5,
    spezifische_waermekapazitaet: '2,9',
    dichte: '2,9–3,0',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Intermediäres Tiefengestein mit Plagioklas und Hornblende'
  },
  {
    id: 'plutonit_gabbro',
    name: 'Plutonit, basisch bis ultrabasisch (Gabbro)',
    kategorie: 'Magmatische Festgesteine',
    unterkategorie: 'Plutonite',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.7,
    waermeleitfaehigkeit_max: 2.9,
    waermeleitfaehigkeit_typisch: 2.0,
    spezifische_waermekapazitaet: '2,6',
    dichte: '2,8–3,1',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Basisches Tiefengestein mit Pyroxen und Plagioklas'
  },

  // 4. Metamorphe Festgesteine
  {
    id: 'tonschiefer',
    name: 'Tonschiefer (gering metamorph)',
    kategorie: 'Metamorphe Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.5,
    waermeleitfaehigkeit_max: 2.6,
    waermeleitfaehigkeit_typisch: 2.1,
    spezifische_waermekapazitaet: '2,2–2,5',
    dichte: '2,4–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Anisotropie: Leitfähigkeit parallel zur Schieferung größer als senkrecht'
  },
  {
    id: 'kieselschiefer',
    name: 'Kieselschiefer (gering metamorph)',
    kategorie: 'Metamorphe Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 4.5,
    waermeleitfaehigkeit_max: 5.0,
    waermeleitfaehigkeit_typisch: 4.5,
    spezifische_waermekapazitaet: '2,2',
    dichte: '2,5–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Quarzreiches Chert-Gestein mit hohem Leitwert'
  },
  {
    id: 'marmor',
    name: 'Marmor (mittel bis hoch metamorph)',
    kategorie: 'Metamorphe Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 2.1,
    waermeleitfaehigkeit_max: 3.1,
    waermeleitfaehigkeit_typisch: 2.5,
    spezifische_waermekapazitaet: '2,0',
    dichte: '2,5–2,8',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Metamorphosierter Kalkstein oder Dolomit'
  },
  {
    id: 'quarzit',
    name: 'Quarzit (mittel bis hoch metamorph)',
    kategorie: 'Metamorphe Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 5.0,
    waermeleitfaehigkeit_max: 6.0,
    waermeleitfaehigkeit_typisch: 5.5,
    spezifische_waermekapazitaet: '2,1',
    dichte: '2,5–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Sehr quarzreich, einer der höchsten natürlichen Gesteinsleitwerte'
  },
  {
    id: 'glimmerschiefer',
    name: 'Glimmerschiefer (mittel bis hoch metamorph)',
    kategorie: 'Metamorphe Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.5,
    waermeleitfaehigkeit_max: 3.1,
    waermeleitfaehigkeit_typisch: 2.2,
    spezifische_waermekapazitaet: '2,2–2,4',
    dichte: '2,4–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Starke Anisotropie entlang der Foliationsebenen'
  },
  {
    id: 'gneis',
    name: 'Gneis (mittel bis hoch metamorph)',
    kategorie: 'Metamorphe Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 1.9,
    waermeleitfaehigkeit_max: 4.0,
    waermeleitfaehigkeit_typisch: 2.9,
    spezifische_waermekapazitaet: '1,8–2,4',
    dichte: '2,4–2,7',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Foliertes metamorphes Gestein ähnlicher Zusammensetzung wie Granit'
  },
  {
    id: 'amphibolit',
    name: 'Amphibolit (mittel bis hoch metamorph)',
    kategorie: 'Metamorphe Festgesteine',
    feuchtezustand: 'fest',
    waermeleitfaehigkeit_min: 2.1,
    waermeleitfaehigkeit_max: 3.6,
    waermeleitfaehigkeit_typisch: 2.9,
    spezifische_waermekapazitaet: '2,0–2,3',
    dichte: '2,6–2,9',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Amphibol- und Plagioklas-reiches metamorphes Basaltäquivalent'
  },

  // 5. Andere Stoffe & Baustoffe (Tabelle 1)
  {
    id: 'bentonit',
    name: 'Bentonit',
    kategorie: 'Andere Stoffe',
    feuchtezustand: 'sonstig',
    waermeleitfaehigkeit_min: 0.5,
    waermeleitfaehigkeit_max: 0.8,
    waermeleitfaehigkeit_typisch: 0.6,
    spezifische_waermekapazitaet: '~3,9',
    dichte: '-',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Hinterfüll- / Verpresssuspensionsmaterial für Erdwärmesonden'
  },
  {
    id: 'beton',
    name: 'Beton',
    kategorie: 'Andere Stoffe',
    feuchtezustand: 'sonstig',
    waermeleitfaehigkeit_min: 0.9,
    waermeleitfaehigkeit_max: 2.0,
    waermeleitfaehigkeit_typisch: 1.6,
    spezifische_waermekapazitaet: '~1,8',
    dichte: '~2,0',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Baustoff für Fundamente und thermoaktive Bauteilsysteme'
  },
  {
    id: 'eis_minus_10',
    name: 'Eis (–10 °C)',
    kategorie: 'Andere Stoffe',
    feuchtezustand: 'sonstig',
    waermeleitfaehigkeit_min: 2.32,
    waermeleitfaehigkeit_max: 2.32,
    waermeleitfaehigkeit_typisch: 2.32,
    spezifische_waermekapazitaet: '1,87',
    dichte: '0,919',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Gefrorener Zustand im periglazialen Untergrund oder Eisspeicher'
  },
  {
    id: 'kunststoff_hdpe',
    name: 'Kunststoff (HD-PE)',
    kategorie: 'Andere Stoffe',
    feuchtezustand: 'sonstig',
    waermeleitfaehigkeit_min: 0.42,
    waermeleitfaehigkeit_max: 0.42,
    waermeleitfaehigkeit_typisch: 0.42,
    spezifische_waermekapazitaet: '1,8',
    dichte: '0,96',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Standard-Rohrmaterial für Erdwärmesonden und -kollektoren'
  },
  {
    id: 'luft_0_bis_20',
    name: 'Luft (0 °C bis 20 °C)',
    kategorie: 'Andere Stoffe',
    feuchtezustand: 'sonstig',
    waermeleitfaehigkeit_min: 0.02,
    waermeleitfaehigkeit_max: 0.02,
    waermeleitfaehigkeit_typisch: 0.02,
    spezifische_waermekapazitaet: '0,0012',
    dichte: '0,0012',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Isolierender Effekt in trockenen Bodenporen'
  },
  {
    id: 'stahl',
    name: 'Stahl',
    kategorie: 'Andere Stoffe',
    feuchtezustand: 'sonstig',
    waermeleitfaehigkeit_min: 60,
    waermeleitfaehigkeit_max: 60,
    waermeleitfaehigkeit_typisch: 60,
    spezifische_waermekapazitaet: '3,12',
    dichte: '7,8',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Hohe metallische Wärmeleitung (Verrohrungen / Rammrohre)'
  },
  {
    id: 'wasser_plus_10',
    name: 'Wasser (+10 °C)',
    kategorie: 'Andere Stoffe',
    feuchtezustand: 'wassergesättigt',
    waermeleitfaehigkeit_min: 0.59,
    waermeleitfaehigkeit_max: 0.59,
    waermeleitfaehigkeit_typisch: 0.59,
    spezifische_waermekapazitaet: '4,15',
    dichte: '0,999',
    vdi_referenz_tabelle: 'Tabelle 1',
    hinweise: 'Fluidphase im Porenraum, sehr hohe spezifische Wärmekapazität'
  }
];

// Tabelle 2: Durchlässigkeitsbeiwert kf von Lockergesteinen (DIN 18130-1 / VDI 4640 Blatt 1 Seite 12)
export interface LockergesteinPermeability {
  lockergestein: string;
  kf_bereich: string;
  bewertung: string;
}

export const VDI_4640_TABELLE_2_DATA: LockergesteinPermeability[] = [
  {
    lockergestein: 'Reiner Kies',
    kf_bereich: 'über 10⁻² m/s',
    bewertung: 'sehr stark durchlässig'
  },
  {
    lockergestein: 'Sandiger Kies, Mittel-, Grobsand',
    kf_bereich: 'über 10⁻⁴ bis 10⁻² m/s',
    bewertung: 'stark durchlässig'
  },
  {
    lockergestein: 'Feinsand, schluffiger Sand',
    kf_bereich: 'über 10⁻⁶ bis 10⁻⁴ m/s',
    bewertung: 'durchlässig'
  },
  {
    lockergestein: 'Schluff, toniger Schluff',
    kf_bereich: '10⁻⁸ bis 10⁻⁶ m/s',
    bewertung: 'schwach durchlässig'
  },
  {
    lockergestein: 'Ton, schluffiger Ton',
    kf_bereich: 'unter 10⁻⁸ m/s',
    bewertung: 'sehr schwach durchlässig'
  }
];

// Hilfsfunktion zur Generierung des spezifizierten JSON-Payloads
export function formatSoilProfilesPayload(profiles: SoilProfile[]) {
  return {
    soil_profiles: profiles.map(p => ({
      id: p.id,
      name: p.name,
      waermeleitfaehigkeit_min: p.waermeleitfaehigkeit_min,
      waermeleitfaehigkeit_max: p.waermeleitfaehigkeit_max,
      waermeleitfaehigkeit_typisch: p.waermeleitfaehigkeit_typisch,
      vdi_referenz_tabelle: p.vdi_referenz_tabelle
    }))
  };
}

// Preset-Kombinationen für schnelle Vergleiche
export const PRESETS = [
  {
    title: 'Feuchtigkeitseinfluss auf Sand',
    description: 'Vergleich trocken, feucht und wassergesättigt bei Sand nach Tabelle 1',
    ids: ['sand_trocken', 'sand_feucht', 'sand_wassergesaettigt']
  },
  {
    title: 'Typische Lockergesteine (gesättigt)',
    description: 'Sand, Kies und Ton/Schluff in wassergesättigtem Grundwasserleiter',
    ids: ['sand_wassergesaettigt', 'kies_steine_wassergesaettigt', 'ton_schluff_wassergesaettigt', 'geschiebemergel_lehm']
  },
  {
    title: 'Häufige Sedimentgesteine',
    description: 'Sandstein, Kalkstein, Dolomitstein und Ton-/Schluffstein',
    ids: ['sandstein', 'kalkstein', 'dolomitstein', 'ton_schluffstein']
  },
  {
    title: 'Magmatische & Metamorphe Festgesteine',
    description: 'Granit, Basalt, Gneis und Quarzit im direkten Leitfähigkeitsvergleich',
    ids: ['plutonit_granit', 'vulkanit_basisch_andesit_basalt', 'gneis', 'quarzit']
  },
  {
    title: 'Extremwert-Spektrum',
    description: 'Torf (0,4 W/m·K) vs. Quarzit (5,5 W/m·K) vs. Anhydrit (4,1–7,7 W/m·K)',
    ids: ['torf_weichbraunkohle', 'sand_wassergesaettigt', 'dolomitstein', 'quarzit', 'sulfatgestein_anhydrit']
  }
];
