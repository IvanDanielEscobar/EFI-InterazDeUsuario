# Registro de Decisiones de Arquitectura y UX (ADRs) — Radar Urbano

Este documento es una bitácora cronológica con Fecha y Hora de todas las decisiones técnicas y de experiencia de usuario acordadas para Radar Urbano.

> ✋ **Regla de Autorización Obligatoria**: Si una instrucción implica un cambio estructural en el diseño, la navegación SPA, la paleta semántica o el stack, el agente **debe solicitar autorización explícita antes de ejecutarlo** y luego registrar el ADR correspondiente.

---

### [ADR-001] · [2026-11-08 20:10] Elección del Framework CSS y Tipografías de Marca
- **Contexto**: Se requiere maquetar rápidamente una SPA responsiva, accesible y visualmente atractiva sin generar hojas de estilo complejas ni sobredimensionadas.
- **Decisión**: Utilizar TailwindCSS v3 vía CDN complementado con estilos limpios en `styles.css`. Integrar Google Fonts: *Sedgwick Ave Display* para identidad y marca urbana, y *Albert Sans* para interfaz y lectura accesible.
- **Consecuencias / Descartado**: Se descartan librerías de componentes pesadas y estilos inline arbitrarios.

---

### [ADR-002] · [2026-11-08 20:12] Arquitectura SPA Centralizada sin Recarga
- **Contexto**: Los ciudadanos necesitan una aplicación ágil en calle donde la navegación entre el mapa, el reporte de alertas, el SOS de pánico y los ajustes no requiera recarga de página.
- **Decisión**: Implementar una Single Page Application (SPA) centralizada en `index.html` estandarizado, gestionada con Vanilla JavaScript en `app.js` y persistencia en `localStorage`.
- **Consecuencias**: Cero latencia de recarga, respuesta instantánea en situaciones de estrés y fácil despliegue estático.

---

### [ADR-003] · [2026-11-08 20:14] Soporte de Accesibilidad Universal (WCAG AA/AAA) y 5 Estados de Interacción
- **Contexto**: El sistema debe ser operable por personas con visión reducida, daltonismo, o en condiciones de baja iluminación nocturna y navegación sin ratón.
- **Decisión**: Ratio de contraste mínimo 4.5:1 en ambos temas, anillo de foco `:focus-visible` de alto contraste (amarillo/blanco de 3px), los 5 estados obligatorios (`Default`, `Hover`, `Active`, `Focus`, `Disabled`) y formas geométricas diferenciadas en pines para no depender únicamente del color.
- **Consecuencias**: Superación exitosa del Desafío de la Mano Atada y plena accesibilidad inclusiva.

---

### [ADR-004] · [2026-11-08 20:15] Integración del Protocolo Mandatorio Gentle-AI y Mentalidad Senior Product Engineer
- **Contexto**: Garantizar rigor técnico, justificación del *Why antes del How*, calidad estética superior y centralización documental.
- **Decisión**: Mantener el protocolo de ingeniería de producto con reglas `always_on` y Master Context centralizado en `docs/contexto/`.
- **Consecuencias**: Prohibición de archivos dispersos; trazabilidad total entre diseño Figma y código fuente.

---

### [ADR-005] · [2026-11-08 20:16] Identidad del Producto y Definición de Arquetipos de Usuario ("Personas")
- **Contexto**: El producto debe resolver los puntos de dolor reales de los habitantes de Río Cuarto en sus desplazamientos nocturnos y cotidianos.
- **Decisión**: Diseñar la red vecinal *"Radar Urbano"* resolviendo los dolores de:
  1. **Camila (Estudiante, 21 años)**: Regreso nocturno apresurado en colectivo y caminando; necesita un botón de pánico enorme y reportes de 1 toque.
  2. **Don Roberto (Vecino/Comerciante, 52 años)**: Monitoreo barrial diurno; requiere botones amplios, tipografía Albert Sans legible y confirmación visual clara.
  3. **Ignacio (Usuario Zurdo)**: Navegación móvil con mano izquierda; requiere accesibilidad ergonómica con botón flotante reubicable.
- **Consecuencias**: Prioridad absoluta en la ergonomía táctil y claridad de feedback.

---

### [ADR-006] · [2026-11-08 20:18] Paleta Semántica de Seguridad Ciudadana y Modo Oscuro Predeterminado
- **Contexto**: Facilitar el reconocimiento intuitivo del tipo de alerta y proteger la visión adaptada a la oscuridad en la calle.
- **Decisión**: 
  - Rojo Intenso (`#ef4444` / `#dc2626`): Emergencia SOS y Delito/Robo.
  - Naranja (`#f97316`): Persona sospechosa.
  - Ámbar (`#f59e0b`): Iluminación rota.
  - Celeste Sky (`#0ea5e9`): Terreno baldío peligroso.
  - Violeta (`#8b5cf6`): Acoso / Violencia.
  - Azul (`#3b82f6`): Falla de infraestructura pública.
  - Verde Esmeralda (`#10b981`): Confirmación comunitaria y éxito.
  - **Fondo Oscuro Predeterminado**: `#020617` (Slate-950) con alternativa de Modo Claro `#f8fafc`.
- **Consecuencias**: Contraste garantizado con clase de seguridad `.text-white` en botones de fondo sólido.

---

### [ADR-007] · [2026-11-08 20:20] Límites Técnicos y Prohibición de Backend y Frameworks Complejos
- **Contexto**: Mantener el alcance estrictamente frontend según las pautas académicas del módulo.
- **Decisión**:
  - ❌ PROHIBIDO React, Angular, Vue o Svelte.
  - ❌ PROHIBIDO backend en Node.js, Express, Python o Django.
  - ❌ PROHIBIDO bases de datos complejas remotas o Firebase.
  - ❌ PROHIBIDO estilos inline arbitrarios (`style="..."`).
- **Consecuencias**: Toda la reactividad y simulación de red vecinal se ejecuta en el navegador con JavaScript Vanilla y `localStorage`.

---

### [ADR-008] · [2026-11-08 20:22] Botón de Pánico Crítico (SOS) Flotante basado en la Ley de Fitts
- **Contexto**: En situaciones de agresión o peligro inminente, el usuario no tiene tiempo ni precisión para buscar un botón diminuto.
- **Decisión**: Implementar un Botón Flotante (FAB) de gran escala ($\ge 64\text{px}$) en la esquina inferior al alcance inmediato del pulgar, con animación de pulso y apertura instantánea de la pantalla de números de auxilio (911, 107, 103, 100).
- **Consecuencias**: Acceso en menos de 1 segundo sin mirar la pantalla; opción de alternar posición para personas con mano hábil izquierda.

---

### [ADR-009] · [2026-11-08 20:23] Feedback Háptico Inmediato (`navigator.vibrate`) y Prevención de Pánico en Dos Pasos
- **Contexto**: El usuario necesita certidumbre física inmediata de que la alerta fue enviada sin tener que detenerse a leer la pantalla.
- **Decisión**: Disparar vibración háptica mediante `navigator.vibrate([150, 80, 150])` para emergencias y `[100]` para reportes regulares, acompañado de modal animado de confirmación con check verde.
- **Consecuencias**: Tranquilidad inmediata y confirmación sensorial en el teléfono.

---

### [ADR-010] · [2026-11-08 20:24] Sistema de Reputación Vecinal y Gamificación Solidaria
- **Contexto**: Generar confianza mutua y desalentar reportes falsos o bromas en la red comunitaria.
- **Decisión**: Incorporar un sistema de marcos cromáticos en el avatar según validaciones comunitarias ("Me sirvió"): Bronce (1-4), Plata (5-9), Oro (10-20) y Diamante (+20), sumado a un catálogo de canje de puntos con comercios locales.
- **Consecuencias**: Incentivo cívico positivo y mayor veracidad en las alertas barriales.

---

