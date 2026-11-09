import React from 'react';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

export default function SuccessModal() {
  const { activeModal } = useApp();

  if (activeModal !== 'success') return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-slate-900 text-white p-7 rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center text-center">
        {/* Checkmark Verde con Pulso (Página 9 de Figma) */}
        <div className="w-24 h-24 rounded-full border-4 border-emerald-500 bg-emerald-500/10 flex items-center justify-center mb-5 text-emerald-400">
          <Check className="w-14 h-14 stroke-[3]" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Tu reporte fue publicado en el mapa.
        </h3>
        <p className="text-emerald-400 font-extrabold text-base mb-4">
          Gracias por cuidar la ciudad
        </p>

        <div className="text-xs text-slate-400 space-y-1">
          <p>Notificando a los vecinos cercanos...</p>
          <p className="text-[11px] text-slate-500">Automáticamente será redirigido al mapa. Espere...</p>
        </div>
      </div>
    </div>
  );
}
