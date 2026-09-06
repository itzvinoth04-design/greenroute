"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSVReport = generateCSVReport;
exports.generatePDFReportBuffer = generatePDFReportBuffer;
const jspdf_1 = require("jspdf");
/**
 * Generates CSV string for trips and emissions
 */
function generateCSVReport(reportData) {
    const headers = [
        'Trip Date',
        'Origin',
        'Destination',
        'Transport Mode',
        'Distance (km)',
        'CO2 Emission (kg)',
        'CO2 Saved (kg)',
        'Sustainability Score (0-100)',
    ];
    const rows = reportData.trips.map((t) => [
        new Date(t.createdAt).toISOString().split('T')[0],
        `"${t.source.replace(/"/g, '""')}"`,
        `"${t.destination.replace(/"/g, '""')}"`,
        t.transportType,
        t.distance.toFixed(2),
        t.carbonEmission.toFixed(3),
        t.carbonSaved.toFixed(3),
        t.sustainabilityScore.toFixed(0),
    ]);
    const summarySection = [
        ['# GreenRoute Monthly Sustainability Report'],
        [`# Month: ${reportData.month}`],
        [`# User: ${reportData.userName} (${reportData.userEmail})`],
        [`# Total Trips: ${reportData.totalTrips}`],
        [`# Total CO2 Saved: ${reportData.emissionsSaved.toFixed(2)} kg`],
        [`# Total Distance: ${reportData.totalDistance.toFixed(2)} km`],
        [`# Primary Mode: ${reportData.topTransport}`],
        [`# Average Sustainability Score: ${reportData.avgScore.toFixed(1)}/100`],
        [],
    ];
    const csvContent = summarySection.map((r) => r.join(',')).join('\n') +
        headers.join(',') +
        '\n' +
        rows.map((r) => r.join(',')).join('\n');
    return csvContent;
}
/**
 * Generates PDF Document buffer using jsPDF
 */
function generatePDFReportBuffer(reportData) {
    const doc = new jspdf_1.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });
    // Header Banner
    doc.setFillColor(16, 185, 129); // Emerald green
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('GreenRoute – Monthly Sustainability Report', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SDG 11: Sustainable Cities | SDG 13: Climate Action | SDG 7: Clean Energy', 14, 26);
    // User & Period Info
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Report Period: ${reportData.month}`, 14, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Commuter: ${reportData.userName} (${reportData.userEmail})`, 14, 48);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 54);
    // KPI Metrics Grid Cards
    doc.setFillColor(240, 253, 244); // Green-50
    doc.setDrawColor(187, 247, 208); // Green-200
    doc.roundedRect(14, 60, 42, 24, 2, 2, 'FD');
    doc.roundedRect(62, 60, 42, 24, 2, 2, 'FD');
    doc.roundedRect(110, 60, 42, 24, 2, 2, 'FD');
    doc.roundedRect(158, 60, 42, 24, 2, 2, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('TOTAL TRIPS', 18, 67);
    doc.text('CO2 SAVED', 66, 67);
    doc.text('AVG SCORE', 114, 67);
    doc.text('TOP MODE', 162, 67);
    doc.setFontSize(14);
    doc.setTextColor(5, 150, 105); // Green-600
    doc.setFont('helvetica', 'bold');
    doc.text(`${reportData.totalTrips}`, 18, 77);
    doc.text(`${reportData.emissionsSaved.toFixed(1)} kg`, 66, 77);
    doc.text(`${reportData.avgScore.toFixed(0)}/100`, 114, 77);
    doc.text(`${reportData.topTransport}`, 162, 77);
    // IBM Granite AI Summary & Recommendations Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('IBM Granite AI Assessment & Improvement Recommendations', 14, 94);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 98, 182, 45, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const cleanAiText = (reportData.aiSummary || 'Keep choosing eco-friendly transit to maximize carbon offsets!')
        .replace(/\*\*/g, '')
        .replace(/###/g, '');
    const splitSummary = doc.splitTextToSize(cleanAiText, 174);
    doc.text(splitSummary.slice(0, 7), 18, 106);
    // Trips Table Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Logged Eco Trips Breakdown', 14, 153);
    let y = 160;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, 182, 8, 'F');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Date', 16, y + 5);
    doc.text('Origin -> Destination', 40, y + 5);
    doc.text('Mode', 110, y + 5);
    doc.text('Dist (km)', 135, y + 5);
    doc.text('CO2 Saved', 155, y + 5);
    doc.text('Score', 180, y + 5);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const tableRows = reportData.trips.slice(0, 10);
    tableRows.forEach((t) => {
        doc.setTextColor(51, 65, 85);
        const dateStr = new Date(t.createdAt).toLocaleDateString();
        const routeSummary = `${t.source.substring(0, 15)} -> ${t.destination.substring(0, 15)}`;
        doc.text(dateStr, 16, y);
        doc.text(routeSummary, 40, y);
        doc.text(t.transportType, 110, y);
        doc.text(`${t.distance.toFixed(1)}`, 135, y);
        doc.text(`${t.carbonSaved.toFixed(2)} kg`, 155, y);
        doc.text(`${t.sustainabilityScore.toFixed(0)}/100`, 180, y);
        y += 7;
    });
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('GreenRoute Platform - Verified with IBM Granite Foundation Models & SDG 11 Urban Mobility Standards', 14, 285);
    const arrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
}
//# sourceMappingURL=reportService.js.map