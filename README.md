# 🚨 Radar Urbano — Red Vecinal de Prevención en Tiempo Real (Río Cuarto)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-HOT-7EBC6F?logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)

Single Page Application (SPA) colaborativa, Mobile-First y de alta accesibilidad diseñada para la prevención del delito, señalización de incidencias urbanas y asistencia comunitaria inmediata en la ciudad de **Río Cuarto, Córdoba**.

---

## 👨‍💻 Integrantes del Grupo
Proyecto desarrollado para la Cátedra de **Interfaz de Usuario (Evaluación Final Integradora - EFI)** — *Tecnicatura Superior en Desarrollo de Software*, **ITEC Río Cuarto**:

- **Escobar Ivan**
- **Ibarra Matias**
- **Garay Santiago**
- **Villavicencio Jonatan**

---

## 🎯 Propósito y Visión de Producto
Radar Urbano transforma la seguridad ciudadana en una experiencia colaborativa, intuitiva y solidaria. Permite a vecinos y estudiantes universitarios (especialmente en horarios nocturnos en torno al campus de la UNRC y el centro urbano):
- **Visualizar amenazas e incidentes en tiempo real** geolocalizados en el plano urbano de Río Cuarto.
- **Accionar un Botón de Pánico SOS** con presión sostenida de 1.5s para evitar falsos positivos y contactar inmediatamente a las fuerzas de seguridad y emergencias (911, 107, 103, 100).
- **Controlar el perímetro de alertas activas** adaptado dinámicamente según el rol del usuario (1 km para vecinos de a pie, 5 km para supervisión institucional de moderadores).
- **Gamificación cívica**: Obtener puntos de reputación vecinal por alertas verificadas y canjear cupones de descuento en comercios barriales adheridos.

---

## 👥 Cuentas de Demostración y Roles Preconfigurados

El sistema incluye 5 usuarios precargados listos para pruebas inmediatas, sin contraseñas preescritas en los formularios para garantizar una autenticación limpia:

| Usuario (`username`) | Contraseña | Rol en la Red | Radio Default | Puntos & Rango | Nivel / Avatar |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **`ivan`** | `ivan123` | Vecino Ciudadano | **1 km** | 120 pts (Oro) | Iniciales **IE** en insignia ámbar |
| **`matias`** | `matias123` | Vecino Ciudadano | **1 km** | 70 pts (Plata) | Iniciales **MI** en insignia ámbar |
| **`santiago`** | `santiago123` | Vecino Ciudadano | **1 km** | 45 pts (Bronce) | Iniciales **SG** en insignia ámbar |
| **`jonatan`** | `jonatan123` | Vecino Ciudadano | **1 km** | 95 pts (Oro) | Iniciales **JV** en insignia ámbar |
| **`moderador`** | `moderador123` | **Moderador Oficial** | **5 km** | 500 pts (Diamante) | Insignia índigo con escudo 🛡️ |

> **Nota de Seguridad & Privacidad**:
> - Los inputs del formulario de Inicio de Sesión y Registro están **completamente limpios** por defecto.
> - Nuevos vecinos pueden darse de alta autónomamente mediante el formulario de **Registro Vecinal**, recibiendo automáticamente **20 puntos de bienvenida**.
> - En caso de no tener foto de perfil cargada, el avatar genera dinámicamente las iniciales tipográficas del usuario.

---

## 🚀 Despliegue en Vercel

El proyecto está 100% optimizado para despliegue instantáneo en **Vercel**:

