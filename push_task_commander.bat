@echo off
set "PATH=%PATH%;C:\Windows\System32;C:\Program Files\Git\cmd;C:\Program Files\nodejs"
chcp 65001 >nul

cd /d "%~dp0task-commander"
if not exist "scripts\push.cjs" (
    echo [ERROR] 找不到 task-commander\scripts\push.cjs！
    pause
    exit /b 1
)

node scripts/push.cjs %*

echo.
pause
