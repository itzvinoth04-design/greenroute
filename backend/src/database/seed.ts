import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { generateMonthlyAIReportInsights } from '../services/ibmGraniteService';

async function main() {
  console.log('🌱 Starting GreenRoute Database Seeding...');

  // Clean old data if any
  await prisma.redemption.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.report.deleteMany();
  await prisma.rewardItem.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const userPassword = await bcrypt.hash('Green@12345', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Eco Administrator',
      email: 'admin@greenroute.eco',
      password: adminPassword,
      city: 'Stockholm',
      preferredTransport: 'Metro',
      role: 'admin',
      points: 850,
    },
  });

  // 2. Create Demo Users
  const alex = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex@greenroute.eco',
      password: userPassword,
      city: 'Portland',
      preferredTransport: 'Bicycle',
      role: 'user',
      points: 380,
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@greenroute.eco',
      password: userPassword,
      city: 'Bengaluru',
      preferredTransport: 'Metro',
      role: 'user',
      points: 540,
    },
  });

  const marcus = await prisma.user.create({
    data: {
      name: 'Marcus Lind',
      email: 'marcus@greenroute.eco',
      password: userPassword,
      city: 'Copenhagen',
      preferredTransport: 'Bicycle',
      role: 'user',
      points: 490,
    },
  });

  console.log('✅ Created Admin & Demo Users');

  // 3. Create Reward Items Catalogue
  const rewardItems = await Promise.all([
    prisma.rewardItem.create({
      data: {
        title: 'Free 1-Day Regional Metro Pass',
        description: 'Unlimited rides on city metro and tram network for 24 hours.',
        pointsCost: 120,
        category: 'Transit',
        badgeIcon: 'ticket',
        available: true,
      },
    }),
    prisma.rewardItem.create({
      data: {
        title: 'Plant an Urban Tree Certificate',
        description: 'Fund 1 native tree planted in an urban community forest with GPS tag.',
        pointsCost: 250,
        category: 'Eco Impact',
        badgeIcon: 'trees',
        available: true,
      },
    }),
    prisma.rewardItem.create({
      data: {
        title: '25% Off Sustainable Cafe Voucher',
        description: 'Valid for organic fair-trade coffee and snacks at partner cafes.',
        pointsCost: 80,
        category: 'Discount',
        badgeIcon: 'coffee',
        available: true,
      },
    }),
    prisma.rewardItem.create({
      data: {
        title: 'Electric Scooter 30-Min Pass',
        description: 'Free unlock and 30 minutes of ride time on municipal shared e-scooters.',
        pointsCost: 100,
        category: 'Transit',
        badgeIcon: 'zap',
        available: true,
      },
    }),
    prisma.rewardItem.create({
      data: {
        title: 'Insulated Bamboo Commuter Bottle',
        description: 'Double-walled stainless steel bottle with laser-engraved GreenRoute logo.',
        pointsCost: 350,
        category: 'Merchandise',
        badgeIcon: 'gift',
        available: true,
      },
    }),
    prisma.rewardItem.create({
      data: {
        title: 'Clean Air Champion Gold Badge',
        description: 'Exclusive digital collector badge and profile flair for verified eco leaders.',
        pointsCost: 500,
        category: 'Eco Impact',
        badgeIcon: 'award',
        available: true,
      },
    }),
  ]);

  console.log(`✅ Created ${rewardItems.length} Reward Items in Catalogue`);

  // 4. Seed Trips for Alex Rivera
  const sampleTrips = [
    {
      source: 'Pearl District',
      destination: 'Downtown Waterfront',
      distance: 3.4,
      duration: 14,
      cost: 0.0,
      transportType: 'Bicycle',
      carbonEmission: 0.0,
      carbonSaved: 0.68,
      sustainabilityScore: 96,
      trafficDensity: 'Low',
      pointsEarned: 8,
      daysAgo: 1,
    },
    {
      source: 'Eastside Station',
      destination: 'Tech Innovation Hub',
      distance: 8.2,
      duration: 18,
      cost: 2.5,
      transportType: 'Metro',
      carbonEmission: 0.328,
      carbonSaved: 1.312,
      sustainabilityScore: 89,
      trafficDensity: 'Moderate',
      pointsEarned: 6,
      daysAgo: 2,
    },
    {
      source: 'Central Market',
      destination: 'City Library',
      distance: 1.8,
      duration: 22,
      cost: 0.0,
      transportType: 'Walking',
      carbonEmission: 0.0,
      carbonSaved: 0.36,
      sustainabilityScore: 98,
      trafficDensity: 'Low',
      pointsEarned: 10,
      daysAgo: 4,
    },
    {
      source: 'North Park',
      destination: 'South Hospital Center',
      distance: 12.0,
      duration: 26,
      cost: 4.64,
      transportType: 'EV',
      carbonEmission: 0.6,
      carbonSaved: 1.8,
      sustainabilityScore: 78,
      trafficDensity: 'Moderate',
      pointsEarned: 4,
      daysAgo: 6,
    },
    {
      source: 'Suburban Plaza',
      destination: 'Central Station',
      distance: 7.5,
      duration: 25,
      cost: 1.85,
      transportType: 'Bus',
      carbonEmission: 0.6,
      carbonSaved: 0.9,
      sustainabilityScore: 81,
      trafficDensity: 'Moderate',
      pointsEarned: 5,
      daysAgo: 8,
    },
    {
      source: 'Riverfront Blvd',
      destination: 'Arts District',
      distance: 4.0,
      duration: 16,
      cost: 0.0,
      transportType: 'Bicycle',
      carbonEmission: 0.0,
      carbonSaved: 0.8,
      sustainabilityScore: 95,
      trafficDensity: 'Low',
      pointsEarned: 8,
      daysAgo: 12,
    },
  ];

  for (const t of sampleTrips) {
    const tripDate = new Date();
    tripDate.setDate(tripDate.getDate() - t.daysAgo);

    await prisma.trip.create({
      data: {
        userId: alex.id,
        source: t.source,
        destination: t.destination,
        distance: t.distance,
        duration: t.duration,
        cost: t.cost,
        transportType: t.transportType,
        carbonEmission: t.carbonEmission,
        carbonSaved: t.carbonSaved,
        sustainabilityScore: t.sustainabilityScore,
        trafficDensity: t.trafficDensity,
        pointsEarned: t.pointsEarned,
        createdAt: tripDate,
      },
    });

    await prisma.reward.create({
      data: {
        userId: alex.id,
        points: t.pointsEarned,
        rewardType: `${t.transportType} Commute Points`,
        description: `Logged sustainable travel from ${t.source} to ${t.destination}`,
        createdAt: tripDate,
      },
    });
  }

  // 5. Create Monthly Report for Alex
  const totalSaved = sampleTrips.reduce((acc, curr) => acc + curr.carbonSaved, 0);
  const totalDistance = sampleTrips.reduce((acc, curr) => acc + curr.distance, 0);
  const avgScore = sampleTrips.reduce((acc, curr) => acc + curr.sustainabilityScore, 0) / sampleTrips.length;

  const aiInsights = generateMonthlyAIReportInsights(alex.name, sampleTrips.length, totalSaved, 'Bicycle');

  await prisma.report.create({
    data: {
      userId: alex.id,
      month: 'August 2026',
      totalTrips: sampleTrips.length,
      emissionsSaved: Number(totalSaved.toFixed(2)),
      totalDistance: Number(totalDistance.toFixed(1)),
      topTransport: 'Bicycle',
      avgScore: Number(avgScore.toFixed(0)),
      aiSummary: aiInsights,
    },
  });

  console.log('✅ Seeded Sample Trips and Monthly AI Report');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
