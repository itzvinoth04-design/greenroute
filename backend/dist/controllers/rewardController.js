"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewardsCatalog = getRewardsCatalog;
exports.redeemReward = redeemReward;
exports.getUserRedemptions = getUserRedemptions;
exports.getLeaderboard = getLeaderboard;
const db_1 = require("../database/db");
async function getRewardsCatalog(req, res) {
    try {
        const items = await db_1.prisma.rewardItem.findMany({
            where: { available: true },
            orderBy: { pointsCost: 'asc' },
        });
        res.json({
            success: true,
            items,
        });
    }
    catch (err) {
        console.error('Catalog error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch rewards catalogue.' });
    }
}
async function redeemReward(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { rewardItemId } = req.body;
        if (!rewardItemId) {
            res.status(400).json({ success: false, message: 'Reward item ID is required.' });
            return;
        }
        const item = await db_1.prisma.rewardItem.findUnique({ where: { id: rewardItemId } });
        if (!item || !item.available) {
            res.status(404).json({ success: false, message: 'Reward item is not available.' });
            return;
        }
        const user = await db_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user || user.points < item.pointsCost) {
            res.status(400).json({
                success: false,
                message: `Insufficient green points. You need ${item.pointsCost} pts but currently have ${user?.points || 0} pts.`,
            });
            return;
        }
        const voucherCode = 'GR-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
        const [redemption, updatedUser] = await db_1.prisma.$transaction([
            db_1.prisma.redemption.create({
                data: {
                    userId: user.id,
                    rewardItemId: item.id,
                    pointsSpent: item.pointsCost,
                    code: voucherCode,
                },
                include: { rewardItem: true },
            }),
            db_1.prisma.user.update({
                where: { id: user.id },
                data: { points: { decrement: item.pointsCost } },
            }),
            db_1.prisma.reward.create({
                data: {
                    userId: user.id,
                    points: -item.pointsCost,
                    rewardType: 'Reward Redemption',
                    description: `Redeemed ${item.title} for ${item.pointsCost} points`,
                },
            }),
        ]);
        res.json({
            success: true,
            message: `Congratulations! Successfully redeemed: ${item.title}`,
            redemption,
            remainingPoints: updatedUser.points,
        });
    }
    catch (err) {
        console.error('Redemption error:', err);
        res.status(500).json({ success: false, message: 'Failed to redeem reward.' });
    }
}
async function getUserRedemptions(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const redemptions = await db_1.prisma.redemption.findMany({
            where: { userId: req.user.id },
            include: { rewardItem: true },
            orderBy: { createdAt: 'desc' },
        });
        const rewardHistory = await db_1.prisma.reward.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        res.json({
            success: true,
            redemptions,
            rewardHistory,
        });
    }
    catch (err) {
        console.error('User rewards error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch rewards history.' });
    }
}
async function getLeaderboard(req, res) {
    try {
        const users = await db_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                city: true,
                points: true,
                preferredTransport: true,
                trips: {
                    select: { carbonSaved: true },
                },
            },
            orderBy: { points: 'desc' },
            take: 25,
        });
        const leaderboard = users.map((u, index) => {
            const totalSaved = u.trips.reduce((acc, t) => acc + t.carbonSaved, 0);
            return {
                rank: index + 1,
                id: u.id,
                name: u.name,
                city: u.city,
                points: u.points,
                preferredTransport: u.preferredTransport,
                totalCarbonSavedKg: Number(totalSaved.toFixed(1)),
                isCurrentUser: req.user?.id === u.id,
            };
        });
        res.json({
            success: true,
            leaderboard,
        });
    }
    catch (err) {
        console.error('Leaderboard error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
    }
}
//# sourceMappingURL=rewardController.js.map