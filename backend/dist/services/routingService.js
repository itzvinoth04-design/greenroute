"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHaversineDistance = calculateHaversineDistance;
exports.geocodeLocation = geocodeLocation;
exports.planRoutes = planRoutes;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../config/constants");
const emissionCalculator_1 = require("./emissionCalculator");
const scoringEngine_1 = require("./scoringEngine");
// Pre-defined city hub coordinates prioritizing Tamil Nadu & India, with global support
const KNOWN_HUBS = {
    // Chennai & Tamil Nadu
    'perambur': { lat: 13.1121, lng: 80.2450, name: 'Perambur, Chennai, Tamil Nadu, India' },
    'perumbur': { lat: 13.1121, lng: 80.2450, name: 'Perambur, Chennai, Tamil Nadu, India' },
    'chennai central': { lat: 13.0827, lng: 80.2755, name: 'Chennai Central (Puratchi Thalaivar Dr. M.G.R. Central), Tamil Nadu' },
    'central station': { lat: 13.0827, lng: 80.2755, name: 'Chennai Central Station, Tamil Nadu' },
    'central': { lat: 13.0827, lng: 80.2755, name: 'Chennai Central, Tamil Nadu' },
    'egmore': { lat: 13.0784, lng: 80.2608, name: 'Chennai Egmore Station, Tamil Nadu' },
    'guindy': { lat: 13.0067, lng: 80.2025, name: 'Guindy, Chennai, Tamil Nadu' },
    'tambaram': { lat: 12.9249, lng: 80.1000, name: 'Tambaram, Chennai, Tamil Nadu' },
    't nagar': { lat: 13.0418, lng: 80.2341, name: 'T. Nagar, Chennai, Tamil Nadu' },
    'thyagaraya nagar': { lat: 13.0418, lng: 80.2341, name: 'T. Nagar, Chennai, Tamil Nadu' },
    'anna nagar': { lat: 13.0850, lng: 80.2101, name: 'Anna Nagar, Chennai, Tamil Nadu' },
    'adyar': { lat: 13.0012, lng: 80.2565, name: 'Adyar, Chennai, Tamil Nadu' },
    'velachery': { lat: 12.9791, lng: 80.2185, name: 'Velachery, Chennai, Tamil Nadu' },
    'koyambedu': { lat: 13.0694, lng: 80.1948, name: 'Koyambedu (CMBT), Chennai, Tamil Nadu' },
    'marina beach': { lat: 13.0500, lng: 80.2824, name: 'Marina Beach, Chennai, Tamil Nadu' },
    'marina': { lat: 13.0500, lng: 80.2824, name: 'Marina Beach, Chennai, Tamil Nadu' },
    'anna university': { lat: 13.0109, lng: 80.2354, name: 'Anna University, Guindy, Chennai, Tamil Nadu' },
    'university campus': { lat: 13.0109, lng: 80.2354, name: 'Anna University Campus, Chennai, Tamil Nadu' },
    'iit madras': { lat: 12.9915, lng: 80.2337, name: 'IIT Madras, Adyar, Chennai, Tamil Nadu' },
    'city airport': { lat: 12.9941, lng: 80.1709, name: 'Chennai International Airport (MAA), Tamil Nadu' },
    'airport': { lat: 12.9941, lng: 80.1709, name: 'Chennai International Airport (MAA), Tamil Nadu' },
    'tidel park': { lat: 12.9863, lng: 80.2432, name: 'Tidel Park, OMR, Chennai, Tamil Nadu' },
    'green tech park': { lat: 12.9863, lng: 80.2432, name: 'Tidel Park / Green Tech Hub, OMR, Chennai, Tamil Nadu' },
    'downtown': { lat: 13.0827, lng: 80.2707, name: 'Downtown Chennai, Tamil Nadu' },
    'omr': { lat: 12.9150, lng: 80.2290, name: 'Old Mahabalipuram Road (IT Corridor), Chennai' },
    'sholinganallur': { lat: 12.9010, lng: 80.2279, name: 'Sholinganallur, Chennai, Tamil Nadu' },
    'porur': { lat: 13.0382, lng: 80.1565, name: 'Porur, Chennai, Tamil Nadu' },
    'chromepet': { lat: 12.9516, lng: 80.1462, name: 'Chromepet, Chennai, Tamil Nadu' },
    'coimbatore': { lat: 11.0168, lng: 76.9558, name: 'Coimbatore, Tamil Nadu' },
    'madurai': { lat: 9.9252, lng: 78.1198, name: 'Madurai, Tamil Nadu' },
    'trichy': { lat: 10.7905, lng: 78.7047, name: 'Tiruchirappalli, Tamil Nadu' },
    'tiruchirappalli': { lat: 10.7905, lng: 78.7047, name: 'Tiruchirappalli, Tamil Nadu' },
    'salem': { lat: 11.6643, lng: 78.1460, name: 'Salem, Tamil Nadu' },
    'tirunelveli': { lat: 8.7139, lng: 77.7567, name: 'Tirunelveli, Tamil Nadu' },
    'vellore': { lat: 12.9165, lng: 79.1325, name: 'Vellore, Tamil Nadu' },
    // Other major Indian cities
    'bengaluru': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka, India' },
    'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka, India' },
    'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana, India' },
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra, India' },
    'delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
    'new delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
    // Global Hubs (supported when specifically typed)
    'new york': { lat: 40.7128, lng: -74.006, name: 'New York, USA' },
    'london': { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
    'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
    'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
    'singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
};
/**
 * Calculates Great Circle distance between two points in km
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDistance = R * c;
    // Urban road network detour factor (typically 1.25x - 1.35x of straight line)
    return Number((straightDistance * 1.3).toFixed(2));
}
/**
 * Normalizes query string with common phonetic variants
 */
