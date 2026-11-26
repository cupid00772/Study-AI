export default function ViewSkeleton({ variant = 'page' }) {
  if (variant === 'viewer') {
    return (
      <div className="skeleton-doc-wrap" role="status" aria-label="載入文件內容中">
        <div className="skeleton-bar is-title" />
        <div className="skeleton-bar is-sub" />
        <div className="skeleton-block" />
        <div className="skeleton-bar" />
        <div className="skeleton-bar is-med" />
        <div className="skeleton-bar is-short" />
        <div className="skeleton-block is-tall" />
      </div>
    );
  }

  return (
    <div className="skeleton-page-wrap" role="status" aria-label="頁面載入中">
      <div className="skeleton-card is-banner">
        <div className="skeleton-bar is-title" />
        <div className="skeleton-bar is-med" />
      </div>
      <div className="skeleton-grid">
        <div className="skeleton-card">
          <div className="skeleton-bar is-sub" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar is-med" />
          <div className="skeleton-bar is-short" />
        </div>
        <div className="skeleton-card">
          <div className="skeleton-bar is-sub" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar is-med" />
          <div className="skeleton-bar is-short" />
        </div>
      </div>
    </div>
  );
}

