import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

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

export default function CourseSchedule() {
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_courses_v2');
      const parsed = saved ? JSON.parse(saved) : INITIAL_ITEMS;
      return Array.isArray(parsed) ? parsed : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  useEffect(() => {
    localStorage.setItem('wt_courses_v2', JSON.stringify(courses));
  }, [courses]);

  const toggleCourse = (id) => {
    setCourses(previousCourses => previousCourses.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const {
    completedTotal,
  } = useMemo(() => {
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
    padding: '12px 8px',
    borderBottom: '2px solid var(--border-color)',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: 'var(--bg-panel-hover)',
    color: 'var(--text-main)',
    whiteSpace: 'nowrap'
  };

  const tdStyle = {
    padding: '10px 8px',
    borderBottom: '1px solid var(--border-color)',
    borderRight: '1px solid var(--border-color)',
    verticalAlign: 'middle',
  };

  return (
    <div className="course-schedule-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* 頂部進度統計 */}
      <div className="dashboard-stats" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div className="stat-card" style={{ flex: 1, background: 'var(--bg-panel)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.9rem' }}>總抵免/已修學分</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
            {completedTotal} / 128
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (completedTotal / 128) * 100)}%`, height: '100%', background: 'var(--accent-gold)', transition: 'width 0.3s' }}></div>
          </div>
        </div>
      </div>

      {/* 應修科目表 (網格版) */}
      <div style={{ background: 'var(--bg-panel)', borderRadius: '8px', border: '1px solid var(--border-color)', overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', minWidth: '900px' }}>
          <thead>
            <tr>
              <th style={{...thStyle, borderRight: '1px solid var(--border-color)'}}>類別</th>
              <th style={{...thStyle, borderRight: '1px solid var(--border-color)', minWidth: '160px'}}>課名及課號</th>
              {SEMESTERS.map(sem => (
                <th key={sem.key} style={{...thStyle, borderRight: '1px solid var(--border-color)'}}>{sem.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cats.map(cat => {
              const catItems = gridItems.filter(i => i.cat === cat);
              const uniqueNames = [...new Set(catItems.map(i => i.name))];
              
              return uniqueNames.map((name, index) => {
                return (
                  <tr key={`${cat}-${name}`} style={{ backgroundColor: 'var(--bg-dark)' }}>
                    {index === 0 && (
                      <td rowSpan={uniqueNames.length} style={{ ...tdStyle, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'var(--bg-panel)' }}>
                        {cat}
                      </td>
                    )}
                    <td style={{ ...tdStyle, backgroundColor: 'var(--bg-panel)' }}>{name}</td>
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
                                gap: '6px',
                                color: item.completed ? 'var(--success)' : 'var(--text-muted)',
                                background: item.completed ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: `1px solid ${item.completed ? 'var(--success)' : 'transparent'}`,
                                margin: '2px 0',
                                fontWeight: item.completed ? 'bold' : 'normal',
                                transition: 'all 0.2s'
                              }}
                              title="點擊切換狀態"
                            >
                              {item.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                              <span>{item.credits}</span>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                )
              })
            })}
          </tbody>
        </table>
      </div>

      {/* 通識與選修區塊 */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {["通識課程 (14學分)", "必選修及其他選修"].map(cat => (
          <div key={cat} style={{ flex: '1 1 300px', background: 'var(--bg-panel)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginTop: 0, marginBottom: '15px', color: 'var(--text-main)' }}>{cat}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {courses.filter(i => i.type === 'other' && i.cat === cat).map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleCourse(item.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    background: item.completed ? 'rgba(74, 222, 128, 0.1)' : 'var(--bg-dark)',
                    cursor: 'pointer',
                    border: `1px solid ${item.completed ? 'var(--success)' : 'var(--border-color)'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ color: item.completed ? 'var(--success)' : 'var(--text-muted)' }}>
                    {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: item.completed ? 'var(--success)' : 'var(--text-main)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                      {item.name}
                    </div>
                  </div>
                  <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>
                    {item.credits} 學分
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
