import { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { computeLanguageStats, getLanguageColor } from '../api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function LanguageChart({ repos }) {
  const { labels, counts } = useMemo(() => computeLanguageStats(repos), [repos]);
  
  if (labels.length === 0) {
    return (
      <div className="glass-card">
        <div className="section-header">
          <h3 className="section-title">
            <span className="icon">🎨</span> Language Distribution
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
          No language data available
        </p>
      </div>
    );
  }
  
  const colors = labels.map(l => getLanguageColor(l));
  
  const doughnutData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: colors.map(c => c + 'cc'),
      borderColor: colors,
      borderWidth: 2,
      hoverBorderWidth: 3,
      hoverOffset: 8,
    }],
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { family: "'Inter', sans-serif", size: 12 },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { family: "'Inter', sans-serif", weight: '600' },
        bodyFont: { family: "'Inter', sans-serif" },
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.raw / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${ctx.raw} repos (${pct}%)`;
          },
        },
      },
    },
  };
  
  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <span className="icon">🎨</span> Language Distribution
        </h3>
      </div>
      <div className="chart-container" style={{ height: '280px' }}>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}