### Opción A: Despliegue con 1 Clic desde GitHub
1. Sube este repositorio a tu cuenta de **GitHub**.
2. Ingresa a [vercel.com](https://vercel.com) y pulsa **"Add New Project"**.
3. Importa el repositorio `radar-urbano`.
4. Vercel detectará automáticamente la configuración gracias a [`vercel.json`](file:///home/iescobar/itec/3ero/ui/efi/vercel.json):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Haz clic en **Deploy**. ¡Tu aplicación estará en línea en segundos!

### Opción B: Despliegue mediante Vercel CLI
```bash
# 1. Instalar Vercel CLI globalmente (si no lo tienes)
npm install -g vercel

# 2. Iniciar sesión y desplegar
vercel

# 3. Para producción
vercel --prod
```

### Configuración Incluida ([`vercel.json`](file:///home/iescobar/itec/3ero/ui/efi/vercel.json))
- **SPA Rewrites**: Redirección universal `/(.*) -> /index.html` para soportar navegación y modales sin errores 404.
- **Cache-Control Inmutable**: Caché de 1 año (`max-age=31536000, immutable`) en `/assets/` para carga instantánea.

---

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** v18 o superior.
- **npm** v9 o superior.

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd efi

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo en puerto 3000
npm run dev

# 4. Compilar para producción
npm run build

# 5. Previsualizar la compilación de producción
npm run preview
```

---

## 🌟 Funcionalidades y Principios de Diseño

### 1. Botón de Pánico SOS Ergonómico (Ley de Fitts)
- **Presión sostenida de 1.5 segundos** con anillo de progreso SVG y vibración háptica continua para evitar llamadas accidentales.
- **Conmutador para Zurdos**: Permite alternar la ubicación del dock flotante entre la esquina inferior derecha o izquierda.
- **Pantalla de Emergencia Inmediata**: Acceso telefónico directo a Policía (911), Bomberos (100), Defensa Civil (103) y Emergencias Médicas (107).

### 2. Cartografía Libre y Resiliente (OpenStreetMap HOT + Leaflet)
- **100% Gratuito y Open Source**: Sin dependencia de API Keys pagas de Google Maps ni límites de cuota de CARTO.
- **Modo Oscuro Integrado**: Filtro CSS cartográfico nativo (`invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)`) que garantiza óptima legibilidad nocturna sin deslumbramiento.
- **Pines Semánticos**: Formas accesibles (Círculo, Triángulo, Cuadrado) para usuarios con daltonismo.

### 3. Geocerca y Filtrado Geodésico por Distancia
- Cálculo de distancias mediante la **fórmula de Haversine** tomando como punto cero la Plaza Roca de Río Cuarto (`[-33.1245, -64.3492]`).
- Geocerca visual translúcida (`L.circle`) proyectada en el mapa.
- **Radio Dinámico por Rol**:
  - **Vecinos**: 1 km predeterminado (entorno caminable inmediato).
  - **Moderador**: 5 km predeterminado (cobertura total de la planta urbana y UNRC).
  - Configurable libremente de 1 a 15 km desde el panel de Ajustes.

### 4. Diferenciación Visual de Incidentes
- **Alertas Activas**: Fondo cromático según categoría (Delito, Sospechoso, Luminaria, Baldío, Semáforo) con indicador `!` rojo y animación de pulso titilante (`animate-ping`).
- **Alertas Solucionadas**: Fondo gris pizarra neutro (`bg-slate-500`) con tilde de verificación verde esmeralda (`✓`), sin estrés visual.

### 5. Herramientas de Moderación Oficial
- El usuario `moderador` puede **editar cualquier reporte** (título, descripción, categoría, estado) y alternar entre *Activo* y *Solucionado*.

### 6. Notificaciones Toast Centradas
- Mensajes flotantes equilibrados en el eje medio superior (`top-5 left-1/2 -translate-x-1/2`) con transiciones suaves y soporte de accesibilidad `aria-live="polite"`.

---

## 📂 Estructura del Proyecto

```
efi/
├── index.html                   # HTML semántico y tipografías Sedgwick Ave & Albert Sans
├── vercel.json                  # Configuración de despliegue SPA y caché para Vercel
├── package.json                 # Scripts y dependencias (React 18, Vite, Leaflet, Lucide)
├── tailwind.config.js           # Tokens semánticos de color, dark mode y tipografía
├── src/
│   ├── main.jsx                 # Entrada de la SPA React
│   ├── App.jsx                  # Orquestador principal, subheader geodésico y toasts
│   ├── components/
│   │   ├── Header.jsx           # Navegación fija, selector de usuario y logout desktop
│   │   ├── MapCanvas.jsx        # Lienzo Leaflet, geocerca circular y dock flotante
│   │   ├── PanicButton.jsx      # FAB SOS con presión sostenida 1.5s
│   │   ├── PanicSosScreen.jsx   # Pantalla crítica de emergencias (911, 107, 103, 100)
│   │   ├── BottomSheetReport.jsx# Flujo de creación de alerta en 2 pasos
│   │   ├── PinDetailsModal.jsx  # Detalle del incidente, validaciones e hilo vecinal
│   │   ├── AuthModal.jsx        # Login limpio y formulario completo de registro vecinal
│   │   ├── HistoryModal.jsx     # Historial de alertas con vista de moderador
│   │   ├── PersonalDataModal.jsx# Datos personales y carga de imagen/iniciales
│   │   ├── PointsModal.jsx      # Canje de puntos en comercios locales adheridos
│   │   ├── SettingsModal.jsx    # Slider de radio, ergonomía zurda y formas de pines
│   │   └── UserAvatar.jsx       # Avatar inteligente con soporte de iniciales y rangos
│   ├── context/
│   │   └── AppContext.jsx       # Estado global, Haversine, persistencia y autenticación
│   └── data/
│       ├── initialReports.js    # 23 incidentes reales distribuidos en Río Cuarto
│       └── users.js             # 5 usuarios base y generador de iniciales
└── docs/
    └── contexto/                # Master Context y Decisiones de Arquitectura (ADR)
        ├── arquitectura.md
        ├── decisiones.md        # Registro vivo de 31 Decisiones de Arquitectura (ADR)
        ├── convenciones.md
        ├── glosario.md
        └── flujo-de-trabajo.md
```

---

## ♿ Accesibilidad y Calidad (DoD)
- **Contraste WCAG AA**: Relación de contraste mínima de 4.5:1 para textos y 3:1 para controles interactivos.
- **Los 5 Estados Obligatorios**: Todos los botones e inputs definen explícitamente sus estados `Default`, `Hover`, `Active`, `Focus-visible` (con outline nítido) y `Disabled`.
- **Navegación por Teclado**: Soporte completo para navegación con tecla <kbd>Tab</kbd>, activación con <kbd>Enter</kbd> y cierre de modales con <kbd>Escape</kbd>.

---

## 📜 Licencia y Créditos
Desarrollado por **Escobar Ivan**, **Ibarra Matias**, **Garay Santiago** y **Villavicencio Jonatan** para la Cátedra de **Interfaz de Usuario (EFI)** — *Tecnicatura Superior en Desarrollo de Software*, ITEC Río Cuarto.
- **Cartografía**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, Humanitarian OpenStreetMap Team (HOT).
- **Tipografías**: Google Fonts (*Sedgwick Ave Display* & *Albert Sans*).
- **Iconografía**: [Lucide Icons](https://lucide.dev/).
