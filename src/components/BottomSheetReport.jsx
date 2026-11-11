import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Eye,
  Lightbulb,
  ShieldAlert,
  Wrench,
  Flame,
  X,
  Send,
  Camera,
  UserX,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialReports';

const SAMPLE_PHOTOS = [
  { label: 'Calle', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Terreno', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80' },
  { label: 'Vehículo', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80' }
];

export default function BottomSheetReport() {
  const {
    activeModal,
    setActiveModal,
    selectedCategory,
    setSelectedCategory,
    reportDescription,
    setReportDescription,
    reportPhoto,
    setReportPhoto,
    isAnonymous,
    setIsAnonymous,
    submitReportDraft,
    pendingLocation,
    triggerHaptic,
    showToast
  } = useApp();

  const fileInputRef = useRef(null);

  if (activeModal !== 'report') return null;

  const categories = [
    { key: 'delito', label: 'Robo / Delito', icon: AlertTriangle, color: 'text-red-500 bg-red-600/20' },
    { key: 'sospechoso', label: 'Persona sospechosa', icon: Eye, color: 'text-orange-400 bg-orange-500/20' },
    { key: 'luz', label: 'Iluminación rota', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/20' },
    { key: 'baldio', label: 'Baldío peligroso', icon: ShieldAlert, color: 'text-sky-400 bg-sky-500/20' },
    { key: 'acoso', label: 'Acoso / Violencia', icon: Flame, color: 'text-violet-400 bg-violet-500/20' },
    { key: 'infra', label: 'Infraestructura', icon: Wrench, color: 'text-blue-400 bg-blue-500/20' },
  ];

  // Procesa y comprime la imagen a tamaño óptimo para localStorage
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setReportPhoto(compressedDataUrl);
        showToast('Foto adjuntada al reporte', 'success');
        triggerHaptic([30]);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <section
        className="w-full sm:max-w-lg bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl border border-slate-700 shadow-2xl p-5 sm:p-6 flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200 space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        {/* Barra táctil para arrastre en móvil */}
        <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto -mt-1 mb-1 shrink-0 sm:hidden" />

        {/* Encabezado */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div>
            <h2 id="sheet-title" className="text-lg font-bold text-white leading-tight">
              Crear Nuevo Reporte
            </h2>
            <p className="text-xs text-slate-400">
              Ubicación: {pendingLocation.lat?.toFixed(4)}, {pendingLocation.lng?.toFixed(4)} (Río Cuarto)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Cerrar panel de reporte"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paso 1: Selección de Categoría */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            1. Selecciona la categoría del incidente:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  className={`btn-interactive flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border text-left transition-all ${
                    isSelected
                      ? 'border-yellow-400 ring-2 ring-yellow-400 bg-slate-800 shadow-md'
                      : 'border-slate-700/80'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold block truncate">{cat.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paso 2: Descripción de la situación */}
        <div>
          <label htmlFor="report-desc" className="block text-xs font-bold text-slate-300 mb-1.5">
            2. Describe brevemente lo sucedido:
          </label>
          <textarea
            id="report-desc"
            rows="3"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            placeholder="Ej: Sujetos en moto forcejeando picaportes de autos estacionados..."
            className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 leading-relaxed"
          />
        </div>

        {/* Paso 3: Evidencia Fotográfica (Carga de Imagen) */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>3. Evidencia fotográfica (Opcional):</span>
            </span>
            {reportPhoto && (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Foto lista
              </span>
            )}
          </label>

          {/* Input oculto de archivo para selector nativo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {reportPhoto ? (
            /* Vista previa de foto adjunta */
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-md">
              <img
                src={reportPhoto}
                alt="Evidencia fotográfica adjunta"
                className="w-full h-36 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-[10px] font-bold shadow-xs backdrop-blur-xs">
                <ImageIcon className="w-3 h-3" />
                <span>Foto adjunta</span>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-interactive flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-white border border-slate-700 text-xs font-semibold shadow-md transition-all"
                  title="Cambiar foto"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-[11px]">Cambiar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReportPhoto('');
                    showToast('Foto eliminada del reporte', 'info');
                    triggerHaptic([20]);
                  }}
                  className="btn-interactive p-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 active:scale-95 text-white border border-red-500 shadow-md transition-all"
                  title="Eliminar foto"
                  aria-label="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Botón de carga y opciones de prueba */
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-interactive w-full p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-750 active:bg-slate-700 border border-dashed border-slate-600 hover:border-amber-400 text-slate-300 hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">Subir o tomar foto de evidencia</span>
                <span className="text-[11px] text-slate-400">
                  Toca para seleccionar desde tu galería o cámara
                </span>
              </button>

              {/* Muestras rápidas de foto para demo */}
              <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                <span className="shrink-0 text-[10px] font-bold uppercase text-slate-400">
                  O prueba con:
                </span>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {SAMPLE_PHOTOS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => {
                        setReportPhoto(sample.url);
                        showToast(`Foto de muestra "${sample.label}" añadida`, 'info');
                        triggerHaptic([20]);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-[10px] text-slate-300 hover:text-white font-medium shrink-0 transition-all"
                    >
                      + {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paso 4: Publicación Anónima (Privacidad y Protección) */}
        <div className={`p-3.5 rounded-2xl border transition-all ${
          isAnonymous
            ? 'bg-amber-950/30 border-amber-500/40 shadow-xs'
            : 'bg-slate-850/80 border-slate-750'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isAnonymous
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isAnonymous ? <ShieldCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs text-white">Publicar de forma anónima</p>
                  {isAnonymous && (
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                      Protegido
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {isAnonymous
                    ? 'Tu nombre y nivel quedarán ocultos. Se publicará como "Vecino Anónimo".'
                    : 'Actívalo si estás denunciando algo delicado y prefieres no exponer tus datos.'}
                </p>
              </div>
            </div>

            {/* Switch Ergonómico */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => {
                  setIsAnonymous(e.target.checked);
                  triggerHaptic([25]);
                  if (e.target.checked) {
                    showToast('Modo Anónimo activado para este reporte', 'info');
                  }
                }}
                className="sr-only peer"
                aria-label="Publicar reporte de forma anónima"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>
        </div>

        {/* Botón de Envío */}
        <button
          type="button"
          onClick={submitReportDraft}
          className="btn-interactive w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition-all"
        >
          <span>Continuar y Confirmar</span>
          <Send className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
