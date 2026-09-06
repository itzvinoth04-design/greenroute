import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RoutePlanResult, ScoredRouteOption } from '../types';

interface MapViewProps {
  routePlan: RoutePlanResult | null;
  selectedRoute: ScoredRouteOption | null;
  onSelectRoute: (route: ScoredRouteOption) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  routePlan,
  selectedRoute,
  onSelectRoute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai, Tamil Nadu, India
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers and polylines whenever routePlan or selectedRoute changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    if (!routePlan || !routePlan.routes || routePlan.routes.length === 0) {
      return;
    }

    const { origin, destination, routes } = routePlan;

    // Custom Origin Icon (Green Pin)
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #10b981; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          A
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Custom Destination Icon (Red Pin)
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          B
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add Start and End Markers
    L.marker([origin.lat, origin.lng], { icon: originIcon })
      .bindPopup(`<strong>Origin:</strong> ${origin.name}`)
      .addTo(layers);

    L.marker([destination.lat, destination.lng], { icon: destIcon })
      .bindPopup(`<strong>Destination:</strong> ${destination.name}`)
      .addTo(layers);

    const latLngBounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ]);

    // Draw Polylines for each route
    routes.forEach((route) => {
      const isSelected = selectedRoute?.mode === route.mode;

      const polyline = L.polyline(route.pathCoordinates, {
        color: route.color || '#10b981',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 1 : 0.45,
        dashArray: route.mode === 'Walking' ? '6, 8' : undefined,
      });

      polyline.on('click', () => {
        onSelectRoute(route);
      });

      polyline.bindTooltip(
        `<strong>${route.mode}</strong>: ${route.travelTimeMinutes} min | ${route.carbonEmissionKg} kg CO2 | Score: ${route.sustainabilityScore}/100`,
        { sticky: true }
      );

      polyline.addTo(layers);
      polyline.getLatLngs().forEach((ll: any) => latLngBounds.extend(ll));
    });

    // Fit map bounds comfortably
    map.fitBounds(latLngBounds, { padding: [50, 50] });
  }, [routePlan, selectedRoute, onSelectRoute]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Map Overlay Badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        OpenStreetMap & Leaflet Multi-Modal
      </div>

      {/* Selected Mode Quick Card on Map */}
      {selectedRoute && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg max-w-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedRoute.color }}
              ></span>
              {selectedRoute.mode} Route
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">
              Score {selectedRoute.sustainabilityScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedRoute.travelTimeMinutes} mins • {selectedRoute.distanceKm} km • ${selectedRoute.costEstimate.toFixed(2)}
          </p>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            {selectedRoute.carbonSavedKg > 0
              ? `🌿 Saves ${selectedRoute.carbonSavedKg} kg CO2 vs car`
              : '🚗 Standard fossil baseline'}
          </p>
        </div>
      )}
    </div>
  );
};
