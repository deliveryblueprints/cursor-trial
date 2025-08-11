#!/bin/bash

# Snake Game Playwright Test Runner
# This script helps you run tests easily

echo "🐍 Snake Game Test Runner"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Install Playwright browsers if they don't exist
if [ ! -d "node_modules/.cache/ms-playwright" ]; then
    echo "🌐 Installing Playwright browsers..."
    npm run install-browsers
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Playwright browsers"
        exit 1
    fi
fi

# Check if web server is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "🌐 Web server already running on port 8000"
else
    echo "🌐 Starting web server on port 8000..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
    
    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    sleep 3
    
    # Check if server started successfully
    if ! lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Failed to start web server"
        exit 1
    fi
    
    echo "✅ Web server started successfully"
fi

echo ""
echo "🚀 Ready to run tests!"
echo ""
echo "Available commands:"
echo "  npm test              - Run all tests"
echo "  npm run test:headed   - Run tests with browser visible"
echo "  npm run test:debug    - Run tests in debug mode"
echo "  npm run test:ui       - Run tests with interactive UI"
echo ""
echo "Or run specific test files:"
echo "  npx playwright test snake-game.spec.ts"
echo "  npx playwright test food-visibility.spec.ts"
echo ""

# Function to cleanup server on script exit
cleanup() {
    if [ ! -z "$SERVER_PID" ]; then
        echo "🛑 Stopping web server..."
        kill $SERVER_PID 2>/dev/null
    fi
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Run all tests"
echo "2) Run only food visibility tests"
echo "3) Run tests with browser visible"
echo "4) Run tests in debug mode"
echo "5) Open interactive test UI"
echo "6) Just keep server running"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🧪 Running all tests..."
        npm test
        ;;
    2)
        echo "🔍 Running food visibility tests..."
        npx playwright test food-visibility.spec.ts
        ;;
    3)
        echo "👁️ Running tests with browser visible..."
        npm run test:headed
        ;;
    4)
        echo "🐛 Running tests in debug mode..."
        npm run test:debug
        ;;
    5)
        echo "🎮 Opening interactive test UI..."
        npm run test:ui
        ;;
    6)
        echo "🌐 Keeping web server running..."
        echo "Press Ctrl+C to stop the server"
        wait
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Tests completed!"
echo "📊 View detailed report: npm run test:report"
