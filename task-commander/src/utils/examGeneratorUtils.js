import { getTodayISO, MODE_LABELS, SUBJECT_CONFIG } from './examArenaUtils.js';

export const SUBJECT_GENERATION_PRESETS = {
  微積分: {
    subject: '微積分',
    track: 'UST_A4_NTHU_CS',
    saveFolder: 'Test_Bank/Exam_paper/Transfer/微積分',
    timeLimitMinutes: 80,
    questionCount: 12,
    questionFormat: 'ust_calc',
    targetScore: 92,
    examWeight: 2,
    formatSummary: '對齊台聯大新常態：10 題填充（每題 8 分）＋ 2 題計算證明（每題 10 分）',
    defaultTopic: '台聯大 A4 微積分全範圍（多重積分／極值／級數／FTC／向量微積分）',
    recommendedRefs: [
      '.agent/skills/mock-exam-generator/references/ust_a4_nthu_cs_profile.md',
      'Reference/Transfer/台聯大考古題/微積分/歷屆微積分_OCR_cache.md',
      'Test_Bank/Exam_paper/Transfer/微積分/Learning_Status.md',
      'Test_Bank/Exam_paper/Transfer/Consolidated_Learning_Status.md',
    ],
  },
  計算機概論: {
    subject: '計算機概論',
    track: 'UST_A4_NTHU_CS',
    saveFolder: 'Test_Bank/Exam_paper/Transfer/計算機概論',
    timeLimitMinutes: 70,
    questionCount: 20,
    questionFormat: 'mcq',
    targetScore: 90,
    examWeight: 2,
    formatSummary: '20 題 5 選 1 單選題（每題 5 分，A–E，涵蓋八大核心模組與深水實務題）',
    defaultTopic: '台聯大 A4 計概八大核心（資料表示／計組快取／OS／C++／資結／演算法／網路資安）',
    recommendedRefs: [
      '.agent/skills/mock-exam-generator/references/ust_a4_nthu_cs_profile.md',
      'Reference/Transfer/台聯大考古題/計算機概論/歷屆計算機概論_OCR_cache.md',
      'Test_Bank/Exam_paper/Transfer/計算機概論/Learning_Status.md',
      'Test_Bank/Exam_paper/Transfer/Consolidated_Learning_Status.md',
    ],
  },
  英文: {
    subject: '英文',
    track: 'UST_A4_NTHU_CS',
    saveFolder: 'Test_Bank/Exam_paper/Transfer/UST_Transfer_English',
    timeLimitMinutes: 40,
    questionCount: 20,
    questionFormat: 'ust_eng',
    targetScore: 92,
    examWeight: 1,
    formatSummary: 'GRE/TOEFL 學術字彙 ＋ 核心文法陷阱 ＋ 1 篇學術閱讀理解（4 選 1 單選）',
    defaultTopic: '台聯大 A4 英文高頻學術字彙、核心文法倒裝／假設語氣與學術閱讀',
    recommendedRefs: [
      '.agent/skills/mock-exam-generator/references/ust_a4_nthu_cs_profile.md',
      'Reference/Transfer/台聯大考古題/英文/歷屆英文_OCR_cache.md',
      'Test_Bank/Exam_paper/Transfer/UST_Transfer_English/Learning_Status.md',
      'Test_Bank/Exam_paper/Transfer/Consolidated_Learning_Status.md',
    ],
  },
};

export const ARENA_MODE_OPTIONS = [
  { id: 'mock', label: '全真模擬卷', desc: '完全對齊台聯大／大考難易度與配分結構' },
  { id: 'diagnostic', label: '喚醒診斷卷', desc: '高鑑別度全面檢測＋25% 間隔複習回馬槍' },
  { id: 'targeted', label: '弱點打擊卷', desc: '專攻錯題本與記憶衰減 🔴/🟡 章節' },
  { id: 'sweep', label: '章節掃題卷', desc: '針對指定章節／主題地毯式覆蓋所有變形' },
  { id: 'micro_drill', label: '高頻微訓練', desc: '10–15 分鐘快刷（單字／名詞／易混陷阱）' },
];

export const QUESTION_FORMAT_OPTIONS = [
  { id: 'auto', label: '依科目最佳題型（推薦）' },
  { id: 'mcq', label: '全單選題（自動批改）' },
  { id: 'fill', label: '全填充題（短答自評）' },
  { id: 'mixed', label: '混合題型（單選＋填充＋計算）' },
  { id: 'calculation', label: '全計算／證明題' },
];

