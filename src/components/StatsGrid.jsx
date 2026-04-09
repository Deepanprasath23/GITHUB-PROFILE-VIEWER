import { FiStar, FiGitBranch, FiCode, FiTrendingUp } from 'react-icons/fi';
import { computeInsights, formatNumber } from '../api';

export default function StatsGrid({ repos }) {
  const { totalStars, totalForks, mostStarred, avgStars } = computeInsights(repos);
  
  return (
    <div className="stats-grid">
      <div className="glass-card stat-card blue">
        <div className="stat-icon">⭐</div>
        <div className="stat-value">{formatNumber(totalStars)}</div>
        <div className="stat-label">Total Stars</div>
      </div>
      
      <div className="glass-card stat-card purple">
        <div className="stat-icon">🍴</div>
        <div className="stat-value">{formatNumber(totalForks)}</div>
        <div className="stat-label">Total Forks</div>
      </div>
      
      <div className="glass-card stat-card green">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{avgStars}</div>
        <div className="stat-label">Avg Stars/Repo</div>
      </div>
      
      <div className="glass-card stat-card amber">
        <div className="stat-icon">🏆</div>
        <div className="stat-value" title={mostStarred?.name || '—'}>
          {mostStarred ? formatNumber(mostStarred.stargazers_count) : '0'}
        </div>
        <div className="stat-label">Top Repo Stars</div>
      </div>
    </div>
  );
}
