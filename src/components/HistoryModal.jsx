import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../data/initialReports';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Lightbulb,
  ShieldAlert,
  HelpCircle,
  Trash2,
  Filter,
  Shield,
  Edit3,
  Layers,
  RotateCcw,
  MessageSquare,
  UserX
} from 'lucide-react';

const CATEGORY_CARD_STYLES = {
  delito: {
    bg: 'bg-gradient-to-br from-red-950/45 via-slate-900/90 to-slate-900/95',
    border: 'border-red-500/35 hover:border-red-500/60',
    borderLeft: 'border-l-4 border-l-red-500',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    glow: 'hover:shadow-[0_4px_25px_rgba(220,38,38,0.18)]',
    titleColor: 'text-red-100',
    accentColor: '#dc2626'
  },
  sospechoso: {
    bg: 'bg-gradient-to-br from-orange-950/45 via-slate-900/90 to-slate-900/95',
    border: 'border-orange-500/35 hover:border-orange-500/60',
    borderLeft: 'border-l-4 border-l-orange-500',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    glow: 'hover:shadow-[0_4px_25px_rgba(249,115,22,0.18)]',
    titleColor: 'text-orange-100',
    accentColor: '#f97316'
  },
  luz: {
    bg: 'bg-gradient-to-br from-amber-950/45 via-slate-900/90 to-slate-900/95',
    border: 'border-amber-500/35 hover:border-amber-500/60',
    borderLeft: 'border-l-4 border-l-amber-500',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glow: 'hover:shadow-[0_4px_25px_rgba(245,158,11,0.18)]',
    titleColor: 'text-amber-100',
    accentColor: '#f59e0b'
  },
  baldio: {
    bg: 'bg-gradient-to-br from-sky-950/45 via-slate-900/90 to-slate-900/95',
    border: 'border-sky-500/35 hover:border-sky-500/60',
    borderLeft: 'border-l-4 border-l-sky-500',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    glow: 'hover:shadow-[0_4px_25px_rgba(14,165,233,0.18)]',
    titleColor: 'text-sky-100',
    accentColor: '#0ea5e9'
  },
  acoso: {
    bg: 'bg-gradient-to-br from-violet-950/45 via-slate-900/90 to-slate-900/95',
    border: 'border-violet-500/35 hover:border-violet-500/60',
    borderLeft: 'border-l-4 border-l-violet-500',
    badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    glow: 'hover:shadow-[0_4px_25px_rgba(139,92,246,0.18)]',
    titleColor: 'text-violet-100',
    accentColor: '#8b5cf6'
  },
  infra: {
    bg: 'bg-gradient-to-br from-blue-950/45 via-slate-900/90 to-slate-900/95',
    border: 'border-blue-500/35 hover:border-blue-500/60',
    borderLeft: 'border-l-4 border-l-blue-500',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    glow: 'hover:shadow-[0_4px_25px_rgba(59,130,246,0.18)]',
    titleColor: 'text-blue-100',
    accentColor: '#3b82f6'
  }
};

function CategoryShapeIcon({ shape, color, className = "w-3 h-3" }) {
  let path = null;
  switch (shape) {
    case 'diamond':
      path = <polygon points="22,3 41,22 22,41 3,22" fill={color} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />;
      break;
    case 'square':
      path = <rect x="4" y="4" width="36" height="36" rx="7" fill={color} stroke="#ffffff" strokeWidth="2.5" />;
      break;
    case 'circle':
      path = <circle cx="22" cy="22" r="18" fill={color} stroke="#ffffff" strokeWidth="2.5" />;
      break;
    case 'pin':
      path = <path d="M22,3 C13,3 5.5,10.5 5.5,19.5 C5.5,28.5 22,41 22,41 C22,41 38.5,28.5 38.5,19.5 C38.5,10.5 31,3 22,3 Z" fill={color} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />;
      break;
    case 'triangle':
      path = <polygon points="22,4 40,39 4,39" fill={color} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />;
      break;
    case 'octagon':
      path = <polygon points="14,4 30,4 40,14 40,30 30,40 14,40 4,30 4,14" fill={color} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />;
      break;
    case 'hexagon':
    default:
      path = <polygon points="22,3 38,12.5 38,31.5 22,41 6,31.5 6,12.5" fill={color} stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />;
      break;
  }
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 44 44" aria-hidden="true">
      {path}
    </svg>
  );
}

