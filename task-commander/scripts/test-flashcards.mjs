import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  splitMarkdownTableRow,
  parseFlashcardsMarkdown,
  mergeMarkdownIntoStore,
  serializeStoreToMarkdown,
  createEmptyFlashcardsStore,
  previewSm2Schedule,
  applySm2Review,
  isCardDue,
  isCardLeech,
  buildStudyQueue,
  computeFlashcardStats,
  createCardFromExamQuestion,
  addCardsWithDedup,
  mergeFlashcardsPayload,
  exportFlashcardsToAnkiTsv,
  parseAndRepairFlashcardsJson,
} from '../src/utils/flashcardUtils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const realMdPath = path.join(repoRoot, 'Review_Dashboard', 'Active_Recall_Flashcards.md');

test('splitMarkdownTableRow preserves LaTeX pipes in CA-03 and CA-07', () => {
  const ca03 = '| CA-03 | **方向導數公式 $D_{\\mathbf{v}} f(P)$ 最致命的遺漏陷阱？** | $D_{\\mathbf{u}} f = \\nabla f \\cdot \\hat{\\mathbf{u}}$，**務必先把 $\\mathbf{v}$ 除以 $\\|\\mathbf{v}\\|$ 化為單位向量**！ |';
  const cells03 = splitMarkdownTableRow(ca03);
  assert.equal(cells03.length, 3);
  assert.equal(cells03[0], 'CA-03');
  assert.ok(cells03[2].includes('\\|\\mathbf{v}\\|'));

  const ca07 = '| CA-07 | **線性變數代換 Jacobian 計算與防抄錯規則？** | $dA = \\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right| du\\,dv = \\frac{1}{\\left|\\frac{\\partial(u,v)}{\\partial(x,y)}\\right|} du\\,dv$；**動筆積分前必二次核對四條邊界常數！** |';
  const cells07 = splitMarkdownTableRow(ca07);
  assert.equal(cells07.length, 3);
  assert.equal(cells07[0], 'CA-07');
  assert.ok(cells07[2].includes('\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|'));
});

test('parseFlashcardsMarkdown parses all 25 real seed cards from Active_Recall_Flashcards.md', () => {
  const realMd = fs.readFileSync(realMdPath, 'utf-8');
  const parsed = parseFlashcardsMarkdown(realMd, '2026-11-27');
  assert.equal(parsed.length, 25);

  const cs = parsed.filter((c) => c.subject === '計算機概論');
  const ca = parsed.filter((c) => c.subject === '微積分');
  const en = parsed.filter((c) => c.subject === '英文');
  assert.equal(cs.length, 10);
  assert.equal(ca.length, 7);
  assert.equal(en.length, 8);

  const cs02 = parsed.find((c) => c.code === 'CS-02');
  assert.ok(cs02);
  assert.ok(cs02.mnemonic.includes('後右小、前左大'));

  const ca07 = parsed.find((c) => c.code === 'CA-07');
  assert.ok(ca07);
  assert.ok(ca07.back.includes('\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|'));
});

test('Markdown serialize -> merge round-trip is idempotent with zero duplicates', () => {
  const realMd = fs.readFileSync(realMdPath, 'utf-8');
  const { nextStore: seeded } = mergeMarkdownIntoStore(createEmptyFlashcardsStore(), realMd, '2026-11-27');
  assert.equal(seeded.cards.length, 25);

  const exportedMd = serializeStoreToMarkdown(seeded);
  const { nextStore: remerged, addedCount } = mergeMarkdownIntoStore(seeded, exportedMd, '2026-11-27');
  assert.equal(addedCount, 0);
  assert.equal(remerged.cards.length, 25);

  // Fresh parse of serialized MD also yields 25 cards with intact Jacobian formula
  const freshParsed = parseFlashcardsMarkdown(exportedMd, '2026-11-27');
  assert.equal(freshParsed.length, 25);
  const ca07 = freshParsed.find((c) => c.code === 'CA-07');
  assert.ok(ca07?.back.includes('\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|'));
});

