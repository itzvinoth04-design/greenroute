import { RoutePlanResult, ScoredRouteOption, TrafficLevel, TransportMode } from '../types';

interface ModeConfig {
  emissionFactor: number;
  avgSpeedKmh: number;
  baseFare: number;
  costPerKm: number;
  pointsAwarded: number;
  trafficSensitive: boolean;
  color: string;
  icon: string;
}

const TRANSPORT_MODES: Record<TransportMode, ModeConfig> = {
  Walking: {
    emissionFactor: 0.0,
    avgSpeedKmh: 4.5,
    baseFare: 0,
    costPerKm: 0,
    pointsAwarded: 10,
    trafficSensitive: false,
    color: '#10b981',
    icon: 'Footprints',
  },
  Bicycle: {
    emissionFactor: 0.0,
    avgSpeedKmh: 15,
    baseFare: 0,
    costPerKm: 0,
    pointsAwarded: 8,
    trafficSensitive: false,
    color: '#06b6d4',
    icon: 'Bike',
  },
  Metro: {
    emissionFactor: 0.04,
    avgSpeedKmh: 35,
    baseFare: 10,
    costPerKm: 2.0,
    pointsAwarded: 6,
    trafficSensitive: false,
    color: '#8b5cf6',
    icon: 'Train',
  },
  Bus: {
    emissionFactor: 0.08,
    avgSpeedKmh: 20,
    baseFare: 5,
    costPerKm: 1.5,
    pointsAwarded: 5,
    trafficSensitive: true,
    color: '#f59e0b',
    icon: 'Bus',
  },
  EV: {
    emissionFactor: 0.05,
    avgSpeedKmh: 28,
    baseFare: 25,
    costPerKm: 6.0,
    pointsAwarded: 4,
    trafficSensitive: true,
    color: '#3b82f6',
    icon: 'Zap',
  },
  'Ride Share': {
    emissionFactor: 0.1,
    avgSpeedKmh: 26,
    baseFare: 35,
    costPerKm: 12.0,
    pointsAwarded: 2,
    trafficSensitive: true,
    color: '#ec4899',
    icon: 'Users',
  },
  Car: {
    emissionFactor: 0.2,
    avgSpeedKmh: 30,
    baseFare: 40,
    costPerKm: 15.0,
    pointsAwarded: 0,
    trafficSensitive: true,
    color: '#ef4444',
    icon: 'Car',
  },
};

const BASELINE_CAR_EMISSION_FACTOR = 0.2;

const TRAFFIC_MULTIPLIERS: Record<TrafficLevel, number> = {
  Low: 1.0,
  Moderate: 1.25,
  High: 1.6,
};

