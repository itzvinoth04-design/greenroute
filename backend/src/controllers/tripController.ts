import { Response } from 'express';
import { prisma } from '../database/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { TRANSPORT_MODES, TransportMode } from '../config/constants';

export async function recordTrip(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      source,
      destination,
      distance,
      duration,
      cost,
      transportType,
      carbonEmission,
      carbonSaved,
      sustainabilityScore,
      trafficDensity,
    } = req.body;

    if (!source || !destination || distance === undefined || !transportType) {
      res.status(400).json({ success: false, message: 'Missing required trip parameters.' });
      return;
    }

    const mode = transportType as TransportMode;
    const pointsAwarded = TRANSPORT_MODES[mode]?.pointsPerTrip ?? 0;

    // Use transaction to create trip, award points, and add reward event
    const [trip, user] = await prisma.$transaction([
      prisma.trip.create({
        data: {
          userId: req.user.id,
          source,
          destination,
          distance: Number(distance),
          duration: Number(duration || 15),
          cost: Number(cost || 0),
          transportType,
          carbonEmission: Number(carbonEmission || 0),
          carbonSaved: Number(carbonSaved || 0),
          sustainabilityScore: Number(sustainabilityScore || 80),
          trafficDensity: trafficDensity || 'Moderate',
          pointsEarned: pointsAwarded,
        },
      }),
      prisma.user.update({
        where: { id: req.user.id },
        data: {
          points: { increment: pointsAwarded },
        },
      }),
      ...(pointsAwarded > 0
        ? [
            prisma.reward.create({
              data: {
                userId: req.user.id,
                points: pointsAwarded,
                rewardType: 'Eco Commute Bonus',
                description: `Earned ${pointsAwarded} pts for completing a ${transportType} journey`,
              },
            }),
          ]
        : []),
    ]);

    res.status(201).json({
      success: true,
      message: `Trip recorded! Earned +${pointsAwarded} green points.`,
      trip,
      newPointsTotal: user.points,
    });
  } catch (err: any) {
    console.error('Record trip error:', err);
    res.status(500).json({ success: false, message: 'Failed to record trip.' });
  }
}

export async function getUserTrips(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      trips,
    });
  } catch (err: any) {
    console.error('Get trips error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch trips.' });
  }
}

export async function getEcoInsights(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'asc' },
    });

    const totalTrips = trips.length;
    const totalCarbonSavedKg = trips.reduce((sum, t) => sum + t.carbonSaved, 0);
    const totalEmissionsKg = trips.reduce((sum, t) => sum + t.carbonEmission, 0);
    const totalDistanceKm = trips.reduce((sum, t) => sum + t.distance, 0);
    const avgScore = totalTrips > 0 ? trips.reduce((s, t) => s + t.sustainabilityScore, 0) / totalTrips : 0;

    // Mode usage breakdown
    const modeCounts: Record<string, { count: number; carbonSaved: number; distance: number }> = {};
    trips.forEach((t) => {
      if (!modeCounts[t.transportType]) {
        modeCounts[t.transportType] = { count: 0, carbonSaved: 0, distance: 0 };
      }
      modeCounts[t.transportType].count += 1;
      modeCounts[t.transportType].carbonSaved += t.carbonSaved;
      modeCounts[t.transportType].distance += t.distance;
    });

    const modeDistribution = Object.entries(modeCounts).map(([mode, data]) => ({
      mode,
      count: data.count,
      carbonSaved: Number(data.carbonSaved.toFixed(2)),
      distance: Number(data.distance.toFixed(1)),
      color: TRANSPORT_MODES[mode as TransportMode]?.color || '#10b981',
    }));

    // Monthly reduction trend (group by month)
    const monthMap: Record<string, { month: string; emissionsSaved: number; trips: number; avgScore: number; scoreSum: number }> = {};
    trips.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      if (!monthMap[key]) {
        monthMap[key] = { month: key, emissionsSaved: 0, trips: 0, avgScore: 0, scoreSum: 0 };
      }
      monthMap[key].emissionsSaved += t.carbonSaved;
      monthMap[key].trips += 1;
      monthMap[key].scoreSum += t.sustainabilityScore;
    });

    const monthlyTrend = Object.values(monthMap).map((m) => ({
      month: m.month,
      emissionsSaved: Number(m.emissionsSaved.toFixed(2)),
      trips: m.trips,
      avgScore: Number((m.scoreSum / m.trips).toFixed(0)),
    }));

    // Most used transport
    let mostUsedTransport = 'Walking';
    let maxCount = 0;
    Object.entries(modeCounts).forEach(([mode, data]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        mostUsedTransport = mode;
      }
    });

    res.json({
      success: true,
      insights: {
        totalTrips,
        totalCarbonSavedKg: Number(totalCarbonSavedKg.toFixed(2)),
        totalEmissionsKg: Number(totalEmissionsKg.toFixed(2)),
        totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
        avgSustainabilityScore: Number(avgScore.toFixed(0)),
        mostUsedTransport,
        greenTripsCount: trips.filter((t) => t.transportType !== 'Car').length,
        modeDistribution,
        monthlyTrend,
        recentTrips: trips.slice(-5).reverse(),
      },
    });
  } catch (err: any) {
    console.error('Insights error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate eco insights.' });
  }
}
