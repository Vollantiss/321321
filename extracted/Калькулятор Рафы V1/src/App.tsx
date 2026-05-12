import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Printer, Clock, Database,
  Plus, Trash2, X, ChevronDown, Check, Layers,
  FileText, Scissors, Zap, Send, Mail, Heart
} from 'lucide-react';
import {
  PaperType, ExtraService, FormatOption,
  FORMAT_OPTIONS, SRA3_WIDTH, SRA3_HEIGHT
} from './types';
import { cn } from './utils/cn';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function calcFitOnSheet(w: number, h: number): number {
  const fit1 = Math.floor(SRA3_WIDTH / w) * Math.floor(SRA3_HEIGHT / h);
  const fit2 = Math.floor(SRA3_WIDTH / h) * Math.floor(SRA3_HEIGHT / w);
  return Math.max(fit1, fit2);
}

/* ======= Modal ======= */
function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#1e2235] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ======= Circular Dial ======= */
function CircularDial({ value, maxValue, onChange, label, color, glowColor, unit, variant }: {
function CircularDial({ value, maxValue, onChange, label, icon, color, glowColor, unit = 'мин', size = 'md' }: {
  value: number;
  maxValue: number;
  onChange: (v: number) => void;
  label: string;
  color: string;
  glowColor: string;
  unit: string;
  variant: 'hours' | 'minutes';
  icon?: React.ReactNode;
  color: string;
  glowColor: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const center = 50;
  const radius = 36;
  const strokeWidth = variant === 'hours' ? 7 : 6;
  const circumference = 2 * Math.PI * radius;
  const safeMaxValue = Math.max(maxValue, 1);
  const clampedValue = Math.max(0, Math.min(value, safeMaxValue));
  const progress = Math.min(clampedValue / safeMaxValue, 1);
  const dashOffset = circumference * (1 - progress);
  const isHourDial = variant === 'hours';
  const radius = 40;
  const strokeWidth = size === 'sm' ? 7 : 6;
  const center = 50;
  const circumference = 2 * Math.PI * radius;
  const safeMaxValue = Math.max(maxValue, 1);
  const progress = Math.min(value / safeMaxValue, 1);
  const dashOffset = circumference * (1 - progress);
  const svgSize = size === 'lg' ? 'w-32 h-32' : size === 'sm' ? 'w-20 h-20' : 'w-28 h-28';
  const valueFontSize = size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px';
  const unitFontSize = size === 'sm' ? '7px' : '8px';

  const angleFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  }, []);

  const updateValue = useCallback((e: MouseEvent | React.MouseEvent) => {
    const angle = angleFromEvent(e);
    if (angle === null) return;
    const newVal = Math.round((angle / 360) * safeMaxValue);
    onChange(Math.max(0, Math.min(safeMaxValue, newVal)));
  }, [angleFromEvent, safeMaxValue, onChange]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (isDragging.current) updateValue(e);
      if (isDragging.current) {
        updateValue(e);
      }
    };
    const handleUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [updateValue]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updateValue(e);
  };

  // Knob position
  const knobAngle = (progress * 360 - 90) * (Math.PI / 180);
  const knobX = center + radius * Math.cos(knobAngle);
  const knobY = center + radius * Math.sin(knobAngle);

  return (
    <div className={cn('min-w-0 rounded-xl border border-white/5 bg-black/10 p-2', isHourDial ? 'w-full' : 'w-24 sm:w-28')}>
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="mx-auto aspect-square w-full max-w-28 cursor-pointer select-none overflow-visible"
        onMouseDown={handleMouseDown}
        role="slider"
        aria-label={`${label}: ${clampedValue} ${unit}`}
        aria-valuemin={0}
        aria-valuemax={safeMaxValue}
        aria-valuenow={clampedValue}
      >
        <defs>
          <filter id={`glow-${label}-${unit}-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className={cn(svgSize, 'cursor-pointer select-none')}
        onMouseDown={handleMouseDown}
      >
        {/* Background glow */}
        <defs>
          <filter id={`glow-${label}-${unit}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={center} cy={center} r={radius}
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Background track */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          filter={`url(#glow-${label}-${unit}-${variant})`}
          className="transition-all duration-100"
        />
        {clampedValue > 0 && (
          <circle
            cx={knobX} cy={knobY} r={4}
            fill="white"
            stroke={color}
            strokeWidth={2}
          />
        )}
        <text x={center} y={center - 3} textAnchor="middle" className="fill-white font-black" style={{ fontSize: isHourDial ? '18px' : '15px' }}>
          {clampedValue}
        </text>
        <text x={center} y={center + 12} textAnchor="middle" className="fill-gray-500" style={{ fontSize: '8px' }}>
          {unit}
        </text>
      </svg>

      <div className="mt-2 flex flex-col items-center gap-2">
        <span className="text-[11px] font-bold leading-none" style={{ color: glowColor }}>{label}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, clampedValue - 1))}
            className="grid h-7 w-7 place-items-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            aria-label={`Уменьшить ${label.toLowerCase()}`}
          >
            −
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.min(safeMaxValue, clampedValue + 1))}
            className="grid h-7 w-7 place-items-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            aria-label={`Увеличить ${label.toLowerCase()}`}
          >
            +
          </button>
        </div>
          filter={`url(#glow-${label}-${unit})`}
          className="transition-all duration-100"
        />
        {/* Knob */}
        {value > 0 && (
          <circle
            cx={knobX} cy={knobY} r={size === 'sm' ? 3.5 : 4}
            fill="white"
            stroke={color}
            strokeWidth={2}
            className="drop-shadow-lg"
          />
        )}
        {/* Center text */}
        <text x={center} y={center - 4} textAnchor="middle" className="fill-white font-black" style={{ fontSize: valueFontSize }}>
          {value}
        </text>
        <text x={center} y={center + 10} textAnchor="middle" className="fill-gray-500" style={{ fontSize: unitFontSize }}>
          {unit}
        </text>
      </svg>
      <div className="flex items-center gap-1.5 mt-1.5">
        {icon}
        <span className="text-xs font-semibold" style={{ color: glowColor }}>{label}</span>
      </div>
      {/* +/- buttons */}
      <div className="flex items-center gap-1 mt-1.5">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
        >
          −
        </button>
        <button
          onClick={() => onChange(Math.min(safeMaxValue, value + 1))}
          className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
}

