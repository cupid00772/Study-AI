const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function run(cmd, options = {}) {
  return execSync(cmd, { stdio: 'inherit', ...options });
}

function getOutput(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf-8', ...options }).trim();
  } catch {
    return '';
  }
}

async function main() {
  console.log('=====================================================');
  console.log('       🚀 Task Commander - GitHub 自動推送腳本       ');
  console.log('=====================================================\n');

  // 1. 定位專案根目錄與 task-commander 目錄
  let repoRoot;
  try {
    repoRoot = getOutput('git rev-parse --show-toplevel');
  } catch {
    console.error('❌ 錯誤：找不到 Git 儲存庫根目錄！請確保在 Git 專案內執行。');
    process.exit(1);
  }

  const taskCommanderDir = path.join(repoRoot, 'task-commander');
  if (!fs.existsSync(taskCommanderDir)) {
    console.error(`❌ 錯誤：找不到 task-commander 目錄 (${taskCommanderDir})`);
    process.exit(1);
  }

  // 2. 檢查目前分支
  const currentBranch = getOutput('git rev-parse --abbrev-ref HEAD');
  console.log(`📌 當前工作分支: ${currentBranch}`);

  // 3. 執行前置編譯檢查 (確保沒有語法或打包錯誤)
  console.log('\n[1/5] 驗證 Task Commander 前端建置 (npm run build)...');
  try {
    run('npm run build', { cwd: taskCommanderDir });
    console.log('✅ 前端建置成功！代碼無語法或打包錯誤。');
  } catch {
    console.error('❌ 前端建置失敗！請先修復編譯錯誤後再進行推送。');
    process.exit(1);
  }

  // 4. 準備暫存檔案 (聚焦於 Task Commander 相關檔案及聯動追蹤檔)
  console.log('\n[2/5] 暫存 Task Commander 變更檔案與推送腳本...');
  run('git add task-commander/ academic_tracker.json .gitignore push_task_commander.bat update_task_commander.bat _Tools/eeclass_crawler.py _Tools/sync.bat', { cwd: repoRoot });

  const stagedFiles = getOutput('git diff --staged --name-only', { cwd: repoRoot });
  
  // 檢查遠端是否有未推送的提交
  let unpushedCommits = 0;
  if (currentBranch) {
    const aheadCount = getOutput(`git rev-list --count origin/${currentBranch}..HEAD`, { cwd: repoRoot });
    unpushedCommits = parseInt(aheadCount || '0', 10);
  }

  if (!stagedFiles && unpushedCommits === 0) {
    console.log('✨ 提示：Task Commander 目前沒有任何新變更或待推送提交，遠端已是最新狀態！');
    process.exit(0);
  }

  // 5. 提交變更 (若有已暫存檔案)
  if (stagedFiles) {
    console.log('\n[3/5] 建立 Commit 提交紀錄...');
    
    // 取得使用者傳入之 commit message，或採用標準時間戳
    const customMsg = process.argv.slice(2).join(' ').trim();
    let commitMsg = customMsg;
    if (!commitMsg) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
      commitMsg = `feat(task-commander): update desktop app [${timestamp}]`;
    }

    try {
      // 使用跳脫引號避免特殊字元
      run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { cwd: repoRoot });
      console.log(`✅ 已完成 Commit: "${commitMsg}"`);
    } catch (err) {
      console.error('❌ Commit 失敗：', err.message);
      process.exit(1);
    }
  } else {
    console.log('\n[3/5] 無新檔案變更，將推送本地先前尚未推送的 Commit...');
  }

  // 6. 從遠端拉取並整併 (Pull with Rebase & Autostash)
  console.log(`\n[4/5] 正在從 GitHub 拉取最新進度 (git pull origin ${currentBranch} --rebase --autostash)...`);
  try {
    run(`git pull origin ${currentBranch} --rebase --autostash`, { cwd: repoRoot });
    console.log('✅ 遠端進度整併完成。');
  } catch {
    console.error(`❌ 拉取或 Rebase 失敗，可能存在衝突。請手動解決後再推送。`);
    process.exit(1);
  }

  // 7. 推送至當前分支
  console.log(`\n正在推送至 GitHub (origin/${currentBranch})...`);
  try {
    run(`git push origin ${currentBranch}`, { cwd: repoRoot });
    console.log(`✅ 已成功推送到 origin/${currentBranch}！`);
  } catch (err) {
    console.error(`❌ 推送至 origin/${currentBranch} 失敗：`, err.message);
    process.exit(1);
  }

  // 8. 若在 feature/desktop-app 分支，自動將最新進度整併至 main 分支
  if (currentBranch === 'feature/desktop-app') {
    console.log('\n[5/5] 自動整併並同步至 main 分支...');
    try {
      // 快轉更新本地 main 分支指標
      run('git branch -f main feature/desktop-app', { cwd: repoRoot });
      // 推送更新至遠端 origin/main
      run('git push origin main', { cwd: repoRoot });
      console.log('✅ main 分支已成功同步推送到 GitHub！');
    } catch (err) {
      console.warn('⚠️ main 分支同步推送未完成 (可能遠端 main 有獨立提交需手動整併)：', err.message);
    }
  } else {
    console.log('\n[5/5] 已完成推送，無需跨分支同步。');
  }

  console.log('\n=====================================================');
  console.log('       🎉 Task Commander 全部進度已同步至 GitHub！    ');
  console.log('=====================================================\n');

  // 9. 若本機已配置 Supabase .env.local，自動觸發增量教材上雲（不影響 Git 推送結果）
  const envLocalPath = path.join(taskCommanderDir, '.env.local');
  const skipCloud = process.argv.includes('--skip-cloud');
  if (!skipCloud && fs.existsSync(envLocalPath)) {
    console.log('☁️  偵測到本機 Supabase 設定，正在執行增量教材與資料上雲...');
    try {
      run('node scripts/sync-cloud-assets.cjs --with-tracker', { cwd: taskCommanderDir });
    } catch (err) {
      console.warn('⚠️ 雲端資產同步未完成（GitHub 已推送成功，可稍後手動執行 npm run sync:assets）：', err.message);
    }
  }
}

main().catch((err) => {
  console.error('執行過程發生未預期錯誤：', err);
  process.exit(1);
});
