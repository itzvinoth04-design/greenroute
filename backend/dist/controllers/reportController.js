"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyReports = getMonthlyReports;
exports.generateMonthlyReport = generateMonthlyReport;
exports.exportCSV = exportCSV;
exports.exportPDF = exportPDF;
const db_1 = require("../database/db");
const ibmGraniteService_1 = require("../services/ibmGraniteService");
const reportService_1 = require("../services/reportService");
async function getMonthlyReports(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const reports = await db_1.prisma.report.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            success: true,
            reports,
        });
    }
    catch (err) {
        console.error('Fetch reports error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve reports.' });
    }
}
async function generateMonthlyReport(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { month } = req.body;
        const reportMonth = month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        // Fetch user and trips
        const user = await db_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }
        const trips = await db_1.prisma.trip.findMany({
            where: { userId: user.id },
        });
        const totalTrips = trips.length;
        const emissionsSaved = trips.reduce((sum, t) => sum + t.carbonSaved, 0);
        const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
        const avgScore = totalTrips > 0 ? trips.reduce((s, t) => s + t.sustainabilityScore, 0) / totalTrips : 85;
        // Determine top transport
        const modeCounts = {};
        trips.forEach((t) => {
            modeCounts[t.transportType] = (modeCounts[t.transportType] || 0) + 1;
        });
        let topTransport = user.preferredTransport || 'Metro';
        let max = 0;
        Object.entries(modeCounts).forEach(([m, c]) => {
            if (c > max) {
                max = c;
                topTransport = m;
            }
        });
        // Generate AI recommendations via IBM Granite
        const aiSummary = (0, ibmGraniteService_1.generateMonthlyAIReportInsights)(user.name, totalTrips, emissionsSaved, topTransport);
        // Upsert or create report
        const report = await db_1.prisma.report.create({
            data: {
                userId: user.id,
                month: reportMonth,
                totalTrips,
                emissionsSaved: Number(emissionsSaved.toFixed(2)),
                totalDistance: Number(totalDistance.toFixed(1)),
                topTransport,
                avgScore: Number(avgScore.toFixed(0)),
                aiSummary,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Monthly AI report generated successfully.',
            report,
        });
    }
    catch (err) {
        console.error('Generate report error:', err);
        res.status(500).json({ success: false, message: 'Failed to generate monthly report.' });
    }
}
async function prepareReportData(userId, reportId) {
    const user = await db_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return null;
    let report = reportId ? await db_1.prisma.report.findUnique({ where: { id: reportId } }) : null;
    const trips = await db_1.prisma.trip.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
    const totalTrips = trips.length;
    const emissionsSaved = trips.reduce((sum, t) => sum + t.carbonSaved, 0);
    const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
    const avgScore = totalTrips > 0 ? trips.reduce((s, t) => s + t.sustainabilityScore, 0) / totalTrips : 85;
    const month = report?.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const topTransport = report?.topTransport || user.preferredTransport || 'Metro';
    const aiSummary = report?.aiSummary || (0, ibmGraniteService_1.generateMonthlyAIReportInsights)(user.name, totalTrips, emissionsSaved, topTransport);
    return {
        userName: user.name,
        userEmail: user.email,
        month,
        totalTrips,
        emissionsSaved,
        totalDistance,
        topTransport,
        avgScore,
        aiSummary,
        trips,
    };
}
async function exportCSV(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const reportId = req.query.reportId;
        const reportData = await prepareReportData(req.user.id, reportId);
        if (!reportData) {
            res.status(404).json({ success: false, message: 'Report data not found.' });
            return;
        }
        const csvString = (0, reportService_1.generateCSVReport)(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="GreenRoute_Report_${reportData.month.replace(/\s+/g, '_')}.csv"`);
        res.status(200).send(csvString);
    }
    catch (err) {
        console.error('CSV export error:', err);
        res.status(500).json({ success: false, message: 'Failed to export CSV.' });
    }
}
async function exportPDF(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const reportId = req.query.reportId;
        const reportData = await prepareReportData(req.user.id, reportId);
        if (!reportData) {
            res.status(404).json({ success: false, message: 'Report data not found.' });
            return;
        }
        const pdfBuffer = (0, reportService_1.generatePDFReportBuffer)(reportData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="GreenRoute_Report_${reportData.month.replace(/\s+/g, '_')}.pdf"`);
        res.status(200).send(pdfBuffer);
    }
    catch (err) {
        console.error('PDF export error:', err);
        res.status(500).json({ success: false, message: 'Failed to export PDF.' });
    }
}
//# sourceMappingURL=reportController.js.map