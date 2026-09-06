"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routeController_1 = require("../controllers/routeController");
const router = (0, express_1.Router)();
router.post('/calculate', routeController_1.calculateRouteOptions);
exports.default = router;
//# sourceMappingURL=routeRoutes.js.map