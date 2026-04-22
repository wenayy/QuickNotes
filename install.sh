#!/bin/bash

# CacheTray Installation Script
# This script clones the CacheTray repository and sets it up in a hidden folder.

set -e

# Configuration
REPO_URL="https://github.com/wenayy/QuickNotes.git"
INSTALL_DIR="$HOME/.cachetray"

echo "⚡️ Installing CacheTray..."

# Check requirements
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed. Please install git first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js first."
    exit 1
fi

# Clone or update
if [ -d "$INSTALL_DIR" ]; then
    echo "🔄 Updating existing installation..."
    cd "$INSTALL_DIR"
    git pull origin main --quiet
else
    echo "📥 Cloning repository..."
    git clone "$REPO_URL" "$INSTALL_DIR" --quiet
    cd "$INSTALL_DIR"
fi

# Install dependencies
echo "📦 Installing dependencies (may take a moment)..."
npm install --no-audit --no-fund

# Run
echo "🚀 Launching CacheTray..."
npm start &

echo ""
echo "✅ CacheTray is ready! Use Control + Space to toggle."
echo "You can now close this terminal."