function TimeDialGroup({ label, totalMinutes, onChange, icon, color, glowColor }: {
  label: string;
  totalMinutes: number;
  onChange: (minutes: number) => void;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}) {
  const normalizedTotal = Math.max(0, totalMinutes);
  const hours = Math.floor(normalizedTotal / 60);
  const minutes = normalizedTotal % 60;
  const setHours = (nextHours: number) => onChange(nextHours * 60 + minutes);
  const setMinutes = (nextMinutes: number) => onChange(hours * 60 + nextMinutes);
  const costRub = (normalizedTotal / 60) * 1000;

  return (
    <section className="min-w-0 rounded-2xl bg-white/[0.03] border border-white/5 p-3 sm:p-4">
      <div className="mb-3 flex min-w-0 items-center justify-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-sm font-bold text-gray-200">{label}</span>
      </div>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3">
        <CircularDial
          value={hours}
          maxValue={12}
          onChange={setHours}
          label="Часы"
          color={color}
          glowColor={glowColor}
          unit="ч"
          variant="hours"
        />
        <CircularDial
          value={minutes}
          maxValue={59}
          onChange={setMinutes}
          label="Минуты"
          color={color}
          glowColor={glowColor}
          unit="мин"
          variant="minutes"
        />
      </div>

      <div className="mt-3 rounded-xl bg-black/10 px-2 py-2 text-center text-[11px] font-semibold" style={{ color: glowColor }}>
        {hours} ч {minutes} мин · {costRub.toFixed(0)} ₽
      </div>
    </section>
  );
}


