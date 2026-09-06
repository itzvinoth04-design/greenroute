import { Router } from 'express';
import { recordTrip, getUserTrips, getEcoInsights } from '../controllers/tripController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, recordTrip);
router.get('/my-trips', authenticateToken, getUserTrips);
router.get('/insights', authenticateToken, getEcoInsights);

export default router;
