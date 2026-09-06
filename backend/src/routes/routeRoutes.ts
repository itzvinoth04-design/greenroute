import { Router } from 'express';
import { calculateRouteOptions } from '../controllers/routeController';

const router = Router();

router.post('/calculate', calculateRouteOptions);

export default router;
