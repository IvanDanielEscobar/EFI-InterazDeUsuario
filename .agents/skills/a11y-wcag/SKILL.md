---
name: a11y-wcag
description: Guía de accesibilidad web estricta WCAG AA, prueba de la mano atada por teclado, contraste 4.5:1 y modales con foco atrapado.
---

# Skill: Accesibilidad Web (WCAG AA & Teclado)

Directivas obligatorias para garantizar accesibilidad universal (especialmente para Kevin con guantes y Xylar con visión fotosensible):

## 1. Prueba de la Mano Atada (Operabilidad por Teclado)
- Todo elemento accionable debe ser alcanzable mediante `Tab` y `Shift + Tab`.
- La activación se realiza con `Enter` o `Space`.
- El indicador de foco debe ser siempre distinguible mediante anillo `:focus-visible`.

## 2. Diálogos Modales Accesibles
```javascript
// Patrón de apertura de modal accesible
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.remove('hidden');
  
  // Guardar foco previo
  window.lastActiveElement = document.activeElement;
  
  // Enfocar el primer botón del modal
  const firstFocusable = modal.querySelector('button, [href], input');
  if (firstFocusable) firstFocusable.focus();
  
  // Escuchar tecla Escape
  document.addEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') closeModal();
}
```

## 3. Verificación de Contraste (4.5:1)
- Texto normal: Contraste mínimo de 4.5:1 contra el fondo.
- Texto grande / encabezados: Contraste mínimo de 3.0:1.
- Uso obligatorio de la clase `.force-text-white` en botones de acento.
