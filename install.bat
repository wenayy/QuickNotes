@echo off
echo ⚡️ Welcome to CacheTray Windows Setup ⚡️
echo Detecting environment...

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js/npm not found. Please install it from https://nodejs.org/
    pause
    exit /b
)

echo 📦 Installing dependencies...
call npm install

echo 🚀 Launching CacheTray...
start /b npm start

echo ✅ CacheTray is now running in your System Tray!
echo Shortcut: Control + Space
pause
