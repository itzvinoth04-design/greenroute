import {
  TRANSPORT_MODES,
  BASELINE_CAR_EMISSION_FACTOR,
  TransportMode,
  TrafficLevel,
  TRAFFIC_MULTIPLIERS,
} from '../config/constants';

export interface RouteCalculationInput {
  distanceKm: number;
  mode: TransportMode;
  trafficDensity?: TrafficLevel;
}

export interface RouteMetrics {
  mode: TransportMode;
  distanceKm: number;
  carbonEmissionKg: number;
  carbonSavedKg: number;
  travelTimeMinutes: number;
  costEstimate: number;
  trafficDensity: TrafficLevel;
  pointsEarned: number;
}

/**
 * Calculates carbon emissions according to GreenRoute specification:
 * CarbonEmission = Distance × EmissionFactor
 */
export function calculateCarbonEmission(distanceKm: number, mode: TransportMode): number {
  const details = TRANSPORT_MODES[mode];
  if (!details) {
    throw new Error(`Unsupported transport mode: ${mode}`);
  }
  const emission = distanceKm * details.emissionFactor;
  return Number(emission.toFixed(3));
}

/**
 * Calculates carbon savings compared to personal ICE Car baseline
 */
export function calculateCarbonSaved(distanceKm: number, mode: TransportMode): number {
  const carBaseline = distanceKm * BASELINE_CAR_EMISSION_FACTOR;
  const currentEmission = calculateCarbonEmission(distanceKm, mode);
  const saved = Math.max(0, carBaseline - currentEmission);
  return Number(saved.toFixed(3));
}

/**
 * Calculates estimated travel time in minutes based on mode speed and traffic congestion
 */
export function calculateTravelTime(
  distanceKm: number,
  mode: TransportMode,
  traffic: TrafficLevel = 'Moderate'
): number {
  const details = TRANSPORT_MODES[mode];
  let effectiveSpeed = details.avgSpeedKmh;

  // Traffic affects road vehicles (Bus, EV, Ride Share, Car)
  if (['Bus', 'EV', 'Ride Share', 'Car'].includes(mode)) {
    effectiveSpeed *= TRAFFIC_MULTIPLIERS[traffic].speedFactor;
  }

  // Metro runs on dedicated tracks, Walking & Bicycle generally bypass motor vehicle jams
  const timeInHours = distanceKm / effectiveSpeed;
  const minutes = Math.ceil(timeInHours * 60);
  return Math.max(1, minutes);
}

/**
 * Calculates monetary travel cost
 */
export function calculateTravelCost(distanceKm: number, mode: TransportMode): number {
  const details = TRANSPORT_MODES[mode];
  const cost = details.baseCost + distanceKm * details.costPerKm;
  return Number(cost.toFixed(2));
}

/**
 * Computes complete route metrics for a single transport mode
 */
export function computeRouteMetrics(input: RouteCalculationInput): RouteMetrics {
  const traffic = input.trafficDensity || 'Moderate';
  const emission = calculateCarbonEmission(input.distanceKm, input.mode);
  const saved = calculateCarbonSaved(input.distanceKm, input.mode);
  const time = calculateTravelTime(input.distanceKm, input.mode, traffic);
  const cost = calculateTravelCost(input.distanceKm, input.mode);
  const points = TRANSPORT_MODES[input.mode].pointsPerTrip;

  return {
    mode: input.mode,
    distanceKm: Number(input.distanceKm.toFixed(2)),
    carbonEmissionKg: emission,
    carbonSavedKg: saved,
    travelTimeMinutes: time,
    costEstimate: cost,
    trafficDensity: traffic,
    pointsEarned: points,
  };
}
