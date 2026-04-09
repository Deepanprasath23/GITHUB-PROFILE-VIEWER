import { generateAIInsights } from '../api';

export default function AIInsights({ profile, repos, events }) {
  const insights = generateAIInsights(profile, repos, events);
  
  if (insights.length === 0) return null;
  
  return (
    <div className="glass-card ai-insights">
      <div className="section-header">
        <h3 className="section-title">
          <span className="icon">🧠</span> AI Insights
        </h3>
      </div>
      
      <div className="insight-list">
        {insights.map((insight, i) => (
          <div className="insight-item" key={i}>
            <span className="insight-icon">{insight.icon}</span>
            <span>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