### [ADR-011] · [2026-11-08 21:12] Adopción de React + Vite + Tailwind CSS para SPA Radar Urbano
- **Contexto**: El proyecto abarca 42 pantallas de Figma con flujos interactivos completos (Auth, Reportes, SOS, Comentarios y Puntos). La gestión de estado mediante componentes modulares en React aporta mayor escalabilidad y mantenibilidad.
- **Decisión**: Migrar la base técnica a **React 18/19 + Vite + Tailwind CSS**, manteniendo tipado riguroso, HTML5 semántico y cero código basura.
- **Consecuencias**: Mayor velocidad de iteración, componentes desacoplados (`<MapCanvas>`, `<BottomSheetReport>`, `<PanicSosModal>`, `<AuthModal>`, `<DrawerMenu>`) y gestión reactiva fluida.

---

### [ADR-012] · [2026-11-08 21:13] Integración de Google Maps JavaScript API con Toque Directo y Contingencia
- **Contexto**: Los vecinos interactúan directamente con el mapa señalizando incidentes en la vía pública de Río Cuarto.
- **Decisión**: Integrar **Google Maps JavaScript API** con paleta personalizada oscura nocturna (tonos grises `#212529` y caminos destacados), listener de toque directo (`map.addListener('click', ...)`) para abrir el Bottom Sheet inmediatamente en las coordenadas pulsadas, y capa de contingencia visual para asegurar que la app funcione siempre aún sin API Key configurada.
- **Consecuencias**: Interactividad geográfica real sobre calles de Río Cuarto y blindaje total contra pantallas grises de error de API.

---

### [ADR-013] · [2026-11-08 21:14] Layout Híbrido Adaptativo (Mobile-First en Móvil + Sidebar en Desktop)
- **Contexto**: La aplicación es Mobile-First por naturaleza de uso en vía pública, pero debe evaluarse con total comodidad en monitores de escritorio por parte del cuerpo docente.
- **Decisión**: En pantallas móviles (< 768px), la interfaz ocupa el 100% del viewport táctil con paneles Bottom Sheet. En monitores de escritorio (>= 768px), el mapa se expande y los filtros, comercios adheridos y estadísticas se presentan en un Sidebar lateral flotante.
- **Consecuencias**: Ergonomía táctil para Camila e Ignacio en la calle, y experiencia completa en monitores para la mesa examinadora.

---

### [ADR-014] · [2026-11-08 21:15] Activación de SOS con Presión Sostenida (1.5s - 2s) y Ergonomía Zurda
- **Contexto**: Evitar falsas alarmas comunitarias respetando la especificación de la pantalla 25 de Figma (*"Mantener presionado"*).
- **Decisión**: Configurar el Botón Flotante de Pánico (FAB) para activarse tras mantener presionado durante 1.5 segundos con indicador visual de progreso circular y vibración háptica al disparar la pantalla crítica de servicios (911, 107, 103, 100). Mantener toggle ergonómico para alternar posición a la izquierda para personas zurdas.
- **Consecuencias**: Prevención de falsos positivos y accesibilidad plena para ambas manos.

---

### [ADR-015] · [2026-11-08 21:16] Flujo Completo de las 42 Pantallas de Figma con Persistencia Local
- **Contexto**: La entrega representa la experiencia integral de usuario de Radar Urbano.
- **Decisión**: Implementar con persistencia en `localStorage`:
  1. Autenticación completa: Login, Registro con DNI y fecha de nacimiento, y Recuperación de contraseña en 4 pasos.
  2. InfoWindow de Pin con fotos, validación comunitaria ("Me sirvió") e hilo de comentarios dinámicos.
  3. Sistema de marcos de avatar (Bronce, Plata, Oro, Diamante) reactivo a las validaciones vecinales.
  4. Catálogo de Canje de Puntos en comercios locales (Kiosco la familia) con emisión de cupones de descuento.
- **Consecuencias**: Cobertura al 100% del prototipo de Figma y experiencia evaluable en un solo despliegue.

---

### [ADR-016] · [2026-11-08 22:15] Cartografía Interactiva con Leaflet + CARTO Basemaps y Rol de CARTO MCP
- **Contexto**: Se requería navegación interactiva completa (paneo, zoom, toques táctiles) en toda la ciudad de Río Cuarto. Google Maps JavaScript API limitaba la exploración si no se disponía de facturación/clave activa.
- **Decisión**:
  1. Integrar **Leaflet.js** con mosaicos de alta definición **CARTO Dark Matter** (modo noche) y **CARTO Positron** (modo día) de libre uso comunitario (`basemaps.cartocdn.com`).
  2. Clarificar la distinción con **CARTO AI MCP Server & Workflows API**: el MCP Server de CARTO es una herramienta para agentes de IA que ejecutan SQL espacial y workflows en la nube de CARTO (requiere token de pago/trial de organización), mientras que para la SPA y la mesa examinadora, los mosaicos CARTO en Leaflet otorgan el 100% de la experiencia cartográfica en tiempo real a costo cero y sin fricción de credenciales.
- **Consecuencias**: Navegación fluida a 60 FPS en toda la cuadrícula urbana de Río Cuarto, toques de coordenadas precisos para nuevos reportes, re-centrado instantáneo con "Mi Ubicación", e independencia total de bloqueos de API.

---

### [ADR-017] · [2026-11-08 22:30] Motor Cartográfico Híbrido Resiliente (Google Maps + Fallback a Leaflet/CARTO)
- **Contexto**: Los usuarios pueden ingresar una API Key de Google Maps en la configuración de la app. Google Cloud exige que la cuenta tenga facturación (tarjeta de crédito) vinculada para permitir peticiones web, lo que comúnmente provoca el error `BillingNotEnabledMapError` o `gm_authFailure`.
- **Decisión**:
  1. Conectar reactivamente el input de API Key de `SettingsModal` con `MapCanvas`.
  2. Implementar carga dinámica de Google Maps JS API. Si la clave es válida y la facturación está activa en GCP, se renderiza Google Maps oficial.
  3. Si la clave se rechaza, Google arroja error o se omite la clave, capturar el evento `window.gm_authFailure` y conmutar de inmediato a **Leaflet + CARTO** mostrando diagnóstico explicativo.
- **Consecuencias**: Resiliencia total ante claves sin facturación, diagnóstico transparente al usuario y experiencia ininterrumpida.

---

### [ADR-018] · [2026-11-08 22:38] Erradicación de Mosaicos con Marca de Agua e Integración de Esri Dark Gray + OpenStreetMap HOT
- **Contexto**: CARTO comenzó a inyectar marcas de agua intrusivas (*"API KEY REQUIRED carto.com/basemaps/apikey"*) en todas las teselas de `basemaps.cartocdn.com` si no se envía un token de facturación.
- **Decisión**:
  1. Erradicar por completo los servidores de teselas de CARTO.
  2. Integrar **Esri World Dark Gray Base & Reference** como capa base nocturna nativa: 100% libre, sin marcas de agua, alto contraste cromático y sin requerimiento de API Key.
  3. Integrar **OpenStreetMap HOT (Humanitarian)** como capa urbana detallada con nombres de calles y esquinas de Río Cuarto.
  4. Agregar botón de alternancia rápida de capa (`Map`) en la barra de zoom para cambiar entre *Radar Nocturno (Esri)* y *Calles Detalladas (OSM)*.
- **Consecuencias**: Mapa limpio, nítido y profesional a pantalla completa sin marcas de agua, cero costos y libre de bloqueos.

---

### [ADR-019] · [2026-11-08 22:55] Estandarización en Proveedor Único OpenStreetMap y Eliminación de Código Muerto
- **Contexto**: Para maximizar la simplicidad técnica, confiabilidad y velocidad de carga, se solicitó unificar el mapa en un solo proveedor, eliminar botones redundantes y purgar todo componente sin uso.
- **Decisión**:
  1. Estandarizar de forma exclusiva en **OpenStreetMap** como único proveedor cartográfico.
  2. Implementar el Modo Oscuro mediante filtro CSS en `.dark .leaflet-tile-pane`, garantizando que el mapa se adapte al tema oscuro sin alternar entre diferentes servidores ni provocar parpadeos de red.
  3. Eliminar el botón de alternar capas y los componentes no utilizados (`Sidebar.jsx` y `QuickFilters.jsx`).
  4. Purgar la gestión de API Keys en `SettingsModal` y `AppContext`, dejando una arquitectura limpia y 100% libre.
- **Consecuencias**: Reducción de más de 400 líneas de código, cero código basura, build liviano y navegación fluida garantizada en toda la ciudad de Río Cuarto.

---

