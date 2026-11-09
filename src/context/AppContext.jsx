import React, { createContext, useContext, useState, useEffect } from 'react';
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
          return parsed;
        }
      }
      return INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  // 2. Estado de Usuario (Carga uno de los 5 usuarios hardcodeados sin 'Fulano')
  const [user, setUser] = useState(() => {
    const fallbackUser = HARDCODED_USERS[0];
    try {
      const saved = localStorage.getItem('radar_urbano_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name !== 'Fulano') {
          return { ...fallbackUser, ...parsed };
        }
      }
      return fallbackUser;
    } catch {
      return fallbackUser;
    }
  });

  // 2.1 Base de usuarios registrados (inicia con HARDCODED_USERS y almacena nuevos registros)
  const [allUsers, setAllUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('radar_urbano_all_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= HARDCODED_USERS.length) {
          return parsed;
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

  // 5. Modales y Vistas Activas
  const [activeModal, setActiveModal] = useState(null); // 'report'|'confirm'|'success'|'sos'|'pinDetail'|'auth'|'drawer'|'points'|'settings'|'faq'
  const [authView, setAuthView] = useState('login'); // 'login'|'register'|'recover-1'|'recover-2'|'recover-3'|'recover-success'
  const [selectedReportId, setSelectedReportId] = useState(null);

  // 6. Flujo de Reporte
  const [pendingLocation, setPendingLocation] = useState({ lat: -33.125, lng: -64.350, x: 50, y: 50 });
  const [selectedCategory, setSelectedCategory] = useState('delito');
  const [reportDescription, setReportDescription] = useState('');
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
    setPendingLocation({ lat, lng, x, y });
    setActiveModal('report');
    triggerHaptic([50]);
  };

  const submitReportDraft = () => {
    if (!reportDescription.trim()) {
      showToast('Por favor describe brevemente la situación', 'warning');
      return;
    }
    setActiveModal('confirm');
  };

  const confirmAndPublishReport = () => {
    const cat = CATEGORIES_CONFIG[selectedCategory] || CATEGORIES_CONFIG.delito;
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
      reactions: 1,
      hasReacted: true,
      author: user.name,
      authorTier: user.tier,
      photo: '',
      comments: []
    };

    setReports((prev) => [newReport, ...prev]);
    setReportDescription('');
    setActiveModal('success');
    triggerHaptic([120, 80, 120]);

    setTimeout(() => {
      setActiveModal(null);
      showToast('¡Reporte publicado con éxito en la red vecinal!', 'success');
    }, 2200);
  };

  const toggleReaction = (reportId) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const nextReacted = !rep.hasReacted;
          const delta = nextReacted ? 1 : -1;
          const nextCount = rep.reactions + delta;

          // Reaccionar al autor
          setUser((u) => {
            const newTotal = Math.max(0, u.reactionsCount + delta);
            let nextTier = 'bronce';
            if (newTotal >= 20) nextTier = 'diamante';
            else if (newTotal >= 10) nextTier = 'oro';
            else if (newTotal >= 5) nextTier = 'plata';
            return { ...u, reactionsCount: newTotal, tier: nextTier };
          });

          return { ...rep, hasReacted: nextReacted, reactions: nextCount };
        }
        return rep;
      })
    );
    triggerHaptic([50]);
  };

  const addComment = (reportId, text) => {
    if (!text.trim()) return;
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            comments: [...rep.comments, { author: user.name, text: text.trim() }]
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
    setUser(finalUser);
    // Moderador default 5 km, demás usuarios default 1 km
    const roleRadius = finalUser.isModerator ? 5 : 1;
    setConfig((prev) => ({ ...prev, alertRadius: roleRadius }));
    setActiveModal(null);
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
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setConfig((prev) => ({ ...prev, alertRadius: 1 }));
    setActiveModal(null);
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

    setAllUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setConfig((prev) => ({ ...prev, alertRadius: 1 }));
    setActiveModal(null);
    showToast(`¡Bienvenido a Radar Urbano, ${newUser.name}! Sumaste 20 pts de bienvenida`, 'success');
    triggerHaptic([100, 50, 100]);
    return { success: true };
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('radar_urbano_user', JSON.stringify(updated));
      return updated;
    });
    showToast('Datos personales actualizados correctamente', 'success');
    triggerHaptic([60]);
  };

  const markReportResolved = (reportId) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resuelto', isResolved: true } : r))
    );
    showToast('Reporte marcado como solucionado', 'success');
    triggerHaptic([60]);
  };

  const toggleReportResolved = (reportId) => {
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
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    showToast('Reporte eliminado de tu historial', 'info');
    triggerHaptic([40]);
  };

  const redeemPoints = (pointsCost, storeName, discount = '15% OFF') => {
    if (!user.isLoggedIn) {
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
        toggleReaction,
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
        recenterMap
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
