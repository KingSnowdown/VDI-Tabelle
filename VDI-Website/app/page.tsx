'use client';

import React, { useState, useMemo } from 'react';
import {
  VDI_4640_TABELLE_1_DATA,
  VDI_4640_TABELLE_2_DATA,
  GRAPH_PALETTE,
  PRESETS,
  SoilProfile,
  formatSoilProfilesPayload
} from '@/lib/vdi4640-data';
import {
  Layers,
  FileJson,
  Check,
  Copy,
  Download,
  RotateCcw,
  Search,
  ExternalLink,
  BookOpen,
  Filter,
  BarChart3,
  Table as TableIcon,
  Info,
  Maximize2,
  Droplet,
  Sparkles,
  Compass
} from 'lucide-react';

interface SelectedSoilProfile extends SoilProfile {
  displayColor: string;
  slotIndex: number;
}

export default function VdiComparisonDashboard() {
  // Initial 3 profiles from VDI standard comparison
  const [selectedSoils, setSelectedSoils] = useState<SelectedSoilProfile[]>([
    {
      ...VDI_4640_TABELLE_1_DATA.find(s => s.id === 'sand_wassergesaettigt')!,
      displayColor: GRAPH_PALETTE[0],
      slotIndex: 0
    },
    {
      ...VDI_4640_TABELLE_1_DATA.find(s => s.id === 'sand_trocken')!,
      displayColor: GRAPH_PALETTE[1],
      slotIndex: 1
    },
    {
      ...VDI_4640_TABELLE_1_DATA.find(s => s.id === 'ton_schluff_wassergesaettigt')!,
      displayColor: GRAPH_PALETTE[2],
      slotIndex: 2
    }
  ]);

  const [activeTab, setActiveTab] = useState<'vergleich' | 'matrix' | 'durchlaessigkeit' | 'norm'>('vergleich');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [selectedMoisture, setSelectedMoisture] = useState<string>('alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scaleMode, setScaleMode] = useState<'4' | '8' | 'auto'>('4');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [activeJsonTab, setActiveJsonTab] = useState<'preview' | 'curl'>('preview');

  // Toggle selection with slot allocation
  const toggleSoilSelection = (soil: SoilProfile) => {
    const existingIndex = selectedSoils.findIndex(s => s.id === soil.id);
    if (existingIndex >= 0) {
      // Remove and re-index slots
      const remaining = selectedSoils.filter(s => s.id !== soil.id);
      const reindexed = remaining.map((s, idx) => ({
        ...s,
        displayColor: GRAPH_PALETTE[idx % GRAPH_PALETTE.length],
        slotIndex: idx
      }));
      setSelectedSoils(reindexed);
    } else {
      if (selectedSoils.length < GRAPH_PALETTE.length) {
        const nextIndex = selectedSoils.length;
        const newSelected: SelectedSoilProfile = {
          ...soil,
          displayColor: GRAPH_PALETTE[nextIndex],
          slotIndex: nextIndex
        };
        setSelectedSoils([...selectedSoils, newSelected]);
      }
    }
  };

  const clearAllSelected = () => {
    setSelectedSoils([]);
  };

  const applyPreset = (ids: string[]) => {
    const matched = ids
      .map(id => VDI_4640_TABELLE_1_DATA.find(s => s.id === id))
      .filter((s): s is SoilProfile => Boolean(s))
      .slice(0, GRAPH_PALETTE.length)
      .map((s, idx) => ({
        ...s,
        displayColor: GRAPH_PALETTE[idx],
        slotIndex: idx
      }));
    setSelectedSoils(matched);
  };

  // Filtered pool
  const filteredPool = useMemo(() => {
    return VDI_4640_TABELLE_1_DATA.filter(soil => {
      // Category filter
      if (selectedCategory !== 'Alle' && soil.kategorie !== selectedCategory) {
        return false;
      }
      // Moisture filter
      if (selectedMoisture !== 'alle') {
        if (selectedMoisture === 'trocken' && soil.feuchtezustand !== 'trocken') return false;
        if (selectedMoisture === 'feucht' && soil.feuchtezustand !== 'feucht') return false;
        if (selectedMoisture === 'wassergesättigt' && soil.feuchtezustand !== 'wassergesättigt') return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = soil.name.toLowerCase().includes(q);
        const matchesCategory = soil.kategorie.toLowerCase().includes(q);
        const matchesNotes = soil.hinweise?.toLowerCase().includes(q);
        return matchesName || matchesCategory || matchesNotes;
      }
      return true;
    });
  }, [selectedCategory, selectedMoisture, searchQuery]);

  // Max value calculation for dynamic scaling
  const currentMaxScale = useMemo(() => {
    if (scaleMode === '4') return 4.0;
    if (scaleMode === '8') return 8.0;
    // Auto: find maximum in selected or default to 4
    if (selectedSoils.length === 0) return 4.0;
    const highest = Math.max(...selectedSoils.map(s => s.waermeleitfaehigkeit_max));
    return Math.max(4.0, Math.ceil(highest));
  }, [scaleMode, selectedSoils]);

  // JSON payload according to exact prompt requirement
  const formattedJsonPayload = useMemo(() => {
    return formatSoilProfilesPayload(selectedSoils);
  }, [selectedSoils]);

  const jsonString = useMemo(() => {
    return JSON.stringify(formattedJsonPayload, null, 2);
  }, [formattedJsonPayload]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2200);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vdi4640-bodenprofile-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const categories = [
    'Alle',
    'Lockergesteine',
    'Sedimentäre Festgesteine',
    'Magmatische Festgesteine',
    'Metamorphe Festgesteine',
    'Andere Stoffe'
  ];

  const apiEndpointUrl = selectedSoils.length > 0
    ? `/api/vdi-profiles?ids=${selectedSoils.map(s => s.id).join(',')}`
    : '/api/vdi-profiles';

  return (
    <div className="min-h-screen bg-[#0e1014] text-[#eceff1] font-sans selection:bg-[#fea000]/25 selection:text-white">
      {/* Top Header / Context Banner */}
      <header className="border-b border-[#232732] bg-[#141720]/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#fea000]/10 border border-[#fea000]/30 flex items-center justify-center text-[#fea000] shrink-0 mt-0.5 sm:mt-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-widest text-[#fea000] uppercase font-semibold">
                  VDI 4640 Blatt 1 (2010-06)
                </span>
                <span className="text-[#3b4252] text-xs">/</span>
                <span className="text-[11px] text-[#9ba3b4]">Tabelle 1 & 2 Referenzdaten</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Geologische Wärmeleitfähigkeitsmatrix
              </h1>
            </div>
          </div>

          {/* Direct actions */}
          <div className="flex items-center gap-2 text-xs">
            <a
              href="/assets/aistudio/VDI_4640_Blatt_1_-_2010-06_8c2128e0.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1b202c] hover:bg-[#252b3b] text-[#c7d0e0] border border-[#2d3446] transition-colors"
              title="VDI 4640 Blatt 1 PDF öffnen"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#fea000]" />
              <span>VDI-Originaldokument</span>
              <ExternalLink className="w-3 h-3 text-[#707c93]" />
            </a>

            <div className="px-3 py-1.5 rounded-md bg-[#161a24] border border-[#2a3040] text-[#8e99ac] font-mono">
              <span className="text-white font-semibold">{selectedSoils.length}</span> / {GRAPH_PALETTE.length} Slots
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Presets Quick-Bar */}
        <section className="bg-[#141720] border border-[#222735] rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fea000]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9ba3b4]">
                Schnellvergleiche & VDI-Referenzprofile
              </h2>
            </div>
            {selectedSoils.length > 0 && (
              <button
                onClick={clearAllSelected}
                className="text-xs text-[#8e99ac] hover:text-[#ff4e00] transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Alle leeren
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(preset.ids)}
                className="px-3 py-1.5 rounded-lg text-xs bg-[#1a1f2c] hover:bg-[#222a3c] text-[#d6dbe6] border border-[#283248] hover:border-[#3b4766] transition-all text-left flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#fea000] opacity-75 group-hover:opacity-100" />
                <span className="font-medium">{preset.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 1: Soil Selection Pool with Filter & Search */}
        <section className="bg-[#141720] border border-[#222735] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#222735] bg-[#161a25] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9ba3b4] flex items-center gap-2">
                <span>1. Bodentypen & Gesteine aus VDI 4640 Tabelle 1</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1f2533] text-[#a6b1c6] font-normal">
                  {filteredPool.length} verfügbar
                </span>
              </h2>
              <p className="text-xs text-[#6e788c] mt-0.5">
                Klicken Sie auf ein Profil, um es dem Farb-Slot (max. 9) im Live-Vergleich hinzuzufügen.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#6e788c] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Suchen (z.B. Sand, Kies, Granit)..."
                className="w-full bg-[#10131a] border border-[#2a3142] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#5a6477] focus:outline-none focus:border-[#fea000] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6e788c] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories & Moisture Filter Controls */}
          <div className="px-4 py-3 border-b border-[#202533] bg-[#12151e] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#6e788c] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Kategorie:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#fea000] text-[#10131a] font-semibold'
                      : 'bg-[#1a1f2b] text-[#9ba3b4] hover:bg-[#252c3d] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-[#262d3d] hidden sm:block" />

            {/* Moisture condition filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Droplet className="w-3 h-3 text-[#6e788c]" />
              <span className="text-[11px] text-[#6e788c]">Feuchte:</span>
              {(['alle', 'trocken', 'feucht', 'wassergesättigt'] as const).map(moist => (
                <button
                  key={moist}
                  onClick={() => setSelectedMoisture(moist)}
                  className={`px-2 py-0.5 rounded text-[11px] capitalize transition-colors ${
                    selectedMoisture === moist
                      ? 'bg-[#2b3346] text-white font-medium border border-[#404c66]'
                      : 'text-[#848f9f] hover:text-white'
                  }`}
                >
                  {moist}
                </button>
              ))}
            </div>
          </div>

          {/* Pool Pills Grid */}
          <div className="p-4 flex flex-wrap gap-2 max-h-[280px] overflow-y-auto">
            {filteredPool.length === 0 ? (
              <p className="text-xs text-[#6e788c] py-4 italic">
                Keine Bodentypen für den aktuellen Filter &quot;{searchQuery}&quot; gefunden.
              </p>
            ) : (
              filteredPool.map(soil => {
                const selectedSoil = selectedSoils.find(s => s.id === soil.id);
                const isSelected = Boolean(selectedSoil);
                const isFull = selectedSoils.length >= GRAPH_PALETTE.length && !isSelected;

                return (
                  <button
                    key={soil.id}
                    onClick={() => toggleSoilSelection(soil)}
                    disabled={isFull}
                    title={`λ_typ: ${soil.waermeleitfaehigkeit_typisch} W/m·K (${soil.waermeleitfaehigkeit_min}–${soil.waermeleitfaehigkeit_max}) | Kategorie: ${soil.kategorie}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-white text-[#10131a] border-white shadow-md font-bold'
                        : isFull
                        ? 'bg-[#171a22] text-[#4b5466] border-[#222733] cursor-not-allowed opacity-50'
                        : 'bg-[#1a1f2b] text-[#c5cdd9] border-[#283244] hover:border-[#44526d] hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: selectedSoil?.displayColor }}
                      />
                    ) : (
                      <span className="text-[#6e788c] font-mono text-[11px]">+</span>
                    )}
                    <span>{soil.name}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-[#333]' : 'text-[#737f94]'}`}>
                      {soil.waermeleitfaehigkeit_typisch} W/m·K
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Section 2: Interactive Live Comparison Display & Slots */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (Slots Manager): 4 cols */}
          <div className="lg:col-span-4 bg-[#141720] border border-[#222735] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#222735] mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#fea000]" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9ba3b4]">
                    Aktive Vergleichsprofile ({selectedSoils.length}/{GRAPH_PALETTE.length})
                  </h3>
                </div>
                {selectedSoils.length > 0 && (
                  <button
                    onClick={clearAllSelected}
                    className="text-[11px] text-[#788397] hover:text-[#ff4e00] transition-colors"
                  >
                    Zurücksetzen
                  </button>
                )}
              </div>

              {selectedSoils.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#6e788c] border border-dashed border-[#232938] rounded-lg">
                  <p className="font-medium text-[#8d98ab] mb-1">Keine Profile ausgewählt</p>
                  <p className="text-[11px]">Wählen Sie oben Bodentypen aus, um den Live-Vergleich zu starten.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedSoils.map((soil, index) => (
                    <div
                      key={soil.id}
                      className="p-3 rounded-lg bg-[#181d29] border border-[#262e3f] flex items-start justify-between gap-2.5 transition-all hover:border-[#38445d]"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Slot Color Dot & Number */}
                        <div
                          className="w-4 h-4 rounded-full shrink-0 mt-0.5 shadow-sm flex items-center justify-center text-[9px] font-bold text-white font-mono"
                          style={{ backgroundColor: soil.displayColor }}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{soil.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8e99ab] font-mono">
                            <span className="text-[#fea000] font-bold">λ_typ: {soil.waermeleitfaehigkeit_typisch}</span>
                            <span>({soil.waermeleitfaehigkeit_min}–{soil.waermeleitfaehigkeit_max}) W/m·K</span>
                          </div>
                          <p className="text-[10px] text-[#697486] truncate mt-0.5">
                            {soil.kategorie} · {soil.vdi_referenz_tabelle}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSoilSelection(soil)}
                        aria-label={`${soil.name} entfernen`}
                        className="text-xs text-[#6b768a] hover:text-white p-1 hover:bg-[#232a39] rounded transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Capacity Slot Visualizer */}
            <div className="pt-4 mt-4 border-t border-[#202533]">
              <div className="flex items-center justify-between text-[11px] text-[#7a8597] mb-1.5 font-mono">
                <span>Farb-Slot Kapazität</span>
                <span>{selectedSoils.length} von 9 belegt</span>
              </div>
              <div className="grid grid-cols-9 gap-1 h-2">
                {GRAPH_PALETTE.map((color, idx) => {
                  const isSlotUsed = idx < selectedSoils.length;
                  return (
                    <div
                      key={idx}
                      className="rounded-sm transition-all"
                      style={{
                        backgroundColor: isSlotUsed ? color : '#202533',
                        opacity: isSlotUsed ? 1 : 0.4
                      }}
                      title={`Slot ${idx + 1}: ${isSlotUsed ? selectedSoils[idx].name : 'Frei'}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (Values Overview & Gauges): 8 cols */}
          <div className="lg:col-span-8 bg-[#141720] border border-[#222735] rounded-xl p-5 flex flex-col justify-between">
            <div>
              {/* Header with Scale Mode selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222735] mb-5">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9ba3b4] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#fea000]" />
                    Spezifische Kennwerte (λ in W/m·K)
                  </h3>
                  <p className="text-xs text-[#6e788c] mt-0.5">
                    Wertebereich [Min – Max] mit empfohlenem VDI-Rechenwert (Typisch)
                  </p>
                </div>

                {/* Scale Switcher */}
                <div className="flex items-center gap-1.5 bg-[#10131a] p-1 rounded-lg border border-[#222735] self-start sm:self-auto text-xs">
                  <span className="text-[11px] text-[#6b768a] px-1.5 font-mono">Skala:</span>
                  <button
                    onClick={() => setScaleMode('4')}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                      scaleMode === '4' ? 'bg-[#273043] text-white font-bold' : 'text-[#848f9f] hover:text-white'
                    }`}
                  >
                    0–4 W/m·K
                  </button>
                  <button
                    onClick={() => setScaleMode('8')}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                      scaleMode === '8' ? 'bg-[#273043] text-white font-bold' : 'text-[#848f9f] hover:text-white'
                    }`}
                  >
                    0–8 W/m·K
                  </button>
                  <button
                    onClick={() => setScaleMode('auto')}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                      scaleMode === 'auto' ? 'bg-[#273043] text-white font-bold' : 'text-[#848f9f] hover:text-white'
                    }`}
                  >
                    Auto ({currentMaxScale})
                  </button>
                </div>
              </div>

              {/* Graphical Comparison Bars */}
              {selectedSoils.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#6e788c]">
                  Bitte wählen Sie links oder oben mindestens ein Boden- oder Gesteinsprofil aus.
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Scale Axis Header */}
                  <div className="relative h-5 border-b border-[#232838] mb-2 font-mono text-[10px] text-[#636f83]">
                    <span className="absolute left-0">0.0</span>
                    <span className="absolute left-1/4 -translate-x-1/2">{(currentMaxScale * 0.25).toFixed(1)}</span>
                    <span className="absolute left-2/4 -translate-x-1/2">{(currentMaxScale * 0.5).toFixed(1)}</span>
                    <span className="absolute left-3/4 -translate-x-1/2">{(currentMaxScale * 0.75).toFixed(1)}</span>
                    <span className="absolute right-0">{currentMaxScale.toFixed(1)} W/m·K</span>
                  </div>

                  {selectedSoils.map(soil => {
                    const minPct = Math.min(100, Math.max(0, (soil.waermeleitfaehigkeit_min / currentMaxScale) * 100));
                    const maxPct = Math.min(100, Math.max(0, (soil.waermeleitfaehigkeit_max / currentMaxScale) * 100));
                    const typPct = Math.min(100, Math.max(0, (soil.waermeleitfaehigkeit_typisch / currentMaxScale) * 100));
                    const widthPct = Math.max(1, maxPct - minPct);

                    return (
                      <div key={soil.id} className="space-y-1.5 p-3 rounded-lg bg-[#11141c] border border-[#1e2330]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: soil.displayColor }}
                            />
                            <span className="text-white font-semibold">{soil.name}</span>
                            <span className="text-[10px] text-[#6e788c]">({soil.kategorie})</span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-xs">
                            <span className="text-[#9ba4b4]">
                              Bereich: <span className="text-white">{soil.waermeleitfaehigkeit_min.toFixed(1)}–{soil.waermeleitfaehigkeit_max.toFixed(1)}</span>
                            </span>
                            <span className="text-white font-bold bg-[#1b212f] px-2 py-0.5 rounded border border-[#2b3447]">
                              λ_typ = {soil.waermeleitfaehigkeit_typisch.toFixed(2)} W/m·K
                            </span>
                          </div>
                        </div>

                        {/* Metrikbalken unter Verwendung der dynamischen Farbpalette */}
                        <div className="relative w-full bg-[#1e2330] h-5 rounded-md overflow-hidden my-1">
                          {/* Grid Ticks */}
                          <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                            <div className="w-px h-full bg-white" />
                            <div className="w-px h-full bg-white" />
                            <div className="w-px h-full bg-white" />
                            <div className="w-px h-full bg-white" />
                            <div className="w-px h-full bg-white" />
                          </div>

                          {/* Range Band (min to max) */}
                          <div
                            className="absolute h-full opacity-65 transition-all duration-300 rounded"
                            style={{
                              left: `${minPct}%`,
                              width: `${widthPct}%`,
                              backgroundColor: soil.displayColor
                            }}
                          />

                          {/* Typical Value Needle / Marker */}
                          <div
                            className="absolute top-0 bottom-0 w-1.5 -ml-0.75 bg-white shadow-lg transition-all duration-300 z-10 rounded-sm"
                            style={{
                              left: `${typPct}%`,
                              backgroundColor: '#ffffff'
                            }}
                            title={`Typischer VDI-Rechenwert: ${soil.waermeleitfaehigkeit_typisch} W/m·K`}
                          />
                        </div>

                        {/* Sub-info bar */}
                        <div className="flex items-center justify-between text-[11px] text-[#717c8f] font-mono pt-0.5">
                          <span>Min: {soil.waermeleitfaehigkeit_min}</span>
                          <span className="text-[#a4b0c4]">
                            Spez. Wärmekapazität: <span className="text-white font-medium">{soil.spezifische_waermekapazitaet}</span> MJ/(m³·K)
                          </span>
                          <span className="text-[#a4b0c4]">
                            Dichte: <span className="text-white font-medium">{soil.dichte}</span> ·10³ kg/m³
                          </span>
                          <span>Max: {soil.waermeleitfaehigkeit_max}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-[#232838] pt-3 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#6b768a]">
              <span>* Maßstab bildet {currentMaxScale.toFixed(1)} W/m·K ab (Grundlage: VDI 4640 Blatt 1, Tabelle 1).</span>
              <span className="text-[#8e99ab]">
                Stationäre Wärmeleitung λ in W/(m·K)
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Detailed Table Comparison & Tabelle 2 Tab */}
        <section className="bg-[#141720] border border-[#222735] rounded-xl overflow-hidden">
          <div className="border-b border-[#222735] bg-[#161a25] px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('vergleich')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === 'vergleich'
                    ? 'bg-[#fea000] text-[#10131a]'
                    : 'text-[#9ba3b4] hover:text-white hover:bg-[#1f2535]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Vergleichstabelle (Aktive Auswahl)</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === 'matrix'
                    ? 'bg-[#fea000] text-[#10131a]'
                    : 'text-[#9ba3b4] hover:text-white hover:bg-[#1f2535]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Gesamte VDI-Tabelle 1 ({VDI_4640_TABELLE_1_DATA.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('durchlaessigkeit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === 'durchlaessigkeit'
                    ? 'bg-[#fea000] text-[#10131a]'
                    : 'text-[#9ba3b4] hover:text-white hover:bg-[#1f2535]'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>Hydraulische Durchlässigkeit (Tabelle 2)</span>
              </button>

              <button
                onClick={() => setActiveTab('norm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === 'norm'
                    ? 'bg-[#fea000] text-[#10131a]'
                    : 'text-[#9ba3b4] hover:text-white hover:bg-[#1f2535]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Norm-Grounding & VDI-Zitate</span>
              </button>
            </div>
          </div>

          <div className="p-5">
            {activeTab === 'vergleich' && (
              selectedSoils.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#6e788c]">
                  Keine Profile ausgewählt. Wählen Sie oben Profile aus, um die Vergleichstabelle zu füllen.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#232838] text-[#8e99ab] font-mono text-[11px]">
                        <th className="py-2.5 px-3">Slot</th>
                        <th className="py-2.5 px-3">Gesteinstyp / Boden</th>
                        <th className="py-2.5 px-3">Kategorie</th>
                        <th className="py-2.5 px-3 text-right">λ_min [W/(m·K)]</th>
                        <th className="py-2.5 px-3 text-right font-bold text-white">λ_typisch [W/(m·K)]</th>
                        <th className="py-2.5 px-3 text-right">λ_max [W/(m·K)]</th>
                        <th className="py-2.5 px-3 text-right">ρ·cp [MJ/(m³·K)]</th>
                        <th className="py-2.5 px-3 text-right">Dichte ρ [10³ kg/m³]</th>
                        <th className="py-2.5 px-3">Referenz</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2330]">
                      {selectedSoils.map((soil, idx) => (
                        <tr key={soil.id} className="hover:bg-[#181d2a] transition-colors">
                          <td className="py-3 px-3">
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white font-mono"
                              style={{ backgroundColor: soil.displayColor }}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-white">
                            <div>{soil.name}</div>
                            {soil.hinweise && (
                              <div className="text-[10px] text-[#6b768a] font-normal">{soil.hinweise}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-[#9ba3b4]">{soil.kategorie}</td>
                          <td className="py-3 px-3 text-right font-mono text-[#abb5c6]">{soil.waermeleitfaehigkeit_min.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#fea000] text-sm">
                            {soil.waermeleitfaehigkeit_typisch.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#abb5c6]">{soil.waermeleitfaehigkeit_max.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right font-mono text-[#9ba3b4]">{soil.spezifische_waermekapazitaet}</td>
                          <td className="py-3 px-3 text-right font-mono text-[#9ba3b4]">{soil.dichte}</td>
                          <td className="py-3 px-3 text-[#6e788c] font-mono text-[11px]">{soil.vdi_referenz_tabelle}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {activeTab === 'matrix' && (
              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#161a25] z-10">
                    <tr className="border-b border-[#232838] text-[#8e99ab] font-mono text-[11px]">
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Gesteinstyp (VDI-Nomenklatur)</th>
                      <th className="py-2.5 px-3">Kategorie</th>
                      <th className="py-2.5 px-3 text-right">λ_min</th>
                      <th className="py-2.5 px-3 text-right font-bold text-white">λ_typ (Rechenwert)</th>
                      <th className="py-2.5 px-3 text-right">λ_max</th>
                      <th className="py-2.5 px-3 text-right">ρ·cp [MJ/(m³·K)]</th>
                      <th className="py-2.5 px-3 text-right">Dichte [10³ kg/m³]</th>
                      <th className="py-2.5 px-3">Hinweise / Matrix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2330]">
                    {VDI_4640_TABELLE_1_DATA.map(soil => {
                      const isSelected = selectedSoils.some(s => s.id === soil.id);
                      return (
                        <tr
                          key={soil.id}
                          onClick={() => toggleSoilSelection(soil)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#1b2230] font-medium' : 'hover:bg-[#161b26]'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                              isSelected ? 'bg-white text-black font-bold' : 'bg-[#222736] text-[#717c8f]'
                            }`}>
                              {isSelected ? 'Aktiv' : '+'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white">{soil.name}</td>
                          <td className="py-2.5 px-3 text-[#8b95a8]">{soil.kategorie}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#9ba4b4]">{soil.waermeleitfaehigkeit_min}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#fea000]">{soil.waermeleitfaehigkeit_typisch}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#9ba4b4]">{soil.waermeleitfaehigkeit_max}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#8b95a8]">{soil.spezifische_waermekapazitaet}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#8b95a8]">{soil.dichte}</td>
                          <td className="py-2.5 px-3 text-[#647083] text-[11px]">{soil.hinweise || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'durchlaessigkeit' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#9ba3b4]">
                  <Info className="w-4 h-4 text-[#fea000]" />
                  <span>
                    VDI 4640 Blatt 1, Seite 12 — Tabelle 2: Anhaltswerte für die Durchlässigkeit von Lockergesteinen (in Anlehnung an DIN 18130-1)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#232838] text-[#8e99ab] font-mono text-[11px]">
                        <th className="py-2.5 px-3">Lockergestein</th>
                        <th className="py-2.5 px-3">Durchlässigkeitsbeiwert kf [m/s]</th>
                        <th className="py-2.5 px-3">Bewertung der Durchlässigkeit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2330]">
                      {VDI_4640_TABELLE_2_DATA.map((row, i) => (
                        <tr key={i} className="hover:bg-[#181d2a]">
                          <td className="py-3 px-3 font-semibold text-white">{row.lockergestein}</td>
                          <td className="py-3 px-3 font-mono text-[#fea000] text-sm">{row.kf_bereich}</td>
                          <td className="py-3 px-3 text-[#abb5c6] capitalize">{row.bewertung}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-[#6e788c] pt-2">
                  Hinweis: Für den konvektiven Wärmetransport im Grundwasserleiter ist die hydraulische Durchlässigkeit kf (m/s) maßgeblich (VDI 4640 Abs. 4.1).
                </p>
              </div>
            )}

            {activeTab === 'norm' && (
              <div className="space-y-4 text-xs text-[#a0aab8] leading-relaxed">
                <div className="p-4 rounded-lg bg-[#11141c] border border-[#212735] space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#fea000]" />
                    Normenreferenz: VDI-Richtlinie 4640 Blatt 1 (Ausgabe Juni 2010)
                  </h4>
                  <p>
                    Titel: <span className="text-white italic">Thermische Nutzung des Untergrunds — Grundlagen, Genehmigungen, Umweltaspekte (Thermal use of the underground — Fundamentals, approvals, environmental aspects)</span>. Herausgegeben vom Verein Deutscher Ingenieure (VDI-Gesellschaft Energie und Umwelt).
                  </p>
                  <p>
                    Gültigkeit: Tabelle 1 (Seite 10–11) fasst die empirisch validierten Rechenwerte für stationäre Wärmeleitfähigkeit λ [W/(m·K)], volumenbezogene spezifische Wärmekapazität ρ·cp [MJ/(m³·K)] und Gesteinsdichte ρ [10³ kg/m³] zusammen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#11141c] border border-[#212735]">
                    <h5 className="font-semibold text-white mb-2">VDI Anmerkung 1 (Lagerung & Feuchte)</h5>
                    <p className="text-[#8894a8]">
                      &quot;Die Dichte variiert bei Lockergesteinen besonders stark mit Lagerungsdichte und Wassergehalt.&quot; Bei Sand steigt λ von 0,4 (trocken) auf 1,4 (feucht) und 2,4 W/(m·K) (wassergesättigt).
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#11141c] border border-[#212735]">
                    <h5 className="font-semibold text-white mb-2">VDI Anmerkung 2 (Matrix & Bindemittel)</h5>
                    <p className="text-[#8894a8]">
                      &quot;Bei Sandstein, Konglomerat und Brekzie liegt eine besonders große Bandbreite der Wärmeleitfähigkeit vor; neben Kornmaterial und -verteilung und der Wassersättigung spielt hier noch die Art des Bindemittels bzw. der Matrix eine wesentliche Rolle.&quot;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Live Structured JSON Payload Engine (Prompt Specified Directive) */}
        <section className="bg-[#141720] border border-[#222735] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#222735] bg-[#161a25] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#10131a] border border-[#2a3040] flex items-center justify-center text-[#fea000]">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>Interaktive JSON-Schnittstelle (Spezifikations-Payload)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#fea000]/15 text-[#fea000]">
                    Live Generator
                  </span>
                </h3>
                <p className="text-xs text-[#6e788c]">
                  Exaktes Datenformat für Auslegungssoftware & Schnittstellen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  copiedJson
                    ? 'bg-[#538e02] text-white border-[#538e02]'
                    : 'bg-[#1b202c] hover:bg-[#252b3b] text-white border-[#2e3648]'
                }`}
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9ba4b4]" />
                    <span>JSON kopieren</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1b202c] hover:bg-[#252b3b] text-white border border-[#2e3648] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#9ba4b4]" />
                <span>Download .json</span>
              </button>
            </div>
          </div>

          {/* JSON Payload View */}
          <div className="p-4 bg-[#0d1017]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1f2433] text-[11px] font-mono text-[#636f83]">
              <span>Format: RFC 8259 Application/JSON (VDI 4640 Payload)</span>
              <a
                href={apiEndpointUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fea000] hover:underline flex items-center gap-1"
              >
                <span>REST API Endpunkt aufrufen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <pre className="p-4 rounded-lg bg-[#090b10] border border-[#1b202b] text-xs font-mono text-[#89d185] overflow-x-auto max-h-[320px] leading-relaxed">
              <code>{jsonString}</code>
            </pre>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1d222e] mt-12 py-6 bg-[#0c0e13] text-center text-xs text-[#5e687a]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            VDI 4640 Blatt 1 — Geologische Wärmeleitfähigkeitsmatrix. Datenbasis: Richtlinie VDI 4640 Blatt 1 (2010-06).
          </p>
          <p className="text-[11px]">
            Reine Materialparameter ohne Anwendungsschicht.
          </p>
        </div>
      </footer>
    </div>
  );
}
