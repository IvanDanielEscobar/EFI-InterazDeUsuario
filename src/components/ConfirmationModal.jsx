import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, ShieldCheck, Camera } from 'lucide-react';

export default function ConfirmationModal() {
  const { activeModal, setActiveModal, confirmAndPublishReport, isAnonymous, reportPhoto } = useApp();

  if (activeModal !== 'confirm') return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-sm bg-slate-900 text-white p-6 rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center text-center">
        {/* Icono de Reloj Gigante de Figma (Página 8) */}
        <div className="w-20 h-20 rounded-full border-4 border-slate-300 flex items-center justify-center mb-4 text-slate-200">
          <Clock className="w-11 h-11" />
        </div>

        <h3 id="confirm-modal-title" className="text-base sm:text-lg font-bold mb-2 text-slate-100">
          ¿Está seguro que desea enviar el reporte?
        </h3>

        {(isAnonymous || reportPhoto) && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
            {isAnonymous && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Publicación Anónima</span>
              </span>
            )}
            {reportPhoto && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>Foto adjunta</span>
              </span>
            )}
          </div>
        )}

        {!isAnonymous && !reportPhoto && <div className="mb-4" />}

        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={confirmAndPublishReport}
            className="w-full py-3.5 rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 active:bg-amber-500 font-extrabold text-sm shadow-md btn-interactive focus-visible:outline-none"
          >
            Confirmar y Enviar
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('report')}
            className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-colors focus-visible:outline-none"
          >
            Volver a editar
          </button>
        </div>
      </div>
    </div>
  );
}
