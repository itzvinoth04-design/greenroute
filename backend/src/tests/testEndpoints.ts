import axios from 'axios';

async function testAllEndpoints() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🚀 Testing GreenRoute API Endpoints...\n');

  try {
    // 1. Health
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data.status);

    // 2. Route Calculation
    const routeRes = await axios.post(`${BASE_URL}/routes/calculate`, {
      source: 'Central Station',
      destination: 'University Campus',
      trafficDensity: 'Moderate',
    });
    console.log(
      `✅ Route Planner: calculated ${routeRes.data.data.routes.length} options for ${routeRes.data.data.distanceKm} km trip. Top mode: ${routeRes.data.data.recommendedMode}`
    );

    // 3. AI Assistant (IBM Granite)
    const aiRes = await axios.post(`${BASE_URL}/ai/chat`, {
      message: 'Why should I choose Metro for an 8 km trip?',
      context: { distanceKm: 8, selectedMode: 'Metro' },
    });
    console.log(`✅ IBM Granite AI response model: ${aiRes.data.data.model}`);
    console.log(`   AI Snippet: ${aiRes.data.data.answer.substring(0, 120)}...`);

    // 4. User Auth (Login Demo User)
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'alex@greenroute.eco',
      password: 'Green@12345',
    });
    const token = loginRes.data.token;
    console.log(`✅ Auth Login: Success for ${loginRes.data.user.name}, Token acquired.`);

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 5. User Profile
    const profileRes = await axios.get(`${BASE_URL}/auth/profile`, { headers: authHeaders });
    console.log(
      `✅ User Profile: ${profileRes.data.user.name} (${profileRes.data.user.city}) with ${profileRes.data.user.points} pts`
    );

    // 6. Rewards Catalog & Leaderboard
    const catalogRes = await axios.get(`${BASE_URL}/rewards/catalog`);
    console.log(`✅ Rewards Catalog: ${catalogRes.data.items.length} items available`);

    const leaderboardRes = await axios.get(`${BASE_URL}/rewards/leaderboard`, { headers: authHeaders });
    console.log(`✅ Leaderboard: ${leaderboardRes.data.leaderboard.length} ranked users`);

    // 7. Eco Insights
    const insightsRes = await axios.get(`${BASE_URL}/trips/insights`, { headers: authHeaders });
    console.log(
      `✅ Eco Insights: ${insightsRes.data.insights.totalTrips} trips, ${insightsRes.data.insights.totalCarbonSavedKg} kg CO2 saved`
    );

    // 8. Admin Auth & Metrics
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@greenroute.eco',
      password: 'Admin@12345',
    });
    const adminHeaders = { Authorization: `Bearer ${adminLogin.data.token}` };
    const adminMetrics = await axios.get(`${BASE_URL}/admin/metrics`, { headers: adminHeaders });
    console.log(
      `✅ Admin Metrics: ${adminMetrics.data.metrics.totalUsers} users, ${adminMetrics.data.metrics.totalTrips} trips, ${adminMetrics.data.metrics.totalCO2SavedKg} kg CO2 saved`
    );

    console.log('\n🎉 ALL LIVE API ENDPOINTS ARE 100% OPERATIONAL & VERIFIED!');
  } catch (err: any) {
    console.error('❌ Endpoint test failure:', err?.response?.data || err?.message || err);
    process.exit(1);
  }
}

testAllEndpoints();
