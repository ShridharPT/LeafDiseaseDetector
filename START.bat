@echo off
REM Leaf Disease Detection - Quick Start Script
REM This script helps you start the application

echo.
echo ========================================
echo   LEAF DISEASE DETECTION - QUICK START
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Python version:
python --version
echo.
echo Node.js version:
node --version
echo.

REM Ask user what to do
echo What would you like to do?
echo.
echo 1. Install Python dependencies
echo 2. Train the ML model
echo 3. Start Flask API (port 5000)
echo 4. Start React Frontend (port 8080)
echo 5. View setup guide
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Installing Python dependencies...
    pip install -r requirements.txt
    echo.
    echo Done! Dependencies installed.
    pause
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Starting ML model training...
    echo This may take 30-60 minutes depending on your GPU
    echo.
    python train_model.py
    echo.
    pause
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Starting Flask API server on http://localhost:5000
    echo Press Ctrl+C to stop the server
    echo.
    python app.py
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Starting React Frontend on http://localhost:8080
    echo Press Ctrl+C to stop the server
    echo.
    cd smart-leaf-advisor-main
    npm run dev
    cd ..
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Opening setup guide...
    start notepad SETUP_GUIDE.md
    goto end
)

if "%choice%"=="6" (
    echo Exiting...
    goto end
)

echo Invalid choice!
pause

:end
echo.
echo For more information, read SETUP_GUIDE.md
echo.
