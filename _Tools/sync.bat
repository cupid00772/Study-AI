@echo off
set "PATH=%PATH%;C:\Windows\System32;C:\Program Files\Git\cmd;C:\Program Files\nodejs"
chcp 65001 >nul
cd /d "%~dp0\.."

echo =========================================
echo       正在同步 Study-space 到 GitHub...
echo =========================================

echo.
echo [1/4] 正在添加變更檔案...
git add .

echo.
echo [2/4] 正在紀錄本地變更...
for /f "tokens=*" %%t in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"') do set "now=%%t"
git commit -m "Auto sync: %now%"

echo.
echo [3/4] 正在取得當前分支與雲端進度...
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "branch=%%b"
if "%branch%"=="" set "branch=main"
echo 當前分支: %branch%
git pull origin %branch% --rebase

echo.
echo [4/4] 正在推送到 GitHub...
git push origin %branch%

if "%branch%"=="feature/desktop-app" (
    echo.
    echo 正在同步整併至 main 分支...
    git branch -f main feature/desktop-app
    git push origin main
)

echo.
echo =========================================
echo       雙向同步完成！
echo =========================================
pause
