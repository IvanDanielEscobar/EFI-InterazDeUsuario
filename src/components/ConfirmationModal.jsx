import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock } from 'lucide-react';

export default function ConfirmationModal() {
  const { activeModal, setActiveModal, confirmAndPublishReport } = useApp();

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
        <div className="w-24 h-24 rounded-full border-4 border-slate-300 flex items-center justify-center mb-5 text-slate-200">
          <Clock className="w-14 h-14" />
        </div>

        <h3 id="confirm-modal-title" className="text-base sm:text-lg font-bold mb-6 text-slate-100">
          ¿Está seguro que desea enviar el reporte?
        </h3>

        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={confirmAndPublishReport}
            className="w-full py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-200 font-extrabold text-sm shadow-md btn-interactive focus-visible:outline-none"
          >
            Confirmar
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('report')}
            className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-colors focus-visible:outline-none"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