export function getPresetForSubject(subject) {
  if (SUBJECT_GENERATION_PRESETS[subject]) {
    return SUBJECT_GENERATION_PRESETS[subject];
  }
  const safeName = String(subject || '一般科目')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_') || '一般科目';
  return {
    subject: subject || '一般科目',
    track: 'GENERAL_COURSE',
    saveFolder: `Test_Bank/Exam_paper/${safeName}`,
    timeLimitMinutes: 60,
    questionCount: 12,
    questionFormat: 'mixed',
    targetScore: 85,
    examWeight: 1,
    formatSummary: '混合單選、填充與計算簡答題，適用大學期中／期末複習',
    defaultTopic: `${subject || '本科目'} 綜合模擬演練`,
    recommendedRefs: [],
  };
}

function formatReferenceContext(referenceFiles = [], maxTotalChars = 38000) {
  if (!Array.isArray(referenceFiles) || referenceFiles.length === 0) return '';
  const perFileBudget = Math.max(4500, Math.floor(maxTotalChars / referenceFiles.length));
  const chunks = [];
  let used = 0;

  for (const ref of referenceFiles) {
    if (!ref?.content || used >= maxTotalChars) continue;
    const remaining = maxTotalChars - used;
    const limit = Math.min(perFileBudget, remaining);
    const trimmed =
      ref.content.length > limit
        ? `${ref.content.slice(0, limit)}\n...(為控制長度節錄至前 ${limit} 字元)...`
        : ref.content;
    chunks.push(`### 參考來源：${ref.title || ref.path}\n路徑：${ref.path || ''}\n\n${trimmed}`);
    used += trimmed.length;
  }

  if (chunks.length === 0) return '';
  return `\n\n===== 本機參考資料與歷屆考情 =====\n${chunks.join('\n\n---\n\n')}\n===== 參考資料結束 =====\n`;
}

function buildQuestionFormatRule(subject, questionFormat, questionCount, mode) {
  const count = Math.max(3, Math.min(40, Number(questionCount) || 12));
  const resolved = questionFormat === 'auto' ? getPresetForSubject(subject).questionFormat : questionFormat;

  if (mode === 'micro_drill' && subject === '英文') {
    return `共 ${count} 題 4 選 1 單選題（type="mcq"，選項 key 為 "A"–"D"），集中考 GRE/TOEFL 學術高頻單字、正負態度反義詞與核心文法陷阱；每題配分平均使總分 100。`;
  }
  if (resolved === 'ust_calc') {
    const calcCount = count >= 10 ? 2 : count >= 6 ? 1 : 0;
    const fillCount = Math.max(1, count - calcCount);
    return `對齊台聯大微積分新常態：前 ${fillCount} 題為填充題（type="fill"，options=[]，零容錯檢驗定義域、端點開閉與所有解），後 ${calcCount} 題為計算／證明題（type="calculation"，options=[]）。總分為 100 分，請合理分配每題 points 使加總等於 100。`;
  }
  if (resolved === 'ust_eng') {
    const readingCount = count >= 12 ? 5 : 0;
    const grammarCount = Math.max(2, Math.round((count - readingCount) * 0.4));
    const vocabCount = Math.max(1, count - readingCount - grammarCount);
    return readingCount > 0
      ? `共 ${count} 題 4 選 1 單選題（type="mcq"，選項 key 為 "A"–"D"）：Part I 學術字彙與形近詞（${vocabCount} 題）＋ Part II 核心文法陷阱（${grammarCount} 題）＋ Part III 學術閱讀理解（${readingCount} 題，**必須**於 passages 陣列附一篇 220–320 字原創學術短文並於這 ${readingCount} 題填上對應 passageId）。總分 100 分。`
      : `共 ${count} 題 4 選 1 單選題（type="mcq"，選項 key 為 "A"–"D"），涵蓋學術字彙與核心文法陷阱，總分 100 分。`;
  }
  if (resolved === 'mcq') {
    const isCs = subject === '計算機概論';
    return `共 ${count} 題單選題（type="mcq"，選項 key 為 ${isCs ? '"A"–"E"（5 選 1）' : '"A"–"D"（4 選 1）'}，answer 為單一大寫字母如 "C"），總分 100 分。`;
  }
  if (resolved === 'fill') {
    return `共 ${count} 題填充題（type="fill"，options=[]，acceptableAnswers 提供 2–4 種等價簡寫方便自動比對），總分 100 分。`;
  }
  if (resolved === 'calculation') {
    return `共 ${count} 題計算／證明題（type="calculation"，options=[]，solution 必須條列完整逐步推導與邊界檢查），總分 100 分。`;
  }
  const mcqCount = Math.max(2, Math.round(count * 0.5));
  const calcCount = Math.max(1, Math.round(count * 0.2));
  const fillCount = Math.max(1, count - mcqCount - calcCount);
  return `共 ${count} 題混合題型：${mcqCount} 題單選（type="mcq"，A–D）＋ ${fillCount} 題填充（type="fill"）＋ ${calcCount} 題計算／簡答（type="calculation"），總分 100 分。`;
}

