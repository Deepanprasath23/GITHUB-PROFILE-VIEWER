export default function LoadingSkeleton() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Profile skeleton */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div className="skeleton skeleton-circle" style={{ width: 140, height: 140, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-text" style={{ width: '40%', height: 28, marginBottom: 10 }} />
            <div className="skeleton skeleton-text" style={{ width: '20%', height: 18, marginBottom: 16 }} />
            <div className="skeleton skeleton-text medium" style={{ marginBottom: 6 }} />
            <div className="skeleton skeleton-text short" style={{ marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 16 }}>
              <div className="skeleton" style={{ width: 100, height: 60, borderRadius: 12 }} />
              <div className="skeleton" style={{ width: 100, height: 60, borderRadius: 12 }} />
              <div className="skeleton" style={{ width: 100, height: 60, borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />
        ))}
      </div>
      
      {/* Charts skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 340, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 340, borderRadius: 16 }} />
      </div>
      
      {/* Repos skeleton */}
      <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
    </div>
  );
}
