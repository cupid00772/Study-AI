import React, { useState } from 'react';
import { Radio, Calendar, Bell, ExternalLink, Flame, CheckSquare, Briefcase, RefreshCw } from 'lucide-react';
import defaultTracker from '../data/defaultTracker.json';

export default function EEClassWidget({ trackerData = {}, onTriggerSync }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const dashboard = trackerData?.eeclass_dashboard || defaultTracker?.eeclass_dashboard || {
    recent_events: [],
    latest_announcements: []
  };

  const recentEvents = dashboard.recent_events || [];
  const latestAnnouncements = dashboard.latest_announcements || [];

  const handleSyncClick = async () => {
    setIsSyncing(true);
    if (onTriggerSync) {
      await onTriggerSync();
    }
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="gemini-card" style={{
      marginBottom: '1.75rem',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)'
    }}>
      {/* 頂部 Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.95rem' }}>
          <Radio size={18} style={{ color: 'var(--gemini-blue)', animation: 'pulse 2s infinite' }} />
          <span>中央大學 eeclass 實時看板 (圖一：最近事件 & 最新公告)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            最後更新：{trackerData?.last_updated ? new Date(trackerData.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '已同步'}
          </span>
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              cursor: isSyncing ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={12} className={isSyncing ? 'spin' : ''} />
            <span>{isSyncing ? '同步中...' : '重新整理'}</span>
          </button>
        </div>
      </div>

      {/* 雙欄主體 (還原 eeclass 原生排版) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        paddingTop: '0.25rem'
      }}>
        {/* 左欄：最近事件 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '0.6rem',
            paddingBottom: '0.4rem',
            borderBottom: '1px dashed var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>最近事件</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentEvents.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>目前無待辦近期事件</span>
            ) : (
              recentEvents.map(evt => (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    fontSize: '0.86rem'
                  }}
                  className="hover-card-subtle"
                >
                  <span style={{
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '42px'
                  }}>
                    {evt.date}
                  </span>
                  
                  {evt.type === 'quiz' ? (
                    <CheckSquare size={16} style={{ color: 'var(--gemini-purple)', flexShrink: 0 }} />
                  ) : (
                    <Briefcase size={16} style={{ color: 'var(--gemini-blue)', flexShrink: 0 }} />
                  )}

                  <a
                    href={evt.link || "https://ncueeclass.ncu.edu.tw"}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}
                    title={evt.title}
                  >
                    {evt.title}
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右欄：最新公告 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '0.6rem',
            paddingBottom: '0.4rem',
            borderBottom: '1px dashed var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>最新公告</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {latestAnnouncements.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>目前無最新公告</span>
            ) : (
              latestAnnouncements.map(ann => (
                <div
                  key={ann.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    fontSize: '0.86rem'
                  }}
                  className="hover-card-subtle"
                >
                  <span style={{
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '42px'
                  }}>
                    {ann.date}
                  </span>

                  <a
                    href={ann.link || "https://ncueeclass.ncu.edu.tw"}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}
                    title={ann.title}
                  >
                    {ann.title}
                  </a>

                  {ann.isHot && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      background: 'linear-gradient(135deg, #ef4444, #f97316)',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      HOT
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