const KNOWN_HUBS: Record<string, { lat: number; lng: number; name: string }> = {
  perambur: { lat: 13.1121, lng: 80.245, name: 'Perambur, Chennai, Tamil Nadu, India' },
  perumbur: { lat: 13.1121, lng: 80.245, name: 'Perambur, Chennai, Tamil Nadu, India' },
  'chennai central': {
    lat: 13.0827,
    lng: 80.2755,
    name: 'Chennai Central (Puratchi Thalaivar Dr. M.G.R. Central), Tamil Nadu',
  },
  'central station': { lat: 13.0827, lng: 80.2755, name: 'Chennai Central Station, Tamil Nadu' },
  central: { lat: 13.0827, lng: 80.2755, name: 'Chennai Central, Tamil Nadu' },
  egmore: { lat: 13.0784, lng: 80.2608, name: 'Chennai Egmore Station, Tamil Nadu' },
  guindy: { lat: 13.0067, lng: 80.2025, name: 'Guindy, Chennai, Tamil Nadu' },
  tambaram: { lat: 12.9249, lng: 80.1, name: 'Tambaram, Chennai, Tamil Nadu' },
  't nagar': { lat: 13.0418, lng: 80.2341, name: 'T. Nagar, Chennai, Tamil Nadu' },
  'anna nagar': { lat: 13.085, lng: 80.2101, name: 'Anna Nagar, Chennai, Tamil Nadu' },
  adyar: { lat: 13.0012, lng: 80.2565, name: 'Adyar, Chennai, Tamil Nadu' },
  velachery: { lat: 12.9791, lng: 80.2185, name: 'Velachery, Chennai, Tamil Nadu' },
  koyambedu: { lat: 13.0694, lng: 80.1948, name: 'Koyambedu (CMBT), Chennai, Tamil Nadu' },
  'marina beach': { lat: 13.05, lng: 80.2824, name: 'Marina Beach, Chennai, Tamil Nadu' },
  'anna university': { lat: 13.0109, lng: 80.2354, name: 'Anna University, Guindy, Chennai, Tamil Nadu' },
  'tidel park': { lat: 12.9863, lng: 80.2432, name: 'Tidel Park, OMR, Chennai, Tamil Nadu' },
  coimbatore: { lat: 11.0168, lng: 76.9558, name: 'Coimbatore, Tamil Nadu' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka, India' },
  delhi: { lat: 28.6139, lng: 77.209, name: 'New Delhi, India' },
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c * 1.3).toFixed(2));
}

function resolveGeo(query: string, defaultFallback: { name: string; lat: number; lng: number }) {
  // 1. Check for coordinates in string format: e.g. "Current Location (13.1381, 80.2038)" or "13.1381, 80.2038"
  const coordMatch = query.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return {
        name: query.trim() || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
      };
    }
  }

  const q = query.trim().toLowerCase();
  for (const [key, hub] of Object.entries(KNOWN_HUBS)) {
    if (q === key || q.includes(key)) {
      return { name: hub.name, lat: hub.lat, lng: hub.lng };
    }
  }
  return defaultFallback;
}