function normalizeQuery(query) {
    let q = query.trim().toLowerCase();
    // Map common spelling variations
    q = q.replace(/\bperumbur\b/g, 'perambur');
    q = q.replace(/\bmadras\b/g, 'chennai');
    q = q.replace(/\bkovai\b/g, 'coimbatore');
    q = q.replace(/\btrichy\b/g, 'tiruchirappalli');
    q = q.replace(/\bt\.nagar\b/g, 't nagar');
    return q;
}
/**
 * Resolves location name to coordinates using OpenStreetMap Nominatim with India/Tamil Nadu priority
 */
async function geocodeLocation(query, defaultFallback) {
    const normalized = normalizeQuery(query);
    // 1. Check known hubs dictionary first
    for (const [key, hub] of Object.entries(KNOWN_HUBS)) {
        if (normalized === key || normalized.includes(key)) {
            return { name: hub.name, lat: hub.lat, lng: hub.lng };
        }
    }
    // 2. Query OpenStreetMap Nominatim API
    const queriesToTry = [
        normalized,
        `${normalized}, Tamil Nadu, India`,
        `${normalized}, India`,
    ];
    for (const q of queriesToTry) {
        try {
            const response = await axios_1.default.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q,
                    format: 'json',
                    addressdetails: 1,
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'GreenRoute-SustainableTransportPlanner/1.0 (contact@greenroute.eco)',
                },
                timeout: 5000,
            });
            if (response.data && response.data.length > 0) {
                const item = response.data[0];
                return {
                    name: item.display_name,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon),
                };
            }
        }
        catch {
            // Continue to next query format
        }
    }
    // 3. Fallback to default
    return defaultFallback;
}
/**
 * Generates smooth path waypoints between two points for Leaflet map rendering
 */
function generatePathWaypoints(start, end, offsetVariation) {
    const points = [start];
    const steps = 6;
    for (let i = 1; i < steps; i++) {
        const fraction = i / steps;
        const lat = start[0] + (end[0] - start[0]) * fraction;
        const lng = start[1] + (end[1] - start[1]) * fraction;
        // Add slight curvature and mode-specific path variation
        const curve = Math.sin(fraction * Math.PI) * offsetVariation;
        points.push([Number((lat + curve).toFixed(5)), Number((lng + curve * 0.8).toFixed(5))]);
    }
    points.push(end);
    return points;
}
/**
 * Plans and ranks routes across all 7 transport modes
 */
async function planRoutes(sourceInput, destinationInput, trafficDensity = 'Moderate') {
    // Default Indian / Tamil Nadu coordinates (Perambur & Chennai Central)
    const defaultOrigin = {
        name: 'Perambur, Chennai, Tamil Nadu',
        lat: 13.1121,
        lng: 80.2450,
    };
    const defaultDestination = {
        name: 'Chennai Central, Tamil Nadu',
        lat: 13.0827,
        lng: 80.2755,
    };
    // Resolve coordinates
    const origin = await geocodeLocation(sourceInput, defaultOrigin);
    const destination = await geocodeLocation(destinationInput, defaultDestination);
    // Calculate distance
    let distance = calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    if (distance < 0.5)
        distance = 5.2; // realistic urban transit distance
    const modes = [
        'Walking',
        'Bicycle',
        'Metro',
        'Bus',
        'EV',
        'Ride Share',
        'Car',
    ];
    // Compute metrics for each mode
    const rawMetrics = modes.map((mode) => (0, emissionCalculator_1.computeRouteMetrics)({
        distanceKm: distance,
        mode,
        trafficDensity,
    }));
    // Score & rank via AI Sustainability Engine
    const scored = (0, scoringEngine_1.rankAndScoreRoutes)(rawMetrics);
    // Attach path coordinates and styling for Leaflet map
    const enrichedRoutes = scored.map((item, idx) => {
        const offset = (idx - 3) * 0.0035;
        const path = generatePathWaypoints([origin.lat, origin.lng], [destination.lat, destination.lng], offset);
        return {
            ...item,
            pathCoordinates: path,
            color: constants_1.TRANSPORT_MODES[item.mode].color,
            icon: constants_1.TRANSPORT_MODES[item.mode].icon,
        };
    });
    return {
        origin,
        destination,
        distanceKm: distance,
        trafficDensity,
        routes: enrichedRoutes,
        recommendedMode: enrichedRoutes[0].mode,
    };
}
//# sourceMappingURL=routingService.js.map