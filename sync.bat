@echo off
set "PATH=%PATH%;C:\Windows\System32;C:\Windows\System32\wbem;C:\Program Files\Git\cmd"
chcp 65001 >nul
echo =========================================
echo       正在同步學習資料到 GitHub...
echo =========================================

echo.
echo [1/3] 正在添加變更檔案...
git add .

echo.
echo [2/3] 正在紀錄本次變更...
:: 取得當前時間並當作 commit 訊息
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set mydate=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%
set mytime=%datetime:~8,2%:%datetime:~10,2%
git commit -m "Auto sync: %mydate% %mytime%"

echo.
echo [3/3] 正在推送到 GitHub...
git push origin main

echo.
echo =========================================
echo       同步完成！
echo =========================================
pause
