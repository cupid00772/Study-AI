const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectDir = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectDir, '..');
const unpackedDir = path.join(projectDir, 'release', 'win-unpacked');

const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Local');
const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
const installDir = path.join(localAppData, 'TaskCommander');
const targetExe = path.join(installDir, 'Task Commander.exe');

const skipBuild = process.argv.includes('--skip-build');
const noLaunch = process.argv.includes('--no-launch');

function run(cmd, options = {}) {
  return execSync(cmd, { stdio: 'inherit', ...options });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stopRunningInstances() {
  for (const exeName of ['Task Commander.exe', 'TaskCommander.exe']) {
    try {
      execSync(`taskkill /IM "${exeName}" /F`, { stdio: 'ignore' });
      console.log(`🛑 已關閉執行中的 ${exeName}`);
    } catch {
      // 未執行中則略過
    }
  }
}

function createShortcuts() {
  const psScript = `
$ErrorActionPreference = 'Stop'
$shell = New-Object -ComObject WScript.Shell
$desktopDir = [Environment]::GetFolderPath('Desktop')
$programsDir = [Environment]::GetFolderPath('Programs')
$startupDir = [Environment]::GetFolderPath('Startup')

function Ensure-Shortcut($lnkPath, $target, $cliArgs, $workDir, $desc) {
  $dir = Split-Path -Parent $lnkPath
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $sc = $shell.CreateShortcut($lnkPath)
  $sc.TargetPath = $target
  $sc.Arguments = [string]$cliArgs
  $sc.WorkingDirectory = $workDir
  $sc.IconLocation = "$target,0"
  $sc.Description = $desc
  $sc.Save()
  Write-Output "  ✅ $lnkPath"
}

$exe = '${targetExe.replace(/'/g, "''")}'
$work = '${installDir.replace(/'/g, "''")}'

Ensure-Shortcut (Join-Path $desktopDir "Task Commander.lnk") $exe "" $work "Task Commander 學業任務指揮中心"
Ensure-Shortcut (Join-Path $programsDir "Task Commander.lnk") $exe "" $work "Task Commander 學業任務指揮中心"
Ensure-Shortcut (Join-Path $startupDir "Task Commander.lnk") $exe "--hidden" $work "Task Commander 開機靜默常駐"

# 清理舊版指向 release\\TaskCommander.exe 的過時開機捷徑，避免重複啟動
Get-ChildItem $startupDir -Filter "*.lnk" -ErrorAction SilentlyContinue | ForEach-Object {
  if ($_.Name -ne "Task Commander.lnk") {
    $oldSc = $shell.CreateShortcut($_.FullName)
    if ($_.Name -like "TaskCommander.exe*" -or $oldSc.TargetPath -like "*TaskCommander.exe") {
      Remove-Item $_.FullName -Force
      Write-Output "  🧹 已移除舊版開機捷徑: $($_.FullName)"
    }
  }
}
`;

  execSync('powershell -NoProfile -ExecutionPolicy Bypass -Command -', {
    input: psScript,
    stdio: ['pipe', 'inherit', 'inherit'],
  });
}

function writeWorkspacePointer() {
  const payload = JSON.stringify({ workspaceRoot }, null, 2);
  for (const pointerPath of [
    path.join(installDir, 'workspace.json'),
    path.join(appData, 'task-commander', 'workspace.json'),
  ]) {
    const dir = path.dirname(pointerPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pointerPath, payload, 'utf-8');
  }
  console.log(`🔗 已綁定 Study-space 工作區路徑：${workspaceRoot}`);
}

async function main() {
  console.log('=====================================================');
  console.log('   ⚡ Task Commander 一鍵快速建置與固定目錄部署');
  console.log('=====================================================\n');

  if (!skipBuild) {
    console.log('[1/4] 建置前端與 Electron 免解壓封裝 (dir)...');
    run('npm run electron:build', { cwd: projectDir });
  } else {
    console.log('[1/4] 略過建置，直接使用既有 release/win-unpacked...');
  }

  if (!fs.existsSync(path.join(unpackedDir, 'Task Commander.exe'))) {
    throw new Error(`找不到建置輸出：${path.join(unpackedDir, 'Task Commander.exe')}`);
  }

  console.log('\n[2/4] 關閉舊版程式並覆蓋部署至固定路徑...');
  stopRunningInstances();
  await sleep(900);

  if (!fs.existsSync(installDir)) {
    fs.mkdirSync(installDir, { recursive: true });
  }

  // 使用 robocopy 鏡像同步（速度極快且完整更新資源與 asar）
  try {
    execSync(`robocopy "${unpackedDir}" "${installDir}" /MIR /NFL /NDL /NJH /NJS /NC /NS`, { stdio: 'ignore' });
  } catch (err) {
    // robocopy exit codes 0-7 皆代表成功
    if (typeof err.status === 'number' && err.status >= 8) {
      throw err;
    }
  }
  console.log(`✅ 已同步部署至：${installDir}`);

  writeWorkspacePointer();

  console.log('\n[3/4] 自動建立／更新桌面、開始選單與開機啟動捷徑...');
  createShortcuts();

  console.log('\n[4/4] 完成部署！');
  if (!noLaunch) {
    console.log('🚀 正在背景啟動新版 Task Commander...');
    const launchEnv = { ...process.env };
    delete launchEnv.ELECTRON_RUN_AS_NODE;
    const child = spawn(targetExe, [], {
      cwd: installDir,
      env: launchEnv,
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
  }

  console.log('\n=====================================================');
  console.log(`🎉 部署完成！固定執行檔：${targetExe}`);
  console.log('💡 工作列釘選與所有捷徑皆指向此固定路徑，日後執行本腳本永免重設捷徑。');
  console.log('=====================================================\n');
}

main().catch((err) => {
  console.error('❌ 部署失敗：', err.message || err);
  process.exit(1);
});
