import { useState, useMemo } from 'react';
import { Search, Sparkles, FileText, Code, BookOpen, Layers } from 'lucide-react';
import defaultTracker from '../data/defaultTracker.json';

const TYPE_CONFIG = {
  recitation: { label: '互動背誦卡', color: 'badge-purple', icon: Code },
  notes: { label: '教材筆記', color: 'badge-blue', icon: BookOpen },
  exam: { label: '考卷詳解', color: 'badge-pink', icon: FileText },
  report: { label: '實習報告', color: 'badge-green', icon: Layers }
};

export default function ArtifactVault({ deliverables = [], onPreviewFile }) {
  const displayDeliverables = useMemo(() => {
    return deliverables && deliverables.length > 0 ? deliverables : (defaultTracker.deliverables || []);
  }, [deliverables]);
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const courseList = useMemo(() => {
    const set = new Set();
    displayDeliverables.forEach(d => {
      if (d.course) set.add(d.course);
    });
    return ['ALL', ...Array.from(set)];
  }, [displayDeliverables]);

  const filteredDeliverables = useMemo(() => {
    return displayDeliverables.filter(item => {
      const matchCourse = selectedCourse === 'ALL' || item.course === selectedCourse;
      const matchType = selectedType === 'ALL' || item.type === selectedType;
      const matchSearch = !searchQuery.trim() || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCourse && matchType && matchSearch;
    });
  }, [displayDeliverables, selectedCourse, selectedType, searchQuery]);

  return (
    <div className="assignments-container">
      {/* Top Filter and Search Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="nav-pills" style={{ padding: '3px' }}>
            {courseList.map(c => (
              <button
                key={c}
                className={`nav-pill-btn ${selectedCourse === c ? 'active' : ''}`}
                onClick={() => setSelectedCourse(c)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
              >
                {c === 'ALL' ? '全部科目' : c}
              </button>
            ))}
          </div>

          <div className="nav-pills" style={{ padding: '3px' }}>
            <button 
              className={`nav-pill-btn ${selectedType === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedType('ALL')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              全部類型
            </button>
            {Object.entries(TYPE_CONFIG).map(([k, cfg]) => (
              <button
                key={k}
                className={`nav-pill-btn ${selectedType === k ? 'active' : ''}`}
                onClick={() => setSelectedType(k)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="搜尋成果、教材或標籤..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Deliverable Grid */}
      {filteredDeliverables.length === 0 ? (
        <div className="gemini-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Sparkles size={40} style={{ color: 'var(--gemini-purple)', marginBottom: '1rem' }} />
          <h3>尚無符合條件的成果</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            讓 Antigravity 在對話中為您撰寫教材、報告或題目，完成後將自動展示於此成果庫中！
          </p>
        </div>
      ) : (
        <div className="vault-grid">
          {filteredDeliverables.map(item => {
            const typeInfo = TYPE_CONFIG[item.type] || { label: item.type, color: 'badge-blue', icon: FileText };
            const IconComponent = typeInfo.icon;

            return (
              <div 
                key={item.id} 
                className="vault-card"
                onClick={() => onPreviewFile(item)}
              >
                <div>
                  <div className="vault-card-header">
                    <div className="vault-icon-badge">
                      <IconComponent size={20} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="badge-chip badge-blue">{item.course}</span>
                      <span className={`badge-chip ${typeInfo.color}`}>{typeInfo.label}</span>
                    </div>
                  </div>

                  <h3 className="vault-title">{item.title}</h3>
                  <div className="vault-summary">{item.summary}</div>
                </div>

                <div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="vault-tags" style={{ marginBottom: '0.85rem' }}>
                      {item.tags.map((tag, i) => (
                        <span key={i} style={{ 
                          fontSize: '0.72rem', 
                          color: 'var(--text-muted)', 
                          background: 'var(--bg-input)', 
                          padding: '2px 8px', 
                          borderRadius: '6px' 
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    <span>更新：{item.updatedAt || '最近'}</span>
                    <button 
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewFile(item);
                      }}
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                    >
                      <Sparkles size={13} /> 開啟成果
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
