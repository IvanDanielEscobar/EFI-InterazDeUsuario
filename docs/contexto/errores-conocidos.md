# Registro de Errores Conocidos, Gotchas de UX & Accesibilidad — Radar Urbano

Este documento recopila las trampas de desarrollo, errores frecuentes de maquetado y lecciones aprendidas para blindar la interfaz contra regresiones.

---

## 📱 1. Desborde Horizontal del Mapa en Móviles (Overflow Gotcha)
- **Problema**: El renderizado del mapa y las capas de pines dinámicos o tooltips generan scroll horizontal accidental en celulares, arruinando la navegación con una sola mano (Persona 1: Camila).
- **Solución Mandatoria**: Envolver el mapa en un contenedor `relative w-full h-full overflow-hidden`, y forzar `overflow-x: hidden` en el elemento `body` y contenedores raíz de la aplicación.

---

## 🎨 2. Trampa de Contraste en Botones Rojos y Modos Claro/Oscuro
- **Problema**: Al alternar entre modo oscuro y modo claro, los botones rojos de alerta y pánico (`bg-red-600`, `bg-red-500`) pueden heredar color de texto gris o negro del cuerpo en modo claro, destruyendo el contraste y violando la norma WCAG AA.
- **Solución Mandatoria**: Aplicar siempre de forma explícita la clase utilitaria `text-white` (o la regla `.force-text-white { color: #ffffff !important; }`) en todos los botones de emergencia, pánico SOS y badges con fondo de color saturado.

---

## 🛡️ 3. Solapamiento del Botón Flotante de Pánico (FAB Collision)
- **Problema**: Al abrirse el Bottom Sheet de reporte o la barra de filtros, el botón flotante de pánico puede quedar tapado o peor aún, solapar botones críticos como "Enviar" o "Cancelar", impidiendo la interacción táctil.
- **Solución Mandatoria**:
  - Controlar capas de profundidad con `z-index` semánticos (`z-30` para FAB, `z-40` para Bottom Sheet y `z-50` para modales de confirmación o pantalla completa SOS).
  - En móviles, ajustar el padding inferior (`pb-24`) de los paneles para que ningún botón de acción quede cubierto por el FAB.

---

## ⌨️ 4. Marcadores no Semánticos e Inaccesibles por Teclado
- **Problema**: Crear pines en el mapa utilizando elementos `<div>` o `<span>` con evento `onclick`, volviéndolos invisibles para lectores de pantalla y completamente inoperables para navegación mediante tecla `Tab` (*Desafío de la Mano Atada*).
- **Solución Mandatoria**: Maquetar todo pin o marcador interactivo como un `<button type="button">` nativo (o añadir explícitamente `role="button"` y `tabindex="0"`), incorporando atributo `aria-label` descriptivo (ej: `aria-label="Alerta de Robo en parada de colectivo, hace 10 minutos"`).

---

## 📳 5. Excepción no Controlada en `navigator.vibrate`
- **Problema**: Algunos navegadores de escritorio o contextos sin interacción de usuario previa lanzan errores o ignoran llamadas a la Vibration API.
- **Solución Mandatoria**: Envolver siempre el disparo en una verificación segura de capacidad:
  ```javascript
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate([150, 80, 150]);
    } catch (e) {
      // Degradación elegante silenciosa
    }
  }
  ```

---

## 🚪 6. Atrapamiento en Modales y Diálogos
- **Problema**: Modales de confirmación o de recuperación de contraseña que no pueden cerrarse al tocar fuera o presionar la tecla `Escape`.
- **Solución Mandatoria**: Escuchar el evento de teclado `Escape` a nivel global en `document`, permitir clic en el backdrop oscuro exterior y proveer un botón de cierre con área táctil mínima de 44px (`min-h-[44px] min-w-[44px]`).

---

## 🔄 7. Stale Closure en Listeners de Leaflet (`map.on('click')`) y Guardas de Autenticación
- **Problema**: Al inicializar la instancia cartográfica de Leaflet en un `useEffect(..., [])`, registrar listeners como `map.on('click', ...)` capturaba la versión inicial de `startReportAtLocation` creada en el montaje (donde `user.isLoggedIn` era `false`). Tras iniciar sesión o registrarse, el listener de Leaflet continuaba invocando la clausura desactualizada, enviando erróneamente al usuario logueado de vuelta al formulario de login con la advertencia de requerimiento de autenticación. De igual manera, al cargar una sesión previa de `localStorage`, la falta de un flag booleano explícito provocaba que usuarios existentes fueran catalogados como no logueados.
- **Solución Mandatoria**:
  1. En componentes con listeners persistentes de terceros (Leaflet, WebSockets, DOM directo), utilizar siempre un `useRef` mutable (`startReportRef.current = startReportAtLocation`) que se actualice sincrónicamente en cada render.
  2. En el Provider de estado global (`AppContext`), mantener una referencia sincrónica `userRef.current = user` y consultar el estado de autenticación a través de dicha referencia para garantizar lecturas siempre frescas en callbacks asíncronos y eventos diferidos.
  3. En la inicialización desde `localStorage`, preservar la sesión activa si el objeto de usuario existe y no fue explícitamente cerrado (`parsed.isLoggedIn !== false`).
  4. Sincronizar de forma inmediata `userRef.current`, `setUser` y `localStorage.setItem` en las funciones `loginUser` y `registerUser`.
