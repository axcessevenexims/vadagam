@echo off
title AXCES SEVEN EXIMS - Website & Admin Launcher
echo ======================================================
echo    AXCES SEVEN EXIMS - Starting Website & Admin Panel
echo ======================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching Local Backend Server on Port 8000...
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start /b py server.py
    goto open_browser
)

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start /b node server.js
    goto open_browser
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start /b python server.py
    goto open_browser
)

echo [Info] Python/Node not detected in PATH, opening static files directly...
start "" "%~dp0index.html"
start "" "%~dp0admin\products.html"
goto end

:open_browser
timeout /t 2 /nobreak >nul
echo [2/2] Opening Website and Admin Panel in your Browser...
start "" "http://localhost:8000/food-products.html"
start "" "http://localhost:8000/admin/products.html"

echo.
echo ======================================================
echo  Server is active at: http://localhost:8000/
echo  Close this window to stop the server.
echo ======================================================
echo.

:end
pause
