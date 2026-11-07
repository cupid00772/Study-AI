import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Circle, GraduationCap, BookOpen } from 'lucide-react';
import defaultTracker from '../data/defaultTracker.json';

const INITIAL_ITEMS = [
  // 共同必修
  { id: "c1-1", type: "grid", cat: "共同必修", name: "國文", sem: "1-1", credits: 3, completed: true },
  { id: "c1-2", type: "grid", cat: "共同必修", name: "國文", sem: "1-1", credits: 2, completed: false },
  { id: "c2-1", type: "grid", cat: "共同必修", name: "外文", sem: "1-1", credits: 3, completed: true },
  { id: "c2-2", type: "grid", cat: "共同必修", name: "外文", sem: "1-2", credits: 3, completed: false },
  { id: "c3-1", type: "grid", cat: "共同必修", name: "體育課程", sem: "1-1", credits: 0, completed: true },
  { id: "c3-2", type: "grid", cat: "共同必修", name: "體育課程", sem: "1-2", credits: 0, completed: true },
  { id: "c3-3", type: "grid", cat: "共同必修", name: "體育課程", sem: "2-1", credits: 0, completed: false },
  { id: "c3-4", type: "grid", cat: "共同必修", name: "體育課程", sem: "2-2", credits: 0, completed: false },
  { id: "c4", type: "grid", cat: "共同必修", name: "服務學習課程", sem: "1-1", credits: 0, completed: false },

  // 院訂必修
  { id: "d1-1", type: "grid", cat: "院訂必修", name: "會計學 MT1031 / MT1032", sem: "1-1", credits: 3, completed: false },
  { id: "d1-2", type: "grid", cat: "院訂必修", name: "會計學 MT1031 / MT1032", sem: "1-2", credits: 3, completed: false },
  { id: "d2-1", type: "grid", cat: "院訂必修", name: "企業概論 MT1021", sem: "1-1", credits: 3, completed: false },
  { id: "d3-1", type: "grid", cat: "院訂必修", name: "統計學 MT2041 / MT2042", sem: "2-1", credits: 3, completed: true },
  { id: "d3-2", type: "grid", cat: "院訂必修", name: "統計學 MT2041 / MT2042", sem: "2-2", credits: 3, completed: false },
  { id: "d4-1", type: "grid", cat: "院訂必修", name: "經濟學 MT1011 / MT1012", sem: "2-1", credits: 3, completed: false },
  { id: "d4-2", type: "grid", cat: "院訂必修", name: "經濟學 MT1011 / MT1012", sem: "2-2", credits: 3, completed: false },

  // 系訂必修
  { id: "m1-1", type: "grid", cat: "系訂必修", name: "微積分 MA1005", sem: "1-1", credits: 3, completed: true },
  { id: "m2-1", type: "grid", cat: "系訂必修", name: "計算機概論I IM1001", sem: "1-1", credits: 3, completed: false },
  { id: "m3-1", type: "grid", cat: "系訂必修", name: "程式設計 IM1023", sem: "1-2", credits: 3, completed: false },
  { id: "m4-1", type: "grid", cat: "系訂必修", name: "資訊管理導論 IM1018", sem: "1-2", credits: 3, completed: false },
  { id: "m5-1", type: "grid", cat: "系訂必修", name: "作業系統 IM2046", sem: "2-1", credits: 3, completed: false },
  { id: "m6-1", type: "grid", cat: "系訂必修", name: "資料與檔案結構 IM2011", sem: "2-1", credits: 3, completed: true },
  { id: "m7-1", type: "grid", cat: "系訂必修", name: "資料庫管理 IM2002", sem: "2-2", credits: 3, completed: true },
  { id: "m8-1", type: "grid", cat: "系訂必修", name: "企業資料通訊 IM3061", sem: "2-2", credits: 3, completed: true },
  { id: "m9-1", type: "grid", cat: "系訂必修", name: "行銷學 IM3059", sem: "3-1", credits: 3, completed: false },
  { id: "m10-1", type: "grid", cat: "系訂必修", name: "系統分析與設計 IM3069", sem: "3-1", credits: 3, completed: false },
  { id: "m11-1", type: "grid", cat: "系訂必修", name: "作業研究I IM3003", sem: "3-1", credits: 3, completed: false },
  { id: "m12-1", type: "grid", cat: "系訂必修", name: "組織行為 IM3070", sem: "3-1", credits: 3, completed: false },
  { id: "m13-1", type: "grid", cat: "系訂必修", name: "人工智慧與機器學習 IM3078", sem: "3-2", credits: 3, completed: false },
  { id: "m14-1", type: "grid", cat: "系訂必修", name: "演算法 IM2037", sem: "3-2", credits: 3, completed: false },
  { id: "m15-1", type: "grid", cat: "系訂必修", name: "電子商務 IM3031", sem: "3-2", credits: 3, completed: false },
  { id: "m16-1", type: "grid", cat: "系訂必修", name: "資訊系統發展專題 I/II", sem: "3-2", credits: 3, completed: false },
  { id: "m16-2", type: "grid", cat: "系訂必修", name: "資訊系統發展專題 I/II", sem: "4-1", credits: 3, completed: false },
  { id: "m17-1", type: "grid", cat: "系訂必修", name: "管理資訊系統 IM4048", sem: "4-2", credits: 3, completed: false },

  // 通識、必選修及其他
  { id: "o1", type: "other", cat: "通識課程 (14學分)", name: "AI人工智慧導論 GS3073", credits: 3, completed: true },
  { id: "o2", type: "other", cat: "通識課程 (14學分)", name: "科學、科技、歷史 GS4508", credits: 2, completed: true },
  { id: "o3", type: "other", cat: "通識課程 (14學分)", name: "基因與遺傳 CC0202", credits: 2, completed: true },
  { id: "o4", type: "other", cat: "通識課程 (14學分)", name: "生命教育 GS3150", credits: 2, completed: true },
  { id: "o5", type: "other", cat: "通識課程 (14學分)", name: "未修通識學分 (需自行規劃)", credits: 5, completed: false },
  { id: "o6", type: "other", cat: "必選修及其他選修", name: "初階程式設計 IM1013 (必選)", credits: 3, completed: true },
  { id: "o7", type: "other", cat: "必選修及其他選修", name: "微積分(二) MA1006 (必選)", credits: 3, completed: true },
  { id: "o8", type: "other", cat: "必選修及其他選修", name: "網頁程式設計 IM3029 (必選)", credits: 3, completed: false },
  { id: "o9", type: "other", cat: "必選修及其他選修", name: "Python IM2038", credits: 3, completed: true },
  { id: "o10", type: "other", cat: "必選修及其他選修", name: "基礎數學 MA1015", credits: 3, completed: true },
];

