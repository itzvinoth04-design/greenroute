import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RoutePlanResult, ScoredRouteOption } from '../types';

interface MapViewProps {
  routePlan: RoutePlanResult | null;
  selectedRoute: ScoredRouteOption | null;
  onSelectRoute: (route: ScoredRouteOption) => void;
  userLocation?: [number, number] | null;
  activeCommute?: {
    route: ScoredRouteOption;
    progressPercent: number;
  } | null;
}

export const MapView: React.FC<MapViewProps> = ({
  routePlan,
  selectedRoute,
  onSelectRoute,
  userLocation,
  activeCommute,
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

  // Update map markers and polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // 1. Draw User Live Location if available
    if (userLocation) {
      const userGpsIcon = L.divIcon({
        className: 'user-gps-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background-color: #3b82f6; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background-color: #2563eb; border: 2px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(userLocation, { icon: userGpsIcon })
        .bindPopup('<strong>📍 Your Live GPS Location</strong>')
        .addTo(layers);
    }

    if (!routePlan || !routePlan.routes || routePlan.routes.length === 0) {
      if (userLocation) {
        map.setView(userLocation, 14);
      }
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

    L.marker([origin.lat, origin.lng], { icon: originIcon })
      .bindPopup(`<strong>Origin (A):</strong> ${origin.name}`)
      .addTo(layers);

    L.marker([destination.lat, destination.lng], { icon: destIcon })
      .bindPopup(`<strong>Destination (B):</strong> ${destination.name}`)
      .addTo(layers);

    const latLngBounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ]);

    if (userLocation) {
      latLngBounds.extend(userLocation);
    }

    // Draw Polylines for each route
    routes.forEach((route) => {
      const isSelected = selectedRoute?.mode === route.mode || activeCommute?.route.mode === route.mode;

      const polyline = L.polyline(route.pathCoordinates, {
        color: route.color || '#10b981',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 1 : 0.4,
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

    // 2. If an active commute is running, render the commuter marker along the polyline
    if (activeCommute && activeCommute.route.pathCoordinates.length > 1) {
      const coords = activeCommute.route.pathCoordinates;
      const progressFraction = Math.min(1, Math.max(0, activeCommute.progressPercent / 100));
      const totalSegments = coords.length - 1;
      const exactIndex = progressFraction * totalSegments;
      const lowerIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
      const upperIndex = lowerIndex + 1;
      const segmentFraction = exactIndex - lowerIndex;

      const startPt = coords[lowerIndex];
      const endPt = coords[upperIndex];
      const curLat = startPt[0] + (endPt[0] - startPt[0]) * segmentFraction;
      const curLng = startPt[1] + (endPt[1] - startPt[1]) * segmentFraction;

      const commuterIcon = L.divIcon({
        className: 'active-commuter-marker',
        html: `
          <div style="background-color: ${activeCommute.route.color || '#10b981'}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 0 15px ${activeCommute.route.color || '#10b981'}; animation: bounce 1s infinite;">
            📍
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([curLat, curLng], { icon: commuterIcon })
        .bindPopup(`<strong>Live Commute (${activeCommute.route.mode}):</strong> ${activeCommute.progressPercent}% of journey covered`)
        .addTo(layers);
    }

    // Fit map bounds comfortably
    map.fitBounds(latLngBounds, { padding: [40, 40] });
  }, [routePlan, selectedRoute, onSelectRoute, userLocation, activeCommute]);

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full min-h-[340px] sm:min-h-[440px]" />

      {/* Map Overlay Badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="hidden sm:inline">OpenStreetMap & Leaflet Multi-Modal</span>
        <span className="sm:hidden">OSM Live Map</span>
      </div>

      {/* Active Trip Navigation HUD overlay */}
      {activeCommute && (
        <div className="absolute top-3 left-3 z-[1000] bg-emerald-950/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 shadow-lg text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>In Transit: {activeCommute.route.mode} ({activeCommute.progressPercent}%)</span>
        </div>
      )}

      {/* Selected Mode Quick Card on Map */}
      {selectedRoute && !activeCommute && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedRoute.color }}
              ></span>
              {selectedRoute.mode} Route
            </span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">
              Score {selectedRoute.sustainabilityScore}/100
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            {selectedRoute.travelTimeMinutes} mins • {selectedRoute.distanceKm} km • ₹{selectedRoute.costEstimate}
          </p>
          <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {selectedRoute.carbonSavedKg > 0
              ? `🌿 Saves ${selectedRoute.carbonSavedKg} kg CO2 vs car`
              : '🚗 Standard fossil baseline'}
          </p>
        </div>
      )}
    </div>
  );
};
