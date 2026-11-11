import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sliders,
  CheckCircle2,
  MapPin,
  Moon,
  Sun,
  RotateCcw,
  Smartphone,
  Eye,
  ShieldAlert
} from 'lucide-react';

const RIO_CUARTO_NEIGHBORHOODS = [
  'Centro',
  'Banda Norte',
  'Alberdi',
  'Castelli',
  'Bimaco',
  'Universidad',
  'Golf Club',
  'Fénix',
  'Las Delicias'
];

export default function SettingsModal() {
  const {
    activeModal,
    setActiveModal,
    config,
    user,
    alertRadiusKm,
    defaultAlertRadius,
    toggleTheme,
    toggleLeftHanded,
    setAlertRadius,
    setActiveNeighborhood,
    resetDemoData
  } = useApp();

  if (activeModal !== 'settings') return null;

  const defaultRadius = defaultAlertRadius || (user?.isModerator ? 5 : 1);
  const currentRadius = alertRadiusKm || Number(config.alertRadius) || defaultRadius;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Encabezado */}
        <header className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Configuraciones
              </h2>
              <p className="text-xs text-slate-400">
                Ajustes de alertas, accesibilidad y mapa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Cerrar ajustes"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* SECCIÓN 1: ZONAS Y AVISOS PREVENTIVOS */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Zonas y Alertas Preventivas</span>
            </h3>

            {/* Slider de Radio de Alerta (1km default para vecinos, 5km default para moderador) */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xs text-white">Radio de Alertas Activas</p>
                    {currentRadius === defaultRadius && (
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Default ({defaultRadius} km {user?.isModerator ? '• Moderación' : '• Vecino'})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {user?.isModerator
                      ? 'Como Moderador tu cobertura por defecto es 5 km (supervisión de toda la ciudad)'
                      : 'Como Vecino tu perímetro preventivo por defecto es 1 km (avisos de tu zona inmediata)'}
                  </p>
                </div>
                <span className="font-black text-amber-400 text-sm px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 shrink-0">
                  {currentRadius} km
                </span>
              </div>

              {/* Botones de Selección Rápida */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[
                  { km: 1, label: !user?.isModerator ? '1 km (Def)' : '1 km' },
                  { km: 3, label: '3 km' },
                  { km: 5, label: user?.isModerator ? '5 km (Def)' : '5 km' },
                  { km: 10, label: '10 km' }
                ].map((item) => (
                  <button
                    key={item.km}
                    type="button"
                    onClick={() => setAlertRadius(item.km)}
                    className={`btn-interactive py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      currentRadius === item.km
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={currentRadius}
                onChange={(e) => setAlertRadius(e.target.value)}
                className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>1 km (Inmediato)</span>
                <span>5 km (Estándar)</span>
                <span>15 km (Toda la ciudad)</span>
              </div>
            </div>

            {/* Barrio Activo */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-xs text-white">Barrio Activo de Río Cuarto</p>
                <p className="text-[11px] text-slate-400">Priorizar avisos de tu sector barrial</p>
              </div>
              <select
                value={config.activeNeighborhood || 'Centro'}
                onChange={(e) => setActiveNeighborhood(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {RIO_CUARTO_NEIGHBORHOODS.map((barrio) => (
                  <option key={barrio} value={barrio}>
                    {barrio}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* SECCIÓN 2: ACCESIBILIDAD Y ERGONOMÍA */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Accesibilidad & Ergonomía</span>
            </h3>

            {/* Modo para Zurdos */}
            <div className="flex items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <div>
                <p className="font-bold text-xs text-white">Modo para Zurdos</p>
                <p className="text-[11px] text-slate-400">
                  Ubica el Botón SOS a la izquierda e invierte los segmentos de Referencias y Alertas
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isLeftHanded}
                  onChange={toggleLeftHanded}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>

            {/* Simbología Semántica de Pines por Categoría (WCAG AA / Daltonismo) */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-white">Simbología Semántica de Pines</p>
                  <p className="text-[11px] text-slate-400">
                    Forma única asignada por categoría para personas con dificultades visuales
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold shrink-0">
                  WCAG AA
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <span className="w-2.5 h-2.5 bg-red-600 rotate-45 shrink-0 inline-block border border-white/60"></span>
                  <span className="truncate">Rombo (Delito)</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-xs shrink-0 inline-block border border-white/60"></span>
                  <span className="truncate">Cuadrado (Sospechoso)</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0 inline-block border border-white/60"></span>
                  <span className="truncate">Círculo (Luz)</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <span className="w-2.5 h-2.5 bg-sky-500 rounded-t-full rounded-b-xs shrink-0 inline-block border border-white/60"></span>
                  <span className="truncate">Pin (Baldío)</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <span className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[9px] border-b-violet-500 shrink-0 inline-block"></span>
                  <span className="truncate">Triángulo (Acoso)</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <span className="w-3 h-3 rounded-sm bg-slate-600 text-emerald-400 font-black text-[9px] flex items-center justify-center shrink-0 border border-slate-400">✓</span>
                  <span className="truncate">Hexágono (Resuelto)</span>
                </div>
              </div>
            </div>

            {/* Tema Oscuro / Claro */}
            <div className="flex items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <div>
                <p className="font-bold text-xs text-white">Tema de Interfaz</p>
                <p className="text-[11px] text-slate-400">
                  Actualmente en modo {config.theme === 'dark' ? 'Nocturno' : 'Claro'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-all"
              >
                {config.theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cambiar a Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-300" />
                    <span>Cambiar a Oscuro</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* SECCIÓN 3: MOTOR CARTOGRÁFICO & DATOS */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Infraestructura & Datos</span>
            </h3>

            {/* Motor Cartográfico Activo */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">Proveedor de Cartografía:</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3" />
                  OpenStreetMap (HOT)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cartografía urbana 100% libre y comunitaria de Río Cuarto. Sin marcas de agua ni costos por uso.
              </p>
            </div>

            {/* Restablecer Datos de Demostración */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-xs text-white">Datos de Demostración</p>
                <p className="text-[11px] text-slate-400">Restaura los reportes, cupones y puntos iniciales</p>
              </div>
              <button
                type="button"
                onClick={resetDemoData}
                className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 active:scale-95 text-red-300 border border-red-500/40 text-xs font-bold transition-all focus-visible:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            </div>
          </section>
        </div>

        {/* Pie con Botón Guardar */}
        <footer className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="btn-interactive px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-extrabold text-xs shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
          >
            Guardar y Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