export function buildInteractiveExamPrompt({
  subject = '微積分',
  mode = 'mock',
  topic = '',
  questionCount = 12,
  timeLimitMinutes = 60,
  questionFormat = 'auto',
  difficulty = '90+ 頂標鑑別（台聯大／研究所進階）',
  includeRecallRatio = 25,
  referenceFiles = [],
  weakChapters = [],
  activeMistakes = [],
  leechFlashcards = [],
  extraInstructions = '',
  isAgyCli = false,
}) {
  const preset = getPresetForSubject(subject);
  const modeLabel = MODE_LABELS[mode] || '模擬考卷';
  const today = getTodayISO();
  const safeCount = Math.max(3, Math.min(40, Number(questionCount) || preset.questionCount));
  const safeMinutes = Math.max(10, Math.min(180, Number(timeLimitMinutes) || preset.timeLimitMinutes));
  const formatRule = buildQuestionFormatRule(subject, questionFormat, safeCount, mode);

  const agyGuard = isAgyCli
    ? '【重要執行指令】你現在處於純 JSON 試卷資料輸出模式：嚴禁呼叫任何工具（不要寫檔、不要執行終端指令、不要讀額外檔案），不要輸出任何開場白或結語，直接輸出一個合法且完整的 JSON 物件本體。\n\n'
    : '';

  const systemPrompt = `${agyGuard}你是專精台灣聯合大學系統（台聯大 A4 清大資工 90+ 頂標）與大學理工／商管課程的命題教授。
你的唯一任務是輸出**嚴格合法的單一 JSON 物件**，完全符合 Task Commander \`.exam.json\` Schema v1.0 規格。

【絕對格式鐵律】
1. 只輸出單一純 JSON 物件（以 \`{\` 開頭、\`}\` 結尾），禁止任何前言、解釋或額外文字。
2. 所有 LaTeX 公式務必使用雙重反斜線跳脫（例如 \`"$\\\\frac{1}{2}$"\`、\`"$\\\\ln(x)$"\`、\`"$\\\\theta$"\`、\`"$\\\\pi$"\`、\`"$\\\\infty$"\`、\`"$\\\\sqrt{x}$"\`、\`"$\\\\le$"\`、\`"$\\\\neq$"\`、\`"$\\\\right)$"\`），絕對不可出現未跳脫的單反斜線或換行控制字元。
3. 數學與程式追蹤題在填入 \`answer\` 前務必在內部獨立驗算兩遍，確保題目有解、答案唯一正確且與 \`solution\` 完全一致。
4. 全卷使用繁體中文（專有名詞與英文／微積分／計概原題幹保留精準英文術語）。`;

  const weakBlock =
    Array.isArray(weakChapters) && weakChapters.length > 0
      ? `\n【優先打擊之記憶衰減／弱點章節（請務必沿用相同 chapter 名稱以利系統自動回寫）】\n${weakChapters
          .slice(0, 10)
          .map((w) => `- ${w.chapter}（狀態：${w.status}，距上次複習 ${w.daysSince} 天／半衰期 ${w.halfLifeDays} 天；備註：${w.notes || '無'}）`)
          .join('\n')}\n`
      : '';

  const mistakeBlock =
    Array.isArray(activeMistakes) && activeMistakes.length > 0
      ? `\n【考生近期錯題與盲區（請挑 2–4 題改寫為同型異數「間隔回馬槍」並標記 "isSpacedRecall": true）】\n${activeMistakes
          .slice(0, 6)
          .map((m, idx) => `${idx + 1}. [${m.chapter}] ${m.subtopic || ''} — 失誤原因：${(m.reasons || []).join('、')}；口訣：${m.question?.mnemonic || ''}`)
          .join('\n')}\n`
      : '';

  const leechBlock =
    Array.isArray(leechFlashcards) && leechFlashcards.length > 0
      ? `\n【主動回憶閃卡「頑固遺忘卡 (Leeches)」— 請強制挑選 1–3 項融入新題幹並標記 "isSpacedRecall": true】\n${leechFlashcards
          .slice(0, 6)
          .map((c, idx) => `${idx + 1}. [${c.chapter || c.subject}] ${String(c.front || '').slice(0, 80)}（累計忘記 ${c.srs?.lapses || 0} 次；口訣：${c.mnemonic || '無'}）`)
          .join('\n')}\n`
      : '';

  const extraBlock = extraInstructions?.trim()
    ? `\n【使用者補充命題要求】\n${extraInstructions.trim()}\n`
    : '';

  const refBlock = formatReferenceContext(referenceFiles);

  const userPrompt = `請依下列條件命製一份可直接於 Task Commander 互動計時作答的 \`.exam.json\` 試卷：
- 科目 (\`subject\`): ${subject}
- 軌道 (\`track\`): ${preset.track}
- 模式 (\`mode\`): ${mode}（${modeLabel}）
- 範圍／主題: ${topic?.trim() || preset.defaultTopic}
- 難度定位: ${difficulty}
- 作答限時 (\`timeLimitMinutes\`): ${safeMinutes} 分鐘
- 目標分數 (\`targetScore\`): ${preset.targetScore}
- 題數與題型配置: ${formatRule}
- 間隔複習回馬槍配比: 約 ${includeRecallRatio}% 題目標記 \`"isSpacedRecall": true\`，鎖定歷史易錯與衰減章節。
- 日期 (\`createdAt\`): ${today}
${weakBlock}${mistakeBlock}${leechBlock}${extraBlock}
【JSON Schema 結構範例（所有欄位必填）】
{
  "schemaVersion": "1.0",
  "id": "${subject === '微積分' ? 'ust-116-calc' : subject === '計算機概論' ? 'ust-116-cs' : subject === '英文' ? 'ust-116-eng' : 'tc-exam'}-${mode}-${today.replace(/-/g, '')}",
  "title": "具體且具辨識度的試卷標題",
  "subject": "${subject}",
  "track": "${preset.track}",
  "mode": "${mode}",
  "createdAt": "${today}",
  "timeLimitMinutes": ${safeMinutes},
  "totalPoints": 100,
  "targetScore": ${preset.targetScore},
  "examWeight": ${preset.examWeight},
  "instructions": "簡潔明確的考場規則與驗算提醒",
  "passages": [],
  "sections": [
    { "id": "sec-1", "title": "大題標題", "description": "作答提醒" }
  ],
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "sectionId": "sec-1",
      "passageId": null,
      "type": "mcq",
      "points": 5,
      "chapter": "章節名稱（與 Learning_Status 對齊）",
      "subtopic": "精準細項考點",
      "difficulty": "Medium",
      "isSpacedRecall": false,
      "prompt": "完整題幹（支援 Markdown、LaTeX 與程式碼區塊）",
      "options": [
        { "key": "A", "text": "選項 A 內容" },
        { "key": "B", "text": "選項 B 內容" },
        { "key": "C", "text": "選項 C 內容" },
        { "key": "D", "text": "選項 D 內容" }
      ],
      "answer": "B",
      "acceptableAnswers": ["B"],
      "solution": "完整逐步解析（條列推導步驟或各選項刪除理由）",
      "coreFormula": "核心公式、定理或專有名詞定義",
      "pitfall": "常見失分陷阱與干擾設計",
      "mnemonic": "一句話考前速記口訣"
    }
  ]
}
${refBlock}
請立即輸出完整合法 JSON 物件：`;

  return { systemPrompt, userPrompt };
}

