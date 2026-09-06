"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const routeRoutes_1 = __importDefault(require("./routes/routeRoutes"));
const tripRoutes_1 = __importDefault(require("./routes/tripRoutes"));
const rewardRoutes_1 = __importDefault(require("./routes/rewardRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'GreenRoute Backend API',
        sdgs: ['SDG 11', 'SDG 13', 'SDG 7'],
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/routes', routeRoutes_1.default);
app.use('/api/trips', tripRoutes_1.default);
app.use('/api/rewards', rewardRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
// Global 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route ${req.method} ${req.originalUrl} not found.`,
    });
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(` 🌱 GreenRoute Backend API running on port ${PORT}`);
        console.log(` 🌍 Primary SDG: SDG 11 - Sustainable Cities & Communities`);
        console.log(` 🤖 IBM Granite Model Layer: Active`);
        console.log(` 🔗 Health check: http://localhost:${PORT}/api/health`);
        console.log(`====================================================`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map