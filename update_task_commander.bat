@echo off
setlocal
chcp 65001 >nul
set "PATH=%PATH%;C:\Windows\System32;C:\Program Files\nodejs"

cd /d "%~dp0task-commander"
if not exist "scripts\deploy.cjs" (
    echo [ERROR] Cannot find task-commander\scripts\deploy.cjs
    pause
    exit /b 1
)

node scripts/deploy.cjs %*

echo.
pause
