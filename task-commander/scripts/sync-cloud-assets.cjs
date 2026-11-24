/**
 * Task Commander 2.0 — Incremental Cloud Asset Uploader
 *
 * 將 Study_Materials、Test_Bank（自動排除 OCR *.traineddata 模型）、
 * Review_Dashboard 及 deliverables 內登錄的輕量 .md 報告/解答增量同步至 Supabase Storage。
 * 自動排除 Reference/ 大型原始檔（548 MB），維持總量 ~26 MB 落在免費 1 GB 額度內。
 *
 * 用法：
 *   node scripts/sync-cloud-assets.cjs --dry-run
 *   node scripts/sync-cloud-assets.cjs
 *   node scripts/sync-cloud-assets.cjs --file Study_Materials/資料結構/Trees_教材.md
 *   node scripts/sync-cloud-assets.cjs --with-tracker
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectDir = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectDir, '..');

const ASSET_BUCKET = 'study-assets';
const MAX_GENERAL_FILE_BYTES = 15 * 1024 * 1024; // 15 MB per file
const MAX_REFERENCE_DELIVERABLE_BYTES = 5 * 1024 * 1024; // 5 MB for Reference deliverables

const ALLOWED_EXTENSIONS = new Set([
  'md', 'html', 'htm', 'pdf', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'txt', 'json',
]);

const IGNORED_DIRS = new Set([
  'node_modules', '.git', '.venv', '.venv_312', '__pycache__', 'tessdata', 'dist', 'release',
]);

const IGNORED_EXTENSIONS = new Set([
  'traineddata', 'zip', 'rar', '7z', 'tar', 'gz', 'exe', 'dll', 'pyc', 'o', 'out', 'obj', 'lnk', 'log',
]);

const CONTENT_TYPES = {
  md: 'text/markdown; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  html: 'text/html; charset=utf-8',
  htm: 'text/html; charset=utf-8',
  json: 'application/json; charset=utf-8',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
};

function parseArgs(argv) {
  const args = {
    dryRun: argv.includes('--dry-run'),
    force: argv.includes('--force'),
    withTracker: argv.includes('--with-tracker'),
    singleFile: null,
  };
  const fileIdx = argv.indexOf('--file');
  if (fileIdx >= 0 && argv[fileIdx + 1]) {
    args.singleFile = normalizePath(argv[fileIdx + 1]);
  }
  return args;
}

function normalizePath(p) {
  return String(p || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/{2,}/g, '/');
}

function loadEnvFiles() {
  const envMap = {};
  const candidates = [
    path.join(workspaceRoot, '.env'),
    path.join(workspaceRoot, '.env.local'),
    path.join(projectDir, '.env'),
    path.join(projectDir, '.env.local'),
  ];
  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, 'utf-8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const k = trimmed.slice(0, eq).trim();
      let v = trimmed.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      envMap[k] = v;
    }
  }
  return { ...envMap, ...process.env };
}

function sha256Buffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function computeStorageKey(normPath) {
  const ext = path.extname(normPath).replace('.', '').toLowerCase() || 'bin';
  const hash = crypto.createHash('sha256').update(normPath).digest('hex').slice(0, 24);
  return `files/${hash}.${ext}`;
}

function collectEligibleFiles(singleFile = null) {
  const collected = new Map();

  const tryAddFile = (relPath, maxBytes = MAX_GENERAL_FILE_BYTES) => {
    const norm = normalizePath(relPath);
    if (!norm || collected.has(norm)) return;
    const fullPath = path.join(workspaceRoot, norm);
    if (!fs.existsSync(fullPath)) return;
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) return;
    const base = path.basename(fullPath);
    if (base.startsWith('.') || base.startsWith('~$')) return;
    const ext = path.extname(base).replace('.', '').toLowerCase();
    if (IGNORED_EXTENSIONS.has(ext) || !ALLOWED_EXTENSIONS.has(ext)) return;
    if (stat.size > maxBytes) return;

    collected.set(norm, {
      relativePath: norm,
      fullPath,
      ext,
      size: stat.size,
      contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
    });
  };

  if (singleFile) {
    const isRef = singleFile.startsWith('Reference/');
    tryAddFile(singleFile, isRef ? MAX_REFERENCE_DELIVERABLE_BYTES : MAX_GENERAL_FILE_BYTES);
    return Array.from(collected.values());
  }

  const walk = (subDir) => {
    const fullDir = path.join(workspaceRoot, subDir);
    if (!fs.existsSync(fullDir)) return;
    const entries = fs.readdirSync(fullDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name.startsWith('~$')) continue;
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        walk(path.join(subDir, entry.name));
      } else {
        tryAddFile(path.join(subDir, entry.name), MAX_GENERAL_FILE_BYTES);
      }
    }
  };

  // 1. 掃描 Study_Materials、Test_Bank、Review_Dashboard（排除 Reference 大檔）
  for (const dir of ['Study_Materials', 'Test_Bank', 'Review_Dashboard']) {
    walk(dir);
  }

  // 2. 額外納入 academic_tracker.json -> deliverables 中登錄的輕量檔案（如 Reference 內的 .md 報告與解答）
  const trackerPath = path.join(workspaceRoot, 'academic_tracker.json');
  if (fs.existsSync(trackerPath)) {
    try {
      const tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf-8'));
      for (const del of tracker.deliverables || []) {
        if (!del?.path) continue;
        const norm = normalizePath(del.path);
        const maxBytes = norm.startsWith('Reference/') ? MAX_REFERENCE_DELIVERABLE_BYTES : MAX_GENERAL_FILE_BYTES;
        tryAddFile(norm, maxBytes);
      }
    } catch (err) {
      console.warn('⚠️ 無法解析 academic_tracker.json：', err.message);
    }
  }

  return Array.from(collected.values()).sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function summarizeFiles(files) {
  const byRoot = {};
  let totalBytes = 0;
  for (const f of files) {
    const root = f.relativePath.split('/')[0] || 'Other';
    if (!byRoot[root]) byRoot[root] = { count: 0, bytes: 0 };
    byRoot[root].count += 1;
    byRoot[root].bytes += f.size;
    totalBytes += f.size;
  }
  return { byRoot, totalBytes };
}

async function createAuthedSupabaseClient(env) {
  const { createClient } = await import('@supabase/supabase-js');
  const url = (env.VITE_SUPABASE_URL || env.SUPABASE_URL || '').trim();
  const serviceRoleKey = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const anonKey = (env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '').trim();

  if (!url) {
    throw new Error('缺少 VITE_SUPABASE_URL（請於 task-commander/.env.local 設定）');
  }

  if (serviceRoleKey) {
    return createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  if (!anonKey) {
    throw new Error('缺少 VITE_SUPABASE_ANON_KEY 或 SUPABASE_SERVICE_ROLE_KEY');
  }

  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rawOwnerEmail = (env.SUPABASE_OWNER_EMAIL || '').trim();
  const email = (rawOwnerEmail && rawOwnerEmail !== 'you@example.com'
    ? rawOwnerEmail
    : (env.VITE_OWNER_EMAIL || '').trim());
  const password = (env.SUPABASE_OWNER_PASSWORD || '').trim();
  if (email && password) {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(`Supabase 帳號登入失敗：${error.message}`);
    }
  } else {
    console.warn('⚠️ 未提供 SUPABASE_SERVICE_ROLE_KEY 或 SUPABASE_OWNER_PASSWORD，將嘗試以匿名身分寫入（僅在開放 RLS 時有效）。');
  }

  return client;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = collectEligibleFiles(args.singleFile);
  const { byRoot, totalBytes } = summarizeFiles(files);

  console.log('=====================================================');
  console.log('  ☁️  Task Commander - 雲端學習資產增量同步工具');
  console.log('=====================================================');
  console.log(`📂 工作區根目錄：${workspaceRoot}`);
  console.log(`📦 掃描結果：共 ${files.length} 份檔案，總計 ${(totalBytes / 1024 / 1024).toFixed(2)} MB（已自動排除 Reference 大檔與 OCR 模型）`);
  for (const [root, info] of Object.entries(byRoot)) {
    console.log(`   • ${root}: ${info.count} 檔 (${(info.bytes / 1024 / 1024).toFixed(2)} MB)`);
  }

  if (args.dryRun) {
    console.log('\n🔍 [DRY-RUN 模式] 僅預覽掃描結果，未實際上傳任何檔案。');
    process.exit(0);
  }

  const env = loadEnvFiles();
  const supabase = await createAuthedSupabaseClient(env);

  // 1. 讀取遠端既有 asset_manifest
  let remoteManifest = { files: {}, updatedAt: null };
  const { data: row, error: fetchErr } = await supabase
    .from('tc_sync_docs')
    .select('payload')
    .eq('key', 'asset_manifest')
    .maybeSingle();

  if (fetchErr) {
    throw new Error(`無法讀取遠端 asset_manifest：${fetchErr.message}`);
  }
  if (row?.payload && typeof row.payload.files === 'object') {
    remoteManifest = row.payload;
  }

  const nextFilesMap = { ...(remoteManifest.files || {}) };
  let uploadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  // 2. 逐檔比對 SHA-256 並增量上傳
  for (const f of files) {
    const buf = fs.readFileSync(f.fullPath);
    const sha256 = sha256Buffer(buf);
    const storageKey = computeStorageKey(f.relativePath);
    const existing = nextFilesMap[f.relativePath];

    if (!args.force && existing && existing.sha256 === sha256 && existing.storageKey === storageKey) {
      skippedCount += 1;
      continue;
    }

    const { error: upErr } = await supabase.storage
      .from(ASSET_BUCKET)
      .upload(storageKey, buf, {
        contentType: f.contentType,
        upsert: true,
        cacheControl: '3600',
      });

    if (upErr) {
      failedCount += 1;
      console.error(`  ❌ 上傳失敗：${f.relativePath} -> ${upErr.message}`);
      continue;
    }

    nextFilesMap[f.relativePath] = {
      storageKey,
      contentType: f.contentType,
      size: f.size,
      sha256,
      updatedAt: new Date().toISOString(),
    };
    uploadedCount += 1;
    console.log(`  ✅ 已上傳：${f.relativePath} (${(f.size / 1024).toFixed(1)} KB)`);
  }

  // 3. 寫回更新後的 asset_manifest
  if (uploadedCount > 0 || !row) {
    const nextManifest = {
      files: nextFilesMap,
      updatedAt: new Date().toISOString(),
    };
    const { error: manifestErr } = await supabase
      .from('tc_sync_docs')
      .upsert(
        {
          key: 'asset_manifest',
          payload: nextManifest,
          updated_by: 'cli-asset-sync',
        },
        { onConflict: 'key' }
      );
    if (manifestErr) {
      throw new Error(`更新 asset_manifest 失敗：${manifestErr.message}`);
    }
  }

  // 4. 若指定 --with-tracker，一併將 academic_tracker.json 五個資料域推上雲端
  if (args.withTracker) {
    const trackerPath = path.join(workspaceRoot, 'academic_tracker.json');
    if (fs.existsSync(trackerPath)) {
      const tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf-8'));
      const now = new Date().toISOString();
      const buckets = [
        {
          key: 'tracker_courses',
          payload: {
            academic_year: tracker.academic_year || '115',
            courses: tracker.courses || [],
            calendar_events: tracker.calendar_events || [],
            updatedAt: tracker.last_updated || now,
          },
        },
        {
          key: 'tracker_assignments',
          payload: {
            assignments: tracker.assignments || [],
            ignored_assignment_ids: tracker.ignored_assignment_ids || [],
            ignored_assignment_keys: tracker.ignored_assignment_keys || [],
            updatedAt: now,
          },
        },
        {
          key: 'tracker_exams',
          payload: {
            exams: tracker.exams || [],
            deletedIds: tracker._deleted_exam_ids || [],
            updatedAt: now,
          },
        },
        {
          key: 'tracker_deliverables',
          payload: {
            deliverables: tracker.deliverables || [],
            deletedIds: tracker._deleted_deliverable_ids || [],
            updatedAt: now,
          },
        },
        {
          key: 'tracker_eeclass',
          payload: {
            last_updated: tracker.last_updated || now,
            announcements: tracker.announcements || [],
            eeclass_dashboard: tracker.eeclass_dashboard || { recent_events: [], latest_announcements: [] },
          },
        },
      ];
      for (const b of buckets) {
        const { error: bErr } = await supabase
          .from('tc_sync_docs')
          .upsert({ key: b.key, payload: b.payload, updated_by: 'cli-asset-sync' }, { onConflict: 'key' });
        if (bErr) {
          console.error(`  ❌ 同步 ${b.key} 失敗：${bErr.message}`);
        }
      }
      console.log('  ✅ 已同步 academic_tracker.json 五大資料域至雲端');
    }
  }

  console.log(`\n🎉 同步完成！新上傳 ${uploadedCount} 檔 · 無變更略過 ${skippedCount} 檔 · 失敗 ${failedCount} 檔`);
  if (failedCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error('❌ 雲端資產同步失敗：', err.message || err);
  process.exit(1);
});

