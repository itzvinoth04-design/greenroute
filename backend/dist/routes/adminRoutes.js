"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protect all admin endpoints
router.use(authMiddleware_1.authenticateToken, authMiddleware_1.requireAdmin);
router.get('/metrics', adminController_1.getAdminMetrics);
router.get('/users', adminController_1.listAllUsers);
router.patch('/users/:userId/role', adminController_1.updateUserRole);
router.delete('/users/:userId', adminController_1.deleteUser);
router.get('/rewards', adminController_1.manageRewards);
router.post('/rewards', adminController_1.createRewardItem);
router.patch('/rewards/:itemId/status', adminController_1.toggleRewardAvailability);
router.get('/reports', adminController_1.listAllReports);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map