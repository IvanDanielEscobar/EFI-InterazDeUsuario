# 🚨 Radar Urbano — Red Vecinal de Prevención

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-HOT-7EBC6F?logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA-blue)](https://www.w3.org/WAI/WCAG21/quickref/)

Single Page Application (SPA) colaborativa, Mobile-First y de accesibilidad estricta (WCAG AA), diseñada para la prevención ciudadana, señalización geolocalizada de incidencias urbanas y auxilio comunitario inmediato en la ciudad de **Río Cuarto, Córdoba**.

---

## 👨‍💻 Integrantes del Grupo
Proyecto desarrollado para la Cátedra de **Interfaz de Usuario (Evaluación Final Integradora - EFI)** — *Tecnicatura Superior en Desarrollo de Software*, **ITEC Río Cuarto**:

- **Escobar Ivan**
- **Ibarra Matias**
- **Garay Santiago**
- **Villavicencio Jonatan**

---

## 🎯 Propósito y Visión de Producto
Radar Urbano transforma la seguridad ciudadana en una red colaborativa, accesible, intuitiva y de rápida respuesta:
- **Visualización en Tiempo Real**: Incidentes geolocalizados en el plano cartográfico de Río Cuarto categorizados por nivel de severidad.
- **Simbología Geométrica Universal**: Cada tipo de alerta cuenta con una forma geométrica SVG única para personas con daltonismo o dificultades visuales.
- **Reportes Anónimos y Evidencia Fotográfica**: Protección total de la identidad del denunciante en situaciones de riesgo personal, con soporte de fotos comprimidas en el cliente.
- **Botón de Pánico SOS Ergonómico**: Presión sostenida de 1.5s (Ley de Fitts) con respuesta háptica y conexión directa a servicios de auxilio (911, 107, 103, 100).
- **Geocerca Dinámica por Rol**: Radio geodésico diferenciado (1 km para vecinos de a pie, 5 km para supervisión institucional de moderadores).
- **Gamificación Cívica**: Sistema de reputación barrial por validaciones comunitarias y canje de cupones de descuento en comercios adheridos.
- **Guardas de Autenticación & Modo Invitado**: Opciones privadas reservadas a usuarios logueados, con interceptación guiada y amable para invitados.

---

## 👥 Cuentas de Demostración y Roles Preconfigurados


| Usuario (`username`) | Contraseña | Rol en la Red | Radio Inicial | Puntos & Rango | Avatar / Identidad |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **`ivan`** | `ivan123` | Vecino Ciudadano | **1 km** | 120 pts (Oro) | Iniciales **IE** en insignia ámbar |
| **`matias`** | `matias123` | Vecino Ciudadano | **1 km** | 70 pts (Plata) | Iniciales **MI** en insignia ámbar |
| **`santiago`** | `santiago123` | Vecino Ciudadano | **1 km** | 45 pts (Bronce) | Iniciales **SG** en insignia ámbar |
| **`jonatan`** | `jonatan123` | Vecino Ciudadano | **1 km** | 95 pts (Oro) | Iniciales **JV** en insignia ámbar |
| **`moderador`** | `moderador123` | **Moderador Oficial** | **5 km** | 500 pts (Diamante) | Insignia índigo con escudo 🛡️ |

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

# 3. Iniciar servidor de desarrollo 
npm run dev

# 4. Compilar para producción
npm run build

# 5. Previsualizar la compilación de producción
npm run preview
```

---

## 🌟 Funcionalidades y Principios de Diseño

### 1. Simbología Geométrica Universal por Categoría (WCAG AA 1.4.1)
Para garantizar la accesibilidad de usuarios con daltonismo (protanopía, deuteranopía, tritanopía) o baja visión, cada categoría de reporte posee una **forma geométrica SVG única**, evitando depender únicamente del color:
- 🔷 **Robo / Delito**: Rombo / Diamante en tonos carmesí.
- ⚠️ **Persona Sospechosa**: Triángulo de advertencia en tonos ámbar.
- 🟡 **Luminaria Rota**: Círculo solar en tonos amarillos.
- 🟫 **Baldío Peligroso**: Cuadrado en tonos tierra/naranja.
- 🟣 **Violencia / Acoso**: Pentágono en tonos violeta.
- 🟢 **Resuelto / Solucionado**: Hexágono gris pizarra con tilde de verificación verde esmeralda (`✓`).

### 2. Publicación de Reportes Anónimos y Evidencia Fotográfica
- **Modo Anónimo ("Vecino Anónimo")**: Switch de protección accesible en el formulario de reporte que oculta el nombre, avatar y rango del usuario ante situaciones delictivas delicadas, preservando internamente el identificador para la pestaña personal *"Mis Reportes"*.
- **Carga y Compresión de Fotos**: Input de archivos nativo con procesamiento en cliente vía Canvas HTML5 (redimensionado a max 800px a calidad JPEG óptima), permitiendo adjuntar evidencia fotográfica sin saturar el almacenamiento de `localStorage`.

### 3. Botón de Pánico SOS & Ergonomía para Zurdos Integral (Ley de Fitts)
- **Activación Segura de 1.5 Segundos**: Presión sostenida con anillo SVG de progreso visual y vibración háptica continua (`navigator.vibrate`) para erradicar falsos positivos.
- **Modo para Zurdos Completo**: Conmutador que no solo traslada el botón SOS a la izquierda y el dock a la derecha, sino que además **invierte el orden interno de los segmentos** `[Agregar Alerta | Referencias]` y alinea el panel emergente para una navegación perfecta con el pulgar de la mano izquierda.
- **Pantalla de Auxilio Directo**: Enlace telefónico directo a Policía (911), Bomberos (100), Defensa Civil (103) y Emergencias Médicas (107).

### 4. Historial de Reportes con Filtrado por Categoría y Acento Cromático
- **Filtros por Tipo de Incidente**: Pestañas de acceso rápido (*Todos*, *Robo/Delito*, *Sospechoso*, *Luminaria*, *Baldío*, *Violencia*).
- **Cards Espaciadas y Diferenciadas**: Cada tarjeta adopta un fondo y borde con acento de color distintivo de su categoría para una lectura rápida y descanso visual.
- **Gestión Comunitaria**: Marcado de resolución comunitaria con tilde verde, edición de incidentes por su autor o por el moderador, e hilo vecinal de comentarios y agradecimientos.

### 5. Cartografía Libre, Resiliente y Modo Oscuro (Leaflet + OpenStreetMap HOT)
- **Proveedor Único Open Source**: Sin costos ni dependencias de API Keys propietarias.
- **Filtro Cartográfico Modo Oscuro**: Inversión tonal adaptativa para patrullaje nocturno sin deslumbramiento.
- **Geocerca Geodésica (Haversine)**: Cálculo geodésico exacto tomando como referencia el centro neurálgico de Río Cuarto (Plaza Roca `[-33.1245, -64.3492]`). Radio dinámico de 1 km para vecinos y 5 km para moderadores (configurable hasta 15 km).

### 6. Gamificación Vecinal & Canje de Cupones
- **Niveles de Reputación**: Bronce, Plata, Oro y Diamante acumulables por validaciones comunitarias ("Me sirvió").
- **Comercios Locales Adheridos**: Catálogo de cupones de descuento barriales con generación de códigos alfanuméricos copiables al portapapeles.

### 7. Formulario de Autenticación Limpio & Políticas de Privacidad
- **Blindaje Anti-Autofill**: Entradas de usuario y contraseña limpias sin credenciales preescritas ni autocompletados invasivos.
- **Preguntas Frecuentes y Términos**: Modal con respuestas a dudas habituales sobre funcionamiento del radar, geocerca, canje de puntos y política de privacidad de reportes anónimos.

---

## 📂 Estructura del Proyecto

```
efi/
├── index.html                   # HTML semántico, meta tags y tipografías Sedgwick Ave & Albert Sans
├── vercel.json                  # Configuración de despliegue SPA y headers de caché
├── package.json                 # Scripts y dependencias (React 18, Vite 5, Leaflet, Lucide)
├── tailwind.config.js           # Tokens de diseño, colores semánticos y breakpoints
├── src/
│   ├── main.jsx                 # Punto de entrada de la aplicación React
│   ├── App.jsx                  # Layout principal, subheader geodésico y centro de toasts
│   ├── components/
│   │   ├── Header.jsx           # Navbar superior con guardas de autenticación y selector de tema
│   │   ├── MapCanvas.jsx        # Lienzo Leaflet, marcadores SVG geométricos y dock flotante
│   │   ├── PanicButton.jsx      # FAB SOS con retención de 1.5s y guardas para invitados
│   │   ├── PanicSosScreen.jsx   # Pantalla crítica de emergencias (911, 107, 103, 100)
│   │   ├── BottomSheetReport.jsx# Flujo de reporte en 2 pasos con modo anónimo y fotos
│   │   ├── ConfirmationModal.jsx# Confirmación previa a la publicación de la alerta
│   │   ├── SuccessModal.jsx     # Confirmación de reporte emitido con animación
│   │   ├── PinDetailsModal.jsx  # Ficha técnica del incidente, hilo vecinal y resolución
│   │   ├── HistoryModal.jsx     # Historial de alertas con filtrado por categoría y cards cromáticas
│   │   ├── PointsModal.jsx      # Catálogo de cupones y canje de puntos barriales
│   │   ├── PersonalDataModal.jsx# Gestión de perfil vecinal, DNI, teléfono y barrio
│   │   ├── SettingsModal.jsx    # Ajuste de radio geodésico y ergonomía para zurdos
│   │   ├── FaqModal.jsx         # Preguntas frecuentes, términos y privacidad de datos
│   │   ├── DrawerMenu.jsx       # Menú lateral responsive diferenciado para invitado/logueado
│   │   ├── AuthModal.jsx        # Login limpio, registro vecinal y recuperación de contraseña
│   │   └── UserAvatar.jsx       # Avatar inteligente con generación de iniciales y rangos
│   ├── context/
│   │   └── AppContext.jsx       # Estado global, persistencia en localStorage y guardas de seguridad
│   └── data/
│       ├── initialReports.js    # 23 incidentes urbanos reales en Río Cuarto
│       └── users.js             # 5 usuarios preconfigurados y utilidades de avatar
└── docs/
    └── contexto/                # Master Context y Documentación Viva de Ingeniería
        ├── arquitectura.md      # Arquitectura en capas, flujo de datos y patrones
        ├── decisiones.md        # Registro de Decisiones de Arquitectura (ADR)
        ├── convenciones.md      # Estándares de código, nomenclatura y Git
        ├── glosario.md          # Reglas de negocio y términos del dominio
        ├── flujo-de-trabajo.md  # Pipelines, DoD y comandos frecuentes
        └── errores-conocidos.md # Bitácora de incidencias resueltas y contingencias
```

---

## ♿ Accesibilidad y Calidad de Código (Definition of Done)
- **Contraste WCAG AA**: Relación de contraste mínima garantizada de 4.5:1 para texto normal y 3:1 para componentes interactivos y formas cartográficas.
- **Los 5 Estados Obligatorios**: Todos los elementos interactivos definen y responden a sus 5 estados: `Default`, `Hover`, `Active`, `Focus-visible` (anillo visible) y `Disabled`.
- **Navegación Integral por Teclado**: Soporte completo con <kbd>Tab</kbd>, activación con <kbd>Enter</kbd> / <kbd>Espacio</kbd> y cierre modal accesible con <kbd>Escape</kbd>.
- **Zero Cruft**: Cero advertencias de compilación, cero `console.log` de depuración y código limpio validado en producción.

---

## 📜 Licencia y Reconocimientos
Desarrollado con orgullo por **Escobar Ivan**, **Ibarra Matias**, **Garay Santiago** y **Villavicencio Jonatan** para la Cátedra de **Interfaz de Usuario (EFI)** — *Tecnicatura Superior en Desarrollo de Software*, ITEC Río Cuarto.
- **Cartografía**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, Humanitarian OpenStreetMap Team (HOT).
- **Tipografías**: Google Fonts (*Sedgwick Ave Display* & *Albert Sans*).
- **Iconografía**: [Lucide Icons](https://lucide.dev/).