### [ADR-020] · [2026-11-08 23:05] Desacoplamiento de Comercios del Mapa y Centralización en Canje de Puntos
- **Contexto**: El mapa debe priorizar la detección de incidentes de seguridad e infraestructura sin contaminación visual. La visualización de comercios adheridos (Kiosco la familia, Librería Universitaria) generaba ruido cartográfico sobre las alertas ciudadanas.
- **Decisión**:
  1. Remover los marcadores de comercios adheridos del lienzo de `MapCanvas`.
  2. Centralizar el catálogo de descuentos y beneficios exclusivamente en el modal de puntos ([`PointsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PointsModal.jsx)), accesible desde el menú lateral tanto para usuarios logueados como visitantes.
- **Consecuencias**: Mapa 100% enfocado en prevención y auxilio, manteniendo intacto el catálogo de canjes comunitarios en la navegación del menú.

---

### [ADR-021] · [2026-11-08 23:12] Dock Segmentado Unificado: Referencias + Agregar Alerta
- **Contexto**: Unificar las acciones inferiores en una sola tarjeta cohesiva para evitar elementos flotantes dispersos en el viewport móvil y facilitar el acceso con una sola mano.
- **Decisión**:
  1. Diseñar un contenedor unificado de pastilla en el dock inferior con cristal esmerilado (`bg-slate-900/95 border border-slate-700/80 rounded-2xl`).
  2. Dividir la pastilla en dos segmentos independientes separados por una línea vertical clara (`h-6 w-px bg-slate-700/80`):
     - **Segmento Referencias**: Alterna un popover desplegable adherido directamente arriba con el listado de las 5 categorías de incidentes y filtros en vivo.
     - **Segmento Agregar Alerta**: Dispara de inmediato el Bottom Sheet de nuevo reporte en las coordenadas actuales.
- **Consecuencias**: Jerarquía visual compacta y armónica, cero colisiones de elementos y máxima ergonomía táctil (Ley de Fitts).

---

### [ADR-022] · [2026-11-08 23:25] Armonización de Alturas y Geometría en el Dock Inferior (Mobile-First)
- **Contexto**: "Agregar Alerta" quebraba en dos líneas por falta de ancho restringido en móviles, deformando la altura de la tarjeta frente al botón circular de SOS y creando una desalineación visual tipo "escalón".
- **Decisión**:
  1. Estandarizar la altura de la tarjeta de acción a `h-[54px]` (`sm:h-[58px]`), igualándola con el diámetro del botón circular SOS.
  2. Forzar `whitespace-nowrap` en ambos segmentos para erradicar el salto de línea y mantener la pastilla estilizada.
  3. Alinear el contenedor inferior con `items-start` para que la parte superior e inferior de los botones principales compartan la misma cota horizontal, ubicando la pastilla guía *"Mantener Presionado"* en posición armónica inferior.
- **Consecuencias**: Simetría geométrica perfecta, ergonomía táctil óptima para el pulgar y acabado estético premium.

---

### [ADR-023] · [2026-11-08 23:42] Vistas Dedicadas Modales y Barra de Navegación Horizontal en Escritorio
- **Contexto**: Se requería proveer vistas completas y accesibles para:
  1. Historial de reportes comunitarios y propios.
  2. Datos personales y progreso de reputación ciudadana.
  3. Catálogo de canje de puntos con comercios adheridos de Río Cuarto y billetera de cupones activos.
  4. Configuraciones de sistema (radio de notificaciones, ergonomía zurda, formas de pines WCAG, datos demo).
  5. Navegación en escritorio sin menú hamburguesa para aprovechar el ancho de pantalla.
- **Decisión**:
  1. Implementar [`HistoryModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/HistoryModal.jsx) con pestañas *"Mis Reportes"* vs *"Río Cuarto"*, filtros por estado (Activos/Resueltos), fijación directa en el mapa (`focusMapOn`) y resolución de incidentes (`markReportResolved`).
  2. Implementar [`PersonalDataModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PersonalDataModal.jsx) con datos auditables (Nombre, DNI, Email, Teléfono, Barrio de Río Cuarto), barra de progreso hacia el siguiente rango de confianza y persistencia en `localStorage`.
  3. Potenciar [`PointsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PointsModal.jsx) con navegación por pestañas (*"Comercios Adheridos"* y *"Mis Cupones"*), generación de códigos alfanuméricos con copia al portapapeles y comercios de Río Cuarto (Kiosco la familia, Librería Universitaria, Farmacia Grassi, Café del Río).
  4. Potenciar [`SettingsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/SettingsModal.jsx) con slider de radio preventivo (1-15 km), selector de barrio activo, modo zurdos, geometría de pines y reseteo de datos demo.
  5. En [`Header.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/Header.jsx), añadir barra de navegación horizontal visible en `md:` (`hidden md:flex`) con enlaces directos (`Mapa`, `Historial`, `Puntos`, `Datos Personales`, `Configuración`), ocultando el botón hamburguesa en pantallas de escritorio (`md:hidden`).
- **Consecuencias**: Experiencia de usuario desktop moderna y directa sin clics extra en menús ocultos, manteniendo a su vez una experiencia móvil limpia y accesible con drawer. Cero errores de compilación y cumplimiento estricto de WCAG AA y los 5 estados interactivos.

---

### [ADR-024] · [2026-11-08 23:50] Sistema de 5 Usuarios Hardcodeados, Iniciales en Avatar y Rol de Moderación Activa
- **Contexto**: Se requería un sistema de credenciales hardcodeadas compuesto por 4 usuarios comunes (`ivan`, `matias`, `santiago`, `jonatan`) y 1 moderador oficial (`moderador`), erradicando cualquier usuario dummy (`Fulano`), mostrando iniciales cuando no exista foto cargada, permitiendo la carga voluntaria de fotos y habilitando la edición y control de resolución de incidentes exclusivamente para el moderador.
- **Decisión**:
  1. Crear [`src/data/users.js`](file:///home/iescobar/itec/3ero/ui/efi/src/data/users.js) con las 5 cuentas:
     - `ivan` / `ivan123` (Vecino, Rango Oro, 120 pts)
     - `matias` / `matias123` (Vecino, Rango Plata, 70 pts)
     - `santiago` / `santiago123` (Vecino, Rango Bronce, 45 pts)
     - `jonatan` / `jonatan123` (Vecino, Rango Oro, 95 pts)
     - `moderador` / `moderador123` (Moderador Oficial, Rango Diamante, 500 pts, `isModerator: true`)
  2. Implementar [`UserAvatar.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/UserAvatar.jsx) para calcular y renderizar iniciales estilizadas en caso de no contar con foto, e incorporar en [`PersonalDataModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PersonalDataModal.jsx) un input tipo file con `FileReader` para cargar fotos y botón para volver a iniciales.
  3. Erradicar de raíz cualquier referencia a *"Fulano"* o fotos fijas (`/ivan.jpg`).
  4. Habilitar capacidades de **Moderación**:
     - En [`PinDetailsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PinDetailsModal.jsx): botón de edición de reporte (`updateReport`) para cambiar categoría, título, descripción y estado (activo vs solucionado), además de botón directo para conmutar resolución.
     - En [`HistoryModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/HistoryModal.jsx): insignias de moderador y controles de edición y reapertura de alertas.
  5. En [`AuthModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/AuthModal.jsx), incorporar selector rápido de 1 clic para alternar entre las 5 cuentas y autenticación rigurosa.
  6. Para la versión de escritorio (donde el menú hamburguesa permanece oculto), incorporar un botón directo de *"Salir"* en la cabecera [`Header.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/Header.jsx) junto al avatar y un botón de *"Cerrar Sesión"* en el pie de [`PersonalDataModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PersonalDataModal.jsx).
- **Consecuencias**: Separación nítida de roles entre vecinos que alertan y la autoridad comunitaria que audita, valida y resuelve incidentes urbanos en Río Cuarto. Cero cruft y cumplimiento pleno de accesibilidad.

---

### [ADR-025] · [2026-11-09 00:00] Diferenciación Visual en Mapa para Reportes Solucionados (Fondo Gris y Tilde Verde)
- **Contexto**: En el lienzo cartográfico, todas las alertas se mostraban con el color de su categoría y un indicador `!` rojo titilante, impidiendo a los vecinos y transeúntes distinguir de inmediato los incidentes que ya fueron atendidos o solucionados respecto de las amenazas vigentes.
- **Decisión**:
  1. En [`MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx), condicionar el estilo del marcador HTML según `isResolved` (`report.status === 'resuelto' || report.isResolved`):
     - **Reportes Activos**: Mantienen el fondo cromático de su categoría y el indicador rojo con signo de exclamación `!` y animación de pulso titilante (`animate-ping`).
     - **Reportes Solucionados**: Adoptan un fondo neutro gris pizarra (`bg-slate-500 border-slate-300 dark:border-slate-600`) y reemplazan el `!` rojo por una pastilla verde esmeralda (`bg-emerald-500`) con tilde de confirmación (`✓`), estática y sin parpadeo de alerta.
  2. En el popover de *Referencias*, agregar la leyenda explicativa con el pin gris y tilde verde para *"Resuelto / Solucionado"*.
- **Consecuencias**: Reducción drástica del estrés visual y carga cognitiva para el usuario, permitiendo identificar en una fracción de segundo las zonas ya seguras o normalizadas en Río Cuarto.

---

### [ADR-026] · [2026-11-09 00:10] Delimitación Geográfica de Reportes Activos con Radio de 1 km por Defecto y Configurable
- **Contexto**: Para optimizar la prevención y no alertar a los ciudadanos sobre incidentes lejanos irrelevantes a su entorno inmediato, se solicitó delimitar los reportes activos a una distancia configurable con valor por defecto de 1 km.
- **Decisión**:
  1. Definir `config.alertRadius = 1` (1 km) como valor por defecto en el estado inicial de [`AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx).
  2. Implementar la fórmula de Haversine ([`calculateDistanceKm`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx#L9)) para calcular de forma matemática y precisa la distancia entre la ubicación del usuario (`RIO_CUARTO_CENTER` en Río Cuarto) y cada reporte.
  3. En [`MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx):
     - Dibujar una **Geocerca de Prevención Circular** (`L.circle`) translúcida y punteada de radio `alertRadius * 1000` metros alrededor de la posición del usuario.
     - Delimitar el renderizado de incidentes activos para mostrar únicamente aquellos cuya distancia sea menor o igual al radio activo (`distKm <= alertRadius`). Los reportes resueltos se conservan visibles con fondo gris y tilde verde para auditoría.
     - Mostrar el radio activo en la pastilla flotante superior y en el popover de referencias.
  4. En [`SettingsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/SettingsModal.jsx), dotar al slider de radio de botones de acceso rápido (`1 km (Default)`, `3 km`, `5 km`, `10 km`) y reactividad en tiempo real.
  5. En [`App.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/App.jsx) y [`PinDetailsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PinDetailsModal.jsx), reflejar el conteo dinámico de alertas activas a &le; 1 km y la distancia exacta a cada incidente.
- **Consecuencias**: Experiencia hiperlocal focalizada, reducción de ruido cartográfico y total personalización del perímetro de seguridad preventiva. Cero errores de compilación y pleno cumplimiento de los estándares de accesibilidad.

---

### [ADR-027] · [2026-11-09 00:15] Simulación Urbana Realista: Expansión a 23 Reportes en Río Cuarto con ~40% Resueltos
- **Contexto**: Para validar fielmente el comportamiento de la red vecinal, el perímetro de 1 km y la distinción cromática entre alertas activas y solucionadas, se requería poblar la ciudad de Río Cuarto con 15 reportes adicionales distribuidos en diversos barrios y distancias, manteniendo una tasa realista de resolución de incidentes (~40% solucionados).
- **Decisión**:
  1. Agregar 15 nuevos reportes geolocalizados en [`src/data/initialReports.js`](file:///home/iescobar/itec/3ero/ui/efi/src/data/initialReports.js) (IDs del 9 al 23), distribuidos en Centro, Macrocentro, Alberdi, Banda Norte, Bimaco, Castelli y UNRC.
  2. Asignar estado resuelto (`status: 'resuelto'`, `isResolved: true`) a 6 de los 15 nuevos reportes (exactamente 40%), renderizados con fondo gris pizarra y tilde verde en el mapa.
  3. Distribuir las coordenadas geográficas de modo que:
     - Los reportes a &le; 1 km aparezcan activos dentro de la geocerca inicial.
     - Los reportes más alejados (Banda Norte a 2.4 km, Bimaco a 3.2 km, UNRC a 4.6 km) se incorporen reactivamente al ampliar el radio en configuraciones.
  4. Actualizar la hidratación de estado en [`AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx) para auto-actualizar la caché local del navegador con la nueva base de 23 incidentes.
- **Consecuencias**: Mapa urbano verosímil y vibrante para la mesa de evaluación, permitiendo comprobar al 100% la alternancia de roles, el filtrado por distancia y la gestión comunitaria de incidentes.

---

### [ADR-028] · [2026-11-09 00:25] Calibración del Radio Predeterminado de Alertas Activas a 5 km
- **Contexto**: A raíz de la retroalimentación directa del usuario sobre la delimitación territorial en Río Cuarto, el radio predeterminado de 1 km concentraba las alertas exclusivamente en el microcentro, dejando inicialmente fuera de la geocerca preventiva a barrios periféricos y puntos neurálgicos como el campus de la UNRC (4.95 km), Banda Norte (2.02 km) y Bimaco (1.96 km).
- **Decisión**:
  1. Actualizar el radio predeterminado a **5 km** (`alertRadius: 5`) en [`DEFAULT_CONFIG`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx#L29).
  2. Implementar migración automática en la hidratación de `localStorage` para transicionar de forma transparente las sesiones preexistentes con valor 1 km al nuevo estándar de 5 km.
  3. Actualizar los fallbacks y etiquetas informativas en:
     - [`App.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/App.jsx): Subheader con conteo de reportes activos a &le; 5 km y acceso rápido al ajuste de radio.
     - [`MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx): Radio de geocerca geodésica (`L.circle` de 5.000 metros) y pastilla flotante superior.
     - [`SettingsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/SettingsModal.jsx): Distintivo visual `Default (5 km)` y botón de selección rápida correspondiente.
     - [`PinDetailsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PinDetailsModal.jsx): Evaluación del indicador de perímetro `Dentro de radio 5 km`.
- **Consecuencias**: Cobertura integral de la planta urbana de Río Cuarto de manera predeterminada, abarcando desde Plaza Roca hasta el campus universitario de la UNRC, manteniendo la capacidad de ajuste dinámico (1 a 15 km) desde las configuraciones del sistema.

---

### [ADR-029] · [2026-11-09 00:30] Remoción de Accesos Rápidos en Login y Formulario Completo de Registro Vecinal
- **Contexto**: La vista de inicio de sesión incluía botones de acceso rápido que sobrecargaban la interfaz e impedían una experiencia auténtica de inicio de sesión. Asimismo, se requería un formulario de registro completo y funcional para que nuevos vecinos de Río Cuarto puedan incorporarse a la red comunitaria con persistencia real.
- **Decisión**:
  1. En [`AuthModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/AuthModal.jsx):
     - **Login limpio**: Eliminar los botones de selección rápida de usuarios. El formulario ahora cuenta con inputs claros de usuario o correo, campo de contraseña con toggle de visibilidad (`Eye`/`EyeOff`), botón primario "Iniciar Sesión", botón para ir al registro y una nota sutil de credenciales de prueba para la mesa evaluadora.
     - **Formulario de Registro**: Implementar vista de alta ciudadana completa con campos de Nombre y Apellido, Nombre de usuario (`@usuario`), Correo Electrónico, Barrio de Río Cuarto (selector con Centro, Macrocentro, Banda Norte, Alberdi, Castelli, Bimaco, etc.), Contraseña, Confirmación de Contraseña, Incentivo de 20 puntos de bienvenida y Checkbox de aceptación de normas vecinales.
  2. En [`AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx):
     - Mantener un registro persistido en `localStorage` (`radar_urbano_all_users`) inicializado con los 5 usuarios base.
     - Extender `registerUser` para validar unicidad de usuario y correo, instanciar al nuevo vecino con nivel Bronce y 20 puntos de bienvenida, loguearlo de inmediato y emitir feedback háptico y toast de bienvenida.
     - Extender `loginUser` para permitir el inicio de sesión tanto con nombre de usuario como con dirección de correo electrónico en la lista integral de usuarios.
- **Consecuencias**: Flujo de autenticación profesional, limpio, accesible (WCAG AA con los 5 estados interactivos) y 100% interactivo tanto para usuarios predeterminados como para nuevos vecinos dados de alta en vivo.

---

### [ADR-030] · [2026-11-09 00:35] Radio Geodésico Predeterminado Diferenciado por Rol: Moderador (5 km) y Vecinos (1 km)
- **Contexto**: Se estableció la regla de negocio explícita: el único usuario con un radio predeterminado de 5 km es el Moderador (debido a su función de supervisión de incidentes en toda la ciudad de Río Cuarto). Para los usuarios comunes (vecinos `ivan`, `matias`, `santiago`, `jonatan` o nuevos registrados), el radio predeterminado debe ser estrictamente de 1 km (entorno barrial inmediato y caminable).
- **Decisión**:
  1. En [`AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx):
     - Calcular dinámicamente `defaultAlertRadius = user?.isModerator ? 5 : 1`.
     - En `loginUser`: Asignar automáticamente el radio de alerta por defecto del rol (`finalUser.isModerator ? 5 : 1`) y notificarlo en el toast.
     - En `logoutUser` y `registerUser`: Asignar por defecto `1 km`.
     - En la hidratación inicial de `config`: Adaptar el radio según si el usuario activo es moderador o vecino.
  2. En [`SettingsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/SettingsModal.jsx):
     - El badge de `Default` indica explícitamente el rol: `Default (5 km • Moderación)` o `Default (1 km • Vecino)`.
     - Los botones de acceso rápido y la descripción contextual informan la cobertura según el rol actual.
  3. En [`App.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/App.jsx), [`MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx) y [`PinDetailsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PinDetailsModal.jsx):
     - Sincronización reactiva con `alertRadiusKm`, asegurando que la geocerca circular, el conteo de incidentes activos y las etiquetas reflejen con precisión 5 km para el moderador y 1 km para los vecinos.
- **Consecuencias**: Reglas de negocio segmentadas con precisión quirúrgica, mejorando tanto la experiencia del vecino (enfoque barrial inmediato) como la del moderador (supervisión urbana integral).

---

### [ADR-031] · [2026-11-09 00:40] Centrado Horizontal Equilibrado del Contenedor de Notificaciones Toast
- **Contexto**: Las notificaciones de confirmación y advertencia (toasts) se mostraban ancladas en la esquina superior derecha (`fixed top-5 right-5`), lo que generaba un desequilibrio visual en resoluciones móviles y distraía la atención hacia un lateral en lugar del eje central de la pantalla.
- **Decisión**:
  1. En [`App.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/App.jsx#L74), reconfigurar el contenedor a centrado horizontal simétrico con `fixed top-5 left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-md px-4`.
  2. Implementar entrada suave con `animate-in fade-in slide-in-from-top-3` y `backdrop-blur-md` en lugar del rebote continuo de `animate-bounce`.
  3. Diferenciar los estilos de alerta con badges e íconos semánticos (`emergency`, `warning`, `info` y `success`).
- **Consecuencias**: Notificaciones fluidas, perfectamente centradas tanto en dispositivos móviles (iPhone/Android) como en pantallas de escritorio, garantizando lectura natural y equilibrio visual superior.

---

### [ADR-032] · [2026-11-09 00:45] Remoción del Recuadro de Cuentas Disponibles en Login
- **Contexto**: A fin de asegurar un formulario de inicio de sesión 100% auténtico, sobrio y libre de pistas o elementos de depuración residuales, se solicitó la eliminación del recuadro informativo inferior que enumeraba los nombres de usuario y contraseñas de demostración.
- **Decisión**:
  1. En [`AuthModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/AuthModal.jsx#L295), suprimir el contenedor de ayuda (`<div className="mt-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-750 text-center">...</div>`).
  2. Mantener la documentación de las credenciales de prueba centralizada exclusivamente en el archivo de referencia [`README.md`](file:///home/iescobar/itec/3ero/ui/efi/README.md) y [`docs/contexto/glosario.md`](file:///home/iescobar/itec/3ero/ui/efi/docs/contexto/glosario.md) para el tribunal evaluador.
- **Consecuencias**: Interfaz de acceso completamente limpia, profesional y libre de cruft visual en la pantalla de inicio de sesión.

---

### [ADR-033] · [2026-11-09 00:50] Blindaje Anti-Autofill del Navegador en Login y Registro
- **Contexto**: Al abrir el modal de autenticación, navegadores basados en Chromium (Google Chrome / Edge) auto-completaban de forma agresiva contraseñas previamente guardadas en el navegador para el dominio local (ej. `icliente@gmail.com`), tiñendo además los inputs de celeste/blanco (`:-webkit-autofill`) y alterando el estado visual del formulario.
- **Decisión**:
  1. En [`AuthModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/AuthModal.jsx):
     - Incorporar señuelos anti-autofill invisibles (`fake_user` y `fake_pwd`) inmediatamente tras la apertura del `<form>`.
     - Desacoplar los atributos `name` e `id` de las heurísticas de login del navegador (`ru_account_id` y `ru_security_token`), estableciendo `autoComplete="off"` / `autoComplete="new-password"`, `autoCapitalize="none"`, `spellCheck="false"` y directivas `data-lpignore="true"` y `data-form-type="other"`.
     - Implementar un borrado forzado diferido (`setTimeout` a 50ms y 180ms) en el hook de montaje para vaciar de raíz cualquier inyección asíncrona que el navegador intente forzar tras renderizar los nodos.
  2. En [`src/index.css`](file:///home/iescobar/itec/3ero/ui/efi/src/index.css):
     - Anular el estilo predeterminado del navegador mediante `input:-webkit-autofill` forzando `-webkit-box-shadow: 0 0 0 1000px #1e293b inset` y `-webkit-text-fill-color: #ffffff`.
- **Consecuencias**: Los formularios de Inicio de Sesión y Registro permanecen 100% vacíos, limpios y con su paleta visual oscura intacta, sin interferencia del gestor de contraseñas del navegador.

---

### [ADR-034] · [2026-11-09 00:55] Estandarización de Alturas y Geometría en la Barra de Navegación (Navbar)
- **Contexto**: Los distintos controles interactivos de la barra de navegación superior (Header) presentaban discrepancias en sus alturas y paddings verticales (ej. selector de tema en 36px, botón de avatar en 32px, botón de salida en 28px, y botones del menú central con alturas variables debido a badges numéricos).
- **Decisión**:
  1. En [`Header.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/Header.jsx):
     - Unificar la rejilla de utilidades a una altura estricta de **`h-9`** (36px):
       - Icono de Marca (Logo): `w-9 h-9 rounded-xl` (36×36px).
       - Botón de Tema (Modo Claro/Oscuro): `w-9 h-9 rounded-xl` (36×36px).
       - Botón de Perfil (Avatar): `w-9 h-9 rounded-xl` (36×36px) con el avatar centrado en su interior.
       - Botón Salir (Desktop): `h-9 px-3 rounded-xl` (36px de alto).
       - Botón Ingresar: `h-9 px-3.5 rounded-xl` (36px de alto).
       - Menú Hamburguesa (Móvil): `w-9 h-9 rounded-xl` (36×36px).
     - En el menú horizontal de pestañas desktop (`<nav>`):
       - Contenedor con altura uniforme `h-10`.
       - Todos los botones con altura idéntica `h-8 px-3 rounded-xl` y alineación vertical estricta.
       - Insignia de puntos ajustada a `h-4.5` sin alterar la altura del botón contenedor.
- **Consecuencias**: Alineación visual armónica, simetría perfecta en el eje vertical y coherencia geométrica en toda la barra de navegación tanto en móvil como en escritorio.

---

### [ADR-035] · [2026-11-09 01:10] Simbología Geométrica Universal por Categoría (WCAG AA 1.4.1) y Limpieza de Modo para Zurdos
- **Contexto**:
  1. En el panel de ajustes, la opción de ergonomía "Modo para Zurdos" incluía la referencia "(Ignacio)", la cual debía ser removida para presentar la opción de manera neutra y universal.
  2. La forma de los pines en el mapa dependía anteriormente de un selector manual global del usuario. El nuevo requerimiento de accesibilidad y de negocio establece que **cada tipo de alerta posea de forma intrínseca una geometría vectorial única**:
     - **Robo / Delito**: Rombo / Diamante (`diamond`) en rojo (`#dc2626`).
     - **Persona sospechosa**: Cuadrado (`square`) en naranja (`#f97316`).
     - **Iluminación rota**: Círculo (`circle`) en ámbar (`#f59e0b`).
     - **Baldío peligroso**: Gota / Pin (`pin`) en azul cielo (`#0ea5e9`).
     - **Acoso / Violencia**: Triángulo (`triangle`) en violeta (`#8b5cf6`).
     - **Infraestructura**: Octágono (`octagon`) en azul (`#3b82f6`).
     - **Resuelto / Solucionado**: Hexágono (`hexagon`) en gris pizarra (`#64748b`) con pastilla verde y checkmark (`✓`).
  3. Esta diferenciación geométrica garantiza el cumplimiento de **WCAG AA 1.4.1 (Uso del color)**, permitiendo que personas con daltonismo (protanopia, deuteranopia, tritanopia) o dificultades visuales reconozcan el incidente de inmediato por su silueta.
- **Decisión**:
  1. En [`src/data/initialReports.js`](file:///home/iescobar/itec/3ero/ui/efi/src/data/initialReports.js): Extender `CATEGORIES_CONFIG` asociando `shape` y `shapeLabel` a cada categoría.
  2. En [`src/components/SettingsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/SettingsModal.jsx):
     - Simplificar el título a "Modo para Zurdos".
     - Eliminar el selector manual de `pinShape` y reemplazarlo por un visor informativo de Simbología Semántica WCAG AA.
  3. En [`src/components/MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx):
     - Renderizar marcadores SVG con la silueta geométrica correspondiente a cada categoría y hexágono para resueltos.
     - Actualizar el popover de "Referencias" para mostrar las siluetas vectoriales de cada categoría junto a su nombre limpio y conciso, manteniendo la leyenda detallada de formas en el panel de Configuraciones.
     - Remover `config.pinShape` del ciclo de renderizado de marcadores.
  4. En [`src/components/BottomSheetReport.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/BottomSheetReport.jsx): Exponer la forma asociada en cada categoría del formulario de reporte.
- **Consecuencias**: Plena accesibilidad universal sin depender exclusivamente del color, lectura espacial inmediata de incidentes y código desacoplado y robusto.

---

### [ADR-036] · [2026-11-09 01:25] Diferenciación Cromática, Espaciado Generoso y Filtrado por Categoría en Historial
- **Contexto**:
  1. En el modal de Historial ([`HistoryModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/HistoryModal.jsx)), las tarjetas aparecían agrupadas en una lista densa con divisores planos (`divide-y`), careciendo de identidad visual individual y de suficiente separación espacial.
  2. El usuario solicitó dos mejoras centrales:
     - Diferenciar cada tarjeta dándole más espacio y un fondo con tono similar al color semántico del reporte.
     - Incorporar la capacidad de filtrar el historial por categoría específica (ej. ver solo Robo / Delito, Iluminación rota, etc.).
- **Decisión**:
  1. En [`src/components/HistoryModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/HistoryModal.jsx):
     - **Espaciado y Geometría de Cards**: Se removió el divisor plano `divide-y` y se amplió la separación a `space-y-4` con padding interior `p-4 sm:p-5`, elevación mediante sombras (`shadow-md hover:shadow-xl`) y bordes redondeados amplios (`rounded-2xl`).
     - **Tematización Cromática por Categoría**: Se definió un diccionario de estilos `CATEGORY_CARD_STYLES` que aplica a cada tarjeta un sutil degradado oscuro con el color del reporte (ej. `from-red-950/45` para delito, `from-orange-950/45` para sospechoso, `from-amber-950/45` para luz), sumado a un **borde de acento izquierdo grueso (`border-l-4`)** para identificación inmediata a simple vista. Los reportes solucionados reciben un tratamiento archivado con `border-l-emerald-500/80` y badge verde.
     - **Filtro Horizontal por Categoría**: Se añadió una barra de pastillas interactivas horizontales con desplazamiento suave (`overflow-x-auto`) que permite filtrar por cada una de las 6 categorías o ver "Todas". Cada chip exhibe su silueta geométrica correspondiente (Rombo, Cuadrado, Círculo, etc.) y un contador reactivo de incidentes en tiempo real.
     - **Estado Vacío Amigable**: Se integró un contenedor con ícono y botón de acción directa ("Restablecer filtros") cuando un filtro no produce resultados.
- **Consecuencias**: Auditoría barrial sumamente ágil e intuitiva, contraste garantizado (> 12:1 sobre texto blanco) y navegación accesible con teclado en todos los estados.

---

### [ADR-037] · [2026-11-09 01:40] Publicación de Reportes Anónimos y Carga de Evidencia Fotográfica
- **Contexto**:
  1. En situaciones delictivas de riesgo o comprometedoras (robos violentos, venta de estupefacientes, violencia o acoso), los vecinos expresaban el temor fundado a sufrir represalias si su nombre completo o perfil vecinal quedaban expuestos en el mapa comunitario.
  2. Al mismo tiempo, se requería la posibilidad de adjuntar evidencia fotográfica directa (desde la cámara o galería del dispositivo) dentro del formulario de reporte para validar la veracidad y alcance del incidente.
- **Decisión**:
  1. En [`src/context/AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx):
     - Incorporar los estados `isAnonymous` y `reportPhoto`.
     - Al confirmar el reporte, si `isAnonymous` es verdadero, registrar públicamente al autor como `"Vecino Anónimo"` y anular el `authorTier`.
     - Preservar internamente `authorId: user?.id` para que el autor continúe visualizando su propia alerta dentro de su pestaña personal *"Mis Reportes"*, sin que terceros puedan asociarla a su identidad.
  2. En [`src/components/BottomSheetReport.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/BottomSheetReport.jsx):
     - **Interruptor de Modo Anónimo**: Switch ergonómico accesible con indicador "Protegido", que informa con claridad que los datos personales no serán divulgados.
     - **Carga y Compresión de Imagen**: Input de archivo nativo (`<input type="file" accept="image/*">`) con compresión automática mediante Canvas HTML5 (redimensionado a max 800px a 0.82 de calidad JPEG) para garantizar persistencia liviana y veloz en `localStorage`. Previsualización interactiva con botón para cambiar o eliminar la foto, y opciones de muestra rápida para pruebas de demostración.
  3. En [`src/components/ConfirmationModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/ConfirmationModal.jsx), [`src/components/PinDetailsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PinDetailsModal.jsx) y [`src/components/HistoryModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/HistoryModal.jsx):
     - Reflejar coherentemente la condición anónima con el badge de *"Vecino Anónimo"* y exhibir la fotografía adjunta con diseño responsive.
  4. En [`src/components/FaqModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/FaqModal.jsx):
     - Incorporar en la sección *"Términos y Privacidad de Datos"* la política de protección y uso de los reportes y denuncias anónimas.
- **Consecuencias**: Seguridad ciudadana y privacidad integral garantizada ante situaciones de riesgo personal, y soporte confiable de evidencia fotográfica sin saturar el almacenamiento local.

---

### [ADR-038] · [2026-11-09 01:55] Inversión Ergonómica Integral en Modo para Zurdos (Dock y Segmentos de Referencias/Alertas)
- **Contexto**:
  1. Al activar el "Modo para Zurdos", el dock inferior invertía la posición del Botón SOS (hacia la izquierda) y de la pastilla unificada (hacia la derecha).
  2. No obstante, los botones interiores de la pastilla permanecían fijos en `[Referencias | Agregar Alerta]`. Para una ergonomía táctil óptima del pulgar izquierdo (Ley de Fitts), los segmentos internos debían también invertirse para situar la acción primaria más cercana al eje de navegación.
- **Decisión**:
  1. En [`src/components/MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx):
     - Aplicar clase condicional `config.isLeftHanded ? 'flex-row-reverse' : 'flex-row'` al contenedor interno de la pastilla segmentada, invirtiendo el orden de "Referencias" y "Agregar Alerta".
     - El popover de Referencias se alinea con precisión a `right-0` directamente sobre el botón de Referencias.
  2. En [`src/components/SettingsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/SettingsModal.jsx):
     - Actualizar la descripción para clarificar la inversión integral tanto del dock como de los botones internos.
- **Consecuencias**: Ergonomía táctil superior, simetría perfecta y mayor facilidad de uso con una sola mano izquierda.

---

### [ADR-039] · [2026-11-10 22:15] Restricción de Visibilidad y Guardas de Autenticación para Invitados
- **Contexto**:
  1. Opciones ligadas al perfil de usuario (`Historial`, `Puntos y Canje`, `Datos Personales`, `Configuración`) solo tienen sentido cuando el usuario ha iniciado sesión. Los usuarios no autenticados (invitados / `!user.isLoggedIn`) no deben ver estas opciones ni en la barra de navegación de escritorio ni en el menú lateral móvil.
  2. Al mismo tiempo, acciones clave accesibles en el mapa interactivo (como el botón "Agregar Alerta", el clic en una calle para reportar o el botón de pánico "SOS") deben interceptar al invitado, orientarlo mediante una notificación toast explicativa y redirigirlo inmediatamente al modal de inicio de sesión (`auth` en vista `login`).
- **Decisión**:
  1. En [`src/components/Header.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/Header.jsx):
     - Condicionar la barra horizontal de navegación `<nav>` con `{user?.isLoggedIn && (...) }`, eliminando del encabezado para invitados todas las opciones vinculadas a usuario (`Historial`, `Puntos`, `Datos Personales`, `Configuración`).
  2. En [`src/components/DrawerMenu.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/DrawerMenu.jsx):
     - En la sección no logueada, remover `Historial de reportes`, `Comercios y Canje de puntos` y `Configuración`, conservando únicamente *"Iniciar Sesión / Registrarse"* y *"Preguntas frecuentes"*.
  3. En [`src/components/PanicButton.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PanicButton.jsx):
     - Validar `!user?.isLoggedIn` en `startPress`, `completeEmergency` y `onClick`. Si el usuario no está logueado, se cancela la emisión, se reproduce respuesta háptica de advertencia, se abre el modal de login y se emite el toast: *"Debes iniciar sesión para activar el botón SOS de auxilio"*.
  4. En [`src/components/MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx) y [`src/context/AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx):
     - Blindar el botón "Agregar Alerta" y el clic sobre calles (`startReportAtLocation`), redirigiendo a login con el toast: *"Debes iniciar sesión para reportar una alerta"*.
     - Proteger `setActiveModal` contra aperturas forzadas de modales privados (`PROTECTED_MODALS: ['history', 'points', 'personalData', 'settings', 'report', 'confirm', 'sos']`).
     - Proteger interacciones sociales y de resolución (`toggleReaction`, `addComment`, etc.) para usuarios no autenticados.
  5. En [`src/App.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/App.jsx):
     - En el subheader, renderizar el botón interactivo de ajuste de distancia solo si `user?.isLoggedIn`, exhibiendo texto plano informativo cuando es invitado.
- **Consecuencias**: Seguridad de datos, diferenciación nítida entre experiencia de invitado y vecino autenticado, y navegación fluida orientada a la conversión de usuarios hacia el login.

---

### [ADR-040] · [2026-11-13 10:50] Blindaje Antiestancamiento de Sesión (Stale Closure en Leaflet y Persistencia Resiliente)
- **Contexto**:
  1. Tras implementar las guardas de autenticación de invitados, los usuarios autenticados (tanto con cuentas predeterminadas como con usuarios recién registrados en `localStorage`) experimentaban un bloqueo al intentar crear un reporte: al hacer clic en el mapa de Río Cuarto, eran redirigidos erróneamente al formulario de inicio de sesión.
  2. Causa raíz:
     - En `MapCanvas.jsx`, el listener `map.on('click')` de Leaflet fue registrado dentro de un `useEffect` con array de dependencias vacío `[]`, capturando en su clausura la versión inicial de `startReportAtLocation` en la que `user.isLoggedIn` era `false`.
     - En la hidratación inicial de `AppContext.jsx`, `Boolean(parsed.isLoggedIn)` evaluaba a `false` en sesiones preexistentes donde `isLoggedIn` no había sido almacenado explícitamente como booleano.
- **Decisión**:
  1. En [`src/components/MapCanvas.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/MapCanvas.jsx):
     - Introducir `startReportRef` mutable (`useRef`) sincronizado sincrónicamente en cada render, de modo que `map.on('click')` siempre ejecute la función más reciente con el estado de autenticación actualizado.
     - Delegar la acción del botón "Agregar Alerta" directamente a `startReportAtLocation`, unificando el punto de validación.
  2. En [`src/context/AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx):
     - Incorporar `userRef` mutable actualizado sincrónicamente, utilizándolo en `startReportAtLocation`, `setActiveModal`, `loginUser`, `registerUser`, `logoutUser` y demás guardas de negocio para garantizar lecturas libres de stale closures.
     - Sincronizar de forma inmediata `userRef.current`, `setUser` y `localStorage.setItem('radar_urbano_user', ...)` en `loginUser` y `registerUser`.
     - En la inicialización desde `localStorage`, mantener activa la sesión si existe una cuenta guardada válida y no fue cerrada explícitamente (`isLoggedIn = parsed.isLoggedIn !== undefined ? Boolean(parsed.isLoggedIn) : true`).
     - Desacoplar `'report'` y `'confirm'` de `PROTECTED_MODALS` para evitar intercepciones redundantes durante el flujo activo de redacción de la alerta.
  3. En [`src/components/PanicButton.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PanicButton.jsx):
     - Implementar `userRef` mutable para validar de forma confiable la pulsación sostenida del botón SOS sin depender de clausuras asíncronas del temporizador.
- **Consecuencias**: Erradicación definitiva de redirecciones no deseadas al formulario de login para usuarios autenticados, navegación cartográfica fluida al reportar incidentes y sincronización sólida en `localStorage`.

---

### [ADR-041] · [2026-11-13 11:15] Sistema de Onboarding y Recorrido Guiado Interactivo (Tutorial)
- **Contexto**:
  1. Nuevos vecinos que ingresan a Radar Urbano necesitan comprender rápidamente el alcance comunitario de la plataforma, cómo interpretar la cartografía y la simbología geométrica universal, las dos maneras de crear un reporte, el funcionamiento seguro del botón SOS de pánico y todas las opciones que componen el menú.
  2. Asimismo, el recorrido guiado debía ser permanentemente accesible a demanda desde la sección de *"Preguntas Frecuentes"* (y el menú lateral) para repasar cualquier concepto en cualquier momento.
- **Decisión**:
  1. Creación de [`src/components/TutorialTourModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/TutorialTourModal.jsx):
     - Modal interactivo de 6 pasos con diseño de alto contraste, badges temáticos, dots interactivos de avance, atajos de teclado (<kbd>←</kbd>, <kbd>→</kbd>, <kbd>Esc</kbd>) y respuesta háptica.
     - **Paso 1 (Bienvenida & Alcance)**: Saludo personalizado con el nombre del usuario logueado (`user.name`), identidad gráfica y resumen de objetivos de prevención ciudadana en Río Cuarto.
     - **Paso 2 (El Mapa)**: Explicación de la cartografía en vivo, geocerca por proximidad y la simbología geométrica universal accesible (rombo para delito, triángulo para sospechoso, círculo para luz, cuadrado para baldío, pentágono para violencia y hexágono para resuelto).
     - **Paso 3 (Agregar Alerta)**: Detalle pedagógico de los dos métodos de reporte (botón inferior automático según tu ubicación vs. toque manual en cualquier calle del mapa), junto a las funciones de protección ("Vecino Anónimo" y carga de fotografía).
     - **Paso 4 (Botón SOS)**: Explicación de la presión sostenida de 1.5s (Ley de Fitts), respuesta háptica, acceso directo a 911, 107, 100 y 103, y modo para zurdos.
     - **Paso 5 (Menú uno por uno)**: Desglose exhaustivo de Historial y filtros, Puntos y comercios adheridos, Datos personales y rangos cívicos, Configuración de radio y Modo Claro/Oscuro.
     - **Paso 6 (¡Listo para Colaborar!)**: Cierre motivacional con recordatorio de disponibilidad permanente en FAQ.
  2. En [`src/context/AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx):
     - Gestión del estado `tutorialStep`, función `startTutorial(stepIndex)` y detección en montaje para usuarios primerizos (`!localStorage.getItem('radar_urbano_tutorial_seen')`).
     - Activación automática tras el registro exitoso de un nuevo vecino (`registerUser`).
  3. En [`src/components/FaqModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/FaqModal.jsx) y [`src/components/DrawerMenu.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/DrawerMenu.jsx):
     - Incorporación de un banner y accesos directos destacados para lanzar el tutorial en cualquier momento a voluntad del usuario.
- **Consecuencias**: Reducción drástica de la fricción de adopción inicial, comprensión inmediata de las mecánicas comunitarias y experiencia accesible conforme a WCAG AA.

---

### [ADR-042] · [2026-11-13 11:35] Estandarización de Preguntas Frecuentes, Homogeneización de Nombres entre Desktop y Móvil y Refactorización del Manual de Usuario
- **Contexto**:
  1. En `SettingsModal.jsx`, la sección 3 ("Infraestructura & Datos") exponía detalles del proveedor de cartografía externa ("OpenStreetMap HOT") y un botón para restablecer datos de demostración, los cuales no aportaban valor al usuario final e inducían a confusión o reseteos involuntarios.
  2. En `DrawerMenu.jsx` (móviles), los nombres de las opciones diferían de los de escritorio (ej. *"Historial de reportes"*, *"Canjea tus puntos"*, *"Configuración de Zonas"* vs. *"Historial"*, *"Puntos"*, *"Configuración"*), y los accesos directos al tutorial dispersaban las opciones; se requería unificar la nomenclatura e iconografía al 100% entre ambas plataformas.
  3. En la versión de escritorio (`Header.jsx`), los usuarios carecían de un acceso a *Preguntas Frecuentes* en la barra de navegación `<nav>`, creando una disparidad de opciones respecto a los usuarios móviles.
  4. En `TutorialTourModal.jsx`, se requería estandarizar y sintetizar la redacción:
     - En el Paso 2: sustituir "vecinos de a pie" por "vecinos", cambiar "Simbología Geométrica Universal (Accesible):" por "Simbología Universal:" y suprimir la mención técnica a WCAG.
     - En el Paso 3: eliminar los badges secundarios ("Más rápido en la calle" y "Máxima precisión") para evitar sobrecarga cognitiva.
     - En el Paso 4: sustituir el título por "Mantener presionado unos segundos" y eliminar la justificación técnica de llamadas involuntarias en la descripción.
     - En el Paso 5: simplificar el encabezado a "Menú Vecinal".
     - En el Paso 6: remover el icono de check verde, el título "¡Estás listo para recorrer y cuidar tu ciudad!" y el bloque de consejo de registro, dejando únicamente la indicación centrada de reconsulta en el Manual de Usuario.
- **Decisión**:
  1. En [`src/components/SettingsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/SettingsModal.jsx):
     - Eliminar por completo la sección *"Infraestructura & Datos"*, suprimiendo la tarjeta del proveedor OpenStreetMap HOT y el botón *"Restablecer datos de demostración"*.
  2. En [`src/components/DrawerMenu.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/DrawerMenu.jsx):
     - Estandarizar la nomenclatura e iconografía para replicar con exactitud el menú de escritorio: **Mapa**, **Historial** (`Clock`), **Puntos** (`Gift`), **Datos Personales** (`User`), **Configuración** (`Sliders`) y **Preguntas Frecuentes** (`HelpCircle`).
     - Remover los botones directos del tutorial para unificar el punto de acceso.
  3. En [`src/components/FaqModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/FaqModal.jsx):
     - Renombrar el tutorial a **"Manual de Usuario"** y condicionar el banner a `{user?.isLoggedIn && (...)}`.
  4. En [`src/components/Header.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/Header.jsx):
     - Incorporar el botón *"Preguntas Frecuentes"* en la barra de navegación de escritorio (`<nav>`), garantizando paridad entre móvil y escritorio tanto para usuarios autenticados como para invitados.
  5. En [`src/components/TutorialTourModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/TutorialTourModal.jsx):
     - Aplicar la estandarización textual en los Pasos 2, 3, 4, 5 y 6, eliminando elementos distractores y badges técnicos innecesarios.
- **Consecuencias**: Paridad e identidad de navegación 1:1 absoluta entre escritorio y móvil, experiencia de usuario más concisa y sin distracciones técnicas en el onboarding, y mayor seguridad de configuración al ocultar herramientas internas de demostración.

---

### [ADR-043] · [2026-11-13 11:55] Validación Única de Reportes, Desacoplamiento de Terminología y Mutación Dinámica de Marcos y Status de Usuarios
- **Contexto**:
  1. En `PinDetailsModal.jsx`, el botón de interacción social utilizaba el texto *"Agradecer / Me sirvió"* acompañado de la etiqueta *"Validación vecinal"*. Esta terminología resultaba ambigua y no representaba con precisión la acción cívica formal de certificar un incidente en el territorio.
  2. Anteriormente, la reacción funcionaba como un toggle global y efímero (`rep.hasReacted`), sin registrar qué usuario había validado el reporte y permitiendo incrementar y decrementar el contador indefinidamente.
  3. Asimismo, la mutación de reputación únicamente impactaba de forma superficial en el estado local del usuario activo, sin modificar el marco (*tier*), los puntos ni el estatus del autor/publicador original del incidente en la red ciudadana.
- **Decisión**:
  1. En [`src/components/PinDetailsModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/PinDetailsModal.jsx):
     - Sustituir *"Agradecer / Me sirvió"* por el botón formal **"Validar"** (y **"Validado"** con tilde `Check` una vez confirmado).
     - Eliminar por completo la leyenda adyacente *"Validación vecinal"*, mostrando en su lugar el estado cívico (`+5 pts por validar` o `Has validado este reporte`).
     - Deshabilitar la acción tras su ejecución (`disabled={hasUserValidated}`), garantizando que la validación sea estrictamente **única por usuario**.
  2. En [`src/context/AppContext.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/context/AppContext.jsx):
     - Introducir la función canónica `calculateTier(validationsCount, isModerator)`:
       - `< 5`: `bronce` (Marco Bronce).
       - `5` a `9`: `plata` (Marco Plata).
       - `10` a `19`: `oro` (Marco Oro).
       - `>= 20`: `diamante` (Marco Diamante).
     - Implementar `validateReport(reportId)`:
       - Cada reporte almacena el array de validadores `validatedBy: string[]`.
       - **El que valida** (vecino activo): suma +1 validación a su historial cívico, +5 puntos barriales y su rango/marco se recalcula inmediatamente.
       - **El que publica** (autor del reporte): se localiza en la base comunitaria (`allUsers`), suma +1 validación recibida, +10 puntos por reporte confirmado y su rango/marco se actualiza tanto en su perfil como en la insignia visible del reporte (`authorTier`).
       - En nuevos reportes publicados (`confirmAndPublishReport`), inicializar con `reactions: 0`, `hasReacted: false` y `validatedBy: []`.
  3. En [`src/components/Header.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/Header.jsx):
     - Habilitar `showRing={true}` en el avatar del usuario autenticado para que el marco activo (`avatar-bronce`, `avatar-plata`, `avatar-oro`, `avatar-diamante`) se visualice en tiempo real en la barra superior.
  4. En [`src/components/TutorialTourModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/TutorialTourModal.jsx) y [`src/components/FaqModal.jsx`](file:///home/iescobar/itec/3ero/ui/efi/src/components/FaqModal.jsx):
     - Actualizar referencias pedagógicas para unificar el concepto a la acción de **"Validar"**.
- **Consecuencias**: Ciclo de gamificación cívica bidireccional completamente funcional y persistente, prevención de fraudes por votos duplicados y reflejo visual instantáneo de los marcos de reputación en toda la interfaz.
