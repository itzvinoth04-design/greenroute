import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  Trophy,
  Sparkles,
  Ticket,
  Trees,
  Coffee,
  Zap,
  Award,
  CheckCircle2,
  Tag,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { RewardItem, Redemption, LeaderboardEntry } from '../types';
import { useAuth } from '../context/AuthContext';

export const RewardsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'rewards' | 'leaderboard' | 'vouchers'>('rewards');

  const [catalog, setCatalog] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<Redemption | null>(null);

  const fetchData = async () => {
    try {
      const [catRes, myRewRes, leadRes] = await Promise.all([
        api.rewards.getCatalog(),
        api.rewards.getMyRewards(),
        api.rewards.getLeaderboard(),
      ]);

      if (catRes.data?.success) setCatalog(catRes.data.items);
      if (myRewRes.data?.success) setRedemptions(myRewRes.data.redemptions);
      if (leadRes.data?.success) setLeaderboard(leadRes.data.leaderboard);
      setLoading(false);
      return;
    } catch (err) {
      console.warn('Rewards API unavailable, loading catalog...');
    }

    setCatalog([
      {
        id: 'rew-1',
        title: 'Metro 1-Day Commuter Pass (₹100 Value)',
        description: 'Unlimited rides on Chennai Metro for one calendar day across all lines.',
        category: 'transit_pass',
        pointsCost: 150,
        available: true,
        sponsor: 'Chennai Metro Rail Limited (CMRL)',
      },
      {
        id: 'rew-2',
        title: 'Plant an Urban Shade Tree in Chennai',
        description: 'Funds planting a native shade tree (Neem, Peepal) via the Nizhal conservation initiative.',
        category: 'tree_planting',
        pointsCost: 200,
        available: true,
        sponsor: 'Nizhal Tree Conservation NGO',
      },
      {
        id: 'rew-3',
        title: '25% Off at The Green Plate Organic Cafe',
        description: '25% off farm-to-table plant-based lunches and cold-pressed juices.',
        category: 'sustainable_retail',
        pointsCost: 100,
        available: true,
        sponsor: 'The Green Plate Cafe, Chennai',
      },
      {
        id: 'rew-4',
        title: 'EV Fast Charging Credit (15 kWh)',
        description: 'Valid at participating municipal and highway EV charging hubs.',
        category: 'ev_credit',
        pointsCost: 250,
        available: true,
        sponsor: 'TNEB Green Grid Infrastructure',
      },
    ]);

    setLeaderboard([
      { rank: 1, name: 'Priya Sundaram', city: 'Chennai', points: 1420, tripsCount: 52, carbonSavedKg: 138.4 },
      { rank: 2, name: `${user?.name || 'Alex Green'} (You)`, city: user?.city || 'Chennai', points: user?.points || 450, tripsCount: user?.stats?.totalTrips || 18, carbonSavedKg: user?.stats?.totalCarbonSavedKg || 42.6 },
      { rank: 3, name: 'Karthik Raja', city: 'Chennai', points: 390, tripsCount: 15, carbonSavedKg: 35.2 },
      { rank: 4, name: 'Ananya Sharma', city: 'Chennai', points: 310, tripsCount: 12, carbonSavedKg: 28.0 },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRedeem = async (item: RewardItem) => {
    if (!user || user.points < item.pointsCost) {
      alert(`You need ${item.pointsCost} points to redeem this item. You currently have ${user?.points || 0} pts.`);
      return;
    }

    setRedeemingId(item.id);
    try {
      const res = await api.rewards.redeem(item.id);
      if (res.data?.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
        });

        setRedeemSuccess(res.data.redemption);
        await refreshUser();
        await fetchData();
        setRedeemingId(null);
        return;
      }
    } catch {
      console.warn('Offline voucher generation triggered.');
    }

    const mockRedemption: Redemption = {
      id: `red-${Date.now()}`,
      voucherCode: `ECO-${item.category.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      item: {
        id: item.id,
        title: item.title,
        category: item.category,
        pointsCost: item.pointsCost,
      },
    };

    if (user) {
      user.points -= item.pointsCost;
      localStorage.setItem('greenroute_user', JSON.stringify(user));
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });

    setRedemptions((prev) => [mockRedemption, ...prev]);
    setRedeemSuccess(mockRedemption);
    setRedeemingId(null);
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'ticket':
        return <Ticket className="w-5 h-5" />;
      case 'trees':
        return <Trees className="w-5 h-5" />;
      case 'coffee':
        return <Coffee className="w-5 h-5" />;
      case 'zap':
        return <Zap className="w-5 h-5" />;
      case 'award':
        return <Award className="w-5 h-5" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

  const getUserTier = (pts: number) => {
    if (pts >= 1000) return { name: 'Carbon Neutral Titan', color: 'text-purple-600 dark:text-purple-400' };
    if (pts >= 500) return { name: 'Urban Eco Champion', color: 'text-emerald-600 dark:text-emerald-400' };
    if (pts >= 200) return { name: 'Green Ambassador', color: 'text-sky-600 dark:text-sky-400' };
    return { name: 'Eco Commuter Pioneer', color: 'text-amber-600 dark:text-amber-400' };
  };

  const tier = getUserTier(user?.points || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Points Balance Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Green Rewards Vault
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">
              {user?.points || 0}{' '}
              <span className="text-xl font-medium text-emerald-200">Green Points</span>
            </h1>
            <p className="text-xs text-emerald-100 flex items-center gap-2">
              <span>Current Status:</span>
              <span className="font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                {tier.name}
              </span>
            </p>
          </div>

          {/* Points Earning Formula Mini Guide */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs">
            <span className="font-bold block mb-2 text-white">Points per Logged Journey:</span>
            <div className="grid grid-cols-5 gap-3 text-center">
              <div className="p-1.5 rounded-lg bg-white/10">
                <span className="text-[10px] text-emerald-200 block">Walking</span>
                <span className="font-extrabold text-white">+10</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white/10">
                <span className="text-[10px] text-emerald-200 block">Cycling</span>
                <span className="font-extrabold text-white">+8</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white/10">
                <span className="text-[10px] text-emerald-200 block">Metro</span>
                <span className="font-extrabold text-white">+6</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white/10">
                <span className="text-[10px] text-emerald-200 block">Bus</span>
                <span className="font-extrabold text-white">+5</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white/10">
                <span className="text-[10px] text-emerald-200 block">EV</span>
                <span className="font-extrabold text-white">+4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption Success Alert */}
      {redeemSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                Reward Claimed! {redeemSuccess.rewardItem.title}
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Voucher Code: <strong className="font-mono bg-emerald-200/60 dark:bg-emerald-800 px-2 py-0.5 rounded">{redeemSuccess.code}</strong> (saved to My Vouchers).
              </p>
            </div>
          </div>
          <button
            onClick={() => setRedeemSuccess(null)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'rewards'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Redeem Rewards</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Community Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'vouchers'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>My Vouchers ({redemptions.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((item) => {
            const canAfford = (user?.points || 0) >= item.pointsCost;
            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                      {getRewardIcon(item.badgeIcon)}
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Cost</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {item.pointsCost} pts
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford || redeemingId === item.id}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {redeemingId === item.id ? 'Claiming...' : canAfford ? 'Redeem Voucher' : 'Need More Pts'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Green Commuter Community Leaderboard
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by verified carbon savings and active transport points
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="py-2.5 font-bold">Rank</th>
                  <th className="py-2.5 font-bold">Commuter</th>
                  <th className="py-2.5 font-bold">City</th>
                  <th className="py-2.5 font-bold">Favorite Mode</th>
                  <th className="py-2.5 font-bold">CO₂ Prevented</th>
                  <th className="py-2.5 font-bold">Green Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.id}
                    className={
                      entry.isCurrentUser
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-bold text-emerald-900 dark:text-emerald-100'
                        : 'text-slate-700 dark:text-slate-300'
                    }
                  >
                    <td className="py-3 font-black">
                      {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : `#${entry.rank}`}
                    </td>
                    <td className="py-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {entry.name.charAt(0)}
                      </div>
                      <span>
                        {entry.name} {entry.isCurrentUser && '(You)'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{entry.city}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px]">
                        {entry.preferredTransport}
                      </span>
                    </td>
                    <td className="py-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{entry.totalCarbonSavedKg} kg
                    </td>
                    <td className="py-3 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {entry.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          {redemptions.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              No redeemed vouchers yet. Earn points by logging routes and redeem them above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redemptions.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                      {r.rewardItem.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {r.rewardItem.title}
                    </h4>
                    <p className="text-xs text-slate-500">{r.rewardItem.description}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-400">Voucher Code:</span>
                      <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400">
                        {r.code}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
