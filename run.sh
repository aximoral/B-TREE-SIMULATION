#!/usr/bin/env bash
set -e

# Change to script directory
cd "$(dirname "$0")"

echo "======================================================"
echo "   B-Tree Interactive Visualizer - One-Click Launcher"
echo "======================================================"
echo ""

# 1. Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not detected on your system."
    echo ""
    echo "Please install Node.js (v18 or higher) from:"
    echo "https://nodejs.org/"
    echo ""
    echo "After installing Node.js, run this script again!"
    echo "======================================================"
    read -p "Press Enter to exit..."
    exit 1
fi

# 2. Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "[1/2] First run detected. Installing dependencies..."
    echo "(This only happens once)"
    echo ""
    npm install
    echo ""
    echo "Dependencies successfully installed!"
    echo ""
fi

# 3. Launch Vite server (vite.config.ts will automatically open the browser)
echo "[2/2] Starting local Vite server..."
echo "Your web browser will open automatically."
echo ""
echo "(Press Ctrl + C anytime to stop the server)"
echo "======================================================"
echo ""

npm run dev