// ============================================================================
// Robust JSON Extraction & LaTeX Backslash Repair Engine
// ============================================================================

const LATEX_FOLLOW_MAP = {
  f: /^(rac|orall|lat|rown)\b/,
  t: /^(heta|an|ext|imes|au|o|ilde|op|riangle|iny|extbf|extit|extrm|exttt)\b/,
  b: /^(eta|inom|ig|igl|igr|igg|ar|f|oldsymbol|egin|ot|ullet|oxed|ackslash|ecause)\b/,
  n: /^(eq|abla|u|ot|i|eg|ewline|mid|otin|subset|leq|geq)\b/,
  r: /^(ight|ho|angle|ceil|floor|m|arrow|ef|eal)\b/,
};

function extractOutermostJsonObject(raw) {
  let text = String(raw || '').replace(/^\uFEFF/, '').trim();
  // Prefer fenced ```json block if present
  const fenceMatch = text.match(/```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```/i);
  if (fenceMatch && fenceMatch[1] && fenceMatch[1].trim().startsWith('{')) {
    text = fenceMatch[1].trim();
  }

  const start = text.indexOf('{');
  if (start < 0) return text;

  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end > start) {
    return text.slice(start, end + 1);
  }
  const lastBrace = text.lastIndexOf('}');
  return lastBrace > start ? text.slice(start, lastBrace + 1) : text.slice(start);
}

