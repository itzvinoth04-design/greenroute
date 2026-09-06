import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  Eye,
  Lock,
  HeartHandshake,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const ResponsibleAIPage: React.FC = () => {
  // Interactive Transparency Simulator
  const [simCarbon, setSimCarbon] = useState(90); // 0-100
  const [simCost, setSimCost] = useState(80);
  const [simTime, setSimTime] = useState(70);
  const [simTraffic, setSimTraffic] = useState(85);

  const simulatedScore = Math.round(
    0.4 * simCarbon + 0.3 * simCost + 0.2 * simTime + 0.1 * simTraffic
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          Ethical & Transparent Mobility AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Responsible AI Framework
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          GreenRoute prioritizes planetary health, algorithmic fairness, user privacy, and complete model transparency. We hold our AI recommendations to the highest ethical benchmarks.
        </p>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Fairness */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            1. Algorithmic Fairness
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>No Transport Provider Bias:</strong> GreenRoute operates with complete market neutrality. We receive zero commissions, sponsored placement fees, or promotional kickbacks from ride-sharing networks, auto manufacturers, or commercial transit operators.
          </p>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Equal evaluation across municipal and private transit options</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Uniform emission factors based on verified empirical lifecycle standards</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Transparency */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            2. Total Transparency
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Auditable Objective Function:</strong> Unlike "black box" routing algorithms that hide their optimization metrics, GreenRoute's sustainability engine discloses the exact normalized weights governing every single recommendation.
          </p>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs text-emerald-700 dark:text-emerald-300">
            Score = (0.40 × Carbon) + (0.30 × Cost) + (0.20 × Time) + (0.10 × Traffic)
          </div>
        </div>

        {/* Pillar 3: Privacy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            3. Privacy & Data Protection
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>User Location Sovereignty:</strong> Commute origins and destinations are processed ephemerally to compute transit geometry and are never monetized, brokered, or used to build surveillance profiles.
          </p>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Full compliance with GDPR & location privacy guidelines</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>User trip logs can be permanently deleted with 1-click in Profile</span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: Ethics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            4. Environment-First Ethics
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Planetary Climate Imperative:</strong> In alignment with UN SDG 11 and the Paris Agreement, our default sort order always spotlights the route with the lowest ecological toll, gently nudging commuters towards cleaner choices.
          </p>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Encourages active lifestyles through Walking & Cycling bonuses</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Educates users via IBM Granite AI on exact CO₂ trade-offs</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Transparency Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-850 border border-emerald-200 dark:border-slate-800 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Algorithmic Transparency Simulator
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Test the Sustainability Scoring Engine in Real Time
            </h3>
          </div>

          {/* Computed Score Output */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 text-center min-w-[140px] shadow-sm">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Composite Score
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {simulatedScore}{' '}
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Adjust the sliders below to see how normalized metric scores compound into the final sustainability score:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Carbon Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-700 dark:text-emerald-400">Carbon Impact (40% Weight)</span>
              <span>{simCarbon} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simCarbon}
              onChange={(e) => setSimCarbon(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Cost Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-700 dark:text-blue-400">Monetary Cost (30% Weight)</span>
              <span>{simCost} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simCost}
              onChange={(e) => setSimCost(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Time Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-700 dark:text-amber-400">Travel Time (20% Weight)</span>
              <span>{simTime} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simTime}
              onChange={(e) => setSimTime(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Traffic Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-purple-700 dark:text-purple-400">Traffic Congestion (10% Weight)</span>
              <span>{simTraffic} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simTraffic}
              onChange={(e) => setSimTraffic(Number(e.target.value))}
              className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
