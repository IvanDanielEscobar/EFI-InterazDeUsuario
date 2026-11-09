---
name: vanilla-dom-reactive
description: Patrones de interactividad en JavaScript Vanilla nativo con localStorage, cálculo reactivo en Créditos Lunares y manipulación limpia del DOM.
---

# Skill: Dinamismo DOM & Persistencia Reactiva

Buenas prácticas para manipulación del DOM y persistencia en cliente sin dependencias pesadas:

## 1. Persistencia con Claves Canónicas
```javascript
const STORAGE_KEYS = {
  ORDERS: 'rocket_pizza_orders',
  CART: 'rocket_pizza_cart',
  THEME: 'rocket_pizza_theme'
};

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  } catch {
    return [];
  }
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}
```

## 2. Cálculo Reactivo de Créditos Lunares (CL)
```javascript
function updateCartUI(cartItems) {
  const totalCL = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDisplay = document.getElementById('cart-total-cl');
  if (totalDisplay) {
    totalDisplay.textContent = `${totalCL.toLocaleString()} CL`;
  }
}
```

## 3. Prevención de Recarga y Feedback Visual
- Uso estricto de `event.preventDefault()` en el formulario de teletransporte.
- Notificaciones de éxito/error mediante modales o toasts temporizados sin parpadeo de pantalla.
