import { useMemo } from 'react';
import { generateHeatmapData } from '../api';

export default function ContributionHeatmap({ events }) {
  const heatmapData = useMemo(() => generateHeatmapData(events), [events]);
  
  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <span className="icon">📅</span> Contribution Activity
        </h3>
      </div>
      
      <div className="heatmap-container">
        <div className="heatmap-grid">
          {heatmapData.map((week, wi) => (
            <div className="heatmap-week" key={wi}>
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`heatmap-day ${day.isFuture ? '' : `level-${day.level}`}`}
                  title={`${day.date}: ${day.count} event${day.count !== 1 ? 's' : ''}`}
                  style={day.isFuture ? { visibility: 'hidden' } : undefined}
                />
              ))}
            </div>
          ))}
        </div>
        
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-day" />
          <div className="heatmap-day level-1" />
          <div className="heatmap-day level-2" />
          <div className="heatmap-day level-3" />
          <div className="heatmap-day level-4" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
