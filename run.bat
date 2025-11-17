@echo off
REM Run Script for Quiz App (Windows)
REM This script starts both backend and frontend in separate processes

echo.
echo ======== 9 Starting Quiz App (Backend + Frontend) ========
echo.

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java is not installed. Please install Java 17+
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven is not installed. Please install Maven
    pause
    exit /b 1
)

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)

echo [OK] All prerequisites found
echo.

REM Start Backend
echo [INFO] Starting Backend (Spring Boot)...
cd /d "%~dp0"

REM Check if target directory exists (built app)
if not exist "target" (
    echo [INFO] Building backend...
    call mvn clean install >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Backend build failed
        pause
        exit /b 1
    )
)

REM Start backend in new window
start "Quiz App Backend" cmd /k "mvn spring-boot:run"
echo [OK] Backend started
echo      Backend URL: http://localhost:8080
echo.

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [INFO] Starting Frontend (Vite)...
cd /d "%~dp0frontend"

REM Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Frontend dependencies installation failed
        pause
        exit /b 1
    )
)

REM Start frontend in new window
start "Quiz App Frontend" cmd /k "npm run dev"
echo [OK] Frontend started
echo      Frontend URL: http://localhost:5173
echo.

echo ========================================
echo [SUCCESS] Quiz App is running!
echo ========================================
echo.
echo Test Credentials:
echo   Admin:     admin@example.com / admin123
echo   Student 1: john@example.com / student123
echo   Student 2: jane@example.com / student123
echo.
echo Backend API: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo [INFO] Two windows will open - Backend and Frontend
echo [INFO] Close the windows to stop the services
echo.
pause

