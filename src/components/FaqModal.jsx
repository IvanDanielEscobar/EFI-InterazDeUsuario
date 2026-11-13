import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  HelpCircle,
  Shield,
  AlertTriangle,
  Award,
  Lock,
  UserX,
  Compass,
  ChevronRight
} from 'lucide-react';

export default function FaqModal() {
  const { activeModal, setActiveModal, startTutorial, user } = useApp();

  if (activeModal !== 'faq') return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-modal-title"
    >
      <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl p-5 sm:p-6 max-h-[88vh] overflow-y-auto flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="faq-modal-title" className="text-base sm:text-lg font-bold text-white leading-tight">
                Preguntas Frecuentes
              </h3>
              <p className="text-[11px] text-slate-400">
                Guía de uso, prevención y privacidad vecinal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Cerrar preguntas frecuentes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Banner Manual de Usuario (Tutorial guiado interactivo exclusivo para usuarios logueados) */}
        {user?.isLoggedIn && (
          <div className="mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-850 to-slate-850 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    Manual de Usuario
                  </h4>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                    Tutorial
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Paso a paso: Mapa, Alertas, Botón SOS y Menú
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => startTutorial(0)}
              className="btn-interactive h-8 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-1.5 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
              aria-label="Iniciar Manual de Usuario interactivo"
            >
              <span>Ver Manual</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Listado de Preguntas */}
        <div className="space-y-3.5 text-xs flex-1">
          {/* 1. Cómo reportar */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750">
            <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>¿Cómo reportar correctamente?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Toca directamente sobre la calle de Río Cuarto donde ocurrió el hecho. Selecciona la categoría apropiada, describe brevemente la situación y, si es seguro hacerlo, adjunta una foto como evidencia.
            </p>
          </div>

          {/* 2. Botón de Pánico */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750">
            <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
              <Shield className="w-4 h-4 text-red-400 shrink-0" />
              <span>¿Cómo funciona el Botón SOS de Pánico?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Diseñado según la Ley de Fitts al alcance inmediato del pulgar. Requiere presionar de forma sostenida 1.5 segundos para evitar falsos toques, genera feedback háptico y abre acceso directo a los números de emergencia (911, 107, 103, 100).
            </p>
          </div>

          {/* 3. Reputación */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750">
            <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5 text-xs sm:text-sm">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>¿Qué significan los niveles de reputación?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Indican el compromiso ciudadano según las validaciones comunitarias ("Validar") recibidas y realizadas:
              Bronce (1-4), Plata (5-9), Oro (10-19) y Diamante (+20). Cada nivel otorga puntos canjeables en comercios barriales.
            </p>
          </div>

          {/* 4. Términos y Privacidad de Datos + Reporte Anónimo */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-850 to-slate-850 border border-amber-500/30 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Términos y Privacidad de Datos</span>
            </h4>

            {/* Subsección: Reporte Anónimo */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px] mb-1">
                <UserX className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Denuncias y Reportes Anónimos:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Ante situaciones delicadas, hechos delictivos o situaciones que comprometan tu seguridad personal, puedes activar la opción <strong>"Publicar de forma anónima"</strong> en el formulario de reporte. Tu nombre real, correo y nivel quedan completamente ocultos para la comunidad vecinal, figurando públicamente como <em>"Vecino Anónimo"</em>. De forma privada y segura, continuarás teniendo acceso a tus alertas en la pestaña <em>"Mis Reportes"</em> dentro del Historial.
              </p>
            </div>

            {/* Subsección: Ubicación y Evidencia */}
            <p className="text-slate-400 leading-relaxed text-[11px] pt-1">
              La ubicación geográfica y las fotografías adjuntas se utilizan con el único propósito de alertar y coordinar la prevención barrial en tiempo real en Río Cuarto. Los datos personales nunca se comercializan ni se transfieren a terceros con fines publicitarios.
            </p>
          </div>
        </div>

        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="btn-interactive w-full mt-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 shrink-0"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