export function repairJsonStringLiterals(jsonText) {
  let out = '';
  let inString = false;
  const len = jsonText.length;

  for (let i = 0; i < len; i++) {
    const ch = jsonText[i];

    if (!inString) {
      if (ch === '"') {
        inString = true;
      }
      out += ch;
      continue;
    }

    // Inside JSON string literal
    if (ch === '"') {
      inString = false;
      out += ch;
      continue;
    }

    if (ch === '\n') {
      out += '\\n';
      continue;
    }
    if (ch === '\r') {
      out += '\\r';
      continue;
    }
    if (ch === '\t') {
      out += '\\t';
      continue;
    }

    if (ch === '\\') {
      const next = i + 1 < len ? jsonText[i + 1] : '';
      if (next === '"' || next === '\\' || next === '/') {
        out += ch + next;
        i += 1;
        continue;
      }
      if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(jsonText.slice(i + 2, i + 6))) {
        out += jsonText.slice(i, i + 6);
        i += 5;
        continue;
      }
      if (next && Object.prototype.hasOwnProperty.call(LATEX_FOLLOW_MAP, next)) {
        const rest = jsonText.slice(i + 2, i + 18);
        if (LATEX_FOLLOW_MAP[next].test(rest)) {
          // Single-escaped LaTeX command like \frac, \theta, \beta, \neq, \right
          out += '\\\\' + next;
          i += 1;
          continue;
        }
        // Legitimate JSON escape (\n, \t, \r, \b, \f)
        out += ch + next;
        i += 1;
        continue;
      }
      // Any other backslash inside JSON string (e.g., \ln, \pi, \sqrt, \le, \{, \,) is invalid JSON -> double it
      out += '\\\\';
      continue;
    }

    out += ch;
  }

  // Remove trailing commas before } or ] (outside strings)
  let cleaned = '';
  inString = false;
  let esc = false;
  for (let i = 0; i < out.length; i++) {
    const ch = out[i];
    if (inString) {
      cleaned += ch;
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      cleaned += ch;
      continue;
    }
    if (ch === ',') {
      let j = i + 1;
      while (j < out.length && /\s/.test(out[j])) j += 1;
      if (out[j] === '}' || out[j] === ']') {
        continue;
      }
    }
    cleaned += ch;
  }

  return cleaned;
}

const BACKSPACE_LATEX_RE = new RegExp(
  `${String.fromCharCode(8)}(eta|inom|ig|igl|igr|igg|ar|f|oldsymbol|egin|ot|ullet|oxed|ackslash|ecause)\\b`,
  'g'
);

function repairAccidentalControlCharsInString(str) {
  if (typeof str !== 'string') return str;
  // Recover cases where valid JSON parsed \frac -> \f + rac, \beta -> \b + eta, \right -> \r + ight, \theta -> \t + heta
  return str
    .replace(/\f(rac|orall|lat|rown)\b/g, '\\f$1')
    .replace(BACKSPACE_LATEX_RE, '\\b$1')
    .replace(/\r(ight|ho|angle|ceil|floor|m|arrow|ef|eal)\b/g, '\\r$1')
    .replace(/\t(heta|an|ext|imes|au|o|ilde|op|riangle|iny|extbf|extit|extrm|exttt)\b/g, '\\t$1');
}

function deepRepairStrings(value) {
  if (typeof value === 'string') return repairAccidentalControlCharsInString(value);
  if (Array.isArray(value)) return value.map(deepRepairStrings);
  if (value && typeof value === 'object') {
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      next[k] = deepRepairStrings(v);
    }
    return next;
  }
  return value;
}

