export type TransportMode =
  | 'Walking'
  | 'Bicycle'
  | 'Metro'
  | 'Bus'
  | 'EV'
  | 'Ride Share'
  | 'Car';

export type TrafficLevel = 'Low' | 'Moderate' | 'High';

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  preferredTransport: string;
  role: 'user' | 'admin';
  points: number;
  stats?: {
    totalTrips: number;
    totalRedemptions: number;
    totalCarbonSavedKg: number;
    totalDistanceKm: number;
  };
}

export interface ScoredRouteOption {
  mode: TransportMode;
  distanceKm: number;
  carbonEmissionKg: number;
  carbonSavedKg: number;
  travelTimeMinutes: number;
  costEstimate: number;
  trafficDensity: TrafficLevel;
  pointsEarned: number;
  sustainabilityScore: number;
  scoreBreakdown: {
    carbonScore: number;
    costScore: number;
    timeScore: number;
    trafficScore: number;
  };
  rank: number;
  badge?: 'Best Eco Choice' | 'Best Value' | 'Fastest Route' | 'Zero Emission';
  aiRecommendationReason: string;
  pathCoordinates: [number, number][];
  color: string;
  icon: string;
}

export interface RoutePlanResult {
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  distanceKm: number;
  trafficDensity: TrafficLevel;
  routes: ScoredRouteOption[];
  recommendedMode: TransportMode;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  distance: number;
  duration: number;
  cost: number;
  transportType: TransportMode;
  carbonEmission: number;
  carbonSaved: number;
  sustainabilityScore: number;
  trafficDensity: TrafficLevel;
  pointsEarned: number;
  createdAt: string;
}

export interface EcoInsights {
  totalTrips: number;
  totalCarbonSavedKg: number;
  totalEmissionsKg: number;
  totalDistanceKm: number;
  avgSustainabilityScore: number;
  mostUsedTransport: string;
  greenTripsCount: number;
  modeDistribution: Array<{
    mode: string;
    count: number;
    carbonSaved: number;
    distance: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    emissionsSaved: number;
    trips: number;
    avgScore: number;
  }>;
  recentTrips: Trip[];
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  badgeIcon: string;
  available: boolean;
}

export interface Redemption {
  id: string;
  pointsSpent: number;
  status: string;
  code: string;
  createdAt: string;
  rewardItem: RewardItem;
}

export interface Report {
  id: string;
  month: string;
  totalTrips: number;
  emissionsSaved: number;
  totalDistance: number;
  topTransport: string;
  avgScore: number;
  aiSummary: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  city: string;
  points: number;
  preferredTransport: string;
  totalCarbonSavedKg: number;
  isCurrentUser: boolean;
}
