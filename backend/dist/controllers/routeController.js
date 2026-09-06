"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRouteOptions = calculateRouteOptions;
const routingService_1 = require("../services/routingService");
async function calculateRouteOptions(req, res) {
    try {
        const { source, destination, trafficDensity } = req.body;
        if (!source || !destination) {
            res.status(400).json({
                success: false,
                message: 'Origin (source) and destination are required.',
            });
            return;
        }
        const traffic = trafficDensity || 'Moderate';
        const planResult = await (0, routingService_1.planRoutes)(source, destination, traffic);
        res.json({
            success: true,
            data: planResult,
        });
    }
    catch (err) {
        console.error('Route calculation error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate route options.',
            error: err?.message,
        });
    }
}
//# sourceMappingURL=routeController.js.map