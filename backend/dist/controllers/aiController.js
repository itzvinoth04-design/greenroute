"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAIAssistant = askAIAssistant;
const ibmGraniteService_1 = require("../services/ibmGraniteService");
async function askAIAssistant(req, res) {
    try {
        const { message, context } = req.body;
        if (!message) {
            res.status(400).json({ success: false, message: 'Message prompt is required.' });
            return;
        }
        const graniteResult = await (0, ibmGraniteService_1.queryGraniteAssistant)(message, context);
        res.json({
            success: true,
            data: graniteResult,
        });
    }
    catch (err) {
        console.error('Granite AI Assistant error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to process AI assistant inquiry.',
            error: err?.message,
        });
    }
}
//# sourceMappingURL=aiController.js.map