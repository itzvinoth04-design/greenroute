import { Response } from 'express';
import { prisma } from '../database/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getAdminMetrics(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();

    const trips = await prisma.trip.findMany({
      select: { carbonSaved: true },
    });
    const totalCO2Saved = trips.reduce((sum, t) => sum + t.carbonSaved, 0);

    // Active users: users with at least one trip or logged in recently
    const activeUsersCount = await prisma.user.count({
      where: {
        trips: { some: {} },
      },
    });

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalTrips,
        totalCO2SavedKg: Number(totalCO2Saved.toFixed(2)),
        activeUsers: Math.max(activeUsersCount, 1),
        recentUsers,
      },
    });
  } catch (err: any) {
    console.error('Admin metrics error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin metrics.' });
  }
}

export async function listAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { trips: true, redemptions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      city: u.city,
      preferredTransport: u.preferredTransport,
      role: u.role,
      points: u.points,
      tripCount: u._count.trips,
      redemptionCount: u._count.redemptions,
      createdAt: u.createdAt,
    }));

    res.json({
      success: true,
      users: formatted,
    });
  } catch (err: any) {
    console.error('List users error:', err);
    res.status(500).json({ success: false, message: 'Failed to list users.' });
  }
}

export async function updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      res.status(400).json({ success: false, message: 'Valid role (user | admin) is required.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.json({
      success: true,
      message: `User ${updated.name} role updated to ${role}.`,
      user: {
        id: updated.id,
        role: updated.role,
      },
    });
  } catch (err: any) {
    console.error('Update user role error:', err);
    res.status(500).json({ success: false, message: 'Failed to update user role.' });
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    // Prevent deleting own admin account
    if (req.user?.id === userId) {
      res.status(400).json({ success: false, message: 'Cannot delete your own administrator account.' });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: 'User removed successfully.',
    });
  } catch (err: any) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
}

export async function manageRewards(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const items = await prisma.rewardItem.findMany({
      include: {
        _count: { select: { redemptions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const recentRedemptions = await prisma.redemption.findMany({
      include: {
        user: { select: { name: true, email: true } },
        rewardItem: { select: { title: true, pointsCost: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({
      success: true,
      items,
      recentRedemptions,
    });
  } catch (err: any) {
    console.error('Manage rewards error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch rewards management data.' });
  }
}

export async function createRewardItem(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { title, description, pointsCost, category, badgeIcon } = req.body;

    if (!title || !pointsCost || !category) {
      res.status(400).json({ success: false, message: 'Title, pointsCost, and category are required.' });
      return;
    }

    const item = await prisma.rewardItem.create({
      data: {
        title,
        description: description || '',
        pointsCost: Number(pointsCost),
        category,
        badgeIcon: badgeIcon || 'leaf',
        available: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'New reward added to catalogue.',
      item,
    });
  } catch (err: any) {
    console.error('Create reward error:', err);
    res.status(500).json({ success: false, message: 'Failed to create reward item.' });
  }
}

export async function toggleRewardAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { itemId } = req.params;
    const { available } = req.body;

    const updated = await prisma.rewardItem.update({
      where: { id: itemId },
      data: { available: Boolean(available) },
    });

    res.json({
      success: true,
      message: `Reward status updated to ${updated.available ? 'Active' : 'Archived'}.`,
      item: updated,
    });
  } catch (err: any) {
    console.error('Toggle reward error:', err);
    res.status(500).json({ success: false, message: 'Failed to toggle reward availability.' });
  }
}

export async function listAllReports(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: { select: { name: true, email: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      reports,
    });
  } catch (err: any) {
    console.error('List admin reports error:', err);
    res.status(500).json({ success: false, message: 'Failed to list reports.' });
  }
}
