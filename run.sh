#!/bin/bash
# Run Script for Quiz App
# This script starts both backend and frontend in separate processes

echo "🚀 Starting Quiz App (Backend + Frontend)"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17+${NC}"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites found${NC}"
echo ""

# Start Backend
echo -e "${YELLOW}Starting Backend (Spring Boot)...${NC}"
cd "$(dirname "$0")"

# Check if target directory exists (built app)
if [ ! -d "target" ]; then
    echo "Building backend..."
    mvn clean install > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Backend build failed${NC}"
        exit 1
    fi
fi

# Start backend in background
mvn spring-boot:run &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  Backend URL: http://localhost:8080"
echo ""

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo -e "${YELLOW}Starting Frontend (Vite)...${NC}"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend dependencies installation failed${NC}"
        kill $BACKEND_PID
        exit 1
    fi
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  Frontend URL: http://localhost:5173"
echo ""

echo -e "${GREEN}=========================================="
echo "✅ Quiz App is running!"
echo "=========================================="
echo ""
echo "Test Credentials:"
echo "  Admin:    admin@example.com / admin123"
echo "  Student 1: john@example.com / student123"
echo "  Student 2: jane@example.com / student123"
echo ""
echo "Backend API: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

