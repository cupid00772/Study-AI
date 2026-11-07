import { useState, useEffect } from 'react';
import LevelProgressBar from './components/LevelProgressBar';
import TaskBoard from './components/TaskBoard';
import CreateTaskModal from './components/CreateTaskModal';
import CourseSchedule from './components/CourseSchedule';
import DailyReminders from './components/DailyReminders';
import SettingsModal from './components/SettingsModal';
import { Plus, ListTodo, BookOpen, Settings } from 'lucide-react';

const INITIAL_TASKS = [
  { id: '1', title: '聯絡清大註冊組', desc: '寄送 Email 詢問轉校事宜', category: 'Main', difficulty: 'Medium', xp: 500, completed: false },
  { id: '2', title: '整理台聯大微積分考古題', desc: '完成 112~114 年度的錯題檢討', category: 'Challenge', difficulty: 'Hard', xp: 1200, completed: false },
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
  } catch {
  }
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
  const [activeTab, setActiveTab] = useState('missions');
  const [tasks, setTasks] = useState(getInitialTasks);
  
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
  const courseOptions = [...new Set(Object.values(weeklySchedule).flat())];
  const today = getTodayKey();

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

  useEffect(() => {
    try {
      localStorage.setItem('wt_tasks', JSON.stringify(tasks));
      localStorage.setItem('wt_level', level.toString());
      localStorage.setItem('wt_xp', xp.toString());
      localStorage.setItem('wt_weekly_schedule', JSON.stringify(weeklySchedule));
      localStorage.setItem('wt_reminders', JSON.stringify(reminders));
      localStorage.setItem('wt_reminder_completions', JSON.stringify(reminderCompletions));
    } catch {
    }
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

  const handleAddTask = (newTask) => {
    if (newTask.id) {
      // Editing existing task
      setTasks(prevTasks => prevTasks.map(t => t.id === newTask.id ? newTask : t));
    } else {
      // Adding new task
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

  return (
    <div className="app-container">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>COMMANDER DASHBOARD</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div className="tabs" style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`btn ${activeTab === 'missions' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setActiveTab('missions')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <ListTodo size={18} /> MISSIONS
            </button>
            <button 
              className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setActiveTab('courses')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <BookOpen size={18} /> COURSE SCHEDULE
            </button>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsSettingsOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px' }}
            title="System Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

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

      {activeTab === 'missions' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> NEW MISSION
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

      {activeTab === 'courses' && (
        <CourseSchedule />
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