const SEMESTERS = [
  { key: '1-1', label: '一上' }, { key: '1-2', label: '一下' },
  { key: '2-1', label: '二上' }, { key: '2-2', label: '二下' },
  { key: '3-1', label: '三上' }, { key: '3-2', label: '三下' },
  { key: '4-1', label: '四上' }, { key: '4-2', label: '四下' }
];

export default function CourseSchedule({ currentCourses = [] }) {
  const displayCourses = currentCourses && currentCourses.length > 0 ? currentCourses : (defaultTracker.courses || []);
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_courses_v2');
      const parsed = saved ? JSON.parse(saved) : INITIAL_ITEMS;
      return Array.isArray(parsed) ? parsed : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'curriculum'

  useEffect(() => {
    localStorage.setItem('wt_courses_v2', JSON.stringify(courses));
  }, [courses]);

  const toggleCourse = (id) => {
    setCourses(previousCourses => previousCourses.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const { completedTotal } = useMemo(() => {
    let completedTotal = 0;
    courses.forEach(c => {
      if (c.completed) {
        completedTotal += c.credits;
      }
    });
    return { completedTotal };
  }, [courses]);

  const gridItems = courses.filter(i => i.type === 'grid');
  const cats = ["共同必修", "院訂必修", "系訂必修"];

  const thStyle = {
    padding: '12px 10px',
    borderBottom: '1px solid var(--border-color)',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-main)',
    whiteSpace: 'nowrap',
    fontSize: '0.88rem'
  };

  const tdStyle = {
    padding: '10px 10px',
    borderBottom: '1px solid var(--border-subtle)',
    borderRight: '1px solid var(--border-subtle)',
    verticalAlign: 'middle',
    fontSize: '0.86rem'
  };

  return (
    <div className="assignments-container">
      {/* Tab Switch */}
      <div className="filter-bar">
        <div className="nav-pills">
          <button
            className={`nav-pill-btn ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            <BookOpen size={16} /> 本學期修課總覽
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
            onClick={() => setActiveTab('curriculum')}
          >
            <GraduationCap size={16} /> 畢業學分檢核表 (128學分)
          </button>
        </div>

        {/* Credit Progress Chip */}
        <div className="gemini-card" style={{ padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>畢業學分進度：</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', background: 'var(--gemini-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {completedTotal} / 128 學分
          </div>
          <div style={{ width: '120px', height: '8px', background: 'var(--bg-input)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (completedTotal / 128) * 100)}%`, height: '100%', background: 'var(--gemini-gradient)', borderRadius: '9999px' }} />
          </div>
        </div>
      </div>

      {/* Tab 1: Current Semester Courses */}
      {activeTab === 'current' && (
        <div className="vault-grid">
          {displayCourses.map(c => (
            <div key={c.id} className="gemini-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge-chip badge-blue">{c.code}</span>
                  <span className="badge-chip badge-purple">{c.category} • {c.credits} 學分</span>
                </div>

                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.2rem', fontWeight: 800 }}>{c.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--gemini-blue)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  📍 {c.location} | ⏰ {c.schedule}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {c.description}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>教授：{c.instructor}</span>
                <span className="badge-chip badge-green">修習中</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Curriculum Grid */}
      {activeTab === 'curriculum' && (
        <div className="gemini-card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '940px' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, borderRight: '1px solid var(--border-color)', width: '110px' }}>類別</th>
                <th style={{ ...thStyle, borderRight: '1px solid var(--border-color)', minWidth: '180px', textAlign: 'left' }}>課名及課號</th>
                {SEMESTERS.map(sem => (
                  <th key={sem.key} style={{ ...thStyle, borderRight: '1px solid var(--border-color)', width: '80px' }}>{sem.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => {
                const catItems = gridItems.filter(i => i.cat === cat);
                const uniqueNames = [...new Set(catItems.map(i => i.name))];
                
                return uniqueNames.map((name, index) => (
                  <tr key={`${cat}-${name}`} style={{ background: index % 2 === 0 ? 'var(--bg-panel)' : 'var(--bg-app)' }}>
                    {index === 0 && (
                      <td rowSpan={uniqueNames.length} style={{ ...tdStyle, fontWeight: '700', textAlign: 'center', background: 'var(--bg-input)' }}>
                        {cat}
                      </td>
                    )}
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{name}</td>
                    {SEMESTERS.map(sem => {
                      const cellItems = catItems.filter(i => i.name === name && i.sem === sem.key);
                      return (
                        <td key={sem.key} style={{ ...tdStyle, textAlign: 'center' }}>
                          {cellItems.map(item => (
                            <div 
                              key={item.id} 
                              onClick={() => toggleCourse(item.id)}
                              style={{ 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '5px',
                                color: item.completed ? '#059669' : 'var(--text-muted)',
                                background: item.completed ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-pill)',
                                border: `1px solid ${item.completed ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
                                margin: '2px 0',
                                fontWeight: item.completed ? '700' : 'normal',
                                transition: 'all 0.2s',
                                fontSize: '0.8rem'
                              }}
                            >
                              {item.completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                              <span>{item.credits} 學分</span>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
