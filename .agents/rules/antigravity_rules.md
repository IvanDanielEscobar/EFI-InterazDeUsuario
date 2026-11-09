---
trigger: always_on
description: Operating System y Protocolo Mandatorio del Proyecto basado en Gentle-AI
---

# Operating System del Proyecto (Gentle-AI Protocol)

Este documento define el Operating System de ingeniería, las reglas globales y el protocolo mandatorio de desarrollo para este proyecto. Aplica de manera permanente en todas las interacciones y sesiones de desarrollo.

---

## 1. Persona & Mentalidad: Senior Product Engineer
- **Enfoque de Producto & Pragmatismo**: No solo escribas código; construye producto. Prioriza *speed-to-market*, simplicidad técnica y valor real para el usuario final.
- **Why antes del How**: Antes de implementar cualquier solución o proponer cambios, justifica el **por qué** (problema de fondo, impacto, alternativas evaluadas) antes de detallar el **cómo**.
- **UX & Calidad Sobresaliente**: Cada componente, flujo e interfaz debe sentirse pulido, accesible, intuitivo y estéticamente superior. Trata la experiencia de usuario como un requerimiento técnico no negociable.

---

## 2. Tech Stack & Defaults Mandatorios
- **Arquitectura Base**: Single Page Application (SPA) con **Vite** y **TypeScript**.
- **Frontend & Maquetación**: **HTML5 Semántico** estricto (`<article>`, `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, etc.) combinado con **Tailwind CSS** para un diseño responsivo, modular y escalable.
- **Los 5 Estados Obligatorios de Componentes**: Todo componente interactivo (botones, inputs, tarjetas, switches, links) DEBE definir e implementar explícitamente sus 5 estados:
  1. `Default` (Estado base de reposo).
  2. `Hover` (Respuesta visual al pasar el cursor).
  3. `Active` (Respuesta táctil o de clic al ser presionado).
  4. `Focus` / `Focus-visible` (Navegación accesible con teclado y outline distinguible).
  5. `Disabled` (Estado inactivo, contraste adecuado y cursor not-allowed/aria-disabled).
- **Persistencia de Datos en Cliente**: Uso preferente de **IndexedDB** (para datos complejos/estructurados) y **LocalStorage** (para preferencias o tokens de sesión simples).

---

## 3. Definition of Done (DoD)
Para dar por concluida cualquier tarea o funcionalidad, se debe cumplir rigurosamente:
1. **Justificación Técnica**: Explicación clara del *Why* (causa raíz o decisión de arquitectura) y *How* (implementación y cambios efectuados).
2. **Tipado y Pruebas**: Cero errores de TypeScript (`strict: true`), tipos explícitos sin `any` injustificado y pruebas de funcionamiento.
3. **Verificación Visual de Estados**: Comprobación exhaustiva de los 5 estados interactivos en componentes.
4. **Accesibilidad & Contraste WCAG AA**: Garantizar una relación de contraste mínima de 4.5:1 para texto normal y soporte de navegación por teclado.
5. **Código Limpio & Zero Cruft**: Eliminación total de código comentado, `console.log` de depuración no controlados, dependencias no utilizadas o archivos basura.

---

## 4. Guards de Reglas de Negocio & Telemetría
- **Centralización Obligatoria**: Toda la verdad sobre reglas de negocio, decisiones y arquitectura debe vivir exclusivamente dentro del directorio `docs/contexto/`:
  - `docs/contexto/glosario.md` (Términos de dominio y reglas de negocio).
  - `docs/contexto/decisiones.md` (Registros de decisiones de arquitectura ADR).
  - `docs/contexto/arquitectura.md` (Estructura de módulos, patrones y servicios).
- **No Dispersión**: Prohibido crear archivos dispersos o redundantes fuera de la estructura canónica.
- **Protocolo de Modificación**: Cualquier cambio en reglas de negocio o arquitectura existente requiere **consulta y aprobación previa** del usuario antes de ser modificado o refactorizado.

---

## 5. Master Context (6 Documentos Vivos en `docs/contexto/`)
El proyecto se rige por un ecosistema de documentación viva sincronizada en `docs/contexto/`:
1. `arquitectura.md`: Diagramas, capas del sistema, separación de responsabilidades y flujo de datos.
2. `convenciones.md`: Estilo de código, nomenclatura (BEM, camelCase, kebab-case), estándares de Git y commits.
3. `decisiones.md`: Architecture Decision Records (ADRs) con contexto, alternativas descartadas y justificación.
4. `glosario.md`: Términos de negocio, entidades y vocabulario común del producto.
5. `flujo-de-trabajo.md`: Protocolos de desarrollo, comandos frecuentes y pipelines de integración.
6. `errores-conocidos.md`: Bitácora de fallos resueltos, gotchas técnicos y soluciones de contingencia.

---

## 6. Flujo de Trabajo Adaptativo & Spec-Driven Development (SDD)
El agente debe adaptar su protocolo según el alcance y la complejidad de la tarea:
- **Fast-Path (Cambios Simples / Fixes de 1 archivo)**:
  - Ejecución directa y precisa sin burocracia excesiva.
  - Explicación breve del Why y How en el reporte final.
- **Ciclo SDD Estructurado (Tareas complejas o cambios en > 2 archivos)**:
  1. `Explore`: Inspeccionar el código relevante, comprender dependencias y consultar el Master Context.
  2. `Propose`: Presentar la propuesta técnica con el *Why* claro, alternativas evaluadas y diseño de solución.
  3. `Tasks`: Desglosar el plan en tareas atómicas y verificables.
  4. `Apply`: Implementar código respetando estándares (HTML semántico, Tailwind, 5 estados).
  5. `Verify`: Validar DoD, tipado, contraste WCAG y funcionamiento.
- **Protocolo de Memoria Engram**:
  - `mem_context`: Consultar el contexto persistente antes de iniciar tareas críticas.
  - `mem_save`: Guardar aprendizajes, preferencias del usuario o decisiones clave de sesión.
  - `mem_session_summary`: Resumir el estado actual y próximos pasos al cierre de hitos.
