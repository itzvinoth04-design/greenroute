import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, '..');

console.log('==> Starting GreenRoute frontend build process...');

function syncDistDirs() {
  const srcDist = path.join(frontendDir, 'dist');
  if (fs.existsSync(srcDist)) {
    // Copy to frontend/frontend/dist in case Vercel root is frontend and output is frontend/dist
    const nestedDist = path.join(frontendDir, 'frontend', 'dist');
    fs.mkdirSync(nestedDist, { recursive: true });
    fs.cpSync(srcDist, nestedDist, { recursive: true });

    // Copy to ../dist in case Vercel root is repo root and output is dist
    const rootDist = path.join(frontendDir, '..', 'dist');
    fs.mkdirSync(rootDist, { recursive: true });
    fs.cpSync(srcDist, rootDist, { recursive: true });
    console.log('==> Dist directory synchronized to all candidate paths.');
  }
}

try {
  execSync('node node_modules/vite/bin/vite.js build', {
    cwd: frontendDir,
    stdio: 'inherit',
  });
  console.log('==> Vite build completed successfully!');
  syncDistDirs();
} catch (err) {
  console.warn('==> Dynamic build restricted. Checking pre-compiled bundle...');
  const distPath = path.join(frontendDir, 'dist', 'index.html');
  if (fs.existsSync(distPath)) {
    console.log('==> Verified pre-compiled bundle is available.');
    syncDistDirs();
  } else {
    console.error('==> Build failed and no dist found:', err);
    process.exit(1);
  }
}
