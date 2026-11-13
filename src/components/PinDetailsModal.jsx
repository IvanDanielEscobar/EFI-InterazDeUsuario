import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ThumbsUp,
  Check,
  Send,
  Camera,
  Shield,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Save,
  RotateCcw,
  UserX
} from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialReports';

export default function PinDetailsModal() {
  const {
    activeModal,
    setActiveModal,
    selectedReport,
    validateReport,
    toggleReaction,
    addComment,
    user,
    config,
    alertRadiusKm,
    calculateDistanceKm,
    RIO_CUARTO_CENTER,
    updateReport,
    toggleReportResolved,
    showToast
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Formulario de edición para Moderador
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    type: 'delito',
    status: 'activo'
  });

  useEffect(() => {
    if (selectedReport) {
      setEditForm({
        title: selectedReport.title || '',
        description: selectedReport.description || '',
        type: selectedReport.type || 'delito',
        status: (selectedReport.status === 'resuelto' || selectedReport.isResolved) ? 'resuelto' : 'activo'
      });
      setIsEditing(false);
    }
  }, [selectedReport]);

  if (activeModal !== 'pinDetail' || !selectedReport) return null;

  const isResolved = selectedReport.status === 'resuelto' || selectedReport.isResolved;
  const isModerator = Boolean(user?.isModerator || user?.role === 'moderator');

  const currentUsername = (user?.username || '').toLowerCase();
  const hasUserValidated = Boolean(
    user?.isLoggedIn &&
    selectedReport &&
    Array.isArray(selectedReport.validatedBy) &&
    selectedReport.validatedBy.some((v) => String(v).toLowerCase() === currentUsername)
  );

  const distanceKm = calculateDistanceKm(
    RIO_CUARTO_CENTER[0],
    RIO_CUARTO_CENTER[1],
    selectedReport.lat,
    selectedReport.lng
  );
  const distanceFormatted = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm} km`;
  const activeRadius = alertRadiusKm || Number(config.alertRadius) || (user?.isModerator ? 5 : 1);
  const isWithinPerimeter = distanceKm <= activeRadius;

  const handleSendComment = (e) => {
    e?.preventDefault();
    if (!commentText.trim()) return;
    addComment(selectedReport.id, commentText);
    setCommentText('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      showToast('El título no puede estar vacío', 'warning');
      return;
    }
    updateReport(selectedReport.id, {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      type: editForm.type,
      status: editForm.status,
      isResolved: editForm.status === 'resuelto'
    });
    setIsEditing(false);
  };

  const getTierClass = (tier) => {
    switch (tier) {
      case 'diamante':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-400';
      case 'oro':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400';
      case 'plata':
        return 'bg-slate-400/20 text-slate-300 border border-slate-400';
      default:
        return 'bg-amber-700/20 text-amber-500 border border-amber-600';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <div className="w-full sm:max-w-md bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl border border-slate-700 shadow-2xl p-5 flex flex-col max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-200">
        {/* Encabezado con Categoría y Cerrar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${selectedReport.badgeBg}`}>
              <span>{selectedReport.categoryName}</span>
            </span>

            {isResolved ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3" />
                Solucionado
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Activo
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-300 focus-visible:outline-none"
            aria-label="Cerrar detalles del pin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BARRA DE HERRAMIENTAS EXCLUSIVA PARA MODERADOR */}
        {isModerator && (
          <div className="p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/50 mb-3.5 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Modo Moderador</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleReportResolved(selectedReport.id)}
                className={`btn-interactive px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  isResolved
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isResolved ? 'Reabrir Alerta' : 'Marcar Solucionado'}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="btn-interactive flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[11px] font-bold shadow-xs"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Ver' : 'Editar'}</span>
              </button>
            </div>
          </div>
        )}

        {/* MODO EDICIÓN DE MODERADOR */}
        {isModerator && isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-3 mb-4 bg-slate-850 p-3.5 rounded-2xl border border-indigo-500/40">
            <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Información de Alerta</span>
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Categoría:</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {Object.entries(CATEGORIES_CONFIG).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Título:</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                required
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Descripción:</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Estado de Resolución:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditForm((prev) => ({ ...prev, status: 'activo' }))}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    editForm.status === 'activo'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Activo en Mapa
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm((prev) => ({ ...prev, status: 'resuelto' }))}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    editForm.status === 'resuelto'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Solucionado
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-interactive px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-interactive flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-black shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        ) : (
          /* VISTA NORMAL DEL REPORTE */
          <>
            <h3 id="pin-modal-title" className="text-base sm:text-lg font-bold mb-1 text-white">
              {selectedReport.title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 flex-wrap">
              <span>{selectedReport.time}</span>
              <span>•</span>
              {selectedReport.isAnonymous ? (
                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  <UserX className="w-3.5 h-3.5" />
                  <span>Vecino Anónimo</span>
                </span>
              ) : (
                <>
                  <span className="font-semibold text-slate-300">{selectedReport.author}</span>
                  {selectedReport.authorTier && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTierClass(selectedReport.authorTier)}`}>
                      {selectedReport.authorTier.toUpperCase()}
                    </span>
                  )}
                </>
              )}
              <span>•</span>
              <span className={`text-[11px] font-bold flex items-center gap-1 ${
                isWithinPerimeter ? 'text-amber-400' : 'text-slate-400'
              }`}>
                <span>A {distanceFormatted}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({isWithinPerimeter ? `Dentro de radio ${activeRadius} km` : 'Fuera de radio'})
                </span>
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 mb-3">
              {selectedReport.description}
            </p>

            {/* Foto de evidencia si existe */}
            {selectedReport.photo && (
              <div className="mb-3">
                <p className="text-xs text-slate-400 font-bold mb-1">Fotos:</p>
                <img
                  src={selectedReport.photo}
                  alt="Evidencia fotográfica"
                  className="w-full h-36 object-cover rounded-2xl border border-slate-700 shadow"
                />
              </div>
            )}
          </>
        )}

        {/* Validación del Reporte */}
        <div className="flex items-center justify-between py-2.5 border-y border-slate-800 mb-3">
          <button
            type="button"
            onClick={() => validateReport(selectedReport.id)}
            disabled={hasUserValidated}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              hasUserValidated
                ? 'bg-emerald-600/90 text-white border-emerald-500 shadow-sm cursor-default'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-600/20 hover:text-emerald-300 hover:border-emerald-500/40 cursor-pointer active:scale-95'
            }`}
            title={hasUserValidated ? 'Ya has validado este reporte' : 'Validar este reporte vecinal'}
            aria-label={hasUserValidated ? `Reporte validado, ${selectedReport.reactions || 0} validaciones` : `Validar reporte, actualmente ${selectedReport.reactions || 0} validaciones`}
          >
            {hasUserValidated ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ThumbsUp className="w-3.5 h-3.5" />
            )}
            <span>{hasUserValidated ? 'Validado' : 'Validar'}</span>
            <span className="bg-slate-900/50 px-1.5 py-0.5 rounded-md font-mono text-[11px]">
              {selectedReport.reactions || 0}
            </span>
          </button>

          {hasUserValidated ? (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[2.5]" />
              Has validado este reporte
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              +{5} pts por validar
            </span>
          )}
        </div>

        {/* Hilo de Comentarios */}
        <div className="flex-1 flex flex-col">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
            Comentarios
          </h4>
          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto no-scrollbar">
            {selectedReport.comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2 text-center">
                No hay comentarios aún. Aporta detalles para alertar al barrio.
              </p>
            ) : (
              selectedReport.comments.map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <p className="font-bold text-white mb-0.5">{c.author}:</p>
                  <p className="text-slate-300">{c.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulario de Comentario */}
          <form onSubmit={handleSendComment} className="flex items-center gap-2 mt-auto">
            <button
              type="button"
              onClick={() => showToast('Foto adjuntada (simulado)', 'info')}
              className="btn-interactive p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              aria-label="Adjuntar foto"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            />
            <button
              type="submit"
              className="btn-interactive p-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 font-bold transition-all focus-visible:outline-none"
              aria-label="Publicar comentario"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
