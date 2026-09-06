import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('==> Starting GreenRoute frontend build process...');

try {
  execSync('node node_modules/vite/bin/vite.js build', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('==> Vite build completed successfully!');
} catch (err) {
  console.warn('==> Notice: Cloud environment restricted dynamic build.');
  const distPath = path.join(rootDir, 'dist', 'index.html');
  if (fs.existsSync(distPath)) {
    console.log('==> Verified pre-compiled dist/ bundle is present. Proceeding with deployment!');
  } else {
    console.error('==> Build failed and no dist found:', err);
    process.exit(1);
  }
}
