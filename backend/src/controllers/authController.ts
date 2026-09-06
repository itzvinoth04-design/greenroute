import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'greenroute_super_secret_jwt_key_2026_eco';

function generateToken(user: { id: string; email: string; name: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, city, preferredTransport } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        city: city || 'Eco City',
        preferredTransport: preferredTransport || 'Metro',
        role: 'user',
        points: 50, // 50 Welcome Eco Points
        rewards: {
          create: {
            points: 50,
            rewardType: 'Welcome Bonus',
            description: '50 Welcome Points for joining GreenRoute community',
          },
        },
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome bonus 50 points added.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        preferredTransport: user.preferredTransport,
        role: user.role,
        points: user.points,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        preferredTransport: user.preferredTransport,
        role: user.role,
        points: user.points,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

export async function googleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, name, googleId } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Google account email is required.' });
      return;
    }

    let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      const dummyPassword = await bcrypt.hash(googleId || 'GoogleOAuthDefaultPassword2026', 10);
      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          password: dummyPassword,
          city: 'Eco City',
          preferredTransport: 'Metro',
          role: 'user',
          points: 50,
          rewards: {
            create: {
              points: 50,
              rewardType: 'Google Sign-In Bonus',
              description: 'Welcome bonus for Google Sign-In registration',
            },
          },
        },
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Google login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        preferredTransport: user.preferredTransport,
        role: user.role,
        points: user.points,
      },
    });
  } catch (err: any) {
    console.error('Google login error:', err);
    res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      // Return ok for security privacy
      res.json({
        success: true,
        message: 'If that email exists in our system, password reset instructions have been dispatched.',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Password reset link sent to your registered email address (demo mode: password reset token generated).',
      demoResetToken: 'greenroute-reset-' + Math.random().toString(36).substring(2, 10),
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Failed to process password reset.' });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: { trips: true, redemptions: true },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Calculate aggregated savings
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      select: { carbonSaved: true, distance: true },
    });

    const totalSavedKg = trips.reduce((sum, t) => sum + t.carbonSaved, 0);
    const totalDistanceKm = trips.reduce((sum, t) => sum + t.distance, 0);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        preferredTransport: user.preferredTransport,
        role: user.role,
        points: user.points,
        createdAt: user.createdAt,
        stats: {
          totalTrips: user._count.trips,
          totalRedemptions: user._count.redemptions,
          totalCarbonSavedKg: Number(totalSavedKg.toFixed(2)),
          totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
        },
      },
    });
  } catch (err: any) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to load user profile.' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, city, preferredTransport } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(preferredTransport && { preferredTransport }),
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        city: updated.city,
        preferredTransport: updated.preferredTransport,
        role: updated.role,
        points: updated.points,
      },
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}
