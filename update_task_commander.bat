@echo off
set "PATH=%PATH%;C:\Windows\System32;C:\Program Files\nodejs"
chcp 65001 >nul

cd /d "%~dp0task-commander"
if not exist "scripts\deploy.cjs" (
    echo [ERROR] 找不到 task-commander\scripts\deploy.cjs！
    pause
    exit /b 1
)

node scripts/deploy.cjs %*

echo.
pause
