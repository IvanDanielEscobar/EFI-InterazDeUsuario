---
name: tailwind-ui
description: Guía y utilidades para maquetación ágil con Tailwind CSS v3 CDN, paleta espacial personalizada, modo oscuro/claro y los 5 estados obligatorios.
---

# Skill: Tailwind UI Espacial (Rocket Pizza Lunar)

Esta skill proporciona patrones y directivas para maquetar interfaces responsivas con Tailwind CSS v3 vía CDN:

## 1. Configuración de Paleta Espacial
```javascript
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        propulsion: {
          DEFAULT: '#9333ea',
          light: '#c084fc',
          dark: '#7e22ce'
        },
        laser: '#06b6d4',
        credits: '#fbbf24',
        space: '#020617',
        nebula: '#f8fafc'
      }
    }
  }
}
```

## 2. Implementación de los 5 Estados
```html
<button type="button" class="
  bg-propulsion text-white font-bold py-3 px-6 rounded-xl
  shadow-lg shadow-purple-900/30
  hover:-translate-y-0.5 hover:shadow-purple-500/50 hover:bg-propulsion-light
  active:scale-95 active:translate-y-0
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-laser focus-visible:ring-offset-2 focus-visible:ring-offset-space
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  transition-all duration-200 force-text-white min-h-[48px]
">
  Lanzar Pedido
</button>
```

## 3. Principio Mobile-First
- Por defecto: 1 columna táctil espaciosa para Kevin (`grid-cols-1 gap-6`).
- Desktop: 3 columnas (`md:grid-cols-3`).
