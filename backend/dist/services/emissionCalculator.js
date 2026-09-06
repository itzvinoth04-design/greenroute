"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCarbonEmission = calculateCarbonEmission;
exports.calculateCarbonSaved = calculateCarbonSaved;
exports.calculateTravelTime = calculateTravelTime;
exports.calculateTravelCost = calculateTravelCost;
exports.computeRouteMetrics = computeRouteMetrics;
const constants_1 = require("../config/constants");
/**
 * Calculates carbon emissions according to GreenRoute specification:
 * CarbonEmission = Distance × EmissionFactor
 */
function calculateCarbonEmission(distanceKm, mode) {
    const details = constants_1.TRANSPORT_MODES[mode];
    if (!details) {
        throw new Error(`Unsupported transport mode: ${mode}`);
    }
    const emission = distanceKm * details.emissionFactor;
    return Number(emission.toFixed(3));
}
/**
 * Calculates carbon savings compared to personal ICE Car baseline
 */
function calculateCarbonSaved(distanceKm, mode) {
    const carBaseline = distanceKm * constants_1.BASELINE_CAR_EMISSION_FACTOR;
    const currentEmission = calculateCarbonEmission(distanceKm, mode);
    const saved = Math.max(0, carBaseline - currentEmission);
    return Number(saved.toFixed(3));
}
/**
 * Calculates estimated travel time in minutes based on mode speed and traffic congestion
 */
function calculateTravelTime(distanceKm, mode, traffic = 'Moderate') {
    const details = constants_1.TRANSPORT_MODES[mode];
    let effectiveSpeed = details.avgSpeedKmh;
    // Traffic affects road vehicles (Bus, EV, Ride Share, Car)
    if (['Bus', 'EV', 'Ride Share', 'Car'].includes(mode)) {
        effectiveSpeed *= constants_1.TRAFFIC_MULTIPLIERS[traffic].speedFactor;
    }
    // Metro runs on dedicated tracks, Walking & Bicycle generally bypass motor vehicle jams
    const timeInHours = distanceKm / effectiveSpeed;
    const minutes = Math.ceil(timeInHours * 60);
    return Math.max(1, minutes);
}
/**
 * Calculates monetary travel cost
 */
function calculateTravelCost(distanceKm, mode) {
    const details = constants_1.TRANSPORT_MODES[mode];
    const cost = details.baseCost + distanceKm * details.costPerKm;
    return Number(cost.toFixed(2));
}
/**
 * Computes complete route metrics for a single transport mode
 */
function computeRouteMetrics(input) {
    const traffic = input.trafficDensity || 'Moderate';
    const emission = calculateCarbonEmission(input.distanceKm, input.mode);
    const saved = calculateCarbonSaved(input.distanceKm, input.mode);
    const time = calculateTravelTime(input.distanceKm, input.mode, traffic);
    const cost = calculateTravelCost(input.distanceKm, input.mode);
    const points = constants_1.TRANSPORT_MODES[input.mode].pointsPerTrip;
    return {
        mode: input.mode,
        distanceKm: Number(input.distanceKm.toFixed(2)),
        carbonEmissionKg: emission,
        carbonSavedKg: saved,
        travelTimeMinutes: time,
        costEstimate: cost,
        trafficDensity: traffic,
        pointsEarned: points,
    };
}
//# sourceMappingURL=emissionCalculator.js.map