/* ======= Main App ======= */
export function App() {
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>(FORMAT_OPTIONS[4]);
  const [customWidth, setCustomWidth] = useState(100);
  const [customHeight, setCustomHeight] = useState(100);
  const [bleed, setBleed] = useState(true);
  const [quantity, setQuantity] = useState(500);
  const [doubleSided, setDoubleSided] = useState(true);

  const [papers, setPapers] = useState<PaperType[]>([
    { id: '1', name: 'Nevia 300гр', pricePerSheet: 13 },
    { id: '2', name: 'Меловка 130гр', pricePerSheet: 2.2 },
    { id: '3', name: 'Меловка 150гр', pricePerSheet: 2.5 },
    { id: '4', name: 'Меловка 200гр', pricePerSheet: 4.08 },
    { id: '5', name: 'Меловка 300гр', pricePerSheet: 6.15 },
    { id: '6', name: 'Оффсет 80гр', pricePerSheet: 2.62 },
    { id: '7', name: 'Nevia 160гр', pricePerSheet: 5.6 },
    { id: '8', name: 'Самоклейка', pricePerSheet: 16 },
    { id: '9', name: 'Плёнка белая', pricePerSheet: 53.9 },
    { id: '10', name: 'Плёнка прозрачная', pricePerSheet: 54.37 },
    { id: '11', name: 'Лён', pricePerSheet: 58.59 },
  ]);
  const [selectedPaper, setSelectedPaper] = useState<PaperType>({ id: '1', name: 'Nevia 300гр', pricePerSheet: 13 });
  const [paperModalOpen, setPaperModalOpen] = useState(false);
  const [newPaperName, setNewPaperName] = useState('');
  const [newPaperPrice, setNewPaperPrice] = useState(0);

  const [extras, setExtras] = useState<ExtraService[]>([
    { id: '1', name: 'Софт-тач ламинация', pricePerUnit: 18 },
    { id: '2', name: 'Глянцевая ламинация', pricePerUnit: 8 },
    { id: '3', name: 'Матовая ламинация', pricePerUnit: 8 },
    { id: '4', name: 'Глянцевая толстая ламинация', pricePerUnit: 35 },
    { id: '5', name: 'Матовая толстая ламинация', pricePerUnit: 35 },
  ]);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, { active: boolean; qty: number }>>({});
  const [extrasModalOpen, setExtrasModalOpen] = useState(false);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState(0);

  const [cuttingTime, setCuttingTime] = useState(6);
  const [printingTime, setPrintingTime] = useState(6);
  const [laminationTime, setLaminationTime] = useState(0);

  const [profitPercent, setProfitPercent] = useState(55);
  const [debugOpen, setDebugOpen] = useState(false);

  /* ======= Calculations ======= */
  const calcs = useMemo(() => {
    const bleedMm = bleed ? 2 : 0;
    const itemW = selectedFormat.width + bleedMm * 2;
    const itemH = selectedFormat.height + bleedMm * 2;

    const perSheet = calcFitOnSheet(itemW, itemH);
    const sheetsNeeded = perSheet > 0 ? Math.ceil(quantity / perSheet) : 0;

    const sheetsCost = sheetsNeeded * selectedPaper.pricePerSheet;
    const inkCostPerSheet = doubleSided ? 40 : 20;
    const inkCost = sheetsNeeded * inkCostPerSheet;
    const materialsCost = sheetsCost + inkCost;

    let extrasCost = 0;
    for (const ext of extras) {
      const sel = selectedExtras[ext.id];
      if (sel && sel.active) {
        extrasCost += ext.pricePerUnit * (sel.qty || quantity);
      }
    }

    const totalWorkMinutes = cuttingTime + printingTime + laminationTime;
    const workCost = (totalWorkMinutes / 60) * 1000;

    const totalCosts = materialsCost + extrasCost + workCost;

    const profitFraction = profitPercent / 100;
    const denom = 0.89 * (1 - profitFraction);
    let x = 0;
    if (denom > 0 && totalCosts > 0) {
      x = totalCosts / denom;
    }

    const cleanOrder = x * 0.89;
    const plannedProfit = cleanOrder - totalCosts;
    const pricePerPiece = quantity > 0 ? x / quantity : 0;

    const actualProfitPercent = cleanOrder > 0 ? (plannedProfit / cleanOrder) * 100 : 0;

    return {
      itemW, itemH, perSheet, sheetsNeeded,
      sheetsCost, inkCost, materialsCost,
      extrasCost, totalWorkMinutes, workCost,
      totalCosts, x, cleanOrder, plannedProfit, pricePerPiece,
      actualProfitPercent
    };
  }, [selectedFormat, bleed, quantity, doubleSided, selectedPaper, extras, selectedExtras, cuttingTime, printingTime, laminationTime, profitPercent]);

  // Paper management
  const addPaper = useCallback(() => {
    if (!newPaperName.trim() || newPaperPrice <= 0) return;
    const p: PaperType = { id: generateId(), name: newPaperName, pricePerSheet: newPaperPrice };
    setPapers(prev => [...prev, p]);
    setNewPaperName('');
    setNewPaperPrice(0);
  }, [newPaperName, newPaperPrice]);

  const deletePaper = useCallback((id: string) => {
    setPapers(prev => {
      const next = prev.filter(p => p.id !== id);
      if (selectedPaper.id === id && next.length > 0) {
        setSelectedPaper(next[0]);
      }
      return next;
    });
  }, [selectedPaper]);

  const addExtra = useCallback(() => {
    if (!newExtraName.trim() || newExtraPrice <= 0) return;
    const e: ExtraService = { id: generateId(), name: newExtraName, pricePerUnit: newExtraPrice };
    setExtras(prev => [...prev, e]);
    setNewExtraName('');
    setNewExtraPrice(0);
  }, [newExtraName, newExtraPrice]);

  const deleteExtra = useCallback((id: string) => {
    setExtras(prev => prev.filter(e => e.id !== id));
    setSelectedExtras(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const toggleExtra = useCallback((id: string) => {
    setSelectedExtras(prev => ({
      ...prev,
      [id]: { active: !(prev[id]?.active), qty: prev[id]?.qty || quantity }
    }));
  }, [quantity]);

  const setExtraQty = useCallback((id: string, qty: number) => {
    setSelectedExtras(prev => ({
      ...prev,
      [id]: { active: prev[id]?.active ?? false, qty }
    }));
  }, []);

  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n: number) => Math.round(n).toLocaleString('ru-RU');

  const sliderPercent = (profitPercent / 150) * 100;
  const isCustomFormat = selectedFormat.id === 'custom';
  const customFormat: FormatOption = { id: 'custom', label: 'Кастом', width: customWidth, height: customHeight };
  const selectCustomFormat = () => setSelectedFormat(customFormat);

  const debugData = {
    selectedFormat,
    bleed,
    quantity,
    doubleSided,
    selectedPaper,
    selectedExtras,
    workTime: {
      printingMinutes: printingTime,
      cuttingMinutes: cuttingTime,
      laminationMinutes: laminationTime,
      totalMinutes: calcs.totalWorkMinutes,
    },
    profitPercent,
    calculations: calcs,
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#161822]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Printer size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Калькулятор от Рафы <span className="text-indigo-400 font-normal text-sm">( Vollantiss )</span></h1>
            <p className="text-[11px] text-gray-500">Сделано с любовью — чтобы не гадать.</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setPaperModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium transition-all">
              <Database size={15} className="text-emerald-400" />
              <span className="hidden sm:inline text-gray-300">Бумага</span>
            </button>
            <button onClick={() => setExtrasModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium transition-all">
              <Layers size={15} className="text-purple-400" />
              <span className="hidden sm:inline text-gray-300">Услуги</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-5 space-y-5">

        {/* ====== TOP: PRICE HERO ====== */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1a1d2e] to-[#161822] border border-white/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {/* Left: Planned Profit */}
            <div className="text-center md:text-right order-2 md:order-1 flex-shrink-0">
              <div className="text-[11px] font-semibold text-green-400/80 uppercase tracking-widest mb-1">Плановая прибыль</div>
              <div className="text-2xl md:text-3xl font-black text-green-400">{fmt(calcs.plannedProfit)} <span className="text-lg">₽</span></div>
              <div className="text-xs text-gray-500 mt-1">
                {calcs.actualProfitPercent > 0 ? `${Math.round(calcs.actualProfitPercent)}% от чистой` : '—'}
              </div>
            </div>

            {/* Center: Order Cost */}
            <div className="text-center order-1 md:order-2 flex-shrink-0">
              <div className="text-[11px] font-semibold text-indigo-400/80 uppercase tracking-widest mb-2">Стоимость заказа</div>
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                {fmtInt(calcs.x)} <span className="text-3xl md:text-4xl">₽</span>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                За штуку: <span className="text-indigo-300 font-bold">{fmt(calcs.pricePerPiece)} ₽</span>
              </div>
            </div>

            {/* Right: Clean Cost */}
            <div className="text-center md:text-left order-3 flex-shrink-0">
              <div className="text-[11px] font-semibold text-sky-400/80 uppercase tracking-widest mb-1">Чистая стоимость</div>
              <div className="text-2xl md:text-3xl font-black text-sky-400">{fmt(calcs.cleanOrder)} <span className="text-lg">₽</span></div>
              <div className="text-xs text-gray-500 mt-1">X − 11% (НДС/налоги)</div>
            </div>
          </div>
        </div>

        {/* ====== COST BREAKDOWN ROW ====== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Materials */}
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <FileText size={14} className="text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400/80 uppercase tracking-wider">Материалы</span>
            </div>
            <div className="text-xl font-black text-white">{fmt(calcs.materialsCost)} ₽</div>
            <div className="text-[11px] text-gray-500 mt-2 space-y-0.5">
              <div>Бумага: {fmt(calcs.sheetsCost)} ₽ ({calcs.sheetsNeeded} л.)</div>
              <div>Краска: {fmt(calcs.inkCost)} ₽</div>
            </div>
          </div>

          {/* Extras */}
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-purple-400"></div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <Layers size={14} className="text-purple-400" />
              </div>
              <span className="text-[11px] font-bold text-purple-400/80 uppercase tracking-wider">Доп. услуги</span>
            </div>
            <div className="text-xl font-black text-white">{fmt(calcs.extrasCost)} ₽</div>
            <div className="text-[11px] text-gray-500 mt-2">
              {Object.entries(selectedExtras).filter(([, v]) => v.active).length} услуг выбрано
            </div>
          </div>

          {/* Work */}
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-400"></div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <Clock size={14} className="text-amber-400" />
              </div>
              <span className="text-[11px] font-bold text-amber-400/80 uppercase tracking-wider">Работа</span>
            </div>
            <div className="text-xl font-black text-white">{fmt(calcs.workCost)} ₽</div>
            <div className="text-[11px] text-gray-500 mt-2">
              {calcs.totalWorkMinutes} мин. (1000 ₽/час)
            </div>
          </div>

          {/* Total Cost */}
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500 to-rose-400"></div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-rose-500/10">
                <Zap size={14} className="text-rose-400" />
              </div>
              <span className="text-[11px] font-bold text-rose-400/80 uppercase tracking-wider">Себестоимость</span>
            </div>
            <div className="text-xl font-black text-white">{fmt(calcs.totalCosts)} ₽</div>
            <div className="text-[11px] text-gray-500 mt-2">
              Все затраты на тираж
            </div>
          </div>
        </div>

        {/* ====== MAIN CONTROLS ====== */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* FORMAT */}
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10">
                <FileText size={15} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-sm text-gray-200">Формат</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f)}
                  className={cn(
                    'px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                    selectedFormat.id === f.id
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : 'bg-white/3 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300'
                  )}
                >
                  {f.label}
                </button>
              ))}
              <button
                onClick={selectCustomFormat}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                  isCustomFormat
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/3 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300'
                )}
              >
                Кастом
              </button>
            </div>
            {isCustomFormat && (
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] border border-white/5 p-3">
                <label className="space-y-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Ширина, мм</span>
                  <input
                    type="number"
                    min={1}
                    value={customWidth || ''}
                    onChange={e => {
                      const width = Math.max(1, Number(e.target.value));
                      setCustomWidth(width);
                      setSelectedFormat({ ...customFormat, width });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Высота, мм</span>
                  <input
                    type="number"
                    min={1}
                    value={customHeight || ''}
                    onChange={e => {
                      const height = Math.max(1, Number(e.target.value));
                      setCustomHeight(height);
                      setSelectedFormat({ ...customFormat, height });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>
            )}
            <div className="text-xs text-gray-500 text-center">
              {calcs.itemW} × {calcs.itemH} мм
              {bleed && <span className="text-indigo-400"> (с полями)</span>}
            </div>
            <button onClick={() => setBleed(!bleed)} className="flex items-center gap-3 cursor-pointer group px-1 w-full text-left">
              <div className={cn(
                'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0',
                bleed
                  ? 'bg-indigo-500 border-indigo-400'
                  : 'border-gray-600 group-hover:border-gray-500'
              )}>
                {bleed && <Check size={13} className="text-white" />}
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300">Поля под обрез (+2мм с каждой стороны)</span>
            </button>
          </div>

          {/* PAPER + PARAMS */}
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <Database size={15} className="text-emerald-400" />
              </div>
              <h3 className="font-bold text-sm text-gray-200">Бумага и параметры</h3>
            </div>
            <div className="relative">
              <select
                value={selectedPaper.id}
                onChange={e => {
                  const p = papers.find(pp => pp.id === e.target.value);
                  if (p) setSelectedPaper(p);
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm"
              >
                {papers.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#1e2235] text-white">
                    {p.name} — {p.pricePerSheet} ₽/лист
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Тираж (шт.)</label>
              <input
                type="number"
                min={1}
                value={quantity || ''}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDoubleSided(false)}
                className={cn(
                  'flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                  !doubleSided
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-white/3 border-white/5 text-gray-400 hover:bg-white/5'
                )}
              >
                Односторонняя
              </button>
              <button
                onClick={() => setDoubleSided(true)}
                className={cn(
                  'flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                  doubleSided
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-white/3 border-white/5 text-gray-400 hover:bg-white/5'
                )}
              >
                Двухсторонняя
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/3 border border-white/5 p-2.5">
                <div className="text-base font-bold text-emerald-400">{selectedPaper.pricePerSheet}₽</div>
                <div className="text-[10px] text-gray-500">за лист</div>
              </div>
              <div className="rounded-xl bg-white/3 border border-white/5 p-2.5">
                <div className="text-base font-bold text-amber-400">{calcs.perSheet}</div>
                <div className="text-[10px] text-gray-500">на листе</div>
              </div>
              <div className="rounded-xl bg-white/3 border border-white/5 p-2.5">
                <div className="text-base font-bold text-sky-400">{calcs.sheetsNeeded}</div>
                <div className="text-[10px] text-gray-500">листов</div>
              </div>
            </div>
          </div>

          {/* PROFITABILITY + CIRCULAR DIALS */}
          <div className="min-w-0 rounded-2xl bg-[#161822] border border-white/5 p-5 space-y-5 overflow-hidden xl:col-span-3 2xl:col-span-1">
            <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10">
                <Scissors size={15} className="text-cyan-400" />
              </div>
              <h3 className="font-bold text-sm text-gray-200">Рентабельность</h3>
              <span className="ml-auto text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{profitPercent}%</span>
            </div>
            <div>
            <div className="pt-2">
              <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-150"
                  style={{ width: `${sliderPercent}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={150}
                value={profitPercent}
                onChange={e => setProfitPercent(Number(e.target.value))}
                className="w-full relative z-10 opacity-0 cursor-pointer h-6"
              />
              <div className="flex justify-between text-[10px] text-gray-600">
                className="w-full -mt-3 relative z-10 opacity-0 cursor-pointer h-6"
              />
              <div className="flex justify-between text-[10px] text-gray-600 -mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>55%</span>
                <span>75%</span>
                <span>100%</span>
                <span>150%</span>
              </div>
            </div>

            {/* Circular dials for work time */}
            <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3 2xl:grid-cols-1">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 pt-2">
              <TimeDialGroup
                totalMinutes={printingTime}
                onChange={setPrintingTime}
                label="Печать"
                icon={<Printer size={13} className="text-amber-400" />}
                color="#f59e0b"
                glowColor="#f59e0b"
              />
              <TimeDialGroup
                totalMinutes={cuttingTime}
                onChange={setCuttingTime}
                label="Резка"
                icon={<Scissors size={13} className="text-rose-400" />}
                color="#f43f5e"
                glowColor="#f43f5e"
              />
              <TimeDialGroup
                totalMinutes={laminationTime}
                onChange={setLaminationTime}
                label="Ламинация"
                icon={<Layers size={13} className="text-purple-400" />}
                color="#a855f7"
                glowColor="#a855f7"
              />
            </div>
          </div>
        </div>

        {/* ====== EXTRAS SELECTION ====== */}
        {extras.length > 0 && (
          <div className="rounded-2xl bg-[#161822] border border-white/5 p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <Layers size={15} className="text-purple-400" />
              </div>
              <h3 className="font-bold text-sm text-gray-200">Доп. услуги в заказе</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {extras.map(ext => {
                const sel = selectedExtras[ext.id];
                const isActive = sel?.active;
                return (
                  <div key={ext.id} className={cn(
                    'rounded-xl border p-3 transition-all cursor-pointer',
                    isActive
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-white/2 border-white/5 hover:bg-white/5'
                  )} onClick={() => toggleExtra(ext.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                          isActive ? 'bg-purple-500 border-purple-400' : 'border-gray-600'
                        )}>
                          {isActive && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-300">{ext.name}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-400">{ext.pricePerUnit} ₽</span>
                    </div>
                    {isActive && (
                      <div className="mt-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="number"
                          min={1}
                          value={sel?.qty || quantity}
                          onChange={e => setExtraQty(ext.id, Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Кол-во"
                        />
                        <div className="text-[11px] text-gray-500 mt-1">
                          {sel?.qty || quantity} шт. × {ext.pricePerUnit} ₽ = {fmt((sel?.qty || quantity) * ext.pricePerUnit)} ₽
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== DEBUG PANEL ====== */}
        <div className="rounded-2xl bg-[#161822] border border-white/5 p-5">
          <button
            onClick={() => setDebugOpen(open => !open)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <div className="text-sm font-bold text-gray-200">Дебагинг расчёта</div>
              <div className="text-[11px] text-gray-500">Показывает входные параметры, промежуточные значения и итоговую формулу.</div>
            </div>
            <span className="rounded-xl bg-white/5 border border-white/5 px-3 py-1.5 text-xs font-bold text-cyan-300">
              {debugOpen ? 'Скрыть' : 'Показать'}
            </span>
          </button>
          {debugOpen && (
            <pre className="mt-4 max-h-96 overflow-auto rounded-xl bg-black/30 border border-white/5 p-4 text-[11px] leading-relaxed text-cyan-100">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          )}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="mt-10 border-t border-white/5 bg-[#0c0d14]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Top section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Printer size={22} className="text-white" />
              </div>
              <div>
                <div className="text-base font-bold text-white tracking-tight">Vollantis Print Calc</div>
                <div className="text-[11px] text-gray-500">build 2025.02</div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/vollantiss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2AABEE]/10 border border-[#2AABEE]/20 hover:bg-[#2AABEE]/20 transition-all group"
              >
                <Send size={16} className="text-[#2AABEE] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-[#2AABEE]">Telegram</span>
              </a>
              <a
                href="mailto:youtonym4ngusttube@gmail.com"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all group"
              >
                <Mail size={16} className="text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-rose-400">Почта</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-gray-400 justify-center md:justify-start">
                Сделано с <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> чтобы не гадать.
              </div>
              <div className="text-sm font-semibold text-gray-300">Равшан Баймуратов</div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm text-gray-400">
                <span className="text-[11px] text-gray-600 uppercase tracking-wider">Для чаевых разработчику:</span>
              </div>
              <div className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                +7 (909) 411-76-87
              </div>
            </div>
          </div>

          {/* Copyright line */}
          <div className="mt-6 text-center text-[11px] text-gray-600">
            Vollantis Print Calc • build 2025.02 • Сделано с любовью, чтобы не гадать.
          </div>
        </div>
      </footer>

      {/* ===== MODALS ===== */}

      <Modal open={paperModalOpen} onClose={() => setPaperModalOpen(false)} title="📦 База бумаги">
        <div className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-auto">
            {papers.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <div className="font-semibold text-white text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.pricePerSheet} ₽ / лист SRA3</div>
                </div>
                <button onClick={() => deletePaper(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-4 space-y-3">
            <h4 className="text-sm font-bold text-gray-400">Добавить бумагу</h4>
            <input
              type="text"
              value={newPaperName}
              onChange={e => setNewPaperName(e.target.value)}
              placeholder="Название бумаги"
              className="w-full px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newPaperPrice || ''}
                onChange={e => setNewPaperPrice(Number(e.target.value))}
                placeholder="Цена за лист, ₽"
                className="flex-1 px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600"
              />
              <button
                onClick={addPaper}
                className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-1"
              >
                <Plus size={16} /> Добавить
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={extrasModalOpen} onClose={() => setExtrasModalOpen(false)} title="🔧 Дополнительные услуги">
        <div className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-auto">
            {extras.map(e => (
              <div key={e.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <div className="font-semibold text-white text-sm">{e.name}</div>
                  <div className="text-xs text-gray-500">{e.pricePerUnit} ₽ / ед.</div>
                </div>
                <button onClick={() => deleteExtra(e.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-4 space-y-3">
            <h4 className="text-sm font-bold text-gray-400">Добавить услугу</h4>
            <input
              type="text"
              value={newExtraName}
              onChange={e => setNewExtraName(e.target.value)}
              placeholder="Название услуги"
              className="w-full px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newExtraPrice || ''}
                onChange={e => setNewExtraPrice(Number(e.target.value))}
                placeholder="Цена за ед., ₽"
                className="flex-1 px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600"
              />
              <button
                onClick={addExtra}
                className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors flex items-center gap-1"
              >
                <Plus size={16} /> Добавить
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
