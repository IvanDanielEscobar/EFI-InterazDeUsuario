import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';

export default function PanicButton() {
  const { setActiveModal, triggerHaptic, showToast, user, setAuthView } = useApp();
  const [pressProgress, setPressProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef(null);
  const intervalTimer = useRef(null);

  const HOLD_DURATION = 1500; // 1.5 segundos

  const startPress = () => {
    if (!user?.isLoggedIn) {
      triggerHaptic([60, 40]);
      setAuthView('login');
      setActiveModal('auth');
      showToast('Debes iniciar sesión para activar el botón SOS de auxilio', 'warning');
      return;
    }

    setIsPressing(true);
    setPressProgress(0);
    triggerHaptic([40]);

    const startTime = Date.now();
    intervalTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setPressProgress(progress);
    }, 25);

    pressTimer.current = setTimeout(() => {
      completeEmergency();
    }, HOLD_DURATION);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (intervalTimer.current) clearInterval(intervalTimer.current);
    setIsPressing(false);
    setPressProgress(0);
  };

  const completeEmergency = () => {
    cancelPress();
    if (!user?.isLoggedIn) {
      setAuthView('login');
      setActiveModal('auth');
      showToast('Debes iniciar sesión para activar el botón SOS de auxilio', 'warning');
      return;
    }
    triggerHaptic([250, 100, 250, 100, 350]);
    setActiveModal('sos');
    showToast('🚨 ALERTA SOS EMITIDA: Transmitiendo ubicación a la red de Río Cuarto', 'emergency');
  };

  return (
    <div className="flex flex-col items-center justify-start pointer-events-auto select-none">
      <button
        type="button"
        onClick={(e) => {
          if (!user?.isLoggedIn) {
            e.preventDefault();
            triggerHaptic([60, 40]);
            setAuthView('login');
            setActiveModal('auth');
            showToast('Debes iniciar sesión para activar el botón SOS de auxilio', 'warning');
          }
        }}
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        className="btn-interactive relative w-[54px] h-[54px] sm:w-[58px] sm:h-[58px] rounded-full aspect-square bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 active:scale-95 text-white flex flex-col items-center justify-center border-2 border-white/90 dark:border-slate-800 shadow-xl sos-button-glow focus-visible:outline-none"
        aria-label="Botón de Pánico SOS. Mantén presionado 1.5 segundos para solicitar auxilio inmediato."
      >
        {/* Onda expansiva de radar circular suave */}
        <span className="absolute inset-0 rounded-full bg-red-500 opacity-25 animate-ping pointer-events-none" />

        {/* Anillo de progreso circular al presionar (SVG exacto) */}
        {isPressing && (
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 58 58">
            <circle
              cx="29"
              cy="29"
              r="25"
              fill="none"
              stroke="#facc15"
              strokeWidth="3.5"
              strokeDasharray={157}
              strokeDashoffset={157 - (157 * pressProgress) / 100}
              strokeLinecap="round"
            />
          </svg>
        )}

        <ShieldAlert className="w-6 h-6 drop-shadow" />
        <span className="text-[10px] font-black tracking-widest uppercase -mt-0.5 drop-shadow">SOS</span>
      </button>

      {/* Rótulo de guía táctil (Fiel a pantalla 25 de Figma) */}
      <span className={`mt-1.5 text-[8.5px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow border transition-colors whitespace-nowrap ${
        isPressing
          ? 'bg-amber-400 text-slate-900 border-amber-300 font-extrabold scale-105'
          : 'bg-slate-900/90 text-slate-300 border-slate-700/80 backdrop-blur-xs'
      }`}>
        {isPressing ? 'Mantener presionado...' : 'Mantener Presionado'}
      </span>
    </div>
  );
}
