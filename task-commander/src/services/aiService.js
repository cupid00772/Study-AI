// ============================================================================
// Task Commander — Dual-Engine AI Generation Service
// Supports:
//   1. Local Antigravity CLI (`agy`) on Electron Desktop (Gemini 4 Neon/Carbon/Claude 5.5)
//   2. Direct Google Gemini API (Desktop & Web/Mobile)
//   3. OpenAI-Compatible Endpoints & Local Ollama (Desktop & Web/Mobile)
// ============================================================================

const AI_CONFIG_STORAGE_KEY = 'tc_ai_config_v1';

export const SPLIT_SOLUTION_DELIMITER = '===SPLIT_SOLUTION_FILE===';

export const GEMINI_API_MODEL_PRESETS = [
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro（深度推理／高品質出題）' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash（高速度／性價比佳）' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash（極速輕量）' },
];

export const OPENAI_ENDPOINT_PRESETS = [
  { label: 'OpenAI 官方', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1' },
  { label: '本機 Ollama', baseUrl: 'http://localhost:11434/v1', model: 'qwen2.5:14b' },
  { label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'google/gemini-2.5-pro' },
];

export function getDefaultAiConfig() {
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);
  return {
    engine: isElectron ? 'agy' : 'gemini', // 'agy' | 'gemini' | 'openai'
    agyModel: 'gemini-4-neon-high',
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-pro',
    openaiBaseUrl: 'https://api.openai.com/v1',
    openaiApiKey: '',
    openaiModel: 'gpt-4.1',
  };
}

export function loadAiConfig() {
  const defaults = getDefaultAiConfig();
  try {
    const raw = localStorage.getItem(AI_CONFIG_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    const merged = { ...defaults, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
    const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);
    if (!isElectron && merged.engine === 'agy') {
      merged.engine = 'gemini';
    }
    return merged;
  } catch {
    return defaults;
  }
}

export function saveAiConfig(nextConfig) {
  const merged = { ...getDefaultAiConfig(), ...(nextConfig || {}) };
  try {
    localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(merged));
  } catch {}
  return merged;
}

export function buildReferenceContextBlock(referenceFiles = [], maxTotalChars = 36000) {
  if (!Array.isArray(referenceFiles) || referenceFiles.length === 0) return '';
  const perFileBudget = Math.max(4000, Math.floor(maxTotalChars / referenceFiles.length));
  const sections = [];
  let used = 0;

  for (const ref of referenceFiles) {
    if (!ref?.content || used >= maxTotalChars) continue;
    const remaining = maxTotalChars - used;
    const limit = Math.min(perFileBudget, remaining);
    const trimmed = ref.content.length > limit
      ? `${ref.content.slice(0, limit)}\n...(節錄至前 ${limit} 字元)...`
      : ref.content;
    sections.push(`### 參考資料：${ref.title || ref.path}\n路徑：${ref.path || ''}\n\n${trimmed}`);
    used += trimmed.length;
  }

  if (sections.length === 0) return '';
  return `\n\n===== 以下為使用者勾選的本科目參考教材內容 =====\n\n${sections.join('\n\n---\n\n')}\n\n===== 參考教材結束 =====\n`;
}

