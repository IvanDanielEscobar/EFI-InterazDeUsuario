import React from 'react';
import { useApp } from '../context/AppContext';
import { X, HelpCircle, Shield, AlertTriangle } from 'lucide-react';

export default function FaqModal() {
  const { activeModal, setActiveModal } = useApp();

  if (activeModal !== 'faq') return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">Preguntas Frecuentes</h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>¿Cómo reportar correctamente?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Toca directamente sobre la calle de Río Cuarto donde ocurrió el hecho. Selecciona la categoría apropiada y escribe una referencia breve para alertar a los vecinos sin generar alarma injustificada.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>¿Cómo funciona el Botón de Pánico (SOS)?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Diseñado con la Ley de Fitts al alcance del pulgar. Requiere mantener presionado 1.5 segundos para evitar falsas alarmas, despacha alerta vecinal y ofrece llamadas directas al 911, 107, 103 y 100.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-1">¿Qué significan los marcos de reputación?</h4>
            <p className="text-slate-300 leading-relaxed">
              Indican la veracidad comunitaria del vecino según las validaciones ("Me sirvió") recibidas:
              Bronce (1-4), Plata (5-9), Oro (10-20) y Diamante (+20).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 mb-1">Términos y Privacidad de Datos</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              La ubicación solo se utiliza para alertar sobre incidentes comunitarios en tiempo real y no se comercializa con terceros.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="w-full mt-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
