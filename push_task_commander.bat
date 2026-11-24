@echo off
setlocal
chcp 65001 >nul
set "PATH=%PATH%;C:\Windows\System32;C:\Program Files\Git\cmd;C:\Program Files\nodejs"

cd /d "%~dp0task-commander"
if not exist "scripts\push.cjs" (
    echo [ERROR] Cannot find task-commander\scripts\push.cjs
    pause
    exit /b 1
)

node scripts/push.cjs %*

echo.
pause
