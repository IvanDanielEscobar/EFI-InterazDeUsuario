import React, { useEffect, useRef, useState } from 'react';
import { useApp, calculateDistanceKm, RIO_CUARTO_CENTER } from '../context/AppContext';
import { Plus, ChevronDown, ChevronUp, Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import PanicButton from './PanicButton';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapCanvas() {
  const {
    reports,
    activeFilter,
    setActiveFilter,
    config,
    alertRadiusKm,
    startReportAtLocation,
    setSelectedReportId,
    setActiveModal,
    showToast,
    triggerHaptic,
    centerTrigger,
    focusLocationTrigger
  } = useApp();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [isRefExpanded, setIsRefExpanded] = useState(false);

  // Filtrado de reportes
  const filteredReports = activeFilter === 'todos'
    ? reports
    : reports.filter((r) => r.type === activeFilter);

  // Generador de iconos SVG según tipo y forma configurada
  const getMarkerHtml = (report) => {
    const isResolved = report.status === 'resuelto' || report.isResolved;

    let iconSvg = '';
    switch (report.type) {
      case 'delito':
        iconSvg = `<svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>`;
        break;
      case 'sospechoso':
        iconSvg = `<svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
        break;
      case 'luz':
        iconSvg = `<svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>`;
        break;
      case 'baldio':
        iconSvg = `<svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
        break;
      case 'acoso':
        iconSvg = `<svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`;
        break;
      default:
        iconSvg = `<svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
    }

    const shapeClass = config.pinShape === 'square'
      ? 'rounded-xl'
      : config.pinShape === 'triangle'
      ? 'rounded-t-2xl rounded-b-md'
      : 'rounded-full';

    // Fondo: gris si está solucionado, o color de categoría si está activo
    const bgClass = isResolved
      ? 'bg-slate-500 text-slate-100 border-2 border-slate-300 dark:border-slate-600 shadow-md'
      : `${report.badgeBg} text-white shadow-xl border-2 border-white dark:border-slate-900`;

    // Indicador: tilde check verde si está resuelto, o ! rojo titilante si está activo
    const badgeHtml = isResolved
      ? `
        <span class="absolute -top-1 -right-1 flex h-4 w-4">
          <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white dark:border-slate-900 text-white text-[9px] font-black items-center justify-center shadow-xs">✓</span>
        </span>
      `
      : `
        <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-400 border border-white text-[9px] font-bold text-slate-900 items-center justify-center">!</span>
        </span>
      `;

    return `
      <div class="relative group cursor-pointer transition-transform hover:scale-125 active:scale-95" title="${isResolved ? 'Reporte Solucionado' : 'Alerta Activa'}: ${report.title || ''}">
        <div class="w-9 h-9 sm:w-10 sm:h-10 ${bgClass} ${shapeClass} flex items-center justify-center">
          ${iconSvg}
          ${badgeHtml}
        </div>
      </div>
    `;
  };

  // 1. Inicializar Mapa con Proveedor Único: OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: RIO_CUARTO_CENTER,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Único proveedor de teselas: OpenStreetMap HOT (Río Cuarto completo, 100% libre)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Al tocar cualquier calle, abre el formulario de reporte geolocalizado y cierra popovers
    map.on('click', (e) => {
      setIsRefExpanded(false);
      const { lat, lng } = e.latlng;
      startReportAtLocation({
        lat,
        lng,
        x: 50,
        y: 50
      });
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Pintar marcadores de incidentes y ubicación del usuario
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    const activeRadiusKm = alertRadiusKm || Number(config.alertRadius) || 1;

    // A) Delimitación visual: Geocerca circular de prevención según distancia configurada
    const radiusMeters = activeRadiusKm * 1000;
    L.circle(RIO_CUARTO_CENTER, {
      radius: radiusMeters,
      color: '#f59e0b',
      weight: 1.5,
      opacity: 0.65,
      fillColor: '#f59e0b',
      fillOpacity: 0.05,
      dashArray: '6, 8',
      interactive: false
    }).addTo(layer);

    // B) Delimitación geográfica de incidentes: Solo activos dentro del radio (o resueltos)
    const reportsToRender = filteredReports.filter((report) => {
      const isResolved = report.status === 'resuelto' || report.isResolved;
      if (isResolved) return true; // Mostrar resueltos para auditoría
      const lat = report.lat || (RIO_CUARTO_CENTER[0] + (report.y - 50) * 0.0003);
      const lng = report.lng || (RIO_CUARTO_CENTER[1] + (report.x - 50) * 0.0003);
      const distKm = calculateDistanceKm(RIO_CUARTO_CENTER[0], RIO_CUARTO_CENTER[1], lat, lng);
      return distKm <= activeRadiusKm;
    });

    reportsToRender.forEach((report) => {
      const lat = report.lat || (RIO_CUARTO_CENTER[0] + (report.y - 50) * 0.0003);
      const lng = report.lng || (RIO_CUARTO_CENTER[1] + (report.x - 50) * 0.0003);

      const customIcon = L.divIcon({
        className: 'bg-transparent border-none',
        html: getMarkerHtml(report),
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(layer);
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedReportId(report.id);
        setActiveModal('pinDetail');
        triggerHaptic([40]);
      });
    });

    // C) Baliza de Ubicación del Usuario
    const userBeaconHtml = `
      <div class="w-12 h-12 -ml-3 -mt-3 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse pointer-events-none">
        <div class="w-7 h-7 rounded-full bg-blue-500/40 flex items-center justify-center">
          <div class="w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-600 shadow-xl"></div>
        </div>
      </div>
    `;
    const userBeaconIcon = L.divIcon({
      className: 'bg-transparent border-none',
      html: userBeaconHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    L.marker(RIO_CUARTO_CENTER, { icon: userBeaconIcon, interactive: false }).addTo(layer);
  }, [filteredReports, config.pinShape, config.alertRadius, alertRadiusKm]);

  // 3. Centrado disparado externamente ("Mi Ubicación" / Header)
  useEffect(() => {
    if (centerTrigger > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(RIO_CUARTO_CENTER, 16, { duration: 1 });
    }
  }, [centerTrigger]);

  // Centrado en un reporte específico desde el Historial
  useEffect(() => {
    if (focusLocationTrigger && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [focusLocationTrigger.lat, focusLocationTrigger.lng],
        17,
        { duration: 1.2 }
      );
    }
  }, [focusLocationTrigger]);

  // Controles de zoom y centrado
  const handleZoomIn = (e) => {
    e.stopPropagation();
    mapInstanceRef.current?.zoomIn();
    triggerHaptic([20]);
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    mapInstanceRef.current?.zoomOut();
    triggerHaptic([20]);
  };

  const handleResetLocation = (e) => {
    e.stopPropagation();
    mapInstanceRef.current?.flyTo(RIO_CUARTO_CENTER, 16, { duration: 1 });
    triggerHaptic([40]);
    showToast('Centrado en Río Cuarto (Plaza Roca / Microcentro)', 'info');
  };

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      {/* Contenedor del Mapa OpenStreetMap a pantalla completa */}
      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 z-0 cursor-grab active:cursor-grabbing bg-slate-950"
        aria-label="Mapa interactivo OpenStreetMap de Río Cuarto"
      />

      {/* Controles de Zoom y Centrado Flotantes */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          className="btn-interactive w-9 h-9 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700/80 shadow-xl flex items-center justify-center backdrop-blur-sm"
          aria-label="Acercar mapa"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="btn-interactive w-9 h-9 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700/80 shadow-xl flex items-center justify-center backdrop-blur-sm"
          aria-label="Alejar mapa"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetLocation}
          className="btn-interactive w-9 h-9 rounded-xl bg-slate-900/90 text-blue-400 hover:bg-slate-800 border border-slate-700/80 shadow-xl flex items-center justify-center backdrop-blur-sm"
          aria-label="Re-centrar en Río Cuarto"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Indicador Flotante Superior de Guía */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-full shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 pointer-events-none backdrop-blur-xs whitespace-nowrap">
        <span>👉 Pulsa donde quieres reportar</span>
      </div>

      {/* Dock Inferior Unificado: [Card Unificada: Referencias + Agregar Alerta] y [Botón SOS] */}
      <div className={`absolute bottom-4 sm:bottom-6 inset-x-3 sm:inset-x-5 z-30 flex items-start justify-between pointer-events-none ${
        config.isLeftHanded ? 'flex-row-reverse' : 'flex-row'
      }`}>
        {/* Contenedor Unificado: Popover + Pastilla Segmentada */}
        <div className="relative pointer-events-auto">
          {/* Popover Desplegable de Referencias (Abre hacia arriba directamente pegado a la card) */}
          {isRefExpanded && (
            <div className={`absolute bottom-full mb-2 ${config.isLeftHanded ? 'right-0' : 'left-0'} z-30 bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-slate-700/80 text-xs backdrop-blur-md w-48 sm:w-52 animate-in fade-in zoom-in-95 duration-150`}>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
                <div className="flex items-center gap-1.5 font-extrabold uppercase text-[10px] text-amber-400 tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Referencias</span>
                </div>
                {activeFilter !== 'todos' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter('todos');
                    }}
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    Ver todos
                  </button>
                )}
              </div>
              <ul className="space-y-1.5 text-[11px]">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(activeFilter === 'delito' ? 'todos' : 'delito');
                  }}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-colors ${
                    activeFilter === 'delito' ? 'bg-red-500/20 font-bold text-red-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                  <span>Robo/Delito</span>
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(activeFilter === 'sospechoso' ? 'todos' : 'sospechoso');
                  }}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-colors ${
                    activeFilter === 'sospechoso' ? 'bg-orange-500/20 font-bold text-orange-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  <span>Persona Sospechosa</span>
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(activeFilter === 'luz' ? 'todos' : 'luz');
                  }}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-colors ${
                    activeFilter === 'luz' ? 'bg-amber-500/20 font-bold text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Iluminación Rota</span>
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(activeFilter === 'baldio' ? 'todos' : 'baldio');
                  }}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-colors ${
                    activeFilter === 'baldio' ? 'bg-sky-500/20 font-bold text-sky-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  <span>Baldío peligroso</span>
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(activeFilter === 'acoso' ? 'todos' : 'acoso');
                  }}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-colors ${
                    activeFilter === 'acoso' ? 'bg-violet-500/20 font-bold text-violet-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
                  <span>Acoso/Violencia</span>
                </li>
                <li className="flex items-center gap-2 p-1 pt-1.5 border-t border-slate-800 text-slate-300">
                  <span className="relative flex h-3.5 w-3.5 shrink-0">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-500 flex items-center justify-center text-[8px] font-black text-white">
                      ✓
                    </span>
                  </span>
                  <span className="text-slate-400">Resuelto / Solucionado</span>
                </li>
              </ul>
            </div>
          )}

          {/* Pastilla Unificada con Dos Segmentos Distintos y Altura Armonizada */}
          <div className="flex items-center h-[54px] sm:h-[58px] bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-2xl backdrop-blur-md overflow-hidden">
            {/* Segmento 1: Referencias */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsRefExpanded(!isRefExpanded);
              }}
              className={`h-full flex items-center gap-1.5 px-3 sm:px-3.5 text-xs font-bold transition-all focus-visible:outline-none whitespace-nowrap ${
                isRefExpanded
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 active:bg-slate-800'
              }`}
              aria-label="Abrir o cerrar referencias de alertas"
            >
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Referencias</span>
              {isRefExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {/* Separador Visual Vertical Distinguible */}
            <div className="h-6 w-px bg-slate-700/80 shrink-0" aria-hidden="true" />

            {/* Segmento 2: Agregar Alerta */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startReportAtLocation({
                  lat: RIO_CUARTO_CENTER[0],
                  lng: RIO_CUARTO_CENTER[1],
                  x: 50,
                  y: 50
                });
              }}
              className="btn-interactive h-full flex items-center gap-1.5 px-3.5 sm:px-4 hover:bg-slate-800/80 active:bg-slate-800 text-white font-extrabold text-xs sm:text-sm transition-all focus-visible:outline-none whitespace-nowrap"
              aria-label="Iniciar reporte de nueva alerta"
            >
              <Plus className="w-4 h-4 text-emerald-400 stroke-[3] shrink-0" />
              <span>Agregar Alerta</span>
            </button>
          </div>
        </div>

        {/* Botón Flotante SOS */}
        <div className="pointer-events-auto">
          <PanicButton />
        </div>
      </div>
    </div>
  );
}
