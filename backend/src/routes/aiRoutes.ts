import { Router } from 'express';
import { askAIAssistant } from '../controllers/aiController';

const router = Router();

router.post('/chat', askAIAssistant);

export default router;
