import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Ensure SQLite database file is writable on Vercel Serverless environment (/tmp)
if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/dev.db';
  const possibleSourcePaths = [
    path.join(process.cwd(), 'backend', 'prisma', 'dev.db'),
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
  ];

  if (!fs.existsSync(tmpDbPath)) {
    for (const src of possibleSourcePaths) {
      if (fs.existsSync(src)) {
        try {
          fs.copyFileSync(src, tmpDbPath);
          break;
        } catch (err) {
          console.warn('Could not copy db to /tmp:', err);
        }
      }
    }
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
}

export const prisma = new PrismaClient({
  datasources: process.env.DATABASE_URL
    ? {
        db: {
          url: process.env.DATABASE_URL,
        },
      }
    : undefined,
});
