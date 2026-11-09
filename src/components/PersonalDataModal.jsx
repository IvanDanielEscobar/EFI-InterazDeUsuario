import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Upload,
  Trash2,
  Shield,
  LogOut
} from 'lucide-react';
import UserAvatar from './UserAvatar';

const RIO_CUARTO_NEIGHBORHOODS = [
  'Banda Norte',
  'Centro',
  'Alberdi',
  'Castelli',
  'Bimaco',
  'Universidad',
  'Golf Club',
  'Fénix',
  'Las Delicias',
  'Pizarro',
  'San Martín'
];

export default function PersonalDataModal() {
  const { activeModal, setActiveModal, user, updateUserProfile, logoutUser, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: user.name || '',
    dni: user.dni || '',
    email: user.email || '',
    phone: user.phone || '',
    birthdate: user.birthdate || '',
    neighborhood: user.neighborhood || 'Banda Norte, Río Cuarto',
    avatar: user.avatar || ''
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        dni: user.dni || '',
        email: user.email || '',
        phone: user.phone || '',
        birthdate: user.birthdate || '',
        neighborhood: user.neighborhood || 'Banda Norte, Río Cuarto',
        avatar: user.avatar || ''
      });
    }
  }, [user, activeModal]);

  if (activeModal !== 'personalData') return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('La foto no debe superar 2 MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target.result }));
        showToast('Foto cargada. Guarda para confirmar cambios.', 'info');
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    showToast('Foto removida. Se mostrarán tus iniciales.', 'info');
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setActiveModal(null);
    }, 1200);
  };

  // Cálculo de progreso de reputación
  const count = user.reactionsCount || 0;
  let nextTierName = 'Plata';
  let targetCount = 5;
  let prevCount = 0;

  if (count >= 20) {
    nextTierName = 'Máximo nivel (Diamante)';
    targetCount = 20;
    prevCount = 20;
  } else if (count >= 10) {
    nextTierName = 'Diamante';
    targetCount = 20;
    prevCount = 10;
  } else if (count >= 5) {
    nextTierName = 'Oro';
    targetCount = 10;
    prevCount = 5;
  }

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((count - prevCount) / (targetCount - prevCount || 1)) * 100))
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="personal-data-title"
    >
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Encabezado */}
        <header className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="personal-data-title" className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  Datos Personales
                </h2>
                {user.isModerator && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    <Shield className="w-3 h-3" />
                    Moderador
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Perfil de ciudadano verificado de Río Cuarto
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Cerrar perfil"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Tarjeta de Nivel, Avatar e Iniciales */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
            <div className="flex items-center gap-3.5">
              {/* Avatar con Iniciales o Foto cargada */}
              <UserAvatar
                user={{ ...user, avatar: formData.avatar }}
                size="xl"
                showRing={true}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white truncate">{user.name}</h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    <Award className="w-3 h-3" />
                    {user.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-amber-400 font-bold">
                    {user.points} puntos
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-slate-300 font-semibold">
                    Usuario: <strong className="text-white font-mono">{user.username || 'ivan'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Selector de Imagen / Remover Imagen */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="btn-interactive cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-white text-xs font-bold border border-slate-600 transition-all">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formData.avatar ? 'Cambiar Foto' : 'Cargar Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>

                {formData.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-interactive flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Usar iniciales</span>
                  </button>
                )}
              </div>

              <span className="text-[11px] text-slate-400 italic">
                {formData.avatar ? 'Foto personalizada' : 'Mostrando iniciales'}
              </span>
            </div>

            {/* Barra de Progreso de Gamificación */}
            <div className="pt-2 border-t border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Nivel de Confianza Vecinal:</span>
                <span className="font-bold text-amber-400">
                  {count} validaciones {count < 20 ? `• Próximo: ${nextTierName}` : '• Rango Máximo'}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-700/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Formulario de Datos Personales */}
          <form id="personal-data-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre Completo */}
            <div>
              <label htmlFor="user-name" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Nombre Completo:</span>
              </label>
              <input
                id="user-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            {/* DNI y Teléfono en dos columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="user-dni" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>DNI / Documento:</span>
                </label>
                <input
                  id="user-dni"
                  name="dni"
                  type="text"
                  required
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                  placeholder="Ej. 43.123.456"
                />
              </div>

              <div>
                <label htmlFor="user-phone" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Teléfono Móvil:</span>
                </label>
                <input
                  id="user-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                  placeholder="Ej. 358 412-3456"
                />
              </div>
            </div>

            {/* Email y Fecha de Nacimiento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="user-email" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Correo Electrónico:</span>
                </label>
                <input
                  id="user-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="user-birthdate" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Fecha de Nacimiento:</span>
                </label>
                <input
                  id="user-birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                />
              </div>
            </div>

            {/* Barrio en Río Cuarto */}
            <div>
              <label htmlFor="user-neighborhood" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Barrio de Residencia (Río Cuarto):</span>
              </label>
              <select
                id="user-neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              >
                {RIO_CUARTO_NEIGHBORHOODS.map((barrio) => (
                  <option key={barrio} value={`${barrio}, Río Cuarto`}>
                    {barrio}, Río Cuarto
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Garantía de Privacidad */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-750 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Tus datos personales están protegidos y se almacenan exclusivamente de forma local y cifrada en tu navegador para validar tus aportes vecinales.
            </p>
          </div>
        </div>

        {/* Pie con Acciones */}
        <footer className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between shrink-0 gap-3">
          <button
            type="button"
            onClick={() => {
              logoutUser();
              setActiveModal(null);
            }}
            className="btn-interactive flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:scale-95 text-red-400 border border-red-500/30 text-xs font-bold transition-all focus-visible:outline-none"
            title="Cerrar la sesión actual"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="btn-interactive px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs font-bold border border-slate-700 transition-all focus-visible:outline-none"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="personal-data-form"
              className="btn-interactive flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-black transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
