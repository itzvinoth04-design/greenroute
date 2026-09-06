import React from 'react';
import { Globe2, Building2, CloudRain, Zap, CheckCircle2, TrendingUp, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutSDGPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <Globe2 className="w-4 h-4" />
          Global Climate Commitments
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Our UN Sustainable Development Goals (SDGs)
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          GreenRoute was conceived and engineered to turn abstract climate goals into tangible, everyday commuter actions backed by verifiable data.
        </p>
      </div>

      {/* Primary SDG 11 Section */}
      <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg">
              11
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                PRIMARY TARGET GOAL
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                SDG 11: Sustainable Cities & Communities
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold w-fit">
            Target 11.2 Focus
          </span>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong>Target 11.2 Mandate:</strong> <em>"By 2030, provide access to safe, affordable, accessible and sustainable transport systems for all, improving road safety, notably by expanding public transport, with special attention to the needs of those in vulnerable situations, women, children, persons with disabilities and older persons."</em>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Public Transit Priority
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Actively shifts trips to high-efficiency electrified bus and rail networks, reducing vehicle hours traveled (VHT).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Congestion Mitigation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrates real-time traffic density penalties into route scoring to balance roadway grid stress across urban corridors.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Active Micro-Mobility
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Incentivizes walking and cycling for first/last-mile connectivity with top tier rewards (10 & 8 pts).
            </p>
          </div>
        </div>
      </div>

      {/* Secondary SDGs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SDG 13 */}
        <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/30 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
              13
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                SECONDARY GOAL
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                SDG 13: Climate Action
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Transportation accounts for over <strong>24% of direct CO₂ emissions</strong> from fuel combustion globally. GreenRoute directly addresses <strong>Target 13.2</strong> by calculating and visualizing greenhouse gas savings for every trip, empowering citizens to drive measurable decarbonization.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Real-time emissions delta tracking vs 0.20 kg/km car baseline</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Exportable audit reports in PDF and CSV for personal/corporate ESG reporting</span>
            </li>
          </ul>
        </div>

        {/* SDG 7 */}
        <div className="rounded-3xl bg-teal-500/10 border border-teal-500/30 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
              7
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                SECONDARY GOAL
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                SDG 7: Affordable & Clean Energy
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Aligned with <strong>Target 7.3</strong> (double global energy efficiency), GreenRoute highlights electrified transit alternatives (EV at 0.05 kg/km, Metro at 0.04 kg/km) that operate on increasingly renewable urban grids.
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <span>Promoting electrified transit over liquid petroleum fuels</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <span>Encouraging micro-mobility battery hubs for urban commuting</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Official Emission Benchmark Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          Standardized Emission Factors & Reward Matrix
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          GreenRoute adheres to transparent emissions coefficients verified through urban transit lifecycle analyses.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200">Transport Mode</th>
                <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200">Emission Factor</th>
                <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200">Savings vs Car</th>
                <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200">Green Reward Points</th>
                <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200">SDG Alignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-600 flex items-center gap-1.5">
                  Walking
                </td>
                <td className="py-2.5 px-3">0.00 kg CO₂/km</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">100% (0.20 kg/km)</td>
                <td className="py-2.5 px-3 font-bold">10 pts</td>
                <td className="py-2.5 px-3">SDG 11, SDG 13</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-600">Bicycle</td>
                <td className="py-2.5 px-3">0.00 kg CO₂/km</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">100% (0.20 kg/km)</td>
                <td className="py-2.5 px-3 font-bold">8 pts</td>
                <td className="py-2.5 px-3">SDG 11, SDG 13</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-sky-600">Metro / Rapid Rail</td>
                <td className="py-2.5 px-3">0.04 kg CO₂/km</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">80% (0.16 kg/km)</td>
                <td className="py-2.5 px-3 font-bold">6 pts</td>
                <td className="py-2.5 px-3">SDG 11, SDG 7</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-purple-600">Electric Vehicle (EV)</td>
                <td className="py-2.5 px-3">0.05 kg CO₂/km</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">75% (0.15 kg/km)</td>
                <td className="py-2.5 px-3 font-bold">4 pts</td>
                <td className="py-2.5 px-3">SDG 7, SDG 13</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-amber-600">Municipal Bus</td>
                <td className="py-2.5 px-3">0.08 kg CO₂/km</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">60% (0.12 kg/km)</td>
                <td className="py-2.5 px-3 font-bold">5 pts</td>
                <td className="py-2.5 px-3">SDG 11</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-pink-600">Ride Share</td>
                <td className="py-2.5 px-3">0.10 kg CO₂/km</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">50% (0.10 kg/km)</td>
                <td className="py-2.5 px-3 font-bold">2 pts</td>
                <td className="py-2.5 px-3">SDG 11</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-red-600">Personal ICE Car</td>
                <td className="py-2.5 px-3">0.20 kg CO₂/km</td>
                <td className="py-2.5 px-3 text-slate-400 font-bold">0% (Baseline)</td>
                <td className="py-2.5 px-3 font-bold text-slate-400">0 pts</td>
                <td className="py-2.5 px-3 text-slate-400">Baseline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action footer */}
      <div className="text-center pt-4">
        <Link
          to="/planner"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition"
        >
          <span>Calculate Your Route Now</span>
          &rarr;
        </Link>
      </div>
    </div>
  );
};