test('SM-2 progression, leech detection, and daily streak analytics', () => {
  const realMd = fs.readFileSync(realMdPath, 'utf-8');
  let { nextStore: store } = mergeMarkdownIntoStore(createEmptyFlashcardsStore(), realMd, '2026-11-27');
  const card = store.cards[0];

  // Preview ratings on new card
  assert.equal(previewSm2Schedule(card, 1, '2026-11-27').requeueInSession, true);
  assert.equal(previewSm2Schedule(card, 2, '2026-11-27').intervalDays, 1);
  assert.equal(previewSm2Schedule(card, 3, '2026-11-27').intervalDays, 1);
  assert.equal(previewSm2Schedule(card, 4, '2026-11-27').intervalDays, 4);

  // Good -> 1d -> Good -> 6d -> Good -> 15d (mastered)
  ({ nextStore: store } = applySm2Review(store, card.id, 3, { responseMs: 1800, todayISO: '2026-11-27' }));
  let c = store.cards.find((x) => x.id === card.id);
  assert.equal(c.srs.intervalDays, 1);
  assert.equal(c.srs.dueDate, '2026-11-28');
  assert.equal(isCardDue(c, '2026-11-27'), false);
  assert.equal(isCardDue(c, '2026-11-28'), true);

  ({ nextStore: store } = applySm2Review(store, card.id, 3, { responseMs: 2100, todayISO: '2026-11-28' }));
  c = store.cards.find((x) => x.id === card.id);
  assert.equal(c.srs.intervalDays, 6);
  assert.equal(c.srs.status, 'review');

  ({ nextStore: store } = applySm2Review(store, card.id, 3, { responseMs: 1600, todayISO: '2026-12-04' }));
  c = store.cards.find((x) => x.id === card.id);
  assert.equal(c.srs.intervalDays, 15);
  assert.equal(c.srs.status, 'mastered');

  // 3 lapses on card[1] triggers Leech flag
  const card2 = store.cards[1];
  for (let i = 0; i < 3; i += 1) {
    ({ nextStore: store } = applySm2Review(store, card2.id, 1, { responseMs: 5200, todayISO: '2026-11-28' }));
  }
  const c2 = store.cards.find((x) => x.id === card2.id);
  assert.equal(c2.srs.lapses, 3);
  assert.equal(isCardLeech(c2), true);

  // Priority queue puts leech first
  const dueQueue = buildStudyQueue(store.cards, { mode: 'due', todayISO: '2026-11-28' });
  assert.equal(dueQueue[0].id, card2.id);

  // Streak spans 2026-11-27 & 2026-11-28
  const stats = computeFlashcardStats(store, '2026-11-28');
  assert.equal(stats.streakDays, 2);
  assert.equal(stats.leechCount, 1);
});

test('mergeFlashcardsPayload combines phone SRS reviews + PC edits + tombstones without loss', () => {
  const base = createEmptyFlashcardsStore();
  const c1 = createCardFromExamQuestion({
    exam: { subject: '微積分', title: 'Diag 01' },
    question: {
      id: 'q1',
      type: 'mcq',
      chapter: '10. 多重積分',
      subtopic: '球座標 dV',
      prompt: '球座標體積元素為何？',
      options: [{ key: 'A', text: '$\\rho^2 \\sin\\phi d\\rho d\\phi d\\theta$' }],
      answer: 'A',
      mnemonic: '球要平方再乘 sinφ',
    },
    reasons: ['忘記公式/定義'],
    todayISO: '2026-11-27',
  });
  const { nextStore: initial } = addCardsWithDedup(base, [c1], '2026-11-27');

  // Phone reviews card twice
  let { nextStore: phoneStore } = applySm2Review(initial, c1.id, 3, { todayISO: '2026-11-27' });
  ({ nextStore: phoneStore } = applySm2Review(phoneStore, c1.id, 4, { todayISO: '2026-11-28' }));

  // PC edits card mnemonic later without reviewing
  const pcStore = {
    ...initial,
    cards: initial.cards.map((c) => ({
      ...c,
      mnemonic: '球要平方再乘 sinφ（新補充口訣）',
      updatedAt: '2099-01-01T00:00:00.000Z',
    })),
    deletedIds: ['deleted-old-card'],
  };

  const merged = mergeFlashcardsPayload(pcStore, phoneStore);
  assert.equal(merged.cards.length, 1);
  assert.equal(merged.cards[0].mnemonic, '球要平方再乘 sinφ（新補充口訣）');
  assert.equal(merged.cards[0].srs.reviewCount, 2);
  assert.equal(merged.reviewLog['2026-11-28'].reviewed, 1);
  assert.ok(merged.deletedIds.includes('deleted-old-card'));
});

test('parseAndRepairFlashcardsJson repairs single-escaped LaTeX and exports Anki TSV', () => {
  const brokenAiRaw = `\`\`\`json
  {
    "subject": "微積分",
    "cards": [
      {
        "chapter": "5. 積分技巧",
        "front": "求 $\\int \\frac{1}{1+x^2} dx$？",
        "back": "$\\tan^{-1}(x) + C$，注意 $\\neq \\ln(1+x^2)$",
        "mnemonic": "看到 1+x^2 就想 arctan",
        "pitfall": "別漏掉常數 +C",
        "tags": ["公式", "高頻"],
      },
    ]
  }
  \`\`\``;

  const cards = parseAndRepairFlashcardsJson(brokenAiRaw, { subject: '微積分' });
  assert.equal(cards.length, 1);
  assert.ok(cards[0].front.includes('\\frac{1}{1+x^2}'));
  assert.ok(cards[0].back.includes('\\tan^{-1}(x)'));

  const tsv = exportFlashcardsToAnkiTsv(cards);
  assert.ok(tsv.startsWith('#separator:tab'));
  assert.ok(tsv.includes('看到 1+x^2 就想 arctan'));
});
