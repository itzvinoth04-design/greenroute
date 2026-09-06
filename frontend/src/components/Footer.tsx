import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Globe2, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">GreenRoute</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven sustainable mobility platform optimizing for carbon reduction, equitable urban access, and zero-emission travel choices.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-[11px] font-semibold text-emerald-300">
                <Globe2 className="w-3.5 h-3.5" />
                SDG 11, 13 & 7 Aligned
              </span>
            </div>
          </div>

          {/* Sustainable Development Goals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">UN Sustainable Goals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-slate-200">SDG 11:</span> Sustainable Cities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-200">SDG 13:</span> Climate Action
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span className="font-semibold text-slate-200">SDG 7:</span> Clean Energy
              </li>
              <li className="pt-2">
                <Link to="/sdgs" className="text-emerald-400 hover:text-emerald-300 text-xs inline-flex items-center gap-1">
                  Learn about our SDG metrics &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Platform Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/planner" className="hover:text-emerald-400 transition">Multi-Modal Route Planner</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">Eco Insights Dashboard</Link>
              </li>
              <li>
                <Link to="/rewards" className="hover:text-emerald-400 transition">Green Rewards & Leaderboard</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-emerald-400 transition">Monthly AI Reports (PDF/CSV)</Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-emerald-400 transition">IBM Granite Assistant</Link>
              </li>
              <li>
                <Link to="/responsible-ai" className="hover:text-emerald-400 transition">Responsible AI & Transparency</Link>
              </li>
            </ul>
          </div>

          {/* Technology & Responsible AI */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">AI & Open Technology</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by <strong className="text-slate-200">IBM Granite Foundation Models</strong> and OpenStreetMap for unbiased, transparent routing recommendations.
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs">
              <Link to="/responsible-ai" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Algorithmic Fairness Guarantee
              </Link>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Verified with IBM Bob Engineering Guidance
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} GreenRoute Platform. Built for a sustainable future.</p>
          <div className="flex items-center gap-4">
            <Link to="/responsible-ai" className="hover:text-slate-300 transition">Privacy & Ethics</Link>
            <span>&bull;</span>
            <Link to="/responsible-ai" className="hover:text-slate-300 transition">Emission Formulas</Link>
            <span>&bull;</span>
            <Link to="/sdgs" className="hover:text-slate-300 transition">SDG Impact Tracker</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
