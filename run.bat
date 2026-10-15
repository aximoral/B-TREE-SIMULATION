@echo off
setlocal
cd /d "%~dp0"
title B-Tree Interactive Visualizer

echo ======================================================
echo    B-Tree Interactive Visualizer - One-Click Launcher
echo ======================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not detected on your system.
    echo.
    echo Please install Node.js (LTS version recommended) from:
    echo https://nodejs.org/
    echo.
    echo After installing Node.js, run this file again!
    echo ======================================================
    pause
    exit /b 1
)

:: 2. Check if dependencies are installed
if not exist "node_modules\" (
    echo [1/2] First run detected. Installing dependencies...
    echo (This only happens once)
    echo.
    call npm.cmd install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Dependency installation failed.
        pause
        exit /b %ERRORLEVEL%
    )
    echo.
    echo Dependencies successfully installed!
    echo.
)

:: 3. Launch the development server and open the browser
echo [2/2] Starting local Vite server...
echo Your web browser will open automatically.
echo.
echo (Press Ctrl + C in this window anytime to stop the server)
echo ======================================================
echo.

call npm.cmd run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Server stopped with an error.
    pause
)