export function buildAiPrompt({
  mode = 'exam',
  subject = '未分類科目',
  topic = '',
  examOptions = {},
  notesOptions = {},
  customFormat = 'md',
  referenceFiles = [],
  extraInstructions = '',
  isAgyCli = false,
}) {
  const refBlock = buildReferenceContextBlock(referenceFiles);
  const extraBlock = extraInstructions?.trim()
    ? `\n\n【使用者補充要求 / 考綱範圍】\n${extraInstructions.trim()}\n`
    : '';

  const agyGuard = isAgyCli
    ? '【重要執行指令】你現在處於純文字文件生成模式：嚴禁呼叫任何工具（不要寫檔、不要讀取額外檔案、不要執行終端指令、不要搜尋網路），不要輸出前言寒暄或結尾問候，請直接輸出完整文件內容本體。\n\n'
    : '';

  const systemPrompt = `${agyGuard}你是專精大學理工與商管學科（特別熟悉中央大學資管系、台聯大／台大轉學考命題風格）的頂尖 AI 教授與命題專家。請一律使用繁體中文（台灣大學常用學術名詞，專有名詞附英文對照），數學公式務必使用標準 LaTeX 語法（行內用 $...$，獨立公式塊用 $$...$$）。`;

  let userPrompt = '';

  if (mode === 'exam') {
    const qTypes = Array.isArray(examOptions.questionTypes) && examOptions.questionTypes.length > 0
      ? examOptions.questionTypes.join('、')
      : '單選題、計算／簡答題';
    const count = Number(examOptions.questionCount) || 10;
    const difficulty = examOptions.difficulty || '學校期中期末';
    const splitFiles = examOptions.outputLayout === 'split';

    if (splitFiles) {
      userPrompt = `請為科目「${subject}」命製一份高品質模擬試卷與完整獨立詳解。
- 主題／章節範圍：${topic || `${subject} 綜合演練`}
- 總題數：約 ${count} 題
- 題型配置：${qTypes}
- 難度等級：${difficulty}

【輸出格式規定 — 務必嚴格遵守】
請先完整輸出「第一份：空白考卷（僅含題目、選項、配分與作答提示，**不可**附上答案）」，接著在獨立一行輸出精確分隔線：
${SPLIT_SOLUTION_DELIMITER}
分隔線之後再完整輸出「第二份：逐題詳解卷（含正確答案、核心考點、完整推導步驟、以及常見錯誤陷阱解析）」。
兩份皆使用乾淨的 Markdown + KaTeX 公式排版。${extraBlock}${refBlock}`;
    } else {
      userPrompt = `請為科目「${subject}」命製一份高品質模擬試卷（單檔折疊詳解版）。
- 主題／章節範圍：${topic || `${subject} 綜合演練`}
- 總題數：約 ${count} 題
- 題型配置：${qTypes}
- 難度等級：${difficulty}

【輸出格式規定】
1. 使用清晰的 Markdown 排版，標明總分、建議作答時間與各題配分。
2. 每一題下方使用 HTML 折疊標籤包裹完整解答，格式如下：
<details>
<summary>點擊展開本題答案與詳解</summary>

- **正確答案**：...
- **核心考點**：...
- **詳細解析**：...
- **常見陷阱**：...

</details>
3. 數學公式與演算法虛擬碼務必正確清晰。${extraBlock}${refBlock}`;
    }
  } else if (mode === 'notes') {
    const features = [];
    if (notesOptions.includeMermaid !== false) {
      features.push('開頭繪製一張清晰的 Mermaid 知識架構樹（使用 ```mermaid 與 flowchart TD，所有節點文字務必用雙引號包住例如 A["節點文字"] 以免語法錯誤）');
    }
    if (notesOptions.includeFormulas !== false) {
      features.push('完整整理重要定理、定義與 LaTeX 公式推導（$...$ / $$...$$）');
    }
    if (notesOptions.includeTables !== false) {
      features.push('製作常考觀念對照表與容易混淆的考場陷阱提醒');
    }
    if (notesOptions.includePractice !== false) {
      features.push('文末附 3~5 題精選隨堂檢核題（含 <details> 折疊解答）');
    }

    userPrompt = `請為科目「${subject}」撰寫一份系統化、高分導向的精選複習教材（Markdown）。
- 主題／章節範圍：${topic || `${subject} 核心重點整理`}
- 必須包含以下結構要素：
${features.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

請直接輸出結構完整、可直接用於考前複習的 Markdown 文件本體。${extraBlock}${refBlock}`;
  } else if (mode === 'recitation') {
    const cardCount = Number(examOptions.questionCount) || 15;
    userPrompt = `請為科目「${subject}」製作一個**單一獨立 HTML 檔案**的「互動式速記背誦卡網頁」。
- 主題／章節範圍：${topic || `${subject} 必考核心背誦卡`}
- 卡片數量：請製作約 ${cardCount} 張高含金量記憶卡（涵蓋關鍵定義、公式、演算法複雜度、比較題、常考陷阱）。

【嚴格技術要求】
1. 直接輸出完整有效的 HTML5（以 \`<!DOCTYPE html>\` 開頭，\`</html>\` 結尾），**不要**包裹在 markdown 程式碼區塊內，不要附帶多餘解說文字。
2. 所有 CSS 與 Vanilla JavaScript 內嵌於同一檔案，不可依賴外部 CDN（可於離線環境直接開啟）。
3. 現代精緻介面：支援深色／淺色風格切換、流暢 3D 翻卡動畫、點擊或按空白鍵翻面、左右方向鍵切題、分類篩選、「已熟記 / 需再複習」標記按鈕、頂部進度條與隨機洗牌功能。
4. 卡片正面為精準考點提問，背面為條理分明的重點答案與記憶口訣。${extraBlock}${refBlock}`;
  } else {
    userPrompt = `科目：「${subject}」
主題：「${topic || '自訂學習成果'}」
期望輸出格式：${customFormat === 'html' ? '單一獨立完整 HTML5 互動網頁（直接輸出 <!DOCTYPE html>...</html>，不含多餘解說）' : '結構化 Markdown 文件（支援 KaTeX 數學公式與 Mermaid 圖表）'}

請依據以下使用者指令與參考資料，直接產出完整高品質的成果內容：${extraBlock || '\n（請產出該主題的精要整理與範例解析）'}${refBlock}`;
  }

  return { systemPrompt, userPrompt };
}

