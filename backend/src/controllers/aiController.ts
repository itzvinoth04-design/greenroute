import { Request, Response } from 'express';
import { queryGraniteAssistant } from '../services/ibmGraniteService';

export async function askAIAssistant(req: Request, res: Response): Promise<void> {
  try {
    const { message, context } = req.body;

    if (!message) {
      res.status(400).json({ success: false, message: 'Message prompt is required.' });
      return;
    }

    const graniteResult = await queryGraniteAssistant(message, context);

    res.json({
      success: true,
      data: graniteResult,
    });
  } catch (err: any) {
    console.error('Granite AI Assistant error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI assistant inquiry.',
      error: err?.message,
    });
  }
}