function normalizeOptions(rawOptions) {
  if (!rawOptions) return [];
  if (Array.isArray(rawOptions)) {
    return rawOptions
      .map((opt, idx) => {
        const fallbackKey = String.fromCharCode(65 + idx);
        if (typeof opt === 'string') {
          const m = opt.trim().match(/^\(?([A-E])\)?[.):：\s]+([\s\S]+)$/);
          if (m) return { key: m[1].toUpperCase(), text: m[2].trim() };
          return { key: fallbackKey, text: opt.trim() };
        }
        if (opt && typeof opt === 'object') {
          const key = String(opt.key || opt.label || opt.id || fallbackKey).trim().toUpperCase().slice(0, 2);
          const text = String(opt.text ?? opt.content ?? opt.value ?? '').trim();
          return { key, text };
        }
        return null;
      })
      .filter((o) => o && o.text !== '');
  }
  if (typeof rawOptions === 'object') {
    return Object.entries(rawOptions).map(([k, v]) => ({
      key: String(k).trim().toUpperCase(),
      text: String(v ?? '').trim(),
    }));
  }
  return [];
}

export function parseAndRepairExamJson(rawText, fallbackMeta = {}) {
  const extracted = extractOutermostJsonObject(rawText);
  if (!extracted || !extracted.startsWith('{')) {
    throw new Error('AI 輸出中找不到有效的 JSON 試卷物件（請確認模型未中斷，或切回原始碼檢查）');
  }

  let parsed = null;
  let lastErr = null;
  try {
    parsed = JSON.parse(extracted);
  } catch (err1) {
    lastErr = err1;
    try {
      const repaired = repairJsonStringLiterals(extracted);
      parsed = JSON.parse(repaired);
    } catch (err2) {
      throw new Error(`試卷 JSON 解析失敗：${err2.message || lastErr?.message}（可能是輸出過長遭截斷，建議減少題數或重試）`);
    }
  }

  parsed = deepRepairStrings(parsed);

  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('JSON 解析成功，但缺少有效的 questions 題目陣列');
  }

  const subject = String(parsed.subject || fallbackMeta.subject || '未分類科目').trim();
  const preset = getPresetForSubject(subject);
  const mode = String(parsed.mode || fallbackMeta.mode || 'mock').trim();
  const today = getTodayISO();
  const stamp = Date.now().toString(36).slice(-5);

  const normalizedPassages = Array.isArray(parsed.passages)
    ? parsed.passages
        .filter((p) => p && (p.content || p.text))
        .map((p, idx) => ({
          id: String(p.id || `p-${idx + 1}`),
          title: String(p.title || `Reading Passage ${idx + 1}`),
          content: String(p.content || p.text || ''),
        }))
    : [];

  const normalizedSections = Array.isArray(parsed.sections) && parsed.sections.length > 0
    ? parsed.sections.map((s, idx) => ({
        id: String(s.id || `sec-${idx + 1}`),
        title: String(s.title || `第 ${idx + 1} 大題`),
        description: String(s.description || ''),
      }))
    : [{ id: 'sec-1', title: `${subject} 模擬測驗`, description: '' }];

  const defaultSectionId = normalizedSections[0].id;
  const fallbackPts = Math.round((100 / parsed.questions.length) * 10) / 10;

  const normalizedQuestions = parsed.questions
    .filter((q) => q && (q.prompt || q.question))
    .map((q, idx) => {
      const options = normalizeOptions(q.options);
      let rawType = String(q.type || '').toLowerCase().trim();
      if (!['mcq', 'fill', 'calculation'].includes(rawType)) {
        if (options.length >= 2) rawType = 'mcq';
        else if (/calc|proof|essay|計算|證明|申論/.test(rawType)) rawType = 'calculation';
        else rawType = 'fill';
      }
      if (rawType === 'mcq' && options.length < 2) {
        rawType = 'fill';
      }

      let answer = String(q.answer ?? '').trim();
      if (rawType === 'mcq') {
        const letterMatch = answer.match(/^\(?([A-E])\)?/i);
        if (letterMatch) answer = letterMatch[1].toUpperCase();
      }

      const acceptableAnswers = Array.isArray(q.acceptableAnswers)
        ? q.acceptableAnswers.map((a) => String(a).trim()).filter(Boolean)
        : answer
          ? [answer]
          : [];
      if (answer && !acceptableAnswers.includes(answer)) {
        acceptableAnswers.unshift(answer);
      }

      return {
        id: String(q.id || `q-${idx + 1}`),
        number: idx + 1,
        sectionId: String(q.sectionId || defaultSectionId),
        passageId: q.passageId || null,
        type: rawType,
        points: Number(q.points) > 0 ? Number(q.points) : fallbackPts,
        chapter: String(q.chapter || fallbackMeta.topic || subject).trim(),
        subtopic: String(q.subtopic || '').trim(),
        difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium',
        isSpacedRecall: Boolean(q.isSpacedRecall),
        prompt: String(q.prompt || q.question || '').trim(),
        options: rawType === 'mcq' ? options : [],
        answer,
        acceptableAnswers,
        solution: String(q.solution || q.explanation || '（詳解待補充）').trim(),
        coreFormula: String(q.coreFormula || '').trim(),
        pitfall: String(q.pitfall || '').trim(),
        mnemonic: String(q.mnemonic || '').trim(),
      };
    });

  if (normalizedQuestions.length === 0) {
    throw new Error('所有題目皆缺少有效的 prompt 內容');
  }

  const computedTotal = Math.round(normalizedQuestions.reduce((sum, q) => sum + Number(q.points || 0), 0) * 10) / 10;

  return {
    schemaVersion: '1.0',
    id: String(parsed.id || `exam-${mode}-${today.replace(/-/g, '')}-${stamp}`).trim(),
    title: String(parsed.title || fallbackMeta.title || `${subject} ${MODE_LABELS[mode] || '模擬考卷'} (${today})`).trim(),
    subject,
    track: String(parsed.track || preset.track),
    mode,
    createdAt: String(parsed.createdAt || today),
    timeLimitMinutes: Number(parsed.timeLimitMinutes) > 0 ? Number(parsed.timeLimitMinutes) : Number(fallbackMeta.timeLimitMinutes) || preset.timeLimitMinutes,
    totalPoints: computedTotal || Number(parsed.totalPoints) || 100,
    targetScore: Number(parsed.targetScore) > 0 ? Number(parsed.targetScore) : preset.targetScore,
    examWeight: Number(parsed.examWeight) > 0 ? Number(parsed.examWeight) : (SUBJECT_CONFIG[subject]?.weight || preset.examWeight || 1),
    sourceMarkdown: parsed.sourceMarkdown || '',
    answerMarkdown: parsed.answerMarkdown || '',
    instructions: String(parsed.instructions || '作答期間請勿查閱解答與公式表，每題完成後標記信心狀態（會寫 / 靠猜 / 忘記公式）。').trim(),
    passages: normalizedPassages,
    sections: normalizedSections,
    questions: normalizedQuestions,
  };
}

