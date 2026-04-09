import { computeProfileScore } from '../api';

export default function ProfileScore({ profile, repos, events }) {
  const { score, badge, badgeClass, breakdown } = computeProfileScore(profile, repos, events);
  
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (score / 100) * circumference;
  
  // Determine ring color based on score
  let strokeColor;
  if (score >= 85) strokeColor = 'url(#legendGrad)';
  else if (score >= 65) strokeColor = 'url(#expertGrad)';
  else if (score >= 45) strokeColor = 'url(#advancedGrad)';
  else if (score >= 25) strokeColor = 'url(#intermediateGrad)';
  else strokeColor = 'url(#beginnerGrad)';
  
  return (
    <div className="glass-card score-section">
      <div className="section-header">
        <h3 className="section-title">
          <span className="icon">🏅</span> Profile Score
        </h3>
      </div>
      
      <div className="score-display">
        <div className="score-ring">
          <svg viewBox="0 0 120 120">
            <defs>
              <linearGradient id="beginnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="intermediateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="advancedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="expertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle className="track" cx="60" cy="60" r="50" />
            <circle 
              className="progress" 
              cx="60" cy="60" r="50"
              stroke={strokeColor}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="score-value">{score}</div>
        </div>
        
        <div className="score-details">
          <div className={`score-badge ${badgeClass}`}>{badge}</div>
          
          <div className="score-breakdown">
            <div className="score-breakdown-item">
              <span>Followers</span>
              <span>{breakdown.followers}/25</span>
            </div>
            <div className="score-breakdown-item">
              <span>Total Stars</span>
              <span>{breakdown.stars}/25</span>
            </div>
            <div className="score-breakdown-item">
              <span>Repositories</span>
              <span>{breakdown.repos}/20</span>
            </div>
            <div className="score-breakdown-item">
              <span>Activity</span>
              <span>{breakdown.activity}/15</span>
            </div>
            <div className="score-breakdown-item">
              <span>Profile Completeness</span>
              <span>{breakdown.completeness}/15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
