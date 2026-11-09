# Arquitectura del Proyecto (React + Vite + Tailwind CSS) — Radar Urbano

## En una frase
Radar Urbano es una Single Page Application (SPA) colaborativa, Mobile-First y accesible desarrollada en **React + Vite** y **Tailwind CSS v3**, integrada con **Leaflet.js y OpenStreetMap** para que ciudadanos y estudiantes de Río Cuarto visualicen e informen situaciones de riesgo e infraestructura urbana en tiempo real, con botón de pánico SOS (Ley de Fitts con presión sostenida de 1.5s), gamificación comunitaria y persistencia en `localStorage`.

---

## Stack Tecnológico & UI
- **Framework & Tooling**: React 18/19 + Vite (compilación ultra rápida y modular).
- **Estructura Markup**: HTML5 Semántico estricto (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<dialog>`, `<footer>`, `<button>`).
- **Estilos & UI Framework**: Tailwind CSS v3 con paleta semántica oficial de Radar Urbano, soporte de Modo Oscuro/Claro (`class="dark"`), indicadores `:focus-visible` de alto contraste y clase de seguridad `.text-white`.
- **API de Mapas**: **Leaflet.js + OpenStreetMap (Proveedor Único)**, navegación táctil fluida (paneo, zoom, gestos de pinza), adaptación al modo oscuro mediante filtro CSS nativo sin cambiar de proveedor ni requerir claves, listener directo de toques en cualquier calle de Río Cuarto para disparar el Bottom Sheet de reporte, controles de re-centrado y pines dinámicos SVG.
- **Tipografías**: Google Fonts:
  - Marca & Logo: `Sedgwick Ave Display`
  - Interfaz, Formularios & Lectura: `Albert Sans`
- **APIs del Navegador**: Geolocation API, Vibration API (`navigator.vibrate`), LocalStorage API para persistencia de reportes, comentarios, usuarios y puntos.
- **Iconografía & Assets**: Lucide Icons / SVG semánticos nativos accesibles con `aria-hidden` y `aria-label`.

---

## Estructura Modular de Archivos (React + Vite)
```
efi/
├── index.html                  # HTML raíz con meta viewport mobile-first y Google Fonts
├── vite.config.js              # Configuración de Vite con plugin React
├── tailwind.config.js          # Tokens de color, tipografía y plugins de Tailwind
├── postcss.config.js           # PostCSS con autoprefixer y tailwindcss
├── package.json                # Dependencias (react, react-dom, tailwindcss, lucide-react)
├── src/
│   ├── main.jsx                # Punto de entrada de la aplicación React
│   ├── App.jsx                 # Componente orquestador SPA y gestión de estado global
│   ├── index.css               # Estilos globales, animaciones de pulso y variables
│   ├── components/
│   │   ├── Header.jsx          # Marca Sedgwick Ave, GPS status, theme toggle y perfil
│   │   ├── MapCanvas.jsx       # Leaflet + OpenStreetMap + listener directo + pines SVG de incidentes
│   │   ├── BottomSheetReport.jsx # Panel táctil inferior para seleccionar categoría y descripción
│   │   ├── ConfirmationModal.jsx # Modal paso 4: Reloj gigante "¿Está seguro?"
│   │   ├── SuccessModal.jsx    # Modal paso 5: Checkmark verde y auto-redirección
│   │   ├── PanicButton.jsx     # FAB SOS (presión 1.5s, Ley de Fitts, toggle zurdo/diestro)
│   │   ├── PanicSosScreen.jsx  # Pantalla crítica SOS con discados 100, 103, 107 y 911
│   │   ├── PinDetailsModal.jsx # InfoWindow con fotos, "Me sirvió" e hilo de comentarios
│   │   ├── AuthModal.jsx       # Login, Registro con DNI y Recuperación en 4 pasos (Figma)
│   │   ├── DrawerMenu.jsx      # Menú hamburguesa lateral (perfil, historial, canje, config)
│   │   ├── PointsModal.jsx     # Catálogo de beneficios locales (Kiosco la familia, Librería Univ.)
│   │   ├── SettingsModal.jsx   # Radio 5km, switch zurdo y formas accesibles de pines
│   │   └── FaqModal.jsx        # Guía de reporte y términos y condiciones
│   ├── context/
│   │   └── AppContext.jsx      # Estado persistente de reportes, usuario, tema y config
│   └── data/
│       └── initialReports.js   # Datos iniciales geolocalizados en Río Cuarto
├── docs/
│   └── contexto/               # Master Context canónico sincronizado
│       ├── arquitectura.md
│       ├── convenciones.md
│       ├── decisiones.md
│       ├── glosario.md
│       ├── flujo-de-trabajo.md
│       └── errores-conocidos.md
└── .agents/
    ├── memory/
    │   └── engram_memory.json  # Memoria viva del proyecto Radar Urbano
    └── rules/
        └── antigravity_rules.md
```

---

## Mapeo del Prototipo de Figma (42 Pantallas)

| Pantallas Figma | Componente React | Responsabilidad & Interacción |
| :--- | :--- | :--- |
| **Págs. 1, 10, 15, 22, 27, 35, 39** | `Header.jsx` + Splash | Marca urbana *Sedgwick Ave Display*, estado GPS, theme toggle y contador dinámico de alertas. |
| **Págs. 2, 11, 16, 23, 28, 36, 40** | `MapCanvas.jsx` | Google Maps con estilo oscuro, calles de Río Cuarto (Dr. Rodríguez, Río Segundo, 11 de Noviembre), Kiosco la familia, beacon de usuario y pines dinámicos. |
| **Págs. 3, 4, 5, 7** | `BottomSheetReport.jsx` | Flujo de reporte: al tocar el mapa se fija la coordenada y se despliega el panel inferior para elegir categoría y escribir descripción. |
| **Pág. 8** | `ConfirmationModal.jsx` | Modal de prevención de error con icono de reloj gigante "¿Está seguro que desea enviar el reporte? [Confirmar] [Cancelar]". |
| **Pág. 9** | `SuccessModal.jsx` | Feedback de éxito con tilde verde y vibración háptica (`navigator.vibrate([100])`). |
| **Pág. 25** | `PanicButton.jsx` | FAB flotante SOS de 68px (Ley de Fitts), con activación por presión sostenida de 1.5s y toggle para zurdos (Persona 3). |
| **Pág. 26** | `PanicSosScreen.jsx` | Pantalla crítica SOS con números de auxilio directo: Bomberos (100), Defensa Civil (103), Médicas (107), Policía (911) y botón cancelar. |
| **Págs. 30, 31, 32, 34** | `PinDetailsModal.jsx` | Tarjeta del pin con fotos, botón vecinal *"Me sirvió"*, aumento reactivo de reputación e hilo de comentarios. |
| **Págs. 6, 12, 13, 14, 17, 33, 37, 41** | `AuthModal.jsx` | Flujo completo de acceso: Iniciar sesión, Registro con DNI/Fecha, y Recuperación en 4 pasos (Email, Código 4 dígitos, Nueva contraseña, Confirmación). |
| **Págs. 38, 42** | `DrawerMenu.jsx` | Menú lateral conmutado por estado de login, perfil con marco de reputación (Bronce, Plata, Oro, Diamante) y accesos directos (móvil). |
| **Sección Historial** | `HistoryModal.jsx` | Historial de alertas propias y de Río Cuarto, filtros por estado (activo/resuelto), centrado en mapa (`focusMapOn`) y resolución directa. |
| **Sección Perfil** | `PersonalDataModal.jsx` | Gestión de datos personales del vecino (DNI, Teléfono, Barrio de Río Cuarto), barra de progreso hacia siguiente nivel de reputación y persistencia local. |
| **Sección Servicios / Puntos** | `PointsModal.jsx` | Catálogo de descuentos en comercios locales (Kiosco la familia, Librería Universitaria, Farmacia Grassi, Café del Río) y billetera de cupones activos con copiado de código. |
| **Sección Ajustes** | `SettingsModal.jsx` | Slider de radio preventivo (1-15 km), barrio activo, modo zurdos, geometría de pines para daltonismo y reseteo de datos demo. |
| **Navegación Desktop** | `Header.jsx` | Navbar horizontal en `>= md` (`Mapa`, `Historial`, `Puntos`, `Datos Personales`, `Configuración`) suprimiendo el menú hamburguesa en desktop. |
