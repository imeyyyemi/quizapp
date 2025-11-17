#!/bin/bash

# Quiz App Startup Script for macOS/Linux

echo "🚀 Starting Quiz App Backend & Frontend"
echo "========================================"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "\n${BLUE}Step 1: Checking prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${YELLOW}❌ Java not found. Please install Java 17+${NC}"
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo -e "${YELLOW}❌ Maven not found. Please install Maven${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js not found. Please install Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites found${NC}"

# Step 2: Build backend
echo -e "\n${BLUE}Step 2: Building backend...${NC}"
cd /Users/imeylonganilla/Documents/repo/quizapp
mvn clean install -DskipTests > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend built successfully${NC}"
else
    echo -e "${YELLOW}❌ Build failed${NC}"
    exit 1
fi

# Step 3: Start backend in background
echo -e "\n${BLUE}Step 3: Starting backend server...${NC}"
echo "Command: mvn spring-boot:run"
mvn spring-boot:run &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Step 4: Wait for backend to start
echo -e "\n${BLUE}Step 4: Waiting for backend to be ready (15 seconds)...${NC}"
sleep 15

# Check if backend is responding
if curl -s http://localhost:8080/api/auth/user/1 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is responding on http://localhost:8080${NC}"
else
    echo -e "${YELLOW}⚠️  Backend may still be starting...${NC}"
fi

# Step 5: Start frontend
echo -e "\n${BLUE}Step 5: Starting frontend dev server...${NC}"
echo "Command: npm run dev (from frontend directory)"
cd /Users/imeylonganilla/Documents/repo/quizapp/frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

# Step 6: Display info
echo -e "\n${BLUE}========================================"
echo "✅ BOTH SERVICES RUNNING!"
echo "========================================${NC}"
echo -e "\n${GREEN}Backend:${NC}  http://localhost:8080"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "\n${YELLOW}Test Credentials:${NC}"
echo "  Admin: admin@example.com / admin123"
echo "  Student: john@example.com / student123"
echo -e "\n${YELLOW}To stop services:${NC}"
echo "  Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for processes
wait

