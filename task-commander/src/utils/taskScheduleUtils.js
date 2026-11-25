import { getLocalDateKey } from './academicUtils.js';

export const WEEKDAY_OPTIONS = [
  { value: 1, short: '一', label: '週一' },
  { value: 2, short: '二', label: '週二' },
  { value: 3, short: '三', label: '週三' },
  { value: 4, short: '四', label: '週四' },
  { value: 5, short: '五', label: '週五' },
  { value: 6, short: '六', label: '週六' },
  { value: 0, short: '日', label: '週日' },
];

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_SHORT_MAP = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
};

/**
 * Normalize and deduplicate weekday numbers (0=Sun..6=Sat) in Mon-Sun order.
 */
export function normalizeRepeatDays(repeatDays) {
  if (!Array.isArray(repeatDays)) return [];
  const valid = new Set();
  for (const d of repeatDays) {
    const n = Number(d);
    if (Number.isInteger(n) && n >= 0 && n <= 6) {
      valid.add(n);
    }
  }
  if (valid.size === 0) return [];
  return WEEKDAY_ORDER.filter((d) => valid.has(d));
}

/**
 * Determine whether a task is scheduled for the given date.
 * Non-Daily tasks always return true; Daily tasks without repeatDays (or all 7 days) run every day.
 */
export function isTaskScheduledForDate(task, dateObj = new Date()) {
  if (!task) return false;
  if (task.category && task.category !== 'Daily') return true;
  const days = normalizeRepeatDays(task.repeatDays);
  if (days.length === 0 || days.length === 7) return true;
  return days.includes(dateObj.getDay());
}

/**
 * Format repeatDays into a compact human-readable Chinese label, or '' for everyday tasks.
 */
export function formatRepeatDaysLabel(repeatDays) {
  const days = normalizeRepeatDays(repeatDays);
  if (days.length === 0 || days.length === 7) return '';
  if (days.length === 1) return `每週${DAY_SHORT_MAP[days[0]]}`;
  const joined = days.join(',');
  if (joined === '1,2,3,4,5') return '每週一至五';
  if (joined === '6,0') return '每週末';
  return `每週${days.map((d) => DAY_SHORT_MAP[d]).join('、')}`;
}

/**
 * Return Mon-Sun sort weight for a task's first scheduled weekday.
 */
export function getTaskScheduleSortWeight(task) {
  const days = normalizeRepeatDays(task?.repeatDays);
  if (days.length === 0) return 99;
  const idx = WEEKDAY_ORDER.indexOf(days[0]);
  return idx >= 0 ? idx : 99;
}

/**
 * Summarize checklist completion stats for a task.
 */
export function getChecklistStats(task) {
  const list = Array.isArray(task?.checklist) ? task.checklist : [];
  const total = list.length;
  const done = list.filter((i) => Boolean(i?.done)).length;
  return {
    list,
    total,
    done,
    hasChecklist: total > 0,
    allDone: total > 0 && done === total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

/**
 * Create a normalized checklist item object.
 */
export function createChecklistItem(text) {
  const id =
    globalThis.crypto?.randomUUID?.() ||
    `chk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    text: String(text || '').trim(),
    done: false,
  };
}

/**
 * Reset completion and all checklist items for a Daily task.
 */
export function resetDailyTaskProgress(task) {
  if (!task || task.category !== 'Daily') return task;
  return {
    ...task,
    completed: false,
    checklist: Array.isArray(task.checklist)
      ? task.checklist.map((i) => ({ ...i, done: false }))
      : task.checklist,
  };
}

/**
 * Reset Daily tasks whose recorded progress timestamp belongs to an earlier local calendar day.
 */
export function resetStaleDailyTasks(tasks = [], now = new Date()) {
  if (!Array.isArray(tasks)) return [];
  const todayKey = getLocalDateKey(now);
  return tasks.map((task) => {
    if (!task || task.category !== 'Daily') return task;
    const hasProgress =
      Boolean(task.completed) ||
      (Array.isArray(task.checklist) && task.checklist.some((i) => Boolean(i?.done)));
    if (!hasProgress || !task.updatedAt) return task;
    const parsed = new Date(task.updatedAt);
    if (Number.isNaN(parsed.getTime())) return task;
    if (getLocalDateKey(parsed) < todayKey) {
      return resetDailyTaskProgress(task);
    }
    return task;
  });
}
