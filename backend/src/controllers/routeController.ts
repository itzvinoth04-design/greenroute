import { Request, Response } from 'express';
import { planRoutes } from '../services/routingService';
import { TrafficLevel } from '../config/constants';

export async function calculateRouteOptions(req: Request, res: Response): Promise<void> {
  try {
    const { source, destination, trafficDensity } = req.body;

    if (!source || !destination) {
      res.status(400).json({
        success: false,
        message: 'Origin (source) and destination are required.',
      });
      return;
    }

    const traffic = (trafficDensity as TrafficLevel) || 'Moderate';
    const planResult = await planRoutes(source, destination, traffic);

    res.json({
      success: true,
      data: planResult,
    });
  } catch (err: any) {
    console.error('Route calculation error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate route options.',
      error: err?.message,
    });
  }
}
