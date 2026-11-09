# Flujo de Trabajo: Ciclo DCU & Spec-Driven Development (SDD) — Radar Urbano

Este documento describe la metodología de trabajo para diseñar e implementar Radar Urbano, articulando el Diseño Centrado en el Usuario (DCU), la arquitectura de información validada por Card Sorting y el protocolo agéntico Gentle-AI (SDD).

---

## 🔄 El Ciclo Metodológico DCU ➔ SDD

```
[ 1. Investigación DCU ] ➔ [ 2. Prototipo Figma (42 pantallas) ] ➔ [ 3. SDD explore & propose ]
                                                                             │
[ 6. Software Vivo & DoD ] ⬅️ [ 5. SDD apply & verify ] ⬅️ [ 4. SDD tasks ] ⬅┘
```

1. **Investigación & DCU**: Comprensión profunda de los dolores de **Camila** (estudiante nocturna apresurada), **Don Roberto** (vecino diurno que busca claridad) e **Ignacio** (usuario zurdo que necesita ergonomía táctil).
2. **Card Sorting & Arquitectura de Información**: Organización de datos de la app en 4 pilares validados:
   - *Sección de Navegación*: Login, Registro, Mapa, Menú hamburguesa, Ajustes, Botón de pánico, Agregar alerta.
   - *Datos Configurables*: Ajuste de radio de alertas (5 km), Filtros por tipo, Avatar/Foto, Toggle GPS, Modo claro/oscuro.
   - *Datos Dinámicos*: Leyenda de reportes activos, Marco de reputación, Tiempo transcurrido, Historial, Descuentos disponibles, Comentarios.
   - *Datos Fijos*: Términos y condiciones, Preguntas frecuentes, Mensajes de confirmación.
3. **`sdd-explore` & `sdd-propose`**: Análisis de las 42 pantallas del prototipo de Figma y formulación de la solución técnica justificando el *Why antes del How*.
4. **`sdd-tasks`**: Desglose modular de componentes: Header, Canvas de Mapa vectorial, Marcadores SVG inclusivos, Bottom Sheet táctil, Flujo SOS y Modales de soporte.
5. **`sdd-apply`**: Implementación en `index.html`, `styles.css` y `app.js` respetando los 5 estados, accesibilidad WCAG y rendimiento.
6. **`sdd-verify`**: Comprobación rigurosa contra el Checklist de Calidad (DoD) y validación en emulador móvil (F12).

---

## ⚡ Flujo Adaptativo: Fast-Path vs Ciclo SDD Completo
- **Fast-Path (Fixes puntuales de 1 archivo o ajustes de texto/estilo)**:
  - Ejecución directa y precisa sin sobrecarga procesual.
  - Justificación concisa del Why y How en la respuesta.
- **Ciclo SDD Completo (Nuevos componentes o cambios estructurales > 2 archivos)**:
  - Requiere propuesta formal, diseño de componentes y aprobación previa antes de alterar el código base o los documentos de contexto.

---

## ✅ Criterio de Terminado (Definition of Done / DoD - 100 Puntos)
Para dar por concluida la entrega de Radar Urbano, se debe auditar exhaustivamente:

1. **Fidelidad UX/UI al Prototipo de Figma**: Coincidencia visual y de flujo con las pantallas de inicio, mapa de Río Cuarto, bottom sheet de reporte, pantalla SOS de emergencias, login/registro y comentarios.
2. **Ergonomía Mobile-First & Ley de Fitts**: Botón de Pánico flotante de gran tamaño ($\ge 64\text{px}$) accesible inmediatamente con el pulgar, con soporte para mano izquierda (zurdo).
3. **Responsiveness Estricto (F12)**: Verificación en anchos de 360px a 1080px sin desborde horizontal insospechado (`overflow-hidden`).
4. **Accesibilidad Universal (WCAG AA/AAA)**: 
   - Ratio de contraste $\ge 4.5:1$ en fondos oscuros y claros con la clase `.text-white` en botones de color sólido.
   - 100% operable mediante teclado (`Tab`, `Shift+Tab`, `Enter`, `Escape`) con indicador de foco de alto contraste (`ring-4 ring-yellow-400`).
   - Pines con iconos y formas diferenciadas (círculo, triángulo, cuadrado, pin) para usuarios con daltonismo.
5. **Feedback Háptico y Sensorial**: Activación de vibración (`navigator.vibrate`) y modales animados con tilde verde de confirmación inmediata al publicar reportes o emitir alertas SOS.
6. **Persistencia en Cliente**: Datos guardados en `localStorage` (reportes, comentarios vecinales, configuración de alertas y preferencias de tema).
7. **Memoria y Trazabilidad**: Todo cambio registrado en `docs/contexto/` y sincronizado en `.agents/memory/engram_memory.json`.
