import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Check,
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  AlertCircle,
  UserPlus,
  LogIn,
  Gift
} from 'lucide-react';

export default function AuthModal() {
  const {
    activeModal,
    setActiveModal,
    authView,
    setAuthView,
    loginUser,
    registerUser,
    triggerHaptic,
    showToast
  } = useApp();

  // Login inputs (100% limpios por defecto sin nada preescrito)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register inputs (100% limpios por defecto sin nada preescrito)
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNeighborhood, setRegNeighborhood] = useState('Centro, Río Cuarto');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTerms, setRegTerms] = useState(true);
  const [regError, setRegError] = useState('');

  // Recovery inputs (limpios)
  const [recoverEmail, setRecoverEmail] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');

  // Limpiar todos los campos al abrir el modal o cambiar de vista
  useEffect(() => {
    if (activeModal === 'auth') {
      setLoginUsername('');
      setLoginPassword('');
      setShowLoginPassword(false);
      setRegName('');
      setRegUsername('');
      setRegEmail('');
      setRegNeighborhood('Centro, Río Cuarto');
      setRegPassword('');
      setRegConfirmPassword('');
      setShowRegPassword(false);
      setRegTerms(true);
      setRegError('');
      setRecoverEmail('');
      setCodeDigits(['', '', '', '']);
      setNewPassword('');

      // Limpiar agresivamente cualquier auto-inyección diferida del gestor de contraseñas de Chrome
      const t1 = setTimeout(() => {
        setLoginUsername('');
        setLoginPassword('');
      }, 50);
      const t2 = setTimeout(() => {
        setLoginUsername('');
        setLoginPassword('');
      }, 180);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [activeModal, authView]);

  if (activeModal !== 'auth') return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      showToast('Ingresa tu usuario o correo electrónico', 'warning');
      return;
    }
    loginUser(loginUsername, loginPassword);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Por favor ingresa tu nombre y apellido');
      showToast('Por favor ingresa tu nombre y apellido', 'warning');
      return;
    }

    const cleanUser = regUsername.trim().toLowerCase().replace(/^@/, '');
    if (!cleanUser || cleanUser.length < 3) {
      setRegError('El nombre de usuario debe tener al menos 3 caracteres');
      showToast('El nombre de usuario debe tener al menos 3 caracteres', 'warning');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Por favor ingresa un correo electrónico válido');
      showToast('Por favor ingresa un correo electrónico válido', 'warning');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres');
      showToast('La contraseña debe tener al menos 4 caracteres', 'warning');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden');
      showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    if (!regTerms) {
      setRegError('Debes aceptar las normas vecinales para registrarte');
      showToast('Debes aceptar las normas vecinales para registrarte', 'warning');
      return;
    }

    const result = registerUser({
      username: cleanUser,
      name: regName.trim(),
      email: regEmail.trim(),
      neighborhood: regNeighborhood,
      password: regPassword
    });

    if (!result?.success && result?.error) {
      setRegError(result.error);
    }
  };

  const handleRecoverStep1 = () => {
    setAuthView('recover-2');
    triggerHaptic([40]);
  };

  const handleRecoverStep2 = () => {
    setAuthView('recover-3');
    triggerHaptic([40]);
  };

  const handleRecoverStep3 = () => {
    setAuthView('recover-success');
    triggerHaptic([100]);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl p-5 sm:p-6 relative overflow-y-auto max-h-[92vh]">
        {/* Botón Cerrar Accesible */}
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="btn-interactive absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          aria-label="Cerrar modal de autenticación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado Urbano */}
        <div className="text-center mb-5">
          <h2 id="auth-modal-title" className="text-2xl font-brand tracking-wider uppercase text-white">
            Radar Urbano
          </h2>
          <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">
            Red Vecinal de Prevención • Río Cuarto
          </p>
        </div>

        {/* ======================================================== */}
        {/* 1. VISTA LOGIN (Sin accesos rápidos, formulario limpio)  */}
        {/* ======================================================== */}
        {authView === 'login' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-extrabold text-white">
                Iniciar Sesión
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingresa con tu usuario o correo para gestionar reportes y canjear puntos
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5" autoComplete="off">
              {/* Señuelo anti-autofill de Chrome / Edge */}
              <input type="text" name="fake_user" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
              <input type="password" name="fake_pwd" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="new-password" />

              {/* Campo Usuario / Correo */}
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-xs font-bold text-slate-300 mb-1"
                >
                  Usuario o Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-username"
                    name="ru_account_id"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Usuario o correo electrónico"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-form-type="other"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-all hover:border-slate-600"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-bold text-slate-300"
                  >
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthView('recover-1')}
                    className="btn-interactive text-[11px] text-amber-400 hover:text-amber-300 hover:underline font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    name="ru_security_token"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-form-type="other"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-all hover:border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="btn-interactive absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus-visible:outline-none"
                    aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón Principal Iniciar Sesión */}
              <button
                type="submit"
                className="btn-interactive w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Iniciar Sesión</span>
              </button>

              {/* Botón Secundario Crear Cuenta */}
              <div className="pt-2 border-t border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">¿No tienes cuenta todavía?</p>
                <button
                  type="button"
                  onClick={() => {
                    setRegError('');
                    setAuthView('register');
                  }}
                  className="btn-interactive w-full py-2.5 rounded-xl border border-slate-600 hover:border-amber-400/60 bg-slate-800/50 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Crear una cuenta nueva</span>
                </button>
              </div>

              {/* Botón Volver al Mapa */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-interactive text-xs text-slate-400 hover:text-slate-200 underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded-sm"
                >
                  Volver al mapa como invitado
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. VISTA REGISTRO (Formulario Completo de Alta Vecinal) */}
        {/* ======================================================== */}
        {authView === 'register' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-extrabold text-white flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Crear Cuenta Vecinal</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Únete a la red ciudadana de Río Cuarto para alertar, prevenir y cuidarnos entre todos
              </p>
            </div>

            {/* Banner de Bienvenida y Puntos */}
            <div className="bg-amber-400/10 border border-amber-400/30 p-2.5 rounded-2xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-amber-200 font-semibold leading-tight">
                ¡Recibe <span className="text-amber-300 font-bold">20 puntos de bienvenida</span> para canjear en comercios adheridos al unirte!
              </p>
            </div>

            {/* Banner de Error si existe */}
            {regError && (
              <div
                className="bg-red-500/15 border border-red-500/40 p-2.5 rounded-xl flex items-center gap-2 text-xs text-red-300 animate-in fade-in duration-150"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3" autoComplete="off">
              {/* Señuelo anti-autofill */}
              <input type="text" name="fake_reg_usr" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
              <input type="password" name="fake_reg_pwd" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" autoComplete="new-password" />

              {/* Nombre y Apellido */}
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-bold text-slate-300 mb-1"
                >
                  Nombre y Apellido <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    name="ru_reg_fullname"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ej. Valeria Rossi"
                    autoComplete="off"
                    spellCheck="false"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all hover:border-slate-600"
                  />
                </div>
              </div>

              {/* Nombre de Usuario y Correo Electrónico en 2 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Nombre de Usuario */}
                <div>
                  <label
                    htmlFor="reg-username"
                    className="block text-xs font-bold text-slate-300 mb-1"
                  >
                    Usuario <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400 font-mono text-xs font-bold">
                      @
                    </div>
                    <input
                      id="reg-username"
                      name="ru_reg_nickname"
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="valeria"
                      autoComplete="off"
                      spellCheck="false"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all hover:border-slate-600"
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-bold text-slate-300 mb-1"
                  >
                    Correo <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-email"
                      name="ru_reg_mail"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="valeria@email.com"
                      autoComplete="off"
                      spellCheck="false"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all hover:border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Barrio de Río Cuarto */}
              <div>
                <label
                  htmlFor="reg-neighborhood"
                  className="block text-xs font-bold text-slate-300 mb-1"
                >
                  Barrio de Río Cuarto
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    id="reg-neighborhood"
                    value={regNeighborhood}
                    onChange={(e) => setRegNeighborhood(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all hover:border-slate-600 appearance-none cursor-pointer"
                  >
                    <option value="Centro, Río Cuarto">Centro</option>
                    <option value="Macrocentro, Río Cuarto">Macrocentro</option>
                    <option value="Banda Norte, Río Cuarto">Banda Norte</option>
                    <option value="Alberdi, Río Cuarto">Alberdi</option>
                    <option value="Castelli, Río Cuarto">Castelli</option>
                    <option value="Bimaco, Río Cuarto">Bimaco</option>
                    <option value="Las Ferias, Río Cuarto">Las Ferias</option>
                    <option value="Universidad / UNRC, Río Cuarto">Universidad / UNRC</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Contraseña y Confirmar Contraseña */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Contraseña */}
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-bold text-slate-300 mb-1"
                  >
                    Contraseña <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-password"
                      name="ru_reg_token_pass"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mín. 4 caract."
                      autoComplete="new-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      data-lpignore="true"
                      data-form-type="other"
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all hover:border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="btn-interactive absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 focus-visible:outline-none"
                      aria-label={showRegPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label
                    htmlFor="reg-confirm-password"
                    className="block text-xs font-bold text-slate-300 mb-1"
                  >
                    Confirmar Clave <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-confirm-password"
                      name="ru_reg_token_confirm"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repetir clave"
                      autoComplete="new-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      data-lpignore="true"
                      data-form-type="other"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all hover:border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox Términos y Normas Vecinales */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-slate-300 text-[11px] leading-snug">
                  <input
                    type="checkbox"
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-800 text-amber-400 accent-amber-400 focus:ring-amber-400 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <span>
                    Acepto las normas de convivencia vecinal y el uso responsable del sistema de reportes comunitarios.
                  </span>
                </label>
              </div>

              {/* Botón Principal Registrarse */}
              <button
                type="submit"
                disabled={!regTerms}
                className="btn-interactive w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer mt-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Registrarme en Radar Urbano</span>
              </button>

              {/* Enlace a Iniciar Sesión */}
              <div className="pt-2 border-t border-slate-800 text-center space-y-1.5">
                <p className="text-xs text-slate-400">¿Ya tienes una cuenta registrada?</p>
                <button
                  type="button"
                  onClick={() => {
                    setRegError('');
                    setAuthView('login');
                  }}
                  className="btn-interactive text-xs text-amber-400 hover:text-amber-300 hover:underline font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
                >
                  Iniciar Sesión con mi usuario
                </button>
              </div>

              {/* Botón Volver al Mapa */}
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-interactive text-xs text-slate-400 hover:text-slate-200 underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded-sm"
                >
                  Volver al mapa
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. RECUPERACIÓN PASO 1 (Correo para restablecer)        */}
        {/* ======================================================== */}
        {authView === 'recover-1' && (
          <div>
            <h3 className="text-base font-bold text-center mb-1 text-slate-100">
              Recuperación de Contraseña
            </h3>
            <p className="text-xs text-slate-400 text-center mb-4">
              Ingresa el correo con el que te registraste en Radar Urbano
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleRecoverStep1}
                className="btn-interactive w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-sm shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Enviar Código de Recuperación
              </button>
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="btn-interactive w-full py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. RECUPERACIÓN PASO 2 (Ingreso de Código)             */}
        {/* ======================================================== */}
        {authView === 'recover-2' && (
          <div className="text-center">
            <h3 className="text-base font-bold mb-1 text-slate-100">Código Enviado</h3>
            <p className="text-xs text-slate-400 mb-4">
              Ingrese el código de verificación de 4 dígitos enviado a su correo
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {codeDigits.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const next = [...codeDigits];
                    next[i] = e.target.value;
                    setCodeDigits(next);
                  }}
                  className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-slate-800 border border-slate-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleRecoverStep2}
              className="btn-interactive w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-sm shadow-md mb-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Confirmar Código
            </button>
            <button
              type="button"
              onClick={() => setAuthView('login')}
              className="btn-interactive w-full py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-white font-semibold text-xs"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. RECUPERACIÓN PASO 3 (Nueva Contraseña)               */}
        {/* ======================================================== */}
        {authView === 'recover-3' && (
          <div>
            <h3 className="text-base font-bold text-center mb-1 text-slate-100">Nueva Contraseña</h3>
            <p className="text-xs text-slate-400 text-center mb-4">
              Define tu nueva contraseña segura para Radar Urbano
            </p>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Repetir nueva contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={handleRecoverStep3}
                className="btn-interactive w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-sm shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Restablecer Contraseña
              </button>
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="btn-interactive w-full py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-white font-semibold text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. RECUPERACIÓN PASO 4 (Éxito)                           */}
        {/* ======================================================== */}
        {authView === 'recover-success' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-400 bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              ¡Operación Exitosa!
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Tu contraseña ha sido restablecida. Ya puedes ingresar con tus nuevas credenciales.
            </p>
            <button
              type="button"
              onClick={() => setAuthView('login')}
              className="btn-interactive w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-black text-sm shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Iniciar Sesión Ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
