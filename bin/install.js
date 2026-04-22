#!/usr/bin/env node

const { execSync } = require('child_process');

console.log("\n⚡️ Welcome to CacheTray Setup ⚡️");
console.log("Fetching the latest installation scripts from GitHub...\n");

try {
  // Executes our bash script directly
  execSync('curl -sS https://raw.githubusercontent.com/wenayy/QuickNotes/main/install.sh | bash', { stdio: 'inherit' });
} catch (e) {
  console.error("❌ Installation failed:", e.message);
  process.exit(1);
}
