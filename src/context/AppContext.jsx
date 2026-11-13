import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_REPORTS, CATEGORIES_CONFIG } from '../data/initialReports';
import { HARDCODED_USERS } from '../data/users';

const AppContext = createContext();

export const RIO_CUARTO_CENTER = [-33.1245, -64.3492];

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371; // Radio medio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Calcula el rango o marco cívico del vecino en función de sus validaciones
 */
export function calculateTier(validationsCount, isModerator = false) {
  if (isModerator) return 'diamante';
  const count = Number(validationsCount) || 0;
  if (count >= 20) return 'diamante';
  if (count >= 10) return 'oro';
  if (count >= 5) return 'plata';
  return 'bronce';
}

const DEFAULT_CONFIG = {
  theme: 'dark',
  isLeftHanded: false,
  gpsActive: true,
  pinShape: 'circle',
  alertRadius: 1, // 1 km por defecto para vecinos, 5 km para moderador
  activeNeighborhood: 'Centro'
};

export function AppProvider({ children }) {
  // 1. Reportes y Almacenamiento (Carga inicial enriquecida con simulación de 23 incidentes)
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('radar_urbano_reports');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_REPORTS.length) {
          return parsed.map((r) => ({
            ...r,
            validatedBy: Array.isArray(r.validatedBy) ? r.validatedBy : []
          }));
        }
      }
      return INITIAL_REPORTS.map((r) => ({
        ...r,
        validatedBy: Array.isArray(r.validatedBy) ? r.validatedBy : []
      }));
    } catch {
      return INITIAL_REPORTS.map((r) => ({
        ...r,
        validatedBy: Array.isArray(r.validatedBy) ? r.validatedBy : []
      }));
    }
  });

  // 2. Estado de Usuario (Carga uno de los 5 usuarios hardcodeados con isLoggedIn explícito)
  const [user, setUser] = useState(() => {
    const fallbackUser = { ...HARDCODED_USERS[0], isLoggedIn: false };
    try {
      const saved = localStorage.getItem('radar_urbano_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name !== 'Fulano') {
          // Si el usuario guardado tenía isLoggedIn !== false, o si es un usuario válido previamente activo
          const isLoggedIn = parsed.isLoggedIn !== undefined ? Boolean(parsed.isLoggedIn) : true;
          return {
            ...fallbackUser,
            ...parsed,
            isLoggedIn
          };
        }
      }
      return fallbackUser;
    } catch {
      return fallbackUser;
    }
  });

  // Referencia sincrónica para evitar stale closures en eventos de Leaflet y timers
  const userRef = useRef(user);
  userRef.current = user;

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // 2.1 Base de usuarios registrados (inicia con HARDCODED_USERS y almacena nuevos registros)
  const [allUsers, setAllUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('radar_urbano_all_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Fusionar usuarios predeterminados con los registrados sin duplicados
          const merged = [...HARDCODED_USERS];
          parsed.forEach((p) => {
            if (p && p.username && !merged.some((m) => m.username.toLowerCase() === p.username.toLowerCase())) {
              merged.push(p);
            }
          });
          return merged;
        }
      }
      return HARDCODED_USERS;
    } catch {
      return HARDCODED_USERS;
    }
  });

  // Persistir lista de usuarios
  useEffect(() => {
    localStorage.setItem('radar_urbano_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // 3. Configuración y Accesibilidad (Moderador: 5 km default, Vecinos: 1 km default)
  const [config, setConfig] = useState(() => {
    const roleDefault = user?.isModerator ? 5 : 1;
    try {
      const saved = localStorage.getItem('radar_urbano_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        let radius = Number(parsed.alertRadius);
        // Si no es moderador, su valor por defecto es 1 km; moderador tiene 5 km
        if (!user?.isModerator && radius === 5) {
          radius = 1;
        } else if (user?.isModerator && radius === 1) {
          radius = 5;
        }
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          alertRadius: radius || roleDefault
        };
      }
      return { ...DEFAULT_CONFIG, alertRadius: roleDefault };
    } catch {
      return { ...DEFAULT_CONFIG, alertRadius: roleDefault };
    }
  });

  // 4. Filtro activo
  const [activeFilter, setActiveFilter] = useState('todos');

  // 5. Modales y Vistas Activas con Guarda de Autenticación
  const [activeModal, _setActiveModal] = useState(null); // 'report'|'confirm'|'success'|'sos'|'pinDetail'|'auth'|'drawer'|'points'|'settings'|'faq'|'tutorial'
  const [authView, setAuthView] = useState('login'); // 'login'|'register'|'recover-1'|'recover-2'|'recover-3'|'recover-success'
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);

  const startTutorial = (stepIndex = 0) => {
    setTutorialStep(stepIndex);
    _setActiveModal('tutorial');
    triggerHaptic([40]);
  };

  const PROTECTED_MODALS = ['history', 'points', 'personalData', 'settings', 'sos'];

  const setActiveModal = (modalName) => {
    const isAuth = Boolean(userRef.current?.isLoggedIn);
    if (modalName && PROTECTED_MODALS.includes(modalName) && !isAuth) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para acceder a esta función', 'warning');
      return;
    }
    _setActiveModal(modalName);
  };

  // 6. Flujo de Reporte
  const [pendingLocation, setPendingLocation] = useState({ lat: -33.125, lng: -64.350, x: 50, y: 50 });
  const [selectedCategory, setSelectedCategory] = useState('delito');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPhoto, setReportPhoto] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [focusLocationTrigger, setFocusLocationTrigger] = useState(null);

  const recenterMap = () => setCenterTrigger((prev) => prev + 1);

  const focusMapOn = (lat, lng, reportId = null) => {
    setActiveModal(null);
    if (reportId) setSelectedReportId(reportId);
    setFocusLocationTrigger({ lat, lng, time: Date.now() });
    showToast('Ubicación fijada en el mapa', 'info');
    triggerHaptic([40]);
  };

  // 7. Sistema de Toasts
  const [toasts, setToasts] = useState([]);

  // Sincronizar tema con elemento <html>
  useEffect(() => {
    const root = document.documentElement;
    if (config.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('radar_urbano_config', JSON.stringify(config));
  }, [config]);

  // Persistir reportes
  useEffect(() => {
    localStorage.setItem('radar_urbano_reports', JSON.stringify(reports));
  }, [reports]);

  // Persistir usuario
  useEffect(() => {
    localStorage.setItem('radar_urbano_user', JSON.stringify(user));
  }, [user]);

  // Cerrar modales con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Recorrido guiado automático para usuarios nuevos / primera visita
  useEffect(() => {
    const hasSeen = localStorage.getItem('radar_urbano_tutorial_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        _setActiveModal((curr) => (curr === null ? 'tutorial' : curr));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Vibración segura
  const triggerHaptic = (pattern = [100]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Fallback seguro
      }
    }
  };

  // Toast
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Acciones de Tema y Ergonomía
  const toggleTheme = () => {
    setConfig((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
    triggerHaptic([40]);
  };

  const toggleLeftHanded = () => {
    setConfig((prev) => {
      const next = !prev.isLeftHanded;
      showToast(next ? 'Ergonomía para zurdos activada' : 'Ergonomía para diestros activada', 'info');
      return { ...prev, isLeftHanded: next };
    });
    triggerHaptic([40]);
  };

  const setPinShape = (shape) => {
    setConfig((prev) => ({ ...prev, pinShape: shape }));
    showToast(`Forma de pin actualizada a ${shape}`, 'info');
  };

  const setAlertRadius = (radius) => {
    const defaultVal = user?.isModerator ? 5 : 1;
    const val = Math.max(1, Number(radius) || defaultVal);
    setConfig((prev) => ({ ...prev, alertRadius: val }));
    showToast(`Radio de alertas activas actualizado a ${val} km`, 'info');
    triggerHaptic([40]);
  };

  const setActiveNeighborhood = (neighborhood) => {
    setConfig((prev) => ({ ...prev, activeNeighborhood: neighborhood }));
    showToast(`Zona activa cambiada a ${neighborhood}`, 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem('radar_urbano_reports');
    localStorage.removeItem('radar_urbano_user');
    localStorage.removeItem('radar_urbano_config');
    localStorage.removeItem('radar_urbano_all_users');
    setReports(INITIAL_REPORTS);
    setUser(HARDCODED_USERS[0]);
    setAllUsers(HARDCODED_USERS);
    setConfig({ ...DEFAULT_CONFIG, alertRadius: 1 });
    setActiveModal(null);
    showToast('Datos de demostración restablecidos a valores iniciales', 'info');
    triggerHaptic([60, 60]);
  };

  // Acciones de Reportes
  const startReportAtLocation = ({ lat, lng, x, y }) => {
    const currentUser = userRef.current;
    if (!currentUser?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para reportar una alerta', 'warning');
      triggerHaptic([40]);
      return;
    }
    setPendingLocation({ lat, lng, x, y });
    setReportDescription('');
    setReportPhoto('');
    setIsAnonymous(false);
    _setActiveModal('report');
    triggerHaptic([50]);
  };

  const submitReportDraft = () => {
    if (!reportDescription.trim()) {
      showToast('Por favor describe brevemente la situación', 'warning');
      return;
    }
    _setActiveModal('confirm');
  };

  const confirmAndPublishReport = () => {
    const currentUser = userRef.current;
    const cat = CATEGORIES_CONFIG[selectedCategory] || CATEGORIES_CONFIG.delito;
    const authorName = isAnonymous ? 'Vecino Anónimo' : (currentUser?.name || 'Vecino');
    const authorTier = isAnonymous ? null : (currentUser?.tier || 'bronce');

    const newReport = {
      id: Date.now(),
      type: selectedCategory,
      categoryName: cat.name,
      title: reportDescription.trim().substring(0, 48),
      description: reportDescription.trim(),
      time: 'Recién',
      lat: pendingLocation.lat,
      lng: pendingLocation.lng,
      x: pendingLocation.x,
      y: pendingLocation.y,
      icon: cat.icon,
      color: cat.color,
      badgeBg: cat.bg,
      reactions: 0,
      hasReacted: false,
      validatedBy: [],
      author: authorName,
      authorUsername: isAnonymous ? null : currentUser?.username,
      authorId: currentUser?.id || Date.now(),
      authorTier: authorTier,
      isAnonymous: Boolean(isAnonymous),
      photo: reportPhoto || '',
      comments: []
    };

    setReports((prev) => [newReport, ...prev]);
    setReportDescription('');
    setReportPhoto('');
    setIsAnonymous(false);
    _setActiveModal('success');
    triggerHaptic([120, 80, 120]);

    setTimeout(() => {
      _setActiveModal(null);
      showToast(
        isAnonymous
          ? '¡Reporte publicado de forma anónima en la red vecinal!'
          : '¡Reporte publicado con éxito en la red vecinal!',
        'success'
      );
    }, 2200);
  };

  /**
   * Validación cívica comunitaria:
   * - Única por usuario por reporte.
   * - Modifica la condición de los marcos y el status (puntos y rango) tanto del validador como del publicador.
   */
  const validateReport = (reportId) => {
    const currentUser = userRef.current;
    if (!currentUser?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para validar un reporte', 'warning');
      triggerHaptic([30]);
      return;
    }

    const currentUsername = (currentUser.username || '').toLowerCase();
    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport) return;

    const validatedBy = Array.isArray(targetReport.validatedBy)
      ? targetReport.validatedBy.map((v) => String(v).toLowerCase())
      : [];

    if (validatedBy.includes(currentUsername)) {
      showToast('Ya has validado este reporte vecinal', 'info');
      triggerHaptic([20]);
      return;
    }

    // 1. Identificar al publicador (autor del reporte)
    const authorUsername = (targetReport.authorUsername || '').toLowerCase();
    const authorName = (targetReport.author || '').toLowerCase();

    // 2. Incrementar validación en el reporte
    const newValidatedBy = [...validatedBy, currentUsername];
    const newReactions = (targetReport.reactions || 0) + 1;

    // 3. Modificar status y marco del que valida (currentUser):
    // Gana +1 en su contador de validaciones y +5 puntos cívicos
    const validatorNewReactionsCount = (currentUser.reactionsCount || 0) + 1;
    const validatorNewPoints = (currentUser.points || 0) + 5;
    const validatorNewTier = calculateTier(validatorNewReactionsCount, currentUser.isModerator);
    const validatorTierUpgraded = validatorNewTier !== currentUser.tier;

    let updatedCurrentUser = {
      ...currentUser,
      reactionsCount: validatorNewReactionsCount,
      points: validatorNewPoints,
      tier: validatorNewTier
    };

    // 4. Modificar status y marco del que publica (autor)
    let newAuthorTier = targetReport.authorTier || calculateTier(newReactions);

    setAllUsers((prevUsers) => {
      const nextList = prevUsers.map((u) => {
        const uUsername = (u.username || '').toLowerCase();
        const uName = (u.name || '').toLowerCase();
        const isAuthor =
          (authorUsername && uUsername === authorUsername) ||
          (authorName && (uName === authorName || authorName.startsWith(uName) || uName.startsWith(authorName)));

        if (isAuthor) {
          // El publicador gana +1 validación recibida y +10 puntos por aporte cívico validado
          const authorNewReactions = (u.reactionsCount || 0) + 1;
          const authorNewPoints = (u.points || 0) + 10;
          const authorTierCalc = calculateTier(authorNewReactions, u.isModerator);
          newAuthorTier = authorTierCalc;

          const updatedAuthor = {
            ...u,
            reactionsCount: authorNewReactions,
            points: authorNewPoints,
            tier: authorTierCalc
          };

          // Si el publicador es el mismo usuario logueado actualmente
          if (uUsername === currentUsername) {
            updatedCurrentUser = {
              ...updatedCurrentUser,
              reactionsCount: authorNewReactions,
              points: updatedCurrentUser.points + 10,
              tier: authorTierCalc
            };
            return updatedCurrentUser;
          }

          return updatedAuthor;
        }

        // Si es el validador en la lista global
        if (uUsername === currentUsername) {
          return updatedCurrentUser;
        }

        return u;
      });

      localStorage.setItem('radar_urbano_all_users', JSON.stringify(nextList));
      return nextList;
    });

    // Guardar validador activo
    userRef.current = updatedCurrentUser;
    setUser(updatedCurrentUser);
    localStorage.setItem('radar_urbano_user', JSON.stringify(updatedCurrentUser));

    // Si el autor no estaba en allUsers (ej. usuarios semilla como "Camila U." o "Don Roberto"),
    // aseguramos que su tier avance según las validaciones acumuladas en el reporte
    if (!newAuthorTier || newAuthorTier === targetReport.authorTier) {
      newAuthorTier = calculateTier(newReactions, false);
    }

    // 5. Actualizar la lista de reportes con el nuevo autorTier y la lista de validadores
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            reactions: newReactions,
            hasReacted: true,
            validatedBy: newValidatedBy,
            authorTier: newAuthorTier
          };
        }
        // Sincronizar authorTier en otros reportes del mismo autor si correspondiera
        if (
          (authorUsername && (rep.authorUsername || '').toLowerCase() === authorUsername) ||
          (authorName && (rep.author || '').toLowerCase() === authorName)
        ) {
          return {
            ...rep,
            authorTier: newAuthorTier
          };
        }
        return rep;
      })
    );

    triggerHaptic([60]);
    if (validatorTierUpgraded) {
      showToast(
        `¡Reporte validado (+5 pts)! Ascendiste al Marco ${validatorNewTier.toUpperCase()} 🏆`,
        'success'
      );
    } else {
      showToast('¡Reporte validado con éxito! Sumaste +5 pts y tu marco avanzó', 'success');
    }
  };

  const toggleReaction = validateReport;

  const addComment = (reportId, text) => {
    if (!userRef.current?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para comentar en el reporte', 'warning');
      triggerHaptic([30]);
      return;
    }
    if (!text.trim()) return;
    const authorName = userRef.current?.name || 'Vecino';
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            comments: [...rep.comments, { author: authorName, text: text.trim() }]
          };
        }
        return rep;
      })
    );
    triggerHaptic([40]);
    showToast('Comentario agregado al reporte', 'success');
  };

  // Autenticación con lista de usuarios (hardcodeados + registrados)
  const loginUser = (usernameOrEmail, password) => {
    const cleanInput = (usernameOrEmail || '').trim().toLowerCase();
    if (!cleanInput) {
      showToast('Por favor ingresa tu usuario o correo electrónico', 'warning');
      return false;
    }

    const userFound = allUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        (u.email && u.email.toLowerCase() === cleanInput)
    );

    if (!userFound) {
      showToast('Usuario o correo no encontrado. Revisa tus datos o regístrate.', 'warning');
      return false;
    }

    if (password && userFound.password !== password.trim()) {
      showToast('Contraseña incorrecta', 'warning');
      return false;
    }

    const finalUser = { ...userFound, isLoggedIn: true };
    userRef.current = finalUser;
    setUser(finalUser);
    localStorage.setItem('radar_urbano_user', JSON.stringify(finalUser));

    // Moderador default 5 km, demás usuarios default 1 km
    const roleRadius = finalUser.isModerator ? 5 : 1;
    setConfig((prev) => ({ ...prev, alertRadius: roleRadius }));
    _setActiveModal(null);
    showToast(
      finalUser.isModerator
        ? `🛡️ Sesión activa como Moderador: ${finalUser.name} (Radio: 5 km)`
        : `¡Bienvenido, ${finalUser.name}! (Radio: 1 km)`,
      'success'
    );
    triggerHaptic([80]);
    return true;
  };

  const logoutUser = () => {
    const loggedOut = { ...(userRef.current || HARDCODED_USERS[0]), isLoggedIn: false };
    userRef.current = loggedOut;
    setUser(loggedOut);
    localStorage.setItem('radar_urbano_user', JSON.stringify(loggedOut));
    setConfig((prev) => ({ ...prev, alertRadius: 1 }));
    _setActiveModal(null);
    showToast('Sesión cerrada correctamente', 'info');
  };

  const registerUser = ({ username, name, email, neighborhood, password, dni, phone }) => {
    const cleanUsername = (username || '').trim().toLowerCase().replace(/^@/, '');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      showToast('El nombre de usuario debe tener al menos 3 caracteres', 'warning');
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }

    if (!cleanName) {
      showToast('Ingresa tu nombre y apellido', 'warning');
      return { success: false, error: 'Ingresa tu nombre y apellido' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Ingresa un correo electrónico válido', 'warning');
      return { success: false, error: 'Ingresa un correo electrónico válido' };
    }

    if (!password || password.length < 4) {
      showToast('La contraseña debe tener al menos 4 caracteres', 'warning');
      return { success: false, error: 'La contraseña debe tener al menos 4 caracteres' };
    }

    // Verificar si el usuario o email ya existe
    const exists = allUsers.some(
      (u) =>
        u.username.toLowerCase() === cleanUsername ||
        (u.email && u.email.toLowerCase() === cleanEmail)
    );
    if (exists) {
      showToast('El nombre de usuario o correo ya está registrado', 'warning');
      return { success: false, error: 'El nombre de usuario o correo ya se encuentra registrado' };
    }

    const newUser = {
      username: cleanUsername,
      password: password.trim(),
      name: cleanName,
      email: cleanEmail,
      dni: dni ? dni.trim() : '',
      phone: phone ? phone.trim() : '',
      birthdate: '',
      neighborhood: neighborhood || 'Centro, Río Cuarto',
      role: 'user',
      isModerator: false,
      reactionsCount: 0,
      points: 20, // Puntos de bienvenida para incentivar la participación
      tier: 'bronce',
      avatar: '', // usa iniciales automáticas
      myCoupons: [],
      isLoggedIn: true
    };

    userRef.current = newUser;
    setUser(newUser);
    localStorage.setItem('radar_urbano_user', JSON.stringify(newUser));

    setAllUsers((prev) => {
      const nextList = [...prev.filter((u) => u.username.toLowerCase() !== cleanUsername), newUser];
      localStorage.setItem('radar_urbano_all_users', JSON.stringify(nextList));
      return nextList;
    });

    setConfig((prev) => ({ ...prev, alertRadius: 1 }));
    _setActiveModal(null);
    showToast(`¡Bienvenido a Radar Urbano, ${newUser.name}! Sumaste 20 pts de bienvenida`, 'success');
    triggerHaptic([100, 50, 100]);

    // Ofrecer el tutorial interactivo al nuevo usuario registrado
    setTimeout(() => {
      startTutorial(0);
    }, 1200);

    return { success: true };
  };

  const updateUserProfile = (updatedFields) => {
    if (!userRef.current?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para actualizar tus datos', 'warning');
      return;
    }
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      userRef.current = updated;
      localStorage.setItem('radar_urbano_user', JSON.stringify(updated));
      return updated;
    });
    showToast('Datos personales actualizados correctamente', 'success');
    triggerHaptic([60]);
  };

  const markReportResolved = (reportId) => {
    if (!userRef.current?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para solucionar reportes', 'warning');
      triggerHaptic([30]);
      return;
    }
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resuelto', isResolved: true } : r))
    );
    showToast('Reporte marcado como solucionado', 'success');
    triggerHaptic([60]);
  };

  const toggleReportResolved = (reportId) => {
    if (!userRef.current?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para gestionar estados de reportes', 'warning');
      triggerHaptic([30]);
      return;
    }
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const isNowResolved = !(r.status === 'resuelto' || r.isResolved);
          return {
            ...r,
            status: isNowResolved ? 'resuelto' : 'activo',
            isResolved: isNowResolved
          };
        }
        return r;
      })
    );
    showToast('Estado del reporte actualizado', 'info');
    triggerHaptic([40]);
  };

  // Edición de reporte exclusiva de Moderación
  const updateReport = (reportId, updatedFields) => {
    if (!userRef.current?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para editar reportes', 'warning');
      return;
    }
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updated = { ...r, ...updatedFields };
          if (updatedFields.type && CATEGORIES_CONFIG[updatedFields.type]) {
            const cat = CATEGORIES_CONFIG[updatedFields.type];
            updated.categoryName = cat.name;
            updated.color = cat.color;
            updated.badgeBg = cat.bg;
          }
          return updated;
        }
        return r;
      })
    );
    showToast('Reporte editado y guardado por Moderación', 'success');
    triggerHaptic([70]);
  };

  const deleteReport = (reportId) => {
    if (!userRef.current?.isLoggedIn) {
      setAuthView('login');
      _setActiveModal('auth');
      showToast('Debes iniciar sesión para eliminar reportes', 'warning');
      triggerHaptic([30]);
      return;
    }
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    showToast('Reporte eliminado de tu historial', 'info');
    triggerHaptic([40]);
  };

  const redeemPoints = (pointsCost, storeName, discount = '15% OFF') => {
    if (!userRef.current?.isLoggedIn) {
      showToast('Inicia sesión o regístrate para canjear puntos', 'warning');
      setAuthView('login');
      setActiveModal('auth');
      return;
    }
    if (user.points < pointsCost) {
      showToast('Puntos insuficientes para este canje', 'warning');
      return;
    }
    const newCoupon = {
      id: `cup-${Date.now()}`,
      store: storeName,
      discount: discount,
      code: `RADAR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('es-AR'),
      expires: 'Válido por 30 días'
    };
    setUser((prev) => ({
      ...prev,
      points: prev.points - pointsCost,
      myCoupons: [newCoupon, ...(prev.myCoupons || [])]
    }));
    showToast(`¡Cupón generado para ${storeName}! Código: ${newCoupon.code}`, 'success');
    triggerHaptic([80]);
  };

  // Navegador de pantallas Figma para mesa examinadora
  const jumpToFigmaScreen = (screenKey) => {
    setActiveModal(null);
    switch (screenKey) {
      case 'mapa':
        showToast('Vista 1: Mapa principal de Río Cuarto con pines activos', 'info');
        break;
      case 'reporte':
        setPendingLocation({ lat: -33.125, lng: -64.350, x: 50, y: 50 });
        setActiveModal('report');
        break;
      case 'confirmacion':
        setReportDescription('Sujeto sospechoso en la esquina');
        setActiveModal('confirm');
        break;
      case 'sos':
        setActiveModal('sos');
        triggerHaptic([200, 100, 200]);
        break;
      case 'comentarios':
        if (reports.length > 0) {
          setSelectedReportId(reports[0].id);
          setActiveModal('pinDetail');
        }
        break;
      case 'login':
        setAuthView('login');
        setActiveModal('auth');
        break;
      case 'registro':
        setAuthView('register');
        setActiveModal('auth');
        break;
      case 'recuperar':
        setAuthView('recover-1');
        setActiveModal('auth');
        break;
      case 'drawer':
        setActiveModal('drawer');
        break;
      case 'puntos':
        setActiveModal('points');
        break;
      case 'historial':
        setActiveModal('history');
        break;
      case 'datos':
        setActiveModal('personalData');
        break;
      case 'configuracion':
        setActiveModal('settings');
        break;
      default:
        break;
    }
  };

  const selectedReport = reports.find((r) => r.id === selectedReportId) || null;

  const defaultAlertRadius = user?.isModerator ? 5 : 1;
  const alertRadiusKm = Number(config.alertRadius) || defaultAlertRadius;

  // Reportes activos delimitados por la distancia configurada (<= alertRadiusKm)
  const activeReportsWithinRadius = reports.filter((r) => {
    const isResolved = r.status === 'resuelto' || r.isResolved;
    if (isResolved) return false;
    const rLat = r.lat ?? RIO_CUARTO_CENTER[0];
    const rLng = r.lng ?? RIO_CUARTO_CENTER[1];
    const dist = calculateDistanceKm(RIO_CUARTO_CENTER[0], RIO_CUARTO_CENTER[1], rLat, rLng);
    return dist <= alertRadiusKm;
  });

  return (
    <AppContext.Provider
      value={{
        reports,
        user,
        config,
        defaultAlertRadius,
        alertRadiusKm,
        activeReportsWithinRadius,
        calculateDistanceKm,
        RIO_CUARTO_CENTER,
        activeFilter,
        setActiveFilter,
        activeModal,
        setActiveModal,
        authView,
        setAuthView,
        selectedReportId,
        setSelectedReportId,
        selectedReport,
        pendingLocation,
        selectedCategory,
        setSelectedCategory,
        reportDescription,
        setReportDescription,
        reportPhoto,
        setReportPhoto,
        isAnonymous,
        setIsAnonymous,
        toasts,
        showToast,
        triggerHaptic,
        toggleTheme,
        toggleLeftHanded,
        setPinShape,
        setAlertRadius,
        setActiveNeighborhood,
        resetDemoData,
        startReportAtLocation,
        submitReportDraft,
        confirmAndPublishReport,
        validateReport,
        toggleReaction,
        calculateTier,
        addComment,
        loginUser,
        logoutUser,
        registerUser,
        redeemPoints,
        updateUserProfile,
        markReportResolved,
        toggleReportResolved,
        updateReport,
        allUsers,
        setAllUsers,
        HARDCODED_USERS,
        deleteReport,
        focusLocationTrigger,
        focusMapOn,
        jumpToFigmaScreen,
        centerTrigger,
        recenterMap,
        tutorialStep,
        setTutorialStep,
        startTutorial
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
}
