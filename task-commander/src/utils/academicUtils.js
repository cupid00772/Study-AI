// 共用學業日期、課表自動推算、雜訊過濾與警告計算工具

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_LABELS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

const WEEKDAY_CHAR_MAP = {
  '日': 0,
  '天': 0,
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
};

const NOISE_KEYWORDS = [
  '出國補助', '補助申請', '國際菁英獎', '英語優等獎', '活動紀錄表',
  '英檢證明', '成績單繳交區', '英檢課堂加分', '多益', '問卷調查',
  '滿意度調查', '基本資料', '訪談紀錄', '不計分;不計次', '護照',
  '期中考-成績', '期末考-成績', '小考成績', '成績公告', '成績發布', '成績查詢',
];

export function isNoiseAssignment(hw) {
  if (!hw) return false;
  const title = String(hw.title || '');
  const course = String(hw.course || '');
  if (NOISE_KEYWORDS.some((kw) => title.includes(kw))) return true;
  if ((course.includes('護照') || course.includes('導師班')) && !title.includes('作業') && !title.includes('習題') && !title.includes('心得')) {
    return true;
  }
  return false;
}

export function getLocalDateKey(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const m = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0);
}

export function diffDaysFromToday(dateStr) {
  const target = parseLocalDate(dateStr);
  if (!target) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 由 academic_tracker.json 的 courses[].schedule 自動解析每週課表
 * 支援格式如：「週一 09:00 - 12:00 (一234)」、「週四 12:00 - 13:00 (四Z) / 週五 12:00 - 13:00 (五Z)」
 */
export function deriveWeeklyScheduleFromCourses(courses = []) {
  const map = {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  for (const course of courses || []) {
    const schedule = String(course.schedule || '');
    if (!schedule) continue;

    // 依 "/" 切分多時段課程
    const segments = schedule.split('/').map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      const dayMatch = seg.match(/週([日天一二三四五六])/);
      if (!dayMatch) continue;
      const dayIdx = WEEKDAY_CHAR_MAP[dayMatch[1]];
      if (dayIdx === undefined) continue;
      const dayName = DAY_NAMES[dayIdx];

      const timeMatch = seg.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/);
      const startHour = timeMatch ? Number(timeMatch[1].split(':')[0]) : 99;

      map[dayName].push({
        id: `${course.id || course.name}-${dayName}-${seg}`,
        name: course.name,
        code: course.code || '',
        time: timeMatch ? timeMatch[1].replace(/\s+/g, '') : seg,
        location: course.location || '',
        instructor: course.instructor || '',
        color: course.color || '#3b82f6',
        startHour,
      });
    }
  }

  for (const dayName of Object.keys(map)) {
    map[dayName].sort((a, b) => a.startHour - b.startHour);
  }

  return map;
}

export function getCoursesForOffsetDays(courses = [], offsetDays = 0) {
  const target = new Date();
  target.setDate(target.getDate() + offsetDays);
  const idx = target.getDay();
  const dayName = DAY_NAMES[idx];
  const dayLabel = DAY_LABELS[idx];
  const schedule = deriveWeeklyScheduleFromCourses(courses);
  return {
    dayName,
    dayLabel,
    dateLabel: `${target.getMonth() + 1}/${target.getDate()}`,
    courses: schedule[dayName] || [],
  };
}

/**
 * 計算目前所有需要警告的項目（作業逾期/急迫 + 考前 7 天真實考試與校曆考週）
 */
export function computeAcademicAlerts(trackerData = {}, alertConfig = {}) {
  const assignmentLeadDays = Number(alertConfig.assignmentLeadDays ?? 3);
  const includeOverdue = alertConfig.includeOverdue !== false;
  const examLeadDays = Number(alertConfig.examLeadDays ?? 7);
  const ignoredIds = new Set(trackerData?.ignored_assignment_ids || []);

  const urgentAssignments = [];
  const overdueAssignments = [];
  const activeAssignments = [];

  for (const hw of trackerData?.assignments || []) {
    if (ignoredIds.has(hw.id) || isNoiseAssignment(hw)) continue;
    if (hw.status === 'completed') continue;
    const daysLeft = diffDaysFromToday(hw.dueDate);
    const enriched = { ...hw, daysLeft };
    activeAssignments.push(enriched);

    if (daysLeft === null) continue;
    if (daysLeft < 0) {
      if (includeOverdue) overdueAssignments.push({ ...enriched, overdueDays: Math.abs(daysLeft) });
    } else if (daysLeft <= assignmentLeadDays) {
      urgentAssignments.push(enriched);
    }
  }

  urgentAssignments.sort((a, b) => a.daysLeft - b.daysLeft);
  overdueAssignments.sort((a, b) => a.overdueDays - b.overdueDays);
  activeAssignments.sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999));

  const upcomingExams = [];
  for (const ex of trackerData?.exams || []) {
    if (ex.status === 'completed') continue;
    const daysLeft = diffDaysFromToday(ex.date);
    if (daysLeft !== null && daysLeft >= 0 && daysLeft <= examLeadDays) {
      upcomingExams.push({ ...ex, daysLeft, isOfficialWeek: false });
    }
  }

  for (const ev of trackerData?.calendar_events || []) {
    if (ev.category !== 'Official_Exam') continue;
    const daysLeft = diffDaysFromToday(ev.startDate);
    const endDaysLeft = ev.endDate ? diffDaysFromToday(ev.endDate) : daysLeft;
    if ((daysLeft !== null && daysLeft >= 0 && daysLeft <= examLeadDays) || (daysLeft !== null && daysLeft < 0 && endDaysLeft >= 0)) {
      upcomingExams.push({
        id: ev.id,
        course: '中央大學校曆',
        title: ev.title,
        date: ev.endDate && ev.endDate !== ev.startDate ? `${ev.startDate} ~ ${ev.endDate}` : ev.startDate,
        scope: ev.description || '',
        daysLeft: Math.max(0, daysLeft),
        isOfficialWeek: true,
      });
    }
  }

  upcomingExams.sort((a, b) => a.daysLeft - b.daysLeft);

  return {
    urgentAssignments,
    overdueAssignments,
    activeAssignments,
    upcomingExams,
    urgentAssignmentCount: urgentAssignments.length + overdueAssignments.length,
    urgentExamCount: upcomingExams.length,
  };
}

export function openExternalUrl(url) {
  if (!url) return;
  if (window.electronAPI?.openExternalPath) {
    window.electronAPI.openExternalPath(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
