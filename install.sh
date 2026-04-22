#!/bin/bash

# CacheTray Installation Script
# This script clones the CacheTray repository and sets it up in a hidden folder.

set -e

# Configuration
REPO_URL="https://github.com/wenayy/QuickNotes.git"
INSTALL_DIR="$HOME/.bolt-app"

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
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

# Run
echo "🚀 Launching CacheTray..."
npm start &

echo "✅ CacheTray is ready! Use Option + Space to toggle."
