import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, PhoneCall } from 'lucide-react';

export default function PanicSosScreen() {
  const { activeModal, setActiveModal, showToast, triggerHaptic } = useApp();

  if (activeModal !== 'sos') return null;

  const handleCancel = () => {
    setActiveModal(null);
    triggerHaptic([60]);
    showToast('Alerta de emergencia SOS cancelada', 'info');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-between p-6 sm:p-8 overflow-y-auto animate-in zoom-in-95 duration-200"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="sos-title"
    >
      {/* Encabezado con Escudo Pulsante de Figma */}
      <div className="flex flex-col items-center text-center mt-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-600/20 border-4 border-red-500 text-red-500 flex items-center justify-center mb-6 radar-beacon">
          <ShieldAlert className="w-14 h-14" />
        </div>
        <h2 id="sos-title" className="text-2xl sm:text-3xl font-extrabold tracking-wider text-red-500 mb-2">
          ALERTA ENVIADA
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xs">
          Tu ubicación fue compartida con vecinos y servicios de emergencia de Río Cuarto
        </p>
      </div>

      {/* Botones de Discado Directo (Página 26 de Figma) */}
      <div className="w-full max-w-sm flex flex-col gap-3 my-8">
        <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400 text-center mb-1">
          Servicios de emergencias
        </p>

        <a
          href="tel:100"
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg btn-interactive"
        >
          <PhoneCall className="w-5 h-5 text-amber-400" />
          <span>100 — Bomberos</span>
        </a>

        <a
          href="tel:103"
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg btn-interactive"
        >
          <PhoneCall className="w-5 h-5 text-orange-400" />
          <span>103 — Defensa Civil</span>
        </a>

        <a
          href="tel:107"
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg btn-interactive"
        >
          <PhoneCall className="w-5 h-5 text-blue-400" />
          <span>107 — Emergencias Médicas</span>
        </a>

        <a
          href="tel:911"
          className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl btn-interactive"
        >
          <PhoneCall className="w-5 h-5 text-white" />
          <span>911 — Policía</span>
        </a>
      </div>

      {/* Botón Cancelar */}
      <button
        type="button"
        onClick={handleCancel}
        className="text-sm font-bold text-slate-400 hover:text-white underline py-3 focus-visible:outline-none mb-4"
      >
        Cancelar alerta
      </button>
    </div>
  );
}
