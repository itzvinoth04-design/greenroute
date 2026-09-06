"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticateToken, reportController_1.getMonthlyReports);
router.post('/generate', authMiddleware_1.authenticateToken, reportController_1.generateMonthlyReport);
router.get('/export/csv', authMiddleware_1.authenticateToken, reportController_1.exportCSV);
router.get('/export/pdf', authMiddleware_1.authenticateToken, reportController_1.exportPDF);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map