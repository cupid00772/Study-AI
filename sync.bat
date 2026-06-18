@echo off
chcp 65001 >nul
echo =========================================
echo       正在同步學習資料到 GitHub...
echo =========================================

echo.
echo [1/4] 正在添加變更檔案...
git add .

echo.
echo [2/4] 正在紀錄本地變更...
:: 取得當前時間並當作 commit 訊息
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set mydate=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%
set mytime=%datetime:~8,2%:%datetime:~10,2%
git commit -m "Auto sync: %mydate% %mytime%"

echo.
echo [3/4] 正在從雲端拉取最新進度 (Fetch ^& Merge)...
:: 使用 rebase 方式拉取，如果另一台電腦有改動，會自動整併下來
git pull origin main --rebase

echo.
echo [4/4] 正在推送到 GitHub...
git push origin main

echo.
echo =========================================
echo       雙向同步完成！
echo =========================================
pause