export function cleanGeneratedHtmlOutput(raw) {
  let text = String(raw || '').trim();
  const fenced = text.match(/```(?:html|htm)?\s*\r?\n([\s\S]*?)\r?\n```/i);
  if (fenced && fenced[1]) {
    text = fenced[1].trim();
  }
  return text;
}

export function splitExamAndSolution(raw) {
  const text = String(raw || '').trim();
  const idx = text.indexOf(SPLIT_SOLUTION_DELIMITER);
  if (idx < 0) {
    return { isSplit: false, examText: text, solutionText: '' };
  }
  const examText = text.slice(0, idx).trim();
  const solutionText = text.slice(idx + SPLIT_SOLUTION_DELIMITER.length).trim();
  return {
    isSplit: Boolean(examText && solutionText),
    examText: examText || text,
    solutionText,
  };
}

async function streamGeminiApi({ config, systemPrompt, userPrompt, onDelta, onStatus, signal }) {
  const apiKey = String(config.geminiApiKey || '').trim();
  const model = String(config.geminiModel || 'gemini-2.5-pro').trim();
  if (!apiKey) {
    throw new Error('尚未填入 Gemini API Key，請前往「設定 → AI 引擎」填入後再試。');
  }

  onStatus?.(`正在連線 Google Gemini API (${model})...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 32768,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini API 錯誤 (HTTP ${res.status})：${errText.slice(0, 260) || res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('瀏覽器不支援串流回應讀取');

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';
  let usage = null;

  onStatus?.(`Gemini (${model}) 生成中...`);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const jsonStr = trimmed.slice(5).trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const parts = parsed?.candidates?.[0]?.content?.parts || [];
        for (const p of parts) {
          if (typeof p.text === 'string' && p.text) {
            fullText += p.text;
            onDelta?.(p.text, fullText);
          }
        }
        if (parsed?.usageMetadata) {
          usage = {
            input_tokens: parsed.usageMetadata.promptTokenCount || 0,
            output_tokens: parsed.usageMetadata.candidatesTokenCount || 0,
            total_tokens: parsed.usageMetadata.totalTokenCount || 0,
          };
        }
      } catch {
        // Ignore partial SSE chunk
      }
    }
  }

  return { text: fullText, usage, model };
}

async function streamOpenAiCompatible({ config, systemPrompt, userPrompt, onDelta, onStatus, signal }) {
  const baseUrl = String(config.openaiBaseUrl || 'https://api.openai.com/v1').trim().replace(/\/+$/, '');
  const apiKey = String(config.openaiApiKey || '').trim();
  const model = String(config.openaiModel || 'gpt-4.1').trim();
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(baseUrl);

  if (!apiKey && !isLocal) {
    throw new Error('尚未填入 API Key（若使用本機 Ollama，請將端點設為 http://localhost:11434/v1）。');
  }

  onStatus?.(`正在連線 ${baseUrl} (${model})...`);
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.6,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API 端點錯誤 (HTTP ${res.status})：${errText.slice(0, 260) || res.statusText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('瀏覽器不支援串流回應讀取');

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  onStatus?.(`${model} 生成中...`);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const jsonStr = trimmed.slice(5).trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta) {
          fullText += delta;
          onDelta?.(delta, fullText);
        }
      } catch {
        // Ignore partial chunk
      }
    }
  }

  return { text: fullText, usage: null, model };
}

async function streamAgyCli({ config, systemPrompt, userPrompt, onDelta, onStatus, signal }) {
  if (!window.electronAPI?.startAgyGenerate || !window.electronAPI?.onAgyStreamEvent) {
    throw new Error('本機 Antigravity CLI 僅限 Windows 桌面端使用，網頁端請切換至 Gemini API 或 OpenAI 相容端點。');
  }

  const model = String(config.agyModel || 'gemini-4-neon-high').trim();
  const requestId = `agy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

  onStatus?.(`正在啟動本機 Antigravity CLI (${model})...`);

  return new Promise((resolve, reject) => {
    let settled = false;
    let fullText = '';

    const cleanup = () => {
      if (typeof unsub === 'function') unsub();
      if (signal) signal.removeEventListener('abort', onAbort);
    };

    const onAbort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      window.electronAPI?.cancelAgyGenerate?.(requestId);
      reject(new DOMException('使用者已中止 AI 生成', 'AbortError'));
    };

    if (signal?.aborted) {
      reject(new DOMException('使用者已中止 AI 生成', 'AbortError'));
      return;
    }
    if (signal) signal.addEventListener('abort', onAbort);

    const unsub = window.electronAPI.onAgyStreamEvent((ev) => {
      if (!ev || ev.requestId !== requestId || settled) return;

      if (ev.type === 'status') {
        onStatus?.(ev.message || `${model} 處理中...`);
      } else if (ev.type === 'delta' && ev.text) {
        fullText += ev.text;
        onDelta?.(ev.text, fullText);
      } else if (ev.type === 'done') {
        settled = true;
        cleanup();
        const finalOutput = (ev.response && String(ev.response).trim()) ? ev.response : fullText;
        resolve({ text: finalOutput, usage: ev.usage || null, model });
      } else if (ev.type === 'error') {
        settled = true;
        cleanup();
        reject(new Error(ev.error || 'Antigravity CLI 生成失敗'));
      }
    });

    window.electronAPI
      .startAgyGenerate({ requestId, model, prompt: combinedPrompt })
      .then((res) => {
        if (!settled && res && res.success === false) {
          settled = true;
          cleanup();
          reject(new Error(res.error || '無法啟動本機 agy CLI'));
        }
      })
      .catch((err) => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(err);
        }
      });
  });
}

export async function streamAiGeneration({
  config,
  systemPrompt,
  userPrompt,
  onDelta,
  onStatus,
  signal,
}) {
  const effective = config || loadAiConfig();
  if (effective.engine === 'agy') {
    return streamAgyCli({ config: effective, systemPrompt, userPrompt, onDelta, onStatus, signal });
  }
  if (effective.engine === 'openai') {
    return streamOpenAiCompatible({ config: effective, systemPrompt, userPrompt, onDelta, onStatus, signal });
  }
  return streamGeminiApi({ config: effective, systemPrompt, userPrompt, onDelta, onStatus, signal });
}
