export type TransportMode =
  | 'Walking'
  | 'Bicycle'
  | 'Metro'
  | 'Bus'
  | 'EV'
  | 'Ride Share'
  | 'Car';

export type TrafficLevel = 'Low' | 'Moderate' | 'High';

export interface TransportDetails {
  emissionFactor: number; // kg CO2 / km
  pointsPerTrip: number;
  baseCost: number;       // base fare in $
  costPerKm: number;      // $ / km
  avgSpeedKmh: number;    // km / h
  color: string;          // hex color for charts & map
  icon: string;
  category: 'active' | 'transit' | 'shared' | 'personal';
}

/**
 * Standardized Emission Factors (kg CO2 / km) as specified in GreenRoute specifications
 */
export const TRANSPORT_MODES: Record<TransportMode, TransportDetails> = {
  Walking: {
    emissionFactor: 0.0,
    pointsPerTrip: 10,
    baseCost: 0.0,
    costPerKm: 0.0,
    avgSpeedKmh: 4.8,
    color: '#10b981', // Emerald
    icon: 'footprints',
    category: 'active',
  },
  Bicycle: {
    emissionFactor: 0.0,
    pointsPerTrip: 8,
    baseCost: 0.0,
    costPerKm: 0.0,
    avgSpeedKmh: 16.0,
    color: '#059669', // Green
    icon: 'bike',
    category: 'active',
  },
  Metro: {
    emissionFactor: 0.04,
    pointsPerTrip: 6,
    baseCost: 1.5,
    costPerKm: 0.12,
    avgSpeedKmh: 38.0,
    color: '#0284c7', // Sky blue
    icon: 'train',
    category: 'transit',
  },
  EV: {
    emissionFactor: 0.05,
    pointsPerTrip: 4,
    baseCost: 2.0,
    costPerKm: 0.22,
    avgSpeedKmh: 42.0,
    color: '#8b5cf6', // Purple / Electric
    icon: 'zap',
    category: 'personal',
  },
  Bus: {
    emissionFactor: 0.08,
    pointsPerTrip: 5,
    baseCost: 1.25,
    costPerKm: 0.08,
    avgSpeedKmh: 22.0,
    color: '#f59e0b', // Amber
    icon: 'bus',
    category: 'transit',
  },
  'Ride Share': {
    emissionFactor: 0.10,
    pointsPerTrip: 2,
    baseCost: 3.5,
    costPerKm: 0.85,
    avgSpeedKmh: 35.0,
    color: '#ec4899', // Pink
    icon: 'car-taxi-front',
    category: 'shared',
  },
  Car: {
    emissionFactor: 0.20,
    pointsPerTrip: 0,
    baseCost: 2.5,
    costPerKm: 0.65,
    avgSpeedKmh: 36.0,
    color: '#ef4444', // Red
    icon: 'car',
    category: 'personal',
  },
};

export const BASELINE_CAR_EMISSION_FACTOR = TRANSPORT_MODES['Car'].emissionFactor; // 0.20 kg/km

export const SCORING_WEIGHTS = {
  carbonImpact: 0.40,
  cost: 0.30,
  time: 0.20,
  traffic: 0.10,
};

export const TRAFFIC_MULTIPLIERS: Record<TrafficLevel, { speedFactor: number; trafficPenaltyScore: number }> = {
  Low: { speedFactor: 1.0, trafficPenaltyScore: 100 },
  Moderate: { speedFactor: 0.8, trafficPenaltyScore: 65 },
  High: { speedFactor: 0.55, trafficPenaltyScore: 30 },
};
