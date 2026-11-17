@echo off
set "PATH=%PATH%;C:\Windows\System32;C:\Program Files\Git\cmd;C:\Program Files\nodejs"
chcp 65001 >nul
cd /d "%~dp0"

node scripts/push.cjs %*

echo.
pause