export function generateNavigationSteps(
  mode: TransportMode,
  originName: string,
  destName: string,
  distanceKm: number
): Array<{ instruction: string; distance: string; icon: 'straight' | 'left' | 'right' | 'board' | 'arrive' }> {
  const shortOrigin = originName.split(',')[0].trim();
  const shortDest = destName.split(',')[0].trim();
  const quarter = (distanceKm / 4).toFixed(1);
  const half = (distanceKm / 2).toFixed(1);

  switch (mode) {
    case 'Walking':
      return [
        { instruction: `Head out from ${shortOrigin} on pedestrian walkway`, distance: '300 m', icon: 'straight' },
        { instruction: 'Turn left along tree-canopied sidewalk towards arterial road', distance: `${quarter} km`, icon: 'left' },
        { instruction: 'Cross at the designated pedestrian zebra crossing and keep right', distance: `${half} km`, icon: 'right' },
        { instruction: `Continue straight on eco greenway approaching ${shortDest}`, distance: `${quarter} km`, icon: 'straight' },
        { instruction: `Arrive safely at ${shortDest}`, distance: 'Destination', icon: 'arrive' },
      ];
    case 'Bicycle':
      return [
        { instruction: `Depart ${shortOrigin} via the designated cycle track`, distance: '400 m', icon: 'straight' },
        { instruction: 'Turn right at the junction onto Main Green Cycleway', distance: `${quarter} km`, icon: 'right' },
        { instruction: 'Follow dedicated bike lane through roundabout, 2nd exit', distance: `${half} km`, icon: 'straight' },
        { instruction: 'Turn left onto destination approach pathway', distance: `${quarter} km`, icon: 'left' },
        { instruction: `Arrive at bike docking hub near ${shortDest}`, distance: 'Destination', icon: 'arrive' },
      ];
    case 'Metro':
      return [
        { instruction: `Walk 250m from ${shortOrigin} to Nearest Metro Station`, distance: '250 m', icon: 'straight' },
        { instruction: `Enter through automated fare gates and proceed to Platform 1`, distance: 'Station', icon: 'straight' },
        { instruction: `Board Metro train heading towards ${shortDest} corridor`, distance: `${(distanceKm * 0.75).toFixed(1)} km`, icon: 'board' },
        { instruction: `Alight at destination station and take Exit Gate 2`, distance: 'Station', icon: 'straight' },
        { instruction: `Walk 200m towards ${shortDest} entrance`, distance: 'Destination', icon: 'arrive' },
      ];
    case 'Bus':
      return [
        { instruction: `Walk 150m from ${shortOrigin} to nearest bus shelter`, distance: '150 m', icon: 'straight' },
        { instruction: `Board public transit bus along the main transit corridor`, distance: `${(distanceKm * 0.8).toFixed(1)} km`, icon: 'board' },
        { instruction: `Alight at the designated transit stop nearest to destination`, distance: 'Stop', icon: 'straight' },
        { instruction: `Walk 100m straight towards ${shortDest}`, distance: 'Destination', icon: 'arrive' },
      ];
    case 'EV':
      return [
        { instruction: `Start EV route from ${shortOrigin} onto primary road`, distance: '500 m', icon: 'straight' },
        { instruction: 'Turn right onto bypass road / green corridor lane', distance: `${quarter} km`, icon: 'right' },
        { instruction: 'Continue straight along the expressway passing EV charging station', distance: `${half} km`, icon: 'straight' },
        { instruction: `Take exit ramp left towards ${shortDest}`, distance: '400 m', icon: 'left' },
        { instruction: `Arrive at EV parking zone at ${shortDest}`, distance: 'Destination', icon: 'arrive' },
      ];
    default:
      return [
        { instruction: `Depart ${shortOrigin} heading towards main avenue`, distance: '500 m', icon: 'straight' },
        { instruction: 'Turn left onto the arterial highway following GPS route guidance', distance: `${quarter} km`, icon: 'left' },
        { instruction: 'Proceed straight through the overpass keeping to the right lane', distance: `${half} km`, icon: 'straight' },
        { instruction: `Turn right onto ${shortDest} access road`, distance: '300 m', icon: 'right' },
        { instruction: `Arrive at destination: ${shortDest}`, distance: 'Destination', icon: 'arrive' },
      ];
  }
}

function generateWaypoints(start: [number, number], end: [number, number], offset: number): [number, number][] {
  const pts: [number, number][] = [start];
  const steps = 6;
  for (let i = 1; i < steps; i++) {
    const f = i / steps;
    const lat = start[0] + (end[0] - start[0]) * f;
    const lng = start[1] + (end[1] - start[1]) * f;
    const curve = Math.sin(f * Math.PI) * offset;
    pts.push([Number((lat + curve).toFixed(5)), Number((lng + curve * 0.8).toFixed(5))]);
  }
  pts.push(end);
  return pts;
}

