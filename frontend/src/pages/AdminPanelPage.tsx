import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Route,
  TrendingDown,
  Activity,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';

export const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'rewards' | 'reports'>('users');
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New reward form
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPoints, setNewPoints] = useState(150);
  const [newCategory, setNewCategory] = useState('Transit');

  const fetchAdminData = async () => {
    try {
      const [metRes, usrRes, rewRes, repRes] = await Promise.all([
        api.admin.getMetrics(),
        api.admin.getUsers(),
        api.admin.getRewards(),
        api.admin.getReports(),
      ]);

      if (metRes.data?.success) setMetrics(metRes.data.metrics);
      if (usrRes.data?.success) setUsers(usrRes.data.users);
      if (rewRes.data?.success) setRewards(rewRes.data.items);
      if (repRes.data?.success) setReports(repRes.data.reports);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await api.admin.updateUserRole(userId, newRole);
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this user? This action is irreversible.')) {
      return;
    }

    try {
      const res = await api.admin.deleteUser(userId);
      if (res.data?.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleToggleReward = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await api.admin.toggleRewardStatus(itemId, !currentStatus);
      if (res.data?.success) {
        setRewards((prev) =>
          prev.map((r) => (r.id === itemId ? { ...r, available: !currentStatus } : r))
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle reward status.');
    }
  };

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.admin.createReward({
        title: newTitle,
        description: newDescription,
        pointsCost: Number(newPoints),
        category: newCategory,
        badgeIcon: 'gift',
      });

      if (res.data?.success) {
        setRewards((prev) => [res.data.item, ...prev]);
        setShowAddRewardModal(false);
        setNewTitle('');
        setNewDescription('');
        setNewPoints(150);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create reward item.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading administrator console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white font-black text-xs">
              ADMIN CONSOLE
            </span>
            <span className="text-xs text-slate-500">System Monitoring & Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            GreenRoute Administration Panel
          </h1>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics?.totalUsers || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Registered commuters</p>
        </div>

        {/* Total Trips */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Trips</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Route className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics?.totalTrips || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Multi-modal routes logged</p>
        </div>

        {/* Total CO2 Saved */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total CO₂ Saved</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics?.totalCO2SavedKg || 0} kg
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Platform cumulative impact</p>
        </div>

        {/* Active Users */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Users</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics?.activeUsers || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Engaged monthly commuters</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'rewards'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Manage Rewards ({rewards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Reports ({reports.length})</span>
        </button>
      </div>

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Registered Platform Users
            </h3>
            <span className="text-xs text-slate-400">Showing {users.length} accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="py-2.5 font-bold">User</th>
                  <th className="py-2.5 font-bold">Email</th>
                  <th className="py-2.5 font-bold">City</th>
                  <th className="py-2.5 font-bold">Points</th>
                  <th className="py-2.5 font-bold">Trips</th>
                  <th className="py-2.5 font-bold">Role</th>
                  <th className="py-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 text-slate-500">{u.email}</td>
                    <td className="py-3">{u.city}</td>
                    <td className="py-3 font-bold text-emerald-600">{u.points} pts</td>
                    <td className="py-3">{u.tripCount}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rewards Tab Content */}
      {activeTab === 'rewards' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Reward Catalogue Management
              </h3>
              <p className="text-xs text-slate-500">Configure vouchers and eco-incentives</p>
            </div>
            <button
              onClick={() => setShowAddRewardModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reward Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-amber-600">
                      {r.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.available
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {r.available ? 'Active' : 'Archived'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{r.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{r.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {r.pointsCost} pts
                  </span>
                  <button
                    onClick={() => handleToggleReward(r.id, r.available)}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline"
                  >
                    {r.available ? 'Archive' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab Content */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              System Audit Sustainability Reports
            </h3>
            <span className="text-xs text-slate-400">{reports.length} statements logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="py-2.5 font-bold">Month</th>
                  <th className="py-2.5 font-bold">User</th>
                  <th className="py-2.5 font-bold">Total Trips</th>
                  <th className="py-2.5 font-bold">CO₂ Saved</th>
                  <th className="py-2.5 font-bold">Score</th>
                  <th className="py-2.5 font-bold">Top Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((rep) => (
                  <tr key={rep.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {rep.month}
                    </td>
                    <td className="py-3">
                      {rep.user?.name} ({rep.user?.city})
                    </td>
                    <td className="py-3 font-bold">{rep.totalTrips}</td>
                    <td className="py-3 text-emerald-600 font-bold">{rep.emissionsSaved} kg</td>
                    <td className="py-3 font-bold">{rep.avgScore}/100</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px]">
                        {rep.topTransport}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Reward Modal */}
      {showAddRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Create New Eco Reward
            </h3>
            <form onSubmit={handleCreateReward} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Free 1-Day Tram Pass"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details of reward and partner terms..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Points Cost
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Transit">Transit</option>
                    <option value="Discount">Discount</option>
                    <option value="Eco Impact">Eco Impact</option>
                    <option value="Merchandise">Merchandise</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddRewardModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
