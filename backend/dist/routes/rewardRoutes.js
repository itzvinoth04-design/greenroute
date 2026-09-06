"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rewardController_1 = require("../controllers/rewardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/catalog', rewardController_1.getRewardsCatalog);
router.post('/redeem', authMiddleware_1.authenticateToken, rewardController_1.redeemReward);
router.get('/my-rewards', authMiddleware_1.authenticateToken, rewardController_1.getUserRedemptions);
router.get('/leaderboard', authMiddleware_1.authenticateToken, rewardController_1.getLeaderboard);
exports.default = router;
//# sourceMappingURL=rewardRoutes.js.map