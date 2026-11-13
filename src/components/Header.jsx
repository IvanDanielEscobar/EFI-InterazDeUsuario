import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Moon,
  User,
  Menu,
  MapPin,
  Map,
  Clock,
  Gift,
  Sliders,
  LogOut
} from 'lucide-react';

import UserAvatar from './UserAvatar';

export default function Header() {
  const {
    config,
    toggleTheme,
    user,
    activeModal,
    setActiveModal,
    setAuthView,
    logoutUser
  } = useApp();

  return (
    <header className="w-full bg-slate-900 text-white px-3 py-2 sm:px-5 flex items-center justify-between shadow-md z-30 shrink-0 border-b border-slate-800">
      {/* 1. Logotipo y Título de Marca */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl group"
          aria-label="Ir a vista principal del mapa de Radar Urbano"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-inner group-hover:border-slate-600 transition-colors shrink-0">
            <MapPin className="w-5 h-5 text-red-500 fill-red-500/30" />
          </div>
          <span className="text-xl sm:text-2xl font-brand tracking-wider uppercase text-white leading-none">
            Radar Urbano
          </span>
        </button>
      </div>

      {/* 2. Barra de Navegación Horizontal Exclusiva para Desktop (Solo visible para usuarios autenticados) */}
      {user?.isLoggedIn && (
        <nav
          className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80 shadow-inner h-10 shrink-0"
          aria-label="Navegación principal de escritorio"
        >
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className={`btn-interactive h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
              activeModal === null
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            aria-current={activeModal === null ? 'page' : undefined}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Mapa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('history')}
            className={`btn-interactive h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
              activeModal === 'history'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            aria-current={activeModal === 'history' ? 'page' : undefined}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('points')}
            className={`btn-interactive h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
              activeModal === 'points'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            aria-current={activeModal === 'points' ? 'page' : undefined}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Puntos</span>
            <span className="text-[10px] font-black h-4.5 px-1.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-flex items-center justify-center leading-none">
              {user.points}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('personalData')}
            className={`btn-interactive h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
              activeModal === 'personalData'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            aria-current={activeModal === 'personalData' ? 'page' : undefined}
          >
            <User className="w-3.5 h-3.5" />
            <span>Datos Personales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('settings')}
            className={`btn-interactive h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer ${
              activeModal === 'settings'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
            aria-current={activeModal === 'settings' ? 'page' : undefined}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configuración</span>
          </button>
        </nav>
      )}

      {/* 3. Acciones de Utilidad (Todos calibrados a altura fija h-9 / 36px) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle Modo Oscuro / Claro (36x36px) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-interactive w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0 cursor-pointer"
          aria-label={config.theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {config.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-300" />
          )}
        </button>

        {/* Botón Perfil / Ingreso (Calibrado a altura h-9 / 36px) */}
        {user.isLoggedIn ? (
          <div className="flex items-center gap-2 shrink-0">
            {/* Avatar dentro de contenedor calibrado a 36x36px */}
            <button
              type="button"
              onClick={() => setActiveModal('personalData')}
              className="btn-interactive w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0 cursor-pointer"
              aria-label={`Perfil de ${user.name}, rango ${user.tier}`}
              title={`Perfil de ${user.name} (${user.isModerator ? 'Moderador' : 'Vecino'})`}
            >
              <UserAvatar user={user} size="sm" showRing={false} className="w-7 h-7 text-[10px]" />
            </button>

            {/* Botón Salir en Desktop (Calibrado exactamente a h-9 / 36px) */}
            <button
              type="button"
              onClick={logoutUser}
              className="hidden md:inline-flex btn-interactive h-9 px-3 rounded-xl bg-slate-800 hover:bg-red-500/20 active:scale-95 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/40 text-xs font-bold transition-all items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shrink-0 cursor-pointer"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="hidden lg:inline">Salir</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setAuthView('login');
              setActiveModal('auth');
            }}
            className="btn-interactive h-9 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-xs font-bold text-white transition-all inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ingresar</span>
          </button>
        )}

        {/* Menú Hamburguesa Móvil (Calibrado a 36x36px) */}
        <button
          type="button"
          onClick={() => setActiveModal('drawer')}
          className="btn-interactive md:hidden w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0 cursor-pointer"
          aria-label="Abrir menú de navegación móvil"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
