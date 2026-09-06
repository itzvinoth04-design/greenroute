import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  MapPin,
  Sparkles,
  TrendingDown,
  Route,
  CheckCircle2,
  Save,
  Shield,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || 'Eco City');
  const [preferredTransport, setPreferredTransport] = useState(user?.preferredTransport || 'Metro');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await api.auth.updateProfile({ name, city, preferredTransport });
      if (res.data?.success) {
        setSaveSuccess(true);
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-xl shadow-emerald-600/30">
          {user?.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {user?.role === 'admin' ? 'Administrator' : 'Verified Commuter'}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {user?.city}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              Prefers: {user?.preferredTransport}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center min-w-[130px]">
          <span className="text-[10px] uppercase font-bold text-slate-500">Green Points</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {user?.points || 0}
          </div>
        </div>
      </div>

      {/* Lifetime Eco Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase">Logged Trips</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {user?.stats?.totalTrips || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sustainable journeys</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase">Carbon Prevented</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {user?.stats?.totalCarbonSavedKg || 0} kg
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Compared to car baseline</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Eco Distance</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {user?.stats?.totalDistanceKm || 0} km
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active & transit kilometers</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Personal Details & Transport Preferences
          </h3>
          <p className="text-xs text-slate-500">
            Customize your primary commute mode and municipal location
          </p>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Primary City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="e.g. Portland, Stockholm, Bengaluru"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                Preferred Transport Mode
              </label>
              <select
                value={preferredTransport}
                onChange={(e) => setPreferredTransport(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Walking">Walking (Zero tailpipe)</option>
                <option value="Bicycle">Bicycle (Zero tailpipe)</option>
                <option value="Metro">Metro / Rapid Rail (0.04 kg/km)</option>
                <option value="Bus">Bus (0.08 kg/km)</option>
                <option value="EV">Electric Vehicle (0.05 kg/km)</option>
                <option value="Ride Share">Ride Share (0.10 kg/km)</option>
                <option value="Car">Car (0.20 kg/km baseline)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