export function calculateFallbackRoutes(
  sourceInput: string,
  destInput: string,
  traffic: TrafficLevel = 'Moderate'
): RoutePlanResult {
  const origin = resolveGeo(sourceInput, {
    name: sourceInput,
    lat: 13.1121,
    lng: 80.245,
  });
  const destination = resolveGeo(destInput, {
    name: destInput,
    lat: 13.0827,
    lng: 80.2755,
  });

  let distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  if (distance <= 0.1) distance = 6.2; // Default realistic distance if exact same point

  const modes: TransportMode[] = ['Walking', 'Bicycle', 'Metro', 'Bus', 'EV', 'Ride Share', 'Car'];
  const multiplier = TRAFFIC_MULTIPLIERS[traffic] || 1.25;

  const rawOptions = modes.map((mode, idx) => {
    const cfg = TRANSPORT_MODES[mode];
    const carbonEmission = Number((distance * cfg.emissionFactor).toFixed(3));
    const carBaseline = distance * BASELINE_CAR_EMISSION_FACTOR;
    const carbonSaved = Number(Math.max(0, carBaseline - carbonEmission).toFixed(3));

    let speed = cfg.avgSpeedKmh;
    if (cfg.trafficSensitive) {
      speed = speed / multiplier;
    }
    const timeMinutes = Math.max(3, Math.round((distance / speed) * 60));
    const cost = Math.round(cfg.baseFare + distance * cfg.costPerKm);
    const points = cfg.pointsAwarded * Math.max(1, Math.round(distance / 2));

    const offsetVariation = (idx - 3) * 0.003;
    const waypoints = generateWaypoints([origin.lat, origin.lng], [destination.lat, destination.lng], offsetVariation);

    return {
      mode,
      distanceKm: distance,
      carbonEmissionKg: carbonEmission,
      carbonSavedKg: carbonSaved,
      travelTimeMinutes: timeMinutes,
      costEstimate: cost,
      trafficDensity: traffic,
      pointsEarned: points,
      color: cfg.color,
      icon: cfg.icon,
      pathCoordinates: waypoints,
    };
  });

  const minCarbon = Math.min(...rawOptions.map((o) => o.carbonEmissionKg));
  const maxCarbon = Math.max(...rawOptions.map((o) => o.carbonEmissionKg)) || 1;
  const minCost = Math.min(...rawOptions.map((o) => o.costEstimate));
  const maxCost = Math.max(...rawOptions.map((o) => o.costEstimate)) || 1;
  const minTime = Math.min(...rawOptions.map((o) => o.travelTimeMinutes));
  const maxTime = Math.max(...rawOptions.map((o) => o.travelTimeMinutes)) || 1;

  const scored: ScoredRouteOption[] = rawOptions.map((opt) => {
    const carbonScore = (1 - (opt.carbonEmissionKg - minCarbon) / (maxCarbon - minCarbon || 1)) * 100;
    const costScore = (1 - (opt.costEstimate - minCost) / (maxCost - minCost || 1)) * 100;
    const timeScore = (1 - (opt.travelTimeMinutes - minTime) / (maxTime - minTime || 1)) * 100;
    const trafficScore = traffic === 'Low' ? 100 : traffic === 'Moderate' ? 70 : 40;

    const sustainabilityScore = Math.round(
      0.4 * carbonScore + 0.3 * costScore + 0.2 * timeScore + 0.1 * trafficScore
    );

    let badge: 'Best Eco Choice' | 'Best Value' | 'Fastest Route' | 'Zero Emission' | undefined;
    if (opt.mode === 'Walking' || opt.mode === 'Bicycle') badge = 'Zero Emission';
    else if (opt.mode === 'Metro') badge = 'Best Eco Choice';
    else if (opt.mode === 'Bus') badge = 'Best Value';
    else if (opt.mode === 'EV') badge = 'Best Eco Choice';

    let reason = `${opt.mode} avoids ${opt.carbonSavedKg} kg of CO2 tailpipe emissions compared to private fossil cars.`;
    if (opt.mode === 'Metro') {
      reason = `Metro is the most balanced eco transit option, cutting traffic congestion and saving ${opt.carbonSavedKg} kg CO2.`;
    }

    return {
      ...opt,
      sustainabilityScore,
      scoreBreakdown: {
        carbonScore: Math.round(carbonScore),
        costScore: Math.round(costScore),
        timeScore: Math.round(timeScore),
        trafficScore,
      },
      rank: 0,
      badge,
      aiRecommendationReason: reason,
      navigationSteps: generateNavigationSteps(opt.mode, origin.name, destination.name, distance),
    };
  });

  scored.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
  scored.forEach((route, i) => {
    route.rank = i + 1;
  });

  return {
    origin,
    destination,
    distanceKm: distance,
    trafficDensity: traffic,
    routes: scored,
    recommendedMode: scored[0].mode,
  };
}
