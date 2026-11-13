import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  MapPin,
  Map,
  Plus,
  ShieldAlert,
  Clock,
  Gift,
  User,
  Sliders,
  Sun,
  Moon,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Camera,
  UserX,
  AlertTriangle,
  Lightbulb,
  Flame,
  Wrench,
  Check,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

export default function TutorialTourModal() {
  const {
    activeModal,
    setActiveModal,
    user,
    triggerHaptic,
    config,
    tutorialStep,
    setTutorialStep
  } = useApp();

  const [currentStep, setCurrentStep] = useState(tutorialStep || 0);

  // Sincronizar paso si viene establecido desde AppContext
  useEffect(() => {
    if (activeModal === 'tutorial') {
      setCurrentStep(tutorialStep || 0);
    }
  }, [activeModal, tutorialStep]);

  // Manejo de navegación por teclado (Flechas y Escape)
  useEffect(() => {
    if (activeModal !== 'tutorial') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, currentStep]);

  if (activeModal !== 'tutorial') return null;

  const handleClose = () => {
    localStorage.setItem('radar_urbano_tutorial_seen', 'true');
    setActiveModal(null);
    triggerHaptic([40]);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      triggerHaptic([35]);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      triggerHaptic([35]);
    }
  };

  const userName = user?.isLoggedIn && user?.name ? user.name : null;

  // Definición de los pasos del recorrido guiado
  const STEPS = [
    // Paso 1: Bienvenida y Alcance
    {
      id: 'welcome',
      badge: 'Paso 1 de 6 • Bienvenida',
      title: userName
        ? `¡Bienvenido/a ${userName} a Radar Urbano!`
        : '¡Bienvenido/a a Radar Urbano!',
      subtitle: 'Red Vecinal de Prevención • Río Cuarto',
      renderContent: () => (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-slate-850 border border-amber-400/40 text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg relative">
              <MapPin className="w-8 h-8 text-red-500 fill-red-500/30" />
              <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h4 className="text-base font-black text-white uppercase tracking-wider font-brand">
              Radar Urbano
            </h4>
            <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mt-0.5">
              Río Cuarto, Córdoba
            </p>
          </div>

          <div className="space-y-2.5 text-slate-300 leading-relaxed">
            <p className="text-xs sm:text-sm font-semibold text-slate-100">
              Esta plataforma es una <strong>red comunitaria en tiempo real</strong> creada para la prevención ciudadana y el cuidado mutuo de los vecinos de Río Cuarto.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center text-center">
                <span className="text-lg mb-1">🚨</span>
                <strong className="text-white">Alertas Tempranas</strong>
                <span className="text-slate-400 text-[10px]">Delitos e incidencias urbanas</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center text-center">
                <span className="text-lg mb-1">📍</span>
                <strong className="text-white">Geolocalización</strong>
                <span className="text-slate-400 text-[10px]">En el mapa de tu barrio</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center text-center">
                <span className="text-lg mb-1">🤝</span>
                <strong className="text-white">Solidaridad</strong>
                <span className="text-slate-400 text-[10px]">Validación y puntos</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Paso 2: El Mapa Cartográfico Interactivo
    {
      id: 'map',
      badge: 'Paso 2 de 6 • Cartografía',
      title: 'El Mapa Cartográfico Interactivo',
      subtitle: 'Explora incidentes con simbología universal en Río Cuarto',
      renderContent: () => (
        <div className="space-y-3.5 text-xs">
          <p className="text-slate-300 leading-relaxed">
            El mapa te muestra en tiempo real las alertas comunitarias reportadas en tu zona de Río Cuarto, delimitadas por tu radio de proximidad (1 km para vecinos, 5 km para moderadores).
          </p>

          {/* Simbología Universal */}
          <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                Simbología Universal:
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Cada tipo de alerta tiene una <strong>forma geométrica única</strong> para que personas con daltonismo o baja visión puedan identificarla sin depender solo del color:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-red-500/30 text-slate-200">
                <span className="w-5 h-5 flex items-center justify-center font-black text-red-400 text-xs shrink-0">🔷</span>
                <span><strong>Robo/Delito:</strong> Rombo</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-amber-500/30 text-slate-200">
                <span className="w-5 h-5 flex items-center justify-center font-black text-amber-400 text-xs shrink-0">⚠️</span>
                <span><strong>Sospechoso:</strong> Triángulo</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-yellow-500/30 text-slate-200">
                <span className="w-5 h-5 flex items-center justify-center font-black text-yellow-400 text-xs shrink-0">🟡</span>
                <span><strong>Luz rota:</strong> Círculo</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-sky-500/30 text-slate-200">
                <span className="w-5 h-5 flex items-center justify-center font-black text-sky-400 text-xs shrink-0">🟫</span>
                <span><strong>Baldío:</strong> Cuadrado</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-violet-500/30 text-slate-200">
                <span className="w-5 h-5 flex items-center justify-center font-black text-violet-400 text-xs shrink-0">🟣</span>
                <span><strong>Acoso:</strong> Pentágono</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-slate-200">
                <span className="w-5 h-5 flex items-center justify-center font-black text-emerald-400 text-xs shrink-0">🟢</span>
                <span><strong>Resuelto:</strong> Hexágono</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Paso 3: Cómo Agregar Alerta o Reporte
    {
      id: 'report',
      badge: 'Paso 3 de 6 • Cómo Reportar',
      title: 'Cómo Agregar una Alerta o Reporte',
      subtitle: 'Dos formas sencillas de geolocalizar tu reporte',
      renderContent: () => (
        <div className="space-y-3.5 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Puedes reportar cualquier hecho en segundos para alertar al instante a los vecinos de la zona:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Modo 1: Botón inferior */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>1. Botón "Agregar Alerta"</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Toca el botón <strong>"Agregar Alerta"</strong> en el dock inferior de la pantalla. Creará el reporte fijado en tu <strong>ubicación actual</strong> o zona activa del mapa de inmediato.
                </p>
              </div>
            </div>

            {/* Modo 2: Toque manual en la calle */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>2. Toque Manual en el Mapa</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  También puedes <strong>tocar cualquier calle o esquina</strong> de Río Cuarto directamente en el mapa para ubicar el reporte con <strong>precisión manual exacta</strong> donde sucedió.
                </p>
              </div>
            </div>
          </div>

          {/* Opciones avanzadas: Fotos y Modo Anónimo */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-850 border border-amber-500/40 space-y-1.5">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              🛡️ Funciones de Protección en el Reporte:
            </span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex items-start gap-1.5">
                <UserX className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Modo Anónimo:</strong> Actívalo para ocultar tu nombre y figurar como <em>"Vecino Anónimo"</em> si estás denunciando algo delicado.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Evidencia Fotográfica:</strong> Puedes adjuntar una foto de la situación (comprimida automáticamente para mayor rapidez).</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Paso 4: Botón de Pánico SOS
    {
      id: 'sos',
      badge: 'Paso 4 de 6 • Botón SOS',
      title: 'Botón de Pánico SOS de Auxilio',
      subtitle: 'Respuesta inmediata ante emergencias con la Ley de Fitts',
      renderContent: () => (
        <div className="space-y-3.5 text-xs">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-850 to-slate-850 border border-red-500/40">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex flex-col items-center justify-center text-white shrink-0 shadow-lg border-2 border-white/80">
              <ShieldAlert className="w-6 h-6" />
              <span className="text-[9px] font-black uppercase tracking-wider">SOS</span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-red-300">
                Mantener presionado unos segundos
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Un anillo visual de progreso y vibración háptica te confirmarán la activación.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
            <p>
              Al completarse la cuenta regresiva, se despliega la <strong>Pantalla de Emergencia</strong> con acceso directo telefónico a las fuerzas y servicios de auxilio de Río Cuarto:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span><strong>911:</strong> Policía de Córdoba</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span><strong>107:</strong> Emergencias Médicas</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span><strong>100:</strong> Bomberos Voluntarios</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span><strong>103:</strong> Defensa Civil</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              💡 Además, si eres zurdo, puedes activar el <strong>Modo para Zurdos</strong> en Configuración para trasladar el botón SOS a la izquierda.
            </p>
          </div>
        </div>
      )
    },

    // Paso 5: Menú de Opciones y Funcionalidades
    {
      id: 'menu',
      badge: 'Paso 5 de 6 • Menú de Navegación',
      title: 'Menú Vecinal',
      subtitle: 'Todo lo que contiene tu barra de navegación',
      renderContent: () => (
        <div className="space-y-2.5 text-xs">
          <p className="text-slate-300 leading-snug">
            En la barra superior de escritorio o en el menú lateral de tu móvil tienes acceso a todas las herramientas:
          </p>

          <div className="space-y-1.5 max-h-[36vh] overflow-y-auto pr-1">
            {/* 1. Historial */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white text-xs block">Historial de Reportes y Filtros</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Visualiza todas las alertas de tu barrio, filtra por categoría (Delito, Sospechoso, Luminaria), valida alertas con el botón <em>"Validar"</em> y marca alertas resueltas con tilde verde.
                </p>
              </div>
            </div>

            {/* 2. Puntos y Canje */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white text-xs block">Puntos y Comercios Adheridos</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Gamificación cívica: cada aporte validado te otorga puntos barriales para canjear por cupones de descuento en comercios locales de Río Cuarto.
                </p>
              </div>
            </div>

            {/* 3. Datos Personales */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white text-xs block">Datos Personales y Rango Vecinal</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tu perfil de vecino verificado con DNI, teléfono y barrio. Acumula reputación para subir de nivel: <em>Bronce, Plata, Oro y Diamante</em>.
                </p>
              </div>
            </div>

            {/* 4. Configuración */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white text-xs block">Configuración de Zonas y Ergonomía</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ajusta el radio de distancia en km de las alertas a tu alrededor y activa el <em>Modo para Zurdos</em> integral para invertir la posición de los botones.
                </p>
              </div>
            </div>

            {/* 5. Modo Claro / Oscuro */}
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white text-xs block">Modo Claro / Modo Oscuro</strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Cambia con un solo clic el tema visual. El modo oscuro cuenta con un filtro cartográfico especial para patrullajes nocturnos sin deslumbramiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Paso 6: Listo para Comenzar
    {
      id: 'finish',
      badge: 'Paso 6 de 6 • ¡Listo!',
      title: '¡Ya conoces todo sobre Radar Urbano!',
      subtitle: 'Juntos construimos una red comunitaria más segura',
      renderContent: () => (
        <div className="space-y-4 text-xs text-center py-4">
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            Recuerda que si tienes cualquier duda, puedes volver a abrir este <strong>Manual de Usuario</strong> en cualquier momento desde la sección de <strong>Preguntas Frecuentes</strong>.
          </p>
        </div>
      )
    }
  ];

  const currentStepData = STEPS[currentStep];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
    >
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl p-5 sm:p-6 relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={handleClose}
          className="btn-interactive absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0"
          aria-label="Cerrar tutorial guiado"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado del Paso */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {currentStepData.badge}
            </span>
          </div>
          <h3 id="tutorial-modal-title" className="text-lg sm:text-xl font-black text-white leading-tight">
            {currentStepData.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentStepData.subtitle}
          </p>
        </div>

        {/* Contenido Dinámico del Paso */}
        <div className="flex-1 overflow-y-auto pr-1 pb-2">
          {currentStepData.renderContent()}
        </div>

        {/* Barra de Progreso y Controles Inferiores */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {/* Indicadores de Puntos (Dots interactivos) */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Pasos del tutorial">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setCurrentStep(idx);
                  triggerHaptic([20]);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 bg-amber-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Ir al paso ${idx + 1}`}
                aria-selected={currentStep === idx}
              />
            ))}
          </div>

          {/* Botones Anterior y Siguiente */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn-interactive h-9 px-3 rounded-xl border border-slate-700 hover:bg-slate-800 active:scale-95 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn-interactive h-9 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span>{currentStep === STEPS.length - 1 ? '¡Comenzar!' : 'Siguiente'}</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
