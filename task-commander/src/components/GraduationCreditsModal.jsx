import { useState, useEffect, useMemo, useRef } from 'react';
import { CheckCircle2, Circle, GraduationCap, X } from 'lucide-react';
import { pushCloudDoc, SYNC_KEYS } from '../services/cloudSyncService';

const INITIAL_ITEMS = [
  // 共同必修
  { id: 'c1-1', type: 'grid', cat: '共同必修', name: '國文', sem: '1-1', credits: 3, completed: true },
  { id: 'c1-2', type: 'grid', cat: '共同必修', name: '國文', sem: '1-1', credits: 2, completed: false },
  { id: 'c2-1', type: 'grid', cat: '共同必修', name: '外文', sem: '1-1', credits: 3, completed: true },
  { id: 'c2-2', type: 'grid', cat: '共同必修', name: '外文', sem: '1-2', credits: 3, completed: false },
  { id: 'c3-1', type: 'grid', cat: '共同必修', name: '體育課程', sem: '1-1', credits: 0, completed: true },
  { id: 'c3-2', type: 'grid', cat: '共同必修', name: '體育課程', sem: '1-2', credits: 0, completed: true },
  { id: 'c3-3', type: 'grid', cat: '共同必修', name: '體育課程', sem: '2-1', credits: 0, completed: false },
  { id: 'c3-4', type: 'grid', cat: '共同必修', name: '體育課程', sem: '2-2', credits: 0, completed: false },
  { id: 'c4', type: 'grid', cat: '共同必修', name: '服務學習課程', sem: '1-1', credits: 0, completed: false },

  // 院訂必修
  { id: 'd1-1', type: 'grid', cat: '院訂必修', name: '會計學 MT1031 / MT1032', sem: '1-1', credits: 3, completed: false },
  { id: 'd1-2', type: 'grid', cat: '院訂必修', name: '會計學 MT1031 / MT1032', sem: '1-2', credits: 3, completed: false },
  { id: 'd2-1', type: 'grid', cat: '院訂必修', name: '企業概論 MT1021', sem: '1-1', credits: 3, completed: false },
  { id: 'd3-1', type: 'grid', cat: '院訂必修', name: '統計學 MT2041 / MT2042', sem: '2-1', credits: 3, completed: true },
  { id: 'd3-2', type: 'grid', cat: '院訂必修', name: '統計學 MT2041 / MT2042', sem: '2-2', credits: 3, completed: false },
  { id: 'd4-1', type: 'grid', cat: '院訂必修', name: '經濟學 MT1011 / MT1012', sem: '2-1', credits: 3, completed: false },
  { id: 'd4-2', type: 'grid', cat: '院訂必修', name: '經濟學 MT1011 / MT1012', sem: '2-2', credits: 3, completed: false },

  // 系訂必修
  { id: 'm1-1', type: 'grid', cat: '系訂必修', name: '微積分 MA1005', sem: '1-1', credits: 3, completed: true },
  { id: 'm2-1', type: 'grid', cat: '系訂必修', name: '計算機概論I IM1001', sem: '1-1', credits: 3, completed: false },
  { id: 'm3-1', type: 'grid', cat: '系訂必修', name: '程式設計 IM1023', sem: '1-2', credits: 3, completed: false },
  { id: 'm4-1', type: 'grid', cat: '系訂必修', name: '資訊管理導論 IM1018', sem: '1-2', credits: 3, completed: false },
  { id: 'm5-1', type: 'grid', cat: '系訂必修', name: '作業系統 IM2046', sem: '2-1', credits: 3, completed: false },
  { id: 'm6-1', type: 'grid', cat: '系訂必修', name: '資料與檔案結構 IM2011', sem: '2-1', credits: 3, completed: true },
  { id: 'm7-1', type: 'grid', cat: '系訂必修', name: '資料庫管理 IM2002', sem: '2-2', credits: 3, completed: true },
  { id: 'm8-1', type: 'grid', cat: '系訂必修', name: '企業資料通訊 IM3061', sem: '2-2', credits: 3, completed: true },
  { id: 'm9-1', type: 'grid', cat: '系訂必修', name: '行銷學 IM3059', sem: '3-1', credits: 3, completed: false },
  { id: 'm10-1', type: 'grid', cat: '系訂必修', name: '系統分析與設計 IM3069', sem: '3-1', credits: 3, completed: false },
  { id: 'm11-1', type: 'grid', cat: '系訂必修', name: '作業研究I IM3003', sem: '3-1', credits: 3, completed: false },
  { id: 'm12-1', type: 'grid', cat: '系訂必修', name: '組織行為 IM3070', sem: '3-1', credits: 3, completed: false },
  { id: 'm13-1', type: 'grid', cat: '系訂必修', name: '人工智慧與機器學習 IM3078', sem: '3-2', credits: 3, completed: false },
  { id: 'm14-1', type: 'grid', cat: '系訂必修', name: '演算法 IM2037', sem: '3-2', credits: 3, completed: false },
  { id: 'm15-1', type: 'grid', cat: '系訂必修', name: '電子商務 IM3031', sem: '3-2', credits: 3, completed: false },
  { id: 'm16-1', type: 'grid', cat: '系訂必修', name: '資訊系統發展專題 I/II', sem: '3-2', credits: 3, completed: false },
  { id: 'm16-2', type: 'grid', cat: '系訂必修', name: '資訊系統發展專題 I/II', sem: '4-1', credits: 3, completed: false },
  { id: 'm17-1', type: 'grid', cat: '系訂必修', name: '管理資訊系統 IM4048', sem: '4-2', credits: 3, completed: false },

  // 通識、必選修及其他
  { id: 'o1', type: 'other', cat: '通識課程 (14學分)', name: 'AI人工智慧導論 GS3073', credits: 3, completed: true },
  { id: 'o2', type: 'other', cat: '通識課程 (14學分)', name: '通識地球物理 GS4110', credits: 2, completed: true },
  { id: 'o3', type: 'other', cat: '通識課程 (14學分)', name: '基因與遺傳 CC0202', credits: 2, completed: true },
  { id: 'o4', type: 'other', cat: '通識課程 (14學分)', name: '生命教育 GS3150', credits: 2, completed: true },
  { id: 'o5', type: 'other', cat: '通識課程 (14學分)', name: '未修通識學分 (需自行規劃)', credits: 5, completed: false },
  { id: 'o6', type: 'other', cat: '必選修及其他選修', name: '初階程式設計 IM1013 (必選)', credits: 3, completed: true },
  { id: 'o7', type: 'other', cat: '必選修及其他選修', name: '微積分(二) MA1006 (必選)', credits: 3, completed: true },
  { id: 'o8', type: 'other', cat: '必選修及其他選修', name: '網頁程式設計 IM3029 (必選)', credits: 3, completed: false },
  { id: 'o9', type: 'other', cat: '必選修及其他選修', name: 'Python IM2038', credits: 3, completed: true },
  { id: 'o10', type: 'other', cat: '必選修及其他選修', name: '基礎數學 MA1015', credits: 3, completed: true },
];

