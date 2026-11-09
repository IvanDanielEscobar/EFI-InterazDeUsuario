# Glosario del Dominio y Rotulado UX (Labeling) — Radar Urbano

Este documento define el vocabulario del producto y los componentes de interfaz, garantizando un rotulado en lenguaje natural comprensible para los ciudadanos y estudiantes de Río Cuarto (Clase 7 de UX).

---

## 📖 Términos del Dominio del Producto
- **Radar Urbano**: Red vecinal colaborativa de prevención y seguridad ciudadana en tiempo real, enfocada en la protección comunitaria en Río Cuarto durante desplazamientos nocturnos y cotidianos.
- **Reporte / Alerta**: Incidente o deficiencia urbana señalizada en el mapa (ej. robos, personas sospechosas, luminarias rotas, baldíos peligrosos, violencia/acoso, semáforos fuera de servicio).
- **Botón de Pánico (SOS)**: Control crítico de emergencia flotante y de acceso inmediato mediante la Ley de Fitts, destinado a situaciones de peligro inminente con notificación a la red y acceso a servicios esenciales (911 Policía, 107 Médicas, 103 Defensa Civil, 100 Bomberos).
- **Verificación Vecinal ("Me sirvió")**: Mecanismo de validación social y comunitaria donde otros vecinos confirman la veracidad o utilidad del reporte de una zona de riesgo.
- **Sistema de Reputación Vecinal**: Gamificación ciudadana que otorga marcos de color dinámicos al avatar del usuario según el impacto positivo de sus reportes:
  - 🟤 **Bronce**: 1 a 4 reacciones (Usuario Nuevo).
  - ⚪ **Plata**: 5 a 9 reacciones (Usuario Activo).
  - 🟡 **Oro**: 10 a 20 reacciones (Vecino Confiable).
  - 💎 **Diamante**: +20 reacciones (Referente Barrial).
- **Canje de Puntos**: Programa de beneficios en comercios locales adheridos (ej. Kioscos barriales, servicios de cercanía) para incentivar la participación cívica solidaria.
- **Zonas de Interés / Avisos**: Configuración de radios geográficos prioritarios (como "Universidad" o "Casa") para recibir avisos push preventivos en un perímetro de hasta 5 km a la redonda.

---

## 🏷️ Rotulado de Interfaz (UX Natural vs Dev Mindset)

| Rotulado Erróneo (Dev Jargon) | Rotulado Correcto (UX Natural / Empático) | Ubicación / Componente | Justificación UX (Clase 7 UX) |
| :--- | :--- | :--- | :--- |
| `Trigger_Alert_API` | **Botón de Pánico (SOS)** | Botón Flotante (FAB) inferior | Lenguaje directo, urgente y universal en situaciones de estrés extremo. |
| `POST_Geolocated_Marker` | **Reportar Alerta / Fijar Pin** | Barra de acción principal | Término centrado en la acción física e intuitiva sobre el mapa. |
| `Layer_Data_Map` | **Zonas de Riesgo / Mapa de Zonas** | Selector de Capas / Filtros | Hace visible el beneficio de seguridad y no la estructura de datos. |
| `GPS_Tracking_Active` | **Ubicación en Tiempo Real** | Header / Toggle de Georreferencia | Da tranquilidad y transparencia sobre el permiso de geolocalización. |
| `Execute_User_Auth` | **Iniciar Sesión / Crear una cuenta** | Navbar / Menú de acceso | Directo y estándar sin tecnicismos informáticos. |
| `User_Reputation_Score` | **Nivel de Vecino (Bronce/Plata/Oro/Diamante)** | Perfil y Tarjetas | Incentiva la confianza barrial mediante gamificación comprensible. |
| `Push_Subscription_Radius` | **Avisos a la redonda (hasta 5 km)** | Configuración de Zonas | Entendible para cualquier vecino sin conocimientos geodésicos. |

---

## 🧩 Componentes de Interfaz de Usuario
- **Header / Navbar**: Barra superior con la marca en tipografía *Sedgwick Ave Display*, indicador visual del estado del GPS (Activo/Inactivo), alternador de Modo Oscuro/Claro (predeterminado Oscuro para uso nocturno), acceso al Perfil y disparador del Menú Lateral.
- **Mapa Interactivo (Río Cuarto)**: Vista central en lienzo vectorial/raster que renderiza calles (ej. Dr. C. J. Rodríguez, Río Segundo, 11 de Noviembre), comercios adheridos (Kiosco la familia) y pines con colores y formas inclusivas (círculo, triángulo, cuadrado, pin) para accesibilidad daltónica.
- **Botón Flotante de Pánico (FAB)**: Botón de gran escala ($\ge 64\text{px}$) situado en la zona de barrido del pulgar (Ley de Fitts), configurable/reubicable para usuarios zurdos, con confirmación inmediata y pantalla SOS de llamadas de auxilio.
- **Bottom Sheet / Panel Desplegable de Reporte**: Modal táctil inferior que se abre al tocar un punto del mapa para clasificar la alerta mediante iconos semánticos, añadir una breve referencia y confirmar con prevención de errores en 2 pasos.
- **Tarjeta de Reporte / InfoWindow**: Tarjeta interactiva sobre el pin que muestra la categoría con badge de color y forma, tiempo transcurrido (ej. "Hace 10 min"), descripción, foto opcional, validación comunitaria ("A 3 vecinos les sirvió") e hilo de comentarios entre vecinos.
- **Chips de Filtro Rápido**: Botonera horizontal para conmutar categorías de alertas con un solo toque (Todos, Robos, Luminarias, Baldíos, Sospechoso, Acoso).
- **Toast / Diálogo de Feedback Inmediato**: Mensaje modal animado con ícono de tilde de confirmación y feedback háptico (`navigator.vibrate`) que brinda alivio y certidumbre al usuario.
