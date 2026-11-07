import { useState, useEffect, useCallback } from 'react';
import LevelProgressBar from './components/LevelProgressBar';
import TaskBoard from './components/TaskBoard';
import CreateTaskModal from './components/CreateTaskModal';
import CourseSchedule from './components/CourseSchedule';
import DailyReminders from './components/DailyReminders';
import SettingsModal from './components/SettingsModal';
import AssignmentsBoard from './components/AssignmentsBoard';
import ExamsDashboard from './components/ExamsDashboard';
import ArtifactVault from './components/ArtifactVault';
import ArtifactViewerModal from './components/ArtifactViewerModal';
import StickyNotesBoard from './components/StickyNotesBoard';
import defaultTracker from './data/defaultTracker.json';
import { 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  FolderGit2, 
  ListTodo, 
  Settings, 
  Sun, 
  Moon, 
  Plus,
  Move,
  Pin,
  Minus,
  X,
  StickyNote
} from 'lucide-react';

const INITIAL_TASKS = [
  { id: '1', title: '聯絡清大註冊組', desc: '寄送 Email 詢問轉校事宜', category: 'Main', difficulty: 'Medium', xp: 500, completed: false },
  { id: '2', title: '整理台聯大微積分考古題', desc: '完成 113~115 年度的錯題檢討', category: 'Challenge', difficulty: 'Hard', xp: 1200, completed: false },
  { id: '3', title: '每日單字複習', desc: '複習 50 個英文單字', category: 'Daily', difficulty: 'Easy', xp: 100, completed: false },
  { id: '4', title: '計算機概論 作業-1', desc: '完成第一章習題', category: 'Main', difficulty: 'Medium', xp: 500, completed: false, relatedCourse: '計算機概論' },
  { id: '5', title: '計算機概論 作業-2', desc: '實作基礎排序演算法', category: 'Main', difficulty: 'Medium', xp: 600, completed: false, relatedCourse: '計算機概論' }
];

const DEFAULT_WEEKLY_SCHEDULE = {
  'Monday': ['計算機概論', '微積分'],
  'Tuesday': ['會計學', '英文'],
  'Wednesday': ['計算機概論', '程式設計'],
  'Thursday': ['微積分', '體育'],
  'Friday': ['資料結構'],
  'Saturday': [],
  'Sunday': []
};

const DEFAULT_REMINDERS = [
  '吃感冒藥 (早/中/晚)',
  '記得帶水壺'
];

const TODAY_KEY = 'wt_last_refresh_date';

function getTodayKey() {
  return new Date().toDateString();
}

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialTasks() {
  const storedTasks = readStorage('wt_tasks', INITIAL_TASKS);
  const today = getTodayKey();

  if (localStorage.getItem(TODAY_KEY) === today) {
    return Array.isArray(storedTasks) ? storedTasks : INITIAL_TASKS;
  }

  try {
    localStorage.setItem(TODAY_KEY, today);
  } catch {}
  
  return (Array.isArray(storedTasks) ? storedTasks : INITIAL_TASKS).map(task => (
    task.category === 'Daily' ? { ...task, completed: false } : task
  ));
}

function addExperience(progress, reward) {
  let nextXp = progress.xp + reward;
  let nextLevel = progress.level;

  while (nextXp >= nextLevel * 1000) {
    nextXp -= nextLevel * 1000;
    nextLevel += 1;
  }

  return { level: nextLevel, xp: nextXp };
}