export default function HistoryModal() {
  const {
    activeModal,
    setActiveModal,
    reports,
    user,
    focusMapOn,
    markReportResolved,
    toggleReportResolved,
    setSelectedReportId,
    deleteReport
  } = useApp();

  const [tab, setTab] = useState(user?.isModerator ? 'all' : 'mine'); // 'mine' | 'all'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'resolved'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'delito' | 'sospechoso' | ...

  if (activeModal !== 'history') return null;

  const isModerator = Boolean(user?.isModerator || user?.role === 'moderator');

  // Filtrado 1: Por Pestaña (Mis Reportes vs Todo Río Cuarto)
  const filteredByTab = tab === 'mine'
    ? reports.filter((r) => r.authorId === user?.id || r.author === user?.name || r.author === 'Ivan Escobar' || r.author === 'Camila U.')
    : reports;

  // Filtrado 2: Por Estado (Activo vs Resuelto)
  const filteredByTabAndStatus = filteredByTab.filter((r) => {
    const isResolved = r.status === 'resuelto' || r.isResolved;
    if (statusFilter === 'active') return !isResolved;
    if (statusFilter === 'resolved') return isResolved;
    return true;
  });

  // Filtrado 3: Por Categoría Específica (Robo, Sospechoso, etc.)
  const displayedReports = filteredByTabAndStatus.filter((r) => {
    if (categoryFilter !== 'all' && r.type !== categoryFilter) return false;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div className="w-full max-w-3xl bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Encabezado */}
        <header className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="history-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Historial de Reportes
                </h2>
                {isModerator && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    <Shield className="w-3 h-3" />
                    Moderador
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Seguimiento barrial y auditoría comunitaria en Río Cuarto
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Cerrar historial"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Barra 1: Pestañas de Ámbito y Filtro por Estado */}
        <div className="p-3 sm:p-4 bg-slate-800/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Pestañas Principales */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setTab('mine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'mine'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mis Reportes ({reports.filter((r) => r.author === user?.name || r.author === 'Ivan Escobar' || r.author === 'Camila U.').length})
            </button>
            <button
              type="button"
              onClick={() => setTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Río Cuarto ({reports.length})
            </button>
          </div>

          {/* Subfiltro por Estado (Todos / Activos / Resueltos) */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 hidden sm:inline-flex items-center gap-1 font-semibold text-[11px]">
              <Filter className="w-3 h-3 text-slate-400" /> Estado:
            </span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-700 text-white border-slate-500 shadow-xs'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                statusFilter === 'active'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Activos
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Resueltos
            </button>
          </div>
        </div>

        {/* Barra 2: Filtro Horizontal por Categoría (Robo, Sospechoso, etc.) */}
        <div className="px-3 sm:px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Categoría:</span>
          </span>

          {/* Chip "Todas" */}
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`btn-interactive px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
              categoryFilter === 'all'
                ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-750 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Todas</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/80 text-slate-300 font-semibold">
              {filteredByTabAndStatus.length}
            </span>
          </button>

          {/* Chips por Categoría */}
          {Object.entries(CATEGORIES_CONFIG).map(([key, cat]) => {
            const isSelected = categoryFilter === key;
            const count = filteredByTabAndStatus.filter((r) => r.type === key).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategoryFilter(isSelected ? 'all' : key)}
                className={`btn-interactive px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  isSelected
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400 ring-2 ring-amber-400/30 shadow-md font-extrabold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-800'
                }`}
                aria-pressed={isSelected}
              >
                <CategoryShapeIcon shape={cat.shape} color={cat.color} className="w-3 h-3" />
                <span className="whitespace-nowrap">{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-950/80 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Listado de Cards con Espaciado Generoso y Fondos Tematizados */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {displayedReports.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-850/60 rounded-3xl border border-slate-800/80 my-2">
              <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">No hay reportes para este filtro</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                {categoryFilter !== 'all'
                  ? `No se encontraron incidentes registrados en la categoría "${CATEGORIES_CONFIG[categoryFilter]?.name}".`
                  : 'No se encontraron alertas registradas con los filtros activos.'}
              </p>
              {(categoryFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                  className="btn-interactive inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restablecer filtros</span>
                </button>
              )}
            </div>
          ) : (
            displayedReports.map((report) => {
              const isResolved = report.status === 'resuelto' || report.isResolved;
              const style = CATEGORY_CARD_STYLES[report.type] || CATEGORY_CARD_STYLES.infra;
              const catConfig = CATEGORIES_CONFIG[report.type] || {
                name: report.categoryName || 'Alerta',
                shape: 'circle',
                color: '#64748b',
                shapeLabel: 'Círculo'
              };

              return (
                <article
                  key={report.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col gap-3 shadow-md hover:shadow-xl ${
                    isResolved
                      ? 'bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 border-slate-700/80 border-l-4 border-l-emerald-500/80'
                      : `${style.bg} ${style.border} ${style.borderLeft} ${style.glow}`
                  }`}
                >
                  {/* Encabezado de la Card: Pill de Categoría con Forma + Tiempo + Estado */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shadow-xs ${
                          isResolved
                            ? 'bg-slate-800/90 text-slate-300 border-slate-700'
                            : style.badgeBg
                        }`}
                      >
                        <CategoryShapeIcon
                          shape={catConfig.shape}
                          color={catConfig.color}
                          className="w-3.5 h-3.5"
                        />
                        <span>{catConfig.name}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{report.time}</span>
                      </span>
                    </div>

                    {/* Badge de Estado Activo / Solucionado */}
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Solucionado</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                        </span>
                        <span>Activo en mapa</span>
                      </span>
                    )}
                  </div>

                  {/* Cuerpo de la Card: Título y Descripción */}
                  <div className="space-y-1">
                    <h4
                      className={`font-extrabold text-base sm:text-lg leading-snug ${
                        isResolved ? 'text-slate-200' : style.titleColor
                      }`}
                    >
                      {report.title || report.description}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Miniatura de Foto si existe */}
                  {report.photo && (
                    <div className="pt-0.5">
                      <img
                        src={report.photo}
                        alt={report.title || 'Foto del reporte'}
                        className="w-full sm:w-64 h-32 object-cover rounded-xl border border-slate-700/80 shadow-md"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Pie de la Card: Autor, Validaciones y Acciones */}
                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-800/80 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-slate-400 flex-wrap">
                      <span>Por:</span>
                      {report.isAnonymous ? (
                        <span className="flex items-center gap-1 font-semibold text-amber-300">
                          <UserX className="w-3.5 h-3.5" />
                          <span>Vecino Anónimo</span>
                        </span>
                      ) : (
                        <>
                          <span className="font-semibold text-slate-200">
                            {report.author || 'Vecino'}
                          </span>
                          {report.authorTier && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-800 border border-slate-700 text-amber-400 font-bold uppercase">
                              {report.authorTier}
                            </span>
                          )}
                        </>
                      )}
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-medium">
                        {report.reactions || 0} validaciones
                      </span>
                      {report.comments?.length > 0 && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-300 font-medium flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-slate-400" />
                            {report.comments.length}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => focusMapOn(report.lat, report.lng, report.id)}
                        className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 active:bg-sky-500/40 text-sky-300 border border-sky-500/40 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                        title="Ver ubicación en el mapa"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Ver en mapa</span>
                      </button>

                      {/* Acción de Edición para Moderador */}
                      {isModerator && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setActiveModal('pinDetail');
                          }}
                          className="btn-interactive flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-all"
                          title="Editar alerta como Moderador"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                      )}

                      {/* Marcar resuelto / Reabrir */}
                      {isModerator ? (
                        <button
                          type="button"
                          onClick={() => toggleReportResolved(report.id)}
                          className={`btn-interactive flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            isResolved
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                          }`}
                          title={isResolved ? 'Reabrir alerta' : 'Marcar como solucionado'}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isResolved ? 'Reabrir' : 'Solucionar'}</span>
                        </button>
                      ) : (
                        !isResolved && (
                          <button
                            type="button"
                            onClick={() => markReportResolved(report.id)}
                            className="btn-interactive flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 active:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            title="Marcar este incidente como solucionado"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Solucionar</span>
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        onClick={() => deleteReport(report.id)}
                        className="btn-interactive p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 active:bg-red-500/30 text-slate-400 hover:text-red-400 border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        title="Eliminar reporte de la lista"
                        aria-label="Eliminar reporte"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Pie del Modal */}
        <footer className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Mostrando <strong className="text-white">{displayedReports.length}</strong> de {filteredByTab.length} incidentes
            {categoryFilter !== 'all' && (
              <span className="ml-1 text-amber-300 font-semibold">
                • {CATEGORIES_CONFIG[categoryFilter]?.name}
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="btn-interactive px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
