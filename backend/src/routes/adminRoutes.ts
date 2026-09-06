import { Router } from 'express';
import {
  getAdminMetrics,
  listAllUsers,
  updateUserRole,
  deleteUser,
  manageRewards,
  createRewardItem,
  toggleRewardAvailability,
  listAllReports,
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Protect all admin endpoints
router.use(authenticateToken, requireAdmin);

router.get('/metrics', getAdminMetrics);
router.get('/users', listAllUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

router.get('/rewards', manageRewards);
router.post('/rewards', createRewardItem);
router.patch('/rewards/:itemId/status', toggleRewardAvailability);

router.get('/reports', listAllReports);

export default router;