const SEMESTERS = [
  { key: '1-1', label: '一上' }, { key: '1-2', label: '一下' },
  { key: '2-1', label: '二上' }, { key: '2-2', label: '二下' },
  { key: '3-1', label: '三上' }, { key: '3-2', label: '三下' },
  { key: '4-1', label: '四上' }, { key: '4-2', label: '四下' },
];

export default function GraduationCreditsModal({ onClose, onRequireUnlock }) {
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('wt_courses_v2');
      const parsed = saved ? JSON.parse(saved) : INITIAL_ITEMS;
      return Array.isArray(parsed) ? parsed : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });
  const skipCloudPushRef = useRef(true);

  useEffect(() => {
    try {
      localStorage.setItem('wt_courses_v2', JSON.stringify(courses));
    } catch {}
    if (skipCloudPushRef.current) {
      skipCloudPushRef.current = false;
      return;
    }
    pushCloudDoc(SYNC_KEYS.GRADUATION_CREDITS, {
      items: courses,
      updatedAt: new Date().toISOString(),
    }).then((res) => {
      if (res?.authRequired) onRequireUnlock?.();
    });
  }, [courses, onRequireUnlock]);

  useEffect(() => {
    const onCloudUpdated = (e) => {
      if (Array.isArray(e.detail?.items)) {
        skipCloudPushRef.current = true;
        setCourses(e.detail.items);
      }
    };
    window.addEventListener('tc-cloud-credits-updated', onCloudUpdated);
    return () => window.removeEventListener('tc-cloud-credits-updated', onCloudUpdated);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleCourse = (id) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)));
  };

  const completedTotal = useMemo(
    () => courses.reduce((sum, c) => (c.completed ? sum + c.credits : sum), 0),
    [courses]
  );

  const gridItems = courses.filter((i) => i.type === 'grid');
  const otherItems = courses.filter((i) => i.type === 'other');
  const cats = ['共同必修', '院訂必修', '系訂必修'];
  const otherCats = [...new Set(otherItems.map((i) => i.cat))];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1080px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={22} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.15rem' }}>畢業學分檢核表（選課參考 · 128 學分）</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>點擊任一學分標籤即可切換修畢狀態並自動儲存</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>已修進度</span>
              <strong style={{ fontSize: '0.98rem', color: 'var(--accent-primary)' }}>{completedTotal} / 128 學分</strong>
              <div style={{ width: '90px', height: '6px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (completedTotal / 128) * 100)}%`, height: '100%', background: 'var(--accent-gradient)' }} />
              </div>
            </div>
            <button type="button" className="btn btn-secondary btn-icon-sm" onClick={onClose} aria-label="關閉">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Table + Other Credits */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
            <table className="curriculum-table">
              <thead>
                <tr>
                  <th style={{ width: '96px' }}>類別</th>
                  <th style={{ minWidth: '185px', textAlign: 'left' }}>課名及課號</th>
                  {SEMESTERS.map((sem) => (
                    <th key={sem.key} style={{ width: '78px' }}>{sem.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cats.map((cat) => {
                  const catItems = gridItems.filter((i) => i.cat === cat);
                  const uniqueNames = [...new Set(catItems.map((i) => i.name))];
                  return uniqueNames.map((name, idx) => (
                    <tr key={`${cat}-${name}`}>
                      {idx === 0 && (
                        <td rowSpan={uniqueNames.length} className="cat-cell">{cat}</td>
                      )}
                      <td style={{ fontWeight: 600 }}>{name}</td>
                      {SEMESTERS.map((sem) => {
                        const cellItems = catItems.filter((i) => i.name === name && i.sem === sem.key);
                        return (
                          <td key={sem.key} style={{ textAlign: 'center' }}>
                            {cellItems.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                className={`credit-toggle-pill ${item.completed ? 'done' : ''}`}
                                onClick={() => toggleCourse(item.id)}
                              >
                                {item.completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                                <span>{item.credits}</span>
                              </button>
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

          {/* 通識與選修 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {otherCats.map((cat) => (
              <div key={cat} className="bento-card" style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.65rem' }}>{cat}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {otherItems.filter((i) => i.cat === cat).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`credit-other-row ${item.completed ? 'done' : ''}`}
                      onClick={() => toggleCourse(item.id)}
                    >
                      {item.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      <span style={{ flex: 1, textAlign: 'left' }}>{item.name}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{item.credits} 學分</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