export function buildExamSavePaths(examData) {
  const preset = getPresetForSubject(examData?.subject);
  const today = String(examData?.createdAt || getTodayISO()).replace(/[^0-9-]/g, '') || getTodayISO();
  const stamp = new Date().toISOString().slice(11, 16).replace(':', '');
  const modeSlug = String(examData?.mode || 'mock').replace(/[^a-z0-9_-]/gi, '').slice(0, 16) || 'mock';
  const titleSlug = String(examData?.title || 'Exam')
    .replace(/[\\/:*?"<>|\s]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 34);
  const baseName = `${modeSlug}_${today}_${stamp}_${titleSlug || 'AI'}`;
  const folder = preset.saveFolder;

  return {
    folder,
    jsonPath: `${folder}/Mock_Exam_${baseName}.exam.json`,
    examMdPath: `${folder}/Mock_Exam_${baseName}.md`,
    answerMdPath: `${folder}/Answers_${baseName}.md`,
  };
}

export function convertExamJsonToMarkdown(examData) {
  const ex = examData || {};
  const questions = Array.isArray(ex.questions) ? ex.questions : [];
  const sections = Array.isArray(ex.sections) && ex.sections.length > 0
    ? ex.sections
    : [{ id: 'default', title: '測驗題目', description: '' }];
  const passages = Array.isArray(ex.passages) ? ex.passages : [];
  const passageMap = new Map(passages.map((p) => [p.id, p]));
  const renderedPassages = new Set();

  // 1. Blank Exam Markdown
  const examLines = [
    `# ${ex.title || '模擬考卷'}`,
    '',
    '## 測驗說明區',
    '',
    `- **科目**：${ex.subject || '一般科目'}`,
    `- **模式**：${MODE_LABELS[ex.mode] || ex.mode || '模擬卷'}`,
    `- **測驗時間**：${ex.timeLimitMinutes || 60} 分鐘`,
    `- **總分 / 目標分數**：${ex.totalPoints || 100} 分（目標 ${ex.targetScore || 90}+）`,
    `- **生成日期**：${ex.createdAt || getTodayISO()}`,
    `- **作答說明**：${ex.instructions || '請於限定時間內獨立完成作答。'}`,
    '',
    '---',
    '',
  ];

  const groupedBySec = new Map(sections.map((s) => [s.id, []]));
  const orphanQuestions = [];
  for (const q of questions) {
    if (groupedBySec.has(q.sectionId)) groupedBySec.get(q.sectionId).push(q);
    else orphanQuestions.push(q);
  }
  if (orphanQuestions.length > 0) {
    groupedBySec.set('__other', orphanQuestions);
  }

  for (const [secId, secQuestions] of groupedBySec.entries()) {
    if (secQuestions.length === 0) continue;
    const secInfo = sections.find((s) => s.id === secId) || { title: '測驗題目', description: '' };
    examLines.push(`## ${secInfo.title}`, '');
    if (secInfo.description) {
      examLines.push(`> ${secInfo.description}`, '');
    }

    for (const q of secQuestions) {
      if (q.passageId && !renderedPassages.has(q.passageId) && passageMap.has(q.passageId)) {
        const p = passageMap.get(q.passageId);
        renderedPassages.add(q.passageId);
        examLines.push(`### 📖 ${p.title}`, '', p.content, '', '---', '');
      }

      const typeLabel = q.type === 'mcq' ? '單選' : q.type === 'fill' ? '填充' : '計算/證明';
      examLines.push(`### Q${q.number}. (${q.points} 分 · ${typeLabel})`, '', q.prompt, '');

      if (q.type === 'mcq' && Array.isArray(q.options) && q.options.length > 0) {
        for (const opt of q.options) {
          examLines.push(`- **(${opt.key})** ${opt.text}`);
        }
        examLines.push('');
      } else {
        examLines.push('**答**：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿', '');
      }
    }
  }

  // 2. Answer Key & Detailed Solution Markdown
  const answerLines = [
    `# ${ex.title || '模擬考卷'} — 完整詳解與考點解析`,
    '',
    '## 考點分佈總表',
    '',
    '| 題號 | 題型 | 配分 | 難度 | 對應章節 | 細項考點 | 回馬槍 |',
    '| :-: | :-: | :-: | :-: | :--- | :--- | :-: |',
  ];

  for (const q of questions) {
    const typeLabel = q.type === 'mcq' ? '單選' : q.type === 'fill' ? '填充' : '計算';
    const chap = String(q.chapter || '').replace(/\|/g, '/');
    const sub = String(q.subtopic || '').replace(/\|/g, '/');
    answerLines.push(
      `| Q${q.number} | ${typeLabel} | ${q.points} | [${q.difficulty || 'Medium'}] | ${chap} | ${sub} | ${q.isSpacedRecall ? '🔁' : '—'} |`
    );
  }

  answerLines.push('', '---', '', '## 逐題答案與詳細解析', '');

  for (const q of questions) {
    answerLines.push(`### Q${q.number} [${q.difficulty || 'Medium'}]（${q.points} 分 · ${q.chapter || ''}）`, '');
    answerLines.push(`- **標準答案**：${q.answer}`, '');
    answerLines.push('**完整解析**：', '', q.solution || '（無）', '');
    if (q.coreFormula) answerLines.push(`- **📌 核心公式 / 定義**：${q.coreFormula}`);
    if (q.pitfall) answerLines.push(`- **⚠️ 常見陷阱**：${q.pitfall}`);
    if (q.mnemonic) answerLines.push(`- **⚡ 一句話口訣**：${q.mnemonic}`);
    answerLines.push('', '---', '');
  }

  answerLines.push(
    '## 配分與評分標準 (Marking Scheme)',
    '',
    `- 本卷滿分 **${ex.totalPoints || 100} 分**，目標分數 **${ex.targetScore || 90}+ 分**。`,
    '- 單選題與填充題依標準答案判定；計算／證明題關鍵步驟正確可給部分分（50%）。',
    '- 即使答對但標記「靠猜」或「忘記公式」者，建議列入錯題本並收錄至主動回憶閃卡庫。',
    ''
  );

  return {
    examMarkdown: examLines.join('\n'),
    answerMarkdown: answerLines.join('\n'),
  };
}
