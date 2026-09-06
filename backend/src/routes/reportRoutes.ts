import { Router } from 'express';
import {
  getMonthlyReports,
  generateMonthlyReport,
  exportCSV,
  exportPDF,
} from '../controllers/reportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getMonthlyReports);
router.post('/generate', authenticateToken, generateMonthlyReport);
router.get('/export/csv', authenticateToken, exportCSV);
router.get('/export/pdf', authenticateToken, exportPDF);

export default router;
