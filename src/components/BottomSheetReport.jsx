import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Eye, Lightbulb, ShieldAlert, Wrench, Flame, X, Send, Camera } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialReports';

export default function BottomSheetReport() {
  const {
    activeModal,
    setActiveModal,
    selectedCategory,
    setSelectedCategory,
    reportDescription,
    setReportDescription,
    submitReportDraft,
    pendingLocation,
    triggerHaptic,
    showToast
  } = useApp();

  if (activeModal !== 'report') return null;

  const categories = [
    { key: 'delito', label: 'Robo / Delito', icon: AlertTriangle, color: 'text-red-500 bg-red-600/20' },
    { key: 'sospechoso', label: 'Persona sospechosa', icon: Eye, color: 'text-orange-400 bg-orange-500/20' },
    { key: 'luz', label: 'Iluminación rota', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/20' },
    { key: 'baldio', label: 'Baldío peligroso', icon: ShieldAlert, color: 'text-sky-400 bg-sky-500/20' },
    { key: 'acoso', label: 'Acoso / Violencia', icon: Flame, color: 'text-violet-400 bg-violet-500/20' },
    { key: 'infra', label: 'Infraestructura', icon: Wrench, color: 'text-blue-400 bg-blue-500/20' },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <section
        className="w-full sm:max-w-lg bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl border border-slate-700 shadow-2xl p-5 sm:p-6 flex flex-col max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        {/* Barra táctil para arrastre */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto mb-3 shrink-0 sm:hidden" />

        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 id="sheet-title" className="text-lg font-bold text-white">
              Selecciona la categoría
            </h2>
            <p className="text-xs text-slate-400">
              Coordenadas: {pendingLocation.lat?.toFixed(4)}, {pendingLocation.lng?.toFixed(4)} (Río Cuarto)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors focus-visible:outline-none"
            aria-label="Cerrar panel de reporte"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuadrícula de Categorías (Páginas 4 y 7 de Figma) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.key);
                  triggerHaptic([30]);
                }}
                className={`btn-interactive flex items-center gap-3 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border text-left transition-all ${
                  isSelected ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-slate-700'
                }`}
                aria-pressed={isSelected}
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Textarea Descriptivo */}
        <div className="mt-2 relative">
          <label htmlFor="report-desc" className="block text-xs font-bold text-slate-300 mb-1.5">
            Descripción de la situación:
          </label>
          <textarea
            id="report-desc"
            rows="3"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            placeholder="Ej: Acaban de robar en la esquina, dos sujetos en moto..."
            className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400"
          />
          <button
            type="button"
            onClick={() => showToast('Foto añadida (simulada)', 'info')}
            className="absolute bottom-3 right-3 text-[11px] text-slate-300 bg-slate-900/90 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto [0/4]</span>
          </button>
        </div>

        {/* Botón de Envío */}
        <button
          type="button"
          onClick={submitReportDraft}
          className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-950 border border-slate-600 text-white font-extrabold text-base shadow-lg btn-interactive flex items-center justify-center gap-2 focus-visible:outline-none"
        >
          <span>Enviar</span>
          <Send className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
