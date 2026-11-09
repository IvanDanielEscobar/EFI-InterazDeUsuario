import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  ExternalLink,
  Filter,
  Shield,
  Edit3
} from 'lucide-react';

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

  if (activeModal !== 'history') return null;

  const isModerator = Boolean(user?.isModerator || user?.role === 'moderator');

  // Filtrado de reportes
  const filteredByTab = tab === 'mine'
    ? reports.filter((r) => r.author === user.name || r.author === 'Ivan Escobar' || r.author === 'Camila U.')
    : reports;

  const displayedReports = filteredByTab.filter((r) => {
    const isResolved = r.status === 'resuelto' || r.isResolved;
    if (statusFilter === 'active') return !isResolved;
    if (statusFilter === 'resolved') return isResolved;
    return true;
  });

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'delito':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      case 'luz':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      case 'sospechoso':
        return <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />;
      case 'acoso':
        return <Flame className="w-3.5 h-3.5 text-violet-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div className="w-full max-w-2xl bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Encabezado */}
        <header className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
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
                Seguimiento de alertas comunitarias en Río Cuarto
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

        {/* Barra de Filtros y Pestañas */}
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
              Mis Reportes ({reports.filter((r) => r.author === user.name || r.author === 'Ivan Escobar' || r.author === 'Camila U.').length})
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

          {/* Subfiltro por Estado */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Estado:
            </span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-transparent text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                statusFilter === 'active'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-transparent text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Activos
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-transparent text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Resueltos
            </button>
          </div>
        </div>

        {/* Listado de Reportes */}
        <section className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-800/40">
          {displayedReports.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-500">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">No hay reportes para mostrar</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {tab === 'mine'
                  ? 'Aún no has registrado alertas en esta categoría. Puedes tocar cualquier punto del mapa para crear un reporte.'
                  : 'No se encontraron alertas con los filtros seleccionados.'}
              </p>
            </div>
          ) : (
            displayedReports.map((report) => {
              const isResolved = report.status === 'resuelto' || report.isResolved;
              return (
                <article
                  key={report.id}
                  className="pt-3.5 first:pt-0 bg-slate-850 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-xs"
                >
                  {/* Encabezado del ítem */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-200">
                        {getCategoryIcon(report.type)}
                        <span>{report.categoryName || 'Alerta'}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{report.time}</span>
                    </div>

                    {/* Badge de Estado */}
                    {isResolved ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Solucionado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Activo en mapa
                      </span>
                    )}
                  </div>

                  {/* Título y Descripción */}
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1 leading-snug">
                      {report.title || report.description}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Metadata de Autor */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Por:</span>
                      <span className="font-semibold text-slate-200">{report.author || 'Vecino'}</span>
                      {report.authorTier && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-800 border border-slate-700 text-amber-400 font-bold uppercase">
                          {report.authorTier}
                        </span>
                      )}
                      <span className="text-slate-600">•</span>
                      <span>{report.reactions || 0} validaciones</span>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => focusMapOn(report.lat, report.lng, report.id)}
                        className="btn-interactive flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 active:bg-sky-500/40 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                        title="Ver ubicación en el mapa"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ver mapa</span>
                      </button>

                      {/* Acción de Edición para Moderador */}
                      {isModerator && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setActiveModal('pinDetail');
                          }}
                          className="btn-interactive flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-all"
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
                          className={`btn-interactive flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
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
                            className="btn-interactive flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 active:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
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
                        className="btn-interactive p-1 rounded-lg bg-slate-800 hover:bg-red-500/20 active:bg-red-500/30 text-slate-400 hover:text-red-400 border border-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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
            Total en vista: <strong className="text-white">{displayedReports.length}</strong> incidentes
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
