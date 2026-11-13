import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import MapCanvas from './components/MapCanvas';
import BottomSheetReport from './components/BottomSheetReport';
import ConfirmationModal from './components/ConfirmationModal';
import SuccessModal from './components/SuccessModal';
import PanicSosScreen from './components/PanicSosScreen';
import PinDetailsModal from './components/PinDetailsModal';
import AuthModal from './components/AuthModal';
import DrawerMenu from './components/DrawerMenu';
import PointsModal from './components/PointsModal';
import SettingsModal from './components/SettingsModal';
import FaqModal from './components/FaqModal';
import HistoryModal from './components/HistoryModal';
import PersonalDataModal from './components/PersonalDataModal';

export default function App() {
  const { user, config, alertRadiusKm, activeReportsWithinRadius, toasts, setActiveModal } = useApp();

  return (
    <div className="w-full h-screen h-[100dvh] flex flex-col overflow-hidden bg-slate-900 text-slate-100 antialiased select-none">
      {/* 1. Navbar Fija Superior (Logo, Theme Toggle, Usuario, Menú Hamburguesa) */}
      <Header />

      {/* 2. Subheader con Contador de Reportes Activos Delimitados por Distancia */}
      <div className="bg-slate-200 dark:bg-slate-800/95 px-4 py-1.5 flex items-center justify-between text-xs border-b border-slate-300 dark:border-slate-800 shrink-0 z-20">
        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>
            Río Cuarto – {activeReportsWithinRadius.length} reportes activos a menos de {alertRadiusKm} km
          </span>
          {user?.isModerator && (
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Mod (5 km)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user?.isLoggedIn ? (
            <button
              type="button"
              onClick={() => setActiveModal('settings')}
              className="btn-interactive text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              title="Ajustar radio de distancia en configuraciones"
            >
              <span>Radio: {alertRadiusKm} km</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              Radio: {alertRadiusKm} km
            </span>
          )}
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">
            • En vivo
          </span>
        </div>
      </div>

      {/* 3. Área del Mapa que Ocupa Toda la Pantalla con Dock Flotante (SOS + Alerta) */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        <MapCanvas />
      </main>

      {/* Modales y Paneles Desplegables de Figma */}
      <BottomSheetReport />
      <ConfirmationModal />
      <SuccessModal />
      <PanicSosScreen />
      <PinDetailsModal />
      <AuthModal />
      <DrawerMenu />
      <PointsModal />
      <SettingsModal />
      <FaqModal />
      <HistoryModal />
      <PersonalDataModal />

      {/* Contenedor Flotante de Toasts Centrado en Pantalla */}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border shadow-2xl text-xs sm:text-sm font-bold text-center backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto ${
              t.type === 'emergency'
                ? 'bg-red-600/95 text-white border-red-400 shadow-red-950/40'
                : t.type === 'warning'
                ? 'bg-amber-600/95 text-white border-amber-400 shadow-amber-950/40'
                : t.type === 'info'
                ? 'bg-slate-800/95 text-amber-300 border-amber-400/40 shadow-slate-950/50'
                : 'bg-emerald-600/95 text-white border-emerald-400 shadow-emerald-950/40'
            }`}
          >
            <span className="text-base shrink-0" aria-hidden="true">
              {t.type === 'emergency'
                ? '🚨'
                : t.type === 'warning'
                ? '⚠️'
                : t.type === 'info'
                ? 'ℹ️'
                : '✅'}
            </span>
            <span className="leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