function App() {
  // Navigation Tabs: 'courses' | 'assignments' | 'exams' | 'vault' | 'missions'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('wt_compact_mode') === 'true' ? 'notes' : 'courses';
  });
  const [tasks, setTasks] = useState(getInitialTasks);
  
  // Theme state: 'light' by default per Gemini style overhaul
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wt_theme') || 'light';
  });

  // Academic Tracker Data initialized with bundled default so it's NEVER empty
  const [trackerData, setTrackerData] = useState(defaultTracker);
  
  // Artifact Modal Viewer state
  const [selectedFileForViewer, setSelectedFileForViewer] = useState(null);

  // Desktop Sticky Note Window States
  const [isPinned, setIsPinned] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(() => {
    return localStorage.getItem('wt_compact_mode') === 'true';
  });

  useEffect(() => {
    if (window.electronAPI?.isWindowPinned) {
      window.electronAPI.isWindowPinned().then(pinned => setIsPinned(!!pinned));
    }
  }, []);

  const handleTogglePin = async () => {
    if (window.electronAPI?.togglePinWindow) {
      const pinned = await window.electronAPI.togglePinWindow();
      setIsPinned(pinned);
    }
  };

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow?.();
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow?.();
  };

  const toggleCompactMode = () => {
    setIsCompactMode(prev => {
      const next = !prev;
      try { localStorage.setItem('wt_compact_mode', next.toString()); } catch {}
      if (next) {
        setActiveTab('notes');
      }
      return next;
    });
  };

  const [weeklySchedule, setWeeklySchedule] = useState(() => {
    const storedSchedule = readStorage('wt_weekly_schedule', DEFAULT_WEEKLY_SCHEDULE);
    return storedSchedule && typeof storedSchedule === 'object' && !Array.isArray(storedSchedule)
      ? storedSchedule
      : DEFAULT_WEEKLY_SCHEDULE;
  });

  const [reminders, setReminders] = useState(() => {
    const storedReminders = readStorage('wt_reminders', DEFAULT_REMINDERS);
    return Array.isArray(storedReminders) ? storedReminders : DEFAULT_REMINDERS;
  });

  const [reminderCompletions, setReminderCompletions] = useState(() => {
    const storedCompletions = readStorage('wt_reminder_completions', {});
    return storedCompletions && typeof storedCompletions === 'object' && !Array.isArray(storedCompletions)
      ? storedCompletions
      : {};
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [progress, setProgress] = useState(() => {
    const level = Number.parseInt(localStorage.getItem('wt_level'), 10);
    const xp = Number.parseInt(localStorage.getItem('wt_xp'), 10);
    return {
      level: Number.isInteger(level) && level > 0 ? level : 1,
      xp: Number.isInteger(xp) && xp >= 0 ? xp : 0
    };
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { level, xp } = progress;
  const xpNeeded = level * 1000;
  const courseOptions = [...new Set([
    ...(trackerData?.courses?.map(c => c.name) || []),
    ...Object.values(weeklySchedule).flat()
  ])];
  const today = getTodayKey();

  // Apply Theme Attribute to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('wt_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Load tracker data on mount and setup live listener
  useEffect(() => {
    async function loadTracker() {
      if (window.electronAPI?.getTrackerData) {
        const data = await window.electronAPI.getTrackerData();
        if (data) {
          setTrackerData(data);
        }
      } else {
        // Fallback in web dev preview
        try {
          const res = await fetch('/academic_tracker.json');
          if (res.ok) {
            const data = await res.json();
            setTrackerData(data);
          }
        } catch {}
      }
    }

    loadTracker();

    if (window.electronAPI?.onTrackerUpdated) {
      const unsubscribe = window.electronAPI.onTrackerUpdated((updatedData) => {
        setTrackerData(updatedData);
      });
      return unsubscribe;
    }
  }, []);

  // Check deadlines & send desktop notifications
  useEffect(() => {
    if (!trackerData?.assignments || !window.electronAPI?.sendNotification) return;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const urgentHw = trackerData.assignments.find(hw => {
      if (hw.status === 'completed' || !hw.dueDate) return false;
      const due = new Date(hw.dueDate);
      const diffDays = Math.ceil((due - todayDate) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    });

    if (urgentHw) {
      const notifiedKey = `notified_${todayDate.toISOString().slice(0, 10)}_${urgentHw.id}`;
      if (!sessionStorage.getItem(notifiedKey)) {
        window.electronAPI.sendNotification({
          title: `⚠️ 作業截止提醒：${urgentHw.course}`,
          body: `「${urgentHw.title}」即將於 ${urgentHw.dueDate} 截止，請把握時間！`
        });
        sessionStorage.setItem(notifiedKey, 'true');
      }
    }
  }, [trackerData]);

  // Daily task auto-refresh
  useEffect(() => {
    const refreshDailyTasks = () => {
      const today = getTodayKey();
      if (localStorage.getItem(TODAY_KEY) === today) return;

      setTasks(prevTasks => prevTasks.map(t => {
        if (t.category === 'Daily') {
          return { ...t, completed: false };
        }
        return t;
      }));
      localStorage.setItem(TODAY_KEY, today);
    };

    const refreshTimer = window.setInterval(refreshDailyTasks, 60 * 1000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wt_tasks', JSON.stringify(tasks));
      localStorage.setItem('wt_level', level.toString());
      localStorage.setItem('wt_xp', xp.toString());
      localStorage.setItem('wt_weekly_schedule', JSON.stringify(weeklySchedule));
      localStorage.setItem('wt_reminders', JSON.stringify(reminders));
      localStorage.setItem('wt_reminder_completions', JSON.stringify(reminderCompletions));
    } catch {}
  }, [tasks, level, xp, weeklySchedule, reminders, reminderCompletions]);

  const handleCompleteTask = (taskId) => {
    const task = tasks.find(currentTask => currentTask.id === taskId);
    if (!task || task.completed) return;

    const reward = Number(task.xp);
    if (!Number.isFinite(reward) || reward < 0) return;

    setTasks(prevTasks => prevTasks.map(currentTask => (
      currentTask.id === taskId ? { ...currentTask, completed: true } : currentTask
    )));
    setProgress(prevProgress => addExperience(prevProgress, reward));
  };

  const handleCompleteAssignment = async (assignmentId) => {
    if (!trackerData?.assignments) return;

    const targetHw = trackerData.assignments.find(a => a.id === assignmentId);
    if (!targetHw || targetHw.status === 'completed') return;

    const rewardXp = Number(targetHw.xp) || 500;
    const updatedAssignments = trackerData.assignments.map(a => 
      a.id === assignmentId ? { ...a, status: 'completed' } : a
    );

    const updatedData = { ...trackerData, assignments: updatedAssignments };
    setTrackerData(updatedData);

    // Reward XP
    setProgress(prev => addExperience(prev, rewardXp));

    // Save back to academic_tracker.json via Electron
    if (window.electronAPI?.saveTrackerData) {
      await window.electronAPI.saveTrackerData(updatedData);
    }
  };

  const handleAddTask = (newTask) => {
    if (newTask.id) {
      setTasks(prevTasks => prevTasks.map(t => t.id === newTask.id ? newTask : t));
    } else {
      const taskId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      setTasks(prevTasks => [...prevTasks, { ...newTask, id: taskId, completed: false }]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleCategoryChange = (taskId, newCategory) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, category: newCategory } : t));
  };

  const toggleReminder = (reminder) => {
    const reminderKey = `${today}:${reminder}`;
    setReminderCompletions(prevCompletions => ({
      ...prevCompletions,
      [reminderKey]: !prevCompletions[reminderKey]
    }));
  };

  const handlePreviewFile = useCallback((fileObj) => {
    setSelectedFileForViewer(fileObj);
  }, []);

  return (
    <div className={`app-container ${isCompactMode ? 'compact-mode' : ''}`}>
      {/* Desktop Window Drag Bar & Window Controls (便條紙視窗拖曳與固定) */}
      <div className="window-drag-bar">
        <div className="drag-handle-pill" title="按住拖動便條紙位置">
          <Move size={14} />
          <span>按住拖動位置</span>
        </div>

        <div className="window-no-drag" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 置頂按鈕 */}
          <button
            className={`window-ctrl-btn ${isPinned ? 'active-pin' : ''}`}
            onClick={handleTogglePin}
            title={isPinned ? '已置頂桌面（點擊解除）' : '釘選至桌面最上層 (Always on top)'}
          >
            <Pin size={14} />
          </button>

          {/* 便條紙精簡模式 / 完整儀表板模式 切換 */}
          <button
            className={`window-ctrl-btn ${isCompactMode ? 'active-pin' : ''}`}
            onClick={toggleCompactMode}
            title={isCompactMode ? '展開完整儀表板' : '切換為精簡便條紙模式'}
          >
            <StickyNote size={14} />
          </button>

          {/* 最小化 */}
          <button
            className="window-ctrl-btn"
            onClick={handleMinimize}
            title="最小化"
          >
            <Minus size={14} />
          </button>

          {/* 關閉 */}
          <button
            className="window-ctrl-btn btn-close"
            onClick={handleClose}
            title="關閉"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Gemini Header */}
      <div className="gemini-header">
        <div className="brand-wrapper">
          <div className="gemini-sparkle-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="brand-title">TASK COMMANDER</h1>
            <div className="brand-subtitle">中央大學學業任務指揮中心 • Powered by Gemini</div>
          </div>
        </div>

        {/* Center Pill Navigation */}
        <div className="nav-pills">
          <button 
            className={`nav-pill-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <StickyNote size={16} /> 桌面便條
          </button>
          <button 
            className={`nav-pill-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={16} /> 科目總覽
          </button>
          <button 
            className={`nav-pill-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <CheckSquare size={16} /> 作業管理
          </button>
          <button 
            className={`nav-pill-btn ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            <Calendar size={16} /> 考試日程
          </button>
          <button 
            className={`nav-pill-btn ${activeTab === 'vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            <FolderGit2 size={16} /> AI 成果庫
          </button>
          <button 
            className={`nav-pill-btn ${activeTab === 'missions' ? 'active' : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            <ListTodo size={16} /> 每日任務
          </button>
        </div>

        {/* Right Action Icons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-icon-circle"
            onClick={toggleTheme}
            title={`切換為${theme === 'light' ? '深色' : '淺色'}主題`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button 
            className="btn btn-secondary btn-icon-circle" 
            onClick={() => setIsSettingsOpen(true)}
            title="系統設定"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Level & XP Progress Bar & Reminders (Hidden in compact mode for clean desktop sticky look) */}
      {!isCompactMode && (
        <>
          <LevelProgressBar level={level} xp={xp} maxXp={xpNeeded} />
          <DailyReminders 
            weeklySchedule={weeklySchedule} 
            reminders={reminders} 
            reminderCompletions={reminderCompletions}
            today={today}
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onToggleReminder={toggleReminder}
          />
        </>
      )}

      {/* Main Tab Content */}
      {activeTab === 'notes' && (
        <StickyNotesBoard />
      )}

      {activeTab === 'courses' && (
        <CourseSchedule currentCourses={trackerData?.courses || []} />
      )}

      {activeTab === 'assignments' && (
        <AssignmentsBoard 
          assignments={trackerData?.assignments || []} 
          onCompleteAssignment={handleCompleteAssignment}
          onPreviewFile={handlePreviewFile}
        />
      )}

      {activeTab === 'exams' && (
        <ExamsDashboard 
          exams={trackerData?.exams || []} 
          calendarEvents={trackerData?.calendar_events || []}
          onPreviewFile={handlePreviewFile}
        />
      )}

      {activeTab === 'vault' && (
        <ArtifactVault 
          deliverables={trackerData?.deliverables || []} 
          onPreviewFile={handlePreviewFile}
        />
      )}

      {activeTab === 'missions' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> 新增任務
            </button>
          </div>
          <TaskBoard 
            tasks={tasks.filter(t => !t.completed)} 
            onComplete={handleCompleteTask} 
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onCategoryChange={handleCategoryChange}
          />
        </>
      )}

      {/* Modals */}
      {selectedFileForViewer && (
        <ArtifactViewerModal 
          file={selectedFileForViewer} 
          onClose={() => setSelectedFileForViewer(null)} 
        />
      )}

      {isModalOpen && (
        <CreateTaskModal 
          onClose={closeEditModal} 
          onAdd={handleAddTask} 
          initialTask={editingTask}
          courseOptions={courseOptions}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          weeklySchedule={weeklySchedule}
          setWeeklySchedule={setWeeklySchedule}
          reminders={reminders}
          setReminders={setReminders}
        />
      )}
    </div>
  );
}

export default App;
