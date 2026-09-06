import { Router } from 'express';
import {
  getRewardsCatalog,
  redeemReward,
  getUserRedemptions,
  getLeaderboard,
} from '../controllers/rewardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/catalog', getRewardsCatalog);
router.post('/redeem', authenticateToken, redeemReward);
router.get('/my-rewards', authenticateToken, getUserRedemptions);
router.get('/leaderboard', authenticateToken, getLeaderboard);

export default router;
