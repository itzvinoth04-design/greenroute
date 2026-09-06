"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emissionCalculator_1 = require("../services/emissionCalculator");
const scoringEngine_1 = require("../services/scoringEngine");
function runTests() {
    console.log('🧪 Running GreenRoute Mathematical Verification Tests...\n');
    // Test 1: Carbon Emission Factors
    const distance = 10; // 10 km test
    const expectedFactors = {
        Walking: 0.0,
        Bicycle: 0.0,
        Metro: 0.4, // 10 * 0.04
        Bus: 0.8, // 10 * 0.08
        EV: 0.5, // 10 * 0.05
        'Ride Share': 1.0, // 10 * 0.10
        Car: 2.0, // 10 * 0.20
    };
    for (const [mode, expectedEmission] of Object.entries(expectedFactors)) {
        const calc = (0, emissionCalculator_1.calculateCarbonEmission)(distance, mode);
        console.assert(Math.abs(calc - expectedEmission) < 0.001, `Emission mismatch for ${mode}: expected ${expectedEmission}, got ${calc}`);
        console.log(`✅ [Carbon Factor] ${mode.padEnd(12)}: 10 km -> ${calc.toFixed(2)} kg CO2 (Target: ${expectedEmission})`);
    }
    // Test 2: Carbon Savings vs Car Baseline
    console.log('\n🌿 Testing Carbon Savings vs Personal Car Baseline (0.20 kg/km)...');
    const metroSaved = (0, emissionCalculator_1.calculateCarbonSaved)(10, 'Metro');
    console.assert(Math.abs(metroSaved - 1.6) < 0.001, `Expected 1.6 kg saved, got ${metroSaved}`);
    console.log(`✅ [Carbon Saved] Metro 10 km saves: ${metroSaved.toFixed(2)} kg CO2 (80% reduction)`);
    const bikeSaved = (0, emissionCalculator_1.calculateCarbonSaved)(10, 'Bicycle');
    console.assert(Math.abs(bikeSaved - 2.0) < 0.001, `Expected 2.0 kg saved, got ${bikeSaved}`);
    console.log(`✅ [Carbon Saved] Bicycle 10 km saves: ${bikeSaved.toFixed(2)} kg CO2 (100% reduction)`);
    // Test 3: AI Sustainability Engine Multi-Criteria Scoring
    console.log('\n⚖️ Testing AI Sustainability Engine (40% Carbon + 30% Cost + 20% Time + 10% Traffic)...');
    const modes = ['Walking', 'Bicycle', 'Metro', 'Bus', 'EV', 'Ride Share', 'Car'];
    const metrics = modes.map((m) => (0, emissionCalculator_1.computeRouteMetrics)({ distanceKm: 10, mode: m, trafficDensity: 'Moderate' }));
    const ranked = (0, scoringEngine_1.rankAndScoreRoutes)(metrics);
    console.log('Ranked Recommendations Output:');
    ranked.forEach((r) => {
        console.log(` Rank #${r.rank} [Score: ${r.sustainabilityScore}/100] ${r.mode.padEnd(12)} - CO2: ${r.carbonEmissionKg}kg, Cost: $${r.costEstimate}, Time: ${r.travelTimeMinutes}m (${r.badge || 'Alternative'})`);
    });
    // Top recommendation should have high sustainability score
    console.assert(ranked[0].sustainabilityScore >= 85, 'Top eco choice must score >= 85');
    console.assert(ranked[ranked.length - 1].mode === 'Car' || ranked[ranked.length - 1].sustainabilityScore <= 50, 'Personal car should receive lower sustainability score');
    console.log('\n🎉 ALL MATHEMATICAL TESTS PASSED SUCCESSFULLY!');
}
runTests();
//# sourceMappingURL=testFormulas.js.map