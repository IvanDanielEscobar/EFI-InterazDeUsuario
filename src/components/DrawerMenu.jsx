import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ChevronRight, LogOut, Gift, Settings, HelpCircle, FileText, User, Shield } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function DrawerMenu() {
  const {
    activeModal,
    setActiveModal,
    user,
    logoutUser,
    setAuthView,
    showToast
  } = useApp();

  if (activeModal !== 'drawer') return null;

  const getTierClass = (tier) => {
    switch (tier) {
      case 'diamante':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-400';
      case 'oro':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400';
      case 'plata':
        return 'bg-slate-400/20 text-slate-300 border border-slate-400';
      default:
        return 'bg-amber-700/20 text-amber-500 border border-amber-600';
    }
  };

  return (
    <>
      <div
        onClick={() => setActiveModal(null)}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      />
      <aside
        className="fixed top-0 left-0 bottom-0 w-80 max-w-[85%] bg-slate-900 text-white z-50 shadow-2xl border-r border-slate-800 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-left duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal de opciones"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <h2 className="text-xl font-brand tracking-wider uppercase text-white">Menú</h2>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 focus-visible:outline-none"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECCIÓN USUARIO LOGUEADO (Página 38 de Figma) */}
        {user.isLoggedIn ? (
          <div className="flex flex-col mb-4">
            <div
              onClick={() => setActiveModal('personalData')}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-4 cursor-pointer hover:border-slate-600 transition-all"
              role="button"
              tabIndex={0}
              aria-label="Ver y editar mis datos personales"
            >
              <UserAvatar user={user} size="lg" showRing={true} />
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <p className="font-extrabold text-sm truncate text-white">{user.name}</p>
                  {user.isModerator && (
                    <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[9px] font-black uppercase">
                      MOD
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${getTierClass(user.tier)}`}>
                  {user.isModerator ? 'Moderación Río Cuarto' : `Marco ${user.tier.toUpperCase()} (${user.reactionsCount} validaciones)`}
                </span>
              </div>
            </div>

            <nav className="space-y-1 text-sm font-semibold text-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal('history')}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Historial de reportes</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('personalData')}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Datos personales</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('points')}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Canjea tus puntos</span>
                </div>
                <span className="text-amber-400 text-xs font-bold">{user.points} pts</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('settings')}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Configuración de Zonas</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('faq')}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Preguntas frecuentes</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </nav>

            <button
              type="button"
              onClick={logoutUser}
              className="w-full mt-6 py-2.5 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          /* SECCIÓN NO LOGUEADO: Solo acciones generales (Login/Registro y Preguntas frecuentes) */
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => {
                setAuthView('login');
                setActiveModal('auth');
              }}
              className="w-full py-3 rounded-xl bg-white text-slate-900 font-extrabold text-sm mb-4 shadow-md btn-interactive"
            >
              Iniciar Sesión / Registrarse
            </button>

            <nav className="space-y-1 text-sm font-semibold text-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal('faq')}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Preguntas frecuentes</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </nav>
          </div>
        )}
      </aside>
    </>
  );
}
