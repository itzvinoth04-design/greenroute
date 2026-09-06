import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Leaf,
  Navigation,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Gift,
  ArrowRight,
  Globe2,
  Zap,
  Footprints,
  Train,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('Perambur');
  const [destination, setDestination] = useState('Chennai Central');

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/planner?from=${encodeURIComponent(source)}&to=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-400/30 blur-[100px]" />
          <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-teal-400/30 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* SDG Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-6 animate-pulse">
            <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Advancing UN SDG 11: Sustainable Cities & Communities</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Prioritize the Planet over Speed.{' '}
            <span className="eco-gradient-text">Navigate with GreenRoute.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Standard navigation apps always push the fastest route—even when it pollutes the most. GreenRoute calculates exact carbon emissions, costs, and travel times across 7 transit modes, using <strong className="text-emerald-600 dark:text-emerald-400">IBM Granite AI</strong> to recommend the most sustainable journey.
          </p>

          {/* Quick Route Search Form Box */}
          <div className="mt-10 max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleQuickPlan} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
              <div className="sm:col-span-5 text-left">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1">
                  Starting Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Central Station"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-5 text-left">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1">
                  Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. University Campus"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-2 sm:pt-5">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition duration-200 group"
                >
                  <span>Plan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>

            {/* Popular quick route tags */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Popular Hubs:</span>
              <button
                type="button"
                onClick={() => { setSource('Perambur'); setDestination('Chennai Central'); }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
              >
                Perambur &rarr; Chennai Central
              </button>
              <button
                type="button"
                onClick={() => { setSource('T. Nagar'); setDestination('Anna University'); }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
              >
                T. Nagar &rarr; Anna University
              </button>
              <button
                type="button"
                onClick={() => { setSource('Guindy'); setDestination('Marina Beach'); }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-slate-600 dark:text-slate-300 transition"
              >
                Guindy &rarr; Marina Beach
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Development Goals Alignment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Targeted Global Impact
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built Directly for the UN Sustainable Development Goals
          </h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            GreenRoute measures municipal decarbonization through verifiable transport metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SDG 11 Card */}
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-500 text-white">
                  PRIMARY SDG 11
                </span>
                <Train className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Sustainable Cities & Communities
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Prioritizes high-capacity electrified mass transit (Metro/Bus) and active micro-mobility over private single-occupant motor vehicles to reduce urban congestion.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-200/60 dark:border-amber-900/40 text-xs font-semibold text-amber-700 dark:text-amber-300">
              Target 11.2: Accessible & sustainable transport systems for all
            </div>
          </div>

          {/* SDG 13 Card */}
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-600 text-white">
                  SECONDARY SDG 13
                </span>
                <TrendingDown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Climate Action
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Empirically tracks CO₂ emissions saved on every trip relative to internal combustion baselines (0.20 kg CO₂/km), gamifying verifiable carbon reduction.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Target 13.2: Integrate climate measures into policies & planning
            </div>
          </div>

          {/* SDG 7 Card */}
          <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-teal-600 text-white">
                  SECONDARY SDG 7
                </span>
                <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Affordable & Clean Energy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Accelerates the adoption of Electric Vehicles (0.05 kg/km) and electrified rail infrastructure, encouraging renewable-powered urban energy transitions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-teal-200/60 dark:border-teal-900/40 text-xs font-semibold text-teal-700 dark:text-teal-300">
              Target 7.3: Double the global rate of improvement in energy efficiency
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Intelligent Platform Pillars
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How GreenRoute Revolutionizes Urban Mobility
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              AI Sustainability Engine
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-criteria utility model balancing 40% Carbon, 30% Cost, 20% Time, and 10% Traffic congestion into a single 0-100 score.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 mb-4">
              <Footprints className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              Exact Carbon Calculator
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculates tailpipe & grid emission factors for Walking, Bicycle, Metro, Bus, EV, Ride Share, and Car per passenger-km.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 mb-4">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              Green Rewards & Tiers
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Earn 10 points for walking, 8 for cycling, and 6 for metro. Redeem for transit vouchers and tree planting certificates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              Responsible AI Guarantee
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transparent algorithms with zero provider bias, complete location privacy protection, and climate-first ethical design.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to reduce your urban footprint?
            </h3>
            <p className="mt-3 text-sm sm:text-base text-emerald-100 leading-relaxed">
              Join thousands of sustainable commuters tracking daily emissions, unlocking rewards, and building cleaner cities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-md transition"
              >
                Create Free Account (+50 Pts Bonus)
              </Link>
              <Link
                to="/planner"
                className="px-6 py-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-400/40 text-white font-semibold text-sm transition"
              >
                Try Route Planner Directly
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
