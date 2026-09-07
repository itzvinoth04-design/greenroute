import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Navigation,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  DollarSign,
  Zap,
  Footprints,
  Bike,
  Train,
  Bus,
  Car,
  AlertCircle,
  Award,
  CheckCircle2,
  Bot,
  Crosshair,
  XCircle,
  Compass,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  Route,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api';
import { RoutePlanResult, ScoredRouteOption, TrafficLevel, TransportMode } from '../types';
import { MapView } from '../components/MapView';
import { useAuth } from '../context/AuthContext';

import { calculateFallbackRoutes } from '../services/routeCalculatorFallback';

interface ActiveCommute {
  route: ScoredRouteOption;
  originName: string;
  destName: string;
  startTime: number;
  progressPercent: number;
  elapsedSeconds: number;
  distanceRemainingKm: number;
  status: 'navigating' | 'arrived';
}

export const RoutePlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [source, setSource] = useState(searchParams.get('from') || 'Perambur');
  const [destination, setDestination] = useState(searchParams.get('to') || 'Chennai Central');
  const [trafficDensity, setTrafficDensity] = useState<TrafficLevel>('Moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Location State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  const [planResult, setPlanResult] = useState<RoutePlanResult | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<ScoredRouteOption | null>(null);

  // Active Journey state
  const [activeCommute, setActiveCommute] = useState<ActiveCommute | null>(null);
  const [showDirections, setShowDirections] = useState(true);

  // Success celebration state
  const [tripRecordedSuccess, setTripRecordedSuccess] = useState<{
    points: number;
    mode: string;
    carbonSaved: number;
  } | null>(null);

  const handleCalculateRoutes = async (src = source, dest = destination, traffic = trafficDensity) => {
    if (!src.trim() || !dest.trim()) {
      setError('Please provide both starting point and destination.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.routes.calculate(src, dest, traffic);
      if (res.data?.success && res.data.data) {
        setPlanResult(res.data.data);
        setSelectedRoute(res.data.data.routes[0] || null);
        return;
      }
    } catch (err: any) {
      console.warn('Live API unavailable or spin-up delayed. Calculating routes with local sustainability engine.');
    }

    try {
      const fallbackResult = calculateFallbackRoutes(src, dest, traffic);
      setPlanResult(fallbackResult);
      setSelectedRoute(fallbackResult.routes[0] || null);
    } catch (fallbackErr: any) {
      setError('Could not calculate route options. Please verify locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculateRoutes();
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        const locString = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        setSource(locString);
        setLocatingUser(false);
        handleCalculateRoutes(locString, destination, trafficDensity);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setUserLocation([13.1121, 80.2450]);
        setSource('Perambur, Chennai');
        setLocatingUser(false);
        alert('GPS permission required. Set location to Perambur, Chennai.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleStartCommute = (route: ScoredRouteOption) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (activeCommute) {
      alert(`You already have an active commute with ${activeCommute.route.mode}. Please dismiss or complete it first.`);
      return;
    }

    setSelectedRoute(route);
    setActiveCommute({
      route,
      originName: planResult?.origin.name || source,
      destName: planResult?.destination.name || destination,
      startTime: Date.now(),
      progressPercent: 10,
      elapsedSeconds: 0,
      distanceRemainingKm: Number((route.distanceKm * 0.9).toFixed(2)),
      status: 'navigating',
    });
  };

  useEffect(() => {
    if (!activeCommute || activeCommute.status === 'arrived') return;

    const interval = setInterval(() => {
      setActiveCommute((prev) => {
        if (!prev || prev.status === 'arrived') return prev;
        const newProgress = Math.min(100, prev.progressPercent + 10);
        const remainingKm = Number((prev.route.distanceKm * (1 - newProgress / 100)).toFixed(2));
        return {
          ...prev,
          progressPercent: newProgress,
          distanceRemainingKm: Math.max(0, remainingKm),
          elapsedSeconds: prev.elapsedSeconds + 3,
          status: newProgress >= 100 ? 'arrived' : 'navigating',
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [activeCommute?.status]);

  const handleDismissCommute = () => {
    setActiveCommute(null);
  };

  const handleCompleteCommute = async () => {
    if (!activeCommute) return;
    const route = activeCommute.route;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#3b82f6'],
    });

    if (user) {
      user.points = (user.points || 0) + route.pointsEarned;
      if (!user.stats) {
        user.stats = {
          totalTrips: 1,
          totalRedemptions: 0,
          totalCarbonSavedKg: route.carbonSavedKg,
          totalDistanceKm: route.distanceKm,
        };
      } else {
        user.stats.totalTrips += 1;
        user.stats.totalCarbonSavedKg = Number((user.stats.totalCarbonSavedKg + route.carbonSavedKg).toFixed(2));
        user.stats.totalDistanceKm = Number((user.stats.totalDistanceKm + route.distanceKm).toFixed(2));
      }
      localStorage.setItem('greenroute_user', JSON.stringify(user));
    }

    setTripRecordedSuccess({
      points: route.pointsEarned,
      mode: route.mode,
      carbonSaved: route.carbonSavedKg,
    });

    setActiveCommute(null);
    await refreshUser();
  };

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'Walking':
        return <Footprints className="w-5 h-5" />;
      case 'Bicycle':
        return <Bike className="w-5 h-5" />;
      case 'Metro':
        return <Train className="w-5 h-5" />;
      case 'Bus':
        return <Bus className="w-5 h-5" />;
      case 'EV':
        return <Zap className="w-5 h-5" />;
      case 'Ride Share':
      case 'Car':
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getStepIcon = (icon?: string, className = 'w-4 h-4') => {
    switch (icon) {
      case 'left':
        return <CornerUpLeft className={className} />;
      case 'right':
        return <CornerUpRight className={className} />;
      case 'board':
        return <Train className={className} />;
      case 'arrive':
        return <MapPin className={className} />;
      case 'straight':
      default:
        return <ArrowUp className={className} />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800';
    if (score >= 70) return 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950/80 border-sky-300 dark:border-sky-800';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 border-red-300 dark:border-red-800';
  };

  const activeNavRoute = activeCommute ? activeCommute.route : selectedRoute;
  const navSteps = activeNavRoute?.navigationSteps || [];
  const currentNavStepIdx =
    activeCommute && navSteps.length > 0
      ? Math.min(navSteps.length - 1, Math.floor((activeCommute.progressPercent / 100) * navSteps.length))
      : 0;
  const currentNavStep = navSteps[currentNavStepIdx];
  const nextNavStep = navSteps[currentNavStepIdx + 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Route Search Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculateRoutes();
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-1 ml-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Starting Location (A)
              </label>
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={locatingUser}
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 transition"
              >
                <Crosshair className={`w-3 h-3 ${locatingUser ? 'animate-spin' : ''}`} />
                <span>{locatingUser ? 'Locating...' : 'Locate Me'}</span>
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Perambur, Chennai"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1">
              Destination Location (B)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Chennai Central, Marina"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1">
              Traffic Density
            </label>
            <select
              value={trafficDensity}
              onChange={(e) => setTrafficDensity(e.target.value as TrafficLevel)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Low">Low Traffic (Smooth)</option>
              <option value="Moderate">Moderate Traffic</option>
              <option value="High">High (Rush Hour)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
            >
              {loading ? (
                <span>Calculating...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Find Routes</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Hub Suggestions */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Hubs:</span>
          <button
            type="button"
            onClick={() => {
              setSource('Perambur');
              setDestination('Chennai Central');
              handleCalculateRoutes('Perambur', 'Chennai Central', trafficDensity);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
          >
            Perambur &rarr; Chennai Central
          </button>
          <button
            type="button"
            onClick={() => {
              setSource('T. Nagar');
              setDestination('Anna University');
              handleCalculateRoutes('T. Nagar', 'Anna University', trafficDensity);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
          >
            T. Nagar &rarr; Anna University
          </button>
          <button
            type="button"
            onClick={() => {
              setSource('Guindy');
              setDestination('Marina Beach');
              handleCalculateRoutes('Guindy', 'Marina Beach', trafficDensity);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
          >
            Guindy &rarr; Marina Beach
          </button>
          <button
            type="button"
            onClick={() => {
              setSource('Koyambedu');
              setDestination('Tidel Park');
              handleCalculateRoutes('Koyambedu', 'Tidel Park', trafficDensity);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
          >
            Koyambedu &rarr; Tidel Park (OMR)
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Active Commute Live HUD Banner (Google Maps Navigation Style) */}
      {activeCommute && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-2xl border-2 border-emerald-500/80 animate-in fade-in slide-in-from-top-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg"
                style={{ backgroundColor: activeCommute.route.color }}
              >
                {getModeIcon(activeCommute.route.mode)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-300">
                    Live GPS Navigation Mode
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                    Elapsed: {Math.floor(activeCommute.elapsedSeconds / 60).toString().padStart(2, '0')}:{(activeCommute.elapsedSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5 flex-wrap">
                  <span>Traveling via {activeCommute.route.mode}</span>
                  <span className="text-xs text-slate-300 font-normal">
                    ({activeCommute.originName} &rarr; {activeCommute.destName})
                  </span>
                </h3>
              </div>
            </div>

            {/* Commute Controls: Dismiss or Complete upon arrival */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleDismissCommute}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-200 border border-white/20 hover:border-rose-400 text-xs font-bold transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Dismiss / Change Mode</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteCommute}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Have Arrived (+{activeCommute.route.pointsEarned} pts)</span>
              </button>
            </div>
          </div>

          {/* Google Maps Turn-by-Turn Maneuver HUD Banner */}
          {currentNavStep && (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center gap-4 shadow-inner">
              <div className="w-13 h-13 p-3 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
                {getStepIcon(currentNavStep.icon, 'w-7 h-7')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider">
                    Next Direction • In {currentNavStep.distance}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200 font-semibold">
                    Step {currentNavStepIdx + 1} of {navSteps.length}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-black text-white mt-0.5 truncate sm:text-clip">
                  {currentNavStep.instruction}
                </div>
                {nextNavStep && (
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                    <span className="text-emerald-400 font-bold">Then:</span>
                    <span className="truncate">{nextNavStep.instruction} ({nextNavStep.distance})</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Bar & Kinematic Waypoint Metric */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Waypoints Reached: {activeCommute.progressPercent}%</span>
              </span>
              <span>
                {activeCommute.distanceRemainingKm} km remaining •{' '}
                {Math.max(1, Math.round(activeCommute.route.travelTimeMinutes * (1 - activeCommute.progressPercent / 100)))} min left
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-700 rounded-full"
                style={{ width: `${activeCommute.progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-300">
              Points are credited only upon completing the journey and arriving at Destination B.
            </p>
          </div>
        </div>
      )}

      {/* Success Modal / Banner */}
      {tripRecordedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                Trip Successfully Logged & Verified!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                You earned <strong>+{tripRecordedSuccess.points} Green Points</strong> and saved{' '}
                <strong>{tripRecordedSuccess.carbonSaved} kg of CO₂</strong> for choosing {tripRecordedSuccess.mode}!
              </p>
            </div>
          </div>
          <button
            onClick={() => setTripRecordedSuccess(null)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left Route Cards, Right Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Ranked Transit Options</span>
              {planResult && (
                <span className="text-xs font-normal text-slate-500">
                  ({planResult.distanceKm} km trip)
                </span>
              )}
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              40% CO2 • 30% $ • 20% Time • 10% Traffic
            </span>
          </div>

          <div className="space-y-3">
            {planResult?.routes.map((route) => {
              const isSelected = selectedRoute?.mode === route.mode;
              const isTop = route.rank === 1;

              return (
                <div
                  key={route.mode}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Card Header: Mode & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: route.color }}
                      >
                        {getModeIcon(route.mode)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {route.mode}
                          </h4>
                          {route.badge && (
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                route.badge === 'Best Eco Choice'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : route.badge === 'Zero Emission'
                                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                                  : route.badge === 'Best Value'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {route.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">Rank #{route.rank} Recommendation</p>
                      </div>
                    </div>

                    {/* Sustainability Score Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-xl border text-center font-black ${getScoreColor(
                        route.sustainabilityScore
                      )}`}
                    >
                      <div className="text-base leading-none">{route.sustainabilityScore}</div>
                      <div className="text-[8px] uppercase tracking-wider font-bold">Score</div>
                    </div>
                  </div>

                  {/* Metrics 4-Col Grid */}
                  <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center my-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Time</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {route.travelTimeMinutes}m
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Cost</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        ₹{route.costEstimate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">CO₂</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {route.carbonEmissionKg}kg
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Rewards</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        +{route.pointsEarned}pts
                      </span>
                    </div>
                  </div>

                  {/* AI Recommendation Reason */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {route.aiRecommendationReason}
                  </p>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {route.carbonSavedKg > 0 ? `🌿 Saves ${route.carbonSavedKg} kg CO₂` : '🚗 Baseline ICE'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/assistant?prompt=${encodeURIComponent(
                              `Why should I choose ${route.mode} for a ${route.distanceKm} km trip? Explain the sustainability score of ${route.sustainabilityScore}/100 and emissions.`
                            )}`
                          );
                        }}
                        title="Ask IBM Granite about this route"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                      >
                        <Bot className="w-4 h-4" />
                      </button>

                      {activeCommute?.route.mode === route.mode ? (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span>In Transit...</span>
                        </button>
                      ) : activeCommute ? (
                        <button
                          disabled
                          title="You have an active commute in progress. Dismiss it in the banner above to switch."
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-xs cursor-not-allowed opacity-60"
                        >
                          Locked
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartCommute(route);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition flex items-center gap-1"
                        >
                          <span>Start & Earn</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Leaflet Map & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[360px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden shadow-xl">
            <MapView
              routePlan={planResult}
              selectedRoute={selectedRoute}
              onSelectRoute={(r) => setSelectedRoute(r)}
              userLocation={userLocation}
              activeCommute={activeCommute}
            />
          </div>

          {/* Turn-by-Turn Direction Guide (Google Maps Style) */}
          {activeNavRoute && navSteps.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: activeNavRoute.color }}
                  >
                    <Route className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{activeNavRoute.mode} Navigation Guide</span>
                      {activeCommute && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold animate-pulse">
                          Live Active
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {navSteps.length} waypoints • {activeNavRoute.distanceKm} km • Google Maps turn-by-turn
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDirections(!showDirections)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title={showDirections ? 'Hide Directions' : 'Show Directions'}
                >
                  {showDirections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showDirections && (
                <div className="space-y-2 pt-1">
                  {navSteps.map((step, sIdx) => {
                    const isPassed = activeCommute && sIdx < currentNavStepIdx;
                    const isCurrent = activeCommute && sIdx === currentNavStepIdx;

                    return (
                      <div
                        key={sIdx}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500/40'
                            : isPassed
                            ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                            isCurrent
                              ? 'bg-emerald-600 text-white shadow-md'
                              : isPassed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            getStepIcon(step.icon, 'w-4 h-4')
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {step.instruction}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0">
                              {step.distance}
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                              Active Waypoint
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selected Route Deep Dive Breakdown */}
          {selectedRoute && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: selectedRoute.color }}
                  ></span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {selectedRoute.mode} Detailed Impact Analysis
                  </h4>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedRoute.carbonSavedKg} kg CO₂ Prevented
                </span>
              </div>

              {/* Progress Bars for Multi-Criteria Components */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Carbon Score (40% weight)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedRoute.scoreBreakdown.carbonScore.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${selectedRoute.scoreBreakdown.carbonScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Cost Score (30% weight)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedRoute.scoreBreakdown.costScore.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${selectedRoute.scoreBreakdown.costScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Time Score (20% weight)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedRoute.scoreBreakdown.timeScore.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${selectedRoute.scoreBreakdown.timeScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Traffic Friction (10% weight)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedRoute.scoreBreakdown.trafficScore.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${selectedRoute.scoreBreakdown.trafficScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
