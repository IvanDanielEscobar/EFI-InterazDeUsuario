# Convenciones de Diseño, UI Tokens y Código Accesible — Radar Urbano

## 1. Sistema de Color Semántico y Accesibilidad Visual
La paleta comunica significados inequívocos respetando estrictamente el ratio de contraste WCAG AA/AAA ($\ge 4.5:1$). Los reportes integran además formas geométricas e iconos SVG para no depender exclusivamente del color (accesibilidad para daltonismo y baja visión).

### Paleta de Categorías de Alerta
| Categoría | Token Hex / Tailwind | Forma / Icono Semántico | Uso en Interfaz |
| :--- | :--- | :--- | :--- |
| **Emergencia / Pánico (SOS)** | `#ef4444` (`red-500`) | Escudo con candado / pulso | Botón Flotante FAB, Pantalla Crítica SOS y llamadas directas. |
| **Robo / Delito** | `#dc2626` (`red-600`) | Triángulo de advertencia | Arrebato, robo a mano armada, merodeo en vehículos. |
| **Persona sospechosa** | `#f97316` (`orange-500`) | Ojo vigilante | Actitud sospechosa en paradas o esquinas desiertas. |
| **Iluminación rota** | `#f59e0b` (`amber-500`) | Bombilla apagada | Luminaria pública sin luz, esquinas a oscuras, peligro nocturno. |
| **Terreno Baldío** | `#0ea5e9` (`sky-500`) | Ubicación / cercado | Yuyal alto, baldío sin visibilidad, maleza peligrosa. |
| **Acoso / Violencia** | `#8b5cf6` (`violet-500`) | Siluetas en alerta | Acoso callejero, persecución o agresión física/verbal. |
| **Infraestructura** | `#3b82f6` (`blue-500`) | Llave / engranaje | Semáforo fuera de servicio, rotura de calzada peligrosa. |
| **Éxito / Confirmación** | `#10b981` (`emerald-500`) | Círculo con tilde | Modal de publicación exitosa y guardado de reportes. |

### Marcos de Reputación Vecinal (Gamificación Comunitaria)
| Rango | Token Hex | Condiciones | Beneficio / Rol |
| :--- | :--- | :--- | :--- |
| **Bronce** | `#b45309` (`amber-700`) | 1 a 4 reacciones | Usuario Nuevo en la red. |
| **Plata** | `#94a3b8` (`slate-400`) | 5 a 9 reacciones | Usuario Activo verificado. |
| **Oro** | `#eab308` (`yellow-500`) | 10 a 20 reacciones | Vecino Confiable del barrio. |
| **Diamante** | `#06b6d4` (`cyan-500`) | +20 reacciones | Referente Barrial validado por la comunidad. |

### Fondos y Modos de Visualización
- **Modo Oscuro (Predeterminado)**: `#020617` (`slate-950`) — Diseñado para uso nocturno, reduciendo el deslumbramiento de estudiantes que caminan de noche (Persona 1: Camila) y ahorrando batería.
- **Modo Claro**: `#f8fafc` (`slate-50`) — Diseñado para lectura bajo luz solar directa diurna para comerciantes y vecinos (Persona 2: Don Roberto).
- Cumplimiento estricto de WCAG AA/AAA en ambos modos mediante la clase `.text-white` en fondos oscuros y botones semánticos.

---

## 2. Escala Tipográfica Modular
Establece una jerarquía visual clara y legible en dispositivos móviles de cualquier gama:
- **Tipografía de Marca**: Google Fonts **Sedgwick Ave Display** — Identidad urbana y distintiva para el logo superior y encabezados principales.
- **Tipografía de Interfaz y Lectura**: Google Fonts **Albert Sans** — Diseñada con caracteres limpios y abiertas proporciones geométricas para lectura rápida en movimiento.

### Escala en Pantalla:
- **`h1` (Logo / Título Hero)**: `32px` (`2rem`) — Marca *"Radar Urbano"*.
- **`h2` (Títulos de Sección / Modales)**: `24px` (`1.5rem`) — Negrita (`font-bold`).
- **`h3` (Títulos de Alerta / InfoWindow)**: `18px - 20px` (`1.125rem` a `1.25rem`) — Seminegrita (`font-semibold`).
- **`body` (Descripciones, Textarea y Comentarios)**: `16px` (`1rem`) — Con interlineado amplio (`leading-relaxed`).
- **`caption` (Tiempos, Badges y Metadatos)**: `12px - 14px` (`0.75rem` a `0.875rem`).

---

## 3. Anatomía de Componentes: Los 5 Estados Obligatorios
Todo componente interactivo (`<button>`, inputs, selector de chips, tarjetas, switches) DEBE tener definidos y comprobados sus 5 estados:

1. **Default**: Apariencia visible con contraste nítido y elevación suave (`shadow-md`).
2. **Hover**: Incremento de escala y luminosidad al `105%` (`scale-105 brightness-110 duration-150`).
3. **Active**: Retroalimentación táctil de hundimiento al presionar (`scale-95 brightness-90`).
4. **Focus**: Anillo de foco de alto contraste mediante `:focus-visible` (`focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:outline-none`) para navegación por teclado (*Desafío Mano Atada*).
5. **Disabled**: Opacidad reducida al `50%` (`opacity-50`) y cursor `not-allowed` (`pointer-events-none`) cuando falte seleccionar la ubicación en el mapa o datos obligatorios.

---

## 4. Principios UX y Ergonomía Mobile-First
- **Ley de Fitts aplicada al Botón de Pánico (SOS)**: Ubicado en la zona inferior más rápida de presionar sin mirar la pantalla. Dimensiones mínimas de **64px × 64px** con ícono claro de escudo y texto "SOS".
- **Soporte Ergonómico para Zurdos (Persona 3: Ignacio)**: El botón flotante permite alternar o reposicionarse hacia la izquierda inferior para operar con una sola mano izquierda sin tensión muscular.
- **Feedback Háptico Inmediato**: Disparo de vibración nativa del dispositivo (`navigator.vibrate([150, 80, 150])` en SOS y `[100]` al confirmar reporte) para dar tranquilidad y certeza de transmisión del alerta aun con la pantalla fuera del foco visual.
- **Confirmación en 2 Pasos con Prevención de Pánico Accidental**: Modal de confirmación "¿Está seguro que desea enviar el reporte?" para evitar falsas alarmas comunitarias.
