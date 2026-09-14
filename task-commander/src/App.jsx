import { useState, useEffect } from 'react';
import LevelProgressBar from './components/LevelProgressBar';
import TaskBoard from './components/TaskBoard';
import CreateTaskModal from './components/CreateTaskModal';
import { Plus } from 'lucide-react';

const INITIAL_TASKS = [
  { id: '1', title: '聯絡清大註冊組', desc: '寄送 Email 詢問轉校事宜', category: 'Main', difficulty: 'Medium', xp: 500, completed: false },
  { id: '2', title: '整理台聯大微積分考古題', desc: '完成 112~114 年度的錯題檢討', category: 'Challenge', difficulty: 'Hard', xp: 1200, completed: false },
  { id: '3', title: '每日單字複習', desc: '複習 50 個英文單字', category: 'Daily', difficulty: 'Easy', xp: 100, completed: false }
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wt_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  
  const [level, setLevel] = useState(() => {
    return parseInt(localStorage.getItem('wt_level')) || 1;
  });
  
  const [xp, setXp] = useState(() => {
    return parseInt(localStorage.getItem('wt_xp')) || 0;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const xpNeeded = level * 1000;

  useEffect(() => {
    localStorage.setItem('wt_tasks', JSON.stringify(tasks));
    localStorage.setItem('wt_level', level.toString());
    localStorage.setItem('wt_xp', xp.toString());
  }, [tasks, level, xp]);

  const handleCompleteTask = (taskId, taskXp) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
    
    let newXp = xp + taskXp;
    let newLevel = level;
    
    while (newXp >= newLevel * 1000) {
      newXp -= newLevel * 1000;
      newLevel += 1;
    }
    
    setXp(newXp);
    setLevel(newLevel);
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString(), completed: false }]);
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      <div className="header-actions">
        <h1>COMMANDER DASHBOARD</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ display: 'inline', verticalAlign: 'text-bottom' }}/> NEW MISSION
        </button>
      </div>

      <LevelProgressBar level={level} xp={xp} maxXp={xpNeeded} />
      
      <TaskBoard tasks={tasks.filter(t => !t.completed)} onComplete={handleCompleteTask} />
      
      {isModalOpen && (
        <CreateTaskModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddTask} 
        />
      )}
    </div>
  );
}

export default App;
