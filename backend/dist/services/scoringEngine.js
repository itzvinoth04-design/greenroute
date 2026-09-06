"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankAndScoreRoutes = rankAndScoreRoutes;
const constants_1 = require("../config/constants");
/**
 * Normalizes an array of values where LOWER is BETTER (e.g., carbon, cost, time).
 * Returns scores on a scale from 10 to 100 (or 100 if all equal).
 */
function normalizeInverse(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min) {
        return values.map(() => 100);
    }
    // Linear scaling: lowest value gets 100, highest gets 20 (avoiding harsh zero penalties)
    return values.map((val) => {
        const fraction = (val - min) / (max - min);
        const score = 100 - fraction * 80;
        return Math.max(10, Math.min(100, Number(score.toFixed(1))));
    });
}
/**
 * Normalizes an array of route metrics using the GreenRoute multi-criteria formula:
 * Score = 40% Carbon Impact + 30% Cost + 20% Time + 10% Traffic
 */
function rankAndScoreRoutes(routes) {
    if (!routes || routes.length === 0)
        return [];
    // Extract raw arrays for normalization
    const emissions = routes.map((r) => r.carbonEmissionKg);
    const costs = routes.map((r) => r.costEstimate);
    const times = routes.map((r) => r.travelTimeMinutes);
    const carbonScores = normalizeInverse(emissions);
    const costScores = normalizeInverse(costs);
    const timeScores = normalizeInverse(times);
    // Compute composite score for each route
    const scoredRoutes = routes.map((route, idx) => {
        const carbonScore = carbonScores[idx];
        const costScore = costScores[idx];
        const timeScore = timeScores[idx];
        const trafficScore = constants_1.TRAFFIC_MULTIPLIERS[route.trafficDensity]?.trafficPenaltyScore ?? 70;
        // Apply exact weights
        const compositeScore = constants_1.SCORING_WEIGHTS.carbonImpact * carbonScore +
            constants_1.SCORING_WEIGHTS.cost * costScore +
            constants_1.SCORING_WEIGHTS.time * timeScore +
            constants_1.SCORING_WEIGHTS.traffic * trafficScore;
        const roundedScore = Math.min(100, Math.max(1, Math.round(compositeScore)));
        return {
            ...route,
            sustainabilityScore: roundedScore,
            scoreBreakdown: {
                carbonScore,
                costScore,
                timeScore,
                trafficScore,
            },
            rank: 0,
            aiRecommendationReason: '',
        };
    });
    // Sort by sustainabilityScore descending
    scoredRoutes.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
    // Assign ranks, badges, and contextual AI recommendation text
    const lowestTime = Math.min(...scoredRoutes.map((r) => r.travelTimeMinutes));
    const lowestCost = Math.min(...scoredRoutes.map((r) => r.costEstimate));
    scoredRoutes.forEach((route, index) => {
        route.rank = index + 1;
        // Assign badges
        if (index === 0) {
            route.badge = 'Best Eco Choice';
            route.aiRecommendationReason = `Top balanced sustainability choice! Achieves a ${route.sustainabilityScore}/100 score by drastically curbing emissions while preserving convenient travel time.`;
        }
        else if (route.carbonEmissionKg === 0) {
            route.badge = 'Zero Emission';
            route.aiRecommendationReason = `Zero direct tailpipe emissions! Maximizes health benefits and earns top green points (${route.pointsEarned} pts).`;
        }
        else if (route.costEstimate === lowestCost && route.costEstimate > 0) {
            route.badge = 'Best Value';
            route.aiRecommendationReason = `Economical choice at only $${route.costEstimate.toFixed(2)} with low environmental footprint.`;
        }
        else if (route.travelTimeMinutes === lowestTime) {
            route.badge = 'Fastest Route';
            route.aiRecommendationReason = `Quickest commute at ${route.travelTimeMinutes} mins, but higher carbon emissions (${route.carbonEmissionKg} kg CO2).`;
        }
        else {
            route.aiRecommendationReason = `${route.mode} provides a solid route alternative with ${route.carbonSavedKg} kg CO2 saved compared to driving a personal car.`;
        }
    });
    return scoredRoutes;
}
//# sourceMappingURL=scoringEngine.js.map