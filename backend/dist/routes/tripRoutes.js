"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_1 = require("../controllers/tripController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticateToken, tripController_1.recordTrip);
router.get('/my-trips', authMiddleware_1.authenticateToken, tripController_1.getUserTrips);
router.get('/insights', authMiddleware_1.authenticateToken, tripController_1.getEcoInsights);
exports.default = router;
//# sourceMappingURL=tripRoutes.js.map